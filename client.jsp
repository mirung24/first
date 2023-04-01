<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
	<title>거래처관리</title>
	<jsp:include page="/shop/com/nav.jsp" /><!-- navi-wrap -->
	<link rel="stylesheet" href="/shop/css/client.css">
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
				
					<input type="hidden" id="chaincode" value="${uservo.chaincd}">
					<input type="hidden" id="compcd" value="${uservo.compcd}">
					<div class="d-flex align-items-center">
						<select class="form-control mr-2" style="width: 6rem;" name="search1">
							<option value="all" selected>전체</option>
							<option value="accountname">거래처명</option>
							<option value="corporatenumber">사업자번호</option>
							<option value="president">대표자</option>
						</select>

						<input class="form-control form-control-sm pl-2 mr-2" type="text" placeholder="검색어를 입력하세요."
							style="width: 10rem;" name="searchInput" onkeyup="enterkey()">

						<select class="form-control mr-2" style="width: 4.5rem;" name="search2">
							<option value="regdt" selected>등록일</option>
							<!-- <option value="해지일">해지일</option> -->
						</select>

						<input type="text" id="searchDate1" name="searchDate1" class="d-30 calendar calendar-img mr-2">
						~ &nbsp;
						<input type="text" id="searchDate2" name="searchDate2" class="date2 calendar calendar-img mr-2">

						<button type="button" class="btn btn-search mr-2" id="searchBtn"><i
								class="fa-solid fa-magnifying-glass mr-1" ></i>검색</button>
						<button type="button" class="btn btn-plus pop-link2"><i class="fa-solid fa-plus mr-1"></i>등록</button>
					</div>

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
											<th>사업자번호</th>
											<th>거래처명</th>
											<th>대표자</th>
											<th>주소</th>
											<th>전화번호</th>
											<th>휴대폰</th>
											<th>이메일</th>
											<th>등록일</th>
											<th>거래처코드</th>
										</tr>
									</thead>
								</table>
							</div>
						</div><!-- table-responsive -->
						<div class="page-wrap"></div>
					</div><!-- box -->
				</div><!-- content -->
			</article>

			<jsp:include page="/shop/com/footer.jsp" />

		</div><!-- section -->
	</div><!-- wrapper -->
	
	<div class="modal-wrap1">
		<div class="pop2">
		<form name="detail_f" id="detail_f" method="post">
			<div class="pop-title">가맹점 상세정보</div>
			<div class="pop-cont">
				<input type="hidden" value="${uservo.userid}" id="regcd" name="regcd">
					<ul>
						<li class="pop-list"><span>사업자번호</span><input type="text" name="corporatenumber" class="form-control corporatenumber" readonly="true"></li>
						<li class="pop-list"><span>거래처명</span><input type="text" name="accountname" class="form-control accountname"></li>
						<li class="pop-list"><span>업태/업종</span>
						<input type="text" name="business" id="business" class="form-control mr-2 business"
								value=""><input type="text" name="sectors" id="sectors" class="form-control sectors" value=""></li>
						<li class="pop-list"><span>대표자</span><input type="text" name="president" class="form-control president"></li>
						<li class="pop-list"><span>공동대표수</span><input type="text" name="presidentcnt" class="form-control presidentcnt" numberOnly></li>
						<li class="pop-list"><span>주소</span>
							<input type="text" name="address" id="addr1" class="form-control mr-2 address"
									value=""><input type="text" name="address2" id="addr2" class="form-control address2" value=""></li>
						<li class="pop-list"><span>전화번호</span><input type="text" name="tel" class="form-control tel" autoTelHyphen maxlength="13"></li>
						<li class="pop-list"><span>휴대폰번호</span><input type="text" name="hp" class="form-control hp" autoTelHyphen maxlength="13"></li>
						<li class="pop-list"><span>팩스번호</span><input type="text" name="fax" class="form-control fax" autoTelHyphen maxlength="13"></li>
						<li class="pop-list"><span>이메일</span><input type="text" name="email" class="form-control email"></li>
						<li class="pop-list"><span>세금계산서 이메일</span><input type="text" name="taxuseremail" class="form-control taxuseremail"></li>
						<li class="pop-list"><span>담당자</span><input type="text" name="manager" class="form-control manager"></li>
						<li class="pop-list"><span>메모</span>
							<textarea name="remarks" id="remarks" cols="100" rows="4"></textarea></li>
						<li class="pop-list"><span>거래처코드</span><input type="text" name="accountcd" class="form-control accountcd"></li>
					</ul>
				<div class="text-center mt-3"><button type="button" class="btn btn-cancle pop-close1 mr-2">닫기</button><button
						type="button" form="detail_f" class="btn btn-save" id="popsv_btn">저장</button></div>
			</div>
		</form>
		</div>
	</div><!-- modal-wrap1 -->
	
	<div class="modal-wrap2">
		<div class="pop2">
			<div class="pop-title">거래처 등록</div>
			<div class="pop-cont">
				<ul>
					<li class="pop-list"><span>사업자번호</span><input type="text" class="form-control rcorporatenumber" maxlength="10" autoCorpHyphen></li>
					<li class="pop-list"><span>거래처명</span><input type="text" class="form-control raccountname"></li>
					<li class="pop-list"><span>업태/업종</span>
						<input type="text" name="rbusiness" id="rbusiness" class="form-control mr-2 rbusiness"
								value=""><input type="text" name="rsectors" id="rsectors" class="form-control rsectors" value=""></li>
					<li class="pop-list"><span>대표자</span><input type="text" class="form-control rpresident"></li>
					<li class="pop-list"><span>공동대표수</span><input type="text" class="form-control rpresidentcnt" numberOnly></li>
					<li class="pop-list"><span>주소</span>
						<input type="text" name="raddr1" id="raddr1" class="form-control mr-2 address"
								value=""><input type="text" name="raddr2" id="raddr2" class="form-control address2" value=""></li>
					<li class="pop-list"><span>전화번호</span><input type="text" class="form-control rtel" maxlength="13" autoTelHyphen></li>
					<li class="pop-list"><span>휴대폰번호</span><input type="text" class="form-control rhp" maxlength="13" autoTelHyphen></li>
					<li class="pop-list"><span>팩스번호</span><input type="text" class="form-control rfax" maxlength="13" autoTelHyphen></li>
					<li class="pop-list"><span>이메일</span><input type="text" class="form-control remail"></li>
					<li class="pop-list"><span>세금계산서 이메일</span><input type="text" class="form-control rtaxuseremail"></li>
					<li class="pop-list"><span>담당자</span><input type="text" class="form-control rmanager"></li>
					<li class="pop-list"><span>메모</span>
						<textarea name="regi_remarks" id="regi_remarks" cols="100" rows="4"></textarea></li>
				</ul>
				<div class="text-center mt-3"><button type="button" class="btn btn-cancle pop-close2 mr-2">닫기</button><button
						type="button" class="btn btn-save" id="regi_btn">저장</button></div>
			</div>
		</div>
	</div><!-- modal-wrap2 -->

	<jsp:include page="/shop/com/remote.jsp" />
	
	<script src="/shop/js/common.js"></script>
	<script src="/shop/js/client.js"></script>
</body>
</html>