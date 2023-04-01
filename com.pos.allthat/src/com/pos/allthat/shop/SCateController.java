package com.pos.allthat.shop;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONObject;
import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import dao.shop.SCateDAO;
import util.Common;
import vo.newvo.CateVO;

@Controller
public class SCateController {

	@Autowired
	HttpServletRequest request;
	
	SCateDAO scate_dao;
	
	public SCateController(SCateDAO scate_dao) {
		this.scate_dao = scate_dao;
		System.out.println("--SCateController 생성자 호출--");
	}
	
	// 카테고리관리 페이지로 이동
	@RequestMapping(value = "/scategory.do")
	public String scategory(Model model) {
		System.out.println("-----카테고리관리 페이지로 이동-----");
		model.addAttribute("select", "shop");
		return Common.SHOP_PATH + "category.jsp";
	}
	
	// 만들어진 카테고리가 있는지 확인
	@ResponseBody
	@RequestMapping(value = "/scate_check.do", produces = "application/json; charset=utf8")
	public Object scate_check(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----가맹점 카테고리: 만들어진 카테고리가 있는지 확인-----");
		int res = scate_dao.scateCheck(vo);
		return res;
	}
	
	// 카테고리1 리스트 뿌리깅
	@ResponseBody
	@RequestMapping(value = "/scate1_list.do", produces = "application/json; charset=utf8")
	public Object scate1_list(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----가맹점 카테고리: 카테고리 1 리스트 가져오기-----");
		List<CateVO> list = scate_dao.scate1List(vo);
		JSONObject jsonObject = new JSONObject();              
		jsonObject.put("data", list);
	    return jsonObject.toString();
	}
	
	// 카테고리2 리스트 뿌리깅
	@ResponseBody
	@RequestMapping(value = "/scate2_list.do", produces = "application/json; charset=utf8")
	public Object scate2_list(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----가맹점 카테고리: 카테고리 2 리스트 가져오기-----");
		List<CateVO> list = scate_dao.scate2List(vo);
		JSONObject jsonObject = new JSONObject();               
		jsonObject.put("data", list);
	    return jsonObject.toString();
	}// 카테고리2 리스트 뿌리깅
	
	// 카테고리3 리스트 뿌리깅
	@ResponseBody
	@RequestMapping(value = "/scate3_list.do", produces = "application/json; charset=utf8")
	public Object scate3_list(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----가맹점 카테고리: 카테고리 3 리스트 가져오기-----");
		List<CateVO> list = scate_dao.scate3List(vo);
		JSONObject jsonObject = new JSONObject();               
		jsonObject.put("data", list);
	    return jsonObject.toString();
	}// 카테고리3 리스트 뿌리깅
	
	// 1차 카테고리 사용유무 변경
	@ResponseBody
	@RequestMapping(value = "/scate1_useyn.do", produces = "application/json; charset=utf8")
	public void scate1_useyn(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----가맹점 카테고리: 카테고리 1 사용유무 변경하기 -----");
		scate_dao.scate1Useyn(vo);
	}
	
	// 2차 카테고리 사용유무 변경
	@ResponseBody
	@RequestMapping(value = "/scate2_useyn.do", produces = "application/json; charset=utf8")
	public void scate2_useyn(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----가맹점 카테고리: 카테고리 2 사용유무 변경하기 -----");
		scate_dao.scate2Useyn(vo);
	}
	
	// 3차 카테고리 사용유무 변경
	@ResponseBody
	@RequestMapping(value = "/scate3_useyn.do", produces = "application/json; charset=utf8")
	public void scate3_useyn(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----가맹점 카테고리: 카테고리 3 사용유무 변경하기 -----");
		scate_dao.scate3Useyn(vo);
	}
	
	// 1차 카테고리 추가
	@ResponseBody
	@RequestMapping(value = "/scate1_add.do", produces = "application/json; charset=utf8")
	public String scate1_add(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----가맹점 카테고리: 카테고리 1 추가하기-----");
		String result = scate_dao.scate1Add(vo);
		JSONObject jsonObject = new JSONObject();               
		jsonObject.put("data", result);
	    return jsonObject.toString();
	}
	
	// 2차 카테고리 추가
	@ResponseBody
	@RequestMapping(value = "/scate2_add.do", produces = "application/json; charset=utf8")
	public String scate2_add(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----가맹점 카테고리: 카테고리 2 추가하기-----");
		String result = scate_dao.scate2Add(vo);
		JSONObject jsonObject = new JSONObject();               
		jsonObject.put("data", result);
	    return jsonObject.toString();
	}
	
	// 3차 카테고리 추가
	@ResponseBody
	@RequestMapping(value = "/scate3_add.do", produces = "application/json; charset=utf8")
	public String scate3_add(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----가맹점 카테고리: 카테고리 3 추가하기-----");
		String result = scate_dao.scate3Add(vo);
		JSONObject jsonObject = new JSONObject();               
		jsonObject.put("data", result);
	    return jsonObject.toString();
	}

	// 1차 카테고리 수정
	@ResponseBody
	@RequestMapping(value = "/scate1_modi.do", produces = "application/json; charset=utf8")
	public void scate1_modi(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----가맹점 카테고리: 카테고리 1  수정하기 -----");
		scate_dao.scate1Modi(vo);
	}
	
	// 2차 카테고리 수정
	@ResponseBody
	@RequestMapping(value = "/scate2_modi.do", produces = "application/json; charset=utf8")
	public void scate2_modi(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----가맹점 카테고리: 카테고리 2 수정하기-----");
		scate_dao.scate2Modi(vo);
	}
	
	// 3차 카테고리 수정
	@ResponseBody
	@RequestMapping(value = "/scate3_modi.do", produces = "application/json; charset=utf8")
	public void scate3_modi(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----가맹점 카테고리: 카테고리 3  수정하기 -----");
		scate_dao.scate3Modi(vo);
	}
	
	// 1차 카테고리 순서변경
	@ResponseBody
	@RequestMapping(value = "/scate1_numC.do", produces = "application/json; charset=utf8")
	public void scate1_numC(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----가맹점 카테고리: 카테고리 1 순서 변경하기 -----");
		JSONParser jsonParser = new JSONParser(); 
    	JSONArray insertParam = null;
    	
    	try {insertParam = (JSONArray) jsonParser.parse(vo.getScncd());} 
    	catch (ParseException e) {e.printStackTrace();}
    	
    	for(int i = 0; i < insertParam.size(); i++) {
    		org.json.simple.JSONObject data = (org.json.simple.JSONObject) insertParam.get(i);
    	    CateVO cvo = new CateVO();
    	    
    	    cvo.setCcategory1cd(data.get("category1cd"));
    	    cvo.setCordernum(data.get("ordernum"));
    	    cvo.setCompcd(vo.getCompcd());

    	    scate_dao.scate1_numC(cvo);
    	}//for
	}// 1차 카테고리 순서변경
	
	// 2차 카테고리 순서변경
	@ResponseBody
	@RequestMapping(value = "/scate2_numC.do", produces = "application/json; charset=utf8")
	public void scate2_numC(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----가맹점 카테고리: 카테고리 2 순서 변경하기 -----");
		JSONParser jsonParser = new JSONParser(); 
    	JSONArray insertParam = null;
    	
    	try {insertParam = (JSONArray) jsonParser.parse(vo.getScncd());} 
    	catch (ParseException e) {e.printStackTrace();}
    	
    	for(int i = 0; i < insertParam.size(); i++) {
    		org.json.simple.JSONObject data = (org.json.simple.JSONObject) insertParam.get(i);
    	    CateVO cvo = new CateVO();
    	    
    	    cvo.setCcategory2cd(data.get("category2cd"));
    	    cvo.setCordernum(data.get("ordernum"));
    	    cvo.setCompcd(vo.getCompcd());

    	    scate_dao.scate2_numC(cvo);
    	}//for
	}// 2차 카테고리 순서 변경
	
	// 3차 카테고리 순서 변경
	@ResponseBody
	@RequestMapping(value = "/scate3_numC.do", produces = "application/json; charset=utf8")
	public void cate3_numC(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----가맹점 카테고리: 카테고리 3 순서 변경하기 -----");
		JSONParser jsonParser = new JSONParser(); 
    	JSONArray insertParam = null;
    	
    	try {insertParam = (JSONArray) jsonParser.parse(vo.getScncd());} 
    	catch (ParseException e) {e.printStackTrace();}
    	
    	for(int i = 0; i < insertParam.size(); i++) {
    		org.json.simple.JSONObject data = (org.json.simple.JSONObject) insertParam.get(i);
    	    CateVO cvo = new CateVO();
    	    
    	    cvo.setCcategory3cd(data.get("category3cd"));
    	    cvo.setCordernum(data.get("ordernum"));
    	    cvo.setCompcd(vo.getCompcd());

    	    scate_dao.scate3_numC(cvo);
    	}//for
	}// 3차 카테고리 순서 변경
	
	// 체인본점 카테고리 사용하기 선택
	@ResponseBody
	@RequestMapping(value = "/chaincate_use.do", produces = "application/json; charset=utf8")
	public void chaincate_use(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----가맹점 카테고리: 체인본점 카테고리 사용하기-----");
		scate_dao.chaincate_use(vo);
	}// 체인본점 카테고리 사용하기 선택
	
	// 올댓 카테고리 사용하기 선택
	@ResponseBody
	@RequestMapping(value = "/atscate_use.do", produces = "application/json; charset=utf8")
	public void atscate_use(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----가맹점 카테고리: 올댓 카테고리 사용하기-----");
		scate_dao.atscate_use(vo);
	}
}









