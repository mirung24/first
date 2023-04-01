package com.pos.allthat.chain;

import java.io.IOException;
import java.io.PrintWriter;
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

import com.fasterxml.jackson.core.JsonProcessingException;

import dao.chain.CodeDAO;
import util.Common;
import vo.CodeVO;

@Controller
public class CodeController {

	@Autowired
	HttpServletRequest request;
	
	CodeDAO code_dao;
	
	public CodeController(CodeDAO code_dao) {
		this.code_dao = code_dao;
		System.out.println("--CodeController생성자 호출--");
	}
	
	// 코드관리 페이지로 이동
	@RequestMapping(value = "/code.do") 
	public String code(Model model) {
		System.out.println("코드관리 페이지로 이동!");
		model.addAttribute("select", "chain");
		return Common.CHAIN_PATH + "code.jsp";
	}
	
	// 코드관리 리스트 조회
	@ResponseBody
	@RequestMapping(value = "/code_list.do", produces = "application/json; charset=utf8")
	public void code_list(HttpServletResponse response, String searchInput) {
		System.out.println("코드관리 리스트 조회!");
		System.out.println(searchInput);
		List<CodeVO> code_list = code_dao.selectList(searchInput);
		try { 
			JSONObject jso = new JSONObject();
			jso.put("data", code_list);
			response.setContentType("text/html;charset=utf-8");
			
			PrintWriter out = response.getWriter();
			out.print(jso.toString());
		} catch (JsonProcessingException e) { 
			e.printStackTrace(); 
		} catch (IOException e) { 
			e.printStackTrace(); 
		}
	}
	
	// 코드관리 > 코드등록
	@ResponseBody
	@RequestMapping(value = "/master_ins.do", produces = "application/json; charset=utf8")
	public String master_ins(@ModelAttribute("CodeVO") CodeVO vo) {
		System.out.println("코드등록!");
		int res = code_dao.insert(vo);
	    JSONObject jsonObject = new JSONObject();               

	    jsonObject.put("result", res);
	      
	    return jsonObject.toString();
	}
	
	// 마스터 코드 수정
	@ResponseBody
	@RequestMapping(value = "/master_edit.do", produces = "application/json; charset=utf8")
	public String master_edit(@ModelAttribute("CodeVO") CodeVO vo) {
		System.out.println("마스터 코드 수정");
		int res = code_dao.master_update(vo);
		
		JSONObject jsonObject = new JSONObject();               

	    jsonObject.put("result", res);
	      
	    return jsonObject.toString();
	}
	
	// 하위 코드 리스트 조회
	@ResponseBody
	@RequestMapping(value = "/low_list.do", produces = "application/json; charset=utf8")
	public String low_list(@RequestParam("code") String code, HttpServletResponse response) {
		System.out.println("하위 코드 리스트 조회");
		
		List<CodeVO> l_list = code_dao.selectList_low(code);
		JSONObject jsonObject = new JSONObject();               

	    jsonObject.put("l_list", l_list);
	      
	    return jsonObject.toString();
	}
	
	// 하위 코드 저장
	@ResponseBody
	@RequestMapping(value = "/low_save.do", produces = "application/json; charset=utf8")
	public String low_save(@ModelAttribute("CodeVO") CodeVO vo) {
		System.out.println("하위 코드 저장");
		
		int res = code_dao.sub_insert(vo);
	    JSONObject jsonObject = new JSONObject();               

	    jsonObject.put("result", res);
	      
	    return jsonObject.toString();
	}
	
	// 하위 코드 수정
	@ResponseBody
	@RequestMapping(value = "/low_modi.do", produces = "application/json; charset=utf8")
	public String low_modi(@ModelAttribute("CodeVO") CodeVO vo) {
		System.out.println("하위 코드 수정");
		
		int res = code_dao.sub_update(vo);
		JSONObject jsonObject = new JSONObject();               

	    jsonObject.put("result", res);
	      
	    return jsonObject.toString();
	}
}
