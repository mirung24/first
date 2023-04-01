package dao.chain;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;

import vo.ChaProdGrpVO;
import vo.ChainProdVO;
import vo.newvo.CateVO;
import vo.newvo.ProdHistVO;
import vo.newvo.ProdListVO;
import vo.newvo.ProdTallyVO;
import vo.newvo.ProdTotalVO;
import vo.newvo.ProdUpdateVO;

public class ProdDAO {
	SqlSession sqlSession;
	
	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}
	
	// 상품관리 리스트 조회
	public List<ProdListVO> selectList(ProdListVO vo) {
		List<ProdListVO> prod_list = sqlSession.selectList("prod.prod_list", vo);
		return prod_list;
	}
	
	// 상품관리 건수 조회
	public int selectOne_count(ProdListVO vo) {
		int count = sqlSession.selectOne("prod.count", vo);
		return count;
	}
	
	// 상단 집계 조회
	public ProdTotalVO selectOne_tt(ProdTotalVO vo) {
		ProdTotalVO pvo = sqlSession.selectOne("prod.prod_tt", vo);
		return pvo;
	}
	
	// 상품 등록하기
	public int insert(ChainProdVO vo) {
		int res = sqlSession.insert("prod.prod_insert", vo);
		return res;
	}
	
	// 클릭한 tr의 정보 상세보기
	public ProdListVO selectOne(ProdListVO vo) {
		ProdListVO plvo = sqlSession.selectOne("prod.prod_sel", vo);
		return plvo;
	}
	
	// 그룹상품 추가 리스트 조회
	public List<ChaProdGrpVO> selectList_ga(ChaProdGrpVO vo) {
		List<ChaProdGrpVO> cpgvo = sqlSession.selectList("prod.ga_list", vo);
		return cpgvo;
	}
	
	// popup 판매 집계 조회
	public ProdTallyVO selectOne_tally(ProdTallyVO vo) {
		ProdTallyVO ptvo = sqlSession.selectOne("prod.prodtally", vo);
		return ptvo;
	}
	
	// popup 판매내역 리스트 조회
	public List<ProdHistVO> selectList_ph(ProdHistVO vo) {
		List<ProdHistVO> ph_list = sqlSession.selectList("prod.prodHist", vo);
		return ph_list;
	}
	
	// popup 상세보기 저장(상품 정보)
	public int update_det(ProdUpdateVO vo) {
		int res = sqlSession.update("prod.detUpdate", vo);
		return res;
	}
	
	// popup 상세보기 저장(새로운 그룹상품  insert)
	public int insert_ga(ProdUpdateVO ga_list) {
		int ga = sqlSession.insert("prod.insert_ga", ga_list);
		return ga;
	}
	
	// popup 상세보기 저장(기존 그룹상품 update)
	public int update_ga(ProdUpdateVO ga_list) {
		int ga = sqlSession.insert("prod.update_ga", ga_list);
		return ga;
	}
	
	// 체인점 1차 카테고리 리스트 가져오기
	public List<CateVO> selectList_cate1(CateVO vo) {
		List<CateVO> list = sqlSession.selectList("cate.cate1_list", vo);// 카테고리 mapper로 연결됨!!!!!!
		return list;
	}
	
	// 체인점 2차 카테고리 리스트 가져오기
	public List<CateVO> selectList_cate2(CateVO vo) {
		List<CateVO> list = sqlSession.selectList("cate.cate2_list", vo);// 카테고리 mapper로 연결됨!!!!!!
		return list;
	}
	
	// 체인점 3차 카테고리 리스트 가져오기
	public List<CateVO> selectList_cate3(CateVO vo) {
		List<CateVO> list = sqlSession.selectList("cate.cate3_list", vo);// 카테고리 mapper로 연결됨!!!!!!
		return list;
	}
	
	// 카테고리 이름들 가져오기
	public CateVO selectOne_names(CateVO vo) {
		CateVO cvo = sqlSession.selectOne("prod.cate_names", vo);
		return cvo;
	}
}






























