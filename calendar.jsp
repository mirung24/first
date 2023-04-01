<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
	<title>매출캘린더</title>
	<jsp:include page="/shop/com/nav.jsp" /><!-- navi-wrap -->
	<link rel="stylesheet" href="/shop/css/calendar.css">
	<script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
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
					
					<input type="hidden" id="compcd" value="${uservo.compcd}">
					<input type="hidden" value="${uservo.userid}" id="regcd">
					<input type="hidden" id="corpnum" value="${uservo.corporatenumber}">
					<ul class="mb-3 d-flex justify-content-between align-items-center">
						<li class="d-flex align-items-center">
							<input type='text' id="currnetMonth" class="calendar calendar-img form-control month_data" style="width: 6.1rem;">
						</li>
						<li class="monthsel">
							<i class="btn_pre fa fa-chevron-left pointer"></i>
							<span class="td_tdday mx-3"></span>
							<i class="btn_next fa fa-chevron-right pointer"></i>
						</li>
						<li class="text-right" style="width: 6.1rem;">
							<!-- <button type="button" class="btn btn-plus pop-link1"><i class="fa-solid fa-plus mr-1"></i>PB
								상품</button> -->
						</li>
					</ul>
					<div class="d-flex mb-2">
                 		<div class="mb"><span>전체</span> 전체매출 (건수)</div>
						<div class="tb ml-3"><span>조제</span> 조제매출 (건수)</div>
						<div class="cb ml-3"><span>일반</span> 일반매출 (건수)</div>
						<div class="rb ml-3"><span>할인</span> 할인금액</div>
						<div class="ub ml-3"><span>고객</span> 고객수</div>
               		</div>
					<input type='hidden' class="form-control month_data" value="2022-10" readonly />
					<div id="calendar"></div>

					<div class="box">
						<div class="table-responsive">
							<table class="table table-hover table-striped text-right mb-0">
								<thead>
									<tr>
										<th class="text-left">구분</th>
										<th id="present" style="width: 30rem;"></th>
										<th id="before1" style="width: 30rem;"></th>
										<th id="before2" style="width: 30rem;"></th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td class="text-left">조제건수</td>
										<td id="present_etccnt"></td>
										<td id="before1_etccnt"></td>
										<td id="before2_etccnt"></td>
									</tr>
									<tr>
										<td class="text-left">조제금액</td>
										<td id="present_etcamt"></td>
										<td id="before1_etcamt"></td>
										<td id="before2_etcamt"></td>
									</tr>
									<tr>
										<td class="text-left">판매건수</td>
										<td id="present_cnt"></td>
										<td id="before1_cnt"></td>
										<td id="before2_cnt"></td>
									</tr>
									<tr>
										<td class="text-left">판매금액</td>
										<td id="present_amt"></td>
										<td id="before1_amt"></td>
										<td id="before2_amt"></td>
									</tr>
									<tr>
										<td class="text-left">할인금액</td>
										<td id="present_dis"></td>
										<td id="before1_dis"></td>
										<td id="before2_dis"></td>
									</tr>
									<tr>
										<td class="text-left">고객수</td>
										<td id="present_cust"></td>
										<td id="before1_cust"></td>
										<td id="before2_cust"></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

				</div><!-- content -->
			</article>

			<jsp:include page="/shop/com/footer.jsp" />

		</div><!-- section -->
	</div><!-- wrapper -->
	
	<!-- <!-- <div class="modal-wrap1">
		<div class="pop1" style="width:850px">
			<div class="pop-title">PB상품</div>
			<div class="pop-cont">
				<div class="table-responsive" style="height: 20rem;">
					<table class="table table-hover table-striped text-center mb-0">
						<thead>
							<tr>
								<th>선택</th>
								<th>PB명</th>
								<th>품목수</th>
								<th>등록일</th>
								<th>비고</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
									<div class="custom-control custom-checkbox"><input id="magicBtn1" type="checkbox"
											class="custom-control-input"><label class="custom-control-label" for="magicBtn1"></label></div>
								</td>
								<td>올댓페이</td>
								<td>100개</td>
								<td>22.10.19</td>
								<td></td>
							</tr>
							<tr>
								<td>
									<div class="custom-control custom-checkbox"><input id="magicBtn2" type="checkbox"
											class="custom-control-input"><label class="custom-control-label" for="magicBtn2"></label></div>
								</td>
								<td>올댓페이</td>
								<td>100개</td>
								<td>22.10.19</td>
								<td></td>
							</tr>
							<tr>
								<td>
									<div class="custom-control custom-checkbox"><input id="magicBtn3" type="checkbox"
											class="custom-control-input"><label class="custom-control-label" for="magicBtn3"></label></div>
								</td>
								<td>올댓페이</td>
								<td>100개</td>
								<td>22.10.19</td>
								<td></td>
							</tr>
							<tr>
								<td>
									<div class="custom-control custom-checkbox"><input id="magicBtn4" type="checkbox"
											class="custom-control-input"><label class="custom-control-label" for="magicBtn4"></label></div>
								</td>
								<td>올댓페이</td>
								<td>100개</td>
								<td>22.10.19</td>
								<td></td>
							</tr>
							<tr>
								<td>
									<div class="custom-control custom-checkbox"><input id="magicBtn5" type="checkbox"
											class="custom-control-input"><label class="custom-control-label" for="magicBtn5"></label></div>
								</td>
								<td>올댓페이</td>
								<td>100개</td>
								<td>22.10.19</td>
								<td></td>
							</tr>
							<tr>
								<td>
									<div class="custom-control custom-checkbox"><input id="magicBtn6" type="checkbox"
											class="custom-control-input"><label class="custom-control-label" for="magicBtn6"></label></div>
								</td>
								<td>올댓페이</td>
								<td>100개</td>
								<td>22.10.19</td>
								<td></td>
							</tr>
							<tr>
								<td>
									<div class="custom-control custom-checkbox"><input id="magicBtn7" type="checkbox"
											class="custom-control-input"><label class="custom-control-label" for="magicBtn7"></label></div>
								</td>
								<td>올댓페이</td>
								<td>100개</td>
								<td>22.10.19</td>
								<td></td>
							</tr>
							<tr>
								<td>
									<div class="custom-control custom-checkbox"><input id="magicBtn8" type="checkbox"
											class="custom-control-input"><label class="custom-control-label" for="magicBtn8"></label></div>
								</td>
								<td>올댓페이</td>
								<td>100개</td>
								<td>22.10.19</td>
								<td></td>
							</tr>
							<tr>
								<td>
									<div class="custom-control custom-checkbox"><input id="magicBtn9" type="checkbox"
											class="custom-control-input"><label class="custom-control-label" for="magicBtn9"></label></div>
								</td>
								<td>올댓페이</td>
								<td>100개</td>
								<td>22.10.19</td>
								<td></td>
							</tr>
							<tr>
								<td>
									<div class="custom-control custom-checkbox"><input id="magicBtn10" type="checkbox"
											class="custom-control-input"><label class="custom-control-label" for="magicBtn10"></label></div>
								</td>
								<td>올댓페이</td>
								<td>100개</td>
								<td>22.10.19</td>
								<td></td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="text-center mt-3"><button type="button" class="btn btn-cancle pop-close1 mr-2">닫기</button><button
						type="button" class="btn btn-save">저장</button></div>
			</div>
		</div>
	</div>modal-wrap1 -->

	<jsp:include page="/shop/com/remote.jsp" />
	
	<script src="/shop/js/common.js"></script>
	<script src="/shop/js/calendar.js"></script>
</body>
</html>