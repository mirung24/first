<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
	<title>상품포장관리</title>
	<jsp:include page="/chain/com/nav.jsp" /><!-- navi-wrap -->
	<link rel="stylesheet" href="/chain/css/pack.css">
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
							<option value="salesdate" selected>판매일</option>
						</select>

						<input type="text" class="d-30 calendar calendar-img mr-2" name="searchDate1">
						~ &nbsp;
						<input type="text" class="date2 calendar calendar-img mr-2" name="searchDate2">

						<button type="button" class="btn btn-search mr-2" id="searchBtn"><i
								class="fa-solid fa-magnifying-glass mr-1"></i>검색</button>
						<button type="button" class="btn btn-plus pop-link2"><i class="fa-solid fa-plus mr-1"></i>등록</button>
					</div>

<!-- 					<div class="box p-0 d-flex justify-content-between">
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
											<th>단위</th>
											<th>용량(size)</th>
											<th>최고가</th>
											<th>최저가</th>
											<th>최다가</th>
											<th>매출(당일)</th>
											<th>매출(전일)</th>
											<th>매출(D-30)</th>
											<th>순위(D-30)</th>
											<th>제품아이디</th>
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

			<jsp:include page="/chain/com/footer.jsp" /><!-- footer -->

		</div><!-- section -->
	</div><!-- wrapper -->

	<div class="modal-wrap1">
		<div class="pop1">
		<form name="detail_f" id="detail_f" method="post">
			<div class="pop-title">상품 상세정보</div>
			<div class="pop-cont">
				<div class="d-flex">
				<input type="hidden" value="${uservo.chaincd}" name="chaincode">
				<input type="hidden" name="productid" id="productid" value="">
				<input type="hidden" value="${uservo.userid}" id="regcd" name="regcd">
					<ul>
						<ul>
							<li class="pop-list"><span>상품명</span><input type="text" class="form-control" id="d_prodname" name="d_prodname"></li>
							<li class="pop-list"><span>대표코드</span><input type="text" class="form-control" id="d_prodcd" name="d_prodcd"></li>
							<li class="pop-list"><span>제조사</span><input type="text" class="form-control" id="d_prodmaker" name="d_prodmaker"></li>
							<li class="pop-list"><span>규격</span><input type="text" class="form-control" id="d_prodspec" name="d_prodspec"></li>
							<li class="pop-list"><span>단위</span><input type="text" class="form-control" id="d_produnit" name="d_produnit"></li>
							<li class="pop-list"><span>용량(size)</span><input type="text" class="form-control" id="d_prodsize" name="d_prodsize"></li>
							<!-- <li class="pop-list"><span>카테고리</span>
								<select class="form-control" id="d_prodcate" name="d_prodcate">
									<option value="" selected></option>
								</select>
							</li> -->
							<!-- <li class="pop-list"><span>PB그룹</span>
								<select class="form-control">
									<option value="선택" selected>선택</option>
									<option value="선택1">선택1</option>
									<option value="선택2">선택2</option>
								</select>
							</li>
							<li class="pop-list"><span>PB판매가 변경유무</span>
								<select class="form-control">
									<option value="고정" selected>고정</option>
									<option value="변동">변동</option>
								</select>
							</li> -->
							<li class="pop-list"><span>메모</span>
								<textarea name="d_prodremarks" id="d_prodremarks" cols="55" rows="14"></textarea></li>
						</ul>
					</ul>

					<ul class="ml-4 pl-4" style="border-left: 2px dashed #ddd;">

						<li class="pop-list"><span>그룹상품 추가</span><button type="button" class="btn btn-plus" id="ga_btn"><i
									class="fa-solid fa-plus mr-1"></i>추가</button></li>

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
										<th>제품아이디s</th>
									</tr>
								</thead>
								<tbody class="ga_tbody">
								</tbody>
							</table>
						</div>

						<div class="line" style="border-top: 2px dashed #ddd;"></div>

						<div class="pop-total mt-3">
							<li class="pop-list"><span class="pre_year1"></span><input type="text" disabled class="form-control  mr-3"
									value="" id="prodtot"></li>
							<li class="pop-list"><span class="pre_year2"></span><input type="text" disabled class="form-control"
									value="" id="prodcnt"></li>
							<li class="pop-list"><span>판매평균 (일)</span><input type="text" disabled class="form-control mr-3"
									value="" id="prodavg"></li>
							<li class="pop-list"><span>판매횟수 (평균)</span><input type="text" disabled class="form-control"
									value="" id="prodavg2"></li>
						</div>

						<li class="pop-list d-flex justify-content-start align-items-center mt-2"><span
								style="min-width: 7.5rem;">판매내역</span><input type="text" name="popSearch1"
								class="d-30 calendar calendar-img mr-2" style="width: 7.5rem;"> ~ &nbsp; <input type="text" name="popSearch2"
								class="date2 calendar calendar-img mr-2" style="width: 7.5rem;"><button type="button"
								class="btn btn-search" name="popSearchBtn"><i class="fa-solid fa-magnifying-glass mr-1"></i>검색</button></li>

						<div class="table-responsive t2 mt-2">
							<table class="table table-hover table-striped text-center mb-0">
								<thead>
									<tr>
										<th class="fixedHeader">판매일자</th>
										<th class="fixedHeader">판매금액</th>
										<th class="fixedHeader">판매횟수</th>
										<th class="fixedHeader">최대판매처</th>
										<th class="fixedHeader">최저판매처</th>
									</tr>
								</thead>
								<tbody class="ph_tbody">
								</tbody>
							</table>
						</div>

					</ul>
				</div>
				<div class="text-center mt-3"><button type="button" class="btn btn-cancle pop-close1 mr-2">닫기</button><button
						type="button" form="detail_f" class="btn btn-save" id="popsv_btn">저장</button></div>
			</div>
		</form>
		</div>
	</div><!-- modal-wrap1 -->

	<div class="modal-wrap2">
		<div class="pop2">
			<div class="pop-title">상품 등록</div>
			<div class="pop-cont">
				<ul>
					<li class="pop-list"><span>상품명</span><input type="text" class="form-control productname" id="productname" value=""></li>
					<li class="pop-list"><span>대표코드</span><input type="text" class="form-control productcd" value=""></li>
					<li class="pop-list"><span>제조사</span><input type="text" class="form-control maker" value=""></li>
					<li class="pop-list"><span>규격</span><input type="text" class="form-control spec" value=""></li>
					<li class="pop-list"><span>단위</span><input type="text" class="form-control unit" value=""></li>
					<li class="pop-list"><span>용량(size)</span><input type="text" class="form-control size" value=""></li>
					<!-- <li class="pop-list"><span>카테고리</span>
						<select class="form-control Kategorie category">
							<option value="" selected></option>
						</select>
					</li> -->
					<li class="pop-list"><span>메모</span>
						<textarea name="" id="remarks" cols="100" rows="4"></textarea></li>
				</ul>
				<div class="text-center mt-3"><button type="button" class="btn btn-cancle pop-close2 mr-2">닫기</button><button
						type="button" class="btn btn-save">저장</button></div>
			</div>
		</div>
	</div><!-- modal-wrap2 -->

	<jsp:include page="/chain/com/remote.jsp" /><!-- 원격지원 -->
	
	<script src="/chain/js/common.js"></script>
	<script src="/chain/js/pack.js"></script>
</body>
</html>