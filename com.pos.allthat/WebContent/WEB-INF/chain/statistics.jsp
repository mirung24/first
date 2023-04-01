<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
	<title>통계현황</title>
	<jsp:include page="/chain/com/nav.jsp" /><!-- navi-wrap -->
	<link rel="stylesheet" href="/chain/css/statistics.css">
</head>
<body>
		<div class="section d-flex justify-content-between flex-column">
			<article>
				<jsp:include page="/chain/com/header.jsp" /><!-- navi-title -->
				
				<input type="hidden" value="${uservo.chaincd}" id="chaincode">
				<input type="hidden" value="${uservo.userid}" id="regcd">
				<div class="content">
					<div id="loading" style="display: none; ">
					    <div id="loading_bar">
					        <img src="/img/loading1.gif">
					    </div>
					</div>
					
					<div class="d-flex justify-content-start">
						<ul class="square-wrap2">
							<li class="today-wrap square-target square-price" data-speed="1" data-gap="119179" id="toamt1">
								오늘의 전체 매출은<br><span class="today"></span>원입니다.
								<img src="img/bar-chart.png" alt="그래프">
							</li>
							<li class="lists-wrap">
								<ul>
									<li class="list">연 매출 <div id="total1"></div>
									</li>
								</ul>
								<ul>
									<li class="list">이번달 매출 <div id="moamt1"></div>
									</li>
									<li class="list">주간 매출 <div id="wwamt1"></div>
									</li>
								</ul>
							</li>
						</ul>
						<ul class="square-wrap2">
							<li class="today-wrap square-target square-price" data-speed="1" data-gap="119179" id="toamt2">
								오늘의 판매 매출은<br><span class="today"></span>원입니다.
								<img src="img/bar-chart.png" alt="그래프">
							</li>
							<li class="lists-wrap">
								<ul>
									<li class="list">연 매출 <div id="total2"></div>
									</li>
								</ul>
								<ul>
									<li class="list">이번달 매출 <div id="moamt2"></div>
									</li>
									<li class="list">주간 매출 <div id="wwamt2"></div>
									</li>
								</ul>
							</li>
						</ul>
						<ul class="square-wrap2">
							<li class="today-wrap square-target square-price" data-speed="1" data-gap="1" id="ddcnt">
								오늘의 신규 가맹점 수는<br><span class="today"></span>개입니다.
								<img src="img/store.png" alt="그래프">
							</li>
							<li class="lists-wrap">
								<ul>
									<li class="list">전체 가맹점 수 <div id="totcnt"></div>
									</li>
								</ul>
								<ul>
									<li class="list">연 신규 가맹점 수 <div id="yycnt"></div>
									</li>
									<li class="list">주간 신규 가맹점 수 <div id="wecnt"></div>
									</li>
								</ul>
							</li>
						</ul>
						<ul class="square-wrap2">
							<li class="today-wrap square-target square-price" data-speed="1" data-gap="1" id="dcust">
								오늘의 고객 수는<br><span class="today"></span>명입니다.
								<img src="img/bar-chart2.png" alt="그래프">
							</li>
							<li class="lists-wrap">
								<ul>
									<li class="list">전체 고객 수 <div id="custcnt"></div>
									</li>
								</ul>
								<ul>
									<li class="list">주간 방문 수 <div id="wcust"></div>
									</li>
									<li class="list">Best 고객 층 <div id="best"></div>
									</li>
								</ul>
							</li>
						</ul>
						<!-- <ul class="square-wrap2">
							<li class="today-wrap">
								최근 주문 목록 (PB 상품)
								<img src="img/file.png" alt="그래프">
							</li>
							<li class="lists-wrap">
								<ul>
									<li class="list">9월 23일 (10개 가맹점) <div>9,500,000원</div>
									</li>
									<li class="list">9월 22일 (10개 가맹점) <div>9,500,000원</div>
									</li>
								</ul>
								<ul>
									<li class="list">9월 21일 (10개 가맹점) <div>9,500,000원</div>
									</li>
									<li class="list">9월 20일 (10개 가맹점) <div>9,500,000원</div>
									</li>
								</ul>
							</li>
						</ul> -->
					</div>

					<div class="d-flex justify-content-start">
						<ul class="square-wrap3">
							<div id="container"><span>월간 판매 매출</span>
								<canvas id="graph1" class="mt-4"></canvas>
							</div>
						</ul>
						<ul class="square-wrap3">
							<div id="container"><span>주간 판매 매출</span>
								<canvas id="graph2" class="mt-4"></canvas>
							</div>
						</ul>
						<ul class="square-wrap3">
							<div id="container"><span>시간대별 판매 매출</span>
								<canvas id="graph3" class="mt-4"></canvas>
							</div>
						</ul>
					</div>

					<div class="d-flex justify-content-start">
						<ul class="square-wrap3">
							<div id="container"><span>월간 매출</span>
								<canvas id="graph4" class="mt-4"></canvas>
							</div>
						</ul>
						<ul class="square-wrap3">
							<div id="container"><span>주간 매출</span>
								<canvas id="graph5" class="mt-4"></canvas>
							</div>
						</ul>
						<ul class="square-wrap3">
							<div id="container"><span>시간대별 매출</span>
								<canvas id="graph6" class="mt-4"></canvas>
							</div>
						</ul>
					</div>
				</div><!-- content -->
			</article>

			<jsp:include page="/chain/com/footer.jsp" /><!-- footer -->

		</div><!-- section -->
	</div><!-- wrapper -->

	<jsp:include page="/chain/com/remote.jsp" /><!-- 원격지원 -->

	<script src="/chain/js/common.js"></script>
	<script src="/chain/js/statistics.js"></script>
</body>
</html>