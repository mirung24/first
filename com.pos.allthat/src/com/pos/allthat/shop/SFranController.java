package com.pos.allthat.shop;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import dao.chain.FranDAO;
import util.Common;
import vo.CompanyUserVO;
import vo.CompanyVO;
import vo.newvo.PopUpdateVO;
import vo.newvo.SalesHistVO;
import vo.newvo.SalesTallyVO;

@Controller
public class SFranController {

	@Autowired
	HttpServletRequest request;
	
	FranDAO fran_dao;
	
	public SFranController(FranDAO fran_dao) {
		this.fran_dao = fran_dao;
		System.out.println("--SFranController생성자 호출--");
	}
	
	// 거래처관리 > 가맹점정보 페이지로 이동
	@RequestMapping(value = "/sfranchise.do") 
	public String sfran(Model model) {
		System.out.println("-----가맹점 거래처 관리 > 가맹점 정보 이동-----");
		model.addAttribute("select", "shop");
		return Common.SHOP_PATH + "franchise.jsp";
	}
	
	// 가맹점 정보 조회
	@ResponseBody
	@RequestMapping(value = "/sfran_info.do", produces = "application/json; charset=utf8")
	public Object sfran_info(@RequestParam("compcd") String compcd, @RequestParam("chaincode") String chaincode, Model model) {
		System.out.println("-----가맹점 정보 조회-----");
		CompanyVO vo = fran_dao.selectOne_sel(compcd, chaincode);
		model.addAttribute("result", vo);
		
		return vo;
	}// 가맹점 정보 조회
	
	// 사용자 추가의 리스트 가져오기
	@ResponseBody
	@RequestMapping(value = "/sfran_ua.do", produces = "application/json; charset=utf8")
	public Object sfran_ua(HttpServletResponse response, @RequestParam("compcd") String compcd) {
		System.out.println("-----가맹점 사용자 추가 리스트 조회-----");
		
		List<CompanyUserVO> vo = fran_dao.selectList_ua(compcd);
		JSONObject jsonObject = new JSONObject();               

	    jsonObject.put("data", vo);
	      
	    return jsonObject.toString();
	}
	
	// 가맹점 판매집계 조회
	@ResponseBody
	@RequestMapping(value = "/sfran_tally.do", produces = "application/json; charset=utf8")
	public Object sfran_tally(@RequestParam("compcd") String compcd, Model model) {
		System.out.println("-----가맹점 판매집계 조회-----");
		
		SalesTallyVO vo = fran_dao.selectOne_st(compcd);
		model.addAttribute("result", vo);
		
		return vo;
	}
	
	// 가맹점 판매이력 조회
	@ResponseBody
	@RequestMapping(value = "/sfran_hist.do", produces = "application/json; charset=utf8")
	public Object sfran_hist(HttpServletResponse response, @ModelAttribute("SalesHistVO") SalesHistVO vo) {
		System.out.println("-----가맹점 판매이력 조회-----");
		
		List<SalesHistVO> shvo = fran_dao.selectList_sh(vo);
		JSONObject jsonObject = new JSONObject();               

	    jsonObject.put("data", shvo);
	      
	    return jsonObject.toString();
	}
	
	// 가맹점 상세보기 저장
	@ResponseBody
	@RequestMapping(value = "/shop_detail_sv.do")
	public String detail_sv(@ModelAttribute("PopUpdateVO") PopUpdateVO vo) {
		System.out.println("상세보기 저장");
		
		if(vo.getPop_date1().equals("")) {vo.setPop_date1(null);}
		if(vo.getPop_date3().equals("")) {vo.setPop_date3(null);}
		
		int pvo = fran_dao.update_det(vo);

		String[] ua_date1Arr = vo.getUa_date1().split(",", -1);
		String[] ua_date2Arr = vo.getUa_date2().split(",", -1);
		String[] ua_hpArr = vo.getUa_hp().split(",", -1);
		String[] ua_levelArr = vo.getUa_level().split(",", -1);
		String[] ua_licenceArr = vo.getUa_licence().split(",", -1);
		String[] ua_nameArr = vo.getUa_name().split(",", -1);
		String[] ua_passwdArr = vo.getUa_passwd().split(",", -1);
		String[] ua_useridArr = vo.getUa_userid().split(",", -1);
			
		String dcompcd = vo.getDcompcd();
		String regcd = vo.getRegcd();
			
		for(int i=0; i < ua_useridArr.length;i++) {
			PopUpdateVO ua_list = new PopUpdateVO();
			
			System.out.println("userid="+ua_useridArr[i]);
				
			ua_list.setUa_userid(ua_useridArr[i]);
			ua_list.setUa_passwd(ua_passwdArr[i]);
			ua_list.setUa_name(ua_nameArr[i]);
			ua_list.setUa_level(ua_levelArr[i]);
			ua_list.setUa_hp(ua_hpArr[i]);
			ua_list.setUa_date1(ua_date1Arr[i]);
			ua_list.setUa_date2(ua_date2Arr[i]);
			ua_list.setUa_licence(ua_licenceArr[i]);
			ua_list.setRegcd(regcd);
			ua_list.setDcompcd(dcompcd);
			System.out.println(ua_list);
			
			int ua = fran_dao.insert_ua(ua_list);
			System.out.println("------------------------ua_list : "+ua);
		}
			
		JSONObject jsonObject = new JSONObject();               

	    jsonObject.put("data", pvo);
	      
	    return jsonObject.toString();
	}// 가맹점 상세보기 저장
}


















