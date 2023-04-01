package dao.shop;

import java.util.List;

import org.apache.ibatis.session.SqlSession;

import vo.shopvo.SDayStatVO;

public class SSahiDAO {
	SqlSession sqlSession;
	
	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}
	
	// 분기별 요일 통계
	public List<SDayStatVO> selectList_day(SDayStatVO vo) {
		List<SDayStatVO> list = sqlSession.selectList("ssahi.sdaystat", vo);
		return list;
	}
	
	// 분기별 시간대 통계
	public List<SDayStatVO> selectList_time(SDayStatVO vo) {
		List<SDayStatVO> list = sqlSession.selectList("ssahi.stimestat", vo);
		return list;
	}

}
