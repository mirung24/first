<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
	<title>가맹점정보</title>
	<jsp:include page="/shop/com/nav.jsp" /><!-- navi-wrap -->
	<link rel="stylesheet" href="/shop/css/franchise.css">
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
				
					<form name="detail_f" id="detail_f" method="post">
					<input type="hidden" id="compcd" name="compcd" value="${uservo.compcd}">
					<input type="hidden" id="dcompcd" name="dcompcd" value="${uservo.compcd}">
					<input type="hidden" id="chaincode" name="chaincode" value="${uservo.chaincd}">
					<input type="hidden" id="regcd" name="regcd" value="${uservo.userid}">
					<div class="box d-flex mt-0">
						<ul>
							<li class="pop-list"><span>사업자번호</span><input type="text"class="form-control" readonly="true"
									name="pop_copnum" id="pop_copnum" value=""></li>
							<li class="pop-list"><span>가맹점명</span><input type="text" name="pop_name" id="pop_name" class="form-control" value=""></li>
							<li class="pop-list"><span>대표자</span><input type="text" name="pop_pres" id="pop_pres" class="form-control" value=""></li>
							<li class="pop-list"><span>공동 대표수</span><input type="text" name="pop_pcnt" id="pop_pcnt" class="form-control" numberOnly value=""></li>
							<li class="pop-list"><span>주소</span><input type="text" name="pop_addr" id="pop_addr" class="form-control mr-2 address"
								value=""><input type="text" name="pop_addr2" id="pop_addr2" class="form-control address2" value=""></li>
							<li class="pop-list"><span>전화번호</span><input type="text" name="pop_tel" id="pop_tel" class="form-control" maxlength="13" autoTelHyphen value=""></li>
							<li class="pop-list"><span>휴대폰번호</span><input type="text" name="pop_hp" id="pop_hp" class="form-control" maxlength="13" autoTelHyphen value=""></li>
							<li class="pop-list"><span>팩스번호</span><input type="text" name="pop_fax" id="pop_fax" class="form-control" maxlength="13" autoTelHyphen value=""></li>
							<li class="pop-list"><span>이메일</span><input type="text" name="pop_email" id="pop_email" class="form-control"
									value=""></li>
							<li class="pop-list"><span>개설일</span><input type="text" id="pop_date1" name="pop_date1"
									class="form-control date1 calendar calendar-img w-100"></li>
							<li class="pop-list"><span>가맹일</span><input type="text" id="pop_date2" name="pop_date2"
									class="form-control date1 calendar calendar-img w-100"></li>
							<li class="pop-list"><span>해지일</span><input type="text" id="pop_date3" name="pop_date3"
									class="form-control date1 calendar calendar-img w-100"></li>
							<li class="pop-list"><span>세금계산서 이메일</span><input type="text" name="pop_taxem" id="pop_taxem" class="form-control"
									value=""></li>
							<li class="pop-list"><span>메모</span>
								<textarea name="pop_memo" id="pop_memo" cols="76" rows="8"></textarea></li>

								<div class="text-center mt-3"><button type="button" class="btn btn-save" 
								form="detail_f" id="popsv_btn">저장</button></div>
						</ul>
		
						<ul class="ml-4 pl-4" style="border-left: 1px dashed #ddd;">
		
							<li class="pop-list"><span>사용자 추가</span><button type="button" class="btn btn-plus" id="ua_btn"><i
									class="fa-solid fa-plus mr-1"></i>추가</button></li>

							<div class="table-responsive t1 mb-3">
								<table class="table table-hover table-striped text-center mb-0">
									<thead>
										<tr>
											<th class="fixedHeader">사용자명</th>
											<th class="fixedHeader">아이디</th>
											<th class="fixedHeader">비밀번호</th>
											<th class="fixedHeader">휴대폰번호</th>
											<th class="fixedHeader">라이센스</th>
											<th class="fixedHeader">입사일</th>
											<th class="fixedHeader">퇴사일</th>
											<th class="fixedHeader">직급</th>
										</tr>
									</thead>
									<tbody class="ua_tbody">
									</tbody>
								</table>
							</div>
							
							<div class="line" style="border-top: 2px dashed #ddd;"></div>
		
							<div class="pop-total mt-3">
								<li class="pop-list"><span class="pre_year1"></span><input type="text" disabled class="form-control mr-3"
										value="" id="salestot"></li>
								<li class="pop-list"><span class="pre_year2"></span><input type="text" disabled class="form-control"
										value="" id="salescnt"></li>
								<li class="pop-list"><span>매출평균 (일)</span><input type="text" disabled class="form-control mr-3"
										value="" id="avgtot"></li>
								<li class="pop-list"><span>매출횟수 (평균)</span><input type="text" disabled class="form-control"
										value="" id="avgcnt"></li>
							</div>
		
							<li class="pop-list d-flex justify-content-start align-items-center mt-2"><span
								style="min-width: 7.5rem;">매출내역</span><input type="text" style="width: 7.5rem;" name="popSearch1"
								class="d-30 calendar calendar-img mr-2"> ~ &nbsp; <input type="text" style="width: 7.5rem;" id="pop_search_date2" name="popSearch2"
								class="date2 calendar calendar-img mr-2"><button type="button" class="btn btn-search" id="pophistbtn"><i
									class="fa-solid fa-magnifying-glass mr-1"></i>검색</button></li>
		
							<div class="tot table-responsive t2 mt-2">
								<table class="table table-hover table-striped text-center mb-0">
									<thead>
										<tr>
											<th class="fixedHeader">매출일자</th>
											<th class="fixedHeader">매출금액</th>
											<th class="fixedHeader" style="text-align: right;">증감률(D-1)</th>
											<th class="fixedHeader">매출횟수</th>
										</tr>
									</thead>
									<tbody class="sh_tbody">
									</tbody>
								</table>
							</div>
						</ul>
					</div>
					</form>
				</div><!-- content -->
			</article>

			<jsp:include page="/shop/com/footer.jsp" />

		</div><!-- section -->
	</div><!-- wrapper -->

	<jsp:include page="/shop/com/remote.jsp" />
	
	<script src="/shop/js/common.js"></script>
	<script src="/shop/js/franchise.js"></script>
</body>
</html>