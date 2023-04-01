package dao.shop;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;

import vo.shopvo.ScreenVO;

public class SScreenDAO {
	SqlSession sqlSession;
	
	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}

	// 등록된 화면 리스트 조회
	public List<ScreenVO> selectList(ScreenVO vo) {
		List<ScreenVO> list = sqlSession.selectList("sscreen.screen_list", vo);
		return list;
	}
	
	// 등록그룹 리스트 조회
	public int selectOne_count(ScreenVO vo) {
		int count = sqlSession.selectOne("sscreen.count", vo);
		return count;
	}
	
	// 고객화면등록 마스터
	public String insert1(ScreenVO vo) {
		String screencode = sqlSession.selectOne("sscreen.make_scncode");// 스크린코드 만들기
		vo.setScreencode(screencode);
		int res = sqlSession.insert("sscreen.insert1", vo);
		return screencode;
	}
	
	// 이미지코드 만들기
	public String make_imgcode() {
		String imgcode = sqlSession.selectOne("sscreen.make_imgcode");
		return imgcode;
	}
	
	// 이미지등록 서브
	public void insert_img(ScreenVO vo) {
		sqlSession.insert("sscreen.insert_img", vo);
	}
	
	// 이미지 실패 하면 db 삭제
	public void delete_img(String imgcode) {
		sqlSession.delete("sscreen.delete_img", imgcode);
	}

	// 스크린 상세보기
	public Map<String, Object> select_detail(String screencode) {
		ScreenVO vo = sqlSession.selectOne("sscreen.detail", screencode);//마스터
		List<ScreenVO> list = sqlSession.selectList("sscreen.detail2", screencode);//서브
		Map<String, Object> readMap=new HashMap<String, Object>();
		readMap.put("vo", vo);
		readMap.put("list", list);
		return readMap;
	}
	
	// 스크린 삭제하기
	public int del_screen(String screencode) {
		int res = sqlSession.delete("sscreen.del_screen", screencode);//마스터
		sqlSession.delete("sscreen.del_img", screencode);//서브
		return res;
	}
	
	// 마스터 수정
	public int modi_master(ScreenVO vo) {
		int res = sqlSession.update("sscreen.modi_mas", vo);
		return res;
	}
	
	// 기존에 있던 이미지 수정
	public void exis_img(ScreenVO svo) {
		sqlSession.update("sscreen.exis_img", svo);
	}
	
	// 삭제한 이미지db에서 삭제하기
	public void detimg_del(String imgcode) {
		sqlSession.delete("sscreen.detimg_del", imgcode);
	}
}
