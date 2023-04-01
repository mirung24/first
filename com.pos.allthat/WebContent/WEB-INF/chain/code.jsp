<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ko">
<head>
	<title>코드관리</title>
	<jsp:include page="/chain/com/nav.jsp" /><!-- navi-wrap -->
	<link rel="stylesheet" href="/chain/css/code.css">
</head>
<body>
		<div class="section d-flex justify-content-between flex-column">
			<article>
				<jsp:include page="/chain/com/header.jsp" /><!-- navi-title -->

				<div class="content">
					<input type="hidden" value="${uservo.userid}" id="regcd">
					<div class="d-flex align-items-center">
						<input class="form-control form-control-sm pl-2 mr-2" type="text" placeholder="검색어를 입력하세요."
							style="width: 10rem;" name="searchInput" onkeyup="enterkey()">
						<button type="button" class="btn btn-search mr-2" id="searchBtn"><i
								class="fa-solid fa-magnifying-glass mr-1"></i>검색</button>
						<button type="button" class="btn btn-plus pop-link2"><i class="fa-solid fa-plus mr-1"></i>등록</button>
					</div>

					<div class="box-wrap d-flex">
						<div class="box mr-3">
							<div class="length-wrap d-flex justify-content-between align-items-center">
								<div class="mb-2 d-flex align-items-center"><span class="bf-wrap"></span></div>
							</div><!-- length-wrap -->
							<div class="table-responsive">
								<div class="table-wrap">
									<table id="table" name="master-table" class="table table-striped table-hover text-center" style="width: 100%;">
										<thead>
											<tr>
												<th>No.</th>
												<th>코드번호</th>
												<th>코드명</th>
												<th>비고</th>
												<th>사용유무</th>
											</tr>
										</thead>
									</table>
								</div>
							</div><!-- table-responsive -->
							<div class="page-wrap"></div>
						</div><!-- box -->

						<div class="box-show">
							<div class="box">
								<ul>
									<li class="pop-list"><span><i class="fa-solid fa-pen mr-2"></i>코드 수정</span>
										<div><button type="button" class="btn btn-plus" id="box_save"><i class="fa-solid fa-file-arrow-up mr-1"
													style="font-size: 0.9rem;"></i>저장</button></div>
									</li>

									<li class="pop-list"><span>코드번호</span><input name="box_code" type="text" disabled class="form-control" value="코드번호">
									</li>
									<li class="pop-list"><span>코드명</span><input name="box_codename" type="text" class="form-control" value="코드명"></li>
									<li class="pop-list"><span>비고</span><input name="box_remarks" type="text" class="form-control" value="비고"></li>
									<li class="pop-list d-flex justify-content-start mt-3"><span>사용유무</span>
										<div>
											<input class="inp-cbx" id="use1" name="use" value="Y" type="checkbox" />
											<label class="cbx" for="use1"><span>
													<svg width="17px" height="15px">
														<use xlink:href="#check"></use>
													</svg></span><span class="mr-2">사용</span></label>
											<input class="inp-cbx" id="use2" name="use" value="N" type="checkbox" />
											<label class="cbx" for="use2"><span>
													<svg width="17px" height="15px">
														<use xlink:href="#check"></use>
													</svg></span><span>사용안함</span></label>
										</div>
									</li>
								</ul>
								<!--SVG Sprites-->
								<svg class="inline-svg">
									<symbol id="check" viewbox="0 0 12 10">
										<polyline points="1.5 6 4.5 9 10.5 1"></polyline>
									</symbol>
								</svg>
							</div>
							<div class="box">
								<li class="pop-list"><span>하위 코드 관리</span>
									<div>
										<button id="low_ins" type="button" class="btn btn-plus mr-2">
											<i class="fa-solid fa-plus mr-1"></i>추가</button>
										<button id="low_sv" type="button" class="btn btn-plus mr-2">
											<i class="fa-solid fa-file-arrow-up mr-1" style="font-size: 0.9rem;"></i>저장</button>
										<button id="low_del" type="button" class="btn btn-plus">
											<i class="fa-regular fa-trash-can mr-1" style="font-size: 0.9rem;"></i>삭제</button>
									</div>
								</li>

								<div class="table-responsive" style="height: 23rem;">
									<table class="table table-hover table-striped text-center mb-0">
										<thead>
											<tr>
												<th>
													<div class="custom-control custom-checkbox"><input id="magicBtn" type="checkbox"
															class="custom-control-input"><label class="custom-control-label" for="magicBtn"></label>
													</div>
												</th>
												<th>코드번호</th>
												<th>코드명</th>
												<th>비고</th>
												<th style="min-width: 4.5rem;">사용유무</th>
											</tr>
										</thead>
										<tbody class="low_tbody">
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div><!-- content -->
			</article>

			<jsp:include page="/chain/com/footer.jsp" /><!-- footer -->

		</div><!-- section -->
	</div><!-- wrapper -->
	
	<div class="modal-wrap2">
		<div class="pop2">
			<div class="pop-title">코드 등록</div>
			<div class="pop-cont">
				<ul>
					<li class="pop-list"><span>코드번호</span><input type="text" id="code" class="form-control" disabled></li>
					<li class="pop-list"><span>코드명</span><input type="text" id="codename" class="form-control code-name"></li>
					<li class="pop-list"><span>비고</span><input type="text" id="remarks" class="form-control"></li>
					<li class="pop-list d-flex justify-content-start mt-3"><span>사용유무</span>
						<div>
							<input class="inp-cbx" id="use3" name="popuse" type="checkbox" checked value="Y"/>
							<label class="cbx" for="use3"><span>
									<svg width="17px" height="15px">
										<use xlink:href="#check"></use>
									</svg></span><span class="mr-2">사용</span></label>
							<input class="inp-cbx" id="use4" name="popuse" type="checkbox" value="N"/>
							<label class="cbx" for="use4"><span>
									<svg width="17px" height="15px">
										<use xlink:href="#check"></use>
									</svg></span><span>사용안함</span></label>
						</div>
					</li>
				</ul>
				<div class="text-center mt-3"><button type="button" class="btn btn-cancle pop-close2 mr-2">닫기</button><button
						type="button" class="btn btn-save">저장</button></div>
			</div>
		</div>
	</div><!-- modal-wrap2 -->

	<jsp:include page="/chain/com/remote.jsp" /><!-- 원격지원 -->
	
	<script src="/chain/js/common.js"></script>
	<script src="/chain/js/code.js"></script>
</body>
</html>