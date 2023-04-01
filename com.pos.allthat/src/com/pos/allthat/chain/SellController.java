package com.pos.allthat.chain;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
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

import dao.chain.SellDAO;
import util.Common;
import vo.newvo.SellList2VO;
import vo.newvo.SellListVO;

@Controller
public class SellController {

	@Autowired
	HttpServletRequest request;
	
	SellDAO sell_dao;
	
	public SellController(SellDAO sell_dao) {
		this.sell_dao = sell_dao;
		System.out.println("--SellController생성자 호출--");
	}
	
	// 판매내역 페이지로 이동
	@RequestMapping(value = "/sell.do")
	public String sell(Model model) {
		System.out.println("-----판매내역 페이지로 이동-----");
		model.addAttribute("select", "chain");
		return Common.CHAIN_PATH + "sell.jsp";
	}
	
	// 판매내역 리스트 조회/ 판매건수 조회
	@ResponseBody
	@RequestMapping(value = "/sell_list.do", produces = "application/json; charset=utf8")
	public Object sell_list(HttpServletResponse response, @ModelAttribute("SellListVO") SellListVO vo) {
		System.out.println("-----체인본점 판매내역 리스트 조회-----");
		
		System.out.println("카드 개수 : " + vo.getCardcnt());
		String card = vo.getCardArr().replaceAll("\\[", "").replaceAll("\\]", "").replace("\"", "");
		
		String[] cardArr1 = card.split(",");
		vo.setCardArr1(cardArr1);
		
		int count = sell_dao.selectOne_count(vo);
		List<SellListVO> sell_list = sell_dao.selectList(vo);
		
		JSONObject jsonObject = new JSONObject();               

		jsonObject.put("count", count);
		jsonObject.put("data", sell_list);
	      
	    return jsonObject.toString();
	}// 판매내역 리스트 조회/ 판매건수 조회

	// 판매상품 리스트 조회
	@ResponseBody
	@RequestMapping(value = "/sell_list2.do", produces = "application/json; charset=utf8")
	public void sell_list2(HttpServletResponse response, @RequestParam("paymentcd") String paymentcd) {
		System.out.println("-----판매내역 리스트 조회-----");
		
		List<SellList2VO> sell_list2 = sell_dao.selectList2(paymentcd);
	
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
	}

}






























