$(document).ready(function() {
	var select = $('#select').val();//가맹점인지 체인점인지 구분 : chain or shop
	
    if(select == 'chain') { 
    	$("input:checkbox[name='chk']").prop("checked", false);
    	$("#chk1").prop("checked", true); 
    } else if(select == 'shop') { 
    	$("input:checkbox[name='chk']").prop("checked", false);
    	$("#chk2").prop("checked", true);
    }
    
	var userid = getCookie("userid");//저장된 쿠기값 가져오기
    $("input[name='userid']").val(userid); // 아이디 입력란에 가져온 아이디 넣기
     
    if($("input[name='userid']").val() != ""){ // 그 전에 ID를 저장해서 처음 페이지 로딩
                                           // 아이디 저장하기 체크되어있을 시,
        $("[name='chkBtn2']").attr("checked", true); // ID 저장하기를 체크 상태로 두기.
    }
     
    $("[name='chkBtn2']").change(function(){ // 체크박스에 변화가 발생시
        if($("[name='chkBtn2']").is(":checked")){ // ID 저장하기 체크했을 때,
            var userid = $("input[name='userid']").val();
            setCookie("userid", userid, 7); // 7일 동안 쿠키 보관
        }else{ // ID 저장하기 체크 해제 시,
            deleteCookie("userid");
        }
    });
     
    // ID 저장하기를 체크한 상태에서 ID를 입력하는 경우, 이럴 때도 쿠키 저장.
    $("input[name='userid']").keyup(function(){ // ID 입력 칸에 ID를 입력할 때,
        if($("[name='chkBtn2']").is(":checked")){ // ID 저장하기를 체크한 상태라면,
            var userid = $("input[name='userid']").val();
            setCookie("userid", userid, 7); // 7일 동안 쿠키 보관
        }
    });
    
    // 파라미터 포함된 url 보낼 경우
//    var param_id = $("#param_id").val();// 파라미터로 넘어온 아이디
//	var param_pwd = $("#param_pwd").val();// 파라미터로 넘어온 비밀번호
//	console.log(param_id,'   ',param_pwd);
	
//	if(param_id != null && param_pwd != null) {
//		$("[name=userid]").val(param_id);
//		$("[name=passwd]").val(param_pwd);
//		$(".btn-login").trigger("click");
//	}
    
    const url = new URL(window.location.href);
    const urlParams = url.searchParams;
    console.log(urlParams.get('id'));
    console.log(urlParams.get('pwd'));
    
    if(urlParams.has('id') == true && urlParams.has('pwd') == true) {
    	var urlId = urlParams.get('id');
    	var urlPwd = urlParams.get('pwd');
    	$("#id").val(urlId);
    	$("#pwd").val(urlPwd);
    	loginBtn(urlId, urlPwd);// 가맹점만 자동 로그인
    }
    
	function loginBtn(id, pwd) {
//		window.location = "/logout.do";
		console.log("로그인 버튼 클릭!!");
		var userid = $('#id').val();
		var passwd = $('#pwd').val();
		
		if($.trim($('#id').val()) == '') { $('#id').focus(); return; } // 아이디 입력했는지 확인
		if($.trim($('#pwd').val()) == '') { $('#pwd').focus(); return; } // 비번 입력했는지 확인
		
		$.ajax({
			url: "SacctChk.do",
			type: "post",
			data: {
				"userid" : userid,
				"passwd" : passwd
			},
			dataType: "json",
			success: function(data) {
				console.log(data);
				if(data.result == 0) { // 결과값이 성공이면 전송 여부는 true
					swal({
						title: '로그인 실패!',
						text: '아이디와 비밀번호를 확인해 주세요.',
						type: 'error',
						icon: "error",
						button: "확인",
						closeOnClickOutside : false,
						className: "login"
					});
					return;
				}
				if(data.result == 1) { // 결과값이 성공이면 아이디 처리
					var chkBtn1 = $("#magicBtn1").is(":checked");
					$.ajax({
						url: "slogin.do",
						type: "post",
						data: {
							"userid" : userid,
							"passwd" : passwd,
							"chkBtn1": chkBtn1
						},
						success: function(data) {
							console.log(data);
							location.href="/smain.do"
						},
						error: function() {
							alert("오류");
						}
					});
				}
			},//success
			error:function(request, error) {
				alert("오류");
				console.log(request.status);
				console.log(request.responseText);
				console.log(error);
			}//error
		});//ajax
	}  
	
	// 로그인 시도
	$('.btn-login').click(function() {
		console.log("로그인 버튼 클릭!!");
		var userid = $('#id').val();
		var passwd = $('#pwd').val();
		
		if($.trim($('#id').val()) == '') { $('#id').focus(); return; } // 아이디 입력했는지 확인
		if($.trim($('#pwd').val()) == '') { $('#pwd').focus(); return; } // 비번 입력했는지 확인
		
		if($('#chk1').is(':checked')==false && $('#chk2').is(':checked')==false) { // 체인본점 가맹점을 선택 안했을 때
			swal({title: "체인본점 또는 가맹점을 선택하세요.", button: "확인", icon: "info"})
			.then(function() { swal.close();$("#chk1").focus(); });
			return false;
		} else if($('#chk1').is(':checked')==true) { // 체인본점 선택했을 때
			$.ajax({
				url: "acctChk.do",
				type: "post",
				data: {
					"userid" : userid,
					"passwd" : passwd
				},
				dataType: "json",
				success: function(data) {
					console.log(data);
					if(data.result == 0) { // 결과값이 성공이면 전송 여부는 true
						swal({
							title: '로그인 실패!',
							text: '아이디와 비밀번호를 확인해 주세요.',
							type: 'error',
							icon: "error",
							button: "확인",
							closeOnClickOutside : false,
							className: "login"
						});
						return;
					}
					if(data.result == 1) { // 결과값이 성공이면 아이디 처리
						$.ajax({
							url: "login.do",
							type: "post",
							data: {
								"userid" : userid,
								"passwd" : passwd
							},
							success: function(data) {
								console.log(data);
								location.href="/main.do"
							},
							error: function() {
								alert("오류");
							}
						});
					}
				},//success
				error:function(request, error) {
					alert("오류");
					console.log(request.status);
					console.log(request.responseText);
					console.log(error);
				}//error
			});//ajax
			return false;
		} else if($('#chk2').is(':checked')==true) {// 가맹점 선택했을 때
			$.ajax({
				url: "SacctChk.do",
				type: "post",
				data: {
					"userid" : userid,
					"passwd" : passwd
				},
				dataType: "json",
				success: function(data) {
					console.log(data);
					if(data.result == 0) { // 결과값이 성공이면 전송 여부는 true
						swal({
							title: '로그인 실패!',
							text: '아이디와 비밀번호를 확인해 주세요.',
							type: 'error',
							icon: "error",
							button: "확인",
							closeOnClickOutside : false,
							className: "login"
						});
						return;
					}
					if(data.result == 1) { // 결과값이 성공이면 아이디 처리
						var chkBtn1 = $("#magicBtn1").is(":checked");
						$.ajax({
							url: "slogin.do",
							type: "post",
							data: {
								"userid" : userid,
								"passwd" : passwd,
								"chkBtn1": chkBtn1
							},
							success: function(data) {
								console.log(data);
								location.href="/smain.do"
							},
							error: function() {
								alert("오류");
							}
						});
					}
				},//success
				error:function(request, error) {
					alert("오류");
					console.log(request.status);
					console.log(request.responseText);
					console.log(error);
				}//error
			});//ajax
			return false;
		}
	});//btn-login click
});//ready

function fnInit(){
    var cookieid = getCookie("saveid");
    console.log(cookieid);
    if(cookieid != ""){
        $("input:checkbox[name='chkBtn2']").prop("checked", true);
        $('#logId').val(cookieid);
    }
}

// 쿠키 저장하기
function setCookie(cookieName, value, exdays){
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var cookieValue = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toGMTString());
    document.cookie = cookieName + "=" + cookieValue;
}
 
// 쿠키 삭제하기
function deleteCookie(cookieName){
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() - 1);
    document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
}
 
// 쿠키 가져오기
function getCookie(cookieName) {
    cookieName = cookieName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cookieName);
    var cookieValue = '';
    if(start != -1){
        start += cookieName.length;
        var end = cookieData.indexOf(';', start);
        if(end == -1)end = cookieData.length;
        cookieValue = cookieData.substring(start, end);
    }
    return unescape(cookieValue);
}


$('input[type="checkbox"][name="chk"]').click(function () {
	   if ($(this).prop('checked')) {
	      $('input[type="checkbox"][name="chk"]').prop('checked', false);
	      $(this).prop('checked', true);
	   }
});








































