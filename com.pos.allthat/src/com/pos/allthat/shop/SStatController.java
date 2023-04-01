package com.pos.allthat.shop;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import dao.shop.SStatDAO;
import util.Common;
import vo.shopvo.SCalenVO;
import vo.shopvo.SDayStatVO;

@Controller
public class SStatController {

	@Autowired
	HttpServletRequest request;
	
	SStatDAO sstat_dao;
	
	public SStatController(SStatDAO sstat_dao) {
		this.sstat_dao = sstat_dao;
		System.out.println("--SStatController 생성자 호출--");
	}
	
	// 통계현황 페이지로 이동
	@RequestMapping(value = "/sstatistics.do")
	public String sstatistics(Model model) {
		System.out.println("-----통계현황 페이지로 이동-----");
		model.addAttribute("select", "shop");
		return Common.SHOP_PATH + "statistics.jsp";
	}
	
	// 그래프 조회
	@ResponseBody
	@RequestMapping(value = "/sstat_graph.do", produces = "application/json; charset=utf8")
	public Object sstat_graph(@ModelAttribute("SCalenVO") SCalenVO vo) {
		System.out.println("-----가맹점 통계현황 그래프 조회-----");
		Map<String, Object> list = sstat_dao.selectList_grp(vo);
		return list;
	}
	
}
