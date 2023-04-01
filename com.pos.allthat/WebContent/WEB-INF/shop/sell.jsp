<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
	<title>거래내역</title>
	<jsp:include page="/shop/com/nav.jsp" /><!-- navi-wrap -->
	<link rel="stylesheet" href="/shop/css/sell.css">
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
					<input type="hidden" id="regcd" value="${uservo.userid}">
					<input type="hidden" id="corpnum" value="${uservo.corporatenumber}">
					<div class="d-flex align-items-center">
						<!-- <select class="form-control mr-2" style="width: 12rem;">
							<option value="가맹점 전체" selected>가맹점 전체</option>
							<option value="가맹점 선택1">가맹점 선택1</option>
							<option value="가맹점 선택2">가맹점 선택2</option>
							<option value="가맹점 선택3">가맹점 선택3</option>
						</select> -->

						<select class="form-control mr-2" style="width: 6rem;" name="search1">
							<option value="all" selected>전체</option>
							<option value="barcode">바코드</option>
							<option value="productname">상품명</option>
							<option value="auth_no">승인번호</option>
							<option value="name">이름</option>
							<option value="hp">휴대폰번호</option>
							
						</select>

						<input class="form-control form-control-sm pl-2 mr-2" type="text" placeholder="검색어를 입력하세요."
							name="searchInput" style="width: 10rem;" onkeyup="enterkey()">

						<select class="form-control mr-2" style="width: 5.5rem;" name="search2">
							<option value="all">전체일자</option>
							<option value="salesdate" selected>판매일</option>
							<!-- <option value="등록일">등록일</option> -->
						</select>

						<input type="text" id="date1" class="date1 calendar calendar-img mr-2" name="searchDate1">
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
		                           <div class="icon-wrap"><span>당월 </span></div>
		                           <ul class="d-flex align-items-center">
		                              <li class="square-total">전체건수<p class="square-title" id="totalcnt1">0건</p></li>
		                              <div class="square-line"></div>
		                              <li class="square-total">조제건수<p class="square-title" id="etccnt1">0건</p></li>
		                              <div class="square-line"></div>
		                              <li class="square-total">일반건수<p class="square-title" id="otccnt1">0건</p></li>
		                           </ul>
		                           </li>
		                              <ul class="d-flex align-items-center mt-2">
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
		                              <ul class="d-flex align-items-center mt-2">
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
		                              <ul class="d-flex align-items-center mt-2">
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
					</div><!-- box -->

					<div class="box pt-0">
						<div class="total-wrapper pt-2">
		                     <div class="total-wrap mt-2 rounded d-flex">
		                        <ul class="total-list d-flex justify-content-between">
		                           <li><i class="fa fa-caret-right"></i> 금액 합계 :</li>
		                           <li><span class="number ttotal2">0 </span><span>원</span></li>
		                        </ul>
		                        <ul class="total-list d-flex justify-content-between">
		                           <li><i class="fa fa-caret-right"></i> 조제 합계 :</li>
		                           <li><span class="number tetcamt2">0 </span><span>원</span></li>
		                        </ul>
		                        <ul class="total-list d-flex justify-content-between">
		                           <li><i class="fa fa-caret-right"></i> 일반 합계 :</li>
		                           <li><span class="number tamt2">0 </span><span>원</span></li>
		                        </ul>
		                        <ul class="total-list d-flex justify-content-between">
		                           <li><i class="fa fa-caret-right"></i> 부가세 합계 :</li>
		                           <li><span class="number tvat2">0 </span><span>원</span></li>
		                        </ul>
		                        <ul class="total-list d-flex justify-content-between">
		                           <li><i class="fa fa-caret-right"></i> 할인 합계 :</li>
		                           <li><span class="number tdiscount2">0 </span><span>원</span></li>
		                        </ul>
		                        <ul class="total-list d-flex justify-content-between">
		                           <li></li>
		                           <li></li>
		                        </ul>
		                    </div>
		               </div>
						<div class="table-responsive" style="border: none; padding-top: 1rem;">
							<div class="length-wrap d-flex justify-content-between align-items-center">
								<div class="mb-2 d-flex align-items-center"><span class="bf-wrap"></span></div>
							</div><!-- length-wrap -->
							<div class="table-wrap table-media" style="border: 1px solid #eee; border-radius: 5px;">
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
								 			<th class="productname2">
                                    			<div class="productname-hover2">
	                                       			<span class="productname-line2" id="ttotal"><i class="fa-solid fa-circle-plus mr-2"></i>
	                                       			금액 합계 &nbsp;:&nbsp; 0원</span>
	                                       			<span class="tri2"></span>
                                    			</div>
                                    			금액<i class="fa-solid fa-circle-plus ml-1" style="color: #354781;"></i>
                                    		</th>
											<th class="productname2">
                                    			<div class="productname-hover2">
	                                       			<span class="productname-line2" id="tetcamt"><i class="fa-solid fa-circle-plus mr-2"></i>
	                                       			조제 합계 &nbsp;:&nbsp; 0원</span>
	                                       			<span class="tri2"></span>
                                    			</div>
                                    			조제<i class="fa-solid fa-circle-plus ml-1" style="color: #354781;"></i>
                                    		</th>
											<th class="productname2">
                                    			<div class="productname-hover2">
                                       				<span class="productname-line2" id="tamt"><i class="fa-solid fa-circle-plus mr-2"></i>
                                       				일반 합계 &nbsp;:&nbsp; 0원</span>
                                       				<span class="tri2"></span>
                                    			</div>
                                    			일반<i class="fa-solid fa-circle-plus ml-1" style="color: #354781;"></i>
                                    		</th>
                                    		<th class="productname2">
                                       			<div class="productname-hover2">
                                          			<span class="productname-line2" id="tvat"><i class="fa-solid fa-circle-plus mr-2"></i>
                                          			부가세 합계 &nbsp;:&nbsp; 0원</span>
                                          			<span class="tri2"></span>
                                       			</div>
                                      			부가세<i class="fa-solid fa-circle-plus ml-1" style="color: #354781;"></i>
                                      		</th>
                                       		<th class="productname2">
                                          		<div class="productname-hover2">
                                             		<span class="productname-line2" id="tdiscount"><i class="fa-solid fa-circle-plus mr-2"></i>
                                             		할인 합계 &nbsp;:&nbsp; 0원</span>
                                             		<span class="tri2"></span>
                                          		</div>
                                          		할인<i class="fa-solid fa-circle-plus ml-1" style="color: #354781;"></i>
                                          	</th>
											<th>상품</th>
											<th>고객명</th>
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

			<jsp:include page="/shop/com/footer.jsp" />

		</div><!-- section -->
	</div><!-- wrapper -->

	<jsp:include page="/shop/com/remote.jsp" />
	
	<script src="/shop/js/common.js"></script>
	<script src="/shop/js/sell.js"></script>
</body>
</html>