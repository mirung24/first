package com.pos.allthat.chain;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import dao.chain.PackDAO;
import util.Common;
import vo.newvo.ProdListVO;

@Controller
public class PackController {
	@Autowired
	HttpServletRequest request;
	
	PackDAO pack_dao;
	
	private static Logger logger = Logger.getLogger(FranController.class);
	
	public PackController(PackDAO pack_dao) {
		this.pack_dao = pack_dao;
		System.out.println("-----PackController생성자 호출-----");
	}
	
	// 상품포장관리 화면으로 이동
	@RequestMapping(value = "/pack.do")
	public String pack(Model model) {
		System.out.println("-----상품포장관리 페이지로 이동!-----");
		model.addAttribute("select", "chain");
		return Common.CHAIN_PATH + "pack.jsp";
	}
	
	// 상품포장관리 리스트 조회/ 건수 조회
	@ResponseBody
	@RequestMapping(value = "/pack_list.do", produces = "application/json; charset=utf8")
	public Object pack_list(HttpServletResponse response, @ModelAttribute("ProdListVO") ProdListVO vo) {
		System.out.println("-----상품포장관리 리스트 조회-----");
		
		int count = pack_dao.selectOne_count(vo);
		List<ProdListVO> pack_list = pack_dao.selectList(vo);
		
		JSONObject jsonObject = new JSONObject();               

		jsonObject.put("count", count);
		jsonObject.put("data", pack_list);
	      
	    return jsonObject.toString();
	}// 상품포장관리 리스트 조회/ 건수 조회
	
}	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
