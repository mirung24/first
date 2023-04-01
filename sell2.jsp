<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
	<title>판매내역</title>
	<jsp:include page="/shop/com/nav.jsp" /><!-- navi-wrap -->
	<link rel="stylesheet" href="/shop/css/sell2.css">
</head>
<body>
		<div class="section d-flex justify-content-between flex-column">
			<article>
				<jsp:include page="/shop/com/header.jsp" />

				<div class="content">
					<!-- <div id="loading" style="display: none; ">
					    <div id="loading_bar">
					        <img src="/img/loading1.gif">
					    </div>
					</div> -->
				
					<input type="hidden" id="compcd" value="${uservo.compcd}">
					<input type="hidden" id="regcd" value="${uservo.userid}">
					<input type="hidden" id="corpnum" value="${uservo.corporatenumber}">
					<div class="d-flex align-items-center">
						<select class="form-control mr-2" style="width: 6rem;" name="search1">
							<option value="all" selected>전체</option>
							<option value="productcd">바코드</option>
							<option value="productname">상품명</option>
						</select>

						<input class="form-control form-control-sm pl-2 mr-2" type="text" placeholder="검색어를 입력하세요."
							style="width: 10rem;" name="searchInput" onkeyup="enterkey()">

						<span class="sel-name mr-2">판매 일자</span>

						<input type="text" id="date1" class="d-30 calendar calendar-img mr-2" name="searchDate1">
						~ &nbsp;
						<input type="text" id="date2" class="date2 calendar calendar-img mr-2" name="searchDate2">

						<button type="button" class="btn btn-search" id="searchBtn"><i class="fa-solid fa-magnifying-glass mr-1"></i>검색</button>
						<div class="date-tabs">
							<button type="button" id="today" class="date-tab">오늘</button>
							<button type="button" id="yesterday" class="date-tab">어제</button>
							<button type="button" id="thisweek" class="date-tab">금주</button>
							<button type="button" id="lastweek" class="date-tab">전주</button>
							<button type="button" id="thismonth" class="date-tab">당월</button>
							<button type="button" id="lastmonth" class="date-tab">전월</button>
						</div>
					</div>

					<div class="box pt-0">
						<div class="table-responsive" style="border: none; padding-top: 1rem;">
							<div class="length-wrap d-flex justify-content-between align-items-center">
								<div class="mb-2 d-flex align-items-center"><span class="bf-wrap"></span></div>
							</div><!-- length-wrap -->
							<div class="table-wrap table-media" style="border: 1px solid #eee; border-radius: 5px;">
								<table id="table" class="table table-striped table-hover text-center" style="width: 100%;">
									<thead>
										<tr>
											<th>No.</th>
											<th>판매일자</th>
											<th>상품명</th>
											<th>제조사</th>
											<th>단위</th>
											<th>규격</th>
											<th>포장단위</th>
											<th>총판매수량</th>
											<th>총할인가</th>
											<th>총판매금액</th>
											<th>총사입가</th>
											<th>마진</th>
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
					</div><!-- box -->
				</div><!-- content -->
			</article>

			<jsp:include page="/shop/com/footer.jsp" />

		</div><!-- section -->
	</div><!-- wrapper -->

	<jsp:include page="/shop/com/remote.jsp" />
	
	<script src="/shop/js/common.js"></script>
	<script src="/shop/js/sell2.js"></script>
</body>
</html>