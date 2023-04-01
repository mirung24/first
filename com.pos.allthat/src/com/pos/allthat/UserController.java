package com.pos.allthat;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.util.WebUtils;

import dao.UserDAO;
import util.Common;
import vo.ChainUserVO;
import vo.CompanyUserVO;

@Controller
public class UserController {

	@Autowired
	HttpServletRequest request;
	
	UserDAO user_dao;
	
	public UserController(UserDAO user_dao) {
		this.user_dao = user_dao;
		System.out.println("--UserController생성자 호출--");
	}
	
	// 로그인 페이지로 이동(가맹점)
	@RequestMapping(value = {"/", "/loginGo.do"}) 
	public String loginGo(HttpSession session, Model model) {
		if(session.getAttribute("uservo") != null) { // 세션이 있으면
			return "redirect:/smain.do"; // 판매관리로 이동
		} else { // 세션없으면 만들고 생성
			// 쿠키를 가져와 보기
			Cookie loginCookie = WebUtils.getCookie(request, "loginCookie");
			if(loginCookie != null) { // 쿠키가 있으면
				// loginCookie의 값을 꺼내오고 -> 즉, 저장해논 세션Id를 꺼내오고
				String sessionId = loginCookie.getValue();
				CompanyUserVO uservo = user_dao.checkUserWithSessionKey2(sessionId);
				
				if(uservo != null) { // 사용자가 있으면
					session.setAttribute("uservo", uservo); // 세션을 생성시키고
					return "redirect:/smain.do"; // 판매관리로 이동
				}
			}
			model.addAttribute("select", "shop");
			return Common.VIEW_PATH + "login.jsp";
		}
	}
	
	// 로그인 페이지로 이동(체인점)
	@RequestMapping(value = "/loginGochain.do") 
	public String loginGochain(HttpSession session, Model model) {
		if(session.getAttribute("uservo") != null) { // 세션이 있으면
			return "redirect:/main.do"; // 메인화면으로 이동
		} else { // 세션없으면 만들고 생성
			// 쿠키를 가져와 보기
			Cookie loginCookie = WebUtils.getCookie(request, "loginCookie");
			if(loginCookie != null) { // 쿠키가 있으면
				// loginCookie의 값을 꺼내오고 -> 즉, 저장해논 세션Id를 꺼내오고
				String sessionId = loginCookie.getValue();
				ChainUserVO uservo = user_dao.checkUserWithSessionKey(sessionId);
				
				if(uservo != null) { // 사용자가 있으면
					session.setAttribute("uservo", uservo); // 세션을 생성시키고
					return "redirect:/main.do"; // 메인화면으로 이동
				}
			}
			model.addAttribute("select", "chain");
			return Common.VIEW_PATH + "login.jsp";
		}
	}
	
	// 로그인 시 계정 여부 확인(체인점)
	@ResponseBody
	@RequestMapping(value = "/acctChk.do", produces = "application/json; charset=utf8")
	public String acctChk(@ModelAttribute("ChainUserVO") ChainUserVO vo) {
		int res = user_dao.acctChk(vo);
		JSONObject jsonObject = new JSONObject();               
		jsonObject.put("result", res);
		      
		return jsonObject.toString();
	}
	
	// 로그인 시 계정 여부 확인(가맹점)
	@ResponseBody
	@RequestMapping(value = "/SacctChk.do", produces = "application/json; charset=utf8")
	public String SacctChk(@ModelAttribute("CompanyUserVO") CompanyUserVO vo) {
		int res = user_dao.SacctChk(vo);
		JSONObject jsonObject = new JSONObject();               
		jsonObject.put("result", res);
		      
		return jsonObject.toString();
	}
	
	// 로그인 처리(체인점)
	@ResponseBody
	@RequestMapping(value = "/login.do")
	public void login(@ModelAttribute("ChainUserVO") ChainUserVO vo, HttpServletResponse response, HttpSession session) {

		if ( session.getAttribute("uservo") != null ){ // 기존에 uservo란 세션 값이 존재한다면            
			session.removeAttribute("uservo"); // 기존값을 제거해 준다.        
		}
		
		// 로그인 유지 체크
		if("true".equals(vo.getChkBtn1())) { // 로그인 유지에 체크 했을 때
			//쿠키 등록
			Cookie cookie = new Cookie("loginCookie", vo.getUserid());
			cookie.setMaxAge(60*60*24*7); // 쿠키 수명 설정 초단위(7일)
			cookie.setPath("/"); // 모든 경로에 적용
			
			response.addCookie(cookie);
		}
		
		// 세션 등록
		ChainUserVO uservo = user_dao.login(vo);
		
		String ip = request.getRemoteAddr();
		vo.setIp(ip);
		int res = user_dao.loghist(vo);
		
		if(uservo == null) { session.setAttribute("uservo", null); } 
		else { session.setAttribute("uservo", uservo); session.setMaxInactiveInterval(172800); }
		
		// 메인화면으로 이동
//		return "redirect:/main.do";
	}
	
	// 로그인 처리(가맹점)
	@ResponseBody
	@RequestMapping(value = "/slogin.do")
	public void login(@ModelAttribute("CompanyUserVO") CompanyUserVO vo, HttpServletResponse response, HttpSession session) {
		if ( session.getAttribute("uservo") != null ){ // 기존에 uservo란 세션 값이 존재한다면            
			session.removeAttribute("uservo"); // 기존값을 제거해 준다.        
		}
		
		// 로그인 유지 체크
		if("true".equals(vo.getChkBtn1())) { // 로그인 유지에 체크 했을 때
			//쿠키 등록
			Cookie cookie = new Cookie("loginCookie", vo.getUserid());
			cookie.setMaxAge(60*60*24*7); // 쿠키 수명 설정 초단위(7일)
			cookie.setPath("/"); // 모든 경로에 적용
			
			response.addCookie(cookie);
		}
		
		// 세션 등록
		CompanyUserVO uservo = user_dao.slogin(vo);
		
		String ip = request.getRemoteAddr();
		vo.setIp(ip);
		int res = user_dao.sloghist(vo);
		
		if(uservo == null) { session.setAttribute("uservo", null); } 
		else { session.setAttribute("uservo", uservo); session.setMaxInactiveInterval(172800);}
		
		System.out.println(session.getAttribute("uservo"));
	}
	
	// 로그아웃 처리(가맹점)
	@RequestMapping(value = "/logout.do")
	public String logout(HttpSession session, HttpServletResponse response) {
		session.invalidate(); // 세션 전체를 삭제
		Cookie cookie = new Cookie("loginCookie", null);
		cookie.setMaxAge(0);
		response.addCookie(cookie);
		
		return "redirect:/loginGo.do";
	}
	
	// 창 닫을 때 강제 로그아웃(가맹점)
	@RequestMapping(value = "/xlogout.do")
	public void xlogout(HttpSession session, HttpServletResponse response) {
		session.invalidate(); // 세션 전체를 삭제
	}
	
	// 로그아웃 처리(체인점)
	@RequestMapping(value = "/logoutchain.do")
	public String logoutchain(HttpSession session, HttpServletResponse response) {
		session.invalidate(); // 세션 전체를 삭제
		Cookie cookie = new Cookie("loginCookie", null);
		cookie.setMaxAge(0);
		response.addCookie(cookie);
		
		System.out.println();
		
		return "redirect:/loginGochain.do";
	}
	
	// 창 닫을 때 강제 로그아웃(체인점)
	@RequestMapping(value = "/xlogoutchain.do")
	public void xlogoutchain(HttpSession session, HttpServletResponse response) {
		session.invalidate(); // 세션 전체를 삭제
	}

}
