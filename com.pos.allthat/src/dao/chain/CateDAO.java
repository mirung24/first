package dao.chain;

import java.util.List;

import org.apache.ibatis.session.SqlSession;

import vo.newvo.CateVO;

public class CateDAO {
	SqlSession sqlSession;
	
	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}
	
	// 만들어진 카테고리가 있는지 확인
	public int cateCheck(CateVO vo) {
		int res = sqlSession.selectOne("cate.cate_check", vo);
		return res;
	}
	
	// 카테고리1 리스트 뿌리기
	public List<CateVO> cate1List(CateVO vo) {
		List<CateVO> list = sqlSession.selectList("cate.cate1_list", vo);
		return list;
	}
	
	// 카테고리2 리스트 뿌리깅
	public List<CateVO> cate2List(CateVO vo) {
		List<CateVO> list = sqlSession.selectList("cate.cate2_list", vo);
		return list;
	}
	
	// 카테고리3 리스트 뿌리기
	public List<CateVO> cate3List(CateVO vo) {
		List<CateVO> list = sqlSession.selectList("cate.cate3_list", vo);
		return list;
	}
	
	// 1차 카테고리 사용유무 변경
	public void cate1Useyn(CateVO vo) {sqlSession.update("cate.cate1_useyn", vo);}
	// 2차 카테고리 사용유무 변경
	public void cate2Useyn(CateVO vo) {sqlSession.update("cate.cate2_useyn", vo);}
	// 3차 카테고리 사용유무 변경
	public void cate3Useyn(CateVO vo) {sqlSession.update("cate.cate3_useyn", vo);}
	
	// 1차 카테고리 추가
	public String cate1Add(CateVO vo) {
		String category1cd = sqlSession.selectOne("cate.cate1_code");// 1차 카테고리 일단 만들기
		vo.setCategory1cd(category1cd);
		sqlSession.insert("cate.cate1_add", vo);// 만든 코드로 저장하기
		return category1cd;
	}
	
	// 2차 카테고리 추가
	public String cate2Add(CateVO vo) {
		String category2cd = sqlSession.selectOne("cate.cate2_code", vo);// 2차 카테고리 일단 만들기
		vo.setCategory2cd(category2cd);
		sqlSession.insert("cate.cate2_add", vo);// 만든 코드로 저장하기
		return category2cd;
	}
	
	// 3차 카테고리 추가
	public String cate3Add(CateVO vo) {
		String category3cd = sqlSession.selectOne("cate.cate3_code", vo);// 2차 카테고리 일단 만들기
		vo.setCategory3cd(category3cd);
		sqlSession.insert("cate.cate3_add", vo);// 만든 코드로 저장하기
		return category3cd;
	}
	
	// 1차 카테고리 수정
	public void cate1Modi(CateVO vo) {sqlSession.update("cate.cate1_modi", vo);}
	// 2차 카테고리 수정
	public void cate2Modi(CateVO vo) {sqlSession.update("cate.cate2_modi", vo);}	
	// 3차 카테고리 수정
	public void cate3Modi(CateVO vo) {sqlSession.update("cate.cate3_modi", vo);}	
	
	// 1차 카테고리 순서 변경
	public void cate1_numC(CateVO cvo) {sqlSession.update("cate.cate1_numC", cvo);}
	// 2차 카테고리 순서 변경
	public void cate2_numC(CateVO cvo) {sqlSession.update("cate.cate2_numC", cvo);}
	// 3차 카테고리 순서 변경
	public void cate3_numC(CateVO cvo) {sqlSession.update("cate.cate3_numC", cvo);}

	// 올댓페이 1차 카테고리 리스트
	public List<CateVO> at_cate1(CateVO vo) {
		List<CateVO> list = sqlSession.selectList("cate.at_cate1", vo);
		return list;
	}
	
	// 올댓페이 2차 카테고리 리스트
	public List<CateVO> at_cate2(CateVO vo) {
		List<CateVO> list = sqlSession.selectList("cate.at_cate2", vo);
		return list;
	}
	
	// 올댓페이 3차 카테고리 리스트
	public List<CateVO> at_cate3(CateVO vo) {
		List<CateVO> list = sqlSession.selectList("cate.at_cate3", vo);
		return list;
	}
	
	// 올댓페이 카테고리 사용하기 선택
	public void atcate_use(CateVO vo) {
		sqlSession.insert("cate.use1", vo);
		sqlSession.insert("cate.use2", vo);
		sqlSession.insert("cate.use3", vo);
	}
}
