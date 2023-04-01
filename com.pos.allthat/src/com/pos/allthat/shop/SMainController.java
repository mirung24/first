package com.pos.allthat.shop;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import dao.shop.SMainDAO;
import util.Common;
import vo.newvo.MainGraphVO;
import vo.shopvo.MainChartVO1;
import vo.shopvo.MainChartVO2;
import vo.shopvo.SIncomeDetVO;

@Controller
public class SMainController {
	
	@Autowired
	HttpServletRequest request;
	
	SMainDAO smain_dao;
	
	public SMainController(SMainDAO smain_dao) {
		this.smain_dao = smain_dao;
		System.out.println("--SMainController생성자 호출--");
	}

	// 메인 페이지로 이동
	@RequestMapping(value = "/smain.do") 
	public String smain(Model model, HttpSession session) {
		System.out.println("-----가맹점 메인페이지 이동-----");
		model.addAttribute("select", "shop");
		return Common.SHOP_PATH + "main.jsp";
	}
	
	// 매출집계 불러오기
	@ResponseBody
	@RequestMapping(value = "/smain_info.do", produces = "application/json; charset=utf8")
	public Object smain_info(@RequestParam("compcd") String compcd) {
		System.out.println("-----가맹점 메인페이지 매출집계-----");
		Map<String, Object> shopTot = smain_dao.selectOne_mi(compcd);
		return shopTot;
	}
	
	// 그래프 불러오기
	@ResponseBody
	@RequestMapping(value = "/smain_graph.do", produces = "application/json; charset=utf8")
	public Object smain_graph(@RequestParam("compcd") String compcd) {
		System.out.println("-----가맹점 메인페이지 그래프 가져오기-----");
		List<MainGraphVO> list = smain_dao.selectList_grf(compcd);
		return list;
	}
	
	// 차트 불러오기
	@ResponseBody
	@RequestMapping(value = "/smain_chart.do", produces = "application/json; charset=utf8")
	public Object main_chart(@ModelAttribute("SIncomeDetVO") SIncomeDetVO vo) {
		System.out.println("------가맹점 메인페이지 차트 조회------");
		Map<String, Object> shopChart = smain_dao.selectList_cht(vo);
		
		return shopChart;
	}
	
	// 제외상품 리스트 조회
	@ResponseBody
	@RequestMapping(value = "/smain_regiList.do", produces = "application/json; charset=utf8")
	public Object smain_regiList(@ModelAttribute("SIncomeDetVO") SIncomeDetVO vo) {
		System.out.println("-----제외상품 리스트 조회-----");
		
		List<SIncomeDetVO> regi_list = smain_dao.selectList_regiList(vo);
		
		JSONObject jsonObject = new JSONObject();
		
		jsonObject.put("data", regi_list);
		
		return jsonObject.toString();
	}// 제외상품 리스트 조회
	
	// 선택한 상품 제외
	@ResponseBody
	@RequestMapping(value = "/prod_except.do", produces = "application/json; charset=utf8")
	public void prod_except(@ModelAttribute("SIncomeDetVO") SIncomeDetVO vo) {
		System.out.println("-----선택한 상품 제외-----");
		
		System.out.println("상품아이디 : "+vo.getProductid());
		
		String productid = vo.getProductid().replaceAll("\\[", "").replaceAll("\\]", "").replace("\"", "");
		String[] productidArr = productid.split(",");
		
		for(int i = 0; i < productidArr.length; i++) {
			System.out.println(i+"번째 상품 아이디 : "+productidArr[i]);
			vo.setProductid(productidArr[i]);
			
			int res = smain_dao.except_insert(vo);
		}//for
	}// 선택한 상품 제외
	
	// 제외한 상품 미리보기
	@ResponseBody
	@RequestMapping(value = "/preview_prod.do", produces = "application/json; charset=utf8")
	public Object preview_prod(@ModelAttribute("SIncomeDetVO") SIncomeDetVO vo) {
		System.out.println("-----제외한 상품 미리보기-----");
		
		List<SIncomeDetVO> pre_prod = smain_dao.selectList_preview(vo);
		
		JSONObject jsonObject = new JSONObject();
		
		jsonObject.put("data", pre_prod);
		
		return jsonObject.toString();
	}//제외한 상품 미리보기
	
	// 제외 취소할 상품
	@ResponseBody
	@RequestMapping(value = "/remove_pre.do", produces = "application/json; charset=utf8")
	public void remove_pre(@ModelAttribute("SIncomeDetVO") SIncomeDetVO vo) {
		System.out.println("-----제외 취소할 상품-----");
		
		String productid = vo.getProductid().replaceAll("\\[", "").replaceAll("\\]", "").replace("\"", "");
		String[] productidArr = productid.split(",");
		
		for(int i = 0; i < productidArr.length; i++) {
			vo.setProductid(productidArr[i]);
			int res = smain_dao.except_delete(vo);
		}//for
	}// 제외 취소할 상품
	
	// 가맹점 전체 제외상품 취소
	@ResponseBody
	@RequestMapping(value = "/all_remove.do", produces = "application/json; charset=utf8")
	public int all_remove(@ModelAttribute("SIncomeDetVO") SIncomeDetVO vo) {
		System.out.println("-----가맹점 전체 제외상품 취소-----");
		
		int res = smain_dao.all_remove(vo);
		return res;
	}// 가맹점 전체 제외상품 취소
	
	// bestworst 상품 차트 조회
	@ResponseBody
	@RequestMapping(value = "/smain_bestworst.do", produces = "application/json; charset=utf8")
	public Object smain_bestworst(@ModelAttribute("SIncomeDetVO") SIncomeDetVO vo) {
		System.out.println("-----가맹점 메인화면 : bestworst 상품 차트 조회-----");
		
		List<MainChartVO1> best_prod = smain_dao.best_prod(vo);
		List<MainChartVO2> worst_prod = smain_dao.worst_prod(vo);
		System.out.println("--------------------------------"+vo.getWprodsel());
		
		JSONObject jsonObject = new JSONObject();
		
		jsonObject.put("list1", best_prod);
		jsonObject.put("list2", worst_prod);
		
		return jsonObject.toString();
	}
}
