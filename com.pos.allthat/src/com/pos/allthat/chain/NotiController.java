package com.pos.allthat.chain;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FileUtils;
import org.apache.ibatis.io.Resources;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.google.gson.JsonObject;

import dao.chain.NotiDAO;
import util.Common;
import vo.NoticeVO;

@Controller
public class NotiController {

	@Autowired
	HttpServletRequest request;
	
	NotiDAO noti_dao;
	
	public NotiController(NotiDAO noti_dao) {
		this.noti_dao = noti_dao;
		System.out.println("--NotiController생성자 호출--");
	}
	
	// 공지사항 페이지로 이동
	@RequestMapping(value = "/notice.do") 
	public String notice(Model model) {
		System.out.println("공지사항 페이지로 이동!");
		model.addAttribute("select", "chain");
		return Common.CHAIN_PATH + "notice.jsp";
	}
	
	// 글쓰기 페이지로 이동/ 수정하기 페이지로 이동
	@RequestMapping(value = "/write.do")
	public String write(String noticecode, Model model) {
		System.out.println("-----공지사항 글쓰기 페이지로 이동-----");
		model.addAttribute("noticecode", noticecode);
		return Common.CHAIN_PATH + "write.jsp";
	}// 글쓰기 페이지로 이동/ 수정하기 페이지로 이동
	
	// 공지사항 리스트 조회/ 건수 조회
	@ResponseBody
	@RequestMapping(value = "/notice_list.do", produces = "application/json; charset=utf8")
	public Object notice_list(@ModelAttribute("NoticeVO") NoticeVO vo) {
		System.out.println("-----체인본점 공지사항 리스트 조회-----");
		
		int count = noti_dao.selectOne_count(vo);
		List<NoticeVO> list = noti_dao.selectList(vo);
		
		JSONObject jsonObject = new JSONObject();               
		jsonObject.put("count", count);
		jsonObject.put("data", list);
	      
	    return jsonObject.toString();
	}// 공지사항 리스트 조회/ 건수 조회
	
	// 가맹점 리스트 조회
	@ResponseBody
	@RequestMapping(value = "/company_list.do", produces = "application/json; charset=utf8")
	public Object company_list(@ModelAttribute("NoticeVO") NoticeVO vo) {
		System.out.println("-----체인본점 가맹점 리스트 조회-----");
		
		List<NoticeVO> list = noti_dao.selectList_comp(vo);
		
		JSONObject jsonobject = new JSONObject();
		jsonobject.put("data", list);
		
		return jsonobject.toString();
	}// 가맹점 리스트 조회
	
	// 공지사항 저장
	@ResponseBody
	@RequestMapping(value = "/notice_save.do", produces = "application/json; charset=utf8")
	public Object notice_save(@ModelAttribute("NoticeVO") NoticeVO vo) {
		System.out.println("-----체인본점 공지사항 저장-----");
		
		System.out.println("----------noticecode: "+ vo.getNoticecode());
		
		String compcd = vo.getCompcdArr().replaceAll("\\[", "").replaceAll("\\]", "").replace("\"", "");
		String[] compcdArr1 = compcd.split(",");
		vo.setCompcdArr1(compcdArr1);
		System.out.println("-------compcd"+compcd);
		
		NoticeVO res = noti_dao.insert1(vo);// 공지사항 저장1(pos_chainnotice)
		String noticecode = noti_dao.selectOne(res);//공지코드 가져오기
		
		noti_dao.delete(noticecode);//기존에 있는거 삭제
		
		for(int i = 0; i < vo.getCompcdArr1().length; i++) {
			NoticeVO nvo = new NoticeVO();
			
			nvo.setNoticecode(noticecode);
			nvo.setCompcdArr(compcdArr1[i]);
			
			int res2 = noti_dao.insert2(nvo);// 공지사항 저장2(pos_compnotice)
		}
		
		JSONObject jsonobject = new JSONObject();
		jsonobject.put("data", noticecode);
		
		return jsonobject.toString();
	}// 공지사항 저장
	
	// 공지사항 상세보기 페이지로 이동
	@RequestMapping(value = "/read.do")
	public String read(String noticecode, Model model) {
		System.out.println("-----공지사항 상세보기 페이지로 이동-----");
		model.addAttribute("noticecode", noticecode);
		return Common.CHAIN_PATH + "read.jsp";
	}
	
	// 상세보기 정보 가져오기
	@ResponseBody
	@RequestMapping(value = "/read_info.do", produces = "application/json; charset=utf8")
	public Object read_info(@ModelAttribute("NoticeVO") NoticeVO vo) {
		System.out.println("-----공지사항 상세보기 정보 가져오기-----");
		NoticeVO nvo = noti_dao.selectOne_read(vo);
		return nvo;
	}// 상세보기 정보 가져오기
	
	// 가맹점 수신여부
	@ResponseBody
	@RequestMapping(value = "/readyn.do", produces = "application/json; charset=utf8")
	public Object readyn(@ModelAttribute("NoticeVO") NoticeVO vo) {
		System.out.println("-----공지사항 가맹점 수신여부-----");
		
		List<NoticeVO> list = noti_dao.selectList_readyn(vo);
		
		JSONObject jsonobject = new JSONObject();
		jsonobject.put("data", list);
		
		return jsonobject.toString();
	}// 가맹점 수신여부
	
	// 공지사항 수정: 공지대상 선택했던 리스트 가져오기
	@ResponseBody
	@RequestMapping(value = "/target.do", produces = "application/json; charset=utf8")
	public Object target(String noticecode) {
		System.out.println("-----공지대상 선택리스트 가져오기-----");
		
		List<NoticeVO> list = noti_dao.selectList_target(noticecode);
		
		JSONObject jsonobject = new JSONObject();
		jsonobject.put("data", list);
		
		return jsonobject.toString();
	}// 공지사항 수정: 공지대상 선택했던 리스트 가져오기
	
	// 공지사항 삭제
	@ResponseBody
	@RequestMapping(value = "/noti_remove.do", produces = "application/json; charset=utf8")
	public Object noti_remove(String noticecode) {
		System.out.println("-----공지사항 삭제-----");
		
		noti_dao.delete(noticecode);//기존에 있는거 삭제(pos_compnotice)
		int res = noti_dao.delete_noti(noticecode);//공지사항 삭제(pos_chainnotice)
		
		return res;
	}// 공지사항 삭제
	
	// 이미지 업로드
	@ResponseBody
	@RequestMapping(value = "/image_upload.do", produces = "application/json; charset=utf8")
	public Object image_upload(@RequestParam("file") MultipartFile multipartFile) {
		System.out.println("-----이미지 업로드-----");
		JsonObject jsonObject = new JsonObject();
		
		System.out.println(multipartFile);
		
		// 내부경로로 저장
//		String contextRoot = new HttpServletRequestWrapper(request).getRealPath("/");
//		System.out.println(contextRoot);
//		String fileRoot = contextRoot+"/img/";
		
		// 외부경로로 저장을 희망할때.
//		String fileRoot = "C:\\allthatpos_upload\\notice\\image\\"; 
		
		String filepath = "config/filepath.properties";
		Properties properties = new Properties();
		
		try {
			Reader reader = Resources.getResourceAsReader(filepath);
			properties.load(reader);
		} catch (IOException e1) {e1.printStackTrace();}
		
		String originalFileName = multipartFile.getOriginalFilename();	//오리지날 파일명
		String extension = originalFileName.substring(originalFileName.lastIndexOf("."));//파일 확장자
		String savedFileName = UUID.randomUUID() + extension;//저장될 파일 명
		
//		File targetFile = new File(fileRoot + savedFileName);
		
		File targetFile = new File(properties.getProperty("filepath.noticeImg") + savedFileName);
		try {
			InputStream fileStream = multipartFile.getInputStream();
			FileUtils.copyInputStreamToFile(fileStream, targetFile);	//파일 저장
			jsonObject.addProperty("url", "\\image\\"+savedFileName); // contextroot + resources + 저장할 내부 폴더명
//			jsonObject.addProperty("url", properties.getProperty("filepath.noticeImg") + savedFileName); // contextroot + resources + 저장할 내부 폴더명
			jsonObject.addProperty("responseCode", "success");
				
		} catch (IOException e) {
			FileUtils.deleteQuietly(targetFile);//저장된 파일 삭제
			jsonObject.addProperty("responseCode", "error");
			e.printStackTrace();
		}
		String a = jsonObject.toString();
		return a;
	}// 이미지 업로드
	
	// 파일 첨부 저장
	@ResponseBody
	@RequestMapping(value = "/file_upload.do", produces = "text/json; charset=utf8")
	public Object file_upload(@RequestParam("file") MultipartFile multipartFile, String noticecode) {
		System.out.println("-----체인점 공지사항 파일첨부 저장-----");
		JsonObject jsonObject = new JsonObject();

		// 외부경로로 저장을 희망할때.
//		String fileRoot = "C:\\allthatpos_upload\\notice\\file\\"; 
		
		String filepath = "config/filepath.properties";
		Properties properties = new Properties();
		
		try {
			Reader reader = Resources.getResourceAsReader(filepath);
			properties.load(reader);
		} catch (IOException e1) {e1.printStackTrace();}
		
		String originalFileName = multipartFile.getOriginalFilename();	//오리지날 파일명(확장자 포함)
		int i = originalFileName.indexOf(".");//점이 있는 위치의 숫자
		String name = originalFileName.substring(0, i);//이름만 구하기

		String extension = originalFileName.substring(originalFileName.lastIndexOf("."));//파일 확장자
		String savedFileName = UUID.randomUUID() + extension;//저장될 파일 명
		
//		File targetFile = new File(fileRoot + savedFileName);
		File targetFile = new File(properties.getProperty("filepath.noticeFile") + savedFileName);
	
		try {
			InputStream fileStream = multipartFile.getInputStream();
			FileUtils.copyInputStreamToFile(fileStream, targetFile);	//파일 저장
			jsonObject.addProperty("url", "\\file\\"+savedFileName); // contextroot + resources + 저장할 내부 폴더명
			jsonObject.addProperty("responseCode", "success");
			
			Path path = Paths.get(properties.getProperty("filepath.noticeFile")+savedFileName);
			long bytes = Files.size(path);
			
			System.out.println(bytes+" byte");
			
			NoticeVO vo = new NoticeVO();
			vo.setNoticecode(noticecode);
			vo.setUrl("\\file\\"+savedFileName);
			vo.setFilename(name);
			vo.setVolume(Integer.toString((int) bytes));
			vo.setExtension(extension);
			
			noti_dao.insert_file(vo);//db에 저장하기
		} catch (IOException e) {
			FileUtils.deleteQuietly(targetFile);//저장된 파일 삭제
			noti_dao.delete_file(noticecode);// db에도 삭제
			jsonObject.addProperty("responseCode", "error");
			e.printStackTrace();
		}
		String a = jsonObject.toString();
		return a;
	}// 파일 첨부 저장
	
	// 첨부파일 가져오기
	@ResponseBody
	@RequestMapping(value = "/attach_file.do", produces = "application/json; charset=utf8")
	public Object attach_file(String noticecode) {
		System.out.println("-----첨부파일 가져오기-----");
		
		List<NoticeVO> list = noti_dao.selectList_file(noticecode);
		
		JSONObject jsonobject = new JSONObject();
		jsonobject.put("data", list);
		
		return jsonobject.toString();
	}// 첨부파일 가져오기
	
	// 삭제한 파일 삭제하기
	@ResponseBody
	@RequestMapping(value = "/file_check.do", produces = "application/json; charset=utf8")
	public void file_check(String m, String noticecode) {
		System.out.println("-----수정: 기존에 있던 파일 존재 여부 체크-----");
		System.out.println(m);//["FIL000000000397529","FIL000000000397530"]
		
		String filecodes = m.replaceAll("\\[", "").replaceAll("\\]", "").replace("\"", "");
		String[] filecodeArr = filecodes.split(",");

		for(int i = 0; i < filecodeArr.length; i++) {
			noti_dao.delete_file(filecodeArr[i], noticecode);//db에 있는 파일 url 삭제
		}
	}// 기존에 있던 파일 존재 여부 체크
}
