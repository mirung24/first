<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
	<title>고객화면관리</title>
	<jsp:include page="/shop/com/nav.jsp" /><!-- navi-wrap -->
	<link rel="stylesheet" href="/shop/css/screen.css">
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
					
					<input type="hidden" id="compcd" name="compcd" value="${uservo.compcd}">
					<input type="hidden" id="regcd" name="regcd" value="${uservo.userid}">
					<input type="hidden" value="${uservo.userid}" id="regcd" name="regcd">
					<div class="d-flex align-items-center">
						<input class="form-control form-control-sm pl-2 mr-2" type="text" placeholder="검색어를 입력하세요."
							style="width: 10rem;" name="searchInput">
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
									<table id="table" class="table table-striped table-hover text-center" style="width: 100%;">
										<thead>
											<tr>
												<th>No.</th>
												<th>고객화면명</th>
												<th>시작일</th>
												<th>종료일</th>
												<th>우선순위</th>
												<th>템플릿</th>
												<th>미리보기</th>
												<th>스크린코드</th>
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
						<div class="box box-show">
						<li class="pop-list" style="flex: 100%;"><span><!--  --></span>
							<div><button type="button" class="btn btn-plus mr-2" id="modiBtn"><i class="fa-solid fa-file-arrow-up mr-1"
										style="font-size: 0.9rem;"></i>저장</button><button type="button" class="btn btn-plus trash"><i
										class="fa-regular fa-trash-can mr-1" style="font-size: 0.9rem;"></i>삭제</button></div>
						</li>
						<li class="pop-list">
							<span>고객화면명</span>
							<input type="text" class="form-control text-left" id="detName">
						</li>
						<li class="pop-list d-flex justify-content-start align-items-center mt-2">
							<span>시작일 ~ 종료일</span>
							<input type="text" style="width: 7.5rem;" id="detStr" class="date1 calendar calendar-img mr-2"> ~ &nbsp;
							<input type="text" style="width: 7.5rem;" id="detEnd" class="date2 calendar calendar-img mr-2">
						</li>
						<li class="pop-list d-flex justify-content-start mt-3">
							<span>우선순위</span>
							<div>
								<input class="inp-cbx" id="price1" name="detPri" type="checkbox" value="Y" checked>
								<label class="cbx" for="price1"><span>
										<svg width="17px" height="15px">
											<use xlink:href="#check"></use>
										</svg></span><span class="mr-2">적용</span></label>
								<input class="inp-cbx" id="price2" name="detPri" type="checkbox" value="N" />
								<label class="cbx" for="price2"><span>
										<svg width="17px" height="15px">
											<use xlink:href="#check"></use>
										</svg></span><span>미적용</span></label>
							</div>
						</li>
						<li class="pop-list"><p class="notice">*이미지는 5개 까지만 등록가능합니다. 순서를 변경 하시려면 이미지를 드래그 해보세요.</p>
							<div>
								<label class="img-plus"><i class="fa-solid fa-plus mr-1"></i><input type="file"
									class="file-input file-input2" accept="image/*"></label><button type="button" class="pop-link3 btn btn-plus ml-2">템플릿 등록</button>
							</div>
								
						</li>
						<div class="table-responsive" style="height: 28.4rem;">
							<table class="table table-hover table-striped text-center mb-0">
								<thead>
									<tr>
										<th>순서</th>
										<th>이미지</th>
										<th>파일명</th>
										<th>디스플레이시간(초)</th>
										<th>링크</th>
										<th>삭제</th>
									</tr>
								</thead>
								<tbody class="detImg">
								</tbody>
							</table>
						</div>
							<!--SVG Sprites-->
							<svg class="inline-svg">
								<symbol id="check" viewbox="0 0 12 10">
									<polyline points="1.5 6 4.5 9 10.5 1"></polyline>
								</symbol>
							</svg>
						</div>

					</div>
				</div><!-- content -->
			</article>
<jsp:include page="/shop/com/footer.jsp" /><!-- footer -->
		</div><!-- section -->
		
		
	<div class="modal-wrap1">
		<div class="pop1">
			<div class="pop-title"></div>
			<div class="pop-cont">
				<div class="swiper-container">
					<div class="templete">
					</div>
					<div class="swiper-wrapper" id="swiImg">
					</div>
					<div class="swiper-pagination"></div>
					<!-- <div class="swiper-button-prev"></div>
					<div class="swiper-button-next"></div> -->
				</div>
				<div class="text-center mt-3"><button type="button" class="btn btn-cancle pop-close1">닫기</button></div>
			</div>
		</div>
	</div>
	
		<div class="modal-wrap2">
			<div class="pop2">
				<div class="pop-title">고객화면 등록</div>
				<div class="pop-cont">
					<ul>
						<li class="pop-list">
							<span>고객화면명</span>
							<input type="text" class="form-control text-left" value="기본" id="regiName">
						</li>
						<li class="pop-list d-flex justify-content-start align-items-center mt-2">
							<span>시작일 ~ 종료일</span>
							<input type="text" style="width: 7.5rem;" name="regiStrdt" class="d-30 calendar calendar-img mr-2"> ~ &nbsp; 
							<input type="text" style="width: 7.5rem;" id="regiEnddt" class="date2 calendar calendar-img mr-2">
						</li>
						<li class="pop-list d-flex justify-content-start mt-3">
							<span>우선순위</span>
							<div>
								<input class="inp-cbx" id="price3" name="price" type="checkbox" value="Y" checked>
								<label class="cbx" for="price3"><span>
										<svg width="17px" height="15px">
											<use xlink:href="#check"></use>
										</svg></span><span class="mr-2">적용</span></label>
								<input class="inp-cbx" id="price4" name="price" type="checkbox" value="N" />
								<label class="cbx" for="price4"><span>
										<svg width="17px" height="15px">
											<use xlink:href="#check"></use>
										</svg></span><span>미적용</span></label>
							</div>
						</li>
						<div>
								<li class="pop-list"><p class="notice">*이미지는 5개 까지만 등록가능합니다. 순서를 변경 하시려면 이미지를 드래그 해보세요.</p>
									<div>
										<label class="img-plus">
											<i class="fa-solid fa-plus mr-1"></i>
											<input type="file" class="file-input file-input1" accept="image/*">
										</label>
										<button type="button" class="pop-link3 btn btn-plus ml-2">템플릿 등록</button>
									</div>
										
								</li>
						</div>
						
								<div class="table-responsive mt-2" style="height: 28.3rem;">
									<table class="table table-hover table-striped text-center mb-0">
										<thead>
											<tr>
												<th>순서</th>
												<th>이미지</th>
												<th>파일명</th>
												<th>디스플레이시간(초)</th>
												<th>링크</th>
												<th>삭제</th>
											</tr>
										</thead>
										<tbody class="regImg">
										</tbody>
									</table>
								</div>
					</ul>
					<div class="text-center mt-3">
						<button type="button" class="btn btn-cancle pop-close2 mr-2">닫기</button>
						<button type="button" class="btn btn-save" id="regiSv">저장</button>
					</div>
				</div>
			</div>
		</div><!-- modal-wrap2 -->
	
	
		<div class="modal-wrap3">
			<div class="pop3">
				<div class="pop-title">템플릿 등록</div>
				<div class="pop-cont">
					<div class="d-flex flex-wrap">
						<div class="swiper-wrapper">
							<div class="templete3" >
								<img src="/img/temp1.png" alt="" class="img" style="border: 1px solid #ddd;">
								<p class="text-center mt-1"><input class="inp-cbx" id="basic" name="tem" type="checkbox" value="-" checked>
									<label class="cbx" for="basic"><span>
											<svg width="17px" height="15px">
												<use xlink:href="#check"></use>
											</svg></span><span class="mr-2">사용안함</span></label></p>
							</div>
						</div>
						<div class="swiper-wrapper">
							<div class="templete1">
								<img src="/img/snow2.png" alt="눈"class="snow1 snow">
								<img src="/img/snow2.png" alt="눈"class="snow2 snow">
								<img src="/img/snow2.png" alt="눈"class="snow3 snow">
								<img src="/img/snow2.png" alt="눈"class="snow4 snow">
								<img src="/img/snow2.png" alt="눈"class="snow5 snow">
								<img src="/img/snow2.png" alt="눈"class="snow6 snow">
								<img src="/img/snow2.png" alt="눈"class="snow7 snow">
								<img src="/img/snow2.png" alt="눈"class="snow8 snow">
								<img src="/img/snow2.png" alt="눈"class="snow9 snow">
								<img src="/img/snow2.png" alt="눈"class="snow10 snow">
								<img src="/img/snow2.png" alt="눈"class="snow11 snow">
								<img src="/img/snow2.png" alt="눈"class="snow12 snow">
								<img src="/img/snow2.png" alt="눈"class="snow13 snow">
								<img src="/img/snow2.png" alt="눈"class="snow14 snow">
								<img src="/img/snow2.png" alt="눈"class="snow15 snow">
								<img src="/img/snow2.png" alt="눈"class="snow16 snow">
								<img src="/img/snow2.png" alt="눈"class="snow17 snow">
								<img src="/img/snow2.png" alt="눈"class="snow18 snow">
								<img src="/img/snow2.png" alt="눈"class="snow19 snow">
								<img src="/img/snow2.png" alt="눈"class="snow20 snow">
							</div>
							<img src="/img/back2.jpg" alt="눈송이" class="img">
							<p class="text-center mt-1"><input class="inp-cbx" id="snow" name="tem" type="checkbox" value="snow"/>
								<label class="cbx" for="snow"><span>
										<svg width="17px" height="15px">
											<use xlink:href="#check"></use>
										</svg></span><span class="mr-2">눈송이</span></label></p>
							</div>
							<div class="swiper-wrapper">
								<div class="templete3">
									<img src="/img/winter1.png" alt="" class="img">
									<p class="text-center mt-1"><input class="inp-cbx" id="winter1" name="tem" type="checkbox" value="winter1"/>
										<label class="cbx" for="winter1"><span>
												<svg width="17px" height="15px">
													<use xlink:href="#check"></use>
												</svg></span><span class="mr-2">겨울1</span></label></p>
								</div>
							</div>
							<div class="swiper-wrapper">
								<div class="templete3">
									<img src="/img/winter2.png" alt="" class="img">
									<p class="text-center mt-1"><input class="inp-cbx" id="winter2" name="tem" type="checkbox" value="winter2"/>
										<label class="cbx" for="winter2"><span>
												<svg width="17px" height="15px">
													<use xlink:href="#check"></use>
												</svg></span><span class="mr-2">겨울2</span></label></p>
								</div>
							</div>
							<div class="swiper-wrapper">
								<div class="templete3">
									<img src="/img/spring.png" alt="" class="img">
									<p class="text-center mt-1"><input class="inp-cbx" id="spring" name="tem" type="checkbox" value="spring"/>
										<label class="cbx" for="spring"><span>
												<svg width="17px" height="15px">
													<use xlink:href="#check"></use>
												</svg></span><span class="mr-2">봄</span></label></p>
								</div>
							</div>
							
					</div>
					<div class="text-center mt-3"><button type="button" class="btn btn-cancle pop-close3 mr-2">닫기</button><button
						type="button" class="btn btn-save pop-close3">저장</button></div>
			</div>
		</div>
	<jsp:include page="/shop/com/remote.jsp" />
	
	<script src="/shop/js/common.js"></script>
	<script src="/shop/js/screen.js"></script>
</body>
</html>