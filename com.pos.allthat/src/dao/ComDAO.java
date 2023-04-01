package dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;

import vo.CodeVO;
import vo.shopvo.AccountVO;

public class ComDAO {
	SqlSession sqlSession;
	
	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}
	
	// 사용자 추가 리스트 (대표, 사원)
	public List<CodeVO> selectList_ua(CodeVO vo) {
		List<CodeVO> list = sqlSession.selectList("com.com_select", vo);
		return list;
	}
	
	// 카드사명 selectbox
	public List<CodeVO> selectList_card(CodeVO vo) {
		List<CodeVO> list = sqlSession.selectList("com.com_select", vo);
		return list;
	}
	
	// 거래처 리스트 가져오기 select
	public List<AccountVO> selectList_account(AccountVO vo) {
		List<AccountVO> list = sqlSession.selectList("com.com_account", vo);
		return list;
	}
	
	// 과세 select 가져오기(과세, 비과세, 과세포함)
	public List<CodeVO> selectList_tax(CodeVO vo) {
		List<CodeVO> list = sqlSession.selectList("com.com_select", vo);
		return list;
	}
	
	// 로고 이미지 경로 가져오기(가맹점)
	public String logoImg_shop(String regcd) {
		String logo = sqlSession.selectOne("com.logoImg", regcd);
		return logo;
	}
	
	// 로고 이미지 경로 가져오기(가맹점)
	public String logoImg_chain(String regcd) {
		String logo = sqlSession.selectOne("com.logoImg2", regcd);
		return logo;
	}
	
	// temp에 있는 해당 가맹점 데이터 지우기
	public int temp_delete(String compcd) {
		int res = sqlSession.delete("com.temp_delete", compcd);
		return res;
	}
	
	// 받은 api 테이블 temp에 집어넣기
	public int temp_insert(Map<String, Object> map) {
		int result = sqlSession.insert("com.temp_insert", map);
		return result;
	}
	
	// paymentcd가 중복된 애들 지우기
	public void dupli_del(String compcd) {
		sqlSession.delete("com.dupli_del", compcd);
		System.out.println("----paymentcd 지웁니당~~----");
	}
	
	// y,n 유무에 따라 보이기/숨기기 설정
	public String selectOne_yn(String compcd) {
		String connectyn = sqlSession.selectOne("com.connectyn", compcd);
		return connectyn;
	}
}
