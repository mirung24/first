package dao.chain;

import java.util.List;

import org.apache.ibatis.session.SqlSession;

import vo.newvo.ProdListVO;

public class PackDAO {
	SqlSession sqlSession;
	
	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}

	// 상품포장관리 리스트 조회
	public List<ProdListVO> selectList(ProdListVO vo) {
		List<ProdListVO> pack_list = sqlSession.selectList("pack.pack_list", vo);
		return pack_list;
	}
	
	// 상품포장관리 건수 조회
	public int selectOne_count(ProdListVO vo) {
		int count = sqlSession.selectOne("pack.count", vo);
		return count;
	}
}






























