package com.pos.allthat.shop;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import dao.shop.SSahiDAO;
import util.Common;
import vo.shopvo.SDayStatVO;

@Controller
public class SSahiController {

	@Autowired
	HttpServletRequest request;
	
	SSahiDAO ssahi_dao;
	
	public SSahiController(SSahiDAO ssahi_dao) {
		this.ssahi_dao = ssahi_dao;
		System.out.println("--SSahiController 생성자 호출--");
	}
	
	// 매출내역 페이지로 이동
	@RequestMapping(value = "/ssaleshistory.do")
	public String ssaleshistory(Model model) {
		System.out.println("-----매출내역 페이지로 이동-----");
		model.addAttribute("select", "shop");
		return Common.SHOP_PATH + "saleshistory.jsp";
	}
	
	// 분기별 요일 통계
	@ResponseBody
	@RequestMapping(value = "sdaystat.do", produces = "application/json; charset=utf8")
	public Object sdaystat(@ModelAttribute("SDayStatVO") SDayStatVO vo) {
		System.out.println("-----가맹점 분기별 요일 통계-----");
		
		List<SDayStatVO> list = ssahi_dao.selectList_day(vo);
		
		JSONObject jsonObject = new JSONObject();

		jsonObject.put("data", list);
		
		return jsonObject.toString();
	}// 분기별 요일 통계
	
	// 분기별 시간대 통계
	@ResponseBody
	@RequestMapping(value = "stimestat.do", produces = "application/json; charset=utf8")
	public Object stimestat(@ModelAttribute("SDayStatVO") SDayStatVO vo) {
		System.out.println("-----가맹점 분기별 시간대 통계-----");
		
		List<SDayStatVO> list = ssahi_dao.selectList_time(vo);
		
		JSONObject jsonObject = new JSONObject();

		jsonObject.put("data", list);
		
		return jsonObject.toString();
	}
	
}
