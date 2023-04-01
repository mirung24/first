var Swiper = new Swiper ('.swiper-container', {
	autoplay: { 
		delay: 1000, 
		disableOnInteraction: false, 
	},
	pagination: { 
		el: '.swiper-pagination',
		clickable: true, 
	},
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev', 
	},
	observer: true,   // 추가
	observeParents: true,   // 추가
});//swiper

/* 메뉴 이동 */
$(function() {//자세히 보기 수정
	$(".box-show .table tbody").sortable({
		start:function(event,ui){},// 드래그 시작 시 호출
		stop:function(event,ui){reorder2();}// 드래그 종료 시 호출
	});
	$(".box-show .table tbody").disableSelection();
});
$(function() {// 고객화면 등록
	$(".pop2 .table tbody").sortable({
		start:function(event,ui){},// 드래그 시작 시 호출
		stop:function(event,ui){reorder();}// 드래그 종료 시 호출
	});
	$(".pop2 .table tbody").disableSelection();
});

function reorder() {
	$('.regImg tr').each(function(i, box) {
		$(box).children('td').eq(0).text(i + 1);
	});
}
function reorder2() {
	$('.detImg tr').each(function(i, box) {
		$(box).children('td').eq(0).text(i + 1);
	});
}

 
/*modal */
$(".pop-link2").click(function(){
	$(".modal-wrap2").css({"display": "flex"});
	$('.pop3 input[type="checkbox"][name="tem"]').prop('checked',false);
	$('#basic').prop('checked',true);
});
$(".pop-close2").click(function(){
	$(".modal-wrap2").css({"display": "none"});
});

$(".pop-link3").click(function(){
	$(".modal-wrap3").css({"display": "flex"});
});
$(".pop-close3").click(function(){
	$(".modal-wrap3").css({"display": "none"});
});
 
 /* datatable */
$(document).ready(function() {
	var compcd = $('#compcd').val();//가맹점 코드
	
	// 30일 전 날짜 넣기
	var today = new Date();
	var d30 = new Date(today.setDate(today.getDate() - 30));
	var year =  d30.getFullYear();
	var month = ("0" + (d30.getMonth() + 1)).slice(-2);
	var day = ("0" + d30.getDate()).slice(-2);
	$('.d-30').val(year + '-' + month + "-" + day);
	
	$('.d-30').pignoseCalendar({
		format: 'YYYY-MM-DD', 
		lang: 'ko',
		week: 0,
		theme: 'blue',
		modal: true,
		select: function(date, context){}
	});// d-30 날짜
	
	var pagecnt = $('[name=table_length] option:selected').val();
	var pageno = $('.paginate_button.current').text();
	if(pagecnt == 'undefined' || pagecnt == null || pagecnt == '') { pagecnt = '10'; }
	if(pageno == 'undefined' || pageno == null || pageno == '' || pageno < 0) { pageno = '1'; }
	
	dt1(compcd, pageno, pagecnt);//데이터 테이블 리스트 조회

	$('#table tbody').on( 'click', 'tr', function () {
		var count = $('#table tbody tr[name=screenlist]').length;
		console.log(count);
		
		if(count > 0) {
			$(".box-show").css("display", "block");
			$('#table tbody tr').removeClass('selected');
			$(this).addClass('selected');
			var screencode = $(this).children().eq(7).text();//스크린코드
			// 상세보기
			detail_scn(screencode);
			$('[name=removeimg]').remove();//수정한거 저장 안하고 다른 tr 선택하면 초기화
		}
	});//tr 클릭이벤트
	
//	$('#table tbody').on('click', 'tr td:not(.pop-link1)', function () {
//		
//	});

	 $(".pop-close1").click(function(){
		$(".modal-wrap1").css({"display": "none"});
	});

	$('#table_paginate').appendTo('.page-wrap');
	$('#table_length').prependTo('.length-wrap');
	$('.dataTables_info').prependTo('#table_length');
	$('.btnexcel').appendTo('.bf-wrap');
	
	// 표시건수 selectbox 변경 이벤트
	$(document).on('change', '[name=table_length]', function() {
		var pagecnt = $('[name=table_length] option:selected').val();

		$('#table').DataTable().destroy();
		$('#table_paginate').remove();
		$('#table_length').remove();
		$('#table_next').remove();
		dt1(compcd, 1, pagecnt);
	});// 표시건수 selectbox 변경 이벤트
	
	// 페이지 변경 이벤트
	$(document).on('click', 'a.paginate_button', function() {
		if($(this).attr('class') != "paginate_button next") {
			$('.paginate_button').removeClass('current'); //원래 선택된 페이지 클래스 지우고
			$(this).addClass('current'); //새로 선택된 페이지 클래스 생성
			
			var pageno = $('.paginate_button.current').text(); // 새로 바뀐 페이지 번호 가져오고
			var pagecnt = $('[name=table_length] option:selected').val();// 표시건수는 몇개인지 확인
			
			$('#table').DataTable().destroy();
			$('#table_paginate').remove();
			$('#table_length').remove();
			dt1(compcd, pageno, pagecnt);
		}
	}); // 페이지 변경 이벤트
	
	// 검색 option 변경시 리스트 재조회
	$(document).on('click','#searchBtn', function() {
		var compcd = $('#compcd').val();
		var pagecnt = $('[name=table_length] option:selected').val();
		
		$('#table').DataTable().destroy();
		$('#table_paginate').remove();
		$('#table_length').remove();
		dt1(compcd, 1, pagecnt);
	});// 검색 버튼 
 });//ready

$(document).ajaxStart(function () {
    $('#loading').show(); // ajax 시작 -> 로딩바 표출
});

$(document).ajaxStop(function () {
    $('#loading').hide(); // ajax 끝 -> 로딩바 히든
});

// 등록된 화면 리스트
function dt1(compcd, pageno, pagecnt) {
	var searchInput = $('[name=searchInput]').val();// 검색어
	
	var table = $("#table").DataTable({
		 "dom": '<"top"il>t<"bottom center"><"clear">',
		 // l(페이지당),f(검색),i(전체),p(페이저),t,r
		 ajax: {
			url: "sscreen_list.do",
			data: {
				"compcd":compcd,
				"searchInput":searchInput,
				"pageno":pageno,
				"pagecnt":pagecnt
			},
			contentType: false,
	        processData: true,
	        complete: function(result) {
				 console.log('complete', result.responseJSON);
				 var count = result.responseJSON.count;
			     $('#table_info').html('전체  <span>'+numWithCommas(count)+'</span> 건'); // 전체 건수 표시
			     paging(pageno,count);
			 },
			 error: function() { alert("오류"); },
			 dataSrc: function(result) {
				 console.log('가맹점 공지사항 리스트', result.data);
				 var data = result.data;
				 return data;
			 }
		 },// ajax
		 columns: [
			{ data: "no" },
			{ data: "screenname" },
			{ data: "startdate" },
			{ data: "enddate" },
			{ data: "priority" },
			{ data: "template" },
			{ data: "preview",
			'render': function(/* data, type, full, meta */) {return '<span class="view pop-link1">보기</span>';}},
			{ data: "screencode" }
		 ],
		 columnDefs: [
			 { targets: [2, 3], render: function(data, type, row) {
				 return data.substr(0,11);
			 } },
		 ],
		 createdRow: function(row, data, dataIndex, full) {
			$(row).attr('name', 'screenlist'); 
		 },
		 "language": {
			 "emptyTable": "데이터가 없습니다.",
			 "lengthMenu": "_MENU_ 개씩 보기",
			 "info": "전체 <span>_TOTAL_</span>건",
			 "infoEmpty": "데이터 없음",
			 "infoFiltered": "( _MAX_건의 데이터에서 필터링됨 )",
			 "search": "",
			 "searchPlaceholder": "검색어를 입력하세요.",
			 "zeroRecords": "일치하는 데이터가 없습니다.",
			 "loadingRecords": "로딩중...",
			 "processing":     "잠시만 기다려 주세요...",
			 "paginate": {
				"next": '<i class="fa-solid fa-angle-right"></i>',
				"previous": '<i class="fa-solid fa-angle-left"></i>',
				"first": '<i class="fa-solid fa-angles-left"></i>',
				"last": '<i class="fa-solid fa-angles-right"></i>',
			 }
		 },
		 pagingType: "full_numbers",
		 orderMulti: true,
		 order: [ [ 0, "desc" ] ],
		/*  columnDefs: [
			{ targets: 0, width: 10},
		], */
		 lengthMenu: [ 10, 12, 50, 100, 200 ],
		 displayLength: pagecnt,

		 buttons:[{
			extend:'excelHtml5',
			text: '<i class="fa-solid fa-download mr-1"></i>엑셀',
			footer: true,
			bom: true,
			className: 'btnexcel',
				title: null,
				autoWidth: true,
						customize: function (xlsx) {
							var sheet = xlsx.xl.worksheets['sheet1.xml'];
							$('row c', sheet).each( function () {
								 $(this).attr( 's', '25' );
							});
							$('row:first c', sheet).attr( 's', '32' );
							var col = $('col', sheet);
							$(col[0]).attr('width', 15);
							$(col[1]).attr('width', 15);
						}
		 }],
		});//table
		$.fn.DataTable.ext.pager.numbers_length = 10;
		$('#table_length').prependTo('.length-wrap');
		$('.dataTables_info').prependTo('#table_length');
		$('.btnexcel').appendTo('.bf-wrap');
}//데이트 데이블 함수

//미리보기
$(document).on('click', '.pop-link1', function (e) {//미리보기
	$(".modal-wrap1").css("display", "flex");
	var screencode = $(this).parent().parent().children().eq(7).text();
	console.log(screencode);
	$.ajax({
		url: "detail_scn.do",
		data: { "screencode":screencode },
		success: function(result) {
			console.log('미리보기', result);
			var mas = result.vo;
			var sub = result.list;
			
			//템플릿 부착!
			if(mas.template == '-') { $('.templete').html('<img src="/img/temp1.png" alt="">'); } //사용안함 일경우
			else if(mas.template == 'snow') {//snow일 경우
				let html = "";
				for(var i = 1; i < 21; i++) {
					html += '<img src="/img/snow2.png" alt="눈"class="snow'+i+' snow">'
				}
				$('.templete').html(html);
			}//else if
			else {// 나머지 ~
				$('.templete').html('<img src="/img/'+mas.template+'.png" alt="">');
			}
			
			//사진 부착!
			var count = sub.length;
			let shtml = "";
			for(var i = 0; i < count; i++) {
				shtml += '<div class="swiper-slide" data-swiper-autoplay="'+sub[i].displayti+'000">'
				shtml += 	'<img src="'+sub[i].url+'" alt="">'
				shtml += '</div>'
			}
			$('#swiImg').html(shtml);			
		},
		error: function() { alert("오류"); }
	});//ajax
	e.stopPropagation();
});

//스크린 상세보기
function detail_scn(screencode) {
	$.ajax({
		url: "detail_scn.do",
		data: { "screencode":screencode },
		success: function(result) {
			console.log(result);
			var mas = result.vo;
			var sub = result.list;
			
			$('#detName').val(mas.screenname);//고객화면명
			$('#detStr').val(mas.startdate.substr(0,11));//시작일
			$('#detEnd').val(mas.enddate.substr(0,11));//종료일
			
			if(mas.priority == 'Y') {//우선순위
				$('.box-wrap .pop-list input[type="checkbox"][name="detPri"]').prop('checked',false);
				$('#price1').prop('checked', true);
			} else {
				$('.box-wrap .pop-list input[type="checkbox"][name="detPri"]').prop('checked',false);
				$('#price2').prop('checked', true);
			}//우선순위
			
			// 템플릿
			if(mas.template == '-') {
				$('.pop3 input[type="checkbox"][name="tem"]').prop('checked',false);
				$('#basic').prop('checked',true);
			} else {
				$('.pop3 input[type="checkbox"][name="tem"]').prop('checked',false);
				$('#'+mas.template+'').prop('checked', true);
			}
			// 마스터 끝
			
			
			// 이미지 불러오기
			var count = sub.length;
			let html = "";
			console.log(count);
			$('.detImg').children('tr').remove();// tr만든거 붙이기
			
			for(var i = 0; i < count; i++) {
				html += '<tr>'
				html += 	'<td>'+sub[i].ordernum+'</td>'
				html += 	'<td><img src="'+sub[i].url+'" alt="" id="detimg'+(i+1)+'"></td>'
				html += 	'<td><input type="text" class="form-control filename detfnm'+(i+1)+'" disabled value="'+sub[i].name+sub[i].extension+'"></td>'
				html += 	'<td><select class="form-control" name="detdt" id="detdt'+(i+1)+'">'
				html += 		'<option value="10" selected>10</option>'
				html += 		'<option value="20">20</option>'
				html += 		'<option value="30">30</option>'
				html += 		'<option value="40">40</option>'
				html += 		'<option value="50">50</option>'
				html += 		'<option value="60">60</option>'
				html += 	'</select></td>'
				html += 	'<td><input class="form-control" type="text" name="detlink" value="'+sub[i].link+'"></td>'
				html += 	'<td><span class="remove" name="imgdel">삭제</span></td>'
				html += 	'<td style="display: none;">'+sub[i].imgcode+'</td>'
				html += '</tr>'
				$('.detImg').html(html);// tr만든거 붙이기
			}//for
			
			for(var j = 0; j < count; j++) {
				$('#detdt'+(j+1)+'').val(String(sub[j].displayti)).prop("selected", true);
			}
			
		},//success
		error: function() { alert("오류"); }
	});//ajax
}//스크린 상세보기

// 상세보기 저장
$('#modiBtn').click(function() {
	var screencode = $('#table tbody tr.selected').children().eq(7).text();//스크린코드
	var regcd = $('#regcd').val();
	
	var screenname = $('#detName').val();//고객화면명
	var startdate = $('#detStr').val();//시작일
	var enddate = $('#detEnd').val();//종료일
	var priority = $('.box .pop-list input[type="checkbox"][name="detPri"]:checked').val();//우선순위 적용
	var template = $('.pop3 input[type="checkbox"][name="tem"]:checked').val();// 템플릿
	
	// 마스터 수정
	$.ajax({
		url: "modi_master.do",
		data: {
			"screencode":screencode,
			"screenname":screenname,
			"startdate":startdate,
			"enddate":enddate,
			"priority":priority,
			"template":template,
			"regcd":regcd
		}, 
		success: function(result) {
			console.log(result);
		},
		error: function() { alert("오류"); }
	});//ajax(마스터 수정)
	
	// 서브 수정(이미지)
	var count = $('select[name=detdt]').length;//기존에 있던 이미지 개수
	var cd = {};
	var scncd = [];
	
	// 기존에 있던 이미지 수정
	for(var i = 0; i < count; i++) {
		cd = {};
		cd.ordernum = $('[name=detdt]').eq(i).parent().parent().children().eq(0).text();// 순서
		cd.displayti = $('select[name=detdt]').eq(i).children('option:selected').val();//디스플레이시간
		cd.link = $('[name=detlink]').eq(i).val();//링크
		cd.imgcode = $('[name=detdt]').eq(i).parent().parent().children().eq(6).text();//이미지 코드
		scncd.push(cd);
	}
	
	if(count > 0) {
		$.ajax({
			url: "exis_img.do",
			type:"post",
			data: {
				"scncd":JSON.stringify(scncd),
				"screencode":screencode
			},
			success: function(result) {
				console.log(result);
			},
			error: function() { alert("오류"); }
		});//ajax
	}//기존에 있던 이미지가 있다면 저장
	
	// 추가한 이미지 저장하기
	for(var i = 0; i < detimgs.length; i++) {
		var ordernum = $('.detImg [name=dlink]:eq('+i+')').parent().parent().children().eq(0).text();
		var displayti = $('.detImg [name=ddisplayti]:eq('+i+') option:selected').val();
		var link = $('.detImg [name=dlink]:eq('+i+')').val();
		console.log(ordernum, displayti, link, screencode);
		imgUpload(detimgs[i], screencode, ordernum, displayti, link);
	}// 추가한 이미지 저장하기
	
	// 삭제한 이미지 있으면 삭제
	var cnt = $('[name=removeimg]').length;
	var f = {};
	var m = [];
	
	for(var i = 0; i < count; i++) {
		f = {};
		f = $('[name=removeimg]').eq(i).val();// 기존에 있던 파일의 파일코드
		m.push(f);
	}
	
	if(count > 0) {
		$.ajax({
			url: "/detimg_del.do",
			type: "post",
			data: { 
				"m":JSON.stringify(m)
			},
			success: function(result) {
				swal({
					title: '저장되었습니다.',
					type: 'success',
					icon: "success",
					button: "확인"
				}).then(function(willDelete) {
					location.href="/sscreen.do?title=설정&name=고객화면관리"
				});//저장완료 swal
			},
			error: function() { alert("오류"); }
		});//ajax(기존에 있던 것)
	}
});// 상세보기 저장


/* 체크박스 하나만 선택 */
$('.pop-list input[type="checkbox"][name="popuse"]').click(function(){
	$('.pop-list input[type="checkbox"][name="popuse"]').prop('checked',false);
		 $(this).prop('checked',true);
	 });

$('.pop-list input[type="checkbox"][name="popprice"]').click(function(){
	$('.pop-list input[type="checkbox"][name="popprice"]').prop('checked',false);
		 $(this).prop('checked',true);
	 });

$('.box-wrap .pop-list input[type="checkbox"][name="use"]').click(function(){
	$('.box-wrap .pop-list input[type="checkbox"][name="use"]').prop('checked',false);
		 $(this).prop('checked',true);
	 });

$('.box-wrap .pop-list input[type="checkbox"][name="detPri"]').click(function(){
	$('.box-wrap .pop-list input[type="checkbox"][name="detPri"]').prop('checked',false);
		 $(this).prop('checked',true);
	 });

$('.pop2 .pop-list input[type="checkbox"][name="price"]').click(function(){
$('.pop2 .pop-list input[type="checkbox"][name="price"]').prop('checked',false);
	 $(this).prop('checked',true);
 });

 $('.pop3 input[type="checkbox"][name="tem"]').click(function(){
	$('.pop3 input[type="checkbox"][name="tem"]').prop('checked',false);
		 $(this).prop('checked',true);
});

/* 탭 */
$(".tab > .tablinks").click(function(){
	$(".tab > .tablinks").removeClass("active");
	$(this).addClass("active");
	$(".tab-wrap > .tabcontent").hide();
	$(".tab-wrap > .tabcontent").eq($(this).index()).show();
});
$(".tab > .tablinks").eq(0).trigger("click");

/* 화면 등록 이미지파일 */
var imgs = [];
$(document).on("change", ".file-input1", function(){
	var maxSize = 10*1024*1024; //10MB
	var fileSize = $(this)[0].files[0].size;
	console.log("fileSize", fileSize);
	
	if(fileSize > maxSize) {
		swal({title: "첨부파일은 10MB 이내로 등록하세요.", button: "확인"})
		.then(function() {swal.close(); return; });
	} else {
		var trleng = $(".regImg tr").length;//tr의 길이 등록한 이미지 몇개인지
		let html = "";
		
		if(trleng < 5) {
			html += '<tr>'
			html += 	'<td>'+(trleng+1)+'</td>'
			html += 	'<td><img src="" alt="" id="img'+(trleng+1)+'"></td>'
			html += 	'<td><input type="text" class="form-control filename filename'+(trleng+1)+'" disabled></td>'
			html += 	'<td><select class="form-control" name="displayti">'
			html += 		'<option value="10" selected>10</option>'
			html += 		'<option value="20">20</option>'
			html += 		'<option value="30">30</option>'
			html += 		'<option value="40">40</option>'
			html += 		'<option value="50">50</option>'
			html += 		'<option value="60">60</option>'
			html += 	'</select></td>'
			html += 	'<td><input class="form-control" type="text" value="" name="link"></td>'
			html += 	'<td><span class="remove" name="imgdel">삭제</span></td>'
			html += '</tr>'
				
			$('.regImg').append(html);// tr만든거 붙이기
			
			var file = $(this)[0].files[0];
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function(e) {
				$('#img'+(trleng+1)+'').attr("src", e.target.result);// 이미지 미리보기
			}
			$(".filename"+(trleng+1)+"").val($(this)[0].files[0].name);// 파일명 가져와서 출력
			
			data = new FormData();
			data.append("file"+(trleng+1)+"", file);
			console.log("file", file);
			
			imgs.push(file);// 이미지 파일 배열에 추가
			
//			imgUpload(file);
			
		} else {
			swal({title: "이미지는 5개 까지만 등록가능합니다.", button: "확인"})
			.then(function() {swal.close(); return; });
		}//else
	}//else
});//이미지 등록

/* 화면 등록 이미지파일 */
var detimgs = [];
$(document).on("change", ".file-input2", function(){
	var maxSize = 10*1024*1024; //10MB
	var fileSize = $(this)[0].files[0].size;
	console.log("fileSize", fileSize);
	
	if(fileSize > maxSize) {
		swal({title: "첨부파일은 10MB 이내로 등록하세요.", button: "확인"})
		.then(function() {swal.close(); return; });
	} else {
		var trleng = $(".detImg tr").length;//tr의 길이 등록한 이미지 몇개인지
		let html = "";
		
		if(trleng < 5) {
			html += '<tr>'
			html += 	'<td>'+(trleng+1)+'</td>'
			html += 	'<td><img src="" alt="" id="dimg'+(trleng+1)+'"></td>'
			html += 	'<td><input type="text" class="form-control filename dfilename'+(trleng+1)+'" disabled></td>'
			html += 	'<td><select class="form-control" name="ddisplayti">'
			html += 		'<option value="10" selected>10</option>'
			html += 		'<option value="20">20</option>'
			html += 		'<option value="30">30</option>'
			html += 		'<option value="40">40</option>'
			html += 		'<option value="50">50</option>'
			html += 		'<option value="60">60</option>'
			html += 	'</select></td>'
			html += 	'<td><input class="form-control" type="text" value="" name="dlink"></td>'
			html += 	'<td><span class="remove" name="imgdel">삭제</span></td>'
			html += '</tr>'
				
			$('.detImg').append(html);// tr만든거 붙이기
			
			var file = $(this)[0].files[0];
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function(e) {
				$('#dimg'+(trleng+1)+'').attr("src", e.target.result);// 이미지 미리보기
			}
			$(".dfilename"+(trleng+1)+"").val($(this)[0].files[0].name);// 파일명 가져와서 출력
			
			data = new FormData();
			data.append("file"+(trleng+1)+"", file);
			console.log("file", file);
			
			detimgs.push(file);// 이미지 파일 배열에 추가
			
//			imgUpload(file);
			console.log(detimgs);
			
		} else {
			swal({title: "이미지는 5개 까지만 등록가능합니다.", button: "확인"})
			.then(function() {swal.close(); return; });
		}//else
	}//else
});//이미지 등록

//등록시 이미지 삭제
$(document).on('click', '[name=imgdel]',function() {
	var num = $(this).parent().parent().children().eq(0).text();//순서 번호
	imgs.splice((num-1), 1);
	$(this).parent().parent().remove();//tr없애기
	
	$('.regImg tr').each(function(i, box) {
		$(box).children('td').eq(0).text(i + 1);
	});
	$('.detImg tr').each(function(i, box) {
		$(box).children('td').eq(0).text(i + 1);
	});
	
	if($(this).parent().parent().children().eq(6)) {
		var imgcode = $(this).parent().parent().children().eq(6).text();
		$('.content').append('<input type="hidden" value="'+imgcode+'" name="removeimg">');
	}
});// 등록시 이미지 삭제

// 고객화면 등록
$("#regiSv").click(function() {
//	console.log('이미지 file',imgs);
//	console.log('길이', imgs.length);
//	console.log('하나씩 보기 1', imgs[0]);
//	console.log('하나씩 보기 2', imgs[1]);
	
	var compcd = $('#compcd').val();//가맹점 코드
	var regcd = $('#regcd').val();//가맹점 코드
	
	if(imgs.length > 0) {//등록한 이미지가 존재할 때 저장
		var name = $('#regiName').val();//고객화면명
		var startdate = $('[name=regiStrdt]').val();//시작일
		var enddate = $('#regiEnddt').val();//종료일
		var priority = $('.pop2 .pop-list input[type="checkbox"][name="price"]:checked').val();//우선순위 적용
		var template = $('.pop3 input[type="checkbox"][name="tem"]:checked').val();// 템플릿
		
		$.ajax({// 마스터 등록
			url: "master_regi.do",
			type: "post",
			data: {
				"compcd":compcd,
				"regcd":regcd,
				"screenname":name,
				"startdate":startdate,
				"enddate":enddate,
				"template":template,
				"priority":priority
			},
			success: function(result) {
				var screencode = result.data;
				
				//서브 등록(이미지)
				for(var i = 0; i < imgs.length; i++) {
					var displayti = $('.regImg [name=displayti]:eq('+i+') option:selected').val();
					var link = $('.regImg [name=link]:eq('+i+')').val();
					imgUpload(imgs[i], screencode, i+1, displayti, link);
				}
				
			},//success
			error: function() { alert("오류"); }
		});//ajax(마스터 등록)
	} else {
		swal({title: "이미지를 등록해주세요.", button: "확인"})
		.then(function() {swal.close(); return; });
	}//else
});// 고객화면 등록(마스터 등록)

// 이미지 등록(서브등록)
function imgUpload(img, screencode, ordernum, displayti, link) {
	data = new FormData();
	data.append("img", img);
	data.append("screencode", screencode);
	data.append("ordernum", ordernum);
	data.append("displayti", displayti);
	data.append("link", link);
	
	$.ajax({
		data: data,
		type: "post",
		url: "/screen_img.do",
		contentType: false,
		enctype: "multipart/form-data",
		processData: false,
		success: function(data) {
			console.log(data);
			if(data.responseCode == "success") {
				console.log("이미지 등록 성공!");
				swal({
					title: '저장되었습니다.',
					type: 'success',
					icon: "success",
					button: "확인"
				}).then(function(willDelete) {
					location.href="/sscreen.do?title=설정&name=고객화면관리"
					$('.pop3 input[type="checkbox"][name="tem"]').prop('checked',false);
					$('#basic').prop('checked',true);
				});//저장완료 swal
			}//if(success)
			else {alert("오류");}
		}//success
	});//ajax
}//imgUpload


/* 등록 삭제 */
$(".trash").click(function(){
	var screencode = $('#table tbody tr.selected').children().eq(7).text();
	console.log(screencode);
	swal({
		title: '고객화면을 삭제하시겠습니까?',
		icon: "warning",
		buttons: true,
		imfoMode: true,
		buttons: ["취소", "확인"]
	}).then(function(willDelete) {
		if(willDelete)	{
			$.ajax({
				url: "screen_del.do",
				data: { "screencode":screencode },
				success: function(result) {
					console.log(result);
					swal({
						title: '삭제가 완료되었습니다.',
						type: 'success',
						icon: "success",
						button: "확인"
					}).then(function(willDelete) {
						location.href="/sscreen.do?title=설정&name=고객화면관리"
					});//저장완료 swal
				},
				error: function() { alert("오류"); }
			});//ajax
		}//if(willDelete)
	});//then(willDelete)
});//등록삭제

//천단위 콤마 찍기
function numWithCommas(x) {
	return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//페이징 처리
function paging(pageno, count) {
	
	$('a.paginate_button').remove();//만들어져 있던 페이지들 지우기
	$('#table_next').remove();//만들어져 있던 다음버튼 지우기
	$('#table_previous').remove();//만들어져 있던 이전버튼 지우기
//	$('#table_last').remove();
//	$('#table_first').remove();
	
	var compcd = $('#compcd').val();
	var pageno = pageno; // 현재 페이지 번호
	var pagecnt = $('[name=table_length] option:selected').val(); // 표시 건수
	var pageGroupSize = 10; // 보이는 페이지 개수
	var startRow = (pageno - 1) * pagecnt + 1;
	var endRow = pageno * pagecnt;

	var number = 0;
	if(count > 0) { if(endRow > count) endRow = count; }
	number = count - (pageno - 1) * pagecnt;
	
	var pageGroupCount = count / (pagecnt * pageGroupSize) + (count % (pagecnt * pageGroupSize) == 0 ? 0 : 1);
	var numPageGroup = Math.ceil(pageno/pageGroupSize);
	
	// 상품리스트가 존재할 때
	if(count > 0) {
		var pageCount = count / pagecnt + ( count % pagecnt == 0 ? 0 : 1); // 전체 만들어진 페이지
		var startPage = pageGroupSize * ( numPageGroup - 1 ) + 1;// 페이지 그룹의 첫번째 페이지
		var endPage = startPage + pageGroupSize - 1;//페이지 그룹의 마지막 페이지
		
		if(endPage > pageCount) { endPage = pageCount; }
		if(pageno > 1) { // 첫번째 페이지에서 이전버튼 안보이게
			$('.dataTables_paginate').prepend('<button class="btn paginate_button previous" id="table_previous"><i class="fa-solid fa-angle-left"></i></button>');
//			$('.dataTables_paginate').prepend('<button class="btn paginate_button first" id="table_first"><i class="fa-solid fa-angles-left"></i></button>');
		}// 첫번째 페이지에서 이전버튼 안보이게
		for(var i = startPage; i <= endPage; i++) {// 페이지버튼 만들기
			if(pageno == i) {//현재 페이지 current 클래스 추가
				$('.dataTables_paginate span').append('<a class="paginate_button current" value="'+i+'">'+i+'</a>');
			} else {
				$('.dataTables_paginate span').append('<a class="paginate_button" value="'+i+'">'+i+'</a>');
			}
		}// 페이지버튼 만들기
		pageCount = Math.floor(pageCount); // 소수점 내림
		if(pageno < pageCount) { // 마지막 페이지에서 다음버튼 안보이게
			$('.dataTables_paginate').append('<button class="btn paginate_button next" id="table_next"><i class="fa-solid fa-angle-right"></i></button>');
//			$('.dataTables_paginate').append('<button class="btn paginate_button last" id="table_last"><i class="fa-solid fa-angles-right"></i></button>');
		}// 마지막 페이지에서 다음버튼 안보이게
		
		// 다음페이지 버튼 클릭시
		$('.paginate_button.next').click(function() {
			var pageno = $('.paginate_button.current').text();// 현재 페이지
			var pagecnt = $('[name=table_length] option:selected').val(); // 표시 건수
			var numPageGroup = Math.ceil(pageno/pageGroupSize);
			var startPage = pageGroupSize * ( numPageGroup - 1 ) + 1;//페이지 그룹의 첫번째 페이지
			var endPage = startPage + pageGroupSize - 1;//페이지 그룹의 마지막 페이지

			if(pageno == endPage) {// 마지막 페이지일때 다음페이지 그룹으로 넘어가기
				var numPageGroup = Number(numPageGroup) + 1;
				var pageno = Number(pageno) + 1;
				var startPage = pageGroupSize * ( Number(numPageGroup) - 1 ) + 1;
				var endPage = startPage + pageGroupSize - 1;
				
				// 데이터 테이블 / 페이징 없애기
				$('#table').DataTable().destroy();
				$('#table_paginate').remove();
				$('#table_length').remove();
				
				// 페이징 다시 만들기
				for(var i = startPage; i <= endPage; i++) {
					if(pageno == i) {// 현재 페이지에는 current 클래스 추가해주기
						$('.dataTables_paginate span').html('<a class="paginate_button current" value="'+i+'">'+i+'</a>');
					} else {
						$('.dataTables_paginate span').append('<a class="paginate_button" value="'+i+'">'+i+'</a>');
					}
				}
				
				// 데이터 테이블 담긴 요소에 따라 다시 부르기
				dt1(compcd, pageno, pagecnt);
			} else {//else(마지막 페이지 아닐때 다음페이지로 넘어가기)
				var pageno = Number(pageno) + 1;
				var pagecnt = $('[name=table_length] option:selected').val(); // 표시 건수
				
				$('.paginate_button').removeClass('current'); //원래 선택된 페이지 클래스 지우고
				$('.paginate_button[value='+pageno+']').attr('class','paginate_button current');
				
				$('#table').DataTable().destroy();
				$('#table_paginate').remove();
				$('#table_length').remove();
				dt1(compcd, pageno, pagecnt);
			}//else(마지막 페이지 아닐때 다음페이지로 넘어가기)
		});// 다음페이지 버튼 클릭시
		
		// 이전 페이지 버튼 클릭시
		$('.paginate_button.previous').click(function() {
			var pageno = $('.paginate_button.current').text();// 현재 페이지
			var pagecnt = $('[name=table_length] option:selected').val(); // 표시 건수
			var numPageGroup = Math.ceil(pageno/pageGroupSize);
			var startPage = pageGroupSize * ( numPageGroup - 1 ) + 1;//페이지 그룹의 첫번째 페이지
			var endPage = startPage + pageGroupSize - 1;//페이지 그룹의 마지막 페이지

			console.log('startPage',startPage);
			console.log('endPage',endPage);
			
			if(pageno == startPage) {// 첫번째 페이지일때 이전페이지 그룹으로 넘어가기
				var numPageGroup = Number(numPageGroup) - 1;
				var pageno = Number(pageno) - 1;
				var startPage = pageGroupSize * ( Number(numPageGroup) - 1 ) + 1;
				var endPage = startPage + pageGroupSize - 1;
				
				// 데이터 테이블 / 페이징 없애기
				$('#table').DataTable().destroy();
				$('#table_paginate').remove();
				$('#table_length').remove();
				
				// 페이징 다시 만들기
				for(var i = startPage; i <= endPage; i++) {
					if(pageno == i) {// 현재 페이지에는 current 클래스 추가해주기
						$('.dataTables_paginate span').html('<a class="paginate_button current" value="'+i+'">'+i+'</a>');
					} else {
						$('.dataTables_paginate span').append('<a class="paginate_button" value="'+i+'">'+i+'</a>');
					}
				}
				
				// 데이터 테이블 담긴 요소에 따라 다시 부르기
				dt1(compcd, pageno, pagecnt);
			} else {//else(마지막 페이지 아닐때 다음페이지로 넘어가기)
				var pageno = Number(pageno) - 1;
				var pagecnt = $('[name=table_length] option:selected').val(); // 표시 건수
				
				$('.paginate_button').removeClass('current'); //원래 선택된 페이지 클래스 지우고
				$('.paginate_button[value='+pageno+']').attr('class','paginate_button current');
				
				$('#table').DataTable().destroy();
				$('#table_paginate').remove();
				$('#table_length').remove();
				dt1(compcd, pageno, pagecnt);
			}//else(마지막 페이지 아닐때 다음페이지로 넘어가기)
		});// 이전 페이지 버튼 클릭시
	}//if(result>0) -> 상품리스트가 존재할 때
}// 페이징 처리

