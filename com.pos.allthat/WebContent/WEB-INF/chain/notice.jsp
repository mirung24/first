<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ko">
<head>
	<title>공지사항</title>
	<jsp:include page="/chain/com/nav.jsp" /><!-- navi-wrap -->
	<link rel="stylesheet" href="/chain/css/notice.css">
</head>
<body>
		<div class="section d-flex justify-content-between flex-column">
			<article>
				<jsp:include page="/chain/com/header.jsp" /><!-- navi-title -->

				<div class="content">
					<input type="hidden" value="${uservo.chaincd}" id="chaincode">
					<input type="hidden" value="${uservo.userid}" id="regcd" name="regcd">
					<div class="banner"><img src="/img/notice.jpg" alt="배너" class="img">
						<h2>공지사항</h2>
						<p>올댓포스 서비스의 편리한 이용을 위한 안내 및 소식을 빠르게 전해드립니다.</p>
					</div>

					<div class="box mt-3">

						<div class="length-wrap d-flex justify-content-between align-items-center">
							<div class="mb-2 d-flex align-items-center"><span class="bf-wrap"></span></div>
							<div class="d-flex align-items-center mb-2">
								<input type="text" class="d-30 calendar calendar-img mr-2" name="searchDate1">
								~ &nbsp;
								<input type="text" class="date2 calendar calendar-img mr-2" name="searchDate2">
								
								<select class="form-control mr-2" style="width: 6rem;" name="search1">
									<option value="all" selected>전체</option>
									<option value="title">제목</option>
									<option value="author">작성자</option>
								</select>
								
								<input class="form-control form-control-sm pl-2 mr-2" type="text" placeholder="검색어를 입력하세요."
									style="width: 10rem;" name="searchInput" onkeyup="enterkey()">
								<button type="button" class="btn btn-search" id="searchBtn"><i
										class="fa-solid fa-magnifying-glass mr-1"></i>검색</button>
								<a href="/write.do?title=전체게시판&name=공지사항"><button type="button" class="btn btn-plus ml-2"><i
											class="fa-solid fa-pencil mr-1" style="font-size: 0.7rem;"></i>글쓰기</button></a>
							</div>
						</div><!-- length-wrap -->
						<div class="table-responsive">
							<div class="table-wrap">
								<table id="table" class="table table-striped table-hover text-center" style="width: 100%;">
									<thead>
										<tr>
											<th>No.</th>
											<th>구분</th>
											<th>제목</th>
											<th>작성자</th>
											<th>날짜</th>
											<th>조회수</th>
											<th style="display: none;">공지코드</th>
										</tr>
									</thead>
								</table>
							</div>
						</div><!-- table-responsive -->
						<div class="page-wrap">
							<div class="dataTables_paginate pagination justify-content-center">
								<span></span>
							</div><!-- .pagination -->
						</div><!-- page-wrap -->
					</div>
				</div><!-- content -->
			</article>

			<jsp:include page="/chain/com/footer.jsp" /><!-- footer -->

		</div><!-- section -->
	
	<jsp:include page="/chain/com/remote.jsp" /><!-- 원격지원 -->
	
	<script src="/chain/js/common.js"></script>
	<script src="/chain/js/notice.js"></script>
</body>
</html>