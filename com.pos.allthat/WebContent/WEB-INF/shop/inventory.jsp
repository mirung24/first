<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
	<title>재고관리</title>
	<jsp:include page="/shop/com/nav.jsp" /><!-- navi-wrap -->
	<link rel="stylesheet" href="/shop/css/inventory.css">
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
					
					<div class="d-flex align-items-center">
						<!-- <select class="form-control mr-2" style="width: 6rem;">
							<option value="분류 전체" selected>분류 전체</option>
							<option value="분류1">분류1</option>
							<option value="분류2">분류2</option>
							<option value="분류3">분류3</option>
						</select> -->

						<select class="form-control mr-2" style="width: 6rem;" name="search1">
							<option value="all" selected>전체</option>
							<option value="productname">상품명</option>
							<option value="maker">제조사</option>
							<option value="productid">제품코드</option>
						</select>

						<input class="form-control form-control-sm pl-2 mr-2" type="text" onkeyup="enterkey()"
						placeholder="검색어를 입력하세요." style="width: 10rem;" name="searchInput">

						<select class="form-control mr-2" style="width: 4.5rem;" name="search2">
							<option value="all" selected>전체일자</option>
							<option value="incomedate">입고일</option>
							<option value="salesdate">판매일</option>
							<!-- <option value="입고일">입고일</option> -->
						</select>

						<input type="text" id="date1" class="d-30 calendar calendar-img mr-2" name="searchDate1">
						~ &nbsp;
						<input type="text" id="date2" class="date2 calendar calendar-img mr-2" name="searchDate2">

						<select class="form-control mr-2" style="width: 8rem;" id="account" name="search3">
							<!-- 거래처 리스트 -->
						</select>

						<button type="button" class="btn btn-search mr-2" id="searchBtn"><i
								class="fa-solid fa-magnifying-glass mr-1"></i>검색</button>
					</div>

					<div class="box-wrap d-flex">
						
						<div class="box mr-3">
							<div class="d-flex justify-content-end align-items-center mb-2 connectyn" style="display: none !important;">재고보정
								<select class="form-control mx-2" style="width: 4.5rem;" name="search4">
									<option value="30" selected>D-30</option>
									<option value="60">D-60</option>
									<option value="90">D-90</option>
								</select>평균 판매량의 <input class="form-control mx-2" type="text" style="width: 2.5rem;" id="percent">% &nbsp;
								보유일수<input class="form-control mx-2" type="text" style="width: 2.5rem;" id="period">일
								<button type="button" class="btn btn-plus ml-2" id="approBtn">적정재고반영</button>
								<button type="button" class="btn btn-plus ml-2" id="saveBtn"><i class="fa-solid fa-file-arrow-up mr-1"
	                        	style="font-size: 0.9rem;"></i>저장</button>
							</div>
							<div class="length-wrap d-flex justify-content-between align-items-center">
								<div class="mb-2 d-flex align-items-center"><span class="bf-wrap"></span></div>
							</div><!-- length-wrap -->
							<div class="table-responsive">
								<div class="table-wrap">
									<table id="table" class="table table-striped table-hover text-center" style="width: 100%;">
										<thead>
											<tr>
												<th data-orderable="false">
													<div class="custom-control custom-checkbox"><input id="magicBtn" type="checkbox"
															class="custom-control-input"><label class="custom-control-label" for="magicBtn"></label>
													</div>
												</th>
												<th>제품코드</th>
												<th>상품명</th>
												<th>제조사</th>
												<th>규격</th>
												<th>단위</th>
												<th>현재재고</th>
												<th>적정재고</th>
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

						<div class="box-show">
							<div class="box tab-wrap">
								<div class="table-responsive" style="height: 45.9rem;">
									<table class="table table-hover table-striped text-center mb-0">
										<thead>
											<tr>
												<th style="width: 10px;">No.</th>
												<th style="width: 50px;">구분</th>
												<th>거래처</th>
												<th style="width: 150px;">거래일시</th>
												<th>수량</th>
												<th>단가</th>
												<th>할인</th>
												<th>금액</th>
											</tr>
										</thead>
										<tbody class="sinven_sel">
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div><!-- content -->
			</article>

			<jsp:include page="/shop/com/footer.jsp" />

		</div><!-- section -->
	</div><!-- wrapper -->

	<jsp:include page="/shop/com/remote.jsp" />
	
	<script src="/shop/js/common.js"></script>
	<script src="/shop/js/inventory.js"></script>
</body>
</html>