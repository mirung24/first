package dao.chain;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;

import vo.newvo.StatGraphVO;

public class StatDAO {
	SqlSession sqlSession;
	
	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}
	
	// 그래프 조회
	public Map<String, Object> selectList_grf(String chaincode) {
		List<StatGraphVO> mlist = sqlSession.selectList("stat.stat_mgrf", chaincode);
		List<StatGraphVO> wlist = sqlSession.selectList("stat.stat_wgrf", chaincode);
		List<StatGraphVO> hlist = sqlSession.selectList("stat.stat_hgrf", chaincode);
		
		Map<String, Object> list = new HashMap<String, Object>();
		list.put("mlist", mlist);
		list.put("wlist", wlist);
		list.put("hlist", hlist);
		
		return list;
	}
}
