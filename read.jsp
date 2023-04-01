<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
	request.setCharacterEncoding("utf-8");
	String noticecode = request.getParameter("noticecode");
%>
<!DOCTYPE html>
<html lang="ko">
<head>
	<title>공지사항</title>
	<jsp:include page="/shop/com/nav.jsp" /><!-- navi-wrap -->
	<link rel="stylesheet" href="/shop/css/read.css">
</head>
<body>
		<div class="section d-flex justify-content-between flex-column">
			<article>
				<jsp:include page="/shop/com/header.jsp" /><!-- navi-title -->

				<div class="content">
					<div id="loading" style="display: none; ">
					    <div id="loading_bar">
					        <img src="/img/loading1.gif">
					    </div>
					</div>
					<input type="hidden" id="compcd" name="compcd" value="${uservo.compcd}">
					<input type="hidden" value="${uservo.chaincd}" id="chaincode">
					<input type="hidden" value="${uservo.userid}" id="regcd" name="regcd">
					<input type="hidden" value="<%= noticecode %>" id="noticecode" name="noticecode">
					<div class="banner"><img src="/img/notice.jpg" alt="배너" class="img">
						<h2>공지사항</h2>
						<p>올댓포스 서비스의 편리한 이용을 위한 안내 및 소식을 빠르게 전해드립니다.</p>
					</div>

					<div class="box mt-0">
						<div>
							<ul class="writer font-weight-bold py-2 d-flex justify-content-between align-items-center">
								<li><span id="author">관리자</span><span class="ml-3" style="color: #777;" id="readhit"></span> 
								<span class="ml-3 mr-3" style="color: #777;" id="regdt"></span></li>
								<li><a href="/snotice.do?title=전체게시판&name=공지사항"><button type="button" class="btn btn-cancle">목록</button></a></li>
							</ul>
							<ul class="title font-weight-bold py-2 d-flex justify-content-between align-items-center">
								<li id="title"></li>
							</ul>
							<ul class="mt-2">
								<li class="file" id="file_down">첨부파일 다운로드 : </li>
							</ul>
							
							<div class="cont py-3" id="content" style="white-space:pre;"></div>
						</div>
					</div>
				</div><!-- content -->
			</article>
			<jsp:include page="/shop/com/footer.jsp" /><!-- footer -->
		</div><!-- section -->
		
	<jsp:include page="/shop/com/remote.jsp" /><!-- 원격지원 -->
	
	<script src="/shop/js/common.js"></script>
	<script src="/shop/js/read.js"></script>
</body>
</html>