package dao.chain;

import java.util.List;

import org.apache.ibatis.session.SqlSession;

import vo.CodeVO;

public class CodeDAO {
	SqlSession sqlSession;
	
	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}
	
	// 코드관리 리스트 조회
	public List<CodeVO> selectList(String searchInput) {
		List<CodeVO> code_list = sqlSession.selectList("code.code_list", searchInput);
		return code_list;
	}
	
	// 코드관리 > 코드등록
	public int insert(CodeVO vo) {
		int res = sqlSession.insert("code.code_ins", vo);
		return res;
	}
	
	// 마스터 코드 수정
	public int master_update(CodeVO vo) {
		int res = sqlSession.update("code.master_edit", vo);
		return res;
	}
	
	// 하위 코드 리스트 조회
	public List<CodeVO> selectList_low(String code) {
		List<CodeVO> l_list = sqlSession.selectList("code.low_list", code);
		return l_list;
	}
	
	// 하위 코드 저장
	public int sub_insert(CodeVO vo) {
		int res = sqlSession.insert("code.sub_insert", vo);
		return res;
	}
	
	// 하위 코드 수정
	public int sub_update(CodeVO vo) {
		int res = sqlSession.update("code.sub_update", vo);
		return res;
	}
}
