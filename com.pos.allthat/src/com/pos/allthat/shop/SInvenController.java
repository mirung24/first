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

import dao.shop.SInvenDAO;
import util.Common;
import vo.shopvo.SInvenListVO;
import vo.shopvo.SInvenSelVO;

@Controller
public class SInvenController {

	@Autowired
	HttpServletRequest request;
	
	SInvenDAO sinven_dao;
	
	public SInvenController(SInvenDAO sinven_dao) {
		this.sinven_dao = sinven_dao;
		System.out.println("-----SInvenController생성자 호출-----");
	}
	
	// 재고관리 페이지로 이동
	@RequestMapping(value = "/sinventory.do")
	public String sinventory(Model model) {
		System.out.println("-----재고관리 페이지로 이동-----");
		model.addAttribute("select", "shop");
		return Common.SHOP_PATH + "inventory.jsp";
	}// 재고관리 페이지로 이동
	
	// 재고 리스트 조회/ 재고건수 조회
	@ResponseBody
	@RequestMapping(value = "/sinven_list.do", produces = "application/json; charset=utf8")
	public Object sinven_list(@ModelAttribute("SInvenListVO") SInvenListVO vo) {
		System.out.println("----- 가맹점 재고관리 리스트 조회-----");

		int count = sinven_dao.selectOne_count(vo);
		List<SInvenListVO> inven_list = sinven_dao.selectList(vo);
		
		JSONObject jsonObject = new JSONObject();               

		jsonObject.put("count", count);
		jsonObject.put("data", inven_list);
	      
	    return jsonObject.toString();
	}// 재고 리스트 조회/ 재고건수 조회
	
	// tr 클릭 이벤트 상세보기
	@ResponseBody
	@RequestMapping(value = "/sinven_sel.do", produces = "application/json; charset=utf8")
	public Object sinven_sel(@ModelAttribute("SInvenSelVO") SInvenSelVO vo) {
		System.out.println("-----가맹점 재고관리 상세보기-----");
		
		List<SInvenSelVO> inven_sel = sinven_dao.selectList_sel(vo);
		
		JSONObject jsonObject = new JSONObject();               
		jsonObject.put("data", inven_sel);
	      
	    return jsonObject.toString();
	}// tr 클릭 이벤트 상세보기
	
	// 변경된 재고 저장하기
	@ResponseBody
	@RequestMapping(value = "/sinven_updStock.do", produces = "application/json; charset=utf8")
	public void sinven_updStock(@ModelAttribute("SInvenListVO") SInvenListVO vo) {
		System.out.println("-----가맹점 재고관리 재고 저장-----");
		
		System.out.println(vo.getStockArr());
		System.out.println(vo.getCompcd());
		
		int result = sinven_dao.update(vo);
		
		return;
	}// 변경된 재고 저장하기
	
}


















