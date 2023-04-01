package dao;

import org.apache.ibatis.session.SqlSession;

import vo.ChainUserVO;
import vo.CompanyUserVO;
import vo.UserLoghistVO;

public class UserDAO {
	SqlSession sqlSession;
	
	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}
	
	// 로그인 시 계정 여부 확인(체인점)
	public int acctChk(ChainUserVO vo) {
		int res = sqlSession.selectOne("user.acctChk", vo);
		return res;
	}
	
	// 로그인 시 계정 여부 확인(가맹점)
	public int SacctChk(CompanyUserVO vo) {
		int res = sqlSession.selectOne("user.SacctChk", vo);
		return res;
	}
	
	// 로그인 처리(체인점)
	public ChainUserVO login(ChainUserVO vo) {
		ChainUserVO uservo = sqlSession.selectOne("user.login", vo);
		return uservo;
	}
	
	// 로그인 처리(가맹점)
	public CompanyUserVO slogin(CompanyUserVO vo) {
		CompanyUserVO uservo = sqlSession.selectOne("user.slogin", vo);
		System.out.println("compcd: "+uservo.getCompcd());
		System.out.println("userid: "+uservo.getUserid());
		System.out.println("name: "+uservo.getName());
		
		return uservo;
	}
	
	//로그인 히스토리 처리(체인점)
	public int loghist(ChainUserVO vo) {
		int res = sqlSession.insert("user.loghist", vo);
		return res;
	}
	
	//로그인 히스토리 처리(가맹점)
	public int sloghist(CompanyUserVO vo) {
		int res = sqlSession.insert("user.loghist", vo);
		return res;
	}
	
	// 쿠키에 있는 id로 uservo 가져오기(체인점)
	public ChainUserVO checkUserWithSessionKey(String sessionId) {
		ChainUserVO uservo = sqlSession.selectOne("user.chk_sessionKey", sessionId);
		return uservo;
	}
	
	// 쿠키에 있는 id로 uservo 가져오기(가맹점)
	public CompanyUserVO checkUserWithSessionKey2(String sessionId) {
		CompanyUserVO uservo = sqlSession.selectOne("user.chk_sessionKey2", sessionId);
		return uservo;
	}
	
	
}
