package dao.shop;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import vo.shopvo.SIncomeVO;
import vo.shopvo.SIncomeDetVO;
import vo.shopvo.SIncomeListVO;
import vo.shopvo.SIncomeTopVO;

public class SIncomeDAO {
	SqlSession sqlSession;
	
	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}
	
	// 입고관리 리스트 조회
	public List<SIncomeListVO> selectList(SIncomeListVO vo) {
		List<SIncomeListVO> sincome_list = sqlSession.selectList("sincome.sincome_list", vo);
		return sincome_list;
	}
	
	// 입고건수 조회
	public int selectOne_count(SIncomeListVO vo) {
		int count = sqlSession.selectOne("sincome.count", vo);
		return count;
	}
	
	// 상단집계 조회
	public List<SIncomeTopVO> selectList_top(SIncomeTopVO vo) {
		List<SIncomeTopVO> top_list = sqlSession.selectList("sincome.sincome_top", vo);
		return top_list;
	}
	
	// 상세보기 리스트 조회
	public List<SIncomeDetVO> selectList_det(SIncomeDetVO vo) {
		List<SIncomeDetVO> det_list = sqlSession.selectList("sincome.sincome_det", vo);
		return det_list;
	}
	
	// 상품추가 리스트 조회
	public List<SIncomeDetVO> selectList_regiList(SIncomeDetVO vo) {
		List<SIncomeDetVO> regi_list = sqlSession.selectList("sincome.sincome_regiList", vo);
		return regi_list;
	}
	
	// 입고서 등록
	public int insert(SIncomeDetVO vo) {
		int cnt = 0;
		
		// 마스터 코드 생성
		String purchasecd = sqlSession.selectOne("sincome.purchasecd");
		vo.setPurchasecd(purchasecd);
		// 마스터 코드 생성
		
		// 상세등록
		JSONParser jsonParser = new JSONParser(); 
    	JSONArray insertParam = null;
    	
		try {
			insertParam = (JSONArray) jsonParser.parse(vo.getRegiArr());
		} catch (ParseException e) {
			e.printStackTrace();
		}
      
		System.out.println(insertParam.size());
      
		for(int i = 0; i < insertParam.size(); i++) {
			org.json.simple.JSONObject data = (org.json.simple.JSONObject) insertParam.get(i);
    	    System.out.println(data);
    	    
    	    SIncomeVO svo = new SIncomeVO();
    	    
    	    svo.setProductcd(data.get("productcd"));
    	    svo.setCnt(data.get("cnt"));
    	    svo.setPrice(data.get("price"));
    	    svo.setDiscount(data.get("discount"));
    	    svo.setAmt(data.get("amt"));
    	    svo.setVat(data.get("vat"));
    	    svo.setTotal(data.get("total"));
    	    svo.setTax(data.get("tax"));
    	    svo.setLotno(data.get("lotno"));
    	    svo.setExpirydate(data.get("expirydate"));
    	    svo.setPackingunit(data.get("packingunit"));
    	    svo.setUnit(data.get("unit"));
    	    svo.setSpec(data.get("spec"));
    	    svo.setMaker(data.get("maker"));
    	    
    	    svo.setCompcd(vo.getCompcd());
    	    svo.setRemarks(vo.getRemarks());
    	    svo.setRegcd(vo.getRegcd());
    	    svo.setPurchasecd(purchasecd);
    	    
    	    sqlSession.insert("sincome.item_insert", svo);
		}// 상세등록
		
		// 마스터 등록
		SIncomeVO svo2 = new SIncomeVO();
		svo2.setCompcd(vo.getCompcd());
		svo2.setPurchasecd(purchasecd);
		svo2.setAccount2(vo.getAccount2());
		svo2.setRemarks(vo.getRemarks());
		svo2.setRegcd(vo.getRegcd());
		
		sqlSession.insert("sincome.purchase_insert", svo2);
		// 마스터 등록
		
		// 재고 업데이트
		for(int i = 0; i < insertParam.size(); i++) {
			org.json.simple.JSONObject data = (org.json.simple.JSONObject) insertParam.get(i);
    	    System.out.println(data);
    	    
    	    SIncomeVO svo3 = new SIncomeVO();
    	    
    	    svo3.setProductid(data.get("productid"));
    	    svo3.setProductcd(data.get("productcd"));
    	    svo3.setCnt(data.get("cnt"));
    	    svo3.setPackingunit(data.get("packingunit"));
    	    svo3.setPrice(data.get("price"));
    	    
    	    svo3.setCompcd(vo.getCompcd());
    	    svo3.setAccount2(vo.getAccount2());
    	    svo3.setRegcd(vo.getRegcd());
    	    svo3.setPurchasecd(purchasecd);
    	    
    	    sqlSession.insert("sincome.stock_update", svo3);
		}// 상세등록
		
		
		return cnt;
	}
	
	// 입고서 삭제하기
	public int delete(SIncomeDetVO vo) {
		int res = sqlSession.delete("sincome.remove1", vo);// 재고 업데이트
		sqlSession.delete("sincome.remove2", vo);//상세
		sqlSession.delete("sincome.remove3", vo);//마스터
		return res;
	}
}
