package com.pos.allthat.shop;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FileUtils;
import org.apache.ibatis.io.Resources;
import org.json.JSONObject;
import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.JsonObject;

import dao.shop.SScreenDAO;
import util.Common;
import vo.NoticeVO;
import vo.shopvo.SInvenVO;
import vo.shopvo.ScreenVO;

@Controller
public class SScreenController {

	@Autowired
	HttpServletRequest request;
	
	SScreenDAO sscreen_dao;
	
	public SScreenController(SScreenDAO sscreen_dao) {
		this.sscreen_dao = sscreen_dao;
		System.out.println("--SScreenController 생성자 호출--");
	}
	
	// 고객화면관리 페이지로 이동
	@RequestMapping(value = "sscreen.do")
	public String sscreen(Model model) {
		System.out.println("-----고객화면관리 페이지로 이동-----");
		model.addAttribute("select", "shop");
		return Common.SHOP_PATH + "screen.jsp";
	}// 고객화면관리 페이지로 이동
	
	// 등록된 화면 리스트 조회/ 건수조회
	@ResponseBody
	@RequestMapping(value = "sscreen_list.do", produces = "application/json; charset=utf8")
	public Object sscreen_list(@ModelAttribute("ScreenVO") ScreenVO vo) {
		System.out.println("-----고객화면관리 등록그룹 리스트 조회-----");
		
		int count = sscreen_dao.selectOne_count(vo);
		List<ScreenVO> list = sscreen_dao.selectList(vo);
		
		JSONObject jsonObject = new JSONObject();               

		jsonObject.put("count", count);
	    jsonObject.put("data", list);
	      
	    return jsonObject.toString();
	}// 등록된 화면 리스트 조회/ 건수조회
	
	// 고객화면등록 마스터
	@ResponseBody
	@RequestMapping(value ="/master_regi.do", produces = "application/json; charset=utf8")
	public Object master_regi(@ModelAttribute("ScreenVO") ScreenVO vo) {
		System.out.println("-----고객화면관리 마스터 등록-----");
		
		String screencode = sscreen_dao.insert1(vo);
		
		JSONObject jsonobject = new JSONObject();
		jsonobject.put("data", screencode);
		
		return jsonobject.toString();
	}// 고객화면등록 마스터
	
	// 고객화면등록 서브(이미지 등록)
	@ResponseBody
	@RequestMapping(value ="/screen_img.do", produces = "application/json; charset=utf8")
	public Object screen_img(@RequestParam("img") MultipartFile multipartFile, String screencode,
			int ordernum, int displayti, String link) {
		System.out.println("-----고객화면관리 서브 등록(이미지 등록)-----");
		JsonObject jsonObject = new JsonObject();
		
		System.out.println(multipartFile);
		
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
		
		File targetFile = new File(properties.getProperty("filepath.screen") + savedFileName);
		String imgcode = sscreen_dao.make_imgcode();//이미지 코드 만들기
	
		try {
			InputStream fileStream = multipartFile.getInputStream();
			FileUtils.copyInputStreamToFile(fileStream, targetFile);	//파일 저장
			jsonObject.addProperty("url", "\\screen\\"+savedFileName); // contextroot + resources + 저장할 내부 폴더명
			jsonObject.addProperty("responseCode", "success");
			
			Path path = Paths.get(properties.getProperty("filepath.screen")+savedFileName);
			long bytes = Files.size(path);
			System.out.println(bytes+" byte");
			
			ScreenVO vo = new ScreenVO();
			vo.setImgcode(imgcode);
			vo.setScreencode(screencode);
			vo.setUrl("\\screen\\"+savedFileName);
			vo.setName(name);
			vo.setDisplayti(displayti);
			vo.setVolume(Integer.toString((int) bytes));
			vo.setExtension(extension);
			vo.setOrdernum(ordernum);
			vo.setLink(link);

			sscreen_dao.insert_img(vo);//db에 저장하기
		} catch (IOException e) {
			FileUtils.deleteQuietly(targetFile);//저장된 파일 삭제
			sscreen_dao.delete_img(imgcode);// db에도 삭제
			jsonObject.addProperty("responseCode", "error");
			e.printStackTrace();
		}
		String a = jsonObject.toString();
		return a;
	}// 고객화면등록 서브(이미지 등록)
	
	// 스크린 상세보기
	@ResponseBody
	@RequestMapping(value = "/detail_scn.do", produces = "application/json; charset=utf8")
	public Object detail_scn(String screencode) {
		System.out.println("-----스크린 상세보기-----");
		Map<String, Object> readMap = sscreen_dao.select_detail(screencode);
		return readMap;
	}// 스크린 상세보기
	
	// 스크린 삭제하기
	@ResponseBody
	@RequestMapping(value = "/screen_del.do", produces = "application/json; charset=utf8")
	public int screen_del(String screencode) {
		System.out.println("-----스크린 삭제하기-----");
		int res = sscreen_dao.del_screen(screencode);
		return res; 		
	}// 스크린 삭제하기
	
	// 마스터 수정
	@ResponseBody
	@RequestMapping(value = "/modi_master.do", produces = "application/json; charset=utf8")
	public Object modi_master(@ModelAttribute("ScreenVO") ScreenVO vo) {
		System.out.println("-----마스터 수정하기-----");
		int res = sscreen_dao.modi_master(vo);
		return res;
	}// 마스터 수정
	
	// 기존에 있던 이미지 수정(서브)
	@ResponseBody
	@RequestMapping(value = "/exis_img.do", produces = "application/json; charset=utf8")
	public void exis_img(@ModelAttribute("ScreenVO") ScreenVO vo) {
		System.out.println("-----기존에 있던 이미지 수정하기-----");

		JSONParser jsonParser = new JSONParser(); 
    	JSONArray insertParam = null;
    	
    	try {
			insertParam = (JSONArray) jsonParser.parse(vo.getScncd());
		} catch (ParseException e) {
			e.printStackTrace();
		}
    	
    	System.out.println(insertParam.size());
		
    	for(int i = 0; i < insertParam.size(); i++) {
    		org.json.simple.JSONObject data = (org.json.simple.JSONObject) insertParam.get(i);
    	    System.out.println(data);
    	    ScreenVO svo = new ScreenVO();
    	    
    	    svo.setDetdis(data.get("displayti"));
    	    svo.setDetlink(data.get("link"));
    	    svo.setDetorn(data.get("ordernum"));
    	    svo.setDetimcd(data.get("imgcode"));

    	    sscreen_dao.exis_img(svo);
    	}//for
		
		String screencode = vo.getScreencode();
		System.out.println(screencode);
	}// 기존에 있던 이미지 수정(서브)
	
	// 삭제한 이미지 db에서 삭제하기
	@ResponseBody
	@RequestMapping(value = "/detimg_del.do", produces = "application/json; charset=utf8")
	public void detimg_del(String m) {
		System.out.println("-----삭제한 이미지 db에서 삭제하기-----");
		System.out.println(m);
		
		String imgcode = m.replaceAll("\\[", "").replaceAll("\\]", "").replace("\"", "");
		String[] imgcodeArr = imgcode.split(",");
		
		for(int i = 0; i < imgcodeArr.length; i++) {
			sscreen_dao.detimg_del(imgcodeArr[i]);//db에 있는 파일 url 삭제
		}
	}// 삭제한 이미지 db에서 삭제하기
	
}
