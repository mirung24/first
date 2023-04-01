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

import dao.shop.SSell2DAO;
import util.Common;
import vo.shopvo.Ssell2VO;

@Controller
public class SSell2Controller {

	@Autowired
	HttpServletRequest request;
	
	SSell2DAO ssell2_dao;
	
	public SSell2Controller(SSell2DAO ssell2_dao) {
		this.ssell2_dao = ssell2_dao;
		System.out.println("-----SSell2Controller생성자 호출-----");
	}
	
	// 판매내역 페이지로 이동
	@RequestMapping(value = "/ssell2.do")
	public String sproduct(Model model) {
		System.out.println("-----판매내역 페이지로 이동-----");
		model.addAttribute("select", "shop");
		return Common.SHOP_PATH + "sell2.jsp";
	}
	
	// 판매내역 리스트 조회/건수 조회
	@ResponseBody
	@RequestMapping(value = "/ssell2_list.do", produces = "application/json; charset=utf8")
	public Object ssell2_list(HttpServletResponse response, @ModelAttribute("Ssell2VO") Ssell2VO vo) {
		System.out.println("-----가맹점 상품관리 리스트 조회-----");
	
		int count = ssell2_dao.selectOne_count(vo);
		List<Ssell2VO> sell_list = ssell2_dao.selectList(vo);

		JSONObject jsonObject = new JSONObject();               

		jsonObject.put("count", count);
		jsonObject.put("data", sell_list);
	      
	    return jsonObject.toString();
	}
	
}


















