package com.pos.allthat.shop;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;

import dao.shop.SProdDAO;
import util.Common;
import vo.newvo.CateVO;
import vo.newvo.ProdHistVO;
import vo.newvo.ProdTallyVO;
import vo.newvo.ProdUpdateVO;
import vo.shopvo.SProdListVO;
import vo.shopvo.SProdMoveVO;
import vo.shopvo.SProdTopVO;
import vo.shopvo.SProdUpdateVO;

@Controller
public class SProdController {

	@Autowired
	HttpServletRequest request;
	
	SProdDAO sprod_dao;
	
	public SProdController(SProdDAO sprod_dao) {
		this.sprod_dao = sprod_dao;
		System.out.println("-----SProdController생성자 호출-----");
	}
	
	// 상품관리 페이지로 이동
	@RequestMapping(value = "/sproduct.do")
	public String sproduct(Model model) {
		System.out.println("-----상품관리 페이지로 이동-----");
		model.addAttribute("select", "shop");
		return Common.SHOP_PATH + "product.jsp";
	}
	
	// 상품관리 리스트 조회/ 전체상품 건수 조회
	@ResponseBody
	@RequestMapping(value = "/sprod_list.do", produces = "application/json; charset=utf8")
	public Object sprod_list(HttpServletResponse response, @ModelAttribute("SProdListVO") SProdListVO vo) {
		System.out.println("-----가맹점 상품관리 리스트 조회-----");
		
		int count = sprod_dao.selectOne_count(vo);
		List<SProdListVO> prod_list = sprod_dao.selectList(vo);

		JSONObject jsonObject = new JSONObject();               

		jsonObject.put("count", count);
		jsonObject.put("data", prod_list);
	      
	    return jsonObject.toString();
	}// 상품관리 리스트 조회/ 전체상품 건수 조회
	
	// 상단집계 조회
	@ResponseBody
	@RequestMapping(value = "/sprod_top.do", produces = "application/json; charset=utf8")
	public Object sprod_top(@ModelAttribute("SProdTopVO") SProdTopVO vo) {
		System.out.println("-----가맹점 상품관리 상단집계 조회-----");
		SProdTopVO tvo = sprod_dao.selectOne_top(vo);
		return tvo;
	}// 상단집계 조회
	
	// 상품 등록하기
	@ResponseBody
	@RequestMapping(value = "/sprod_insert.do", produces = "application/json; charset=utf8")
	public Object sprod_insert(@ModelAttribute("SProdListVO") SProdListVO vo) {
		System.out.println("-----가맹점 상품등록-----");
		System.out.println("chaincode : "+ vo.getChaincode());
		
		try {
			if(vo.getChaincode() == null || vo.getChaincode().equals("")) {//체인점에 속하지 않았을 경우
				int res = sprod_dao.insert(vo);
				return res;
			} else {//체인점에 속한 가맹점일 경우
				int res = sprod_dao.insert2(vo);
				return res;
			}
		} catch(DuplicateKeyException dke) {
			dke.printStackTrace();//입력한 대표코드와 productid가 중복된 것이 존재하면 메세지 띄우기
			int res = 3;
			return res;
		}
	}// 상품 등록하기
	
	// 상품 상세보기
	@ResponseBody
	@RequestMapping(value = "/sprod_sel.do", produces = "application/json; charset=utf8")
	public Object sprod_sel(@ModelAttribute("SProdListVO") SProdListVO vo) {
		System.out.println("-----가맹점 상품 상세보기-----");
		SProdListVO svo = sprod_dao.selectOne_sel(vo);
		if(svo.getCategory3cd() == null) { svo.setCategory3cd(""); }
		return svo;
	}// 상품 상세보기
	
	// 그룹상품 추가 리스트
	@ResponseBody
	@RequestMapping(value = "/sga_list.do", produces = "application/json; charset=utf8")
	public Object sga_list(@ModelAttribute("SProdListVO") SProdListVO vo) {
		System.out.println("-----가맹점 상품관리 그룹상품 리스트-----");
		List<SProdListVO> ga_list = sprod_dao.selectList_ga(vo);
		
		JSONObject jsonObject = new JSONObject();               

	    jsonObject.put("data", ga_list);
	      
	    return jsonObject.toString();
	}// 그룹상품 추가 리스트
	
	// 상세보기 판매집계 조회
	@ResponseBody
	@RequestMapping(value = "/sprodTally.do", produces = "application/json; charset=utf8")
	public Object sprodTally(@ModelAttribute("ProdTallyVO") ProdTallyVO vo) {
		System.out.println("-----가맹점 상품관리 상세보기 판매집계 조회-----");
		ProdTallyVO tvo = sprod_dao.selectOne_tally(vo);
		return tvo;
	}// 상세보기 판매집계 조회
	
	// 상세보기 판매이력 조회
	@ResponseBody
	@RequestMapping(value = "/sprodHist.do", produces = "application/json; charset=utf8")
	public Object sprodHist(@ModelAttribute("ProdHistVO") ProdHistVO vo) {
		System.out.println("-----가맹점 상품관리 상세보기 판매이력 조회-----");
		List<ProdHistVO> ph_list = sprod_dao.selectList_ph(vo);
		
		JSONObject jsonObject = new JSONObject();               

	    jsonObject.put("data", ph_list);
	      
	    return jsonObject.toString();
	}// 상세보기 판매이력 조회
	
	// 상세보기 저장
	@ResponseBody
	@RequestMapping(value = "/detail_sprod.do", produces = "application/json; charset=utf8")
	public Object detail_sprod(@ModelAttribute("SProdUpdateVO") SProdUpdateVO vo) {
		System.out.println("-----가맹점 상품관리 상세보기 저장-----");
		
		String chaincode = vo.getF_chaincode();
		String compcd = vo.getCompcd();
		String regcd = vo.getF_regcd();
		String productid = vo.getProductid();
		int res = sprod_dao.update_det(vo);// 상품 상세정보 마스터 수정
		
		String[] ga_prodcdArr = vo.getGa_prodcd().split(",", -1);
		String[] ga_barcdArr = vo.getGa_barcd().split(",", -1);
		String[] ga_prodnmArr = vo.getGa_prodnm().split(",", -1);
		String[] ga_makerArr = vo.getGa_maker().split(",", -1);
		String[] ga_specArr = vo.getGa_spec().split(",", -1);
		String[] ga_unitArr = vo.getGa_unit().split(",", -1);
		String[] ga_sizeArr = vo.getGa_size().split(",", -1);
		String[] ga_pakunitArr = vo.getGa_pakunit().split(",", -1);
		String[] ga_priceArr = vo.getGa_price().split(",", -1);
		String[] ga_discountArr = vo.getGa_discount().split(",", -1);
		String[] ga_salespriceArr = vo.getGa_salesprice().split(",", -1);
		
		for(int i = 0; i < ga_prodcdArr.length; i++) {
			SProdUpdateVO ga_list = new SProdUpdateVO();
			
			ga_list.setCompcd(compcd);
			ga_list.setGa_prodcd(ga_prodcdArr[i]);
			ga_list.setGa_barcd(ga_barcdArr[i]);
			ga_list.setGa_prodnm(ga_prodnmArr[i]);
			ga_list.setGa_maker(ga_makerArr[i]);
			ga_list.setGa_spec(ga_specArr[i]);
			ga_list.setGa_unit(ga_unitArr[i]);
			ga_list.setGa_size(ga_sizeArr[i]);
			ga_list.setGa_pakunit(ga_pakunitArr[i]);
			ga_list.setGa_price(ga_priceArr[i]);
			ga_list.setGa_discount(ga_discountArr[i]);
			ga_list.setGa_salesprice(ga_salespriceArr[i]);
			ga_list.setF_regcd(regcd);
			ga_list.setProductid(productid);
			
			int ga = sprod_dao.insert_ga(ga_list);//상세보기 그룹상품 저장1
		}
		
		for(int i = 0; i < ga_prodcdArr.length; i++) {
			SProdUpdateVO ga_list2 = new SProdUpdateVO();
			
			ga_list2.setF_chaincode(chaincode);
			ga_list2.setGa_prodcd(ga_prodcdArr[i]);
			ga_list2.setGa_barcd(ga_barcdArr[i]);
			ga_list2.setGa_prodnm(ga_prodnmArr[i]);
			ga_list2.setGa_maker(ga_makerArr[i]);
			ga_list2.setGa_spec(ga_specArr[i]);
			ga_list2.setGa_unit(ga_unitArr[i]);
			ga_list2.setGa_size(ga_sizeArr[i]);
			ga_list2.setGa_pakunit(ga_pakunitArr[i]);
			ga_list2.setGa_price(ga_priceArr[i]);
			ga_list2.setGa_discount(ga_discountArr[i]);
			ga_list2.setGa_salesprice(ga_salespriceArr[i]);
			ga_list2.setF_regcd(regcd);
			ga_list2.setProductid(productid);
			
			int ga2 = sprod_dao.insert_ga2(ga_list2);//상세보기 그룹상품 저장2
		}
		
		JSONObject jsonObject = new JSONObject();               

	    jsonObject.put("data", res);
	      
	    return jsonObject.toString();
	}
	
	// 상품이관에서 상품리스트 조회
	@ResponseBody
	@RequestMapping(value = "/sprod_list2.do", produces = "application/json; charset=utf8")
	public Object sprod_list2(HttpServletResponse response, @ModelAttribute("SProdListVO") SProdListVO vo) {
		System.out.println("-----가맹점 상품관리 리스트2 조회-----");
		
		List<SProdListVO> prod_list = sprod_dao.selectList2(vo);

		JSONObject jsonObject = new JSONObject();               

		jsonObject.put("data", prod_list);
	      
	    return jsonObject.toString();
	}// 상품이관에서 상품리스트 조회
	
	// 선택 이관상품 이관하기
	@ResponseBody
	@RequestMapping(value = "/sprod_move.do", produces = "application/json; charset=utf8")
	public Object sprod_move(HttpServletResponse response, @ModelAttribute("SProdMoveVO") SProdMoveVO vo) {
		System.out.println("-----선택상품 이관하기-----");
		
		String productcd = vo.getProductcd().replaceAll("\\[", "").replaceAll("\\]", "").replace("\"", "");
		String[] prodcdArr = productcd.split(",");
		vo.setProdcdArr(prodcdArr);
		
		int res = sprod_dao.selectMove(vo);
		
		JSONObject jsonObject = new JSONObject();               

		jsonObject.put("data", res);
	      
	    return jsonObject.toString();
	}// 선택 이관상품 이관하기
	
	// 가맹점 1차 카테고리 리스트 가져오기
	@ResponseBody
	@RequestMapping(value = "/comp_cate1.do", produces = "application/json; charset=utf8")
	public String comp_cate1(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----가맹점 상품관리: 1차 카테고리 리스트 가져오기-----");
		List<CateVO> list = sprod_dao.selectList_cate1(vo);
		JSONObject jsonObject = new JSONObject();              
		jsonObject.put("data", list);
	    return jsonObject.toString();
	}// 가맹점 1차 카테고리 리스트 가져오기
	
	// 가맹점 2차 카테고리 리스트 가져오기
	@ResponseBody
	@RequestMapping(value = "/comp_cate2.do", produces = "application/json; charset=utf8")
	public String comp_cate2(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----가맹점 상품관리: 2차 카테고리 리스트 가져오기-----");
		List<CateVO> list = sprod_dao.selectList_cate2(vo);
		JSONObject jsonObject = new JSONObject();              
		jsonObject.put("data", list);
	    return jsonObject.toString();
	}// 가맹점 2차 카테고리 리스트 가져오기
	
	// 체인점 3차 카테고리 리스트 가져오기
	@ResponseBody
	@RequestMapping(value = "/comp_cate3.do", produces = "application/json; charset=utf8")
	public String comp_cate3(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----가맹점 상품관리: 2차 카테고리 리스트 가져오기-----");
		List<CateVO> list = sprod_dao.selectList_cate3(vo);
		JSONObject jsonObject = new JSONObject();              
		jsonObject.put("data", list);
	    return jsonObject.toString();
	}// 체인점 3차 카테고리 리스트 가져오기
	
	// 카테고리 이름들 가져오기
	@ResponseBody
	@RequestMapping(value = "/scate_names.do", produces = "application/json; charset=utf8")
	public Object scate_names(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----가맹점 상품관리: 선택된 카테고리 이름들 가져오기");
		CateVO cvo = sprod_dao.selectOne_names(vo);
		return cvo;
	}

}


















