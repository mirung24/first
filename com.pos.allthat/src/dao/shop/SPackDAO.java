package dao.shop;

import java.util.List;

import org.apache.ibatis.session.SqlSession;

import vo.shopvo.SProdListVO;

public class SPackDAO {
	SqlSession sqlSession;
	
	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}
	
	// 상품포장관리 리스트 조회
	public List<SProdListVO> selectList(SProdListVO vo) {
		List<SProdListVO> pack_list = sqlSession.selectList("spack.spack_list", vo);
		return pack_list;
	}
	
	// 상품포장관리 조회건수
	public int selectOne_count(SProdListVO vo) {
		int count = sqlSession.selectOne("spack.count", vo);
		return count;
	}
	
	// 그룹상품 추가 리스트
	public List<SProdListVO> selectList_ga2(SProdListVO vo) {
		List<SProdListVO> ga_list = sqlSession.selectList("spack.spack_ga", vo);
		return ga_list;
	}
	
	// 그룹상품 최다, 최소, 최고
	public List<SProdListVO> selectList_price(SProdListVO vo) {
		List<SProdListVO> ga_price = sqlSession.selectList("spack.spack_barcode", vo);
		return ga_price;
	}
}























