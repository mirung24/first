package com.pos.allthat.shop;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.pos.allthat.HttpAPI;

import dao.shop.SSellDAO;
import util.Common;
import vo.ApiVO;
import vo.CompanyUserVO;
import vo.newvo.SellList2VO;
import vo.newvo.SellListVO;

@Controller
public class SSellController {

	@Autowired
	HttpServletRequest request;
	
	SSellDAO ssell_dao;
	
	public SSellController(SSellDAO ssell_dao) {
		this.ssell_dao = ssell_dao;
		System.out.println("-----SSellController생성자 호출-----");
	}
	
	// 판매관리 페이지로 이동
	@RequestMapping(value = "/ssell.do")
	public String ssell(Model model) {
		System.out.println("-----판매관리 페이지로 이동-----");
		model.addAttribute("select", "shop");
		return Common.SHOP_PATH + "sell.jsp";
	}// 판매관리 페이지로 이동
	
	// 판매관리 리스트 조회/ 판매건수 조회
	@ResponseBody
	@RequestMapping(value = "ssell_list.do", produces = "application/json; charset=utf8")
	public Object ssell_list(HttpServletResponse response, @ModelAttribute("SellListVO") SellListVO vo) {
		System.out.println("-----가맹점 판매관리 리스트 조회-----");
	
		System.out.println("카드 개수 : " + vo.getCardcnt());
		String card = vo.getCardArr().replaceAll("\\[", "").replaceAll("\\]", "").replace("\"", "");
		
		String[] cardArr1 = card.split(",");
		vo.setCardArr1(cardArr1);

		List<SellListVO> count = ssell_dao.selectOne_count(vo);
		List<SellListVO> sell_list = ssell_dao.selectList(vo);
		
		JSONObject jsonObject = new JSONObject();               

		jsonObject.put("count", count);
		jsonObject.put("data", sell_list);
	      
	    return jsonObject.toString();
	}// 판매관리 리스트 조회/ 판매건수 조회
	
	// 선택한 상품 정보 리스트 조회
	@ResponseBody
	@RequestMapping(value = "ssell_list2.do", produces = "application/json; charset=utf8")
	public void ssell_list2(HttpServletResponse response, @RequestParam("paymentcd") String paymentcd
			, HttpSession session, SellList2VO vo) {
		System.out.println("-----가맹점 판매관리 선택한 상품 정보 리스트 조회-----");
		
		CompanyUserVO uservo = (CompanyUserVO) session.getAttribute("uservo");
		System.out.println("compcd: "+uservo.getCompcd());
		String compcd = uservo.getCompcd();
		
		vo.setCompcd(compcd);
		vo.setPaymentcd(paymentcd);
		List<SellList2VO> sell_list2 = ssell_dao.selectList2(vo);
		
		try { 
			JSONObject jso = new JSONObject();
			jso.put("data", sell_list2);
			response.setContentType("text/html;charset=utf-8");
			
			PrintWriter out = response.getWriter();
			out.print(jso.toString());
		} catch (JsonProcessingException e) { 
			e.printStackTrace(); 
		} catch (IOException e) { 
			e.printStackTrace(); 
		}
	}// 선택한 상품 정보 리스트 조회
	
}

