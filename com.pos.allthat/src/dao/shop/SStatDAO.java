package dao.shop;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;

import vo.shopvo.SCalenVO;
import vo.shopvo.SStatGraphVO;

public class SStatDAO {
	SqlSession sqlSession;
	
	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}
	
	// 그래프 조회
	public Map<String, Object> selectList_grp(SCalenVO vo) {
		List<SStatGraphVO> mlist = sqlSession.selectList("sstat.sstat_mgrp", vo);
		List<SStatGraphVO> wlist = sqlSession.selectList("sstat.sstat_wgrp", vo);
		List<SStatGraphVO> tlist = sqlSession.selectList("sstat.sstat_tgrp", vo);
		
		Map<String, Object> list = new HashMap<String, Object>();
		list.put("mlist", mlist);
		list.put("wlist", wlist);
		list.put("tlist", tlist);
		
		return list;
	}// 그래프 조회
	
}
