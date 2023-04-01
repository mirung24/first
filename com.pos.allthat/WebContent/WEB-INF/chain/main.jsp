<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page session="true" %>

<%
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
<!DOCTYPE html>
<html lang="ko">
<head>
	<title>메인페이지</title>
	<jsp:include page="/chain/com/nav.jsp" /><!-- navi-wrap -->
	<link rel="stylesheet" href="/chain/css/main.css">
</head>
<body>
		<div class="section d-flex justify-content-between flex-column">
			<article>
				<ul class="user">
					<input type="hidden" value="<%= msg %>" id="sessionYN">
					<input type="hidden" value="${select}" id="select">
					<input type="hidden" value="${uservo.userid}" id="regcd">
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
					<li>Home</li>
					<li><span>${uservo.name}</span>님 환영합니다.</li>
				</ul><!-- navi-title -->
				
				<input type="hidden" value="${uservo.chaincd}" id="chaincode">
				<div class="content">
					<div id="loading" style="display: none; ">
					    <div id="loading_bar">
					        <img src="/img/loading1.gif">
					    </div>
					</div>
					
					<div class="d-flex justify-content-start">
						<ul class="square-wrap2">
							<li class="today-wrap square-target square-price" id="tetc" data-target="0">
								어제의 조제 매출은<br><span class="today">0</span>원입니다.
								<img src="img/bar-chart.png" alt="그래프">
							</li>
							<li class="lists-wrap">
								<ul>
									<li class="list"><span class="thisyear"></span> 매출 <div id="yetc">0원</div>
									</li>
								</ul>
								<ul>
									<li class="list">이번 달 매출 <div id="metc">0원</div>
									</li>
									<li class="list">주간 매출 <div id="wetc">0원</div>
									</li>
								</ul>
							</li>
						</ul>
						<ul class="square-wrap2">
							<li class="today-wrap square-target square-price" id="totc" data-target="0">
								어제의 일반 매출은<br><span class="today">0</span>원입니다.
								<img src="img/store.png" alt="그래프">
							</li>
							<li class="lists-wrap">
								<ul>
									<li class="list"><span class="thisyear"></span> 매출 <div id="yotc">0원</div>
									</li>
								</ul>
								<ul>
									<li class="list">이번 달 매출 <div id="motc">0원</div>
									</li>
									<li class="list">주간 매출 <div id="wotc">0원</div>
									</li>
								</ul>
							</li>
						</ul>
						<ul class="square-wrap2">
							<li class="today-wrap square-target square-price" id="cust" data-target="0">
								어제의 고객 수는<br><span class="today">0</span>명입니다.
								<img src="img/bar-chart2.png" alt="그래프">
							</li>
							<li class="lists-wrap">
								<ul>
									<li class="list">전일 고객 성비 <div id="mfcust">남 0명 <span class="line">|</span> 여 0명</div>
									</li>
								</ul>
								<ul>
									<li class="list">주간 고객 수 <div id="wcust">0명</div>
									</li>
									<li class="list">Best 고객 층 <div id="best">-</div>
									</li>
								</ul>
							</li>
						</ul>
						<ul class="square-wrap2">
							<li class="today-wrap square-target square-price" id="compcnt" data-target="0">
								어제의 총 매출가맹점 수는<br><span class="today">0</span>개입니다.
								<img src="img/file.png" alt="그래프">
							</li>
							<li class="lists-wrap">
								<ul>
									<li class="list"><span class="thisyear"></span> 신규 가맹점 수 <div id="yycnt">0개</div>
									</li>
								</ul>
								<ul>
									<li class="list">이번 달 신규 가맹점 수 <div id="mmcnt">0개</div>
									</li>
									<li class="list">주간 신규 가맹점 수 <div id="wecnt">0개</div>
									</li>
								</ul>
							</li>
						</ul>
					</div>
					<div class="square-wrap" style="margin-top: 1rem;">
						<div class="rank-name d-flex justify-content-between mb-3">
							<p><img src="img/pay10.png" alt="" style="width: 30px; margin-right: 0.5rem;">
							<span class="thisyear"></span> 총매출 : <span id="ytotal">0원</span></p>
							<p>매출단위 : 백만 &nbsp;(매출, 조제, 일반)</p>
						</div>
						<div class="d-flex timeline">
<!-- 							<div class="bar-wrap"><div class="bar bar7"><div class="circle"><span>23년03월</span></div></div>
								<ul class="bar-cont">
									<li>가맹점 : 140</li>
									<li>매&nbsp;&nbsp;출 : 140</li>
									<li>조&nbsp;&nbsp;제 : 140</li>
									<li>일&nbsp;&nbsp;반 : 140</li>
									<li>평&nbsp;&nbsp;균 : 140</li>
									<li>최&nbsp;&nbsp;대 : 140</li>
									<li>최&nbsp;&nbsp;저 : 140</li>
								</ul>
							</div>
							<div class="bar-wrap"><div class="bar bar8"><div class="circle"><span>23년02월</span></div></div>
								<ul class="bar-cont">
									<li>가맹점 : 140</li>
									<li>매&nbsp;&nbsp;출 : 140</li>
									<li>조&nbsp;&nbsp;제 : 140</li>
									<li>일&nbsp;&nbsp;반 : 140</li>
									<li>평&nbsp;&nbsp;균 : 140</li>
									<li>최&nbsp;&nbsp;대 : 140</li>
									<li>최&nbsp;&nbsp;저 : 140</li>
								</ul>
							</div>
							<div class="bar-wrap"><div class="bar bar9"><div class="circle"><span>23년01월</span></div></div>
								<ul class="bar-cont">
									<li>가맹점 : 140</li>
									<li>매&nbsp;&nbsp;출 : 140</li>
									<li>조&nbsp;&nbsp;제 : 140</li>
									<li>일&nbsp;&nbsp;반 : 140</li>
									<li>평&nbsp;&nbsp;균 : 140</li>
									<li>최&nbsp;&nbsp;대 : 140</li>
									<li>최&nbsp;&nbsp;저 : 140</li>
								</ul>
							</div>
							<div class="bar-wrap"><div class="bar bar10"><div class="circle"><span>22년12월</span></div></div>
								<ul class="bar-cont mr-0">
									<li>가맹점 : 140</li>
									<li>매&nbsp;&nbsp;출 : 8700</li>
									<li>조&nbsp;&nbsp;제 : 140</li>
									<li>일&nbsp;&nbsp;반 : 1140</li>
									<li>평&nbsp;&nbsp;균 : 140</li>
									<li>최&nbsp;&nbsp;대 : 140</li>
									<li>최&nbsp;&nbsp;저 : 140</li>
								</ul>
							</div> -->
						</div>
					</div>
					<div>
					</div>

					<div class="d-flex justify-content-start">
						<ul class="square-wrap3 tab-wrap">
							<div class="mb-2 d-flex justify-content-between align-items-center">
								<div class="rank-name">가맹점 & 상품 주간 순위<i class="fa-solid fa-crown"></i></div>
								<div class="tab">
									<button type="button" class="btn tablink3" name="top"><i class="fa-solid fa-arrow-up"></i></button>
									<button type="button" class="btn tablink3 mr-2" name="bot"><i class="fa-solid fa-arrow-down"></i></button>
									<button type="button" class="btn option2 active" name="total">매출</button>
									<button type="button" class="btn option2 mr-2" name="count">건수</button>
									<span class="option"><i class="fa-sharp fa-solid fa-square-minus"></i></span>
								</div>
							</div>
							<li class="square-wrap4 tabcontent3 justify-content-between">
								<div class="table-wrap w-100 mr-3">
									<table class="table">
										<thead>
											<tr>
												<th>순위</th>
												<th>가맹점명</th>
												<th><span name="weekrank"/></th>
											</tr>
										</thead>
										<tbody class="comprank">
											<tr>
												<td><div>1</div></td>
												<td>올댓올댓페이..</td>
												<td class="rank-blue">3,900,000원</td>
											</tr>
										</tbody>
									</table>
								</div><!-- table-wrap -->

								<div class="table-wrap w-100">
									<table class="table">
										<thead>
											<tr>
												<th>순위</th>
												<th>상품명</th>
												<th><span name="weekrank"/></th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td><div>1</div></td>
												<td>올댓올댓페이..</td>
												<td>1,900,000원</td>
											</tr>
											<tr>
												<td><div>2</div></td>
												<td>올댓올댓페이..</td>
												<td>1,900,000원</td>
											</tr>
											<tr>
												<td><div>3</div></td>
												<td>올댓올댓페이</td>
												<td>1,900,000원</td>
											</tr>
											<tr>
												<td><div>4</div></td>
												<td>올댓올댓페이..</td>
												<td>1,900,000원</td>
											</tr>
											<tr>
												<td><div>5</div></td>
												<td>올댓올댓페이..</td>
												<td>1,900,000원</td>
											</tr>
											<tr>
												<td><div>6</div></td>
												<td>올댓페이..</td>
												<td>1,900,000원</td>
											</tr>
											<tr>
												<td><div>7</div></td>
												<td>올댓페이..</td>
												<td>1,900,000원</td>
											</tr>
											<tr>
												<td><div>8</div></td>
												<td>올댓올댓페이..</td>
												<td>1,900,000원</td>
											</tr>
											<tr>
												<td><div>9</div></td>
												<td>올댓올댓올댓..</td>
												<td>1,900,000원</td>
											</tr>
											<tr>
												<td><div>10</div></td>
												<td>올댓올댓페이..</td>
												<td>1,900,000원</td>
											</tr>
										</tbody>
									</table>
								</div><!-- table-wrap -->
							</li>
							<li class="square-wrap4 tabcontent3 justify-content-between">
								<div class="table-wrap w-100 mr-3">
									<table class="table">
										<thead>
											<tr>
												<th>순위</th>
												<th>가맹점명</th>
												<th>매출</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td><div>1</div></td>
												<td>올댓페이..</td>
												<td class="rank-blue">3,900,000원</td>
											</tr>
											<tr>
												<td><div>2</div></td>
												<td>올댓페이..</td>
												<td class="rank-blue">3,900,000원</td>
											</tr>
											<tr>
												<td><div>3</div></td>
												<td>올댓페이..</td>
												<td class="rank-red">3,900,000원</td>
											</tr>
											<tr>
												<td><div>4</div></td>
												<td>올댓페이..</td>
												<td class="rank-blue">3,900,000원</td>
											</tr>
											<tr>
												<td><div>5</div></td>
												<td>올댓페이..</td>
												<td class="rank-red">13,900,000원</td>
											</tr>
											<tr>
												<td><div>6</div></td>
												<td>올댓페이..</td>
												<td class="rank-red">3,900,000원</td>
											</tr>
											<tr>
												<td><div>7</div></td>
												<td>올댓페이..</td>
												<td class="rank-blue">3,900,000원</td>
											</tr>
											<tr>
												<td><div>8</div></td>
												<td>올댓페이..</td>
												<td class="rank-red">3,900,000원</td>
											</tr>
											<tr>
												<td><div>9</div></td>
												<td>올댓올댓..</td>
												<td class="rank-blue">3,900,000원</td>
											</tr>
											<tr>
												<td><div>10</div></td>
												<td>올댓페이..</td>
												<td class="rank-red">3,900,000원</td>
											</tr>
										</tbody>
									</table>
								</div><!-- table-wrap -->

								<div class="table-wrap w-100">
									<table class="table">
										<thead>
											<tr>
												<th>순위</th>
												<th>상품명</th>
												<th>매출</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td><div>1</div></td>
												<td>올댓페이..</td>
												<td>1,900,000원</td>
											</tr>
											<tr>
												<td><div>2</div></td>
												<td>올댓페이..</td>
												<td>1,900,000원</td>
											</tr>
											<tr>
												<td><div>3</div></td>
												<td>올댓페이</td>
												<td>1,900,000원</td>
											</tr>
											<tr>
												<td><div>4</div></td>
												<td>올댓페이..</td>
												<td>1,900,000원</td>
											</tr>
											<tr>
												<td><div>5</div></td>
												<td>올댓페이..</td>
												<td>1,900,000원</td>
											</tr>
											<tr>
												<td><div>6</div></td>
												<td>올댓페이..</td>
												<td>1,900,000원</td>
											</tr>
											<tr>
												<td><div>7</div></td>
												<td>올댓페이..</td>
												<td>1,900,000원</td>
											</tr>
											<tr>
												<td><div>8</div></td>
												<td>올댓페이..</td>
												<td>1,900,000원</td>
											</tr>
											<tr>
												<td><div>9</div></td>
												<td>올댓올댓..</td>
												<td>1,900,000원</td>
											</tr>
											<tr>
												<td><div>10</div></td>
												<td>올댓페이..</td>
												<td>1,900,000원</td>
											</tr>
										</tbody>
									</table>
								</div><!-- table-wrap -->
							</li>
						</ul>
						<ul class="square-wrap3">
							<li class="tab-wrap">
								<div class="mb-2 d-flex justify-content-between align-items-center">
									<div class="rank-name">신규 가맹점 매출 (D-30)<i class="fa-solid fa-crown"></i></div>
									<div class="tab">
										<button type="button" class="btn tablink2"><i class="fa-solid fa-arrow-up"></i></button>
									<button type="button" class="btn tablink2"><i class="fa-solid fa-arrow-down"></i></button>
									</div>
								</div>
								<div class="table-wrap tabcontent2">
									<table class="table">
										<thead>
											<tr>
												<th>순위</th>
												<th>이름</th>
												<th>입점 날짜</th>
												<th>매출</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td><div>1</div></td>
												<td>올댓페이</td>
												<td>22.09.22</td>
												<td>39,000,000원</td>
											</tr>
											<tr>
												<td><div>2</div></td>
												<td>올댓페이</td>
												<td>22.09.22</td>
												<td>39,000,000원</td>
											</tr>
											<tr>
												<td><div>3</div></td>
												<td>올댓페이</td>
												<td>22.09.22</td>
												<td>39,000,000원</td>
											</tr>
											<tr>
												<td><div>4</div></td>
												<td>올댓올댓페이올댓페이</td>
												<td>22.09.22</td>
												<td>39,000,000원</td>
											</tr>
											<tr>
												<td><div>5</div></td>
												<td>올댓페이</td>
												<td>22.09.22</td>
												<td>39,000,000원</td>
											</tr>
											<tr>
												<td><div>6</div></td>
												<td>올댓페이</td>
												<td>22.09.22</td>
												<td>39,000,000원</td>
											</tr>
											<tr>
												<td><div>7</div></td>
												<td>올댓페이</td>
												<td>22.09.22</td>
												<td>39,000,000원</td>
											</tr>
											<tr>
												<td><div>8</div></td>
												<td>올댓페이</td>
												<td>22.09.22</td>
												<td>39,000,000원</td>
											</tr>
											<tr>
												<td><div>9</div></td>
												<td>올댓페이</td>
												<td>22.09.22</td>
												<td>39,000,000원</td>
											</tr>
											<tr>
												<td><div>10</div></td>
												<td>올댓페이</td>
												<td>22.09.22</td>
												<td>39,000,000원</td>
											</tr>
										</tbody>
									</table>
								</div><!-- table-wrap -->
								<div class="table-wrap tabcontent2">
									<table class="table">
										<thead>
											<tr>
												<th>순위</th>
												<th>이름</th>
												<th>입점 날짜</th>
												<th>매출</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td><div>1</div></td>
												<td>올댓페이1</td>
												<td>23.03.24</td>
												<td>39,000,000원</td>
											</tr>
											<tr>
												<td><div>2</div></td>
												<td>올댓페이2</td>
												<td>23.03.24</td>
												<td>39,000,000원</td>
											</tr>
											<tr>
												<td><div>3</div></td>
												<td>올댓페이3</td>
												<td>23.03.24</td>
												<td>39,000,000원</td>
											</tr>
											<tr>
												<td><div>4</div></td>
												<td>올댓올댓페이올댓페이4</td>
												<td>23.03.24</td>
												<td>39,000,000원</td>
											</tr>
											<tr>
												<td><div>5</div></td>
												<td>올댓페이5</td>
												<td>23.03.24</td>
												<td>39,000,000원</td>
											</tr>
											<tr>
												<td><div>6</div></td>
												<td>올댓페이6</td>
												<td>23.03.24</td>
												<td>39,000,000원</td>
											</tr>
											<tr>
												<td><div>7</div></td>
												<td>올댓페이7</td>
												<td>23.03.24</td>
												<td>39,000,000원</td>
											</tr>
											<tr>
												<td><div>8</div></td>
												<td>올댓페이8</td>
												<td>23.03.24</td>
												<td>39,000,000원</td>
											</tr>
											<tr>
												<td><div>9</div></td>
												<td>올댓페이9</td>
												<td>23.03.24</td>
												<td>39,000,000원</td>
											</tr>
											<tr>
												<td><div>10</div></td>
												<td>올댓페이10</td>
												<td>23.03.24</td>
												<td>39,000,000원</td>
											</tr>
										</tbody>
									</table>
								</div><!-- table-wrap -->
							</li>
						</ul>

						<ul class="square-wrap3">
							<div id="container" class="tab-wrap">
								<div class="d-flex justify-content-between align-items-center">
									<div class="rank-name">주간 통계</div>
									<div class="tab">
										<button type="button" class="btn tablink">판매 + 내방</button>
										<button type="button" class="btn tablink">판매</button>
										<button type="button" class="btn tablink">내방</button>
									</div>
								</div>
								<canvas id="graph1" class="tabcontent mt-4"></canvas>
								<canvas id="graph2" class="tabcontent mt-4"></canvas>
								<canvas id="graph3" class="tabcontent mt-4"></canvas>
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
	<script src="/chain/js/main.js"></script>
</body>
</html>