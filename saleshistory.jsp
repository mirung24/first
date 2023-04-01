<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
	<title>매출내역</title>
	<jsp:include page="/shop/com/nav.jsp" /><!-- navi-wrap -->
	<link rel="stylesheet" href="/shop/css/saleshistory.css">
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
					
					<div class="tab">
						<button class="btn tablinks active">요일별</button>
						<button class="btn ml-1 tablinks" id="timest">시간대별</button>
					</div>
					<div class="box tab-wrap mt-0">
						<div class="tabcontent">
								<!-- <ul class="mb-3 d-flex justify-content-between align-items-center">
									<ul class="d-flex align-items-center">
									</ul>
									<li class="text-right" style="min-width: 351.34px;">
										<button type="button" class="btn btn-plus pop-link1">
										<i class="fa-solid fa-plus mr-1"></i>PB상품</button>
									</li>
								</ul> -->
								
								<div class="tab2 d-flex justify-content-between mb-1">
									<select class="form-control mr-2" style="width: 4.7rem;" name="year"></select>
									<div>
										<button class="btn tablinks2 active" name="quarter" id="quarter1" value="01,03">1분기</button>
				                        <button class="btn ml-3 tablinks2" name="quarter" id="quarter2" value="04,06">2분기</button>
				                        <button class="btn ml-3 tablinks2" name="quarter" id="quarter3" value="07,09">3분기</button>
				                        <button class="btn ml-3 tablinks2" name="quarter" id="quarter4" value="10,12">4분기</button>
			                        </div>
			                      
			                        <div style="width: 6rem;"></div>
			                     </div>
	
								<div class="graph">
									<div class="mb-2">* 매출금액&nbsp;(단위 : 10,000원)</div>
									<div id="container" class="gr1">
										<canvas id="graph1"></canvas>
									</div>
								</div>
								<div class="table-responsive mt-4">
									<table class="table table-hover table-striped text-right mb-0" style="min-width:2000px;">
										<thead>
											<tr>
												<th class="text-left">구분</th>
												<th class="text-center">일</th>
												<th class="text-center">월</th>
												<th class="text-center">화</th>
												<th class="text-center">수</th>
												<th class="text-center">목</th>
												<th class="text-center">금</th>
												<th class="text-center">토</th>
												<th class="text-center">주 누계</th>
											</tr>
										</thead>
										<tbody>
											<tr id="totamt">
												<td class="text-left">매출금액</td>
												<td>0원</td>
												<td>0원</td>
												<td>0원</td>
												<td>0원</td>
												<td>0원</td>
												<td>0원</td>
												<td>0원</td>
												<td>0원</td>
											</tr>
											<tr id="totcnt">
												<td class="text-left">매출건수</td>
												<td>0건</td>
												<td>0건</td>
												<td>0건</td>
												<td>0건</td>
												<td>0건</td>
												<td>0건</td>
												<td>0건</td>
												<td>0건</td>
											</tr>
											<tr id="cust">
												<td class="text-left">내방객</td>
												<td>0명 <p>남 0명 | 여 0명</td>
												<td>0명 <p>남 0명 | 여 0명</td>
												<td>0명 <p>남 0명 | 여 0명</td>
												<td>0명 <p>남 0명 | 여 0명</td>
												<td>0명 <p>남 0명 | 여 0명</td>
												<td>0명 <p>남 0명 | 여 0명</td>
												<td>0명 <p>남 0명 | 여 0명</td>
												<td>0명 <p>남 0명 | 여 0명</td>
											</tr>
											<tr id="top">
												<td class="text-left">매출 Top</td>
												<td>-</td>
												<td>-</td>
												<td>-</td>
												<td>-</td>
												<td>-</td>
												<td>-</td>
												<td>-</td>
												<td>-</td>
											</tr>
											<tr id="best">
												<td class="text-left">내방객 Top</td>
												<td>-</td>
												<td>-</td>
												<td>-</td>
												<td>-</td>
												<td>-</td>
												<td>-</td>
												<td>-</td>
												<td>-</td>
											</tr>
										</tbody>
									</table>
								</div>
						</div><!-- box -->
						<div class="tabcontent">
							<div class="tab2 d-flex justify-content-between mb-1">
								<select class="form-control mr-2" style="width: 4.7rem;" name="year2"></select>
								<div>
									<button class="btn tablinks2 active" name="quarter2" id="quarter5" value="01,03">1분기</button>
			                        <button class="btn ml-3 tablinks2" name="quarter2" id="quarter6" value="04,06">2분기</button>
			                        <button class="btn ml-3 tablinks2" name="quarter2" id="quarter7" value="07,09">3분기</button>
			                        <button class="btn ml-3 tablinks2" name="quarter2" id="quarter8" value="10,12">4분기</button>
		                        </div>
		                      
		                        <div style="width: 6rem;"></div>
		                     </div>
	
							<div class="graph">
								<div class="mb-2">* 매출금액&nbsp;(단위 : 10,000원)</div>
								<div id="container" class="gr2">
									<canvas id="graph3"></canvas>
								</div>
							</div>
							<div class="table-responsive mt-4">
								<table class="table table-hover table-striped text-right mb-0" style="min-width:3150px;">
									<thead>
										<tr>
											<th class="text-left">구분</th>
											<th class="text-center">00~08시</th>
											<th class="text-center">09시</th>
											<th class="text-center">10시</th>
											<th class="text-center">11시</th>
											<th class="text-center">12시</th>
											<th class="text-center">13시</th>
											<th class="text-center">14시</th>
											<th class="text-center">15시</th>
											<th class="text-center">16시</th>
											<th class="text-center">17시</th>
											<th class="text-center">18시</th>
											<th class="text-center">19시</th>
											<th class="text-center">20시</th>
											<th class="text-center">21~24시</th>
										</tr>
									</thead>
									<tbody>
										<tr id="totamt2">
											<td class="text-left">매출금액</td>
											<td class="08">0원</td>
											<td class="09">0원</td>
											<td class="10">0원</td>
											<td class="11">0원</td>
											<td class="12">0원</td>
											<td class="13">0원</td>
											<td class="14">0원</td>
											<td class="15">0원</td>
											<td class="16">0원</td>
											<td class="17">0원</td>
											<td class="18">0원</td>
											<td class="19">0원</td>
											<td class="20">0원</td>
											<td class="21">0원</td>
										</tr>
										<tr id="totcnt2">
											<td class="text-left">매출건수</td>
											<td class="08">0건</td>
											<td class="09">0건</td>
											<td class="10">0건</td>
											<td class="11">0건</td>
											<td class="12">0건</td>
											<td class="13">0건</td>
											<td class="14">0건</td>
											<td class="15">0건</td>
											<td class="16">0건</td>
											<td class="17">0건</td>
											<td class="18">0건</td>
											<td class="19">0건</td>
											<td class="20">0건</td>
											<td class="21">0건</td>
										</tr>
										<tr id="cust2">
											<td class="text-left">내방객</td>
											<td class="08">0명 <p>남 0명 | 여 0명</td>
											<td class="09">0명 <p>남 0명 | 여 0명</td>
											<td class="10">0명 <p>남 0명 | 여 0명</td>
											<td class="11">0명 <p>남 0명 | 여 0명</td>
											<td class="12">0명 <p>남 0명 | 여 0명</td>
											<td class="13">0명 <p>남 0명 | 여 0명</td>
											<td class="14">0명 <p>남 0명 | 여 0명</td>
											<td class="15">0명 <p>남 0명 | 여 0명</td>
											<td class="16">0명 <p>남 0명 | 여 0명</td>
											<td class="17">0명 <p>남 0명 | 여 0명</td>
											<td class="18">0명 <p>남 0명 | 여 0명</td>
											<td class="19">0명 <p>남 0명 | 여 0명</td>
											<td class="20">0명 <p>남 0명 | 여 0명</td>
											<td class="21">0명 <p>남 0명 | 여 0명</td>
										</tr>
										<tr id="top2">
											<td class="text-left">매출 Top</td>
											<td class="08">-</td>
											<td class="09">-</td>
											<td class="10">-</td>
											<td class="11">-</td>
											<td class="12">-</td>
											<td class="13">-</td>
											<td class="14">-</td>
											<td class="15">-</td>
											<td class="16">-</td>
											<td class="17">-</td>
											<td class="18">-</td>
											<td class="19">-</td>
											<td class="20">-</td>
											<td class="21">-</td>
										</tr>
										<tr id="best2">
											<td class="text-left">내방객 Top</td>
											<td class="08">-</td>
											<td class="09">-</td>
											<td class="10">-</td>
											<td class="11">-</td>
											<td class="12">-</td>
											<td class="13">-</td>
											<td class="14">-</td>
											<td class="15">-</td>
											<td class="16">-</td>
											<td class="17">-</td>
											<td class="18">-</td>
											<td class="19">-</td>
											<td class="20">-</td>
											<td class="21">-</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div><!-- box -->
					</div>
				</div><!-- content -->
			</article>

			<jsp:include page="/shop/com/footer.jsp" />

		</div><!-- section -->

	<jsp:include page="/shop/com/remote.jsp" />
	
	<script src="/shop/js/common.js"></script>
	<script src="/shop/js/saleshistory.js"></script>
</body>
</html>