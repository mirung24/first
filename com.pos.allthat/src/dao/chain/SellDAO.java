package dao.chain;

import java.util.List;

import org.apache.ibatis.session.SqlSession;

import vo.newvo.SellList2VO;
import vo.newvo.SellListVO;

public class SellDAO {
	SqlSession sqlSession;
	
	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}
	
	// 판매내역 리스트 조회
	public List<SellListVO> selectList(SellListVO vo) {
		List<SellListVO> sell_list = sqlSession.selectList("sell.sell_list", vo);
		return sell_list;
	}
	
	// 판매관리 건수 조회
	public int selectOne_count(SellListVO vo) {
		int count = sqlSession.selectOne("sell.sell_count", vo);
		return count;
	}
	
	// 판매상품 리스트 조회
	public List<SellList2VO> selectList2(String paymentcd) {
		List<SellList2VO> sell_list2 = sqlSession.selectList("sell.sell_list2", paymentcd);
		return sell_list2;
	}
}





























