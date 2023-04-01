package com.pos.allthat;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;

import dao.ComDAO;
import vo.CodeVO;
import vo.CompanyUserVO;
import vo.shopvo.AccountVO;

@Controller
public class ComController {
	
	private static Logger logger = Logger.getLogger(ComController.class);
	
	@Autowired
	HttpServletRequest request;
	
	ComDAO com_dao;
	
	public ComController(ComDAO com_dao) {
		this.com_dao = com_dao;
		System.out.println("--ComController생성자 호출--");
	}
	
	// 사용자 추가 리스트 (대표, 사원)
	@ResponseBody
	@RequestMapping(value = "/com_ua.do", produces = "application/json; charset=utf8")
	public void com_ua(HttpServletResponse response, @ModelAttribute("CodeVO") CodeVO vo) {
		System.out.println("-----사용자 추가 리스트(대표, 사원)-----");
		List<CodeVO> list = com_dao.selectList_ua(vo);
		try { 
			
			JSONObject jso = new JSONObject();
			jso.put("data", list);
			response.setContentType("text/html;charset=utf-8");
			
			PrintWriter out = response.getWriter();
			out.print(jso.toString());
		} catch (JsonProcessingException e) { 
			e.printStackTrace(); 
		} catch (IOException e) { 
			e.printStackTrace(); 
		}
	}// 사용자 추가 리스트 (대표, 사원)
	
	// 카드사명 selectbox
	@ResponseBody
	@RequestMapping(value = "/com_card.do", produces = "application/json; charset=utf8")
	public Object com_card(HttpServletResponse response, @ModelAttribute("CodeVO") CodeVO vo) {
		System.out.println("-----카드사명 selectbox-----");
		List<CodeVO> list = com_dao.selectList_card(vo);
		
		JSONObject jsonObject = new JSONObject();               

	    jsonObject.put("data", list);
	      
	    return jsonObject.toString();
	}// 카드사명 selectbox
	
	// 거래처 리스트 가져오기 select
	@ResponseBody
	@RequestMapping(value = "/com_account.do", produces = "application/json; charset=utf8")
	public Object com_account(@ModelAttribute("AccountVO") AccountVO vo) {
		System.out.println("-----거래처 리스트 select-----");
		List<AccountVO> list = com_dao.selectList_account(vo);
		
		JSONObject jsonObject = new JSONObject();               

	    jsonObject.put("data", list);
	      
	    return jsonObject.toString();
	}
	
	// 과세 select 가져오기(과세, 비과세, 과세포함)
	@ResponseBody
	@RequestMapping(value = "/com_tax.do", produces = "application/json; charset=utf8")
	public Object com_tax(HttpServletResponse response, @ModelAttribute("CodeVO") CodeVO vo) {
		System.out.println("-----COM 과세 select 가져오기-----");
		List<CodeVO> list = com_dao.selectList_tax(vo);
		
		JSONObject jsonObject = new JSONObject();
		
		jsonObject.put("data", list);
		
		return jsonObject.toString();
	}// 과세 select 가져오기(과세, 비과세, 과세포함)
	
	// 체인점별 로고사진 변경(가맹점)
	@ResponseBody
	@RequestMapping(value = "/com_logopath.do", produces = "application/json; charset=utf8")
	public Object com_logopath(String regcd) {
		System.out.println("-----com 로고사진경로 가져오기-----");
		String logo = com_dao.logoImg_shop(regcd);
		System.out.println(logo);
		JSONObject jsonObject = new JSONObject();
		
		jsonObject.put("data", logo);
		
		return jsonObject.toString();
	}// 체인점별로 로고사진 변경(가맹점)
	
	// 체인점별 로고사진 변경(체인점)
	@ResponseBody
	@RequestMapping(value = "/com_logopath2.do", produces = "application/json; charset=utf8")
	public Object com_logopath2(String regcd) {
		System.out.println("-----com 로고사진경로 가져오기-----");
		String logo = com_dao.logoImg_chain(regcd);
		System.out.println(logo);
		JSONObject jsonObject = new JSONObject();
		
		jsonObject.put("data", logo);
		
		return jsonObject.toString();
	}
	
	// api로 승인내역 조회
	@ResponseBody
	@RequestMapping(value = "/com_api.do", produces = "application/json; charset=utf8")
	public org.json.simple.JSONObject ssell_api(String accessKey, String req_busiNo, String req_tranDt,
			String req_tranDtEnd, String req_type) throws IOException, ParseException {
		System.out.println("-----api로 승인내역 조회-----");
		
		JSONObject data = new JSONObject();
		
		data.put("accessKey", accessKey);
		data.put("req_busiNo", req_busiNo);
		data.put("req_tranDt", req_tranDt);
		data.put("req_tranDtEnd", req_tranDtEnd);
		data.put("req_type", req_type);
		
		System.out.println(data.toString());
		
		org.json.simple.JSONObject result = HttpAPI.httpGetConnection(data.toString());
		System.out.println(result);
		return result;
	}// api로 승인내역 조회
	
	// 받은 api 테이블 temp에 집어넣기
	@ResponseBody
//	@Transactional
	@RequestMapping(value = "/com_temp.do", produces = "application/json; charset=utf8")
	public void com_temp(@RequestBody Map<String, Object> map, HttpSession session) {
		System.out.println("-----받은 api 테이블 temp에 집어넣기-----");
		
		CompanyUserVO uservo = (CompanyUserVO) session.getAttribute("uservo");
		String compcd = uservo.getCompcd();
		System.out.println("compcd : "+compcd);
//		System.out.println("map : "+map);
		
//		System.out.println(map.get("DATA"));
		map.put("compcd", compcd);
		
		List<Map<String, Object>> list = (ArrayList<Map<String, Object>>)map.get("DATA");
		
		int res = com_dao.temp_delete(compcd); // temp에 있는 해당 가맹점 데이터 지우기
		
		for(int i = 0; i < list.size(); i++) {
			Map<String, Object> mapSender = new HashMap<String, Object>();
			mapSender.putAll(list.get(i));
			mapSender.put("compcd", compcd);
			if(list.get(i).get("res_tranType").equals("credit")) { //신용카드
				if(list.get(i).get("res_tranGubn").equals("CAN")) {
					mapSender.put("paymethod", "D4");
					mapSender.put("paygubn","CAN");
				} else if(list.get(i).get("res_tranGubn").equals("APP")) {
					mapSender.put("paymethod", "D1");
					mapSender.put("paygubn","ACC");
				}
			} else if(list.get(i).get("res_tranType").equals("cash")) {//현금영수증
				if(list.get(i).get("res_tranGubn").equals("CAN")) {
					mapSender.put("paymethod", "B2");
					mapSender.put("paygubn","CAN");
				} else if(list.get(i).get("res_tranGubn").equals("APP")) {
					mapSender.put("paymethod", "B1");
					mapSender.put("paygubn","ACC");
				}
			} else if(list.get(i).get("res_tranType").equals("coin")) {//현금수납
				if(list.get(i).get("res_tranGubn").equals("CAN")) {
					mapSender.put("paymethod", "Q2");
					mapSender.put("paygubn","CAN");
				} else if(list.get(i).get("res_tranGubn").equals("APP")) {
					mapSender.put("paymethod", "Q1");
					mapSender.put("paygubn","ACC");
				}
			}
			
			String ti = (String) list.get(i).get("res_tranTm");
			ti.substring(0, 2);
			mapSender.put("auth_ti",ti.substring(0, 2));//시간 '시'만 자르기
			
//			String name = (String) list.get(i).get("customerName");
//			System.out.println("이름입니당:: "+name);
//			mapSender.put("name", name);
			
			String res_filler = (String) list.get(i).get("res_filler"); // res_filler 가져오기
			String[] pmcdarr = res_filler.split("\\|"); // |로 잘라서 넣기
			int lastIndex = pmcdarr.length - 1;// 길이 재기
			boolean nameyn = res_filler.contains("*");
			
			String name = null; // 고객이름
			if(nameyn == true) { name = pmcdarr[1]; } // 이름이 있으면, 배열 1번째 있는 내용 가져와서 집어넣기
			else if(nameyn == false) { name = null; } // 이름이 없으면, null값으로 넣기
			System.out.println("이름입니당---------------"+name);
			mapSender.put("name", name);
			
			String paymentcd; // 구매코드
			if(lastIndex < 0) { paymentcd = ""; } // 길이가 없으면 빈값으로 넣기
			else { paymentcd = pmcdarr[lastIndex]; } // 마지막꺼 가져와서 넣기
			
			if("".equals(paymentcd) || paymentcd == null) { //넘어온 paymentcd가 없으면
				String res_tranGubn = (String) list.get(i).get("res_tranGubn");
				String res_apprveNo = (String) list.get(i).get("res_apprveNo");
				String res_tranDt = (String) list.get(i).get("res_tranDt");
				String res_tranTm = (String) list.get(i).get("res_tranTm");
				
				String res_paymentcd = compcd + res_tranGubn + res_apprveNo + res_tranDt + res_tranTm; // 만들어내서 보내기
				mapSender.put("paymentcd", res_paymentcd);
			} else { // 넘어온 paymentcd가 있으면
				mapSender.put("paymentcd", paymentcd);
			}//else
			
			System.out.println(":::::::::::::::"+mapSender);
			int result = com_dao.temp_insert(mapSender);// temp에 api로 받은 데이터 집어넣기
		}//for문(i)
		com_dao.dupli_del(compcd);// 중복된 paymentcd 지우기
	}// 받은 api 테이블 temp에 집어넣기

	// temp 일단 지우기
	@ResponseBody
	@RequestMapping(value = "/temp_del.do", produces = "application/json; charset=utf8")
	public int temp_del(String compcd) {
		System.out.println("-----temp 일단 지우기-----");
		int res = com_dao.temp_delete(compcd); // temp에 있는 해당 가맹점 데이터 지우기
		return res;
	}
	
	// y,n 유무에 따라 보이기/숨기기 설정
	@ResponseBody
	@RequestMapping(value = "/connectyn.do", produces = "application/json; charset=utf8")
	public String connectyn(String compcd) {
		System.out.println("-----y,n 유무에 따라 보이기/숨기기 설정-----");
		System.out.println("compcd받았나 확인:"+compcd);
		String connectyn = com_dao.selectOne_yn(compcd);
		System.out.println("y,n 설정: "+ connectyn);
		
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("data", connectyn);
		return jsonObject.toString();
	}// y,n 유무에 따라 보이기/숨기기 설정
	
}

