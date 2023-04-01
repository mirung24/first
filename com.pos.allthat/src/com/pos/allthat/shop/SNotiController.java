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

import dao.shop.SNotiDAO;
import util.Common;
import vo.NoticeVO;

@Controller
public class SNotiController {

	@Autowired
	HttpServletRequest request;
	
	SNotiDAO snoti_dao;
	
	public SNotiController(SNotiDAO snoti_dao) {
		this.snoti_dao = snoti_dao;
		System.out.println("--SNotiController생성자 호출--");
	}
	
	// 공지사항 페이지로 이동
	@RequestMapping(value = "/snotice.do") 
	public String snotice(Model model) {
		System.out.println("가맹점 공지사항 페이지로 이동!");
		model.addAttribute("select", "shop");
		return Common.SHOP_PATH + "notice.jsp";
	}
	
	// 가맹점 공지사항 리스트 조회/ 리스트 건수 조회
	@ResponseBody
	@RequestMapping(value = "/snotice_list.do", produces = "application/json; charset=utf8")
	public Object snotice_list(@ModelAttribute("NoticeVO") NoticeVO vo) {
		System.out.println("-----가맹점 공지사항 리스트 조회-----");
		
		int count = snoti_dao.selectOne_count(vo);
		List<NoticeVO> list = snoti_dao.selectList(vo);
		
		JSONObject jsonObject = new JSONObject();               
		jsonObject.put("count", count);
		jsonObject.put("data", list);
	      
	    return jsonObject.toString();
	}// 가맹점 공지사항 리스트 조회/ 리스트 건수 조회
	
	// 게시글 상세보기 페이지로 이동
	@RequestMapping(value = "/sread.do")
	public String sread(String noticecode, Model model) {
		System.out.println("-----가맹점 게시글 상세보기 페이지로 이동-----");
		System.out.println(noticecode);
		model.addAttribute("noticecode", noticecode);
		return Common.SHOP_PATH + "read.jsp";
	}
	
	// 읽음 표시/ 조회수 업데이트
	@ResponseBody
	@RequestMapping(value = "/readhit.do", produces = "application/json; charset=utf8")
	public Object readhit(@ModelAttribute("NoticeVO") NoticeVO vo) {
		System.out.println("-----가맹점 공지사항 읽음 표시/ 조회수 업데이트-----");
		
		int readhit = snoti_dao.update_readhit(vo);
		
		return readhit;
	}

}
