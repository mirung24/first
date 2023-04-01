<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
	<title>입고관리</title>
	<jsp:include page="/shop/com/nav.jsp" /><!-- navi-wrap -->
	<link rel="stylesheet" href="/shop/css/incoming.css">
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
							<option value="productid">바코드</option>
							<option value="maker">제조사</option>
						</select>

						<input class="form-control form-control-sm pl-2 mr-2" type="text" placeholder="검색어를 입력하세요."
							name="searchInput" style="width: 10rem;" onkeyup="enterkey()">

						<select class="form-control mr-2" style="width: 4.5rem;" name="search2">
							<option value="incomedate" selected>입고일</option>
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
								<button type="button" class="btn btn-plus pop-link2"><i class="fa-solid fa-plus mr-1"></i>입고서 등록</button>
					</div>

					<div class="box p-0 d-flex justify-content-between">
						<div class="square-wrap">
							<ul>
								<li class="d-flex justify-content-between align-items-center">
									<div class="icon-wrap"><i class="fa-solid fa-truck-fast"></i></div>
									<div class="square-total" id="acnt1"></div>
								</li>
								<li class="square-title">당월 입고 거래액 / 건수</li>
								<li class="square-price" id="total-cnt1"></li>
							</ul>
							<div class="circle circle-top"></div>
							<div class="circle circle-bottom"></div>
						</div>
						<div class="square-wrap">
							<ul>
								<li class="d-flex justify-content-between align-items-center">
									<div class="icon-wrap"><i class="fa-solid fa-truck-fast"></i></div>
									<div class="square-total" id="acnt2"></div>
								</li>
								<li class="square-title">입고일자 거래액 / 건수</li>
								<li class="square-price" id="total-cnt2"></li>
							</ul>
						</div>
					</div><!-- box -->

					<div class="box-wrap d-flex">
						<div class="box mr-3">
							<div class="length-wrap d-flex justify-content-between align-items-center">
								<div class="mb-2 d-flex align-items-center"><span class="bf-wrap"></span></div>
							</div><!-- length-wrap -->
							<div class="table-responsive">
								<div class="table-wrap">
									<table id="table" class="table table-striped table-hover text-center" style="width: 100%;">
										<thead>
											<tr>
												<th>No.</th>
												<th>입고일자</th>
												<th>거래처</th>
												<th>금액</th>
												<th>부과세</th>
												<th>할인가</th>
												<th>총금액</th>
												<th>구매코드</th>
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

						<div class="box-show">
							<div class="box tab-wrap">
								<div>
									<li class="pop-list"><span>
											<!-- 가맹점 --></span>
										<div class=" d-flex">
											<button type="button" class="btn btn-plus" id="removeBtn"><i
												class="fa-regular fa-trash-can mr-1" style="font-size: 0.9rem;"></i>삭제</button></div>
									</li>

									<div class="table-responsive" style="height: 33.2rem;">
										<table class="table table-hover table-striped text-center mb-0">
											<thead>
												<tr>
													<th>No.</th>
													<th style="display:none;">제품코드</th>
													<th>상품명</th>
													<th>제조사</th>
													<th>포장<br>수량</th>
													<th>규격<br>(단위)</th>
													<th>단가</th>
													<th>수량</th>
													<th>금액</th>
													<th>할인</th>
													<th>부과세</th>
													<th>합계</th>
												</tr>
											</thead>
											<tbody class="detail_list">
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div><!-- content -->
			</article>

			<jsp:include page="/shop/com/footer.jsp" />

		</div><!-- section -->
	</div><!-- wrapper -->
	
<div class="modal-wrap1">
		<div class="pop1">
			<div class="pop-title">상품 추가</div>
			<div class="pop-cont">
				<div class="d-flex align-items-center">
					<select class="form-control mr-2" style="width: 5.7rem;" name="search4">
						<option value="productname" selected>상품명</option>
						<option value="maker">제조사</option>
						<option value="productid">바코드</option>
					</select>
		
					<input class="form-control form-control-sm pl-2 mr-2" type="text" 
					placeholder="검색어를 입력하세요." style="width: 10rem;" name="searchInput2">
		
						<button type="button" class="btn btn-search" id="searchBtn2"><i
							class="fa-solid fa-magnifying-glass mr-1"></i>검색</button>
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
									<th>포장수량</th>
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
									<th>포장수량</th>
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
						type="button" class="btn btn-save" id="selBtn">선택완료</button></div>
			</div>
		</div>
	</div><!-- modal-wrap1 -->

	<div class="modal-wrap2">
		<div class="pop1 page">
			<h4 class="text-center font-weight-bold mb-3">입고서 등록</h4>
			<!-- <div class="text-right mb-2">발주NO : 20220915-0000001 | 발주일자 2022.09.15</div> -->
			<div class="d-flex">
				<div class="table-responsive mb-3 mr-3" style="border-left: none;border-right: none; border-bottom: none;">
					<table class="table table-print table-striped table-bordered text-center mb-0">
						<tbody>
							<tr>
								<td>공급처명</td>
								<td><select class="form-control text-center" style="height: 22px; 
								padding: 0;" id="account2" name="account2"></select></td>
								<td style="min-width: 94px;">사업자번호</td>
								<td style="min-width: 134px;" id="cornum"></td>
							</tr>
							<tr>
								<td>업태</td>
								<td id="busi"></td>
								<td>업종</td>
								<td id="sect"></td>
							</tr>
							<tr>
								<td>대표자</td>
								<td id="presi"></td>
								<td>담당자</td>
								<td id="mana"></td>
							</tr>
							<tr>
								<td>이메일</td>
								<td id="em"></td>
								<td>전화번호</td>
								<td id="te"></td>
							</tr>
							<tr>
								<td>주소</td>
								<td colspan="3" class="text-left" id="ad"></td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="table-responsive mb-3">
					<table class="table table-print table-striped table-bordered text-center mb-0">
						<tbody>
							<tr>
								<td>구매처명</td>
								<td>${uservo.companyname}</td>
								<td>사업자번호</td>
								<td>${uservo.corporatenumber}</td>
							</tr>
							<tr>
								<td>업태</td>
								<td>${uservo.business}</td>
								<td>업종</td>
								<td>${uservo.sectors}</td>
							</tr>
							<tr>
								<td>대표자</td>
								<td>${uservo.president}</td>
								<td>담당자</td>
								<td>${uservo.manager}</td>
							</tr>
							<tr>
								<td>이메일</td>
								<td>${uservo.email}</td>
								<td>전화번호</td>
								<td>${uservo.tel}</td>
							</tr>
							<tr>
								<td>주소</td>
								<td colspan="3" class="text-left">${uservo.addr}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<div class="text-right mb-2"><button type="button" class="btn btn-plus pop-link1"><i
				class="fa-solid fa-plus mr-1"></i>상품 추가</button></div>
			<div class="table-responsive mb-3">
				<table class="table table-striped text-center mb-0">
					<thead>
						<tr>
							<th>제품코드</th>
							<th>상품명</th>
							<th>제조사</th>
							<th>포장수량</th>
							<th>규격(단위)</th>
							<th>과세</th>
							<th>단가</th>
							<th>수량</th>
							<th>금액</th>
							<th>부과세</th>
							<th>할인가</th>
							<th>합계</th>
							<th>유효기간</th>
							<th>로트번호</th>
						</tr>
					</thead>
					<tbody class="regi_income">
					</tbody>
				</table>
			</div>

			<textarea rows="2" class="form-control w-100 p-1" placeholder="메모" id="remarks"></textarea>
			<div class="text-center mt-3"><button type="button" class="btn btn-cancle pop-close2 mr-2">닫기</button><button
					type="button" class="btn btn-save" id="incomeRegiBtn">저장</button></div>
		</div>
	</div><!-- modal-wrap2 -->

	<jsp:include page="/shop/com/remote.jsp" />
	
	<script src="/shop/js/common.js"></script>
	<script src="/shop/js/incoming.js"></script>
</body>
</html>