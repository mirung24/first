$(document).ready(function() {
	var regcd = $('#regcd').val();
	
	$.ajax({
		url: "com_logopath2.do",
		type: "post",
		data: { "regcd" : regcd },
		success: function(result) {
			console.log("체인점 로고 경로", result);
			$('#logoPath2').attr("src", result.data);
		}, 
		error: function() { alert("오류"); }
	});//ajax
});//ready

/* navi */
$('.navi').click(function () {
	$(this).stop().addClass('active');
	$(this).next('.subs').stop().slideToggle('500').addClass('active2');
	$(this).siblings('.active').each(function () {$(this).stop().removeClass('active');});
	$(this).siblings().next('.active2').each(function () {$(this).stop().slideUp('500').removeClass('active2');});

	$(this).children("i").toggleClass('active');
	$(this).siblings().children('.active').each(function () {$(this).removeClass('active');});
});

$('.subs li').click(function () {
	$(this).stop().addClass('active3'); 
	$(this).siblings('.active3').each(function () {$(this).removeClass('active3');});
	$(this).parents(".subs").siblings().find('.active3').each(function () {$(this).removeClass('active3');});
});

$('.logo').click(function(){
	$('.navi').removeClass('active');
	$('.navi').children("i").removeClass('active');
	$('.subs').stop().slideUp('500').removeClass('active2');
	$('.subs li.active3').removeClass('active3');
});

 /* 오늘 날짜 넣기 */
 var today = new Date();
 var year =  today.getFullYear();
 var month = ("0" + (today.getMonth() + 1)).slice(-2);
 var day = ("0" + today.getDate()).slice(-2);
 $('.date1, .date2').val(year + '-' + month + "-" + day);
 
 function pignoseCalendar1() {
	   $('.date1, .date2, .date3').pignoseCalendar({
	      format: 'YYYY-MM-DD', 
	      lang: 'ko',
	      week: 0,
	      theme: 'blue',
	      modal: true,
	      select: function(date, context){
	      }
	   });
	 }
 pignoseCalendar1();

 /* 스코어 */
//$(".square-target").each(function(idx){
//	var $obj = $(this).find("span");
//	var target = Number($(this).data("target"));
//	var speed = Number($(this).data("speed"));
//	var gap = Number($(this).data("gap"));
//	
//	var interval = setInterval(function(){
//		var value = Number($obj.html());
//		$obj.html(value + gap);
//		if(value >= target) {
//			clearInterval(interval);
//			$obj.html(target);
//			$obj.html($obj.html().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')); 
//		}
//	}, speed);
//});

function square_target() {
	$(".square-target").each(function(idx){
		var $obj = $(this).find("span");
		var target = Number($(this).data("target"));
//		var speed = Number($(this).data("speed"));
		var gap = parseInt($(this).data("target")/100);		
		
		var interval = setInterval(function(){
			var value = Number($obj.html());
			$obj.html(value + gap);
			if(value >= target) {
				clearInterval(interval);
				$obj.html(target);
				$obj.html($obj.html().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')); 
			}
		}, 1);
	});
}

/* top */
$(window).scroll(onScroll).trigger("scroll");
$(".bt-top").click(onTopClick);

function onScroll() {
 if($(this).scrollTop() > 100) {$(".bt-top").css("visibility", "visible");}
 else {$(".bt-top").css("visibility", "hidden");}
}

function onTopClick() {
 $("html, body").stop().animate({"scrollTop": 0}, 300, onScroll);
}

/* 로그아웃*/
$(".btn-logout").click(function(){
	var select = $("#select").val();
	
	if(select == "shop") {
		 swal({
			 title: '로그아웃 하시겠습니까?',
			 icon: "warning",
			 buttons: ["취소", "확인"]
		 }).then(function(willDelete) {
			 if(willDelete)	{
				 window.location = "/logout.do";
			 }
		 });
	} else if(select == "chain") {
		 swal({
			 title: '로그아웃 하시겠습니까?',
			 icon: "warning",
			 buttons: ["취소", "확인"]
		 }).then(function(willDelete) {
			 if(willDelete)	{
				 window.location = "/logoutchain.do";
			 }
		 });
	}
});

/* 창 닫을 때 강제 로그아웃 */
//window.addEventListener("unload", function() {
//	console.log("창 닫음");
//	$.ajax({
//		url: "xlogoutchain.do"
//	})
//});


function naviHide(hide) {
	   if (hide) {
	      $(".navi-wrap").css("display","none");
	      $(".section").css("width", "100%");
	      $(".allthatlogo img").css("display", "none");
	   }
	   else {
	      $(".navi-wrap").css("display","block");
	      $(".section").css("width", "calc(100% - 240px)");
	      $(".allthatlogo img").css("display", "block");
	   }
	}

$(".navi-close").click(function(){
if ($(this).hasClass('active')) {
		$(this).removeClass('active');
		naviHide(false);
	}

	else {
		$(this).addClass("active");
		naviHide(true);
	}
});

var sessionYN = $('#sessionYN').val();
if(sessionYN == 'N') {
	swal({
		title: '로그인 후 이용해주세요.',
		type: 'info',
		icon: "info",
		button: "확인"
	}).then(function(willDelete) {
		location.href="/logout.do"
	});
}


