<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" type="text/css"
		href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700|Material+Icons" />
	<link rel="stylesheet" href="/chain/css/all.min.css">
	<link rel="stylesheet" href="/chain/css/animate.css">
	<link rel="stylesheet" href="/chain/css/bootstrap.min.css">
	<link rel="stylesheet" href="/chain/css/base.css">
	<link rel="stylesheet" href="/chain/css/common.css">
	<link rel="stylesheet" href="/chain/css/jquery.dataTables.min.css">
	<link rel="stylesheet" href="/pg-calendar/css/pignose.calendar.min.css">
	<link rel="shortcut icon" href="img/favicon.ico" type="image/x-icon">
	<link rel="icon" href="img/favicon.ico" type="image/x-icon">
	<script src="/chain/js/jquery-3.5.1.min.js"></script>
	<script src="/chain/js/jquery-ui.min.js"></script>
	<script src="/chain/js/bootstrap.min.js"></script>
	<script src="/chain/js/wow.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
	<script src="/chain/js/jquery.dataTables.min.js"></script>
	<script src="/pg-calendar/js/pignose.calendar.full.min.js"></script>
	<script src="/chain/js/Chart.bundle.js"></script>
	<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
	<script src="/chain/js/dataTables.buttons.min.js"></script>
	<script src="/chain/js/buttons.html5.min.js"></script>
	<script src="/chain/js/allthat-util.js"></script>
	
	<script src="/summernote/summernote-lite.js"></script>
	<script src="/summernote/summernote-ko-KR.js"></script>
	<link rel="stylesheet" href="/summernote/summernote-lite.css">
</head>
<%
	String title = request.getParameter("title");
	String name = request.getParameter("name");
%>
<body>
	<div class="wrapper d-flex justify-content-between m-auto">
		<ul class="navi-wrap">
			<div class="logo text-center"><a href="/main.do">
				<img src="" alt="로고" class="img pointer" id="logoPath2"></a></div>
			<%-- <li class="navi <%if("기초관리".equals(title)){ %>active<%}%>"><span><i class="fa-solid fa-laptop-code mr-2"></i>기초관리</span><i
					class="fa-solid fa-angle-right <%if("기초관리".equals(title)){ %>active<%}%>"></i></li>
			<li class="subs <%if("기초관리".equals(title)){ %>active2<%}%>" <%if("기초관리".equals(title)) { %>style="display: list-item;"<%}%>>
				<ul>
					<a href="/code.do?title=기초관리&name=코드관리"><li <%if("코드관리".equals(name)){ %>class="active3"<%}%>>코드관리</li></a>
				</ul>
			</li> --%>
			<li class="navi <%if("관계사관리".equals(title)){ %>active<%}%>"><span><i class="fa-solid fa-user-group mr-2"></i>관계사관리</span><i
					class="fa-solid fa-angle-right <%if("관계사관리".equals(title)){ %>active<%}%>"></i></li>
			<li class="subs <%if("관계사관리".equals(title)){ %>active2<%}%>" <%if("관계사관리".equals(title)){ %>style="display: list-item;"<%}%>>
				<ul>
					<a href="/franchise.do?title=관계사관리&name=가맹점관리"><li <%if("가맹점관리".equals(name)){ %>class="active3"<%}%>>가맹점관리</li></a>
					<!-- <a href="/client.do"><li>거래처관리</li></a> -->
				</ul>
			</li>
			<li class="navi <%if("상품관리".equals(title)){ %>active<%}%>"><span><i class="fa-solid fa-cart-shopping mr-2"></i>상품관리</span><i
					class="fa-solid fa-angle-right <%if("상품관리".equals(title)){ %>active<%}%>"></i></li>
			<li class="subs <%if("상품관리".equals(title)){ %>active2<%}%>" <%if("상품관리".equals(title)){ %>style="display: list-item;"<%}%>>
				<ul>
					<a href="/product.do?title=상품관리&name=상품관리"><li <%if("상품관리".equals(name)){ %>class="active3"<%}%>>상품관리</li></a>
					<a href="/pack.do?title=상품관리&name=상품포장관리"><li <%if("상품포장관리".equals(name)){ %>class="active3"<%}%>>상품포장관리</li></a>
					<a href="/category.do?title=상품관리&name=카테고리관리"><li <%if("카테고리관리".equals(name)){ %>class="active3"<%}%>>카테고리관리</li></a>
					<!-- <a href="/inventory.do"><li>재고현황</li></a>
					<a href="/pb.do"><li>PB상품관리</li></a> -->
				</ul>
			</li>
			<!-- <li class="navi"><span><i class="fa-solid fa-truck mr-2"></i>출고관리</span><i class="fa-solid fa-angle-right"></i>
			</li>
			<li class="subs">
				<ul>
					<a href="/order.do"><li>발주관리</li></a>
				</ul>
			</li> -->
			<!-- <li class="navi"><span><i class="fa-solid fa-id-card-clip mr-2"></i>고객관리</span><i
					class="fa-solid fa-angle-right"></i></li>
			<li class="subs">
				<ul>
					<a href="/customer.do"><li>고객조회</li></a>
				</ul>
			</li> -->
 			<%-- <li class="navi <%if("판매관리".equals(title)){ %>active<%}%>"><span><i class="fa-solid fa-tags mr-2"></i>판매관리</span><i 
				class="fa-solid fa-angle-right <%if("판매관리".equals(title)){ %>active<%}%>"></i>
			</li>
			<li class="subs <%if("판매관리".equals(title)){ %>active2<%}%>" <%if("판매관리".equals(title)){ %>style="display: list-item;"<%}%>>
				<ul>
					<a href="/sell.do?title=판매관리&name=판매내역"><li <%if("판매내역".equals(name)){ %>class="active3"<%}%>>판매내역</li></a>
					<!-- <a href="/useless.do"><li>불용재고</li></a> -->
				</ul>
			</li> --%>
			<!-- <li class="navi"><span><i class="fa-solid fa-gift mr-2"></i>이벤트관리</span><i class="fa-solid fa-angle-right"></i>
			</li>
			<li class="subs">
				<ul>
					<a href="/event.do"><li>이벤트등록</li></a>
					<a href="/error.do"><li>이벤트진행내역</li></a>
					<a href="/coupon.do"><li>쿠폰관리</li></a>
				</ul>
			</li> -->
			<li class="navi <%if("통계현황".equals(title)){ %>active<%}%>"><span><i class="fa-solid fa-chart-pie mr-2"></i>통계현황</span><i
					class="fa-solid fa-angle-right <%if("통계현황".equals(title)){ %>active<%}%>"></i></li>
			<li class="subs <%if("통계현황".equals(title)){ %>active2<%}%>" <%if("통계현황".equals(title)){ %>style="display: list-item;"<%}%>>
				<ul>
					<a href="/statistics.do?title=통계현황&name=통계현황"><li <%if("통계현황".equals(name)){ %>class="active3"<%}%>>통계현황</li></a>
					<!-- <a href="/calendar.do"><li>매출캘린더</li></a>
					<a href="/data.do"><li>매출데이터</li></a>
					<a href="/saleshistory.do"><li>매출내역</li></a>
					<a href="/customerhistory.do"><li>고객내역</li></a> -->
				</ul>
			</li>
			<li class="navi <%if("전체게시판".equals(title)){ %>active<%}%>"><span><i class="fa-solid fa-comment mr-2"></i>전체게시판</span><i
				 class="fa-solid fa-angle-right <%if("전체게시판".equals(title)){ %>active<%}%>"></i>
			</li>
			<li class="subs <%if("전체게시판".equals(title)){ %>active2<%}%>" <%if("전체게시판".equals(title)){ %>style="display: list-item;"<%}%>>
				<ul>
					<a href="/notice.do?title=전체게시판&name=공지사항"><li <%if("공지사항".equals(name)){ %>class="active3"<%}%>>공지사항</li></a>
				</ul>
			</li>
		</ul><!-- navi-wrap -->
</body>
</html>