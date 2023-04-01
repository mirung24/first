package com.pos.allthat.chain;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;

import dao.chain.ProdDAO;
import util.Common;
import vo.ChaProdGrpVO;
import vo.ChainProdVO;
import vo.newvo.CateVO;
import vo.newvo.ProdHistVO;
import vo.newvo.ProdListVO;
import vo.newvo.ProdTallyVO;
import vo.newvo.ProdTotalVO;
import vo.newvo.ProdUpdateVO;

@Controller
public class ProdController {
	@Autowired
	HttpServletRequest request;
	
	ProdDAO prod_dao;
	
	private static Logger logger = Logger.getLogger(FranController.class);
	
	public ProdController(ProdDAO prod_dao) {
		this.prod_dao = prod_dao;
		System.out.println("--ProdController생성자 호출--");
	}
	
	// 상품관리 화면으로 이동
	@RequestMapping(value = "/product.do")
	public String product(Model model) {
		System.out.println("-----상품관리 페이지로 이동!-----");
		model.addAttribute("select", "chain");
		return Common.CHAIN_PATH + "product.jsp";
	}
	
	// 상품관리 리스트 조회/ 전체상품 건수 조회
	@ResponseBody
	@RequestMapping(value = "prod_list.do", produces = "application/json; charset=utf8")
	public Object prod_list(HttpServletResponse response, @ModelAttribute("ProdListVO") ProdListVO vo) {
		System.out.println("-----상품관리 리스트 조회!-----");
		
		int count = prod_dao.selectOne_count(vo);
		List<ProdListVO> prod_list = prod_dao.selectList(vo);
		
		JSONObject jsonObject = new JSONObject();               

		jsonObject.put("count", count);
		jsonObject.put("data", prod_list);
	      
	    return jsonObject.toString();
	}// 상품관리 리스트 조회/ 전체상품 건수 조회
	
	// 상단 집계 조회
	@ResponseBody
	@RequestMapping(value = "prod_tt.do", produces = "application/json; charset=utf8")
	public Object prod_tt(@ModelAttribute("ProdTotalVO") ProdTotalVO vo) {
		System.out.println("-----상단 집계조회-----");
		ProdTotalVO pvo = prod_dao.selectOne_tt(vo);
		return pvo;
	}// 상단 집계 조회
	
	// 상품 등록하기
	@ResponseBody
	@RequestMapping(value="prod_insert.do", produces = "application/json; charset=utf8")
	public Object prod_insert(@ModelAttribute("ChainProdVO") ChainProdVO vo) {
		System.out.println("-----상품 등록-----");
		try {
			int res = prod_dao.insert(vo);
			return res;
		} catch(DuplicateKeyException dke) {
			dke.printStackTrace();//입력한 대표코드와 productid가 중복된 것이 존재하면 메세지 띄우기
			int res = 3;
			return res;
		}
	}// 상품 등록하기
	
	// 클릭한 tr의 정보 상세보기
	@ResponseBody
	@RequestMapping(value = "prod_sel.do", produces = "application/json; charset=utf-8")
	public Object prod_sel(@ModelAttribute("ProdListVO") ProdListVO vo) {
		System.out.println("-----클릭한 tr의 정보 상세보기-----");
		ProdListVO plvo = prod_dao.selectOne(vo);
		if(plvo.getCategory3cd() == null) { plvo.setCategory3cd(""); }
		return plvo;
	}// 클릭한 tr의 정보 상세보기
	
	// 그룹상품 추가 리스트 조회
	@ResponseBody
	@RequestMapping(value = "ga_list.do", produces = "application/json; charset=utf-8")
	public Object ga_list(@ModelAttribute("ChaProdGrpVO") ChaProdGrpVO vo, HttpServletResponse response) {
		System.out.println("-----그룹상품 추가 리스트 조회-----");
		List<ChaProdGrpVO> ga_list = prod_dao.selectList_ga(vo);
		
		JSONObject jsonObject = new JSONObject();               

	    jsonObject.put("data", ga_list);
	      
	    return jsonObject.toString();
	}// 그룹상품 추가 리스트 조회
	
	// popup 판매 집계 조회
	@ResponseBody
	@RequestMapping(value = "prodTally.do", produces = "application/json; charset=utf-8")
	public Object prodTally(@ModelAttribute("ProdTallyVO") ProdTallyVO vo) {
		System.out.println("-----popup 판매 집계 조회-----");
		ProdTallyVO ptvo = prod_dao.selectOne_tally(vo);
		return ptvo;
	}// popup 판매 집계 조회
	
	// popup 판매내역 리스트 조회
	@ResponseBody
	@RequestMapping(value = "prodHist.do", produces = "application/json; charset=utf-8")
	public Object prodHist(@ModelAttribute("ProdHistVO") ProdHistVO vo) {
		System.out.println("-----popup 판매내역 조회-----");
		List<ProdHistVO> ph_list = prod_dao.selectList_ph(vo);
		
		JSONObject jsonObject = new JSONObject();               

	    jsonObject.put("data", ph_list);
	      
	    return jsonObject.toString();
	}// popup 판매내역 리스트 조회
	
	// popup 상세보기 저장
	@ResponseBody
	@RequestMapping(value = "detail_prod.do", produces = "application/json; charset=utf-8")
	public Object detail_prod(@ModelAttribute("ProdUpdateVO") ProdUpdateVO vo) {
		System.out.println("-----pop내용 저장-----");
		
		String chaincode = vo.getChaincode();
		String productid = vo.getProductid();//기존 대표코드(productid는 기존, productcd/barcode는 변경된 코드로 수정)
		String d_prodcd = vo.getD_prodcd();//변경된 대표코드
		
		System.out.println(vo.getD_prodname());
		System.out.println(vo.getD_prodmaker());
		System.out.println("입력받은 상품 아이디"+ d_prodcd);
		
		int res = prod_dao.update_det(vo);// 마스터 상품 수정
		
		String[] ga_prodcdArr = vo.getGa_prodcd().split(",", -1);//그룹상품 입력받은 제품코드
		String[] ga_barcdArr = vo.getGa_barcd().split(",", -1);//그룹상품 입력받은 바코드
		String[] ga_prodnmArr = vo.getGa_prodnm().split(",", -1);
		String[] ga_makerArr = vo.getGa_maker().split(",", -1);
		String[] ga_specArr = vo.getGa_spec().split(",", -1);
		String[] ga_unitArr = vo.getGa_unit().split(",", -1);
		String[] ga_sizeArr = vo.getGa_size().split(",", -1);
		String[] ga_pakunitArr = vo.getGa_pakunit().split(",", -1);
		String[] ga_productsidArr = vo.getGa_productsid().split(",", -1);//그룹상품 s아이디
		
		for(int i = 0; i < ga_prodcdArr.length; i++) {
			System.out.println("길이 "+ga_prodcdArr.length);
			System.out.println("productsid : "+ga_productsidArr[i]);
			ProdUpdateVO ga_list = new ProdUpdateVO();
			
			if(ga_productsidArr[i].equals("") || ga_productsidArr[i] == null) {// 새로운 그룹상품  insert
				ga_list.setChaincode(chaincode);
				ga_list.setGa_prodcd(ga_prodcdArr[i]);
				ga_list.setGa_barcd(ga_barcdArr[i]);
				ga_list.setGa_prodnm(ga_prodnmArr[i]);
				ga_list.setGa_maker(ga_makerArr[i]);
				ga_list.setGa_spec(ga_specArr[i]);
				ga_list.setGa_unit(ga_unitArr[i]);
				ga_list.setGa_size(ga_sizeArr[i]);
				ga_list.setGa_pakunit(ga_pakunitArr[i]);
//				ga_list.setGa_productsid(ga_productsidArr[i]);
				ga_list.setProductid(productid);
				
				int ga = prod_dao.insert_ga(ga_list);//서브 그룹상품 등록
			}//if(그룹상품 등록 insert)
			
			else if(ga_productsidArr[i] != "" || ga_productsidArr[i] != null ) {// 기존 그룹상품  update
				ga_list.setChaincode(chaincode);
				ga_list.setGa_prodcd(ga_prodcdArr[i]);
				ga_list.setGa_barcd(ga_barcdArr[i]);
				ga_list.setGa_prodnm(ga_prodnmArr[i]);
				ga_list.setGa_maker(ga_makerArr[i]);
				ga_list.setGa_spec(ga_specArr[i]);
				ga_list.setGa_unit(ga_unitArr[i]);
				ga_list.setGa_size(ga_sizeArr[i]);
				ga_list.setGa_pakunit(ga_pakunitArr[i]);
				ga_list.setGa_productsid(ga_productsidArr[i]);
				ga_list.setProductid(productid);
				
				int ga = prod_dao.update_ga(ga_list);//서브 그룹상품 수정
			}//else if(그룹상품 수정 update)
			
		}//for
		
		JSONObject jsonObject = new JSONObject();               

	    jsonObject.put("data", res);
	      
	    return jsonObject.toString();
	}// popup 상세보기 저장
	
	// 체인점 1차 카테고리 리스트 가져오기
	@ResponseBody
	@RequestMapping(value = "/chain_cate1.do", produces = "application/json; charset=utf8")
	public String chain_cate1(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----체인점 상품관리: 1차 카테고리 리스트 가져오기-----");
		List<CateVO> list = prod_dao.selectList_cate1(vo);
		JSONObject jsonObject = new JSONObject();              
		jsonObject.put("data", list);
	    return jsonObject.toString();
	}// 체인점 1차 카테고리 리스트 가져오기
	
	// 체인점 2차 카테고리 리스트 가져오기
	@ResponseBody
	@RequestMapping(value = "/chain_cate2.do", produces = "application/json; charset=utf8")
	public String chain_cate2(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----체인점 상품관리: 2차 카테고리 리스트 가져오기-----");
		List<CateVO> list = prod_dao.selectList_cate2(vo);
		JSONObject jsonObject = new JSONObject();              
		jsonObject.put("data", list);
	    return jsonObject.toString();
	}// 체인점 2차 카테고리 리스트 가져오기
	
	// 체인점 3차 카테고리 리스트 가져오기
	@ResponseBody
	@RequestMapping(value = "/chain_cate3.do", produces = "application/json; charset=utf8")
	public String chain_cate3(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----체인점 상품관리: 2차 카테고리 리스트 가져오기-----");
		List<CateVO> list = prod_dao.selectList_cate3(vo);
		JSONObject jsonObject = new JSONObject();              
		jsonObject.put("data", list);
	    return jsonObject.toString();
	}// 체인점 3차 카테고리 리스트 가져오기
	
	// 카테고리 이름들 가져오기
	@ResponseBody
	@RequestMapping(value = "/cate_names.do", produces = "application/json; charset=utf8")
	public Object cate_names(@ModelAttribute("CateVO") CateVO vo) {
		System.out.println("-----체인점 상품관리: 선택된 카테고리 이름들 가져오기");
		CateVO cvo = prod_dao.selectOne_names(vo);
		return cvo;
	}
	
}	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
