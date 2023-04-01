<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ko">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>로그인</title>
	<link rel="stylesheet" type="text/css"
		href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700|Material+Icons" />
	<link rel="stylesheet" href="/chain/css/bootstrap.min.css">
	<link rel="stylesheet" href="/chain/css/base.css">
	<link rel="stylesheet" href="/chain/css/login.css">
	<link rel="shortcut icon" href="img/favicon.ico" type="image/x-icon">
	<link rel="icon" href="img/favicon.ico" type="image/x-icon">
	<script src="/chain/js/jquery-3.5.1.min.js"></script>
	<script src="/chain/js/jquery-ui.min.js"></script>
	<script src="/chain/js/bootstrap.min.js"></script>
	<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
</head>
<%
	String id = request.getParameter("id");
	String pwd = request.getParameter("pwd");
%>
<body>
		<div class="wrapper">
			<div class="login-wrap">
				<input type="hidden" id="select" value="${select}">
				<input type="hidden" id="param_id" value="<%= id %>">
				<input type="hidden" id="param_pwd" value="<%= pwd %>">
				<div class="logo text-center"><a href="/"><img src="img/logo2.png" alt="로고" class="img"></a>
				</div>
				<form name="loginForm" id="login_f" method="post" autocomplete="off">
					<div class="login-body">
						<div class="form-wrap d-flex justify-content-between align-items-center">
							<i class="material-icons mr-2">face</i>
							<div class="input-group">
								<input type="text" id="id" name="userid" autocomplete="off" required>
								<label for="user_name"><span>아이디</span></label>
							</div>
						</div><!-- form-wrap -->
						<div class="form-wrap d-flex justify-content-between align-items-center">
							<i class="material-icons mr-2">lock_outline</i>
							<div class="input-group">
								<input type="password" id="pwd" name="passwd" autocomplete="off" required>
								<label for="user_password"><span>비밀번호</span></label><span class="errorbox" style="color: red;"></span>
							</div>
						</div><!-- form-wrap -->
					</div><!-- login-body -->
					
					<div class="footer text-center">
						<div class="custom-control custom-checkbox text-left d-flex align-items-center">
							<div>
								<input id="magicBtn1" type="checkbox" class="custom-control-input" name="chkBtn1">
								<label class="custom-control-label" for="magicBtn1">로그인 상태 유지</label>
							</div>
							<div class="ml-5">
								<input id="magicBtn2" type="checkbox" class="custom-control-input" name="chkBtn2">
								<label class="custom-control-label" for="magicBtn2">아이디 저장</label>
							</div>
						</div><!-- custom-control -->
						<a><button class="btn btn-login">로그인</button></a>
		
						<div class="find d-flex justify-content-center align-items-center" id="displaynone">
			               <input class="inp-cbx" id="chk1" name="chk" type="checkbox" />
			               <label class="cbx d-flex align-items-center" for="chk1"><span>
			                     <svg width="14px" height="12px">
			                        <use xlink:href="#check"></use>
			                     </svg></span><span style="min-width: 4.2rem;">체인본점</span></label>
			
			               <span class="line3"> l </span>
			
			               <input class="inp-cbx" id="chk2" name="chk" type="checkbox" />
			               <label class="cbx d-flex align-items-center" for="chk2"><span>
			                     <svg width="14px" height="12px">
			                        <use xlink:href="#check"></use>
			                     </svg></span><span style="min-width: 4.2rem;">가맹점</span></label>
			
			               <svg class="inline-svg">
			                  <symbol id="check" viewbox="0 0 12 10">
			                     <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
			                  </symbol>
			               </svg>
			            </div><!-- find -->
					</div><!-- footer -->
				</form>
			</div><!-- login-wrap -->
		</div><!-- wrapper -->
	<script src="/chain/js/login.js"></script><!-- chain폴더 js에 있음 -->
</body>
</html>