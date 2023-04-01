package dao.shop;

import java.util.List;

import org.apache.ibatis.session.SqlSession;

import vo.shopvo.SCalenVO;

public class SCalenDAO {
	SqlSession sqlSession;
	
	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}
	
	// 매출내역 가져오기
	public List<SCalenVO> selectList(SCalenVO vo) {
		List<SCalenVO> list = sqlSession.selectList("scalen.scalen_list", vo);
		return list;
	}
	
	// 하단 정보 조회
	public List<SCalenVO> selectList_info(SCalenVO vo) {
		List<SCalenVO> info = sqlSession.selectList("scalen.scalen_info", vo);
		return info;
	}
	
}
