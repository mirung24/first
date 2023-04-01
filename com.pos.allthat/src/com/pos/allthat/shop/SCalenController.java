package com.pos.allthat.shop;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import dao.shop.SCalenDAO;
import util.Common;
import vo.shopvo.SCalenVO;

@Controller
public class SCalenController {

	@Autowired
	HttpServletRequest request;
	
	SCalenDAO scalen_dao;
	
	public SCalenController(SCalenDAO scalen_dao) {
		this.scalen_dao = scalen_dao;
		System.out.println("--SCalenController 생성자 호출--");
	}
	
	// 매출캘린더 페이지로 이동
	@RequestMapping(value = "/scalendar.do")
	public String scalendar(Model model) {
		System.out.println("-----매출캘린더 페이지로 이동-----");
		model.addAttribute("select", "shop");
		return Common.SHOP_PATH + "calendar.jsp";
	}
	
	// 매출내역 가져오기
	@ResponseBody
	@RequestMapping(value = "scalendar_list.do", produces = "application/json; charset=utf8")
	public Object scalendar_list(@ModelAttribute("SCalenVO") SCalenVO vo) {
		System.out.println("-----가맹점 매출캘린더 매출내역 리스트 조회-----");
		
		List<SCalenVO> list = scalen_dao.selectList(vo);
		
		JSONObject jsonObject = new JSONObject();               

	    jsonObject.put("data", list);
	      
	    return jsonObject.toString();
	}// 매출내역 가져오기
	
	// 월, 전월, 전전월 정보 조회
	@ResponseBody
	@RequestMapping(value = "scalendar_info.do", produces = "application/json; charset=utf8")
	public Object scalendar_info(@ModelAttribute("SCalenVO") SCalenVO vo) {
		System.out.println("-----가맹점 매출캘린더 하단 정보 조회-----");
		
		List<SCalenVO> info = scalen_dao.selectList_info(vo);
		
		JSONObject jsonObject = new JSONObject();               

	    jsonObject.put("data", info);
	      
	    return jsonObject.toString();
	}// 월, 전월, 전전월 정보 조회
	
	
}
