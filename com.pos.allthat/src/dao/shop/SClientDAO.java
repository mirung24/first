package dao.shop;

import java.util.List;

import org.apache.ibatis.session.SqlSession;

import vo.shopvo.AccountVO;

public class SClientDAO {
	SqlSession sqlSession;
	
	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}
	
	// 거래처관리 리스트 조회
	public List<AccountVO> selectList(AccountVO vo) {
		List<AccountVO> list = sqlSession.selectList("sclient.sclient_list", vo);
		return list;
	}
	
	// tr클릭 상세보기
	public AccountVO selectOne_tr(String accountcd) {
		AccountVO vo = sqlSession.selectOne("sclient.cli_sel", accountcd);
		return vo;
	}
	
	// 거래처 등록
	public int insert(AccountVO vo) {
		int res = sqlSession.insert("sclient.sclient_regi", vo);
		return res;
	}
	
	// 상세보기 수정
	public int update(AccountVO vo) {
		int res = sqlSession.update("sclient.sclient_edit", vo);
		return res;
	}
	
}
