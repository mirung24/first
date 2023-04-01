package com.pos.allthat.shop;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import dao.shop.SPackDAO;
import util.Common;
import vo.shopvo.SProdListVO;

@Controller
public class SPackController {

	@Autowired
	HttpServletRequest request;
	
	SPackDAO spack_dao;
	
	public SPackController(SPackDAO spack_dao) {
		this.spack_dao = spack_dao;
		System.out.println("-----SPackController생성자 호출-----");
	}
	
	// 상품포장관리 페이지로 이동
	@RequestMapping(value = "/spack.do")
	public String spack(Model model) {
		System.out.println("-----상품포장관리 페이지로 이동-----");
		model.addAttribute("select", "shop");
		return Common.SHOP_PATH + "pack.jsp";
	}
	
	// 상품포장관리 리스트 조회 / 조회 건수
	@ResponseBody
	@RequestMapping(value = "/spack_list.do", produces = "application/json; charset=utf8")
	public Object spack_list(HttpServletResponse response, @ModelAttribute("SProdListVO") SProdListVO vo) {
		System.out.println("-----가맹점 상품포장관리 리스트 조회-----");
		
		int count = spack_dao.selectOne_count(vo);
		List<SProdListVO> pack_list = spack_dao.selectList(vo);
		
		JSONObject jsonObject = new JSONObject();               

		jsonObject.put("count", count);
		jsonObject.put("data", pack_list);
	      
	    return jsonObject.toString();
	}// 상품포장관리 리스트 조회 / 조회 건수
	
	// 그룹상품 추가 리스트
	@ResponseBody
	@RequestMapping(value = "/sga_list2.do", produces = "application/json; charset=utf8")
	public Object sga_list2(@ModelAttribute("SProdListVO") SProdListVO vo) {
		System.out.println("-----가맹점 상품포장관리 그룹상품 리스트-----");
		List<SProdListVO> ga_list = spack_dao.selectList_ga2(vo);
//		List<SProdListVO> ga_price = spack_dao.selectList_price(vo);
		
		JSONObject jsonObject = new JSONObject();               
	    jsonObject.put("data", ga_list);
      
	    return jsonObject.toString();
	}// 그룹상품 추가 리스트
	
	// 그룹상품 최다, 최소, 최고
	@ResponseBody
	@RequestMapping(value = "/sgaPrice.do", produces = "application/json; charset=utf8")
	public Object sgaPrice(@ModelAttribute("SProdListVO") SProdListVO vo) {
		System.out.println("-----가맹점 그룹상품 최다, 최소, 최고-----");
		
		List<SProdListVO> ga_price = spack_dao.selectList_price(vo);
		
		JSONObject jsonObject = new JSONObject();               
	    jsonObject.put("data", ga_price);
      
	    return jsonObject.toString();
	}
}


















