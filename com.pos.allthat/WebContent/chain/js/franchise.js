 /* datatable */
$(document).ready(function() {
	
	var chaincode = $('#chaincode').val();
	
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
	
	var today2 = new Date();
	var pre_year = today2.getFullYear();
	var pre_month = today2.getMonth() + 1
	var pre_day = today2.getDate();
	
	$('.pre_year1').append('매출총액 ('+pre_year+'년)');
	$('.pre_year2').append('매출횟수 ('+pre_year+'년)');
	
	var search2 = $('[name=search2] option:selected').val();
	var searchDate1 = $('[name=searchDate1]').val();
	var searchDate2 = $('[name=searchDate2]').val();
	var sd1 = searchDate1.replace(/-/g,"");
	var sd2 = searchDate2.replace(/-/g,"");
	
	var pagecnt = $('[name=table_length] option:selected').val();
	var pageno = $('.paginate_button.current').text();
	if(pagecnt == 'undefined' || pagecnt == null || pagecnt == '') { pagecnt = '10'; }
	if(pageno == 'undefined' || pageno == null || pageno == '' || pageno < 0) { pageno = '1'; }
	
	dt1(chaincode, pageno, pagecnt);//테이블 조회
	
	// 검색 option 변경 시 선택한 값에 맞는 리스트 조회
	$('#searchBtn').on('click', function() {
		var search1 = $('[name=search1] option:selected').val();
		var searchInput = $('[name=searchInput]').val();

		if(search1 == 'corporatenumber' || search1 == 'all') {
			var searchInput = searchInput.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
		}
		
		$('#table').DataTable().destroy();
		$('#table_paginate').remove();
		$('#table_length').remove();
		
		dt1(chaincode, 1, pagecnt);//테이블 재조회
	});// 검색 버튼 

	// tr 클릭 이벤트
	$('#table tbody').on( 'click', 'tr', function() {
		var trcompcd = $(this).children('td:eq(13)').text();
		if(trcompcd.length != 0) {
			$.ajax({
				url: "fran_sel.do",
				type: "post",
				data: { 
					"compcd":trcompcd,
					"chaincode":chaincode
				},
				success: function(result) {
					console.log(result);
					var opendate = result.opendate;
					var registerdate = result.registerdate;
					var canceldate = result.canceldate;
					
					if(opendate == null) { var open = ""; } else { var open = opendate.substr(0, 10); }
					if(registerdate == null) { var regi = ""; } else { var regi = registerdate.substr(0, 10); }
					if(canceldate == null) { var can = ""; } else { var can = canceldate.substr(0, 10); }
					
					$('#pop_copnum').val(result.corporatenumber);
					$('#pop_name').val(result.companyname);
					$('#pop_pres').val(result.president);
					$('#pop_pcnt').val(result.presidentcnt);
					$('#pop_addr').val(result.address);
					$('#pop_addr2').val(result.address2);
					$('#pop_tel').val(result.tel);
					$('#pop_hp').val(result.hp);
					$('#pop_fax').val(result.fax);
					$('#pop_email').val(result.email);
					$('[name=pop_date1]').val(open);
					$('[name=pop_date2]').val(regi);
					$('[name=pop_date3]').val(can);
					$('#pop_taxem').val(result.taxuseremail);
					$('#pop_business').val(result.business);
					$('#pop_sectors').val(result.sectors);
					$('#pop_manager').val(result.manager);
					$('[name=pop_memo]').val(result.remarks);
					
					var compcd = result.compcd;
					$('#compcd').val(compcd);
					$('#dcompcd').val(compcd);
					userAddList(compcd);
					salesTally(compcd);
					salesHist(compcd);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					 alert("오류");
					 console.log(jqXHR);
					 console.log(textStatus);
					 console.log(errorThrown);
				}//error
			});// 선택된 내용 가져오기(ajax)	
			$(".modal-wrap1").css("display", "flex");
		}
	}); // tr클릭
	
	// 표시건수 selectbox 변경 이벤트
	$(document).on('change', '[name=table_length]', function() {
		var pagecnt = $('[name=table_length] option:selected').val();

		$('#table').DataTable().destroy();
		$('#table_paginate').remove();
		$('#table_length').remove();
		$('#table_next').remove();
		dt1(chaincode, 1, pagecnt);
	});// 표시건수 selectbox 변경 이벤트
	
	// 페이지 변경 이벤트
	$(document).on('click', 'a', function() {
		if($(this).attr('class') != "paginate_button next") {
			$('.paginate_button').removeClass('current'); //원래 선택된 페이지 클래스 지우고
			$(this).addClass('current'); //새로 선택된 페이지 클래스 생성
			
			var pageno = $('.paginate_button.current').text(); // 새로 바뀐 페이지 번호 가져오고
			var pagecnt = $('[name=table_length] option:selected').val();// 표시건수는 몇개인지 확인
			
			$('#table').DataTable().destroy();
			$('#table_paginate').remove();
			$('#table_length').remove();
			dt1(chaincode, pageno, pagecnt);
		}
	}); // 페이지 변경 이벤트


	$(".pop-close1").click(function(){
		$(".modal-wrap1").css({"display": "none"});
	});

	// 상단 집계
	$.ajax({
		url: "fran_tt.do",
		type: "post",
		data: { "chaincode": chaincode },
		success: function(result) {
			console.log(result);
			
			$('#totcnt').append("전체 가맹점 수 / " + numWithCommas(result.totcnt) + "개");
			$('#totamt1').prepend(numWithCommas(result.totamt1) + "원 ");
			$('#totcnt1').attr("data-target", result.totcnt1);
			
			$('#chrcnt').append("D-30 / " + numWithCommas(result.chrcnt) + "개");
			$('#totamt2').prepend(numWithCommas(result.totamt2) + "원 ");
			$('#totcnt2').attr("data-target", result.totcnt2);
			
			$('#newcnt').append("신규 가맹점 수 / " + numWithCommas(result.newcnt) + "개");
			$('#totamt3').prepend(numWithCommas(result.totamt3) + "원 ");
			$('#totcnt3').attr("data-target", result.totcnt3);
			
			square_target();
		},
		error: function(jqXHR, textStatus, errorThrown) {
			 alert("오류");
			 console.log(jqXHR);
			 console.log(textStatus);
			 console.log(errorThrown);
		}
	});
	
	
 });//ready

$(document).ajaxStart(function () {
    $('#loading').show(); // ajax 시작 -> 로딩바 표출
});

$(document).ajaxStop(function () {
    $('#loading').hide(); // ajax 끝 -> 로딩바 히든
});

// 테이블 조회
function dt1(chaincode, pageno, pagecnt) {
	var search1 = $('[name=search1] option:selected').val();
	var searchInput = $('[name=searchInput]').val();
	var search2 = $('[name=search2] option:selected').val();
	var searchDate1 = $('[name=searchDate1]').val();
	var searchDate2 = $('[name=searchDate2]').val();
	
	var sd1 = searchDate1.replace(/-/g,"");
	var sd2 = searchDate2.replace(/-/g,"");
	
	var table = $("#table").DataTable({
		 "dom": '<"top"il>t<"bottom center"><"clear">',
		 // l(페이지당),f(검색),i(전체),p(페이저),t,r
		 
		 ajax: { 
			 url: "fran_list.do",
			 data: {
				"chaincode":chaincode,
				"search1":search1,
				"searchInput":searchInput,
				"search2":search2,
				"searchDate1":sd1,
				"searchDate2":sd2,
				"pageno":pageno,
				"pagecnt":pagecnt
			 },
			 contentType: false,
	         processData: true,
	         async: false,
	         complete: function(result) {
				 console.log('complete', result.responseJSON);
				 var count = result.responseJSON.count;
			     $('#table_info').html('전체  <span>'+numWithCommas(count)+'</span> 건'); // 전체 건수 표시
			     paging(pageno,count);
			 },
			 error: function(jqXHR, textStatus, errorThrown) {
				 alert("오류");
				 console.log(jqXHR);
				 console.log(textStatus);
				 console.log(errorThrown);
			 },
			 dataSrc: function(res) {
				 console.log('데이터', res);
				 var data = res.data;
				 return data;
			 }//dataSrc
		 }, //ajax
		 columns: [
			{ data: "no" }, // NO.
			{ data: "companyname" }, // 가맹점
			{ data: "corporatenumber" }, // 사업자번호
			{ data: "president" }, // 대표자
			{ data: "addr"}, // 주소
			{ data: "tel" }, // 전화번호
			{ data: "hp" }, // 휴대폰
			{ data: "email" }, // 이메일
			{ data: "rdate" }, // 가맹일
			{ data: "namt" }, // 판매금액(당일)
			{ data: "yamt" }, // 판매금액(전일)
			{ data: "mamt" }, // 판매금액(D-30)
			{ data: "ranking" }, // 순위(D-30)
			{ data: "compcd" } // 가맹점 번호
		 ],
		 columnDefs: [
			{ targets: [0], width: 30},
			{ targets: [1], width: 100},
			{ targets: [2], width: 150},
			{ targets: [3], width: 80},
			{ targets: [4], width: 250},
			{ targets: [5], width: 120},
			{ targets: [6], width: 120},
			{ targets: [7], render: function(data, type, row) {
				if(data == null || data == "") {
					return data = '-';
				} else { return data; }
			} },
			{ targets: [9,10,11], className: "text-right", render: function(data, type, row) {
				if(data == null) { return data = '0원'; }
				else { return numWithCommas(data)+"원"; }
			} },
			{ targets: [12], render: function(data, type, row) {
				if(data == '0') { data = '-'; } return data;
			} }
		 ],
		 language: {
			 emptyTable: "데이터가 없습니다.",
			 lengthMenu: "_MENU_ 개씩 보기",
			 info: "전체 <span>_TOTAL_</span>건",
			 infoEmpty: "데이터 없음",
			 infoFiltered: "( _MAX_건의 데이터에서 필터링됨 )",
			 search: "",
			 searchPlaceholder: "검색어를 입력하세요.",
			 zeroRecords: "일치하는 데이터가 없습니다.",
			 loadingRecords: "로딩중...",
			 processing:     "잠시만 기다려 주세요...",
			 paginate: {
			 next: '<i class="fa-solid fa-angle-right"></i>',
			 previous: '<i class="fa-solid fa-angle-left"></i>',
			 first: '<i class="fa-solid fa-angles-left"></i>',
			 last: '<i class="fa-solid fa-angles-right"></i>',
			 }	
		 },
		 pagingType: "full_numbers",
		 orderMulti: true,
		 order: [ [ 0, "asc" ] ],
		/*  columnDefs: [
			{ targets: 0, width: 10},
		], */
		 lengthMenu: [ 10, 50, 100, 200 ],
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
	});
	$.fn.DataTable.ext.pager.numbers_length = 10;
		
	$('#table_paginate').appendTo('.page-wrap');
	$('#table_length').prependTo('.length-wrap');
	$('.dataTables_info').prependTo('#table_length');
	$('.btnexcel').appendTo('.bf-wrap');
}// 테이블 조회


 /*modal */
$(".pop-link2").click(function(){
	$(".modal-wrap2").css({"display": "flex"});
});
$(".pop-close2").click(function(){
	$(".modal-wrap2").css({"display": "none"});
});

// popup 사용자 추가 행 추가하기
$(document).on("click","#ua_btn", function(){
	var i = $('.ua_tbody tr').length;
	var compcd = $('#compcd').val();
	
	$.ajax({
		url: "ua_list.do",
		type: "post",
		data: { "compcd":compcd },
		success: function(result) {
			var ori_i = result.data.length;
			var ni = i-1;
			
			if(i == ori_i) {
				makeLowList(i);
				$('#ua_name'+i+'').focus();
				return;
			} if(i >= ori_i+1) { // 추가를 다시 눌러도 다시 추가 되지 않도록 하기
				var ni = i-1;
				$('#ua_name'+ni+'').focus();
				return;
			}
		}
	});
}); 

// popup 상세정보 저장하기 버튼
$('#popsv_btn').on('click', function() {
	var i = $('.ua_tbody tr').length;
	var compcd = $('#compcd').val();
	
	if($('#pop_name').val() == '') {
		swal({title: "가맹점명을 입력하세요.", button: "확인"})
		.then(function() {swal.close(); $('#pop_name').focus(); return; });
	} else if($('#pop_pres').val() == '') {
		swal({title: "대표자를 입력하세요.", button: "확인"})
		.then(function() {swal.close(); $('#pop_pres').focus(); return; });
	} else if($('#pop_addr').val() == '') {
		swal({title: "주소를 입력하세요.", button: "확인"})
		.then(function() {swal.close(); $('#pop_addr').focus(); return; });
	} else if($('#pop_addr2').val() == '') {
		swal({title: "상세주소를 입력하세요.", button: "확인"})
		.then(function() {swal.close(); $('#pop_addr2').focus(); return; });
	} else if($('#pop_tel').val() == '') {
		swal({title: "전화번호를 입력하세요.", button: "확인"})
		.then(function() {swal.close(); $('#pop_tel').focus(); return; });
	} else if($('#pop_hp').val() == '') {
		swal({title: "휴대폰번호를 입력하세요.", button: "확인"})
		.then(function() {swal.close(); $('#pop_hp').focus(); return; });
	} else if($('#pop_business').val() == '') {
		swal({title: "업태를 입력하세요.", button: "확인"})
		.then(function() {swal.close(); $('#pop_business').focus(); return; });
	} else if($('#pop_sectors').val() == '') {
		swal({title: "업종을 입력하세요.", button: "확인"})
		.then(function() {swal.close(); $('#pop_sectors').focus(); return; });
	} 
	else {
		$.ajax({
			url: "ua_list.do",
			type: "post",
			data: { "compcd":compcd },
			success: function(result) {
				var ori_i = result.data.length;
				var ni = i-1;
				console.log('ori_i : ', ori_i, ', i : ', i, ', ni : ', ni);
				
				var checkid = $('#ua_userid'+ori_i+'').val();
				console.log("checkid", checkid);
				
				$.ajax({
					url: "ua_idcheck.do",
					data: {
						"compcd":compcd,
						"ua_userid":checkid
					},
					success: function(result) {
						console.log("아이디 중복체크", result);
						if(result.data == 1) {
							swal({title: "중복된 아이디가 존재합니다.", button: "확인"})
							.then(function() {swal.close(); $('#ua_userid'+ori_i+'').focus(); return; });
						} else {
							console.log("ajax 안에서도 밖의 값 가져올 수 있는지 확인 " );
							console.log('ori_i : ', ori_i, ', i : ', i, ', ni : ', ni);
							ssave(i, ori_i, ni);
						}
					},//success
					error: function() { alert("오류"); }
				});//ajax
			}//success
		});//ajax
	}//else
});// popup 상세정보 저장하기 버튼

function ssave(i, ori_i, ni) {
	if(i >= ori_i+1) {
		if($('#ua_name'+ni+'').val()=='') {
			swal({title: "사용자 이름을 입력하세요.", button: "확인"})
			.then(function() {swal.close(); $('#ua_name'+ni+'').focus(); return; });
		} else if($('#ua_userid'+ni+'').val()=='') {
			swal({title: "사용자 아이디를 입력하세요.", button: "확인"})
			.then(function() {swal.close(); $('#ua_userid'+ni+'').focus(); return; });
		} else if($('#ua_passwd'+ni+'').val()=='') {
			swal({title: "사용자 비밀번호를 입력하세요.", button: "확인"})
			.then(function() {swal.close(); $('#ua_passwd'+ni+'').focus(); return; });
		}
		else {
			var detail_com = $('form[name=detail_f]').serialize();
			swal({
				title: '저장하시겠습니까?',
				icon: "info",
				buttons: true,
				imfoMode: true,
				buttons: ["취소", "확인"]
			}).then(function(willDelete) {
				if(willDelete) {
					$.ajax({
						url: "detail_sv.do",
						type: "post",
						dataType: "json",
						data: detail_com,
						success: function(result) {
							console.log('상세보기 저장', result);
							$(".modal-wrap1").css({"display": "none"});
							swal({
								title: '저장되었습니다.',
								type: 'success',
								icon: "success",
								button: "확인"
							}).then(function(willDelete) {
								location.href="franchise.do?title=관계사관리&name=가맹점관리";
							});
						}//success
					});//저장 ajax
				}//if(willDelete)
			});//swal then
		}//else
	} // 추가한 행이 비어있을 경우 유효성 검사 후 저장
	else if(i == 0) {
		swal({title: "사용자를 추가해주세요.", button: "확인"})
		.then(function() {swal.close(); $('#ua_btn').focus(); return; });
	}
	else if(i == ori_i) {
		var detail_com = $('form[name=detail_f]').serialize();
		swal({
			title: '저장하시겠습니까?',
			icon: "info",
			buttons: true,
			imfoMode: true,
			buttons: ["취소", "확인"]
		}).then(function(willDelete) {
			if(willDelete) {
				$.ajax({
					url: "detail_sv.do",
					type: "post",
					dataType: "json",
					data: detail_com,
					success: function(result) {
						console.log('상세보기 저장', result);
						$(".modal-wrap1").css({"display": "none"});
						swal({
							title: '저장되었습니다.',
							type: 'success',
							icon: "success",
							button: "확인"
						}).then(function(willDelete) {
							location.href="franchise.do?title=관계사관리&name=가맹점관리";
						});
					}//success
				});//저장 ajax
			}//if(willDelete)
		});//swal then
	}
}//ssave

// 주소창 띄우기 (다음 api)
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
}

$('.address').focus(function() {
	Address();
	$('.address').blur();
});

// 숫자만 입력했는지 확인
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

// 천단위로 콤마 찍어주기
$('.chuncom').text($('.comma' ).text().replace(/\,/g, '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'));

 /* 등록 */
$(".pop2 .btn-save").click(function(){ // 유효성 검사, 주소는 검색할 수 있게 api사용

	if($(".companynumber").val().length==0)
	swal({title: "사업자번호를 입력하세요.", button: "확인"})
	.then(function() {swal.close(); $(".companynumber").focus(); return false;
})
	else if($(".companyname").val().length==0)
	swal({title: "가맹점명을 입력하세요.", button: "확인"})
	.then(function() {swal.close(); $(".companyname").focus(); return false;
})
	else if($(".name").val().length==0)
	swal({title: "대표자명을 입력하세요.", button: "확인"})
	.then(function() {swal.close(); $(".name").focus(); return false;
})
	else if($(".address").val().length==0)
	swal({title: "주소를 입력하세요.", button: "확인"})
	.then(function() {swal.close(); $(".address").focus(); return false;
})
	else if($(".pop2 .address2").val().length==0)
	swal({title: "상세주소를 입력하세요.", button: "확인"})
	.then(function() {swal.close(); $(".pop2 .address2").focus(); return false;
})
	else if($(".number").val().length==0)
	swal({title: "전화번호를 입력하세요.", button: "확인"})
	.then(function() {swal.close(); $(".number").focus(); return false;
})
	else if($(".tell").val().length==0)
	swal({title: "휴대폰번호를 입력하세요.", button: "확인"})
	.then(function() {swal.close(); $(".tell").focus(); return false;
})
	else if($(".business").val().length==0)
	swal({title: "업태를 입력하세요.", button: "확인"})
	.then(function() {swal.close(); $(".business").focus(); return false;
})
	else if($(".sectors").val().length==0)
	swal({title: "업종을 입력하세요.", button: "확인"})
	.then(function() {swal.close(); $(".sectors").focus(); return false;
})

	else {
		swal({
			title: '가맹점을 등록하시겠습니까?',
			icon: "info",
			buttons: true,
			imfoMode: true,
			buttons: ["취소", "확인"]
		}).then(function(willDelete) {
			var corporatenumber = $('.companynumber').val(); // 사업자 번호
			var companyname = $('.companyname').val(); // 가맹점명
			var president = $('.name').val(); // 대표자
			var presidentcnt = $('.pcnt').val(); // 공동 대표수
			var address = $('.address').val(); // 주소
			var address2 = $('.pop2 .address2').val(); // 상세주소
			var tel = $('.number').val(); // 전화번호
			var hp = $('.tell').val(); // 휴대폰 번호
			var fax = $('.fax').val(); // 팩스번호
			var email = $('.email').val(); // 이메일
			var opendate = $('.register1').val(); // 개설일
			var registerdate = $('.register2').val(); // 가맹일
			var canceldate = $('.register3').val(); // 해지일
			var taxuseremail = $('.tax-email').val(); // 세금계산서 이메일
			var remarks = $('#remarks').val();
			var business = $('.business').val(); // 업태
			var sectors = $('.sectors').val(); // 업종
			var manager = $('.manager').val(); // 담당자
			
			var chaincode = $('#chaincode').val(); // 체인코드
			var userid = $('.userid').val(); // 유저 아이디
			console.log("개설일",opendate);
			console.log("해지일",canceldate);
	
			if(willDelete)	{
				$.ajax({
					url: "corpnum_check.do",
					data: {
						"corpnum":corporatenumber
					},
					success: function(result) {
						console.log("사업자번호 중복체크 : ",result);
						if(result > 0) { // 중복이 있으면
							swal({title: "중복된 사업자번호 입니다.", button: "확인"})
							.then(function() {swal.close(); $(".companynumber").val(""); $(".companynumber").focus(); return false;})
						} else {
							$.ajax({
								url: "fran_insert.do",
								type: "post",
								data: {
									"corporatenumber":corporatenumber,
									"companyname":companyname,
									"president":president,
									"presidentcnt":presidentcnt,
									"address":address,
									"address2":address2,
									"tel":tel,
									"hp":hp,
									"fax":fax,
									"email":email,
									"opendate":opendate,
									"registerdate":registerdate,
									"canceldate":canceldate,
									"taxuseremail":taxuseremail,
									"remarks":remarks,
									"business":business,
									"sectors":sectors,
									"manager":manager,
									"chaincode":chaincode,
									"regcd":userid
								},
								success: function(result) {
									console.log(result);
									
									$('.pop2 input, .pop2 textarea').val("").prop('checked', false);
									$(".modal-wrap2").css({"display": "none"});
									
									swal({
										title: '등록이 완료되었습니다.',
										type: 'success',
										icon: "success",
										button: "확인"
									}).then(function() {
										location.href = "/franchise.do?title=관계사관리&name=가맹점관리";
										// table.ajax.reload(null, false);
									});
								},
								error: function(jqXHR, textStatus, errorThrown) {
									 alert("오류");
									 console.log(jqXHR);
									 console.log(textStatus);
									 console.log(errorThrown);
								 }//error
							});//ajax
						}
					},
					error: function() { alert("사업자번호 중복체크 오류"); }
				}); // 사업자번호 중복체크
			}//if(willDelete)
		});//then
	}//else
});// 가맹점 등록

// 사용자 추가 리스트
function userAddList(compcd) {
	$.ajax({
		url: "ua_list.do",
		type: "post",
		data: { "compcd":compcd },
		success: function(result) {
			console.log('사용자 추가 리스트', result);
			
			let html = "";
			const count = result.data.length;
			
			if(count > 0) {
				for(var i = 0; i < count; i++) {
					var joindate = result.data[i].jo;
					var resigndate = result.data[i].resign;
					
					
					if(joindate == 'undefined' || joindate == null) join = '';
					else var join = joindate;
					
					if(resigndate == 'undefined' || resigndate == null) resign = '';
					else var resign = resigndate;
					
					html += "<tr>"
					html += 	"<td><input type='text' class='form-control' name='ua_name' id='ua_name" + i + "' value='" + result.data[i].name + "'></td>"
					html += 	"<td><input type='text' class='form-control' name='ua_userid' id='ua_userid" + i + "' value='" + result.data[i].userid + "' readonly='true'></td>"
					html += 	"<td><input type='password' class='form-control' name='ua_passwd' id='ua_passwd" + i + "' value='" + result.data[i].passwd + "'></td>"
					html += 	"<td><input type='text' class='form-control' name='ua_hp' id='ua_hp" + i + "' value='" + result.data[i].hp + "' maxlength='13' autoTelHyphen></td>"
					html += 	"<td><input type='text' class='form-control' name='ua_licence' id='ua_licence" + i + "' value='" + result.data[i].licence + "'></td>"
					html +=		"<td><input type='text' value='" + join + "' name='ua_date1' id='ua_date1-" + i + "'"
					html +=			"class='form-control date1 calendar calendar-img'></td>"
					html +=		"<td><input type='text' id='ua_date2-" + i + "' name='ua_date2'"
					html +=			"class='date2 calendar calendar-img' value='" + resign + "'></td>"
					html +=		"<td><select class='form-control' name='ua_level' id='ua_level" + i + "'>"
					html +=			"</select></td>"
					html +=		"</td>"
					html += "</tr>"	
				}//for
				$.ajax({
					url: "com_ua.do",
					type: "post",
					dataType: "json",
					data: { "upcode":"CO1047" },
					success: function(res) {
						console.log('select 부분 ajax',res);
						console.log('addList 부분 ajax',result);
						for(var i = 0; i < count; i++){
							util.MakeSelOptions($('#ua_level'+i+''), res.data, result.data[i].level, '');
						}
					},//success
					error:function(jqXHR, textStatus, errorThrown) {
						alert("오류");
						console.log(jqXHR);
						console.log(textStatus);
						console.log(errorThrown);
					}// error
				});//ajax
			}//if(count>0)
			$(".ua_tbody").html(html);
			pignoseCalendar1();
			$("input:text[autoTelHyphen]").on("keyup", function() {
				$(this).val($(this).val().replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`));
			});
		}, 
		error:function(jqXHR, textStatus, errorThrown) {
			alert("오류");
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}// error
	});//ajax
}

// popup 판매 집계
function salesTally(compcd) {
	$.ajax({
		url: "salesTally.do",
		type: "post",
		data: { "compcd":compcd },
		success: function(result) {
			console.log(result);
			const count = result.length;
			if(count == 0) {
				$('#salestot').val('0원');
				$('#salescnt').val('0건');
				$('#avgtot').val('0원');
				$('#avgcnt').val('0건');
			} else {
				$('#salestot').val(numWithCommas(result.total)+'원');
				$('#salescnt').val(numWithCommas(result.cnt)+'건');
				$('#avgtot').val(numWithCommas(result.avgtot)+'원');
				$('#avgcnt').val(numCommasdeci(result.avgcnt)+'건');
			}
		},
		error:function(jqXHR, textStatus, errorThrown) {
			alert("오류");
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}// error
	});// ajax
}// popup 판매 집계

// pop판매이력
function salesHist(compcd) {
	var chaincode = $('#chaincode').val();
	var popSearch1 = $('[name=popSearch1]').val();
	var popSearch2 = $('[name=popSearch2]').val();
	
	var sd1 = popSearch1.replace(/-/g,"");
	var sd2 = popSearch2.replace(/-/g,"");
	
	$.ajax({
		url: "salesHist.do",
		type: "post",
		data: {
			"chaincode":chaincode,
			"compcd":compcd,
			"popSearch1":sd1,
			"popSearch2":sd2
		},
		success: function(result) {
			console.log(result);
			
			let html = "";
			const count = result.data.length;
			
			if(count > 0) {
				for(var i = 0; i < count; i++) {
					var salesdt = changeDateString(result.data[i].salesdt); // 판매일자
					var tot = result.data[i].tot; // 판매금액

					if(i == count-1) {
						roc2 = '';
					} else {
						var roc1 = ((result.data[i].tot - result.data[i+1].tot)/result.data[i+1].tot)*100 // 증감률
						var roc2 = roc1.toFixed(1);
						var parts = String(roc2).split("."); 
						if(parts[1] == 0) {
							roc2 = parts[0];
						}
					}
					
					if(roc2 > 0) {
						html += "<tr>"
						html += 	"<td>" + salesdt + "</td>"
						html += 	"<td id='saleprice" + i + "'>" + numWithCommas(result.data[i].tot) + "원</td>"
						if(roc2 == 'Infinity') {
							html += 	"<td style='text-align: right;'>" + numWithCommas(result.data[i].tot) + "%<i class='fa-solid fa-up-long ml-1'></i></td>"
						} else {
							html += 	"<td style='text-align: right;'>" + numWithCommas(Math.abs(roc2)) + "%<i class='fa-solid fa-up-long ml-1'></i></td>"
						}
						html += 	"<td>" + result.data[i].cnt + "건</td>"
						html += "</tr>"
					} else if(roc2 < 0) {
						html += "<tr>"
						html += 	"<td>" + salesdt + "</td>"
						html += 	"<td id='saleprice" + i + "'>" + numWithCommas(result.data[i].tot) + "원</td>"
						html += 	"<td style='text-align: right;'>" + Math.abs(roc2) + "%<i class='fa-solid fa-down-long ml-1'></i></td>"
						html += 	"<td>" + result.data[i].cnt + "건</td>"
						html += "</tr>"
					}
				}
			}
			$(".sh_tbody").html(html);
		},
		error:function(jqXHR, textStatus, errorThrown) {
			alert("오류");
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}// error
	});//ajax
}// pop판매이력

// pop판매이력 검색 버튼
$('#pophistbtn').click(function() {
	var compcd = $('#compcd').val();
	salesHist(compcd);
});

// 천단위 콤마 찍기
function numWithCommas(x) {
	return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
// 천단위 콤마 찍기( 소수점 포함 )
function numCommasdeci(x) {
	var parts = String(x).split("."); 
//	console.log(parts[0]);
//	console.log(parts[1]);
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : ""); 
}
// 날짜 구분자 넣기
function changeDateString(date) {
	var year = date.substr(0,4);
	var month = date.substr(4,2);
	var day = date.substr(6,2);
	return year + "-" + month + "-" + day;
}

// popup 사용자 추가 행 추가하기
function makeLowList(i) {
	let html = "";
	
	html += "<tr>"
	html += 	"<td><input type='text' class='form-control' name='ua_name' id='ua_name" + i + "' value=''></td>"
	html += 	"<td><input type='text' class='form-control' name='ua_userid' id='ua_userid" + i + "' value=''></td>"
	html += 	"<td><input type='password' class='form-control' name='ua_passwd' id='ua_passwd" + i + "' value=''></td>"
	html += 	"<td><input type='text' class='form-control' name='ua_hp' id='ua_hp" + i + "' value='' maxlength='13' autoTelHyphen></td>"
	html += 	"<td><input type='text' class='form-control' name='ua_licence' id='ua_licence" + i + "' value=''></td>"
	html +=		"<td><input type='text' value='' id='ua_date1-" + i + "' name='ua_date1'"
	html +=			"class='calendar calendar-img date1'></td>"
	html +=		"<td><input type='text' id='ua_date2-" + i + "' name='ua_date2'"
	html +=			"class='calendar calendar-img date2' value=''></td>"
	html +=		"<td><select class='form-control' name='ua_level' id='ua_level" + i + "'>"
	html +=			"</select></td>"
	html +=		"</td>"
	html += "</tr>"
		
	$.ajax({
		url: "com_ua.do",
		type: "post",
		dataType: "json",
		data: { "upcode":"CO1047" },
		success: function(res) {
			console.log('select 부분 ajax',res);
			util.MakeSelOptions($('#ua_level'+i+''), res.data, res.data[0], '');
		},//success
		error:function(jqXHR, textStatus, errorThrown) {
			alert("오류");
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}// error
	});//ajax
	
	$('.ua_tbody').prepend(html);
	pignoseCalendar1();
	$("input:text[autoTelHyphen]").on("keyup", function() {
		$(this).val($(this).val().replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`));
	});
}

/* 테두리선 */
$('.table-responsive').scroll(onScroll).trigger("scroll");

function onScroll() {
   var scTop = $(this).scrollTop();
   var scleft = $(this).scrollLeft();
   if (scTop > 1) {
      $('.pop-cont .table thead th').css("box-shadow", "inset 0 -1px 0 #eee");
   } else if (scleft > 1) {
      $('.box .table tbody tr td:nth-child(6)').css("box-shadow", "inset -1px 0 0 #eee");
   } else {
      $('.pop-cont .table thead th').css("box-shadow", "none");
      $('.box .table tbody tr td:nth-child(6)').css("box-shadow", "none");
   }
}

function enterkey() {
	if(window.event.keyCode == 13) {
		$('#searchBtn').click();
	}
}// 엔터키 발생 이벤트

//페이징 처리
function paging(pageno, count) {
	
	$('a.paginate_button').remove();//만들어져 있던 페이지들 지우기
	$('#table_next').remove();//만들어져 있던 다음버튼 지우기
	$('#table_previous').remove();//만들어져 있던 이전버튼 지우기
//	$('#table_last').remove();
//	$('#table_first').remove();
	
	var chaincode = $('#chaincode').val();
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
				dt1(chaincode, pageno, pagecnt);
			} else {//else(마지막 페이지 아닐때 다음페이지로 넘어가기)
				var pageno = Number(pageno) + 1;
				var pagecnt = $('[name=table_length] option:selected').val(); // 표시 건수
				
				$('.paginate_button').removeClass('current'); //원래 선택된 페이지 클래스 지우고
				$('.paginate_button[value='+pageno+']').attr('class','paginate_button current');
				
				$('#table').DataTable().destroy();
				$('#table_paginate').remove();
				$('#table_length').remove();
				dt1(chaincode, pageno, pagecnt);
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
				dt1(chaincode, pageno, pagecnt);
			} else {//else(마지막 페이지 아닐때 다음페이지로 넘어가기)
				var pageno = Number(pageno) - 1;
				var pagecnt = $('[name=table_length] option:selected').val(); // 표시 건수
				
				$('.paginate_button').removeClass('current'); //원래 선택된 페이지 클래스 지우고
				$('.paginate_button[value='+pageno+']').attr('class','paginate_button current');
				
				$('#table').DataTable().destroy();
				$('#table_paginate').remove();
				$('#table_length').remove();
				dt1(chaincode, pageno, pagecnt);
			}//else(마지막 페이지 아닐때 다음페이지로 넘어가기)
		});// 이전 페이지 버튼 클릭시
	}//if(result>0) -> 상품리스트가 존재할 때
}// 페이징 처리































