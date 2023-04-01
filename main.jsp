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
		response.sendRedirect("/logout.do");
		return;
	}
%>
<!DOCTYPE html>
<html lang="ko">
<head>
	<title>메인페이지</title>
	<jsp:include page="/shop/com/nav.jsp" />
	<link rel="stylesheet" href="/shop/css/main.css">
</head>
<body>
		<div class="section d-flex justify-content-between flex-column">
			<article>
				<ul class="user">
					<input type="hidden" value="<%= msg %>" id="sessionYN">
					<input type="hidden" value="${select}" id="select">
					<input type="hidden" value="${uservo.userid}" id="regcd">
					<input type="hidden" id="corpnum" value="${uservo.corporatenumber}">
					<div class="navi-close"><i class="fa-solid fa-chevron-right"></i></div>
					<li class="d-flex justify-content-end align-items-center p-3">
						<!-- <div class="con-wrap position-relative"><i class="fa-regular fa-bell mr-4"></i><span
								class="bell-num">3</span></div> -->
						<span><i class="fa-solid fa-user mr-2"></i>${uservo.name} 관리자</span>
						<a href="/sfranchise.do?title=거래처관리&name=가맹점정보" style="color: #555b6d"><i class="fa-solid fa-gear ml-4"></i></a>
						<button type="button" class="btn btn-logout ml-4"><i class="fa-solid fa-power-off mr-1"></i>로그아웃</button>
					</li>
				</ul><!-- user -->
				<ul class="navi-title d-flex justify-content-between align-items-center">
					<li>Home</li>
					<li><span>${uservo.name}</span>님 환영합니다.</li>
				</ul><!-- navi-title -->

				<div class="content">
					<div id="loading" style="display: none; ">
					    <div id="loading_bar">
					        <img src="/img/loading1.gif">
					    </div>
					</div>
					
					<%-- <input type="hidden" id="chaincode" value="${uservo.chaincd}"> --%>
					<input type="hidden" id="compcd" value="${uservo.compcd}">
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
								오늘의 일반 매출은<br><span class="today"></span>원입니다.
								<img src="img/file.png" alt="그래프">
							</li>
							<li class="lists-wrap">
								<ul>
									<li class="list">연간 일반 매출<div id="oytot"></div></li>
									<li class="list">이번달 일반 매출<div id="omtot"></div></li>
									<li class="list">주간 일반 매출<div id="owtot"></div></li>
								</ul>
								<ul>
									<li class="list">연간 조제 매출<div id="ppoytot"></div></li>
									<li class="list">이번달 조제 매출<div id="ppomtot"></div></li>
									<li class="list">주간 조제 매출<div id="ppowtot"></div></li>
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
									<li class="list">전체 고객 수 (연간) <div id="custcnt"></div></li>
									<li class="list">오늘 방문 수<div id="tocust"></div></li>
								</ul>
								<ul>
									<li class="list">주간 방문 수 <div id="wcust"></div></li>
									<li class="list">Best 고객 층 <div id="best"></div></li>
								</ul>
							</li>
						</ul>
					</div>

					<div class="d-flex justify-content-start">
						<ul class="square-wrap3">
							<div id="container"><span>전체 매출&nbsp;(단위:천원)</span>
								<canvas id="graph1" class="mt-4"></canvas>
							</div>
						</ul>
						<ul class="square-wrap3">
							<div id="container"><span>일반 매출&nbsp;(단위:천원)</span>
								<canvas id="graph2" class="mt-4"></canvas>
							</div>
						</ul>
						<ul class="square-wrap3">
							<div id="container"><span>주간 내방</span>
								<canvas id="graph3" class="mt-4"></canvas>
							</div>
						</ul>
					</div>

					<div class="d-flex justify-content-start">
						<ul class="square-wrap3 d-flex" style="flex: 45% 0 1;">
							<li class="square-wrap4">
								<div class="rank-name d-flex justify-content-between align-items-center"><div>주간 Best 상품<i class="fa-solid fa-crown"></i></div>
                        <div class="tab2"><button type="button" class="btn tablink mr-1" name="aaaa">매출금액</button><button type="button" class="btn tablink" name="bbbb">판매수량</button></div>
                        </div>
								<div class="table-wrap">
									<table class="table">
										<thead>
											<tr>
												<th>순위</th>
												<th>상품명</th>
												<th class="co1">단위</th>
                                    			<th class="co1">판매수량</th>
											</tr>
										</thead>
										<tbody class="best_prod">
										</tbody>
									</table>
								</div><!-- table-wrap -->
							</li>
							<li class="square-wrap4 ml-3">
								<div class="rank-name">주간 Worst 상품
									<span class="option"><i class="fa-sharp fa-solid fa-square-minus"></i></span>
								</div>
								<div class="table-wrap">
									<table class="table table2">
										<thead>
											<tr>
												<th>순위</th>
												<th>상품명</th>
												<th class="co1">단위</th>
                                    			<th class="co1">판매수량</th>
											</tr>
										</thead>
										<tbody class="worst_prod">
										</tbody>
									</table>
								</div><!-- table-wrap -->
							</li>
						</ul>
						<ul class="square-wrap3 rank-list" style="flex: 25% 0 1;">
							<li class="square-wrap4">
								<div class="rank-name">주간 매출 상위 정보<i class="fa-solid fa-crown"></i>
								</div>
								<div class="table-wrap">
									<table class="table">
										<tbody>
											<tr>
												<td style="width: 5rem;">요일</td>
												<td id="tp_day"></td>
											</tr>
											<tr>
												<td>시간</td>
												<td id="tp_time"></td>
											</tr>
											<tr>
												<td>상품</td>
												<td id="tp_prod"></td>
											</tr>
											<tr>
												<td>연령</td>
												<td id="tp_age"></td>
											</tr>
										</tbody>
									</table>
								</div><!-- table-wrap -->
							</li>
							<li class="square-wrap4 mt-4">
								<div class="rank-name">주간 매출 하위 정보</div>
								<div class="table-wrap">
									<table class="table">
										<tbody>
											<tr>
												<td style="width: 5rem;">요일</td>
												<td id="sp_day"></td>
											</tr>
											<tr>
												<td>시간</td>
												<td id="sp_time"></td>
											</tr>
											<tr>
												<td>상품</td>
												<td id="sp_prod"></td>
											</tr>
											<tr>
												<td>연령</td>
												<td id="sp_age"></td>
											</tr>
										</tbody>
									</table>
								</div><!-- table-wrap -->
							</li>
						</ul>
						<ul class="square-wrap3" style="flex: 30% 0 1;">
							<li>
								<div class="rank-name">주간 신규 내방 고객</div>
								<div class="table-wrap">
									<table class="table">
										<thead>
											<tr>
												<th>No.</th>
												<th>고객</th>
												<th>방문 일시</th>
												<th>매출</th>
											</tr>
										</thead>
										<tbody class="new_cust">
										</tbody>
									</table>
								</div><!-- table-wrap -->
							</li>
						</ul>
					</div>

				</div><!-- content -->
			</article>

			<jsp:include page="/shop/com/footer.jsp" />

		</div><!-- section -->
	</div><!-- wrapper -->

	<div class="top-wrap">
		<div class="bt-top"><i class="fa fa-angle-up"></i></div>
	</div><!-- top-wrap -->
	
	
	<div class="modal-wrap1">
		<div class="pop1">
			<div class="pop-title">제외상품관리</div>
			<div class="pop-cont">
				<div class="d-flex align-items-center">
					<select class="form-control mr-2" style="width: 5.7rem;" name="search4">
						<option value="productname" selected>상품명</option>
						<option value="maker">제조사</option>
						<option value="productid">바코드</option>
					</select>
		
					<input class="form-control form-control-sm pl-2 mr-2" type="text" 
					placeholder="검색어를 입력하세요." style="width: 10rem;" name="searchInput2" onkeyup="enterkey()">
		
						<button type="button" class="btn btn-search" id="searchBtn2"><i
							class="fa-solid fa-magnifying-glass mr-1"></i>검색</button>
						<p class="mr-2 text-right expta"><b>* 선택한 상품은 주간 BEST/ 주간 WORST에서 제외됩니다.</b></p>
				</div>
			
			<div class="d-flex mt-3">
					<div class="table-responsive" style="height: 32rem; overflow-y: auto;">
						<table class="table table-striped text-center mb-0">
							<thead>
								<tr>
									<th>제품코드</th>
									<th style="width: 8rem;">제품명</th>
									<th>제조사</th>
									<th>규격</th>
									<th>선택</th>
									<th style="display: none;">단위</th>
									<th style="display: none;">제품아이디</th>
								</tr>
							</thead>
							<tbody class="regi_list">
							</tbody>
						</table>
					</div>
					<div class="ddd"><i class="fa-solid fa-arrow-right" id="addListBtn"></i></div>
					<div class="table-responsive" style="height: 32rem; overflow-y: auto;">
						<table class="table table-striped text-center mb-0">
							<thead>
								<tr>
									<th>제품코드</th>
									<th>제품명</th>
									<th>제조사</th>
									<th>규격(단위)</th>
									<th>취소</th>
									<th style="display: none;">제품아이디</th>
								</tr>
							</thead>
							<tbody class="regi_sel">
							</tbody>
						</table>
					</div>
			</div>
	
				<div class="text-center mt-3"><button type="button" class="btn btn-cancle pop-close1 mr-2">닫기</button><button
						type="button" class="btn btn-save" id="selBtn">저장</button></div>
			</div>
		</div>
	</div><!-- modal-wrap1 -->
	

	<jsp:include page="/shop/com/remote.jsp" />
	
	<script src="/shop/js/common.js"></script>
	<script src="/shop/js/main.js"></script>
</body>
</html>