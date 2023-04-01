package com.pos.allthat.chain;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;

import dao.chain.FranDAO;
import util.Common;
import vo.CompanyUserVO;
import vo.CompanyVO;
import vo.newvo.CompanyListVO;
import vo.newvo.FranTotalVO;
import vo.newvo.PopUpdateVO;
import vo.newvo.SalesHistVO;
import vo.newvo.SalesTallyVO;

@Controller
public class FranController {

	@Autowired
	HttpServletRequest request;
	
	FranDAO fran_dao;
	
	private static Logger logger = Logger.getLogger(FranController.class);
	
	public static void main (String[] args) {
		logger.debug("debug");
		logger.info("info");
		logger.warn("warn");
		logger.error("error");
		logger.fatal("fatal");
	}

	public FranController(FranDAO fran_dao) {
		this.fran_dao = fran_dao;
		System.out.println("--FranController생성자 호출--");
	}
	
	// 가맹점 관리 페이지로 이동
	@RequestMapping(value = "/franchise.do") 
	public String code(Model model) {
		System.out.println("코드관리 페이지로 이동!");
		model.addAttribute("select", "chain");
		return Common.CHAIN_PATH + "franchise.jsp";
	}
	
	// 가맹점 관리 리스트 조회
	@ResponseBody
	@RequestMapping(value = "/fran_list.do", produces = "application/json; charset=utf8")
	public void fran_list(HttpServletResponse response, @ModelAttribute("CompanyListVO") CompanyListVO vo) {
		System.out.println("가맹점 관리 리스트 조회!");
		
		System.out.println("search1="+vo.getSearch1());
		System.out.println("searchInput="+vo.getSearchInput());
		
		int count = fran_dao.selectOne_count(vo);
		List<CompanyListVO> fran_list = fran_dao.selectList(vo);
		
		try { 
			JSONObject jso = new JSONObject();
			jso.put("count", count);
			jso.put("data", fran_list);
			response.setContentType("text/html;charset=utf-8");
			
			PrintWriter out = response.getWriter();
			out.print(jso.toString());
		} catch (JsonProcessingException e) { 
			e.printStackTrace(); 
		} catch (IOException e) { 
			e.printStackTrace(); 
		}
	}
	
	// 가맹점 관리 집계 조회
	@ResponseBody
	@RequestMapping(value = "/fran_tt.do", produces = "application/json; charset=utf8")
	public Object fran_tt(@RequestParam("chaincode") String chaincode, Model model) {
		System.out.println("가맹점 집계 조회!");
		FranTotalVO vo = fran_dao.selectOne_tt(chaincode);
		model.addAttribute("totcnt1", vo.getTotcnt1());
		
		return vo;		
	}
	
	// 등록 시 사업자번호 중복체크
	@ResponseBody
	@RequestMapping(value = "/corpnum_check.do", produces = "application/json; charset=utf8")
	public int corpnum_check(String corpnum) {
		System.out.println("사업자번호 중복체크");
		int res = fran_dao.corpnum_check(corpnum);
		return res;
	}
	
	// 가맹점 등록하기
	@ResponseBody
	@RequestMapping(value = "/fran_insert.do", produces = "application/json; charset=utf8")
	public Object fran_insert(@ModelAttribute("CompanyVO") CompanyVO vo, @RequestParam("chaincode") String chaincode) {
		System.out.println("가맹점 등록~");
		
		if(vo.getOpendate().equals("")) {vo.setOpendate(null);}
		if(vo.getCanceldate().equals("")) {vo.setCanceldate(null);}
		
		int res = fran_dao.insert(vo, chaincode);
		JSONObject jsonObject = new JSONObject();               

	    jsonObject.put("result", res);
	      
	    return jsonObject.toString();
	}
	
	// 클릭한 tr의 정보 가져오기
	@ResponseBody
	@RequestMapping(value = "/fran_sel.do", produces = "application/json; charset=utf8")
	public Object fran_sel(@RequestParam("compcd") String compcd, @RequestParam("chaincode") String chaincode, Model model) {
		System.out.println("클릭한 tr의 정보 가져오기~");
		
		CompanyVO vo = fran_dao.selectOne_sel(compcd, chaincode);
		model.addAttribute("result", vo);
		
		return vo;
	}
	
	// 사용자 추가의 리스트 가져오기
	@ResponseBody
	@RequestMapping(value = "/ua_list.do", produces = "application/json; charset=utf8")
	public Object ua_list(HttpServletResponse response, @RequestParam("compcd") String compcd) {
		System.out.println("사용자 추가의 리스트!");
		
		List<CompanyUserVO> vo = fran_dao.selectList_ua(compcd);
		JSONObject jsonObject = new JSONObject();               

	    jsonObject.put("data", vo);
	      
	    return jsonObject.toString();
	}
	
	// popup 판매집계
	@ResponseBody
	@RequestMapping(value = "/salesTally.do", produces = "application/json; charset=utf8")
	public Object salesTally(@RequestParam("compcd") String compcd, Model model) {
		System.out.println("popup 판매 집계 중");
		
		SalesTallyVO vo = fran_dao.selectOne_st(compcd);
		model.addAttribute("result", vo);
		
		return vo;
	}
	
	// popup 판매이력
	@ResponseBody
	@RequestMapping(value = "/salesHist.do", produces = "application/json; charset=utf8")
	public Object salesHist(HttpServletResponse response, @ModelAttribute("SalesHistVO") SalesHistVO vo) {
		System.out.println("popup 판매 이력 확인");
		
		List<SalesHistVO> shvo = fran_dao.selectList_sh(vo);
		JSONObject jsonObject = new JSONObject();               

	    jsonObject.put("data", shvo);
	      
	    return jsonObject.toString();
	}
	
	// 사용자 추가 아이디 중복체크
	@ResponseBody
	@RequestMapping(value = "/ua_idcheck.do", produces = "application/json; charset=utf8")
	public String ua_idcheck(@ModelAttribute("PopUpdateVO") PopUpdateVO vo) {
		System.out.println("-----사용자 추가 아이디 중복체크-----");
		int res = fran_dao.selectOne_id(vo);
		JSONObject jsonObject = new JSONObject();
	    jsonObject.put("data", res);
	    return jsonObject.toString();
	}
	
	// popup 상세보기 저장
	@ResponseBody
	@RequestMapping(value = "/detail_sv.do")
	public String detail_sv(@ModelAttribute("PopUpdateVO") PopUpdateVO vo) {
		System.out.println("상세보기 저장");
		
		if(vo.getPop_date1().equals("")) {vo.setPop_date1(null);}
		if(vo.getPop_date3().equals("")) {vo.setPop_date3(null);}
		
		int pvo = fran_dao.update_det(vo);
		
//		String date1="";
//		String date2="";
//		String hp="";
//		String licence="";
		
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
			
//			date1=ua_date1Arr[i];
//			date2=ua_date2Arr[i];
//			hp=ua_hpArr[i];
//			licence=ua_licenceArr[i];
//			
//			if(date1==null) date1="";
//			if(date2==null) date2="";
//			if(hp==null) hp="";
//			if(licence==null) licence="";
			
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
		}
		
		JSONObject jsonObject = new JSONObject();               

	    jsonObject.put("data", pvo);
	      
	    return jsonObject.toString();
	}
}
