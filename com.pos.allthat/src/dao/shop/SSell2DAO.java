package dao.shop;

import java.util.List;

import org.apache.ibatis.session.SqlSession;

import vo.shopvo.Ssell2VO;

public class SSell2DAO {
	SqlSession sqlSession;
	
	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}
	
	// 판매내역 건수 조회
	public int selectOne_count(Ssell2VO vo) {
		int count = sqlSession.selectOne("ssell2.sell_count", vo);
		return count;
	}
	
	// 판매내역 리스트 조회
	public List<Ssell2VO> selectList(Ssell2VO vo) {
		List<Ssell2VO> sell_list = sqlSession.selectList("ssell2.sell_list", vo);
		return sell_list;
	}

}
