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
	
	dt1(chaincode, pageno, pagecnt);//데이터테이블 조회
//	prod_tt(chaincode, sd1, sd2);// 상단 집계 조회
	
	// 검색 option 변경 시 선택한 값에 맞는 리스트 조회
	$(document).on('click','#searchBtn', function() {
		var chaincode = $('#chaincode').val();
		
		var searchDate1 = $('[name=searchDate1]').val();
		var searchDate2 = $('[name=searchDate2]').val();
		var sd1 = searchDate1.replace(/-/g,"");
		var sd2 = searchDate2.replace(/-/g,"");
		
		var pagecnt = $('[name=table_length] option:selected').val();
		
		$('#table').DataTable().destroy();
		$('#table_paginate').remove();
		$('#table_length').remove();
		
		dt1(chaincode, 1, pagecnt);//데이터테이블 조회
//		prod_tt(chaincode, sd1, sd2);// 상단 집계 조회
	});// 검색 버튼 
	
	// tr 클릭 이벤트
	$('#table tbody').on( 'click', 'tr', function() {
		var productid = $(this).children('td:eq(15)').text();
		console.log('상품 아이디', productid);
		
		if(productid != '-') {
			$(".modal-wrap1").css("display", "flex");
			$.ajax({
				url: "prod_sel.do",
				type: "post",
				data: { 
					"productid":productid,
					"chaincode":chaincode
				},
				success: function(result) {
					console.log(result);
					
					$('#d_prodname').val(result.productname);
					$('#d_prodcd').val(result.productcd);
					$('#d_prodmaker').val(result.maker);
					$('#d_prodspec').val(result.spec);
					$('#d_produnit').val(result.unit);
					$('#d_prodsize').val(result.size);
					$('#d_prodcate').val(result.categoryname);
					$('#d_prodremarks').val(result.remarks);
					
	//				var prodcd = result.productcd;
					$('#productid').val(productid);
					
					groupAddList(productid);//그룹상품리스트 조회
					prodTally(productid);//상품통계 조회
					prodHist(productid);//상품이력 조회
				},
				error: function() { alert("오류"); }
			});// 선택된 내용 가져오기(ajax)	
		}//if
		else {
			swal({title: "제품코드가 존재하지 않습니다.", button: "확인"})
			.then(function() {swal.close(); return false;})
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
 });//ready

$(document).ajaxStart(function () {
    $('#loading').show(); // ajax 시작 -> 로딩바 표출
});

$(document).ajaxStop(function () {
    $('#loading').hide(); // ajax 끝 -> 로딩바 히든
});

// 데이터 테이블
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
		 serverside: true,
		 processing: true,
		 ajax: {
			 url: "pack_list.do",
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
		}, 
		 columns: [
			{ data: "no" }, // NO.0
		    { data: "productname" ,width: "15%"},// 상품명1
			{ data: "productcd" }, // 제품코드2
			{ data: "maker" }, // 제조사3
			{ data: "packingunit" }, //포장단위4
			{ data: "spec" }, // 규격5
			{ data: "unit" }, // 단위6
			{ data: "size" }, // 용량(size)7
			{ data: "mxprice" }, // 최고가8
			{ data: "miprice" }, // 최저가9
			{ data: "maprice" }, // 최다가10
			{ data: "total" }, // 매출(당일)11
			{ data: "total2" }, // 매출(전일)12
			{ data: "total3" }, // 매출(D-30)13
			{ data: "ranking" }, // 순위(D-30)14
			{ data: "productid" } // 제품 아이디 15
		 ],
		 columnDefs: [
			{ targets: [1], render: function(data, type, row) {
				if(data.length > 14) { var short = data.substr(0,14)+"..."; } 
				else { var short = data; }
				return '<div class="productname"><div class="productname-hover"><span class="productname-line">'
				+data+'</span><span class="tri"></span></div>'+short+'</div>';
			} },
			{ targets: [3], render: function(data, type, row) {
				if(data.length > 6) { var short = data.substr(0,5)+"..."; }  
				else { var short = data; }
				return '<div class="productname"><div class="productname-hover"><span class="productname-line">'
				+data+'</span><span class="tri"></span></div>'+short+'</div>';
			} },
			{ targets: [5,14], render: function(data, type, row) {
				if(data == null|| data == '') { var data = '-'; return data; }
				else { return data; }
			} },
			{ targets: [6], render: function(data, type, row) {
				if(data == null|| data == '') { var data = '-'; return data; }
				else { return data; }
			} },
			{ targets: [7], render: function(data, type, row) {
				if(data == null|| data == '') { var data = '-'; return data; }
				else { return data; }
			}, width: "80px" },
			{ targets: [8,9,10,11,12,13], render: function(data, type, row) {
				return numWithCommas(data)+"원"; } }
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
		 }],
	});//table
	$.fn.DataTable.ext.pager.numbers_length = 10;
	
//	$('#table tbody').on('click', function () {
//		$(".modal-wrap1").css("display", "flex");
//	});

	$(".pop-close1").click(function(){
		$(".modal-wrap1").css({"display": "none"});
	});

//	$('#table_paginate').appendTo('.page-wrap');
	$('#table_length').prependTo('.length-wrap');
	$('.dataTables_info').prependTo('#table_length');
	$('.btnexcel').appendTo('.bf-wrap');
}//데이터 테이블

//페이징 처리
function paging(pageno, count) {
	
	$('a.paginate_button').remove();//만들어져 있던 페이지들 지우기
	$('#table_next').remove();//만들어져 있던 다음버튼 지우기
	$('#table_previous').remove();//만들어져 있던 이전버튼 지우기
	
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

 /*modal */
 $(".pop-link2").click(function(){
	$(".modal-wrap2").css({"display": "flex"});
});
$(".pop-close2").click(function(){
	$(".modal-wrap2").css({"display": "none"});
});

//숫자만 입력했는지 확인
$("input:text[numberOnly]").on("keyup", function() {
    $(this).val($(this).val().replace(/[^0-9]/g,""));
 });

// 상품 등록
$(".pop2 .btn-save").click(function(){ // 유효성 검사, 주소는 검색할 수 있게 api사용

	if($("#productname").val().length == 0)
		swal({title: "상품명을 입력하세요.", button: "확인"})
		.then(function() {swal.close(); $("#productname").focus(); return false;
	})
	else if($(".productcd").val().length == 0)
		swal({title: "대표코드를 입력하세요.", button: "확인"})
		.then(function() {swal.close(); $(".productcd").focus(); return false;
	})

	else {
		swal({
			title: '상품을 등록하시겠습니까?',
			icon: "info",
			buttons: true,
			imfoMode: true,
			buttons: ["취소", "확인"]
		}).then(function(willDelete) {
			var productname = $('#productname').val(); //상품명
			var productcd = $('.productcd').val(); // 대표코드(상품id, 바코드)
			var maker = $('.maker').val(); // 제조사
			var spec = $('.spec').val(); // 규격
			var unit = $('.unit').val(); // 단위
			var size = $('.size').val(); // 용량(size)
			var category = $('.category option:selected').val();
			var remarks = $('#remarks').val();
			
			var chaincode = $('#chaincode').val(); // 체인코드
			var regcd = $('#regcd').val(); // 등록자 아이디
	
			if(willDelete)	{
				$.ajax({
					url: "prod_insert.do",
					type: "post",
					data: {
						"productname":productname,
						"productcd":productcd,
						"maker":maker,
						"spec":spec,
						"unit":unit,
						"size":size,
						"category3cd":category,
						"remarks":remarks,
						"chaincode":chaincode,
						"regcd":regcd
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
								location.href = "/pack.do?title=상품관리&name=상품포장관리";
							});
						} 
						else if(result == 3) {
							swal({text: "중복된 대표코드가 존재합니다.\n 대표코드를 다시 입력해주세요.", button: "확인"})
							.then(function() {swal.close(); $('.productcd').val('');
							$('.productcd').focus(); return; });
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
		});//then
	}//else
});// 가맹점 등록

// 상단 집계 조회
//function prod_tt(code, date1, date2) {
//	$.ajax({
//		url: "prod_tt.do",
//		type: "post",
//		data: { 
//			"chaincode": code,
//			"searchDate1":date1,
//			"searchDate2":date2
//		},
//		success: function(result) {
//			console.log(result);
//			
//			$('#ptcnt-tcnt').html(numWithCommas(result.ptcnt) + "개" + "<span class='square-total ml-2'>(" 
//					+ numWithCommas(result.tcnt) + "건" + ")</span>");
//			$('#total').html(numWithCommas(result.total)+"원 "+"<span class='square-target' data-speed='1' data-target='"
//					+result.amt+"' data-gap='53421'>(<span></span>원)</span>");
//			
//			$('#sncnt-scnt').html(numWithCommas(result.sncnt) + "개" + "<span class='square-total ml-2'>(" 
//					+ numWithCommas(result.scnt) + "건" + ")</span>");
//			$('#stotal').html(numWithCommas(result.stotal)+"원 "+"<span class='square-target' data-speed='1' data-target='"
//					+result.samt+"' data-gap='32235'>(<span></span>원)</span>");
//			
//			$('#pncnt-ncnt').html(numWithCommas(result.pncnt) + "개" + "<span class='square-total ml-2'>(" 
//					+ numWithCommas(result.ncnt) + "건" + ")</span>");
//			$('#ntotal').html(numWithCommas(result.ntotal)+"원 "+"<span class='square-target' data-speed='1' data-target='"
//					+result.namt+"' data-gap='26235'>(<span></span>원)</span>");
//			
//			square_target();
//		},//success
//		error: function(jqXHR, textStatus, errorThrown) {
//			 alert("오류");
//			 console.log(jqXHR);
//			 console.log(textStatus);
//			 console.log(errorThrown);
//		}//error
//	});//ajax
//}//prod_tt(상단 집계 조회)

function groupAddList(productid) {
	var chaincode = $('#chaincode').val();
	$.ajax({
		url: "ga_list.do",
		type: "post",
		data: { 
			"productid":productid,
			"chaincode":chaincode
		},
		success: function(result) {
			console.log('그룹 상품 추가 리스트', result);
			
			let html = "";
			const count = result.data.length;
			
			if(count > 0) {
				for (var i = 0; i < count; i++) {
					if(result.data[i].spec == null) { result.data[i].spec = ''; }
					if(result.data[i].unit == null) { result.data[i].unit = ''; }
					if(result.data[i].size == null) { result.data[i].size = ''; }
					html += "<tr>"
					html += 	"<td><input type='text' class='form-control' name='ga_prodcd' value='" + result.data[i].productcd + "' id='ga_prodcd" + i + "' readonly='true'></td>"
					html += 	"<td><input type='text' class='form-control' name='ga_barcd' value='" + result.data[i].barcode + "' id='ga_barcd" + i + "' readonly='true'></td>"
					html += 	"<td><input type='text' class='form-control' name='ga_prodnm' value='" + result.data[i].productname + "' id='ga_prodnm" + i + "'></td>"
					html += 	"<td><input type='text' class='form-control' name='ga_maker' value='" + result.data[i].maker + "' id='ga_maker" + i + "'></td>"
					html += 	"<td><input type='text' class='form-control' name='ga_spec' value='" + result.data[i].spec + "' id='ga_spec" + i + "'></td>"
					html += 	"<td><input type='text' class='form-control' name='ga_unit' value='" + result.data[i].unit + "' id='ga_unit" + i + "'></td>"
					html += 	"<td><input type='text' class='form-control' name='ga_size' value='" + result.data[i].size + "' id='ga_size" + i + "'></td>"
					html += 	"<td><input type='text' class='form-control' name='ga_pakunit' value='" + result.data[i].packingunit + "' id='ga_pakunit" + i + "'></td>"
					html += 	"<td><input type='text' class='form-control' name='ga_productsid' value='" + result.data[i].productsid + "' id='ga_productsid" + i + "'></td>"
					html +=	"</tr>"
				}//for
			}//if
			$('.ga_tbody').html(html);
		},//success
		error:function(jqXHR, textStatus, errorThrown) {
			alert("오류");
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}// error
	});
}// groupAddList

// popup 그룹상품 추가 행 추가하기
function makeGrpList(i) {
	let html = "";
	
	html += "<tr>"
	html += 	"<td><input type='text' class='form-control' name='ga_prodcd' value='' id='ga_prodcd" + i + "'></td>"
	html += 	"<td><input type='text' class='form-control' name='ga_barcd' value='' id='ga_barcd" + i + "'></td>"
	html += 	"<td><input type='text' class='form-control' name='ga_prodnm' value='' id='ga_prodnm" + i + "'></td>"
	html += 	"<td><input type='text' class='form-control' name='ga_maker' value='' id='ga_maker" + i + "'></td>"
	html += 	"<td><input type='text' class='form-control' name='ga_spec' value='' id='ga_spec" + i + "'></td>"
	html += 	"<td><input type='text' class='form-control' name='ga_unit' value='' id='ga_unit" + i + "'></td>"
	html += 	"<td><input type='text' class='form-control' name='ga_size' value='' id='ga_size" + i + "'></td>"
	html += 	"<td><input type='text' class='form-control' name='ga_pakunit' value='' id='ga_pakunit" + i + "'></td>"
	html += 	"<td><input type='text' class='form-control' name='ga_productsid' value='' id='ga_productsid" + i + "'></td>"
	html +=	"</tr>"
		
	$('.ga_tbody').prepend(html);
}

// popup 그룹상품 추가버튼 event
$(document).on("click","#ga_btn", function(){
	var i = $('.ga_tbody tr').length;
	var productid = $('#productid').val();
	var chaincode = $('#chaincode').val();
	
	$.ajax({
		url: "ga_list.do",
		type: "post",
		data: { 
			"productid":productid,
			"chaincode":chaincode
		},
		success: function(result) {
			var ori_i = result.data.length;
			var ni = i-1;
			
			if(i == ori_i) {
				makeGrpList(i);
				$('#ga_prodcd'+i+'').focus();
				return;
			} if(i >= ori_i+1) { // 추가를 다시 눌러도 다시 추가 되지 않도록 하기
				var ni = i-1;
				$('#ga_prodcd'+ni+'').focus();
				return;
			}
		}
	});
}); // popup 그룹상품 추가버튼 event

// popup 판매 집계
function prodTally(productid) {
	var chaincode = $('#chaincode').val();
	
	$.ajax({
		url: "prodTally.do",
		type: "post",
		data: {
			"productid":productid,
			"chaincode":chaincode
		},
		success: function(result) {
			console.log(result);
			const count = result.length;
			if(count == 0) {
				$('#prodtot').val('0원');
				$('#prodcnt').val('0건');
				$('#prodavg').val('0원');
				$('#prodavg2').val('0건');
			} else {
				$('#prodtot').val(numWithCommas(result.total)+'원');
				$('#prodcnt').val(numWithCommas(result.cnt)+'건');
				$('#prodavg').val(numWithCommas(result.avg)+'원');
				$('#prodavg2').val(numCommasdeci(result.avg2)+'건');
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

//pop판매이력
function prodHist(productid) {
	var chaincode = $('#chaincode').val();
	var popSearch1 = $('[name=popSearch1]').val();
	var popSearch2 = $('[name=popSearch2]').val();
	
	var sd1 = popSearch1.replace(/-/g,"");
	var sd2 = popSearch2.replace(/-/g,"");
	
	$.ajax({
		url: "prodHist.do",
		type: "post",
		data: {
			"chaincode":chaincode,
			"productid":productid,
			"popSearch1":sd1,
			"popSearch2":sd2
		},
		success: function(result) {
			console.log('popHist', result);
			
			let html = "";
			const count = result.data.length;
			
			if(count > 0) {
				for(var i = 0; i < count; i++) {
					html += "<tr>"
					html += 	"<td>" + result.data[i].yymmdd + "</td>"
					html += 	"<td>" + numWithCommas(result.data[i].total) + "원</td>"
					html += 	"<td>" + result.data[i].cnt + "건</td>"
					html += 	"<td>" + result.data[i].mxcomp + "</td>"
					html += 	"<td>" + result.data[i].micomp + "</td>"
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

// pop 판매이력 검색 버튼
$('[name=popSearchBtn]').click(function() {
	var productid = $('#productid').val();
	prodHist(productid);
});

//popup 상세보기 저장
$('#popsv_btn').on('click', function() {
	var i = $('.ga_tbody tr').length;
	var productid = $('#productid').val();
	var chaincode = $('#chaincode').val();
	
	if($('#d_prodname').val() == '') {
		swal({title: "상품명을 입력하세요.", button: "확인"})
		.then(function() {swal.close(); $('#d_prodname').focus(); return; });
	} else if($('#d_prodcd').val() == '') {
		swal({title: "대표코드를 입력하세요.", button: "확인"})
		.then(function() {swal.close(); $('#d_prodcd').focus(); return; });
	} else if($('#d_prodmaker').val() == '') {
		swal({title: "제조사를 입력하세요.", button: "확인"})
		.then(function() {swal.close(); $('#d_prodmaker').focus(); return; });
	}
	
	else {
		$.ajax({
			url: "ga_list.do",
			type: "post",
			data: {
				"productid":productid,
				"chaincode":chaincode
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
					}
					else {
						ga_updateA();
					}//else
				} // 추가한 행이 비어있을 경우 유효성 검사
				else if(i == 0){// 그룹상품 자체가 없을 경우
					swal({title: "그룹상품을 추가해주세요.", button: "확인"})
					.then(function() {swal.close(); $('#ga_btn').focus(); return; });
				}
				else if(i == ori_i) {//추가한 그룹상품이 없고, 수정만 했을 경우
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
							ga_updateA();
						}
					}//for
				}//else if
			}//success
		});//ajax
	}//else
});

//상세보기 저장
function ga_updateA() {
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
				url: "detail_prod.do",
				type: "post",
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
						location.href="/pack.do?title=상품관리&name=상품포장관리";
					});//저장완료 swal
				}//success
			});//저장 ajax
		}//if(willDelete)
	});// swal then
}

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
//숫자만 입력했는지 확인
$("input:text[numberOnly]").on("keyup", function() {
    $(this).val($(this).val().replace(/[^0-9]/g,""));
 });

function enterkey() {
	if(window.event.keyCode == 13) {
		$('#searchBtn').click();
	}
}// 엔터키 발생 이벤트




























