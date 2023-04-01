package dao.chain;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;

import vo.newvo.MainChartVO1;
import vo.newvo.MainChartVO2;
import vo.newvo.MainChartVO3;
import vo.newvo.MainChartVO4;
import vo.newvo.MainChartVO5;
import vo.newvo.MainGraphVO;
import vo.newvo.MainInfoVO;

public class MainDAO {
	SqlSession sqlSession;
	
	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}
	
	// 매출집계
	public Map<String, Object> topstat(String chaincode) {
		MainInfoVO yesterday = sqlSession.selectOne("main.yesterday", chaincode); // 전일집계
		MainInfoVO thisyear = sqlSession.selectOne("main.thisyear", chaincode); // 금년집계
		MainInfoVO thismonth = sqlSession.selectOne("main.thismonth", chaincode); // 이번달집계
		MainInfoVO thisweek = sqlSession.selectOne("main.thisweek", chaincode); // 주간집계
		MainInfoVO newcomp = sqlSession.selectOne("main.newcomp", chaincode); // 신규가맹
		MainInfoVO best = sqlSession.selectOne("main.best", chaincode); // best고객
		Map<String, Object> readMap=new HashMap<String, Object>();
		readMap.put("yesterday", yesterday);
		readMap.put("thisyear", thisyear);
		readMap.put("thismonth", thismonth);
		readMap.put("thisweek", thisweek);
		readMap.put("newcomp", newcomp);
		readMap.put("best", best);
		return readMap;
	}
	
	// 타임라인(주간)
	public List<MainInfoVO> weektl(String chaincode) {
		List<MainInfoVO> list = sqlSession.selectList("main.weektl", chaincode);
		return list;
	}
	
	// 타임라인(월간)
	public List<MainInfoVO> monthtl(String chaincode) {
		List<MainInfoVO> list = sqlSession.selectList("main.monthtl", chaincode);
		return list;
	}
	
	// 주간 가맹점, 상품 순위
	public List<MainGraphVO> comprank(MainGraphVO vo) {
		List<MainGraphVO> list = sqlSession.selectList("main.comprank", vo);
		return list;
	}
	
	
	
	
	
	
	
	// 그래프 조회
	public List<MainGraphVO> selectList_grf(String chaincode) {
		List<MainGraphVO> list = sqlSession.selectList("main.sales_grf", chaincode);
		return list;
	}
	
	// 주간 best 가맹점 조회
	public Map<String, Object> selectList_cht(String chaincode) {
		List<MainChartVO1> list1 = sqlSession.selectList("main.best_com", chaincode);
		List<MainChartVO2> list2 = sqlSession.selectList("main.best_prod", chaincode);
		List<MainChartVO3> list3 = sqlSession.selectList("main.worst_com", chaincode);
		List<MainChartVO4> list4 = sqlSession.selectList("main.worst_prod", chaincode);
		List<MainChartVO5> list5 = sqlSession.selectList("main.ncom_total", chaincode);
		Map<String, Object> readMap=new HashMap<String, Object>();
		readMap.put("list1", list1);
		readMap.put("list2", list2);
		readMap.put("list3", list3);
		readMap.put("list4", list4);
		readMap.put("list5", list5);
		return readMap;
	}
	
}























