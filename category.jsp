<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ko">
<head>
	<title>카테고리관리</title>
	<jsp:include page="/shop/com/nav.jsp" /><!-- navi-wrap -->
	<link rel="stylesheet" href="/shop/css/category.css">
</head>
<body>
	<div class="section d-flex justify-content-between flex-column">
		<article>
			<jsp:include page="/shop/com/header.jsp" /><!-- navi-title -->
			<div class="content">
				<div id="loading" style="display: none; ">
				    <div id="loading_bar">
				        <img src="/img/loading1.gif">
				    </div>
				</div>
				
				<input type="hidden" id="compcd" name="compcd" value="${uservo.compcd}">
				<input type="hidden" id="chaincode" name="chaincode" value="${uservo.chaincd}">
				<input type="hidden" value="${uservo.userid}" id="regcd" name="regcd">
				
								<div class="box mt-0">
					<ul class="d-flex justify-content-between align-items-center mb-3">
						<li class="selcate">선택된 카테고리 : <span class="selcate1"></span><span class="selcate2"></span></li>
						<li>
							<span class="notice mr-2"><i class="fa-solid fa-circle-info mr-1"></i>카테고리 순서를 변경 하시려면 카테고리명을 위아래로 드래그 해보세요.</span>
							<button type="button" class="btn btn-plus" id="odernumBtn"><i class="fa-solid fa-bars-staggered mr-2"></i>순서변경 저장</button>
						</li>
					</ul>
					<div class="table-wrapper d-flex">
						<div class="table-responsive">
							<table class="table table-hover table1">
								<thead>
									<tr>
										<th><ul class="d-flex justify-content-between align-items-center">
											<li>1차 카테고리</li><button type="button" class="btn btn-plus">카테고리 추가</button>
										</ul></th>
									</tr>
								</thead>
								<tbody class="cate1_list">
								</tbody>
							</table>
						</div>
						<div class="table-responsive mx-3">
							<table class="table table-hover table2">
								<thead>
									<tr>
										<th><ul class="d-flex justify-content-between align-items-center"><li>2차 카테고리</li><button type="button" class="btn btn-plus">카테고리 추가</button></ul></th>
									</tr>
								</thead>
								<tbody class="cate2_list">
								</tbody>
							</table>
						</div>
						<div class="table-responsive">
							<table class="table  table-hover table3">
								<thead>
									<tr>
										<th><ul class="d-flex justify-content-between align-items-center"><li>3차 카테고리</li><button type="button" class="btn btn-plus">카테고리 추가</button></ul></th>
									</tr>
								</thead>
								<tbody class="cate3_list">
								</tbody>
							</table>
						</div>
					</div>
				</div><!-- box -->
			</div><!-- content -->
		</article>
		<jsp:include page="/shop/com/footer.jsp" /><!-- footer -->
	</div>
	</div><!-- wrapper -->
	
	<div class="modal-wrap1">
		<div class="pop1">
			<div class="pop-title">카테고리 추가</div>
			<div class="pop-cont">
				<ul>
					<li class="pop-list"><span>1차 카테고리</span>
						<select class="form-control sel1 w-100">
							<option value="self" selected>직접입력</option>
						</select>
						<input type="text" class="form-control ml-2 selinput1">
					</li>
					<li class="pop-list"><span>2차 카테고리</span>
						<select class="form-control sel2 w-100">
							<option value="self" selected>직접입력</option>
						</select>
						<input type="text" class="form-control ml-2 selinput2">
					</li>
					<li class="pop-list"><span>카테고리명</span><input type="text" class="form-control name"></li>
				</ul>
				<div class="text-center mt-3"><button type="button" class="btn btn-cancle pop-close1 mr-2">닫기</button><button
						type="button" class="btn btn-save" id="addBtn">저장</button></div>
				<input type="hidden" value="" id="whichBtn">
				<input type="hidden" value="" id="catecode1">
				<input type="hidden" value="" id="catecode2">
			</div>
		</div>
	</div><!-- modal-wrap1 -->
	
	<div class="modal-wrap2">
		<div class="pop2">
			<div class="pop-title">카테고리 수정</div>
			<div class="pop-cont">
				<ul>
					<li class="pop-list"><span>1차 카테고리</span><select class="form-control w-100 sel3">
					</select></li>
					<li class="pop-list"><span>2차 카테고리</span><select class="form-control w-100 sel4">
					</select></li>
					<li class="pop-list"><span>카테고리명</span><input type="text" class="form-control name" value=""></li>

				</ul>
				<div class="text-center mt-3"><button type="button" class="btn btn-cancle pop-close2 mr-2">닫기</button><button
						type="button" class="btn btn-save" id="modiBtn">저장</button></div>				
				<input type="hidden" value="" id="whichModi">
				<input type="hidden" value="" id="selcode1">
				<input type="hidden" value="" id="selcode2">
				<input type="hidden" value="" id="selcode3">
			</div>
		</div>
	</div><!-- modal-wrap2 -->
	
	<div class="modal-wrap3" style="display: none;">
		<div class="pop3">
			<div class="pop-title">카테고리 템플릿</div>
			<p class="notice text-right"><i class="fa-solid fa-circle-info mr-1"></i>카테고리 템블릿은 선택 후 변경이 불가능합니다.</p>
			<div class="pop-cont mt-1">
				<ul class="category-wrap chaincateSel">
					<li class="category pointer"><input class="inp-cbx" id="use1" name="use" type="checkbox" checked/>
						<label class="cbx" for="use1"><span>
								<svg width="17px" height="15px">
									<use xlink:href="#check"></use>
								</svg></span><span class="mr-2">본점 카테고리</span></label><i class="fa-solid fa-angle-down"></i></li>
					<li class="category-cont">
					<ul>
						<li class="table-wrapper d-flex">
							<div class="table-responsive">
								<table class="table table-hover table1">
									<thead>
										<tr>
											<th><ul class="d-flex justify-content-between align-items-center"><li>1차 카테고리</li></ul></th>
										</tr>
									</thead>
									<tbody class="chain_cate1">
									</tbody>
								</table>
							</div>
							<div class="table-responsive mx-3">
								<table class="table table-hover table2">
									<thead>
										<tr>
											<th><ul class="d-flex justify-content-between align-items-center"><li>2차 카테고리</li></ul></th>
										</tr>
									</thead>
									<tbody class="chain_cate2">
									</tbody>
								</table>
							</div>
							<div class="table-responsive">
								<table class="table  table-hover table3">
									<thead>
										<tr>
											<th><ul class="d-flex justify-content-between align-items-center"><li>3차 카테고리</li></ul></th>
										</tr>
									</thead>
									<tbody class="chain_cate3">
									</tbody>
								</table>
							</div>
						</li>
					</ul>
				</li>
			</ul><!-- category-wrap -->
			<ul class="category-wrap">
				<li class="category pointer"><input class="inp-cbx" id="use2" name="use" type="checkbox">
					<label class="cbx" for="use2"><span>
							<svg width="17px" height="15px">
								<use xlink:href="#check"></use>
							</svg></span><span class="mr-2">올댓페이 카테고리</span></label><i class="fa-solid fa-angle-down"></i></li>
				<li class="category-cont">
				<ul>
					<li class="table-wrapper d-flex">
						<div class="table-responsive">
							<table class="table table-hover table1">
								<thead>
									<tr>
										<th><ul class="d-flex justify-content-between align-items-center"><li>1차 카테고리</li></ul></th>
									</tr>
								</thead>
								<tbody class="at_cate1">
								</tbody>
							</table>
						</div>
						<div class="table-responsive mx-3">
							<table class="table table-hover table2">
								<thead>
									<tr>
										<th><ul class="d-flex justify-content-between align-items-center"><li>2차 카테고리</li></ul></th>
									</tr>
								</thead>
								<tbody class="at_cate2">
								</tbody>
							</table>
						</div>
						<div class="table-responsive">
							<table class="table  table-hover table3">
								<thead>
									<tr>
										<th><ul class="d-flex justify-content-between align-items-center"><li>3차 카테고리</li></ul></th>
									</tr>
								</thead>
								<tbody class="at_cate3">
								</tbody>
							</table>
						</div>
					</li>
				</ul>
			</li>
		</ul><!-- category-wrap -->
		<ul class="category-wrap">
			<li class="category pointer"><input class="inp-cbx" id="use3" name="use" type="checkbox"/>
				<label class="cbx" for="use3"><span>
						<svg width="17px" height="15px">
							<use xlink:href="#check"></use>
						</svg></span><span class="mr-2">템플릿 사용안함</span></label></li>
						<li class="category-cont pb-0"></li>
		</ul><!-- category-wrap -->
				<div class="text-center mt-3"><button
						type="button" class="btn btn-save pop-close3" id="catetemp">선택 완료</button></div>
				</div>
				<!--SVG Sprites-->
				<svg class="inline-svg">
					<symbol id="check" viewbox="0 0 12 10">
						<polyline points="1.5 6 4.5 9 10.5 1"></polyline>
					</symbol>
				</svg>		
			</div>
	</div><!-- modal-wrap3 -->
	
	<jsp:include page="/shop/com/remote.jsp" /><!-- 원격지원 -->
	
	<script src="/shop/js/common.js"></script>
	<script src="/shop/js/category.js"></script>
</body>
</html>