<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
	request.setCharacterEncoding("utf-8");
	String noticecode = request.getParameter("noticecode");
%>
<!DOCTYPE html>
<html lang="ko">
<head>
	<title>공지사항</title>
	<jsp:include page="/chain/com/nav.jsp" /><!-- navi-wrap -->
	<link rel="stylesheet" href="/chain/css/write.css">
</head>
<body>
		<div class="section d-flex justify-content-between flex-column">
			<article>
				<jsp:include page="/chain/com/header.jsp" /><!-- navi-title -->

				<div class="content">
					<input type="hidden" value="${uservo.chaincd}" id="chaincode">
					<input type="hidden" value="${uservo.userid}" id="regcd" name="regcd">
					<input type="hidden" value="<%= noticecode %>" id="noticecode" name="noticecode">
					<input type="hidden" value="" id="ori_count" name="ori_count">

					<div class="banner"><img src="/img/notice.jpg" alt="배너" class="img">
						<h2>공지사항</h2>
						<p>올댓포스 서비스의 편리한 이용을 위한 안내 및 소식을 빠르게 전해드립니다.</p>
					</div>

					<div class="box mt-3 files">

						<div class="d-flex align-items-center mb-3">
							<select class="form-control mr-2" style="width: 4.8rem;" name="category">
								<option value="all" selected>구분</option>
								<option value="일반">일반</option>
								<option value="긴급">긴급</option>
							</select>
							
							<input class="form-control mr-2" type="text" placeholder="제목을 입력하세요." id="title">
							
							<li class="notice-store d-flex align-items-center"><span class="name mr-2">공지 대상 </span>
								<div class="store-list d-flex">
									<input class="inp-cbx" id="chk1" name="chk" type="checkbox">
									<label class="cbx d-flex align-items-center" for="chk1"><span>
											<svg width="14px" height="12px">
												<use xlink:href="#check"></use>
											</svg></span><span style="min-width: 2rem;">전체</span></label>
											
									<input class="inp-cbx" id="chk2" name="chk" type="checkbox" />
									<label class="cbx d-flex align-items-center ml-2" for="chk2"><span>
											<svg width="14px" height="12px">
												<use xlink:href="#check"></use>
											</svg></span><span style="min-width: 2rem;">선택</span></label>
								</div>
							</li>
							<!--SVG Sprites-->
							<svg class="inline-svg">
								<symbol id="check" viewbox="0 0 12 10">
									<polyline points="1.5 6 4.5 9 10.5 1"></polyline>
								</symbol>
							</svg>
						</div>
						
						<textarea class="form-control my-2" id="content" rows="23"
							placeholder="내용을 입력하세요."></textarea>
							
						<div class="mt-3 att-file">
							
						</div>
						
						<div class="d-flex mb-2 justify-content-between align-items-center mt-2 filediv">
		                	<div class="inputfile">
		                    	<label class="img-plus"><i class="fa-solid fa-plus"></i>
		                    		<input type="file" class="file-input file-input1" name="file">
		                    	</label>
		                        <input type="text" class="form-control filename1">
		                        <button type="button" class="btn btn-plus ml-2" style="min-width: 2rem;" id="plusBtn">+</button>
		                        <button type="button" class="btn btn-plus ml-2" style="min-width: 2rem;" id="minusBtn">-</button>
		                    </div>
		
		                    <div><a href="/notice.do?title=전체게시판&name=공지사항"><button type="button" class="btn btn-cancle mr-2">목록</button></a>
		                        <a><button type="button" class="btn btn-save" id="saveBtn">저장</button></a>
		                   	</div>
	                  	</div>
					</div><!-- files -->
				</div><!-- content -->
			</article>

			<jsp:include page="/chain/com/footer.jsp" /><!-- footer -->

		</div><!-- section -->
		
		<div class="modal-wrap1">
			<div class="pop1">
				<div class="pop-title">가맹점 선택</div>
					<div class="pop-cont">
						<div class="table-responsive t2 mt-2">
							<table id="table" class="table table-hover text-center mb-0">
								<thead>
									<tr>
										<th>사업자번호</th>
										<th>가맹점명</th>
										<th>주소</th>
										<th style="display:none;">가맹점코드</th>
									</tr>
								</thead>
								<tbody class="comp_tbody">
								</tbody>
							</table>
						</div>
						<div class="text-center mt-3"><button type="button" class="btn btn-cancle pop-close1 mr-2">닫기</button><button
							type="button" class="btn btn-save" id="selBtn">선택</button></div>
				</div>
			</div>
		</div><!-- modal-wrap1 -->
	
	<jsp:include page="/chain/com/remote.jsp" /><!-- 원격지원 -->
	
	<script src="/chain/js/common.js"></script>
	<script src="/chain/js/write.js"></script>
</body>
</html>