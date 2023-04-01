package dao.chain;

import java.io.File;
import java.util.List;

import org.apache.ibatis.session.SqlSession;

import vo.NoticeVO;

public class NotiDAO {
	SqlSession sqlSession;
	
	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}
	
	// 공지사항 리스트 조회
	public List<NoticeVO> selectList(NoticeVO vo) {
		List<NoticeVO> list = sqlSession.selectList("noti.noti_list", vo);
		return list;
	}
	
	// 리스트 건수 조회
	public int selectOne_count(NoticeVO vo) {
		int count = sqlSession.selectOne("noti.count", vo);
		return count;
	}
	
	// 가맹점 리스트 조회
	public List<NoticeVO> selectList_comp(NoticeVO vo) {
		List<NoticeVO> list = sqlSession.selectList("noti.comp_list", vo);
		return list;
	}
	
	// 공지사항 저장1
	public NoticeVO insert1(NoticeVO vo) {
		String noticecode = vo.getNoticecode();
		System.out.println(noticecode);
		if(noticecode == null || noticecode.equals("") || noticecode.equals("null")) {// 공지코드 없으면
			System.out.println("-----------여기 들어오냐 새로 글쓰기-----------");
			noticecode = sqlSession.selectOne("noti.make_noticd");//공지코드 만들기
			vo.setNoticecode(noticecode);
		}
		
		sqlSession.insert("noti.noti_insert1", vo);//저장1(pos_chainnotice)
		NoticeVO nvo = sqlSession.selectOne("noti.read_info", vo.getNoticecode());// 저장한 내용 가져오기(공지코드 위해서)
		return nvo;
	}
	
	// 공지 코드 가져오기
	public String selectOne(NoticeVO vo) {
		String noticecode = sqlSession.selectOne("noti.sel_noticd", vo);
		return noticecode;
	}
	
	// 기존에 있는거 삭제
	public int delete(String noticecode) {
		int res = sqlSession.delete("noti.noti_delete", noticecode);// 있는거 먼저 삭제
		return res;
	}
	
	// 공지사항 저장2
	public int insert2(NoticeVO nvo) {
		int res2 = sqlSession.insert("noti.noti_insert2", nvo);//저장2(pos_compnotice)
		return res2;
	}
	
	// 상세보기 정보 가져오기
	public NoticeVO selectOne_read(NoticeVO vo) {
		NoticeVO nvo = sqlSession.selectOne("noti.read_info", vo);
		return nvo;
	}
	
	// 가맹점 수신여부
	public List<NoticeVO> selectList_readyn(NoticeVO vo) {
		List<NoticeVO> list = sqlSession.selectList("noti.readyn_list", vo);
		return list;
	}
	
	// 공지사항 수정 : 공지대상 선택했던 리스트 가져오기
	public List<NoticeVO> selectList_target(String noticecode) {
		List<NoticeVO> list = sqlSession.selectList("noti.target", noticecode);
		return list;
	}
	
	// 공지사항 삭제
	public int delete_noti(String noticecode) {
		int res = sqlSession.delete("noti.delete", noticecode);
		// 경로에 있는 진짜 파일 삭제
		List<NoticeVO> url = sqlSession.selectList("noti.sel_url", noticecode);//해당 파일의 url 가져오기
		String path = "C:\\allthatpos_upload\\notice";
		
		if(url.size() > 0) {
			for(int i = 0; i < url.size(); i++) {
				File file = new File(path + url.get(i));
				System.out.println("파일 주소 보기 : " + file);
				
				if(file.exists()) {
					if(file.delete()) {
						System.out.println("파일삭제 성공");
					} else {
						System.out.println("파일삭제 실패");
					}
				} else {
					System.out.println("파일이 존재하지 않습니다");
				}//else
			}//for문
		}//if문 여기까지
		
		sqlSession.delete("noti.delete_file", noticecode);//파일첨부 삭제(공지코드로)
		return res;
	}
	
	// 파일첨부 저장
	public void insert_file(NoticeVO vo) {
		sqlSession.insert("noti.insert_file", vo);
	}
	
	// 파일첨부 삭제(db에만)
	public void delete_file(String noticecode) {
		sqlSession.delete("noti.delete_file", noticecode);
	}
	
	// 첨부파일 가져오기
	public List<NoticeVO> selectList_file(String noticecode) {
		List<NoticeVO> list = sqlSession.selectList("noti.select_file", noticecode);
		return list;
	}
	
	// 삭제한 첨부파일 삭제
	public void delete_file(String filecode, String noticecode) {
		String url = sqlSession.selectOne("noti.sel_url2", filecode);//해당 파일의 url 가져오기
		System.out.println("삭제하려고 하는 url : "+url);
		
		String path = "C:\\allthatpos_upload\\notice";
		
		File file = new File(path + url);
		System.out.println("파일 주소 보기 : " + file);
		
		if(file.exists()) {
			if(file.delete()) {
				System.out.println("파일삭제 성공");
			} else {
				System.out.println("파일삭제 실패");
			}
		} else {
			System.out.println("파일이 존재하지 않습니다");
		}
		
		sqlSession.delete("noti.remove_file", filecode);//db에 있는 파일 url 삭제	
	}
}
