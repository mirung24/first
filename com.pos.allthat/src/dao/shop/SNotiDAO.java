package dao.shop;

import java.util.List;

import org.apache.ibatis.session.SqlSession;

import vo.NoticeVO;

public class SNotiDAO {
	SqlSession sqlSession;
	
	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}
	
	// 공지사항 리스트 조회
	public List<NoticeVO> selectList(NoticeVO vo) {
		List<NoticeVO> list = sqlSession.selectList("snoti.snoti_list", vo);
		return list;
	}
	
	// 리스트 건수 조회
	public int selectOne_count(NoticeVO vo) {
		int count = sqlSession.selectOne("snoti.count", vo);
		return count;
	}
	
	// 조회수 업데이트
	public int update_readhit(NoticeVO vo) {
		sqlSession.update("snoti.readyn_update", vo);// 읽음표시(로그인 된 가맹점)
		int readhit = sqlSession.selectOne("snoti.ready", vo); // 읽은 가맹점 수 구하기
		vo.setReadhit(readhit);
		sqlSession.update("snoti.readhit_update", vo);// 조회수 업데이트
		return readhit;
	}
	
}
