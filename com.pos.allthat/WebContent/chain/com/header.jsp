<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page session="true" %>

<%
	request.setCharacterEncoding("utf-8");
	String title = request.getParameter("title");
	String name = request.getParameter("name");
	
	String msg;
	if(session.getAttribute("uservo") != null) {
		msg = "Y";//세션 존재
	} else {
		msg = "N";//세션 없음
	}
	
	if("N".equals(msg)) {
		session.invalidate();
		Cookie cookie = new Cookie("loginCookie", null);
		cookie.setMaxAge(0);
		response.addCookie(cookie);
		response.sendRedirect("/logoutchain.do");
		return;
	}
	
%>
				<ul class="user">
					<input type="hidden" value="<%= msg %>" id="sessionYN">
					<input type="hidden" value="${select}" id="select">
					<div class="navi-close"><i class="fa-solid fa-chevron-right"></i></div>
					<li class="d-flex justify-content-end align-items-center p-3">
						<!-- <div class="con-wrap position-relative"><i class="fa-regular fa-bell mr-4"></i><span
								class="bell-num">3</span></div> -->
						<span><i class="fa-solid fa-user mr-2"></i>${uservo.name} 관리자</span>
						<!-- <i class="fa-solid fa-gear ml-4"></i> -->
						<button type="button" class="btn btn-logout ml-4"><i class="fa-solid fa-power-off mr-1"></i>로그아웃</button>
					</li>
				</ul><!-- user -->
				<ul class="navi-title d-flex justify-content-between align-items-center">
					<li><%= name %></li>
					<li><%= title %> <span> > <%= name %></span></li>
				</ul><!-- navi-title -->