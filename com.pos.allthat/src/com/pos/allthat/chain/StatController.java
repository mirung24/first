package com.pos.allthat.chain;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import dao.chain.StatDAO;
import util.Common;

@Controller
public class StatController {

	@Autowired
	HttpServletRequest request;
	
	StatDAO stat_dao;
	
	public StatController(StatDAO stat_dao) {
		this.stat_dao = stat_dao;
		System.out.println("--StatController생성자 호출--");
	}
	
	// 통계현황 페이지로 이동
	@RequestMapping(value = "/statistics.do")
	public String statistics(Model model) {
		System.out.println("-----통계현황 페이지로 이동-----");
		model.addAttribute("select", "chain");
		return Common.CHAIN_PATH + "statistics.jsp";
	}
	
	// 그래프 조회
	@ResponseBody
	@RequestMapping(value = "/stat_graph.do", produces = "application/json; charset=utf8")
	public Object stat_graph(@RequestParam("chaincode") String chaincode) {
		System.out.println("-----통계현황 그래프 조회-----");
		Map<String, Object> list = stat_dao.selectList_grf(chaincode);
		return list;
	}
}
