package dao.shop;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;

import vo.newvo.SellList2VO;
import vo.newvo.SellListVO;

public class SSellDAO {
	SqlSession sqlSession;
	
	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}
	
	// 판매관리 리스트 조회
	public List<SellListVO> selectList(SellListVO vo) {
		List<SellListVO> sell_list = sqlSession.selectList("ssell.sell_list", vo);
		return sell_list;
	}
	
	// 판매관리 건수 조회
	public List<SellListVO> selectOne_count(SellListVO vo) {
		List<SellListVO> count = sqlSession.selectList("ssell.sell_count", vo);
		return count;
	}
	
	// 선택한 상품 정보 리스트 조회
	public List<SellList2VO> selectList2(SellList2VO vo) {
		List<SellList2VO> sell_list2 = sqlSession.selectList("ssell.sell_list2", vo);
		return sell_list2;
	}
}
