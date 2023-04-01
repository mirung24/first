<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
	<title>통계현황</title>
	<jsp:include page="/shop/com/nav.jsp" /><!-- navi-wrap -->
	<link rel="stylesheet" href="/shop/css/statistics.css">
</head>
<body>
		<div class="section d-flex justify-content-between flex-column">
			<article>
				<jsp:include page="/shop/com/header.jsp" />

				<div class="content">
					<div id="loading" style="display: none; ">
					    <div id="loading_bar">
					        <img src="/img/loading1.gif">
					    </div>
					</div>
					<input type="hidden" name="chaincode" id="chaincode" value="${uservo.chaincd}">
					<input type="hidden" name="compcd" id="compcd" value="${uservo.compcd}">
					<input type="hidden" name="regcd" id="regcd" value="${uservo.userid}">
					<input type="hidden" id="corpnum" value="${uservo.corporatenumber}">
					<!-- <div class="d-flex justify-content-start">
						<ul class="mb-3 d-flex justify-content-between align-items-center">
							<li class="d-flex align-items-center">
								<input type='text' id="currnetMonth" class="calendar calendar-img form-control month_data" style="width: 6.1rem;">
								<input type='hidden' class="form-control month_data" value="2022-10" readonly />
							</li>
						</ul>
					</div> -->
					<div class="d-flex justify-content-start">
						<ul class="square-wrap2">
							<li class="today-wrap square-target square-price" data-speed="1" data-gap="119179" id="ttot">
								오늘의 전체 매출은<br><span class="today"></span>원입니다.
								<img src="/img/bar-chart.png" alt="그래프">
							</li>
							<li class="lists-wrap">
								<ul>
									<li class="list">연 매출 <div id="ytot"></div>
									</li>
								</ul>
								<ul>
									<li class="list">이번달 매출 <div id="mtot"></div>
									</li>
									<li class="list">주간 매출 <div id="wtot"></div>
									</li>
								</ul>
							</li>
						</ul>
						<ul class="square-wrap2">
							<li class="today-wrap square-target square-price" data-speed="1" data-gap="119179" id="towtot">
								오늘의 일반 상품 매출은<br><span class="today"></span>원입니다.
								<img src="/img/file.png" alt="그래프">
							</li>
							<li class="lists-wrap">
								<ul>
									<li class="list">연 일반 매출 <div id="oytot"></div></li>
									<li class="list">이번달 일반 매출 <div id="omtot"></div></li>
									<li class="list">주간 일반 매출 <div id="owtot"></div></li>
								</ul>
								<ul>
									<li class="list">연 조제 매출 <div id="ppoytot"></div></li>
									<li class="list">이번달 조제 매출 <div id="ppomtot"></div></li>
									<li class="list">주간 조제 매출 <div id="ppowtot"></div></li>
								</ul>
							</li>
						</ul>
						<ul class="square-wrap2">
							<li class="today-wrap square-target square-price" data-speed="1" data-gap="1" id="dcust">
								오늘의 고객 수는<br><span class="today"></span>명입니다.
								<img src="/img/bar-chart2.png" alt="그래프">
							</li>
							<li class="lists-wrap">
								<ul>
									<li class="list">전체 고객 수 (연간) <div id="custcnt"></div>
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
					</div>

					<div class="d-flex justify-content-start">
						<ul class="square-wrap3">
							<div id="container"><span>월간 일반 매출</span>
								<canvas id="graph1" class="mt-4"></canvas>
							</div>
						</ul>
						<ul class="square-wrap3">
							<div id="container"><span>주간 일반 매출</span>
								<canvas id="graph2" class="mt-4"></canvas>
							</div>
						</ul>
						<ul class="square-wrap3">
							<div id="container"><span>시간대별 일반 매출</span>
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

			<jsp:include page="/shop/com/footer.jsp" />

		</div><!-- section -->
	</div><!-- wrapper -->

	<jsp:include page="/shop/com/remote.jsp" />
	
	<script src="/shop/js/common.js"></script>
	<script src="/shop/js/statistics.js"></script>
</body>
</html>