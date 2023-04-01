<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
	<title>판매내역</title>
	<jsp:include page="/chain/com/nav.jsp" /><!-- navi-wrap -->
	<link rel="stylesheet" href="/chain/css/sell.css">
</head>
<body>
		<div class="section d-flex justify-content-between flex-column">
			<article>
				<jsp:include page="/chain/com/header.jsp" /><!-- navi-title -->

				<div class="content">
					<div id="loading" style="display: none; ">
					    <div id="loading_bar">
					        <img src="/img/loading1.gif">
					    </div>
					</div>
				
					<input type="hidden" value="${uservo.chaincd}" id="chaincode">
					<input type="hidden" value="${uservo.userid}" id="regcd" name="regcd">
					<div class="d-flex align-items-center">
						<!-- <select class="form-control mr-2" style="width: 12rem;">
							<option value="가맹점 전체" selected>가맹점 전체</option>
							<option value="가맹점 선택1">가맹점 선택1</option>
							<option value="가맹점 선택2">가맹점 선택2</option>
							<option value="가맹점 선택3">가맹점 선택3</option>
						</select> -->

						<select class="form-control mr-2" style="width: 6rem;" name="search1">
							<option value="all" selected>전체</option>
							<option value="name">이름</option>
							<option value="hp">휴대폰번호</option>
						</select>

						<input class="form-control form-control-sm pl-2 mr-2" type="text" name="searchInput"
						 placeholder="검색어를 입력하세요." style="width: 10rem;" onkeyup="enterkey()">

						<select class="form-control mr-2" style="width: 4.5rem;" name="search2">
							<option value="salesdate" selected>판매일</option>
						</select>

						<input type="text" class="d-30 calendar calendar-img mr-2" name="searchDate1">
						~ &nbsp;
						<input type="text" class="date2 calendar calendar-img mr-2" name="searchDate2">

						<button type="button" class="btn btn-search" id="searchBtn"><i 
								class="fa-solid fa-magnifying-glass mr-1"></i>검색</button>
					</div>

					<!-- *************************** -->
					<div class="d-flex align-items-center mt-2">

						<span class="sel-name mr-2">거래 구분</span>
						<select class="form-control mr-2" style="width: 7rem;" name="paymethod">
							<option value="method_all" selected>전체</option>
							<option value="CARD">신용카드</option>
							<option value="CMONEY">현금영수증</option>
							<option value="MONEY">현금수납</option>
						</select>
						<span class="sel-name mr-2 ml-2">승인 구분</span>
						<select class="form-control mr-2" style="width: 5rem;" name="paygubn">
							<option value="pay_all" selected>전체</option>
							<option value="ACC">승인</option>
							<option value="CAN">취소</option>
						</select>

						<span class="sel-name mr-2 ml-2">카드사 선택</span>
						<div class="d-flex justify-content-start" id="cards">
							<!-- <input class="inp-cbx" id="card1" type="checkbox" />
							<label class="cbx" for="card1"><span>
									<svg width="17px" height="15px">
										<use xlink:href="#check"></use>
									</svg></span><span class="mr-2">비씨</span></label> -->
						</div>
						<!--SVG Sprites-->
						<svg class="inline-svg">
							<symbol id="check" viewbox="0 0 12 10">
								<polyline points="1.5 6 4.5 9 10.5 1"></polyline>
							</symbol>
						</svg>
					</div>

					<div class="box p-0 d-flex justify-content-between">
						<div class="square-wrap">
							<ul>
								<li class="d-flex justify-content-between align-items-center">
									<div class="icon-wrap"><i class="fa-solid fa-basket-shopping"></i></div>
									<ul>
										<div class="square-total text-right">전체 품목수 / 전체 건수</div>
										<li class="square-title my-0 text-right" id="ptcnt-tcnt"></li>
									</ul>
								</li>
								<li class="square-title">전체 매출액 / 판매 매출</li>
								<li class="square-price" id="total"></li>
							</ul>
							<div class="circle circle-top"></div>
							<div class="circle circle-bottom"></div>
						</div>
						<div class="square-wrap">
							<ul>
								<li class="d-flex justify-content-between align-items-center">
									<div class="icon-wrap"><i class="fa-solid fa-basket-shopping"></i></div>
									<ul>
										<div class="square-total text-right">판매일자 품목수 / 판매 건수</div>
										<li class="square-title my-0 text-right" id="sncnt-scnt"></li>
									</ul>
								</li>
								<li class="square-title">판매일자 전체 매출액 / 판매 매출</li>
								<li class="square-price" id="stotal"></li>
							</ul>
							<div class="circle circle-top"></div>
							<div class="circle circle-bottom"></div>
						</div>
						<div class="square-wrap">
							<ul>
								<li class="d-flex justify-content-between align-items-center">
									<div class="icon-wrap"><i class="fa-solid fa-basket-shopping"></i></div>
									<ul>
										<div class="square-total text-right">신규 가맹점 (D-30) 품목수 / 가맹 건수</div>
										<li class="square-title my-0 text-right" id="pncnt-ncnt"></li>
									</ul>
								</li>
								<li class="square-title">신규 가맹점 (D-30) 매출액 / 판매 매출 </li>
								<li class="square-price" id="ntotal"></li>
							</ul>
						</div>
					</div><!-- box -->

					<div class="box">
						<div class="length-wrap d-flex justify-content-between align-items-center">
							<div class="mb-2 d-flex align-items-center"><span class="bf-wrap"></span></div>
						</div><!-- length-wrap -->
						<div class="table-responsive">
							<div class="table-wrap table-media">
								<table id="table" class="table table-striped table-hover text-center" style="width: 100%;">
									<thead>
										<tr>
											<th>No.</th>
											<th>승인일시</th>
											<th>TID</th>
											<th>카드사</th>
											<th>승인번호</th>
											<th>할부</th>
											<th>결제구분</th>
											<th>금액</th>
											<th>부가세</th>
											<th>할인</th>
											<th>상품</th>
											<th>판매자</th>
											<th>가맹점명</th>
											<th>결제코드</th>
										</tr>
									</thead>
								</table>
							</div>
						</div><!-- table-responsive -->
						<div class="page-wrap">
							<div class="dataTables_paginate pagination justify-content-center">
								<span></span>
							</div><!-- pagination -->
						</div><!-- page-wrap -->
					</div><!-- box -->
					<div class="box">
						<div class="length-wrap2 d-flex justify-content-between align-items-center">
							<div class="mb-2 d-flex align-items-center"><span class="bf-wrap2"></span></div>
						</div><!-- length-wrap -->
						<div class="table-responsive">
							<div class="table-wrap table-media">
								<table id="table2" class="table table-striped table-hover text-center" style="width: 100%;">
									<thead>
										<tr>
											<th>No.</th>
											<th>바코드</th>
											<th>상품명</th>
											<th>제조사</th>
											<th>포장수량</th>
											<th>규격</th>
											<th>단위</th>
											<th>용량(size)</th>
											<th>판매수량</th>
											<th>판매가</th>
											<th>할인</th>
											<th>판매금액</th>
											<th>재고수량</th>
										</tr>
									</thead>
								</table>
							</div>
						</div><!-- table-responsive -->
						<div class="page-wrap2"></div>
					</div><!-- box -->
				</div><!-- content -->
			</article>

			<jsp:include page="/chain/com/footer.jsp" /><!-- footer -->

		</div><!-- section -->
	</div><!-- wrapper -->

	<jsp:include page="/chain/com/remote.jsp" /><!-- 원격지원 -->
	
	<script src="/chain/js/common.js"></script>
	<script src="/chain/js/sell.js"></script>
</body>
</html>