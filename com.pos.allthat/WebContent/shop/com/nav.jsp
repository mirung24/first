<%@page import="vo.CompanyUserVO"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="ko">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" type="text/css"
		href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700|Material+Icons" />
	<link rel="stylesheet" href="/shop/css/all.min.css">
	<link rel="stylesheet" href="/shop/css/animate.css">
	<link rel="stylesheet" href="/shop/css/bootstrap.min.css">
	<link rel="stylesheet" href="/shop/css/base.css">
	<link rel="stylesheet" href="/shop/css/common.css">
	<link rel="stylesheet" href="/shop/css/MonthPicker.css">
	<link rel="stylesheet" href="/shop/css/jquery.dataTables.min.css">
	<link rel="stylesheet" href="/pg-calendar/css/pignose.calendar.min.css">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.5.1/css/swiper.css">
	<link rel="shortcut icon" href="img/favicon.ico" type="image/x-icon">
	<link rel="icon" href="img/favicon.ico" type="image/x-icon">
	<script src="/shop/js/jquery-3.5.1.min.js"></script>
	<script src="/shop/js/jquery-ui.min.js"></script>
	<script src="/shop/js/bootstrap.min.js"></script>
	<script src="/shop/js/wow.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
	<script src="/shop/js/jquery.dataTables.min.js"></script>
	<script src="/pg-calendar/js/pignose.calendar.full.min.js"></script>
	<script src="/shop/js/Chart.bundle.js"></script>
	<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.5.1/js/swiper.js"></script>
	<script src="/shop/js/dataTables.buttons.min.js"></script>
	<script src="/shop/js/buttons.html5.min.js"></script>
	<script src="/chain/js/allthat-util.js"></script>
	<script src="/shop/js/jquery.mtz.monthpicker.js"></script>
</head>
<%
	String title = request.getParameter("title");
	String name = request.getParameter("name");
%>
<body>
	<div class="wrapper d-flex justify-content-between m-auto">
		<ul class="navi-wrap">
			<div class="logo text-center"><a href="/smain.do">
				<img src="" alt="로고" class="img pointer" id="logoPath"/>
			</a></div>
			<li class="navi <%if("거래처관리".equals(title)){ %>active<%}%>"><span><i class="fa-solid fa-user-group mr-2 "></i>거래처관리</span><i
					class="fa-solid fa-angle-right <%if("거래처관리".equals(title)){ %>active<%}%>"></i></li>
			<li class="subs <%if("거래처관리".equals(title)){ %>active2<%}%>" <%if("거래처관리".equals(title)) { %>style="display: list-item;"<%}%>>
				<ul>
					<a href="/sfranchise.do?title=거래처관리&name=가맹점정보"><li <%if("가맹점정보".equals(name)){ %>class="active3"<%}%>>가맹점정보</li></a>
					<a href="/sclient.do?title=거래처관리&name=거래처관리"><li <%if("거래처관리".equals(name)){ %>class="active3"<%}%>>거래처관리</li></a>
				</ul>
			</li>
			<li class="navi <%if("상품관리".equals(title)){ %>active<%}%>"><span><i class="fa-solid fa-cart-shopping mr-2"></i>상품관리</span><i
					class="fa-solid fa-angle-right <%if("상품관리".equals(title)){ %>active<%}%>"></i></li>
			<li class="subs <%if("상품관리".equals(title)){ %>active2<%}%>" <%if("상품관리".equals(title)){ %>style="display: list-item;"<%}%>>
				<ul>
					<a href="/sproduct.do?title=상품관리&name=상품관리"><li <%if("상품관리".equals(name)){ %>class="active3"<%}%>>상품관리</li></a>
					<a href="/spack.do?title=상품관리&name=상품포장관리"><li <%if("상품포장관리".equals(name)){ %>class="active3"<%}%>>상품포장관리</li></a>
					<a href="/scategory.do?title=상품관리&name=카테고리관리"><li <%if("카테고리관리".equals(name)){ %>class="active3"<%}%>>카테고리관리</li></a>
					<!-- <a href="/spb.do?title=상품관리&name=PB상품관리"><li>PB상품관리</li></a> -->
				</ul>
			</li>
			<li class="navi <%if("입고관리".equals(title)){ %>active<%}%>"><span><i class="fa-solid fa-truck mr-2"></i>입고관리</span><i
				class="fa-solid fa-angle-right <%if("입고관리".equals(title)){ %>active<%}%>"></i></li>
			<li class="subs <%if("입고관리".equals(title)){ %>active2<%}%>" <%if("입고관리".equals(title)){ %>style="display: list-item;"<%}%>>
				<ul>
					<!-- <a href="/sorder.do?title=입고관리&name=발주요청"><li>발주요청</li></a> -->
					<a href="/sincoming.do?title=입고관리&name=입고관리"><li <%if("입고관리".equals(name)){ %>class="active3"<%}%>>입고관리</li></a>
					<a href="/sinventory.do?title=입고관리&name=재고관리"><li <%if("재고관리".equals(name)){ %>class="active3"<%}%>>재고관리</li></a>
				</ul>
			</li>
<!-- 			<li class="navi"><span><i class="fa-solid fa-id-card-clip mr-2"></i>고객관리</span><i
					class="fa-solid fa-angle-right"></i></li>
			<li class="subs">
				<ul>
					<a href="/scustomer.do?title=고객관리&name=고객조회"><li>고객조회</li></a>
					<a href="/sscreen.do?title=고객관리&name=고객화면관리"><li>고객화면관리</li></a>
				</ul>
			</li> -->
			<li class="navi <%if("판매관리".equals(title)){ %>active<%}%>"><span><i class="fa-solid fa-tags mr-2"></i>판매관리</span><i 
				class="fa-solid fa-angle-right <%if("판매관리".equals(title)){ %>active<%}%>"></i>
			</li>
			<li class="subs <%if("판매관리".equals(title)){ %>active2<%}%>" <%if("판매관리".equals(title)){ %>style="display: list-item;"<%}%>>
				<ul>
					<a href="/ssell.do?title=판매관리&name=거래내역"><li <%if("거래내역".equals(name)){ %>class="active3"<%}%>>거래내역</li></a>
					<a href="/ssell2.do?title=판매관리&name=판매내역"><li <%if("판매내역".equals(name)){ %>class="active3"<%}%>>판매내역</li></a>
					<!-- <a href="/suseless.do?title=판매관리&name=불용재고"><li>불용재고</li></a> -->
				</ul>
			</li>
			<li class="navi <%if("고객화면관리".equals(title)){ %>active<%}%>"><span><i class="fa-solid fa-tv mr-2"></i>고객화면관리</span><i 
				class="fa-solid fa-angle-right <%if("고객화면관리".equals(title)){ %>active<%}%>"></i>
			</li>
			<li class="subs <%if("고객화면관리".equals(title)){ %>active2<%}%>" <%if("고객화면관리".equals(title)){ %>style="display: list-item;"<%}%>>
				<ul>
					<a href="/sscreen.do?title=고객화면관리&name=고객화면관리"><li <%if("고객화면관리".equals(name)){ %>class="active3"<%}%>>고객화면관리</li></a>
				</ul>
			</li>
			<!-- <li class="navi"><span><i class="fa-solid fa-gift mr-2"></i>이벤트관리</span><i class="fa-solid fa-angle-right"></i>
			</li>
			<li class="subs">
				<ul>
					<a href="/sevent.do?title=이벤트관리&name=이벤트등록"><li>이벤트등록</li></a>
					<a href="/serror.do?title=이벤트관리&name=이벤트진행내역"><li>이벤트진행내역</li></a>
					<a href="/scoupon.do?title=이벤트관리&name=쿠폰관리"><li>쿠폰관리</li></a>
				</ul>
			</li> -->
			<li class="navi <%if("통계현황".equals(title)){ %>active<%}%>"><span><i class="fa-solid fa-chart-pie mr-2"></i>통계현황</span><i
				class="fa-solid fa-angle-right <%if("통계현황".equals(title)){ %>active<%}%>"></i></li>
				<li class="subs <%if("통계현황".equals(title)){ %>active2<%}%>" <%if("통계현황".equals(title)){ %>style="display: list-item;"<%}%>>
					<ul>
						<a href="/sstatistics.do?title=통계현황&name=통계현황"><li <%if("통계현황".equals(name)){ %>class="active3"<%}%>>통계현황</li></a>
						<a href="/scalendar.do?title=통계현황&name=매출캘린더"><li <%if("매출캘린더".equals(name)){ %>class="active3"<%}%>>매출캘린더</li></a>
						<!-- <a href="/sdata.do?title=통계현황&name=매출데이터"><li>매출데이터</li></a> -->
						<a href="/ssaleshistory.do?title=통계현황&name=매출내역"><li <%if("매출내역".equals(name)){ %>class="active3"<%}%>>매출내역</li></a>
						<!-- <a href="/scustomerhistory.do?title=통계현황&name=고객내역"><li>고객내역</li></a> -->
					</ul>
				</li>
				<li class="navi <%if("전체게시판".equals(title)){ %>active<%}%>"><span><i class="fa-solid fa-comment mr-2"></i>전체게시판</span><i 
					class="fa-solid fa-angle-right <%if("전체게시판".equals(title)){ %>active<%}%>"></i>
				</li>
				<li class="subs <%if("전체게시판".equals(title)){ %>active2<%}%>" <%if("전체게시판".equals(title)){ %>style="display: list-item;"<%}%>>
					<ul>
						<a href="/snotice.do?title=전체게시판&name=공지사항"><li <%if("공지사항".equals(name)){ %>class="active3"<%}%>>공지사항</li></a>
					</ul>
				</li>
		</ul><!-- navi-wrap -->
</body>
</html>