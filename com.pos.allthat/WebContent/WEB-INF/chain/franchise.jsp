<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
	<title>가맹점관리</title>
	<jsp:include page="/chain/com/nav.jsp" /><!-- navi-wrap -->
	<link rel="stylesheet" href="/chain/css/franchise.css">
	<script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
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
					<input type="hidden" value="" id="compcd" name="compcd" >
					<div class="d-flex align-items-center">
						<select class="form-control mr-2" style="width: 6rem;" name="search1">
							<option value="all" selected>전체</option>
							<option value="companyname">가맹점명</option>
							<option value="corporatenumber">사업자번호</option>
							<option value="president">대표자</option>
						</select>

						<input class="form-control form-control-sm pl-2 mr-2" type="text" name="searchInput" 
						placeholder="검색어를 입력하세요." style="width: 10rem;" onkeyup="enterkey()">

						<select class="form-control mr-2" style="width: 4.5rem;" name="search2">
							<option value="registerdate" selected>가맹일</option>
							<option value="regdt">등록일</option>
						</select>

						<input type="text" class="d-30 calendar calendar-img mr-2" name="searchDate1">
						~ &nbsp;
						<input type="text" id="search_date2" class="date2 calendar calendar-img mr-2" name="searchDate2">

						<!-- <select class="form-control mr-2" style="width: 4.7rem;">
							<option value="D-30" selected>D-30</option>
							<option value="D-60">D-60</option>
							<option value="D-90">D-90</option>
							<option value="D-120">D-120</option>
						</select>

						<select class="form-control mr-2" style="width: 9.5rem;">
							<option value="UP Rank (10)" selected>UP Rank (10)</option>
							<option value="UP Rank (30)">UP Rank (30)</option>
							<option value="UP Rank (50)">UP Rank (50)</option>
							<option value="UP Rank (100)">UP Rank (100)</option>
							<option value="DOWN Rank (10)">DOWN Rank (10)</option>
							<option value="DOWN Rank (30)">DOWN Rank (30)</option>
							<option value="DOWN Rank (50)">DOWN Rank (50)</option>
							<option value="DOWN Rank (100)">DOWN Rank (100)</option>
							<option value="ZERO">ZERO</option>
						</select> -->

						<button type="button" class="btn btn-search mr-2" id="searchBtn"><i
								class="fa-solid fa-magnifying-glass mr-1"></i>검색</button>
						<button type="button" class="btn btn-plus pop-link2"><i
								class="fa-solid fa-plus mr-1"></i>등록</button>
					</div>

					<div class="box p-0 d-flex justify-content-between">
						<div class="square-wrap">
							<ul>
								<li class="d-flex justify-content-between align-items-center">
									<div class="icon-wrap"><i class="fa-solid fa-store"></i></div>
									<div class="square-total" id="totcnt"></div>
								</li>
								<li class="square-title">전체 가맹점 매출액</li>
								<li class="square-price" id="totamt1"><span class="square-target" data-speed="1" id="totcnt1"
										data-gap="166">(<span></span>건)</span></li>
							</ul>
							<div class="circle circle-top"></div>
							<div class="circle circle-bottom"></div>
						</div>
						<div class="square-wrap">
							<ul>
								<li class="d-flex justify-content-between align-items-center">
									<div class="icon-wrap"><i class="fa-solid fa-store"></i></div>
									<div class="square-total" id="chrcnt"></div>
								</li>
								<li class="square-title">전체 가맹점 매출액(D-30)</li>
								<li class="square-price" id="totamt2"><span class="square-target" data-speed="1" id="totcnt2"
										data-gap="9">(<span></span>건)</span></li>
							</ul>
							<div class="circle circle-top"></div>
							<div class="circle circle-bottom"></div>
						</div>
						<div class="square-wrap">
							<ul>
								<li class="d-flex justify-content-between align-items-center">
									<div class="icon-wrap"><i class="fa-solid fa-store"></i></div>
									<div class="square-total" id="newcnt"></div>
								</li>
								<li class="square-title">신규 가맹점 매출액 (D-30)</li>
								<li class="square-price" id="totamt3"><span class="square-target" data-speed="1" id="totcnt3"
										data-gap="9">(<span></span>건)</span></li>
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
											<th>가맹점</th>
											<th>사업자번호</th>
											<th>대표자</th>
											<th>주소</th>
											<th>전화번호</th>
											<th>휴대폰</th>
											<th>이메일</th>
											<th>가맹일</th>
											<th>매출금액(당일)</th>
											<th>매출금액(전일)</th>
											<th>매출금액(D-30)</th>											
											<th>순위(D-30)</th>
											<th>가맹점 번호</th>
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
			<div class="pop-title">가맹점 상세정보</div>
			<div class="pop-cont">
				<div class="d-flex">
				<input type="hidden" value="" id="dcompcd" name="dcompcd">
				<input type="hidden" value="${uservo.userid}" id="regcd" name="regcd">
					<ul style="height: 37.5rem; overflow-y: auto; padding-right: 0.5rem;">
						<li class="pop-list"><span>사업자번호</span><input type="text" name="pop_copnum" id="pop_copnum" readonly="true" class="form-control"
								value=""></li>
						<li class="pop-list"><span>가맹점명</span><input type="text" name="pop_name" id="pop_name" class="form-control" value=""></li>
						<li class="pop-list"><span>대표자</span><input type="text" name="pop_pres" id="pop_pres" class="form-control" value=""></li>
						<li class="pop-list"><span>공동 대표수</span><input type="text" name="pop_pcnt" id="pop_pcnt" class="form-control" numberOnly value=""></li>
						<li class="pop-list"><span>주소</span>
						<input type="text" name="pop_addr" id="pop_addr" class="form-control mr-2 address"
								value=""><input type="text" name="pop_addr2" id="pop_addr2" class="form-control address2" value=""></li>
						<li class="pop-list"><span>전화번호</span><input type="text" name="pop_tel" id="pop_tel" class="form-control" maxlength="13" autoTelHyphen value=""></li>
						<li class="pop-list"><span>휴대폰번호</span><input type="text" name="pop_hp" id="pop_hp" class="form-control" maxlength="13" autoTelHyphen value=""></li>
						<li class="pop-list"><span>팩스번호</span><input type="text" name="pop_fax" id="pop_fax" class="form-control" maxlength="13" autoTelHyphen value=""></li>
						<li class="pop-list"><span>이메일</span><input type="text" name="pop_email" id="pop_email" class="form-control" value=""></li>
						<li class="pop-list"><span>개설일</span><input type="text" id="pop_date1" name="pop_date1"
								class="form-control date1 calendar calendar-img"></li>
						<li class="pop-list"><span>가맹일</span><input type="text" id="pop_date2" name="pop_date2"
								class="form-control date1 calendar calendar-img"></li>
						<li class="pop-list"><span>해지일</span><input type="text" id="pop_date3" name="pop_date3"
								class="form-control date1 calendar calendar-img"></li>
						<li class="pop-list"><span>세금계산서 이메일</span><input type="text" name="pop_taxem" id="pop_taxem" class="form-control" value=""></li>
						<li class="pop-list"><span>업태</span><input type="text" name="pop_business" id="pop_business" class="form-control" value=""></li>
						<li class="pop-list"><span>업종</span><input type="text" name="pop_sectors" id="pop_sectors" class="form-control" value=""></li>
						<li class="pop-list"><span>담당자</span><input type="text" name="pop_manager" id="pop_manager" class="form-control" value=""></li>
						<li class="pop-list"><span>메모</span>
							<textarea name="pop_memo" id="pop_memo" cols="55" rows="4"></textarea></li>
					</ul>
				
					<ul class="ml-4 pl-4" style="border-left: 2px dashed #ddd;">

						<li class="pop-list"><span>사용자 추가</span><button type="button" class="btn btn-plus" id="ua_btn"><i
									class="fa-solid fa-plus mr-1"></i>추가</button></li>

						<div class="table-responsive t1 mb-3">
							<table class="table table-hover table-striped text-center mb-0">
								<thead>
									<tr>
										<th>사용자명</th>
										<th>아이디</th>
										<th>비밀번호</th>
										<th>휴대폰번호</th>
										<th>라이센스</th>
										<th>입사일</th>
										<th>퇴사일</th>
										<th>직급</th>
									</tr>
								</thead>
								<tbody class="ua_tbody">
								</tbody>
							</table>
						</div>
				
						<div class="line" style="border-top: 2px dashed #ddd;"></div>

						<div class="pop-total mt-3">
							<li class="pop-list"><span class="pre_year1"></span><input type="text" id="salestot" disabled class="form-control  mr-3"
									value=""></li>
							<li class="pop-list"><span class="pre_year2"></span><input type="text" id="salescnt" disabled class="form-control"
									value=""></li>
							<li class="pop-list"><span>매출평균 (일)</span><input type="text" id="avgtot" disabled class="form-control mr-3"
									value=""></li>
							<li class="pop-list"><span>매출횟수 (평균)</span><input type="text" id="avgcnt" disabled class="form-control"
									value=""></li>
						</div>

						<li class="pop-list d-flex justify-content-start align-items-center mt-2"><span
								style="min-width: 7.5rem;">매출내역</span><input type="text" style="width: 7.5rem;" name="popSearch1"
								class="d-30 calendar calendar-img mr-2"> ~ &nbsp; <input type="text" style="width: 7.5rem;" id="pop_search_date2" name="popSearch2"
								class="date2 calendar calendar-img mr-2"><button type="button" class="btn btn-search" id="pophistbtn"><i
									class="fa-solid fa-magnifying-glass mr-1"></i>검색</button></li>

						<div class="table-responsive t2 mt-2">
							<table class="table table-hover table-striped text-center mb-0">
								<thead>
									<tr>
										<th>매출일자</th>
										<th>매출금액</th>
										<th style="text-align: right;">증감률(D-1)</th>
										<th>매출횟수</th>
									</tr>
								</thead>
								<tbody class="sh_tbody">
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
			<div class="pop-title">가맹점 등록</div>
			<div class="pop-cont" style="height: 35rem; overflow-y: auto;">
				<ul>
					<input type="hidden" class="userid" value="${uservo.userid}" />
					<li class="pop-list"><span>사업자번호</span><input type="text" class="form-control companynumber" placeholder="숫자만 입력해주세요" maxlength="10" value=""></li>
					<li class="pop-list"><span>가맹점명</span><input type="text" class="form-control companyname" value=""></li>
					<li class="pop-list"><span>대표자</span><input type="text" class="form-control name" value=""></li>
					<li class="pop-list"><span>공동 대표수</span><input type="text" class="form-control pcnt" numberOnly value="" placeholder="숫자만 입력해주세요"></li>
					<li class="pop-list"><span>주소</span><input type="text" class="form-control address mr-2" placeholder="주소" value="">
														<input type="text" class="form-control address2" placeholder="상세주소" value=""></li>
					<li class="pop-list"><span>전화번호</span><input type="text" class="form-control number" maxlength="13" autoTelHyphen value=""></li>
					<li class="pop-list"><span>휴대폰번호</span><input type="text" class="form-control tell" maxlength="13" autoTelHyphen value=""></li>
					<li class="pop-list"><span>팩스번호</span><input type="text" class="form-control fax" maxlength="13" autoTelHyphen value=""></li>
					<li class="pop-list"><span>이메일</span><input type="text" class="form-control email" value=""></li>
					<li class="pop-list"><span>개설일</span><input type="text" id="date1"
							class="form-control register1 date3 calendar calendar-img mr-1"></li>
					<li class="pop-list"><span>가맹일</span><input type="text" id="date2"
							class="form-control register2 date1 calendar calendar-img mr-1"></li>
					<li class="pop-list"><span>해지일</span><input type="text" id="date3"
							class="form-control register3 date3 calendar calendar-img mr-1"></li>
					<li class="pop-list"><span>세금계산서 이메일</span><input type="text" class="form-control tax-email" value=""></li>
					<li class="pop-list"><span>업태</span><input type="text" class="form-control business" value=""></li>
					<li class="pop-list"><span>업종</span><input type="text" class="form-control sectors" value=""></li>
					<li class="pop-list"><span>담당자</span><input type="text" class="form-control manager" value=""></li>
					<li class="pop-list"><span>메모</span>
						<textarea name="remarks" id="remarks" cols="100" rows="4"></textarea></li>
				</ul>
				<div class="text-center mt-3"><button type="button" class="btn btn-cancle pop-close2 mr-2">닫기</button><button
						type="button" class="btn btn-save">저장</button></div>
			</div>
		</div>
	</div><!-- modal-wrap2 -->

	<jsp:include page="/chain/com/remote.jsp" /><!-- 원격지원 -->
	
	<script src="/chain/js/common.js"></script>
	<script src="/chain/js/franchise.js"></script>
</body>
</html>