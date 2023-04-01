package dao.chain;

import java.util.List; 

import org.apache.ibatis.session.SqlSession;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import vo.CompanyUserVO;
import vo.CompanyVO;
import vo.newvo.CompanyListVO;
import vo.newvo.FranTotalVO;
import vo.newvo.PopUpdateVO;
import vo.newvo.SalesHistVO;
import vo.newvo.SalesTallyVO;


public class FranDAO {
	SqlSession sqlSession;
	
	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}
	
	// 가맹점 관리 리스트 조회
	public List<CompanyListVO> selectList(CompanyListVO vo) {
		List<CompanyListVO> fran_list = sqlSession.selectList("fran.fran_list", vo);
		return fran_list;
	}
	
	// 가맹점 리스트 건수 조회
	public int selectOne_count(CompanyListVO vo) {
		int count = sqlSession.selectOne("fran.count", vo);
		return count;
	}
	
	// 가맹점 관리 집계 조회
	public FranTotalVO selectOne_tt(String chaincode) {
		FranTotalVO vo = sqlSession.selectOne("fran.fran_tt", chaincode);
		return vo;
	}
	
	// 등록 시 사업자번호 중복체크
	public int corpnum_check(String corpnum) {
		int res = sqlSession.selectOne("fran.corpnum_check", corpnum);
		return res;
	}
	
	// 가맹점 등록하기
	public int insert(CompanyVO vo, String chaincode) {
		int res = sqlSession.insert("fran.fran_insert", vo);
		CompanyVO c_vo = sqlSession.selectOne("fran.comp_sel", vo);
		c_vo.setChaincode(chaincode);
		int result = sqlSession.insert("fran.chaincom_ins", c_vo);
		return res;
	}
	
	// 클릭한 tr의 정보 가져오기
	public CompanyVO selectOne_sel(String compcd, String chaincode) {
		CompanyVO c_vo = sqlSession.selectOne("fran.compcd", compcd);
		c_vo.setChaincode(chaincode);
		CompanyVO vo = sqlSession.selectOne("fran.tr_sel", c_vo);
		return vo;
	}
	
	// 사용자 추가의 리스트 가져오기
	public List<CompanyUserVO> selectList_ua(String compcd) {
		List<CompanyUserVO> vo = sqlSession.selectList("fran.ua_list", compcd);
		return vo;
	}
	
	// popup 판매집계
	public SalesTallyVO selectOne_st(String compcd) {
		SalesTallyVO vo = sqlSession.selectOne("fran.salesTally", compcd);
		return vo;
	}
	
	// 사용자 추가의 리스트 가져오기
	public List<SalesHistVO> selectList_sh(SalesHistVO vo) {
		List<SalesHistVO> shvo = sqlSession.selectList("fran.salesHist", vo);
		return shvo;
	}
	
	// 사용자 추가 아이디 중복체크하기
	public int selectOne_id(PopUpdateVO vo) {
		int res = sqlSession.selectOne("fran.ua_idcheck", vo);
		return res;
	}
	
	// popup 상세보기 저장(가맹점 정보)
	public int update_det(PopUpdateVO vo) {
		int pvo = sqlSession.update("fran.detUpdate", vo);
		int pvo2 = sqlSession.update("fran.detUpdate2", vo);
		return pvo+pvo2;
	}
	
	// popup 상세보기 저장(사용자 정보)
	public int insert_ua(PopUpdateVO ua_list) {
		int ua = sqlSession.insert("fran.insert_ua", ua_list);
		return ua;
	}
}




























