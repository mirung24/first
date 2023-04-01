package com.pos.allthat.shop;

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

import dao.shop.SClientDAO;
import util.Common;
import vo.shopvo.AccountVO;

@Controller
public class SClientController {

	@Autowired
	HttpServletRequest request;
	
	SClientDAO sclient_dao;
	
	public SClientController(SClientDAO sclient_dao) {
		this.sclient_dao = sclient_dao;
		System.out.println("-----SClientController생성자 호출-----");
	}
	
	// 거래처관리 페이지로 이동
	@RequestMapping(value = "sclient.do")
	public String sclient(Model model) {
		System.out.println("-----거래처관리 페이지로 이동-----");
		model.addAttribute("select", "shop");
		return Common.SHOP_PATH + "client.jsp";
	}// 거래처관리 페이지로 이동
	
	// 거래처관리 리스트 조회
	@ResponseBody
	@RequestMapping(value = "/sclient_list.do", produces = "application/json; charset=utf8")
	public void sclient_list(HttpServletResponse response, @ModelAttribute("AccountVO") AccountVO vo) {
		System.out.println("-----거래처관리 리스트 조회-----");
		
		List<AccountVO> list = sclient_dao.selectList(vo);
		
		try { 
			JSONObject jso = new JSONObject();
			jso.put("data", list);
			response.setContentType("text/html;charset=utf-8");
			
			PrintWriter out = response.getWriter();
			out.print(jso.toString());
		} catch (JsonProcessingException e) { 
			e.printStackTrace(); 
		} catch (IOException e) { 
			e.printStackTrace(); 
		}
	}// 거래처관리 리스트 조회
	
	// tr클릭 상세보기
	@ResponseBody
	@RequestMapping(value = "/cli_sel.do", produces = "application/json; charset=utf8")
	public Object cli_sel(@RequestParam("accountcd") String accountcd) {
		System.out.println("-----tr클릭 상세보기-----");
		AccountVO vo = sclient_dao.selectOne_tr(accountcd);
		return vo;
	}// tr클릭 상세보기
	
	// 거래처 등록
	@ResponseBody
	@RequestMapping(value = "/sclient_regi.do", produces = "application/json; charset=utf8")
	public Object sclient_regi(@ModelAttribute("AccountVO") AccountVO vo) {
		System.out.println("-----거래처 등록-----");
		int res = sclient_dao.insert(vo);
		return res;
	}// 거래처 등록
	
	// 상세보기 수정
	@ResponseBody
	@RequestMapping(value = "/sclient_edit.do", produces = "application/json; charset=utf8")
	public Object sclient_edit(@ModelAttribute("AccountVO") AccountVO vo) {
		System.out.println("-----상세보기 저장-----");
		int res = sclient_dao.update(vo);
		return res;
	}
	
}


















