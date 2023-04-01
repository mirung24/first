package com.pos.allthat.chain;

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

import dao.chain.CateDAO;
import util.Common;
import vo.newvo.CateVO;

@Controller
public class CateController {

	@Autowired
	HttpServletRequest request;
	
	CateDAO cate_dao;
	
	public CateController(CateDAO cate_dao) {
		this.cate_dao = cate_dao;
		System.out.println("--CateController 생성자 호출--");
	}
	
	// 카테고리관리 페이지로 이동
	@RequestMapping(value = "/category.do")
	public String category(Model model) {
		System.out.println("-----카테고리관리 페이지로 이동-----");
		model.addAttribute("select", "chain");
		return Common.CHAIN_PATH + "category.jsp";
	}

	// 만들어진 카테고리가 있는지 확인
	@ResponseBody
	@RequestMapping(value = "/cate_check.do", produces = "application/json; charset=utf8")
	public Object cate_check(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----체인점 카테고리: 만들어진 카테고리가 있는지 확인-----");
		int res = cate_dao.cateCheck(vo);
		return res;
	}// 만들어진 카테고리가 있는지 확인
	
	// 카테고리1 리스트 뿌리깅
	@ResponseBody
	@RequestMapping(value = "/cate1_list.do", produces = "application/json; charset=utf8")
	public Object cate1_list(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----체인점 카테고리 : 카테고리 1 리스트 가져오기-----");
		List<CateVO> list = cate_dao.cate1List(vo);
		JSONObject jsonObject = new JSONObject();              
		jsonObject.put("data", list);
	    return jsonObject.toString();
	}// 카테고리1 리스트 뿌리깅
	
	// 카테고리2 리스트 뿌리깅
	@ResponseBody
	@RequestMapping(value = "/cate2_list.do", produces = "application/json; charset=utf8")
	public Object cate2_list(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----체인점 카테고리: 카테고리 2 리스트 가져오기-----");
		List<CateVO> list = cate_dao.cate2List(vo);
		JSONObject jsonObject = new JSONObject();               
		jsonObject.put("data", list);
	    return jsonObject.toString();
	}// 카테고리2 리스트 뿌리깅
	
	// 카테고리3 리스트 뿌리깅
	@ResponseBody
	@RequestMapping(value = "/cate3_list.do", produces = "application/json; charset=utf8")
	public Object cate3_list(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----체인점 카테고리: 카테고리 3 리스트 가져오기-----");
		List<CateVO> list = cate_dao.cate3List(vo);
		JSONObject jsonObject = new JSONObject();               
		jsonObject.put("data", list);
	    return jsonObject.toString();
	}// 카테고리3 리스트 뿌리깅
	
	// 1차 카테고리 사용유무 변경
	@ResponseBody
	@RequestMapping(value = "/cate1_useyn.do", produces = "application/json; charset=utf8")
	public void cate1_useyn(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----체인점 카테고리: 카테고리 1 사용유무 변경하기 -----");
		cate_dao.cate1Useyn(vo);
	}
	
	// 2차 카테고리 사용유무 변경
	@ResponseBody
	@RequestMapping(value = "/cate2_useyn.do", produces = "application/json; charset=utf8")
	public void cate2_useyn(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----체인점 카테고리: 카테고리 2 사용유무 변경하기 -----");
		cate_dao.cate2Useyn(vo);
	}
	
	// 3차 카테고리 사용유무 변경
	@ResponseBody
	@RequestMapping(value = "/cate3_useyn.do", produces = "application/json; charset=utf8")
	public void cate3_useyn(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----체인점 카테고리: 카테고리 3 사용유무 변경하기 -----");
		cate_dao.cate3Useyn(vo);
	}
	
	// 1차 카테고리 추가
	@ResponseBody
	@RequestMapping(value = "/cate1_add.do", produces = "application/json; charset=utf8")
	public String cate1_add(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----체인점 카테고리: 카테고리 1  추가하기 -----");
		String result = cate_dao.cate1Add(vo);
		JSONObject jsonObject = new JSONObject();               
		jsonObject.put("data", result);
	    return jsonObject.toString();
	}
	
	// 2차 카테고리 추가
	@ResponseBody
	@RequestMapping(value = "/cate2_add.do", produces = "application/json; charset=utf8")
	public String cate2_add(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----체인점 카테고리: 카테고리 2  추가하기 -----");
		String result = cate_dao.cate2Add(vo);
		JSONObject jsonObject = new JSONObject();               
		jsonObject.put("data", result);
	    return jsonObject.toString();
	}
	
	// 3차 카테고리 추가
	@ResponseBody
	@RequestMapping(value = "/cate3_add.do", produces = "application/json; charset=utf8")
	public String cate3_add(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----체인점 카테고리: 카테고리 3  추가하기 -----");
		String result = cate_dao.cate3Add(vo);
		JSONObject jsonObject = new JSONObject();               
		jsonObject.put("data", result);
	    return jsonObject.toString();
	}
	
	// 1차 카테고리 수정
	@ResponseBody
	@RequestMapping(value = "/cate1_modi.do", produces = "application/json; charset=utf8")
	public void cate1_modi(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----체인점 카테고리: 카테고리 1  수정하기 -----");
		cate_dao.cate1Modi(vo);
	}
	
	// 2차 카테고리 수정
	@ResponseBody
	@RequestMapping(value = "/cate2_modi.do", produces = "application/json; charset=utf8")
	public void cate2_modi(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----체인점 카테고리: 카테고리 2  수정하기 -----");
		cate_dao.cate2Modi(vo);
	}
	
	// 3차 카테고리 수정
	@ResponseBody
	@RequestMapping(value = "/cate3_modi.do", produces = "application/json; charset=utf8")
	public void cate3_modi(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----체인점 카테고리: 카테고리 3  수정하기 -----");
		cate_dao.cate3Modi(vo);
	}
	
	// 1차 카테고리 순서 변경
	@ResponseBody
	@RequestMapping(value = "/cate1_numC.do", produces = "application/json; charset=utf8")
	public void cate1_numC(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----체인점 카테고리: 카테고리 1 순서 변경하기 -----");
		JSONParser jsonParser = new JSONParser(); 
    	JSONArray insertParam = null;
    	
    	try {insertParam = (JSONArray) jsonParser.parse(vo.getScncd());} 
    	catch (ParseException e) {e.printStackTrace();}
    	
    	for(int i = 0; i < insertParam.size(); i++) {
    		org.json.simple.JSONObject data = (org.json.simple.JSONObject) insertParam.get(i);
    	    CateVO cvo = new CateVO();
    	    
    	    cvo.setCcategory1cd(data.get("category1cd"));
    	    cvo.setCordernum(data.get("ordernum"));
    	    cvo.setChaincode(vo.getChaincode());

    	    cate_dao.cate1_numC(cvo);
    	}//for
	}// 1차 카테고리 순서 변경
	
	// 2차 카테고리 순서 변경
	@ResponseBody
	@RequestMapping(value = "/cate2_numC.do", produces = "application/json; charset=utf8")
	public void cate2_numC(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----체인점 카테고리: 카테고리 2 순서 변경하기 -----");
		JSONParser jsonParser = new JSONParser(); 
    	JSONArray insertParam = null;
    	
    	try {insertParam = (JSONArray) jsonParser.parse(vo.getScncd());} 
    	catch (ParseException e) {e.printStackTrace();}
    	
    	for(int i = 0; i < insertParam.size(); i++) {
    		org.json.simple.JSONObject data = (org.json.simple.JSONObject) insertParam.get(i);
    	    CateVO cvo = new CateVO();
    	    
    	    cvo.setCcategory2cd(data.get("category2cd"));
    	    cvo.setCordernum(data.get("ordernum"));
    	    cvo.setChaincode(vo.getChaincode());

    	    cate_dao.cate2_numC(cvo);
    	}//for
	}// 2차 카테고리 순서 변경
	
	// 3차 카테고리 순서 변경
	@ResponseBody
	@RequestMapping(value = "/cate3_numC.do", produces = "application/json; charset=utf8")
	public void cate3_numC(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----체인점 카테고리: 카테고리 3 순서 변경하기 -----");
		JSONParser jsonParser = new JSONParser(); 
    	JSONArray insertParam = null;
    	
    	try {insertParam = (JSONArray) jsonParser.parse(vo.getScncd());} 
    	catch (ParseException e) {e.printStackTrace();}
    	
    	for(int i = 0; i < insertParam.size(); i++) {
    		org.json.simple.JSONObject data = (org.json.simple.JSONObject) insertParam.get(i);
    	    CateVO cvo = new CateVO();
    	    
    	    cvo.setCcategory3cd(data.get("category3cd"));
    	    cvo.setCordernum(data.get("ordernum"));
    	    cvo.setChaincode(vo.getChaincode());

    	    cate_dao.cate3_numC(cvo);
    	}//for
	}// 3차 카테고리 순서 변경
	
	// 올댓페이 1차 카테고리 리스트
	@ResponseBody
	@RequestMapping(value = "/at_cate1.do", produces = "application/json; charset=utf8")
	public Object at_cate1(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----체인점 카테고리 : 올댓페이 1차 카테고리 리스트-----");
		List<CateVO> list = cate_dao.at_cate1(vo);
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("data", list);
	    return jsonObject.toString();
	}// 올댓페이 1차 카테고리 리스트
	
	// 올댓페이 2차 카테고리 리스트
	@ResponseBody
	@RequestMapping(value = "/at_cate2.do", produces = "application/json; charset=utf8")
	public Object at_cate2(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----체인점 카테고리 : 올댓페이 2차 카테고리 리스트-----");
		List<CateVO> list = cate_dao.at_cate2(vo);
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("data", list);
	    return jsonObject.toString();
	}// 올댓페이 2차 카테고리 리스트
	
	// 올댓페이 3차 카테고리 리스트
	@ResponseBody
	@RequestMapping(value = "/at_cate3.do", produces = "application/json; charset=utf8")
	public Object at_cate3(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----체인점 카테고리 : 올댓페이 3차 카테고리 리스트-----");
		List<CateVO> list = cate_dao.at_cate3(vo);
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("data", list);
	    return jsonObject.toString();
	}// 올댓페이 3차 카테고리 리스트
	
	// 올댓페이 카테고리 사용하기 선택
	@ResponseBody
	@RequestMapping(value = "/atcate_use.do", produces = "application/json; charset=utf8")
	public void atcate_use(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----체인점 카테고리 : 올댓페이 카테고리 사용하기 선택-----");
		cate_dao.atcate_use(vo);
	}
	
}
