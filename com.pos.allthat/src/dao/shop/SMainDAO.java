package dao.shop;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;

import vo.newvo.MainGraphVO;
import vo.shopvo.MainChartVO1;
import vo.shopvo.MainChartVO2;
import vo.shopvo.MainChartVO3;
import vo.shopvo.MainChartVO4;
import vo.shopvo.MainInfoVO;
import vo.shopvo.SIncomeDetVO;

public class SMainDAO {
	SqlSession sqlSession;
	
	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}
	
	// 매출 집계
	public Map<String, Object> selectOne_mi(String compcd) {
		MainInfoVO vo1 = sqlSession.selectOne("smain.main_info", compcd);
		MainInfoVO vo2 = sqlSession.selectOne("smain.main_cust", compcd);
		Map<String, Object> shopTot = new HashMap<String, Object>();
		shopTot.put("vo1", vo1);
		shopTot.put("vo2", vo2);
		return shopTot;
	}
	
	// 그래프 조회
	public List<MainGraphVO> selectList_grf(String compcd) {
		List<MainGraphVO> list = sqlSession.selectList("smain.main_grf", compcd);
		return list;
	}
	
	// 차트 불러오기
	public Map<String, Object> selectList_cht(SIncomeDetVO vo) {
//		List<MainChartVO1> list1 = sqlSession.selectList("smain.best_prod", vo);
//		List<MainChartVO2> list2 = sqlSession.selectList("smain.worst_prod", vo);
		List<MainChartVO3> list3 = sqlSession.selectList("smain.new_cust", vo);
		List<MainChartVO4> list4 = sqlSession.selectList("smain.top_prod", vo);
		List<MainChartVO4> list5 = sqlSession.selectList("smain.sub_prod", vo);
		Map<String, Object> shopChart = new HashMap<String, Object>();
//		shopChart.put("list1", list1);
//		shopChart.put("list2", list2);
		shopChart.put("list3", list3);
		shopChart.put("list4", list4);
		shopChart.put("list5", list5);
		return shopChart;
	}
	
	// 상품추가 리스트 조회
	public List<SIncomeDetVO> selectList_regiList(SIncomeDetVO vo) {
		List<SIncomeDetVO> regi_list = sqlSession.selectList("smain.smain_regiList", vo);
		return regi_list;
	}
	
	// 선택한 상품 제외
	public int except_insert(SIncomeDetVO vo) {
		int res = sqlSession.insert("smain.except_insert", vo);
		return res;
	}
	
	// 제외한 상품 미리보기
	public List<SIncomeDetVO> selectList_preview(SIncomeDetVO vo) {
		List<SIncomeDetVO> pre_prod = sqlSession.selectList("smain.preview_prod", vo);
		return pre_prod;
	}
	
	// 제외 취소할 상품
	public int except_delete(SIncomeDetVO vo) {
		int res = sqlSession.delete("smain.except_delete", vo);
		return res;
	}
	
	// 가맹점 전체 제외상품 취소
	public int all_remove(SIncomeDetVO vo) {
		int res = sqlSession.delete("smain.all_remove", vo);
		return res;
	}
	
	// best상품 차트 조회
	public List<MainChartVO1> best_prod(SIncomeDetVO vo) {
		List<MainChartVO1> best_prod = sqlSession.selectList("smain.best_prod", vo);
		return best_prod;
	}
	
	// worst상품 차트 조회
	public List<MainChartVO2> worst_prod(SIncomeDetVO vo) {
		List<MainChartVO2> worst_prod = sqlSession.selectList("smain.worst_prod", vo);
		return worst_prod;
	}
	
}
