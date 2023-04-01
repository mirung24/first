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
	<jsp:include page="/chain/com/nav.jsp" /><!-- navi-wrap -->
	<link rel="stylesheet" href="/chain/css/read.css">
</head>
<body>
		<div class="section d-flex justify-content-between flex-column">
			<article>
				<jsp:include page="/chain/com/header.jsp" /><!-- navi-title -->

				<div class="content">
					<input type="hidden" value="${uservo.chaincd}" id="chaincode">
					<input type="hidden" value="${uservo.userid}" id="regcd" name="regcd">
					<input type="hidden" value="<%= noticecode %>" id="noticecode" name="noticecode">
					<div class="banner"><img src="/img/notice.jpg" alt="배너" class="img">
						<h2>공지사항</h2>
						<p>올댓포스 서비스의 편리한 이용을 위한 안내 및 소식을 빠르게 전해드립니다.</p>
					</div>

					<div class="box d-flex mt-0">
						<div>
							<ul class="writer font-weight-bold pb-2 d-flex justify-content-between align-items-center">
								<li><span id="author">관리자</span><span class="ml-3" style="color: #777;" id="readhit"></span> 
								<span class="ml-3 mr-3" style="color: #777;" id="regdt"></span></li>
								<li><a href="/notice.do?title=전체게시판&name=공지사항"><button type="button"
									class="btn btn-cancle mr-2">목록</button></a><button
									type="button" class="btn btn-save" id="modiBtn">수정</button>
									<button type="button" class="btn btn-save" id="removeBtn">삭제</button></li>
							</ul>
							<ul class="title font-weight-bold py-2 d-flex justify-content-between align-items-center">
								<li id="title"></li>
							</ul>
							<ul class="mt-2">
								<li class="file" id="file_down">첨부파일 다운로드 : </li>
							</ul>
	
							<div class="cont py-3" id="content" style="white-space:pre;"></div>
						</div>
						
						<div class="ml-3">
							<div class="pop-list">
								<span>가맹점 수신 여부</span>
								<div class="tab text-right">
									<button class="btn tablinks active">수신</button>
									<button class="btn tablinks">미수신</button>
								</div>
							</div>
							<div class="tab-wrap mt-0">
						
								<div class="tabcontent">
									<div class="table-responsive" style="height: 100%;">
										<table class="table table-hover table-striped text-center mb-0">
											<thead>
												<tr>
													<th style='width: 120px;'>사업자번호</th>
													<th style='width: 120px;'>가맹점명</th>
													<th>주소</th>
													<th style='width: 120px;'>수신일</th>
												</tr>
											</thead>
											<tbody class="ready_tbody">
											</tbody>
										</table>
									</div>
								</div>
								<div class="tabcontent">
									<div class="table-responsive" style="height: 100%;">
										<table class="table table-hover table-striped text-center mb-0">
											<thead>
												<tr>
													<th style='width: 120px;'>사업자번호</th>
													<th style='width: 120px;'>가맹점명</th>
													<th>주소</th>
													<th style='width: 120px;'>수신일</th>
												</tr>
											</thead>
											<tbody class="readn_tbody">
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div><!-- 가맹점 수신여부 -->
					</div>
				</div><!-- content -->
			</article>
			<jsp:include page="/chain/com/footer.jsp" /><!-- footer -->
		</div><!-- section -->
		
	<jsp:include page="/chain/com/remote.jsp" /><!-- 원격지원 -->
	
	<script src="/chain/js/common.js"></script>
	<script src="/chain/js/read.js"></script>
</body>
</html>