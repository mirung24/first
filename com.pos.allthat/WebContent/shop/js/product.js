/* 테두리선 */
$('.table-responsive').scroll(onScroll).trigger("scroll");

function onScroll() {
	var scTop = $(this).scrollTop();
	if (scTop > 1) {
		$('.pop-cont .table thead th').css("box-shadow", "inset 0 -1px 0 #eee");
	} else {
		$('.pop-cont .table thead th').css("box-shadow", "none");
	}
}

/* datatable */
$(document).ready(function() {
	
	var compcd = $('#compcd').val();
	var corpnum = $("#corpnum").val();
	
	// y,n 유무에 따라 보이기/숨기기 설정 (디폴트는 숨기기)
	$.ajax({
		url: "connectyn.do",
		data: { "compcd":compcd },
		success: function(result) {
			console.log('yn 유무',result.data);
			if(result.data == 'N') {
				$('.connectyn').css('visibility', 'visible');
			}
			$("#connectyn").val(result.data);
		},//success
		error: function() { alert("오류"); }
	});//ajax
	
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
	
	$('.pre_year1').append('매출총액 ('+pre_year+'년)');
	$('.pre_year2').append('매출횟수 ('+pre_year+'년)');
	
	var search2 = $('[name=search2] option:selected').val();
	var searchDate1 = $('[name=searchDate1]').val();
	var searchDate2 = $('[name=searchDate2]').val();
	var sd1 = searchDate1.replace(/-/g,"");
	var sd2 = searchDate2.replace(/-/g,"");
	
	var pagecnt = $('[name=table_length] option:selected').val();
	var pageno = $('.paginate_button.current').text();
	if(pagecnt == 'undefined' || pagecnt == null || pagecnt == '') { pagecnt = '15'; }
	if(pageno == 'undefined' || pageno == null || pageno == '' || pageno < 0) { pageno = '1'; }
	
	// api로 승인내역 조회
	$.ajax({
		url: "/com_api.do",
		type: "post",
		async: false,
		data: {
			"accessKey":"elZIM0h2RmRzd3VGdEtvcVNiSktwQT09",
			"req_busiNo":corpnum,
			"req_tranDt":sd2,
			"req_tranDtEnd":sd2,
			"req_type":"ALLTALK"
		},
		success: function(result) {
			console.log("api승인내역 조회", result);
			console.log(result.RET_CODE);
			
			if(result.RET_CODE == "0000") { // 정상일 때
				$.ajax({
					url: "/com_temp.do",
					type: "post",
					async: false,
					data: JSON.stringify(result),
					contentType: "application/json; charset=utf8",
					success: function(res) {
						console.log("temp테이블 넣기", res);
					},
					error: function() { console.log("temp 테이블 넣기 오류"); $('#loading').hide(); }
				});
			} else {
				$.ajax({
					url: "/temp_del.do",
					type: "post",
					data: { "compcd": compcd },
					async: false,
					success: function(result) {
						console.log("temp 일단 지우기```", result);
					},
					error: function() { alert("오류"); }
				});//ajax
			}//else
			
		},//success
		error: function() { alert("승인내역 조회 오류"); }
	});//ajax(승인내역 api)
	
	dt1(compcd, pageno, pagecnt);//데이터테이블 조회
	sprod_top(compcd, sd1, sd2);// 상단집계 조회
	category1();// 카테고리 1 리스트
		
	// 검색 option 변경시 리스트 재조회
	$(document).on('click','#searchBtn', function() {
		var compcd = $('#compcd').val();
		
		var searchDate1 = $('[name=searchDate1]').val();
		var searchDate2 = $('[name=searchDate2]').val();
		var sd1 = searchDate1.replace(/-/g,"");
		var sd2 = searchDate2.replace(/-/g,"");
		
		var pagecnt = $('[name=table_length] option:selected').val();
		
		$('#table').DataTable().destroy();
		$('#table_paginate').remove();
		$('#table_length').remove();
		
		dt1(compcd, 1, pagecnt);
		sprod_top(compcd, sd1, sd2);//상단집계 재조회
	});// 검색 버튼 
	
	// tr 클릭 이벤트
	$('#table tbody').on( 'click', 'tr', function() {
		var productid = $(this).children('td:eq(11)').text();
		$('#productid').val(productid);
		$("#whichclick").val("tr");
		
		if(productid != '-' && productid != "") {
			$(".modal-wrap1").css("display", "flex");
			$.ajax({
				url: "sprod_sel.do",
				data: {
					"compcd":compcd,
					"productid":productid
				},
				success: function(result) {
					console.log(result);
					
					$('.sproductname').val(result.productname);
					$('.sproductcd').val(result.productcd);
					$('.smaker').val(result.maker);
					$('.sspec').val(result.spec);
					$('.sunit').val(result.unit);
					$('.ssize').val(result.size);
//					$('.scategory').val(result.categoryname);
					$('#sremarks').val(result.remarks);
					
					$("#category3cd").val(result.category3cd);
					if(result.category3cd != "") {
						cateNames(result.category3cd);
					}// 카테고리 이름들 가져와서 붙이깅 (반영하깅)
					if($("#connectyn").val() == "Y" || $("#connectyn").val() == "") {
						$(".scategory").attr("readonly", true);
						$(".scategory").off('click');
					}
					
					groupAddList(compcd, productid);//그룹상품 추가 리스트
					sprodTally(compcd, productid);//판매집계 조회
					sprodHist(compcd, productid);//판매이력 조회
				},
				error: function() { alert("오류"); }
			});//ajax
		} else {
			swal({title: "제품코드가 존재하지 않습니다.", button: "확인"})
			.then(function() {swal.close(); return false;})
		}
	});// tr 클릭 이벤트
	
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
	
	// 상품이관 검색 버튼
	$(document).on('click','#searchBtn2', function() {
		var compcd = $('#compcd').val();
		var search3 = $('[name=search3] option:selected').val();
		var searchInput2 = $('[name=searchInput2]').val();
		
		if(searchInput2 == null || searchInput2 == '') {
			swal({title: "검색어를 입력하세요.", button: "확인"})
			.then(function() {
				swal.close(); 
				$('[name=searchInput2]').focus();
				return false;
			})
		} else {
			prod_list(compcd, search3, searchInput2);
		}
	});// 상품 이관 검색 버튼
	
 });//ready

$(document).ajaxStart(function () {
    $('#loading').show(); // ajax 시작 -> 로딩바 표출
});

$(document).ajaxStop(function () {
    $('#loading').hide(); // ajax 끝 -> 로딩바 히든
});


// 데이터 테이블
function dt1(compcd, pageno, pagecnt) {
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
		 url: "/sprod_list.do",
		 data: {
			 "compcd":compcd,
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
		 error: function() { alert("오류"); },
		 dataSrc: function(result) {
			 console.log('가맹점 상품관리 리스트', result.data);
			 var data = result.data;
			 return data;
		 }
	 }, //ajax
	 columns: [
		{ data: "no" }, //NO.0
		{ data: "productname", width: "20%" },//상품명1
		{ data: "productcd" },// 제품코드2
		{ data: "maker", width: "15%" },//제조사3
		{ data: "spec" },//규격(spec)4
		{ data: "size" },//용량(size)5
		{ data: "category" },//카테고리 -> 없애기6
//		{ data: "mxprice" },//최고가7
//		{ data: "miprice" },//최저가8
//		{ data: "maprice" },//최다가9
		{ data: "total" },//당일매출7
		{ data: "total2" },//전일매출8
		{ data: "total3" },//d-30매출9
		{ data: "ranking" },//d-30순위10
		{ data: "productid" }// 제품 아이디11
	 ],
	 columnDefs: [
		 { targets: [1], render: function(data, type, row) {
			 if(data.length > 20) { var short = data.substr(0,19)+"..."; } 
			 else { var short = data; }
			 return '<div class="productname"><div class="productname-hover"><span class="productname-line">'
			 +data+'</span><span class="tri"></span></div>'+short+'</div>';
		 } },
		 { targets: [3], render: function(data, type, row) {
			 if(data.length > 16) { var short = data.substr(0,15)+"..."; }  
			 else { var short = data; }
			 return '<div class="productname"><div class="productname-hover"><span class="productname-line">'
			 +data+'</span><span class="tri"></span></div>'+short+'</div>';
		 } },
		 { targets: [4,5,6], render: function(data, type, row) {
			 if(data == null || data == '') { var data = '-'; return data; }
			 else { return data; }
		 } },
		 { targets: [7,8,9], render: function(data) {
			 return numWithCommas(data)+"원";
		 } }
//		 { targets: [14], render: function(data, type, row) {
//			if(data == null|| data == '') { var data = '-'; return data; }
//			else { return data; }
//		 } }
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
	 order: [ [ 0, "asc" ] ],
	 lengthMenu: [ 15, 50, 100, 200 ],
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
	 	}],//buttons
	});//table
	$.fn.DataTable.ext.pager.numbers_length = 10;

//	$('#table tbody').on('click', function () {
//		$(".modal-wrap1").css("display", "flex");
//	});

	$(".pop-close1").click(function(){
		$(".modal-wrap1").css({"display": "none"});
		
		// 마스터 상품 상세내용 초기화
		$(".sproductname").val(""); $(".sproductcd").val(""); $(".smaker").val(""); 
		$(".sspec").val(); $(".sunit").val(""); $(".ssize").val(""); $("#sremarks").val("");
		
		// 카테고리 초기화
		category1();
		$(".cate_list2").html("");
		$(".cate_list3").html("");// 카테고리 리스트 초기화
		
		$(".selcate1").text("");
		$(".selcate2").text("");
		$(".selcate3").text("");// 선택된 카테고리 초기화
		
		$(".category").val("");// 입력한 카테고리 초기화
		$(".scategory").val("");// 상세보기 카테고리도 초기화
		$("#category3cd").val("");// 선택한 카테고리의 hidden input값 초기화
		
		$("#catesv").css('background-color', 'grey');// 선택버튼 색갈 회색으로 변경
		
		// 그룹상품 리스트 초기화
		$(".ga_tbody").html("");
		
		// 매출집계 초기화
		$("#sprodtot").val(""); $("#sprodcnt").val(""); $("#sprodavg").val(""); $("#sprodavg2").val("");
		
		// 매출내역 초기화
		$(".ph_tbody").html("");
	});

//	$('#table_paginate').appendTo('.page-wrap');
	$('#table_length').prependTo('.length-wrap');
	$('.dataTables_info').prependTo('#table_length');
	$('.btnexcel').appendTo('.bf-wrap');
}//데이터 테이블 함수

//카테고리 이름들 가져오기
function cateNames(category3cd) {
	console.log("cateNames 함수에 들어옴");
	console.log("선택된 3차 카테고리 ", category3cd);
	
	var compcd = $("#compcd").val();
	var productid = $("#productid").val();
	console.log(productid);
	
	$.ajax({
		url: "scate_names.do",
		data: {
			"compcd":compcd,
			"productid":productid
		},
		success: function(result) {
			console.log(result);
			
			var cate1 = result.cate1;
			var cate2 = result.cate2;
			var cate3 = result.cate3;
			
			$(".scategory").val(cate1+" >  "+cate2+" >  "+cate3);// 이름으로 집어넣기
			$(".selcate1").text(cate1+" >  ");// 카테고리 선택 모달에 
			$(".selcate2").text(cate2+" >  ");// 선택된 카테고리 이름
			$(".selcate3").text(cate3);// 집어넣어 주깅
			
			category2(result.category1cd);
			category3(result.category2cd);
			
			var cnt1 = $(".cate_list1 tr").length;
			var cnt2 = $(".cate_list2 tr").length;
			var cnt3 = $(".cate_list3 tr").length;
			
			for(var i = 0; i < cnt1; i++) {// 1차 카테고리 선택
				var category1cd = $(".cate_list1 tr").eq(i).children().next().text();
				if(category1cd == result.category1cd) {
					$(".cate_list1 tr").eq(i).addClass("selected");
				}//if
			}//for
			for(var j = 0; j < cnt2; j++) {// 2차 카테고리 선택
				var category2cd = $(".cate_list2 tr").eq(j).children().next().text();
				if(category2cd == result.category2cd) {
					$(".cate_list2 tr").eq(j).addClass("selected");
				}//if
			}//for
			for(var i = 0; i < cnt3; i++) {// 3차 카테고리 선택
				var category3cd = $(".cate_list3 tr").eq(i).children().next().text();
				if(category3cd == result.category3cd) {
					$(".cate_list3 tr").eq(i).addClass("selected");
				}//if
			}//for
			
			$("#catesv").css('background-color', '#1e40af');// 선택버튼 색갈 파랑색으로 변경
			$("#category3cd").val(result.category3cd);
		},//success
		error: function() { alert("오류"); }
	});//ajax
}// 카테고리 이름들 가져오기


 /* modal */
 $(".pop-link2").click(function(){
	$(".modal-wrap2").css({"display": "flex"});
	$("#whichclick").val("modal");
});
$(".pop-close2").click(function(){
	$(".modal-wrap2").css({"display": "none"});
	category1();
	$(".cate_list2").html("");
	$(".cate_list3").html("");// 카테고리 리스트 초기화
	
	$(".selcate1").text("");
	$(".selcate2").text("");
	$(".selcate3").text("");// 선택된 카테고리 초기화
	
	$(".category").val("");// 입력한 카테고리 초기화
	$(".scategory").val("");// 상세보기 카테고리도 초기화
	$("#category3cd").val("");// 선택한 카테고리의 hidden input값 초기화
	
	$("#catesv").css('background-color', 'grey');// 선택버튼 색갈 회색으로 변경
});

// 상단집계 조회
function sprod_top(compcd, sd1, sd2) {
	$.ajax({
		url: "sprod_top.do",
		data: { "compcd":compcd },
		success: function(result) {
			console.log("상단집계", result);
			
			// 건수 조회
			$("#totalcnt1").html(numWithCommas(result.totalcnt1)+"건"); // 당월 전체건수
			$("#etccnt1").html(numWithCommas(result.etccnt1)+"건"); // 당월 조제건수
			$("#otccnt1").html(numWithCommas(result.otccnt1)+"건"); // 당월 일반건수
			$("#totalcnt2").html(numWithCommas(result.totalcnt2)+"건"); // 금주 전체건수
			$("#etccnt2").html(numWithCommas(result.etccnt2)+"건"); // 금주 조제건수
			$("#otccnt2").html(numWithCommas(result.otccnt2)+"건"); // 금주 일반건수
			$("#totalcnt3").html(numWithCommas(result.totalcnt3)+"건"); // 당일 전체건수
			$("#etccnt3").html(numWithCommas(result.etccnt3)+"건"); // 당일 조제건수
			$("#otccnt3").html(numWithCommas(result.otccnt3)+"건"); // 당일 일반건수
			
			// 매출 조회
			$("#totalamt1").html(numWithCommas(result.totalamt1)+"원"); // 당월 전체매출
			$("#totalamt2").html(numWithCommas(result.totalamt2)+"원"); // 금주 전체매출
			$("#totalamt3").html(numWithCommas(result.totalamt3)+"원"); // 당일 전체매출
			$("#etcamt1").html('조제 매출<p class="square-price"><span class="square-target" data-target="'+
					result.etcamt1 +'" data-speed="1" data-gap="1660"><span>'+numWithCommas(result.etcamt1)+'</span>원</span></p>');// 당월 조제매출
			$("#etcamt2").html('조제 매출<p class="square-price"><span class="square-target" data-target="'+
					result.etcamt2 +'" data-speed="1" data-gap="1660"><span>'+numWithCommas(result.etcamt2)+'</span>원</span></p>');// 금주 조제매출
			$("#etcamt3").html('조제 매출<p class="square-price"><span class="square-target" data-target="'+
					result.etcamt3 +'" data-speed="1" data-gap="1660"><span>'+numWithCommas(result.etcamt3)+'</span>원</span></p>');// 당일 조제매출
			$("#otcamt1").html('일반 매출<p class="square-price"><span class="square-target" data-target="'+
					result.otcamt1 +'" data-speed="1" data-gap="1660"><span>'+numWithCommas(result.otcamt1)+'</span>원</span></p>');// 당월 판매매출
			$("#otcamt2").html('일반 매출<p class="square-price"><span class="square-target" data-target="'+
					result.otcamt2 +'" data-speed="1" data-gap="1660"><span>'+numWithCommas(result.otcamt2)+'</span>원</span></p>');// 금주 판매매출
			$("#otcamt3").html('일반 매출<p class="square-price"><span class="square-target" data-target="'+
					result.otcamt3 +'" data-speed="1" data-gap="1660"><span>'+numWithCommas(result.otcamt3)+'</span>원</span></p>');// 당일 판매매출
			
			square_target();
		},//success
		error: function() { alert("오류"); }
	});//ajax
}// 상단집계 조회

// 상품 등록
$('.pop2 .btn-save').click(function() {
	if($(".rproductname").val().length==0)
		swal({title: "상품명을 입력하세요.", button: "확인"})
		.then(function() {swal.close(); $(".rproductname").focus(); return false;
	})
	else if($(".rproductcd").val().length==0)
		swal({title: "대표코드를 입력하세요.", button: "확인"})
		.then(function() {swal.close(); $(".rproductcd").focus(); return false;
	})
	
	else {
		swal({
			title: '상품을 등록하시겠습니까?',
			icon: 'info',
			buttons: true,
			imfoMode: true,
			buttons: ["취소", "확인"]
		}).then(function(willDelete) {
			var rproductname = $('.rproductname').val(); //상품명
			var rproductcd = $('.rproductcd').val(); // 대표코드(상품id, 바코드)
			var rmaker = $('.rmaker').val(); // 제조사
			var rspec = $('.rspec').val(); // 규격
			var runit = $('.runit').val(); // 단위
			var rsize = $('.rsize').val(); // 용량(size)
			var rcategory = $('#category3cd').val();
			var rremarks = $('#regi_remarks').val();
			
			var chaincode = $('#chaincode').val(); // 체인코드
			var compcd = $('#compcd').val(); // 가맹점코드
			var regcd = $('#regcd').val(); // 등록자 아이디
			
			if(willDelete)	{
				$.ajax({
					url: "sprod_insert.do",
					type: "post",
					data: {
						"productname":rproductname,
						"productcd":rproductcd,
						"maker":rmaker,
						"spec":rspec,
						"unit":runit,
						"size":rsize,
						"category3cd":rcategory,
						"remarks":rremarks,
						"chaincode":chaincode,
						"regcd":regcd,
						"compcd":compcd
					},
					success: function(result) {
						console.log(result);
						
						if(result == 1) {
							$('.pop2 input, .pop2 textarea').val("").prop('checked', false);
							$(".modal-wrap2").css({"display": "none"});
							
							swal({
								title: '등록이 완료되었습니다.',
								type: 'success',
								icon: "success",
								button: "확인"
							}).then(function(willDelete) {
								location.href = "/sproduct.do?title=상품관리&name=상품관리";
							});
						}
						else if(result == 3) {
							swal({text: "중복된 대표코드가 존재합니다.\n 대표코드를 다시 입력해주세요.", button: "확인"})
							.then(function() {swal.close(); $('.rproductcd').val('');
							$('.rproductcd').focus(); return; });
						}
//						table.clear().draw();
					},
					error: function(jqXHR, textStatus, errorThrown) {
						 alert("오류");
						 console.log(jqXHR);
						 console.log(textStatus);
						 console.log(errorThrown);
					 }//error
				});//ajax
			}//if(willDelete)
		})//then
	}//else
}); // 상품 등록

// 그룹상품 추가 리스트
function groupAddList(compcd, productid) {
	$.ajax({
		url: "sga_list2.do",
		data: {
			"compcd":compcd,
			"productid":productid
		},
		success: function(result) {
			console.log('가맹점 상품관리 그룹상품 리스트', result);
			
			let html = "";
			const count = result.data.length;
			
			if(count > 0) {
				for (var i = 0; i < count; i++) {
					if(result.data[i].spec == null) { result.data[i].spec = ''; }
					if(result.data[i].unit == null) { result.data[i].unit = ''; }
					if(result.data[i].size == null) { result.data[i].size = ''; }
					html += "<tr>"
					html += 	"<td><div class='custom-control custom-checkbox'><input id='magicBtn"+i+"' type='checkbox'"
                    html +=     	"class='custom-control-input' name='checkbox'><label class='custom-control-label'"
                    html +=          "for='magicBtn"+i+"'></label></div></td>"
					html += 	"<td><input type='text' class='form-control' name='ga_prodcd' value='" + result.data[i].productcd + "' id='ga_prodcd" + i + "' readonly='true'></td>"
					html += 	"<td><input type='text' class='form-control' name='ga_barcd' value='" + result.data[i].barcode + "' id='ga_barcd" + i + "' readonly='true'></td>"
					html += 	"<td><input type='text' class='form-control' name='ga_prodnm' value='" + result.data[i].productname + "' id='ga_prodnm" + i + "'></td>"
					html += 	"<td><input type='text' class='form-control' name='ga_maker' value='" + result.data[i].maker + "' id='ga_maker" + i + "'></td>"
					html += 	"<td><input type='text' class='form-control' name='ga_spec' value='" + result.data[i].spec + "' id='ga_spec" + i + "'></td>"
					html += 	"<td><input type='text' class='form-control' name='ga_unit' value='" + result.data[i].unit + "' id='ga_unit" + i + "'></td>"
					html += 	"<td><input type='text' class='form-control' name='ga_size' value='" + result.data[i].size + "' id='ga_size" + i + "'></td>"
					html += 	"<td><input type='text' class='form-control' name='ga_pakunit' value='" + result.data[i].packingunit + "' id='ga_pakunit" + i + "'></td>"
					if(result.data[i].price == undefined) {var price = '';} else {var price = result.data[i].price;}
					html += 	"<td><input type='text' class='form-control' name='ga_price' value='" + price + "' id='ga_price" + i + "'></td>"
					if(result.data[i].discount == undefined) {var discount = '';} else {var discount = result.data[i].discount;}
					html += 	"<td><input type='text' class='form-control' name='ga_discount' value='" + discount + "' id='ga_discount" + i + "'></td>"
					if(result.data[i].salesprice == undefined) {var salesprice = '';} else {var salesprice = result.data[i].salesprice;}
					html += 	"<td><input type='text' class='form-control' name='ga_salesprice' value='" + salesprice + "' id='ga_salesprice" + i + "'></td>"
					html += 	"<td style='display:none;'><input type='text' class='form-control' name='ga_prodsid' value='" + result.data[i].productsid + "' id='ga_prodsid" + i + "'></td>"
					html += 	"<td><input type='text' class='form-control' name='ga_maprice' value='" + numWithCommas(result.data[i].maprice) + "' id='ga_maprice" + i + "' readonly='true'></td>"
					html += 	"<td><input type='text' class='form-control' name='ga_miprice' value='" + numWithCommas(result.data[i].miprice) + "' id='ga_miprice" + i + "' readonly='true'></td>"
					html += 	"<td><input type='text' class='form-control' name='ga_mxprice' value='" + numWithCommas(result.data[i].mxprice) + "' id='ga_mxprice" + i + "' readonly='true'></td>"
					html +=	"</tr>"
				}//for
			}//if
			$('.ga_tbody').html(html);
//			$(".modal-wrap1").css("display", "flex");//tr 클릭 했을 때, 그룹상품 리스트 뿌리고 modal 띄우기
		},
		error: function() { alert("오류"); }
	});//ajax
}// 그룹상품 추가 리스트

// 선택상품이관
$('#selMove').click(function() {
	var count = $('.ga_tbody').children('tr').length;// 그룹상품 원래 리스트 개수
	var cnt = $('[name=checkbox]:checked').length; // 체크된 체크박수 개수
	
	var moveProd = [];
	var prod = {};
	
	if(cnt <= 0) {
		swal({title: "이관할 상품을 선택하세요.", button: "확인"})
		.then(function() {swal.close(); return; });
	}//if
	else {
		$(".modal-wrap3").css({"display": "flex"});
		for(var i = 0; i < count; i++) {
			if($('#magicBtn'+i+'').is(':checked')) {
				var productcd = $('#ga_prodcd'+i+'').val();
//				var productid = $('#ga_prodsid'+i+'').val();
				var productname = $('#ga_prodnm'+i+'').val();
				var maker = $('#ga_maker'+i+'').val();
				var spec = $('#ga_spec'+i+'').val();
				var unit = $('#ga_unit'+i+'').val();
				var size = $('#ga_size'+i+'').val();
				var packingunit = $('#ga_pakunit'+i+'').val();
				
				prod = {};
				prod.productcd = productcd;
				prod.productid = productid;
				prod.productname = productname;
				prod.maker = maker;
				prod.spec = spec;
				prod.unit = unit;
				prod.size = size;
				prod.packingunit = packingunit;
				
				moveProd.push(prod);
			}//if
		}//for
		console.log(moveProd);
		prodMove(moveProd);//이관상품 리스트
	}//else
});//선택상품 이관버튼 클릭

// 그룹상품추가 전체선택
$('#magicBtn').click(function() {
	var checked = $('#magicBtn').is(':checked');
	
	if(checked) {
		$('.ga_tbody').find('input[type=checkbox]').prop('checked', true);
	}
	else {
		$('.ga_tbody').find('input[type=checkbox]').prop('checked', false);
	}
});// 그룹상품추가 전체선택

// 선택상품 리스트
function prodMove(arr) {
	let html = 	"";
	var count = arr.length;
	
	for(var i = 0; i < count ;i++) {
		var productname = arr[i].productname;
		if(productname.length > 13) {
			var productname = productname.substr(0,13)+"..";
		}
		var maker = arr[i].maker;
		if(maker.length > 10) {
			var maker = maker.substr(0,10)+"..";
		}
		html += "<tr>"
		html += 	"<td>"+arr[i].productcd+"</td>"
		html += 	"<td style='text-align: left;'>"+productname+"</td>"
		html += 	"<td>"+maker+"</td>"
		html += 	"<td>"+arr[i].spec+"</td>"
		html += 	"<td>"+arr[i].unit+"</td>"
		html += 	"<td>"+arr[i].size+"</td>"
		html += 	"<td>"+arr[i].packingunit+"</td>"
		html += 	"<td><i class='fa-solid fa-xmark' name='xmark'></i></td>"
		html += "</tr>"
	}//for
	$('.prod_move').append(html);
}//prodMove

//xmark 클릭하면 없애기
$(document).on('click', '[name=xmark]', function(){
//	console.log($(this).parent().parent().children("td:eq(0)").text());
	$(this).parent().parent().remove();
});// xmark 클릭하면 없애기

function prod_list(compcd, search3, searchInput2) {
	if(searchInput2.length < 3) {
		swal({title: "3자리 이상 입력하세요.", button: "확인"})
		.then(function() {
			swal.close(); 
			$('[name=searchInput2]').focus();
			return false;
		})
	} else {
		$.ajax({
			url: "sprod_list2.do",
			data: {
				"compcd":compcd,
				"search3":search3,
				"searchInput2":searchInput2
			},
			success: function(result) {
				console.log('상품이관 검색 리스트',result);
				
				let html = "";
				const count = result.data.length;
				
				if(count == 0) {
					swal({title: "데이터가 없습니다.", button: "확인"})
					.then(function() {
						swal.close(); 
						$('[name=searchInput2]').val('');
						return false;
					})
				}
				
				if(count > 0) {
					for(var i = 0; i < count; i++) {
						var productname = result.data[i].productname;// 상품명
						if(productname.length > 13) { var productname = productname.substr(0,13)+".."; }
						
						var maker = result.data[i].maker;// 제조사
						if(maker.length > 8) { var maker = maker.substr(0,8)+".."; }
						
						var spec = result.data[i].spec;//규격
						var unit = result.data[i].unit;//단위
						var size = result.data[i].size;//용량
						if(spec == null || spec == '') { var spec = '-'; }
						if(unit == null || unit == '') { var unit = '-'; }
						
						html += "<tr>"
						html +=		"<td>"+result.data[i].productcd+"</td>"
						html +=		"<td>"+productname+"</td>"
						html +=		"<td>"+result.data[i].maker+"</td>"
						html +=		"<td>"+spec+"</td>"
						html +=		"<td>"+unit+"</td>"
						html +=		"<td>"+result.data[i].size+"</td>"
						html +=		"<td style='display:none;'>"+result.data[i].productid+"</td>"
						html += "</tr>"
					}//for
				}//if
				$('.prod_list').html(html);	
			},
			error: function() { alert("오류"); }
		});//ajax
	}//else
}//prod_list

// 이관상품 선택한 상품으로 이관하기
$(document).on('click', '#moveBtn', function() {
	var compcd = $('#compcd').val();// 가맹점 코드
	var count = $('.prod_move').children('tr').length;//tr의 길이
	var ori = $('.ga_tbody').children('tr').length;// 그룹상품 원래 리스트 개수
	var arr = [];//이관할 제품코드 담을 배열
	
	for(var i = 0; i < count; i++) {
		var prodcd = $('.prod_move').children('tr:eq('+i+')').children('td:eq(0)').text();
		arr.push(prodcd);
	}
	console.log(arr);
	
	var prodid = $('.prod_list').children('tr.selected').children('td:eq(6)').text();//이관대상
	var f_prodid = $('#f_prodid').val();// 이관선택상품
	console.log(prodid);
	console.log(f_prodid);
	
	if(prodid == ''|| prodid == null) {
		swal({title: "이관 대상을 선택하세요.", button: "확인"})
		.then(function() {
			swal.close(); 
			$('[name=searchInput2]').focus();
			return false;
		})
	} else {
		if(count == ori) { var prodAll = 'Y'; } 
		else { var prodAll = 'N'; }
		
		console.log(prodAll);
		$.ajax({
			url: "sprod_move.do",
			data: {
				"compcd":compcd,
				"productid":prodid, // 이관할 제품을 받을 제품 아이디
				"productcd":JSON.stringify(arr),// 이관 될 제품 코드
				"f_prodid":f_prodid,
				"prodAll":prodAll
			},
			success: function(result) {
				console.log("이관완료 개수",result);
				swal({
					title: '이관이 완료되었습니다.',
					type: 'success',
					icon: "success",
					button: "확인"
				}).then(function(willDelete) {
					location.href="/sproduct.do?title=상품관리&name=상품관리"
				});//저장완료 swal
			},
			error: function() { alert("오류"); }
		});//move ajax

//		if(count == ori) {
//			console.log("tr개수 같음 if문 들어옴");
//			$.ajax({
//				url: "sprod_stock.do",
//				data: {
//					"compcd":compcd,
//					"productid":prodid,
//					"f_prodid":f_prodid,
//					
//				},
//				success: function(result) {
//					console.log("재고 업데이트 완료", result);
//				},
//				error: function() { alert("오류") }
//			});//stock ajax
//		}//if(count == ori)
	}
});//이관상품 선택한 상품으로 이관하기

// 그룹상품 추가 행 추가하기
function makeGrpList(i) {
	let html = "";
	
	html += "<tr>"
	html += 	"<td><div class='custom-control custom-checkbox'><input id='magicBtn2' type='checkbox'"
    html +=     	"class='custom-control-input'><label class='custom-control-label'"
    html +=          "for='magicBtn2'></label></div></td>"
	html += 	"<td><input type='text' class='form-control' name='ga_prodcd' value='' id='ga_prodcd" + i + "'></td>"
	html += 	"<td><input type='text' class='form-control' name='ga_barcd' value='' id='ga_barcd" + i + "' onchange='gaPrice(this)'></td>"
	html += 	"<td><input type='text' class='form-control' name='ga_prodnm' value='' id='ga_prodnm" + i + "'></td>"
	html += 	"<td><input type='text' class='form-control' name='ga_maker' value='' id='ga_maker" + i + "'></td>"
	html += 	"<td><input type='text' class='form-control' name='ga_spec' value='' id='ga_spec" + i + "'></td>"
	html += 	"<td><input type='text' class='form-control' name='ga_unit' value='' id='ga_unit" + i + "'></td>"
	html += 	"<td><input type='text' class='form-control' name='ga_size' value='' id='ga_size" + i + "'></td>"
	html += 	"<td><input type='text' class='form-control' name='ga_pakunit' value='' id='ga_pakunit" + i + "'></td>"
	html += 	"<td><input type='text' class='form-control' name='ga_price' value='' id='ga_price" + i + "'></td>"
	html += 	"<td><input type='text' class='form-control' name='ga_discount' value='' id='ga_discount" + i + "'></td>"
	html += 	"<td><input type='text' class='form-control' name='ga_salesprice' value='' id='ga_salesprice" + i + "'></td>"
	html += 	"<td style='display:none;'><input type='text' class='form-control' name='ga_prodsid' value='' id='ga_prodsid" + i + "'></td>"
	html += 	"<td><input type='text' class='form-control' name='ga_maprice' value='' id='ga_maprice" + i + "' readonly='true'></td>"
	html += 	"<td><input type='text' class='form-control' name='ga_miprice' value='' id='ga_miprice" + i + "' readonly='true'></td>"
	html += 	"<td><input type='text' class='form-control' name='ga_mxprice' value='' id='ga_mxprice" + i + "' readonly='true'></td>"
	html +=	"</tr>"
		
	$('.ga_tbody').prepend(html);
}

// 그룹상품 추가버튼 event
$(document).on("click","#addBtn", function(){
	var i = $('.ga_tbody tr').length;
	var compcd = $('#compcd').val();
	var productid = $('#productid').val();
	
	$.ajax({
		url: "sga_list.do",
		data: { 
			"compcd":compcd,
			"productid":productid
		},
		success: function(result) {
			var ori_i = result.data.length;
			var ni = i-1;
			
			if(i == ori_i) {
				makeGrpList(i);//새로운 행 추가
				$('#ga_prodcd'+i+'').focus();
				return;
			} if(i >= ori_i+1) { // 추가를 다시 눌러도 다시 추가 되지 않도록 하기
				var ni = i-1;
				$('#ga_prodcd'+ni+'').focus();
				return;
			}
		}//success
	});//ajax
}); // popup 그룹상품 추가버튼 event

// 그룹상품 최다, 최소, 최고
function gaPrice(barcd) {
	console.log(barcd);
	console.log($('.ga_tbody tr').length);
	var i = $('.ga_tbody tr').length-1;
	var barcode = $('#ga_barcd'+i+'').val();
	$('#ga_prodnm'+i+'').focus();
	
	if($('#ga_prodnm'+i+'').focus()) {
		$.ajax({
			url: "sgaPrice.do",
			data: { "barcode":barcode },
			success: function(result) {
				console.log(result);
				var data = result.data[0];
				
				if(data != null) {
					$('#ga_maprice'+i+'').val(numWithCommas(data.maprice));
					$('#ga_miprice'+i+'').val(numWithCommas(data.miprice));
					$('#ga_mxprice'+i+'').val(numWithCommas(data.mxprice));
				} else {
					$('#ga_maprice'+i+'').val(0);
					$('#ga_miprice'+i+'').val(0);
					$('#ga_mxprice'+i+'').val(0);
				}
			},
			error: function() { alert("오류"); }
		});
	}//if
}// 그룹상품 최다, 최소, 최고

// 상세정보 판매집계
function sprodTally(compcd, productid) {
	$.ajax({
		url: "sprodTally.do",
		data: {
			"compcd":compcd,
			"productid":productid
		},
		success: function(result) {
			console.log(result);
			
			const count = result.length;
			if(count == 0) {
				$('#sprodtot').val('0원');
				$('#sprodcnt').val('0건');
				$('#sprodavg').val('0원');
				$('#sprodavg2').val('0건');
			} else {
				$('#sprodtot').val(numWithCommas(result.total)+'원');
				$('#sprodcnt').val(numWithCommas(result.cnt)+'건');
				$('#sprodavg').val(numWithCommas(result.avg)+'원');
				$('#sprodavg2').val(numCommasdeci(result.avg2)+'건');
			}
		},//success
		error: function() { alert("오류"); }
	});//ajax
}// 상세정보 판매집계

// 상세정보 판매이력
function sprodHist(compcd, productid) {
	var popDate1 = $('#popDate1').val();
	var popDate2 = $('#popDate2').val();
	
	var sd1 = popDate1.replace(/-/g,"");
	var sd2 = popDate2.replace(/-/g,"");
	
	$.ajax({
		url: "sprodHist.do",
		type: "post",
		data: {
			"compcd":compcd,
			"productid":productid,
			"popDate1":sd1,
			"popDate2":sd2
		},
		success: function(result) {
			console.log('판매이력 리스트', result);
			
			let html = "";
			const count = result.data.length;
			
			if(count > 0) {
				for(var i = 0; i < count; i++) {
					html += "<tr>"
					html += 	"<td>" + result.data[i].yymmdd + "</td>"
					html += 	"<td>" + numWithCommas(result.data[i].packingunit) + "</td>"
					html += 	"<td>" + numWithCommas(result.data[i].total) + "원</td>"
					html += 	"<td>" + numWithCommas(result.data[i].cnt) + "건</td>"
					html += 	"<td>" + numWithCommas(result.data[i].scnt) + "</td>"
					html += 	"<td>" + numWithCommas(result.data[i].pcnt) + "명</td>"
					html += "</tr>"
				}//for
			}//if
			$(".ph_tbody").html(html);
		},
		error:function(jqXHR, textStatus, errorThrown) {
			alert("오류");
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}// error
	});//ajax
}// pop판매이력

// 판매이력 검색버튼
$('.pop-search').click(function() {
	var compcd = $('#compcd').val();
	var productid = $('#productid').val();
	sprodHist(compcd, productid);
});//판매이력 검색 버튼

//popup 상세보기 저장
$('#popsv_btn').on('click', function() {
	var i = $('.ga_tbody tr').length;
	var compcd = $('#compcd').val();
	var productid = $('#productid').val();
	
	if($('.sproductname').val() == '') {
		swal({title: "상품명을 입력하세요.", button: "확인"})
		.then(function() {swal.close(); $('.sproductname').focus(); return; });
	} else if($('.sproductcd').val() == '') {
		swal({title: "대표코드를 입력하세요.", button: "확인"})
		.then(function() {swal.close(); $('.sproductcd').focus(); return; });
	} else if($('.smaker').val() == '') {
		swal({title: "제조사를 입력하세요.", button: "확인"})
		.then(function() {swal.close(); $('.smaker').focus(); return; });
	}
	
	else {
		$.ajax({
			url: "sga_list.do",
			data: {
				"compcd":compcd,
				"productid":productid
			},
			success: function(result) {
				var ori_i = result.data.length;
				var ni = i-1;

				if(i >= ori_i+1) {
					if($('#ga_prodcd'+ni+'').val()=='') {
						swal({title: "그룹상품 제품코드를 입력하세요.", button: "확인"})
						.then(function() {swal.close(); $('#ga_prodcd'+ni+'').focus(); return; });
					} else if($('#ga_barcd'+ni+'').val()=='') {
						swal({title: "그룹상품 바코드를 입력하세요.", button: "확인"})
						.then(function() {swal.close(); $('#ga_barcd'+ni+'').focus(); return; });
					} else if($('#ga_prodnm'+ni+'').val()=='') {
						swal({title: "그룹상품 제품이름을 입력하세요.", button: "확인"})
						.then(function() {swal.close(); $('#ga_prodnm'+ni+'').focus(); return; });
					} else if($('#ga_pakunit'+ni+'').val()=='') {
						swal({title: "그룹상품 포장수량을 입력하세요.", button: "확인"})
						.then(function() {swal.close(); $('#ga_pakunit'+ni+'').focus(); return; });
					} else if(Number($('#ga_pakunit'+ni+'').val()) < 1) {
						swal({title: "그룹상품 포장수량을 1이상 입력하세요.", button: "확인"})
						.then(function() {swal.close(); $('#ga_pakunit'+ni+'').focus(); return; });
					} else {
						sga_updateA();
					}//else
				} // 추가한 행이 비어있을 경우 유효성 검사
				else if(i == 0){
					swal({title: "그룹상품을 추가해주세요.", button: "확인"})
					.then(function() {swal.close(); $('#addBtn').focus(); return; });
				}
				else if(i == ori_i) {
					for(var j = 0; j < i; j++) {
						console.log('j',j);
						if($('#ga_prodnm'+j+'').val()=='') {
							swal({title: "그룹상품 제품이름을 입력하세요.", button: "확인"})
							.then(function() {swal.close(); $('#ga_prodnm'+j+'').focus(); return; });
							break;
						} else if($('#ga_pakunit'+j+'').val()=='') {
							swal({title: "그룹상품 포장수량을 입력하세요.", button: "확인"})
							.then(function() {swal.close(); $('#ga_pakunit'+j+'').focus(); return; });
							break;
						} else if(Number($('#ga_pakunit'+j+'').val()) < 1) {
							swal({title: "그룹상품 포장수량을 1이상 입력하세요.", button: "확인"})
							.then(function() {swal.close(); $('#ga_pakunit'+j+'').focus(); return; });
							break;
						} else {
							sga_updateA();
						}//else
					}//for
				}//else if
			}//success
		});//ajax
	}//else
});// 상세정보 저장하기

//상세보기 저장
function sga_updateA() {
	var detail_prod = $('form[name=detail_f]').serialize();
	swal({
		title: '저장하시겠습니까?',
		icon: "info",
		buttons: true,
		imfoMode: true,
		buttons: ["취소", "확인"]
	}).then(function(willDelete) {
		if(willDelete) {
			$.ajax({
				url: "detail_sprod.do",
				dataType: "json",
				data: detail_prod,
				success: function(result) {
					console.log('상세보기 저장', result);
					$(".modal-wrap1").css({"display": "none"});
					swal({
						title: '저장되었습니다.',
						type: 'success',
						icon: "success",
						button: "확인"
					}).then(function(willDelete) {
						location.href="/sproduct.do?title=상품관리&name=상품관리"
					});//저장완료 swal
				}//success
			});//저장 ajax
		}//if(willDelete)
	});// swal then
}

$(".pop-close3").click(function(){
   $(".modal-wrap3").css({"display": "none"});
   $('.prod_move').children('tr').remove();
   $('.ga_tbody').find('input[type=checkbox]').prop('checked', false);
   $('#magicBtn').prop('checked', false);
});

$('.sel-table tbody').on( 'click', 'tr td', function () {
   $('.sel-table tbody tr').removeClass('selected');
   $(this).parent('tr').addClass('selected');
});

//천단위 콤마 찍기
function numWithCommas(x) {
	return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//천단위 콤마 찍기( 소수점 포함 )
function numCommasdeci(x) {
	var parts = String(x).split("."); 
	console.log(parts[0]);
	console.log(parts[1]);
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : ""); 
}

function enterkey() {
	if(window.event.keyCode == 13) {
		$('#searchBtn').click();
	}
}// 엔터키 발생 이벤트





//카테고리 창 열기
$(".pop-link4").click(function() { 
	$(".modal-wrap4").css({"display": "flex"}); 
});
// 카테고리 창 닫기
$(".pop-close4").click(function() {
	category1();
	$(".cate_list2").html("");
	$(".cate_list3").html("");// 카테고리 리스트 초기화
	
	$(".selcate1").text("");
	$(".selcate2").text("");
	$(".selcate3").text("");// 선택된 카테고리 초기화
	
	$(".category").val("");// 입력한 카테고리 초기화
	$(".scategory").val("");// 상세보기 카테고리도 초기화
	$("#category3cd").val("");// 선택한 카테고리의 hidden input값 초기화
	$(".modal-wrap4").css({"display": "none"});
	
	$("#catesv").css('background-color', 'grey');// 선택버튼 색갈 회색으로 변경
});
//
///* 카테고리 템플릿 선택 */
//$('.category-wrap').click(function () {
//   $(this).find('.category-cont').stop().slideToggle('0').each(function(){$('.category-cont').not(this).stop().slideUp('0');});
//   $(this).find('.fa-solid').toggleClass('active');
//   $(this).siblings().find('.active').each(function () {$(this).removeClass('active');});
//   $('.pop3 input[type="checkbox"][name="use"]').prop('checked',false);
//   $(this).find('input[type="checkbox"][name="use"]').prop('checked',true);
//});
//
//$(".category-wrap:nth-child(1) .category").trigger("click");
//
//$(".category-cont").click(function (e) {
//   e.stopPropagation();
//});
//
///* 체크박스 하나만 선택 */
//$('.pop3 input[type="checkbox"][name="use"]').click(function(){
//   $('.pop3 input[type="checkbox"][name="use"]').prop('checked',false);
//   $(this).prop('checked',true);
//   $(this).parents('.category-wrap').find('.category-cont').stop().slideToggle('0').each(function(){$('.category-cont').not(this).stop().slideUp('0');});
//   $(this).parents('.category-wrap').find('.fa-solid').toggleClass('active');
//   $(this).parents('.category-wrap').siblings().find('.active').each(function () {$(this).removeClass('active');});
//});

/* select */
$('.table1 tbody').on('click', 'tr td', function () {
	var category1cd = $(this).next().text();
	var name = $(this).children().children().eq(0).html();// 카테고리이름과 연결된 개수 함께 가져와서
	var categoryname = name.split("<p>");// p태그 기준으로 자르면 카테고리이름만 남음
	$(".selcate1").html(categoryname[0]+" >  ");// 선택된 카테고리에 붙여넣기
	$(".selcate2").html("");// 2차는 비우기
	$(".selcate3").html("");// 3차는 비우기
	
	$('.table tbody tr').removeClass('selected');
	$(this).parent('tr').addClass('selected');
	category2(category1cd);
	
	$("#catesv").css('background-color', 'grey');
	$(".table3 tbody tr").hide();
});

$('.table2 tbody').on('click', 'tr td', function () {
	var category2cd = $(this).next().text();
	var name = $(this).children().children().eq(0).html();// 카테고리이름과 연결된 개수 함께 가져와서
	var categoryname = name.split("<p>");// p태그 기준으로 자르면 카테고리이름만 남음
	$(".selcate2").html(categoryname[0]+" >  ");// 선택된 카테고리에 붙여넣기
	$(".selcate3").html("");// 3차는 비우기
	
    $('.table2 tbody tr').removeClass('selected');
    $('.table3 tbody tr').removeClass('selected');
    $(this).parent('tr').addClass('selected');
   
    $("#catesv").css('background-color', 'grey');
    category3(category2cd);
});

$('.table3 tbody').on('click', 'tr td', function () {
	var name = $(this).children().children().eq(0).html();// 카테고리이름과 연결된 개수 함께 가져와서
	var categoryname = name.split("<p>");// p태그 기준으로 자르면 카테고리이름만 남음
	$(".selcate3").html(categoryname[0]+"");// 선택된 카테고리에 붙여넣기
	
   $('.table3 tbody tr').removeClass('selected');
   $(this).parent('tr').addClass('selected');
   
   $("#catesv").css('background-color', '#1e40af');
});

//카테고리 선택
$("#catesv").click(function() {
	var whichclick =$("#whichclick").val();
	var selcate1 = $(".selcate1").text();
	var selcate2 = $(".selcate2").text();
	var selcate3 = $(".selcate3").text();
	
	var cateselyn = $(".cate_list3 tr.selected").length;
	var category3cd = $(".cate_list3 tr.selected").children().next().text();

	if(cateselyn > 0) {// 3차 카테고리까지 선택한 경우
		if(whichclick == "modal") { // 상품등록하는 경우
			$(".rcategory").val(selcate1 + selcate2 + selcate3);
		} else if(whichclick == "tr") {
			$(".scategory").val(selcate1 + selcate2 + selcate3);
		}
		$(".modal-wrap4").css({"display": "none"});	
		$("#category3cd").val(category3cd);
	} else {
		swal({title: "3차 카테고리까지 선택하세요.", button: "확인"})
		.then(function() {swal.close(); return; });
	}
});

//가지고 있는 카테고리 리스트 보여주기
function category1() {
	var compcd = $("#compcd").val();
	
	$.ajax({
		url: "comp_cate1.do",
		data: { "compcd":compcd },
		async: false,
		success: function(result) {
			console.log('카테고리1 리스트 ',result);
			var data = result.data;
			var count = data.length;
			let html = '';
			
			for(var i = 0; i < count; i++) {
				if(data[i].useyn == "Y") {
					html += '<tr>'
					html += 	'<td><ul><li>'+data[i].categoryname+'<p>'+data[i].cnt+'개 카테고리 연결됨</p></li></ul></td>'
					html += 	'<td style="display: none;">'+data[i].category1cd+'</td>'
					html += '</tr>'
				}
			}//for
			$('.cate_list1').html(html);
		},//success
		error: function() { alert("오류"); }
	});//ajax
}//category1()

function category2(code) {
	var compcd = $("#compcd").val();
	
	$.ajax({
		url: "comp_cate2.do",
		data: {
			"compcd":compcd,
			"category1cd":code
		},
		async: false,
		success: function(result) {
			console.log("카테고리2 리스트", result);
			var data = result.data;
			var count = data.length;
			let html = '';
			
			for(var i = 0; i < count; i++) {
				if(data[i].useyn == "Y") {
					html += '<tr>'
					html += 	'<td><ul><li>'+data[i].categoryname+'<p>'+data[i].cnt+'개 카테고리 연결됨</p></li></ul></td>'
					html += 	'<td style="display: none;">'+data[i].category2cd+'</td>'
					html += '</tr>'
				}
			}//for
			$('.cate_list2').html(html);
		},
		error: function() { alert("오류"); }
	});//ajax
}//category2()

function category3(code) {
	var compcd = $("#compcd").val();
	
	$.ajax({
		url: "comp_cate3.do",
		data: {
			"compcd":compcd,
			"category2cd":code
		},
		async: false,
		success: function(result) {
			console.log("카테고리3 리스트", result);
			var data = result.data;
			var count = data.length;
			let html = '';
			
			for(var i = 0; i < count; i++) {
				if(data[i].useyn == "Y") {
					html += '<tr>'
					html += 	'<td><ul><li>'+data[i].categoryname+'</li></ul></td>'
					html += 	'<td style="display: none;">'+data[i].category3cd+'</td>'
					html += '</tr>'
				}
			}//for
			$('.cate_list3').html(html);
		},//success
		error: function() { alert("오류"); }
	});//ajax
}//category3()



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























