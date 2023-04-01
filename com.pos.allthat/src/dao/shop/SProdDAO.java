package dao.shop;

import java.util.List;

import org.apache.ibatis.session.SqlSession;

import vo.newvo.CateVO;
import vo.newvo.ProdHistVO;
import vo.newvo.ProdTallyVO;
import vo.shopvo.SProdListVO;
import vo.shopvo.SProdMoveVO;
import vo.shopvo.SProdTopVO;
import vo.shopvo.SProdUpdateVO;

public class SProdDAO {
	SqlSession sqlSession;
	
	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}
	
	// 상품관리 리스트 조회
	public List<SProdListVO> selectList(SProdListVO vo) {
		List<SProdListVO> prod_list = sqlSession.selectList("sprod.sprod_list", vo);
		return prod_list;
	}
	
	// 상품건수 조회
	public int selectOne_count(SProdListVO vo) {
		int count = sqlSession.selectOne("sprod.sprod_count", vo);
		return count;
	}
	
	// 상단집계 조회
	public SProdTopVO selectOne_top(SProdTopVO vo) {
		SProdTopVO tvo = sqlSession.selectOne("sprod.sprod_top", vo);
		return tvo;
	}
	
	// 상품 등록하기(체인점x)
	public int insert(SProdListVO vo) {
		int res = sqlSession.insert("sprod.sprod_insert", vo);
		return res;
	}
	
	// 상품 등록하기2(체인에 소속된 가맹점일 경우 가맹점 상품 등록후 체인 상품 등록)
	public int insert2(SProdListVO vo) {
		int res = sqlSession.insert("sprod.sprod_insert", vo);
		sqlSession.insert("sprod.sprod_insert2", vo);//체인점 상품에 등록
		return res;
	}
	
	// 상품 상세보기
	public SProdListVO selectOne_sel(SProdListVO vo) {
		SProdListVO svo = sqlSession.selectOne("sprod.sprod_sel", vo);
		return svo;
	}
	
	// 그룹상품 추가 리스트
	public List<SProdListVO> selectList_ga(SProdListVO vo) {
		List<SProdListVO> ga_list = sqlSession.selectList("sprod.sprod_ga", vo);
		return ga_list;
	}
	
	// 상세보기 판매집계 조회
	public ProdTallyVO selectOne_tally(ProdTallyVO vo) {
		ProdTallyVO tvo = sqlSession.selectOne("sprod.sprod_tally", vo);
		return tvo;
	}
	
	// 상세보기 판매이력 조회
	public List<ProdHistVO> selectList_ph(ProdHistVO vo) {
		List<ProdHistVO> ph_list = sqlSession.selectList("sprod.sprod_hist", vo);
		return ph_list;
	}
	
	// 상세보기 저장(상품정보)
	public int update_det(SProdUpdateVO vo) {
		int res = sqlSession.update("sprod.detUpdate", vo);
		return res;
	}
	
	// 상세보기 저장(그룹상품 정보)
	public int insert_ga(SProdUpdateVO ga_list) {
		int ga = sqlSession.insert("sprod.insert_ga", ga_list);
		return ga;
	}
	
	// 상세보기 저장2(그룹상품 정보)
	public int insert_ga2(SProdUpdateVO ga_list2) {
		int ga2 = sqlSession.insert("sprod.insert_ga2", ga_list2);
		return ga2;
	}
	
	// 상품이관에서 상품리스트 조회
	public List<SProdListVO> selectList2(SProdListVO vo) {
		List<SProdListVO> prod_list = sqlSession.selectList("sprod.sprod_list2", vo);
		return prod_list;
	}
	
	// 선택 이관상품 이관하기
	public int selectMove(SProdMoveVO vo) {
		int res = sqlSession.update("sprod.sprod_move", vo);
		System.out.println(vo.getProdAll());
		if(vo.getProdAll().equals("Y")) {
			System.out.println("--");
			int res2 = sqlSession.update("sprod.sprod_stock", vo);
			int res3 = sqlSession.update("sprod.sprod_zero", vo);
		}
		return res;
	}
	
	// 가맹점 1차 카테고리 리스트 가져오기
	public List<CateVO> selectList_cate1(CateVO vo) {
		List<CateVO> list = sqlSession.selectList("scate.scate1_list", vo);// 카테고리 mapper로 연결됨!!!!!!
		return list;
	}
	
	// 가맹점 2차 카테고리 리스트 가져오기
	public List<CateVO> selectList_cate2(CateVO vo) {
		List<CateVO> list = sqlSession.selectList("scate.scate2_list", vo);// 카테고리 mapper로 연결됨!!!!!!
		return list;
	}
	
	// 가맹점 3차 카테고리 리스트 가져오기
	public List<CateVO> selectList_cate3(CateVO vo) {
		List<CateVO> list = sqlSession.selectList("scate.scate3_list", vo);
		return list;
	}
	
	// 카테고리 이름들 가져오기
	public CateVO selectOne_names(CateVO vo) {
		CateVO cvo = sqlSession.selectOne("sprod.scate_names", vo);
		return cvo;
	}
}























