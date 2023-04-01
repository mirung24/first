 /* datatable */
$(document).ready(function() {
	
	var chaincode = $('#chaincode').val();
	var compcd = $('#compcd').val();
	
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
	
	var search2 = $('[name=search2] option:selected').val();
	var searchDate1 = $('[name=searchDate1]').val();
	var searchDate2 = $('[name=searchDate2]').val();
	var sd1 = searchDate1.replace(/-/g,"");
	var sd2 = searchDate2.replace(/-/g,"");
	
	var table = $("#table").DataTable({
	 "dom": '<"top"il>t<"bottom center"p><"clear">',
	 // l(페이지당),f(검색),i(전체),p(페이저),t,r
	 ajax: {
		 url: "/sclient_list.do",
		 data: {
			 "compcd":compcd,
			 "search2":search2,
			 "searchDate1":sd1,
			 "searchDate2":sd2
		 },
		 error: function() { alert("오류"); },
		 dataSrc: function(result) {
			 console.log('거래처관리 리스트', result);
			 var data = result.data;
			 return data;
		 }//dataSrc
	 },//ajax
			 columns: [
				{ data: "no" },// NO.
				{ data: "corporatenumber" }, // 사업자번호
				{ data: "accountname" }, // 거래처명
				{ data: "president" }, // 대표자
				{ data: "addr" },//주소
				{ data: "tel" },//전화번호
				{ data: "hp" },//휴대폰
				{ data: "email" },//이메일
				{ data: "regdt"},//등록일
				{ data: "accountcd" }//거래처코드
			 ],
			 columnDefs: [
				 { targets: [8], render: function(data) {
					return data.substr(0,10); 
				 } }
			 ],
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
	 displayLength: 12,

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
	});
	$.fn.DataTable.ext.pager.numbers_length = 10;

	$('#table_paginate').appendTo('.page-wrap');
	$('#table_length').prependTo('.length-wrap');
	$('.dataTables_info').prependTo('#table_length');
	$('.btnexcel').appendTo('.bf-wrap');
	
	// 검색 option 변경 시 선택한 값에 맞는 리스트 조회
	$('.btn-search').on('click', function() {
		var compcd = $('#compcd').val();
		
		var search1 = $('[name=search1] option:selected').val();
		var searchInput = $('[name=searchInput]').val();
		var search2 = $('[name=search2] option:selected').val();
		var searchDate1 = $('[name=searchDate1]').val();
		var searchDate2 = $('[name=searchDate2]').val();
		
		var sd1 = searchDate1.replace(/-/g,"");
		var sd2 = searchDate2.replace(/-/g,"");
		
		$.ajax({
			url: "/sclient_list.do",
			data: {
				"compcd":compcd,
				"search1":search1,
				"searchInput":searchInput,
				"search2":search2,
				"searchDate1":sd1,
				"searchDate2":sd2
			},
			success: function(result) {
				var result = JSON.parse(result);
				const count = result.data.length;
				table.clear();
				console.log(result.data);
				
				if(count != 0) {
					for(var i = 0; i < count; i++) {
						table.row.add(result.data[i]).draw().node();
					}
				} else {
					table.clear().draw();
				}
			},
			error: function() { alert("오류"); }
		});//ajax
	});// 리스트 검색 버튼
	
//	$('#table tbody').on('click', function () {
//		$(".modal-wrap1").css("display", "flex");
//	});

	$(".pop-close1").click(function(){
		$(".modal-wrap1").css({"display": "none"});
	});
	
	// tr클릭 이벤트
	$('#table tbody').on('click', 'tr', function() {
		var tracccd = $(this).children('td:eq(9)').text();
		if(tracccd.length != 0) {
			$.ajax({
				url: "cli_sel.do",
				data: { "accountcd":tracccd },
				success: function(result) {
					console.log(result);
					
					$('.corporatenumber').val(result.corporatenumber);
					$('.accountname').val(result.accountname);
					$('.business').val(result.business);
					$('.sectors').val(result.sectors);
					$('.president').val(result.president);
					$('.presidentcnt').val(result.presidentcnt);
					$('#addr1').val(result.address);
					$('#addr2').val(result.address2);
					$('.tel').val(result.tel);
					$('.hp').val(result.hp);
					$('.fax').val(result.fax);
					$('.email').val(result.email);
					$('.taxuseremail').val(result.taxuseremail);
					$('.manager').val(result.manager);
					$('#remarks').val(result.remarks);
					$('.accountcd').val(result.accountcd);
				},//success
				error: function(){ alert("오류"); }
			});//ajax
			$(".modal-wrap1").css("display", "flex");
		}
	});//tr 클릭이벤트
});//ready

$(document).ajaxStart(function () {
    $('#loading').show(); // ajax 시작 -> 로딩바 표출
});

$(document).ajaxStop(function () {
    $('#loading').hide(); // ajax 끝 -> 로딩바 히든
});

/*modal */
$(".pop-link2").click(function(){
	$(".modal-wrap2").css({"display": "flex"});
});
$(".pop-close2").click(function(){
	$(".modal-wrap2").css({"display": "none"});
	// 내용 비우기
	$('.rcorporatenumber').val('');
	$('.raccountname').val('');
	$('.rbusiness').val('');
	$('.rsectors').val('');
	$('.rpresident').val('');
	$('.rpresidentcnt').val('');
	$('#raddr1').val('');
	$('#raddr2').val('');
	$('.rtel').val('');
	$('.rhp').val('');
	$('.rfax').val('');
	$('.remail').val('');
	$('.rtaxuseremail').val('');
	$('.rmanager').val('');
	$('#regi_remarks').val('');
});

 /*등록 */
$("#regi_btn").click(function(){
	var compcd = $('#compcd').val();
	var regcd = $('#regcd').val();
	
	var rcorporatenumber = $('.rcorporatenumber').val(); //사업자 번호
	var raccountname = $('.raccountname').val();//거래처명
	var business = $('.rbusiness').val();//업태
	var sectors = $('.rsectors').val();//업종
	var rpresident = $('.rpresident').val();//대표자명
	var rpresidentcnt = $('.rpresidentcnt').val();//공동대표수
	var raddr1 = $('#raddr1').val();//주소
	var raddr2 = $('#raddr2').val();//상세주소
	var rtel = $('.rtel').val();//전화번호
	var rhp = $('.rhp').val();//휴대폰번호
	var rfax = $('.rfax').val();//팩스번호
	var remail = $('.remail').val();//이메일
	var rtaxuseremail = $(".rtaxuseremail").val();//세금계산서 이메일
	var rmanager = $(".rmanager").val();//담당자
	var regi_remarks = $('[name=regi_remarks]').val();//메모

	if($(".rcorporatenumber").val().length==0)
	swal({title: "사업자번호를 입력하세요.", button: "확인"})
	.then(function() {swal.close(); $(".rcorporatenumber").focus(); return false;
})
	else if($(".raccountname").val().length==0)
	swal({title: "거래처명을 입력하세요.", button: "확인"})
	.then(function() {swal.close(); $(".raccountname").focus(); return false;
})
//	else if($(".rpresident").val().length==0)
//	swal({title: "대표자명을 입력하세요.", button: "확인"})
//	.then(function() {swal.close(); $(".rpresident").focus(); return false;
//})
//	else if($(".rpresidentcnt").val().length==0)
//	swal({title: "공동대표수를 입력하세요.", button: "확인"})
//	.then(function() {swal.close(); $(".rpresidentcnt").focus(); return false;
//})
//	else if($("#raddr1").val().length==0)
//	swal({title: "주소를 입력하세요.", button: "확인"})
//	.then(function() {swal.close(); $("#raddr1").focus(); return false;
//})
//	else if($("#raddr2").val().length==0)
//	swal({title: "상세주소를 입력하세요.", button: "확인"})
//	.then(function() {swal.close(); $("#raddr2").focus(); return false;
//})
//	else if($(".rtel").val().length==0)
//	swal({title: "전화번호를 입력하세요.", button: "확인"})
//	.then(function() {swal.close(); $(".rtel").focus(); return false;
//})
//	else if($(".rhp").val().length==0)
//	swal({title: "휴대폰번호를 입력하세요.", button: "확인"})
//	.then(function() {swal.close(); $(".rhp").focus(); return false;
//})
//	else if($(".rfax").val().length==0)
//	swal({title: "팩스번호를 입력하세요.", button: "확인"})
//	.then(function() {swal.close(); $(".rfax").focus(); return false;
//})
//	else if($(".remail").val().length==0)
//	swal({title: "이메일을 입력하세요.", button: "확인"})
//	.then(function() {swal.close(); $(".remail").focus(); return false;
//})
//	else if($(".rtaxuseremail").val().length==0)
//	swal({title: "세금계산서 이메일을 입력하세요.", button: "확인"})
//	.then(function() {swal.close(); $(".rtaxuseremail").focus(); return false;
//})
//	else if($(".rmanager").val().length==0)
//	swal({title: "담당자를 입력하세요.", button: "확인"})
//	.then(function() {swal.close(); $(".rmanager").focus(); return false;
//})

 else {
	swal({
		title: '거래처를 등록하시겠습니까?',
		icon: "info",
		buttons: true,
		imfoMode: true,
		buttons: ["취소", "확인"]
	}).then(function(willDelete) {
	if(willDelete)	{
		$.ajax({
			url: "sclient_regi.do",
			data: {
				"corporatenumber":rcorporatenumber,
				"accountname":raccountname,
				"business":business,
				"sectors":sectors,
				"address":raddr1,
				"address2":raddr2,
				"president":rpresident,
				"presidentcnt":rpresidentcnt,
				"tel":rtel,
				"hp":rhp,
				"fax":rfax,
				"email":remail,
				"taxuseremail":rtaxuseremail,
				"manager":rmanager,
				"remarks":regi_remarks,
				"regcd":regcd,
				"compcd":compcd
			},
			success: function(result) {
				console.log('거래처 등록', result);
				location.href = "/sclient.do?title=거래처관리&name=거래처관리";
			},
			error: function() { alert("오류"); }
		});//ajax
		$('.pop2 input, .pop2 textarea').val("").prop('checked', false);
		$(".modal-wrap2").css({"display": "none"});
		swal({
			title: '등록이 완료되었습니다.',
			type: 'success',
			icon: "success",
			button: "확인"
		});
	}
	});
}
});//거래처 등록

// 상세정보 수정하기
$('#popsv_btn').on('click', function() {
	var detail = $('form[name=detail_f]').serialize();
	
	$.ajax({
		url:"/sclient_edit.do",
		data: detail,
		success: function(result) {
			console.log('상세보기 수정', result);
			
			swal({
				title: '수정이 완료되었습니다.',
				type: 'success',
				icon: "success",
				button: "확인"
			}).then(function(willDelete) {
				location.href="/sclient.do?title=거래처관리&name=거래처관리";
			});
		},
		error: function() { alert("오류"); }
	});//ajax
});// 상세정보 수정하기

//주소창 띄우기 (다음 api)
function Address() {
	new daum.Postcode({
        oncomplete: function(data) {
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var addr = ''; // 주소 변수
            var extraAddr = ''; // 참고항목 변수

            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress;
            }

            // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
            if(data.userSelectedType === 'R'){
                // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                    extraAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가한다.
                if(data.buildingName !== '' && data.apartment === 'Y'){
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if(extraAddr !== ''){
                    extraAddr = ' (' + extraAddr + ')';
                }
            
            } else {
//                document.getElementById("sample6_extraAddress").value = '';
            }

            $('.address').val(addr);
            $('.address2').focus();
        }
    }).open();
}//주소창 띄우기 (다음 api)

$('.address').focus(function() {
	Address();
	$('.address').blur();
});

//숫자만 입력했는지 확인
$("input:text[numberOnly]").on("keyup", function() {
    $(this).val($(this).val().replace(/[^0-9]/g,""));
 });
// 전화번호, 휴대폰번호, 팩스번호 자동으로 하이픈 넣기
$("input:text[autoTelHyphen]").on("keyup", function() {
	$(this).val($(this).val().replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`));
});
// 사업자번호 자동으로 하이픈 넣기
$("input:text[autoCorpHyphen]").on("keyup", function() {
	$(this).val($(this).val().replace(/[^0-9]/g, '').replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3'));
});
function enterkey() {
	if(window.event.keyCode == 13) {
		$('#searchBtn').click();
	}
}// 엔터키 발생 이벤트