package com.pos.allthat.shop;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.json.simple.JSONArray;
import org.json.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import dao.shop.SIncomeDAO;
import util.Common;
import vo.shopvo.SIncomeDetVO;
import vo.shopvo.SIncomeListVO;
import vo.shopvo.SIncomeTopVO;

@Controller
public class SIncomeController {

	@Autowired
	HttpServletRequest request;
	
	SIncomeDAO sincome_dao;
	
	public SIncomeController(SIncomeDAO sincome_dao) {
		this.sincome_dao = sincome_dao;
		System.out.println("-----SIncomeController생성자 호출-----");
	}
	
	// 입고관리 페이지로 이동
	@RequestMapping(value = "/sincoming.do")
	public String sincome(Model model) {
		System.out.println("-----입고관리 페이지로 이동-----");
		model.addAttribute("select", "shop");
		return Common.SHOP_PATH + "incoming.jsp";
	}// 입고관리 페이지로 이동
	
	// 입고관리 리스트 조회 / 입고건수 조회
	@ResponseBody
	@RequestMapping(value = "/sincome_list.do", produces = "application/json; charset=utf8")
	public Object sincome_list(@ModelAttribute("SIncomeListVO") SIncomeListVO vo) {
		System.out.println("-----가맹점 입고관리 리스트 조회 / 건수 조회-----");
		
		int count = sincome_dao.selectOne_count(vo);
		List<SIncomeListVO> sincome_list = sincome_dao.selectList(vo);
		
		JSONObject jsonObject = new JSONObject();
		
		jsonObject.put("count", count);
		jsonObject.put("data", sincome_list);
		
		return jsonObject.toString();
	}// 입고관리 리스트 조회 / 입고건수 조회
	
	// 상단집계 조회
	@ResponseBody
	@RequestMapping(value = "/sincome_top.do", produces = "application/json; charset=utf8")
	public Object sincome_top(@ModelAttribute("SIncomeTopVO") SIncomeTopVO vo) {
		System.out.println("-----가맹점 입고관리 상단집계 조회-----");
		
		List<SIncomeTopVO> top_list = sincome_dao.selectList_top(vo);
		
		JSONObject jsonObject = new JSONObject();
		
		jsonObject.put("data", top_list);
		
		return jsonObject.toString();
	}// 상단집계 조회
	
	// 상세보기 리스트 조회
	@ResponseBody
	@RequestMapping(value = "/sincome_detail.do", produces = "application/json; charset=utf8")
	public Object sincome_detail(@ModelAttribute("SIncomeDetVO") SIncomeDetVO vo) {
		System.out.println("-----가맹점 입고관리 상세보기 리스트 조회-----");
		
		List<SIncomeDetVO> det_list = sincome_dao.selectList_det(vo);
		
		JSONObject jsonObject = new JSONObject();
		
		jsonObject.put("data", det_list);
		
		return jsonObject.toString();
	}// 상세보기 리스트 조회
	
	// 상품추가 리스트 조회
	@ResponseBody
	@RequestMapping(value = "/sincome_regiList.do", produces = "application/json; charset=utf8")
	public Object sincome_regiList(@ModelAttribute("SIncomeDetVO") SIncomeDetVO vo) {
		System.out.println("-----상품추가 리스트 조회-----");
		
		List<SIncomeDetVO> regi_list = sincome_dao.selectList_regiList(vo);
		
		JSONObject jsonObject = new JSONObject();
		
		jsonObject.put("data", regi_list);
		
		return jsonObject.toString();
	}// 상품추가 리스트 조회
	
	// 입고서 저장하기
    @ResponseBody
    @RequestMapping(value = "/sincome_regi.do", produces = "application/json; charset=utf8")
    public void sincome_regi(@ModelAttribute("SIncomeDetVO") SIncomeDetVO vo){
    	System.out.println("-----가맹점 입고서 저장-----");

    	System.out.println(vo.getRegiArr());
    	System.out.println(vo.getCompcd());
    	System.out.println(vo.getRegcd());
    	System.out.println(vo.getAccount2());
    	System.out.println(vo.getRemarks());
    	
    	int result = sincome_dao.insert(vo);

		return;
    }// 입고서 저장하기
    
    // 입고서 삭제하기
    @ResponseBody
    @RequestMapping(value = "/remove_sincome.do", produces = "application/json; charset=utf8")
    public void remove_sincome(@ModelAttribute("SIncomeDetVO") SIncomeDetVO vo){
    	System.out.println("-----가맹점 입고서 삭제-----");
    	
    	System.out.println("compcd : "+vo.getCompcd());
    	System.out.println("purchasecd : "+vo.getPurchasecd());
    	System.out.println("regcd : "+vo.getRegcd());
    	
    	String count = vo.getCnts().replaceAll("\\[", "").replaceAll("\\]", "").replace("\"", "");
		String[] countArr = count.split(",");
		
		String pack = vo.getPackingunit().replaceAll("\\[", "").replaceAll("\\]", "").replace("\"", "");
		String[] packArr = pack.split(",");
		
		for(int i = 0; i < countArr.length; i++) {
			System.out.println(i+"번째 수량"+countArr[i]);
			System.out.println(i+"번째 포장"+packArr[i]);
			vo.setCnts(countArr[i]);
			vo.setPackingunit(packArr[i]);
			
			int res = sincome_dao.delete(vo);
		}//for
    }// 입고서 삭제하기
	
}


















