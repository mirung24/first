<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
	<title>상품포장관리</title>
	<jsp:include page="/shop/com/nav.jsp" /><!-- navi-wrap -->
	<link rel="stylesheet" href="/shop/css/pack.css">
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
					<div class="d-flex align-items-center">
						<!-- <select class="form-control mr-2" style="width: 6rem;">
							<option value="분류 전체" selected>분류 전체</option>
							<option value="대">대</option>
							<option value="중">중</option>
							<option value="소">소</option>
						</select> -->

						<select class="form-control mr-2" style="width: 4.7rem;" name="search1">
							<option value="all" selected>전체</option>
							<option value="productname">상품명</option>
							<option value="productid">바코드</option>
							<option value="maker">제조사</option>
						</select>

						<input class="form-control form-control-sm pl-2 mr-2" type="text" name="searchInput"
						placeholder="검색어를 입력하세요." style="width: 10rem;" onkeyup="enterkey()">

						<select class="form-control mr-2" style="width: 5.5rem;" name="search2">
							<option value="all" selected>전체일자</option>
							<option value="salesdate">판매일</option>
							<!-- <option value="등록일">등록일</option> -->
						</select>

						<input type="text" id="date1" class="d-30 calendar calendar-img mr-2" name="searchDate1">
						~ &nbsp;
						<input type="text" id="date2" class="date2 calendar calendar-img mr-2" name="searchDate2">

						<!-- <select class="form-control mr-2" style="width: 6rem;">
							<option value="PB 전체" selected>PB 전체</option>
							<option value="PB 리스트">PB 리스트</option>
						</select> -->

						<button type="button" class="btn btn-search mr-2" id="searchBtn"><i
								class="fa-solid fa-magnifying-glass mr-1"></i>검색</button>
						<button type="button" class="btn btn-plus pop-link2 connectyn" style="visibility:hidden !important;"><i class="fa-solid fa-plus mr-1"></i>등록</button>
					</div>

<!-- 					<div class="box p-0 d-flex justify-content-between">
						<div class="square-wrap">
		                     <ul>
		                        <li class="d-flex justify-content-between align-items-center">
		                           <div class="icon-wrap"><span>당월 </span></div>
		                           <ul class="d-flex align-items-center">
		                              <li class="square-total">전체건수<p class="square-title" id="totalcnt1">0건</p></li>
		                              <div class="square-line"></div>
		                              <li class="square-total">조제건수<p class="square-title" id="etccnt1">0건</p></li>
		                              <div class="square-line"></div>
		                              <li class="square-total">일반건수<p class="square-title" id="otccnt1">0건</p></li>
		                           </ul>
		                           </li>
		                              <ul class="d-flex align-items-center mt-4">
		                                 <li class="square-title">전체 매출액 <p class="square-price" id="totalamt1">0원</p></li>
		                                 <div class="square-line2"></div>
		                                 <li class="square-title" id="etcamt1">조제 매출 <p class="square-price"><span class="square-target" data-target="0" data-speed="1"
		                              data-gap="1660"><span>0</span>원</span></p></li>
		                              <div class="square-line2"></div>
		                                 <li class="square-title" id="otcamt1">일반 매출 <p class="square-price"><span class="square-target" data-target="0" data-speed="1"
		                              data-gap="1660"><span>0</span>원</span></p></li>
		                              </ul>
		                     </ul>
		                     <div class="circle circle-top"></div>
		                     <div class="circle circle-bottom"></div>
		                  </div>
		                  <div class="square-wrap">
		                     <ul>
		                        <li class="d-flex justify-content-between align-items-center">
		                           <div class="icon-wrap"><span>금주 </span></div>
		                           <ul class="d-flex align-items-center">
		                              <li class="square-total">전체건수<p class="square-title" id="totalcnt2">0건</p></li>
		                              <div class="square-line"></div>
		                              <li class="square-total">조제건수<p class="square-title" id="etccnt2">0건</p></li>
		                              <div class="square-line"></div>
		                              <li class="square-total">일반건수<p class="square-title" id="otccnt2">0건</p></li>
		                           </ul>
		                           </li>
		                              <ul class="d-flex align-items-center mt-4">
		                                 <li class="square-title">전체 매출액 <p class="square-price" id="totalamt2">0원</p></li>
		                                 <div class="square-line2"></div>
		                                 <li class="square-title" id="etcamt2">조제 매출 <p class="square-price"><span class="square-target" data-target="0" data-speed="1"
		                              data-gap="1660"><span>0</span>원</span></p></li>
		                              <div class="square-line2"></div>
		                                 <li class="square-title" id="otcamt2">일반 매출 <p class="square-price"><span class="square-target" data-target="0" data-speed="1"
		                              data-gap="1660"><span>0</span>원</span></p></li>
		                              </ul>
		                     </ul>
		                     <div class="circle circle-top"></div>
		                     <div class="circle circle-bottom"></div>
		                  </div>
		                  <div class="square-wrap">
		                     <ul>
		                        <li class="d-flex justify-content-between align-items-center">
		                           <div class="icon-wrap"><span>당일 </span></div>
		                           <ul class="d-flex align-items-center">
		                              <li class="square-total">전체건수<p class="square-title" id="totalcnt3">0건</p></li>
		                              <div class="square-line"></div>
		                              <li class="square-total">조제건수<p class="square-title" id="etccnt3">0건</p></li>
		                              <div class="square-line"></div>
		                              <li class="square-total">일반건수<p class="square-title" id="otccnt3">0건</p></li>
		                           </ul>
		                           </li>
		                              <ul class="d-flex align-items-center mt-4">
		                                 <li class="square-title">전체 매출액 <p class="square-price" id="totalamt3">0원</p></li>
		                                 <div class="square-line2"></div>
		                                 <li class="square-title" id="etcamt3">조제 매출 <p class="square-price"><span class="square-target" data-target="0" data-speed="1"
		                              data-gap="1660"><span>0</span>원</span></p></li>
		                              <div class="square-line2"></div>
		                                 <li class="square-title" id="otcamt3">일반 매출 <p class="square-price"><span class="square-target" data-target="0" data-speed="1"
		                              data-gap="1660"><span>0</span>원</span></p></li>
		                              </ul>
		                     </ul>
		                  </div>
					</div>box -->

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
											<th>상품명</th>
											<th>제품코드</th>
											<th>제조사</th>
											<th>포장단위</th>
											<th>규격</th>
											<th>용량(size)</th>
											<th>최고가</th>
											<th>최저가</th>
											<th>최다가</th>
											<th>매출(당일)</th>
											<th>매출(전일)</th>
											<th>매출(D-30)</th>
											<th>순위(D-30)</th>
											<th>제품 아이디</th>
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
	
	<div class="modal-wrap1">
		<div class="pop1">
		<form name="detail_f" id="detail_f" method="post">
			<input type="hidden" name="compcd" value="${uservo.compcd}">
			<input type="hidden" name="f_regcd" value="${uservo.userid}">
			<input type="hidden" name="f_chaincode" value="${uservo.chaincd}">
			<input type="hidden" name="productid" id="productid" value="">
			<div class="pop-title">상품 상세정보</div>
			<div class="pop-cont">
				<div class="d-flex">
					<ul>
						<ul>
							<li class="pop-list"><span>상품명</span><input type="text" class="form-control sproductname" name="sproductname"></li>
							<li class="pop-list"><span>대표코드</span><input type="text" class="form-control sproductcd" name="sproductcd"></li>
							<li class="pop-list"><span>제조사</span><input type="text" class="form-control smaker" name="smaker"></li>
							<li class="pop-list"><span>규격</span><input type="text" class="form-control sspec" name="sspec"></li>
							<li class="pop-list"><span>단위</span><input type="text" class="form-control sunit" name="sunit"></li>
							<li class="pop-list"><span>용량(size)</span><input type="text" class="form-control ssize" name="ssize"></li>
							<!-- <li class="pop-list"><span>카테고리</span>
								<select class="form-control scategory" name="scategory">
									<option value="" selected></option>
								</select>
							</li> -->
							<li class="pop-list"><span>메모</span>
								<textarea name="sremarks" id="sremarks" cols="55" rows="14"></textarea></li>
						</ul>
					</ul>

					<ul class="ml-4 pl-4" style="border-left: 2px dashed #ddd;">

						<li class="pop-list"><span>그룹상품 추가</span><button type="button" class="btn btn-plus connectyn" style="visibility:hidden !important;">
						<i class="fa-solid fa-plus mr-1"></i>추가</button></li>

						<div class="table-responsive t1 mb-3">
							<table class="table table-hover table-striped text-center mb-0">
								<thead>
									<tr>
										<th class="fixedHeader">제품코드</th>
										<th class="fixedHeader">바코드</th>
										<th class="fixedHeader">제품이름</th>
										<th class="fixedHeader">제조사</th>
										<th class="fixedHeader">규격</th>
										<th class="fixedHeader">단위</th>
										<th class="fixedHeader">용량(size)</th>
										<th class="fixedHeader">포장수량</th>
										<th class="fixedHeader">단가</th>
										<th class="fixedHeader">할인가</th>
										<th class="fixedHeader">판매가</th>
										<th style="display:none;">제품아이디s</th>
										<th class="fixedHeader">최다가</th>
										<th class="fixedHeader">최소가</th>
										<th class="fixedHeader">최고가</th>
									</tr>
								</thead>
								<tbody class="ga_tbody">
								</tbody>
							</table>
						</div>

						<div class="line" style="border-top: 2px dashed #ddd;"></div>

						<div class="pop-total mt-3">
							<li class="pop-list"><span class="pre_year1"></span><input type="text" disabled class="form-control  mr-3"
									value="" id="sprodtot"></li>
							<li class="pop-list"><span class="pre_year2"></span><input type="text" disabled class="form-control"
									value="" id="sprodcnt"></li>
							<li class="pop-list"><span>판매평균 (일)</span><input type="text" disabled class="form-control mr-3"
									value="" id="sprodavg"></li>
							<li class="pop-list"><span>판매횟수 (평균)</span><input type="text" disabled class="form-control"
									value="" id="sprodavg2"></li>
						</div>

						<li class="pop-list d-flex justify-content-start align-items-center mt-2"><span
								style="min-width: 7.5rem;">판매내역</span><input type="text" id="popDate1"
								class="d-30 calendar calendar-img mr-2" style="width: 7.5rem;"> ~ &nbsp; <input type="text" id="popDate2"
								class="date2 calendar calendar-img mr-2" style="width: 7.5rem;"><button type="button"
								class="btn btn-search pop-search"><i class="fa-solid fa-magnifying-glass mr-1"></i>검색</button></li>

						<div class="table-responsive t2 mt-2">
							<table class="table table-hover table-striped text-center mb-0">
								<thead>
									<tr>
										<th class="fixedHeader">판매일자</th>
										<th class="fixedHeader">포장수량</th>
										<th class="fixedHeader">판매금액</th>
										<th class="fixedHeader">판매횟수</th>
										<th class="fixedHeader">판매수량</th>
										<th class="fixedHeader">구매자수</th>
									</tr>
								</thead>
								<tbody class="ph_tbody">
								</tbody>
							</table>
						</div>

					</ul>
				</div>
				<div class="text-center mt-3"><button type="button" class="btn btn-cancle pop-close1 mr-2">닫기</button>
				<button type="button" form="detail_f" class="btn btn-save connectyn" style="visibility:hidden !important;" id="popsv_btn">저장</button></div>
			</div>
		</form>
		</div>
	</div><!-- modal-wrap1 -->

	<div class="modal-wrap2">
		<div class="pop2">
			<div class="pop-title">상품 등록</div>
			<div class="pop-cont">
				<ul>
					<li class="pop-list"><span>상품명</span><input type="text" class="form-control rproductname" value=""></li>
					<li class="pop-list"><span>대표코드</span><input type="text" class="form-control rproductcd" value=""></li>
					<li class="pop-list"><span>제조사</span><input type="text" class="form-control rmaker"></li>
					<li class="pop-list"><span>규격</span><input type="text" class="form-control rspec"></li>
					<li class="pop-list"><span>단위</span><input type="text" class="form-control runit"></li>
					<li class="pop-list"><span>용량(size)</span><input type="text" class="form-control rsize"></li>
					<!-- <li class="pop-list"><span>카테고리</span>
						<select class="form-control rcategory">
							<option value="" selected></option>
						</select>
					</li> -->
					<li class="pop-list"><span>메모</span>
						<textarea name="regi_remarks" id="regi_remarks" cols="100" rows="4"></textarea></li>
				</ul>
				<div class="text-center mt-3"><button type="button" class="btn btn-cancle pop-close2 mr-2">닫기</button><button
						type="button" class="btn btn-save">저장</button></div>
			</div>
		</div>
	</div><!-- modal-wrap2 -->

	<jsp:include page="/shop/com/remote.jsp" />
	
	<script src="/shop/js/common.js"></script>
	<script src="/shop/js/pack.js"></script>
</body>
</html>