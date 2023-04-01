/* $("#user_name").focusout(function(){
	var namePattern = /[a-zA-Z0-9_-]{5,20}/;
	if($("#user_name").val().length==0) {
		$('.errorbox')[0].innerHTML = "아이디를 입력하세요.";
		$('.errorbox')[0].style.display = "block"; $("#user_name").focus();
		return false;
	} else if(!namePattern.test($("#user_name").val()) || $("#user_name").val().indexOf(" ") > -1) {
		$('.errorbox')[0].innerHTML = "아이디를 확인해주세요.";
		$('.errorbox')[0].style.display = "block"; $("#user_name").focus(); return false;
	} else {
		$('.errorbox')[0].style.display = "none";
	}
}); 

$("#user_password").focusout(function(){
	var phonePattern = /[a-zA-Z0-9~!@#$%^&*()_+|<>?:{}]{4,16}/;
	if($("#user_password").val().length==0) {
		$('.footer').css({"margin-top": "2rem"});
		$('.errorbox')[1].innerHTML = "비밀번호를 입력하세요.";
		$('.errorbox')[1].style.display = "block"; $("#user_password").focus(); return false;
	} else if(!phonePattern.test($("#user_password").val())) {
		$('.footer').css({"margin-top": "4rem"});
		$('.errorbox')[1].innerHTML = "아이디 또는 비밀번호가 잘못 입력 되었습니다. 아이디와 비밀번호를 정확히 입력해 주세요.";
		$('.errorbox')[1].style.display = "block"; $("#user_password").focus(); return false;
	} else {
		$('.errorbox')[1].style.display = "none";
		$('.footer').css({"margin-top": "0"});
	}
}); */