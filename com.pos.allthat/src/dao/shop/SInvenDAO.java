package dao.shop;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import vo.shopvo.SInvenListVO;
import vo.shopvo.SInvenSelVO;
import vo.shopvo.SInvenVO;

public class SInvenDAO {
	SqlSession sqlSession;
	
	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}
	
	// 재고 리스트 조회
	public List<SInvenListVO> selectList(SInvenListVO vo) {
		if(vo.getPercent() == null || vo.getPercent() == "") {
			List<SInvenListVO> inven_list = sqlSession.selectList("sinven.sinven_list", vo);
			return inven_list;
		} else {
			List<SInvenListVO> inven_list = sqlSession.selectList("sinven.sinven_list2", vo);
			return inven_list;
		}//else
	}
	
	// 재고건수 조회
	public int selectOne_count(SInvenListVO vo) {
		int count = sqlSession.selectOne("sinven.count", vo);
		return count;
	}
	
	// tr 클릭 이벤트 상세보기 
	public List<SInvenSelVO> selectList_sel(SInvenSelVO vo) {
		List<SInvenSelVO> inven_sel = sqlSession.selectList("sinven.sinven_sel", vo);
		return inven_sel;
	}
	
	// 변경된 재고 저장하기
	public int update(SInvenListVO vo) {
		int cnt = 0;
		
		JSONParser jsonParser = new JSONParser(); 
    	JSONArray insertParam = null;
    	
    	try {
			insertParam = (JSONArray) jsonParser.parse(vo.getStockArr());
		} catch (ParseException e) {
			e.printStackTrace();
		}
    	
    	System.out.println(insertParam.size());
    	
    	for(int i = 0; i < insertParam.size(); i++) {
    		org.json.simple.JSONObject data = (org.json.simple.JSONObject) insertParam.get(i);
    	    System.out.println(data);
    	    
    	    SInvenVO svo = new SInvenVO();
    	    
    	    svo.setProductid(data.get("productid"));
    	    svo.setStock(data.get("stock"));
    	    svo.setAppropriatestock(data.get("appropriatestock"));
    	    svo.setCompcd(vo.getCompcd());
    	    
    	    sqlSession.insert("sinven.sinven_update", svo);
    	}//for
    	
    	return cnt;
	}// 변경된 재고 저장하기
	
}
