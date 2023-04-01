package dao.shop;

import java.util.List;

import org.apache.ibatis.session.SqlSession;

import vo.newvo.CateVO;

public class SCateDAO {
	SqlSession sqlSession;
	
	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}
	
	// 만들어진 카테고리가 있는지 확인
	public int scateCheck(CateVO vo) {
		int res = sqlSession.selectOne("scate.scate_check", vo);
		return res;
	}
	
	// 카테고리1 리스트 뿌리기
	public List<CateVO> scate1List(CateVO vo) {
		List<CateVO> list = sqlSession.selectList("scate.scate1_list", vo);
		return list;
	}
	
	// 카테고리2 리스트 뿌리기
	public List<CateVO> scate2List(CateVO vo) {
		List<CateVO> list = sqlSession.selectList("scate.scate2_list", vo);
		return list;
	}
	
	// 카테고리3 리스트 뿌리기
	public List<CateVO> scate3List(CateVO vo) {
		List<CateVO> list = sqlSession.selectList("scate.scate3_list", vo);
		return list;
	}
	
	// 1차 카테고리 사용유무 변경
	public void scate1Useyn(CateVO vo) {sqlSession.update("scate.scate1_useyn", vo);}
	// 2차 카테고리 사용유무 변경
	public void scate2Useyn(CateVO vo) {sqlSession.update("scate.scate2_useyn", vo);}
	// 3차 카테고리 사용유무 변경
	public void scate3Useyn(CateVO vo) {sqlSession.update("scate.scate3_useyn", vo);}
	
	// 1차 카테고리 추가
	public String scate1Add(CateVO vo) {
		String category1cd = sqlSession.selectOne("scate.scate1_code");// 1차 카테고리 일단 만들기
		vo.setCategory1cd(category1cd);
		sqlSession.insert("scate.scate1_add", vo);// 만든 코드로 저장하기
		return category1cd;
	}
	
	// 2차 카테고리 추가
	public String scate2Add(CateVO vo) {
		String category2cd = sqlSession.selectOne("scate.scate2_code", vo);// 2차 카테고리 일단 만들기
		vo.setCategory2cd(category2cd);
		sqlSession.insert("scate.scate2_add", vo);// 만든 코드로 저장하기
		return category2cd;
	}
	
	// 3차 카테고리 추가
	public String scate3Add(CateVO vo) {
		String category3cd = sqlSession.selectOne("scate.scate3_code", vo);// 2차 카테고리 일단 만들기
		vo.setCategory3cd(category3cd);
		sqlSession.insert("scate.scate3_add", vo);// 만든 코드로 저장하기
		return category3cd;
	}
	
	// 1차 카테고리 수정
	public void scate1Modi(CateVO vo) {sqlSession.update("scate.scate1_modi", vo);}
	// 2차 카테고리 수정
	public void scate2Modi(CateVO vo) {sqlSession.update("scate.scate2_modi", vo);}
	// 3차 카테고리 수정
	public void scate3Modi(CateVO vo) {sqlSession.update("scate.scate3_modi", vo);}
	
	// 1차 카테고리 순서 변경
	public void scate1_numC(CateVO cvo) {sqlSession.update("scate.scate1_numC", cvo);}
	// 2차 카테고리 순서 변경
	public void scate2_numC(CateVO cvo) {sqlSession.update("scate.scate2_numC", cvo);}
	// 3차 카테고리 순서 변경
	public void scate3_numC(CateVO cvo) {sqlSession.update("scate.scate3_numC", cvo);}
	
	// 체인본점 카테고리 사용하기 선택
	public void chaincate_use(CateVO vo) {
		sqlSession.insert("scate.chainUse1", vo);
		sqlSession.insert("scate.chainUse2", vo);
		sqlSession.insert("scate.chainUse3", vo);
	}
	
	// 올댓페이 카테고리 사용하기 선택
	public void atscate_use(CateVO vo) {
		sqlSession.insert("scate.use1", vo);
		sqlSession.insert("scate.use2", vo);
		sqlSession.insert("scate.use3", vo);
	}
}







