<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ko">
<head>
	<title>에러페이지</title>
	<link rel="stylesheet" href="/chain/css/error.css">
</head>
<body>
		<jsp:include page="/chain/com/nav.jsp" /><!-- nav-wrap -->
		<div class="section d-flex justify-content-between flex-column">
			<article>
				<ul class="user">
					<div class="navi-close"><i class="fa-solid fa-chevron-right"></i></div>
					<li class="d-flex justify-content-end align-items-center p-3">
						<div class="con-wrap position-relative"><i class="fa-regular fa-bell mr-4"></i><span
								class="bell-num">3</span></div>
						<span><i class="fa-solid fa-user mr-2"></i>올댓페이 관리자</span>
						<i class="fa-solid fa-gear ml-4"></i>
						<button type="button" class="btn btn-logout ml-4"><i class="fa-solid fa-power-off mr-1"></i>로그아웃</button>
					</li>
				</ul><!-- user -->
				<div class="content">
					<div class="error-wrap">
						<div class="fail-img">
								<img src="img/triangle.png" alt="오류" class="mb-2">
						</div>
						<div class="fail">
							서비스 준비중입니다.
							<!-- 죄송합니다. 서비스 이용이 원활하지 않습니다. -->
			
						</div>
						<div class="fail-cont" style="line-height: 1.5;">
							보다 나은 서비스 제공을 위하여 현재 페이지는 준비중입니다. 빠른 시일내에 준비하여 찾아뵙겠습니다. 감사합니다.
							<!-- 서비스 이용에 불편을 드려 죄송합니다.
							요청하신 페이지에서 일시적인 에러가 발생했습니다.
							잠시 후 다시 이용해 주시기 바랍니다. -->
							
						<!-- <div><a href="javascript:history.back();"><button type="button" class="btn btn-danger mt-3">이전 페이지로 이동</button></a></div> -->
					</div>
						<div class="fail-info text-center">
							<p>- 문의 사항은 <span>대표번호 1811 - 6277</span>로 연락 부탁드립니다.</p>
						</div>
				</div>
				</div><!-- content -->
			</article>

			<jsp:include page="/chain/com/footer.jsp" /><!-- footer -->

		</div><!-- section -->
	</div><!-- wrapper -->

	<jsp:include page="/chain/com/remote.jsp" /><!-- remote -->
	
	<script src="/chain/js/common.js"></script>
</body>
</html>