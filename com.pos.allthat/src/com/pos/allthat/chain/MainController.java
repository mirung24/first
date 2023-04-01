package com.pos.allthat.chain;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import dao.chain.MainDAO;
import util.Common;
import vo.newvo.MainChartVO1;
import vo.newvo.MainGraphVO;
import vo.newvo.MainInfoVO;

@Controller
public class MainController {
	
	@Autowired
	HttpServletRequest request;
	
	MainDAO main_dao;
	
	public MainController(MainDAO main_dao) {
		this.main_dao = main_dao;
		System.out.println("--MainController생성자 호출--");
	}
	
	// 메인 페이지로 이동
	@RequestMapping(value = "/main.do") 
	public String main(Model model) {
		System.out.println("메인 페이지로 이동!");
		model.addAttribute("select", "chain");
		return Common.CHAIN_PATH + "main.jsp";
	}
	
	// 상단집계
	@ResponseBody
	@RequestMapping(value = "/chain/topstat.do", produces = "application/json; charset=utf8")
	public Object topstat(@RequestParam("chaincode") String chaincode) {
		Map<String, Object> readMap = main_dao.topstat(chaincode);
		return readMap;
	}
	
	// 타임라인(주간)
	@ResponseBody
	@RequestMapping(value = "/chain/weektl.do", produces = "application/json; charset=utf8")
	public Object weektl(@RequestParam("chaincode") String chaincode) {
		List<MainInfoVO> list = main_dao.weektl(chaincode);
		return list;
	}
	
	// 타임라인(월간)
	@ResponseBody
	@RequestMapping(value = "/chain/monthtl.do", produces = "application/json; charset=utf8")
	public Object monthtl(@RequestParam("chaincode") String chaincode) {
		List<MainInfoVO> list = main_dao.monthtl(chaincode);
		return list;
	}
	
	// 주간 가맹점 순위
	@ResponseBody
	@RequestMapping(value = "/chain/comprank.do", produces = "application/json; charset=utf8")
	public Object comprank(@ModelAttribute("MainGraphVO") MainGraphVO vo) {
		List<MainGraphVO> list = main_dao.comprank(vo);
		return list;
	}
	
		
		
		
		
		
	
	
	// 그래프 조회
	@ResponseBody
	@RequestMapping(value = "/main_graph.do", produces = "application/json; charset=utf8")
	public Object main_graph(@RequestParam("chaincode") String chaincode) {
		System.out.println("------그래프 조회하기------");
		List<MainGraphVO> list = main_dao.selectList_grf(chaincode);
		
		return list;
	}
	
	// 주간 best 가맹점 조회
	@ResponseBody
	@RequestMapping(value = "/main_chart.do", produces = "application/json; charset=utf8")
	public Object main_chart(@RequestParam("chaincode") String chaincode) {
		System.out.println("------메인페이지 차트 조회------");
		Map<String, Object> readMap = main_dao.selectList_cht(chaincode);
		
		return readMap;
	}
}




























