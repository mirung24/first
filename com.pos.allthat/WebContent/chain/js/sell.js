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
	
	var search2 = $('[name=search2] option:selected').val();
	var searchDate1 = $('[name=searchDate1]').val();
	var searchDate2 = $('[name=searchDate2]').val();
	var sd1 = searchDate1.replace(/-/g,"");
	var sd2 = searchDate2.replace(/-/g,"");
	
	var pagecnt = $('[name=table_length] option:selected').val();
	var pageno = $('.page-wrap .paginate_button.current').text();
	if(pagecnt == 'undefined' || pagecnt == null || pagecnt == '') { pagecnt = '10'; }
	if(pageno == 'undefined' || pageno == null || pageno == '' || pageno < 0) { pageno = '1'; }
	
	dt1(chaincode, pageno, pagecnt);//데이터테이블 조회
	sell_tt(chaincode, sd1, sd2); // 상단 집계 조회
	
	// 카드사 선택 checkbox 만들기
	$.ajax({
		url: "com_card.do",
		data: { "upcode" : "CO1034" },
		success: function(res) {
			console.log('카드사 코드', res);
			util.MakeSelCheckBox($('#cards'), res.data, '');
		}//success
	});//카드사 ajax
	
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
		sell_tt(chaincode, sd1, sd2); // 상단 집계 조회
	});// 검색 버튼
	
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
		var page_wrap = $(this).parent().parent().parent().attr('class');
		if(page_wrap == "page-wrap") {
			$('.page-wrap .paginate_button').removeClass('current'); //원래 선택된 페이지 클래스 지우고
			$(this).addClass('current'); //새로 선택된 페이지 클래스 생성
			
			var pageno = $('.page-wrap .paginate_button.current').text(); // 새로 바뀐 페이지 번호 가져오고
			var pagecnt = $('[name=table_length] option:selected').val();// 표시건수는 몇개인지 확인
			
			$('#table').DataTable().destroy();
			$('#table_paginate').remove();
			$('#table_length').remove();
			dt1(chaincode, pageno, pagecnt);
		}
	}); // 페이지 변경 이벤트
	
	// 판매내역 tr 클릭 시 테이블 조회
	$('#table tbody').on( 'click', 'tr', function() {
		var paymentcd = $(this).find("td:eq(13)").text();

		$('#table2').DataTable().destroy();
		$('#table2_paginate').remove();
		$('#table2_length').remove();
		$('#table2_info').prependTo('#table2_length');
		$('.btnexcel2').appendTo('.bf-wrap2');
		
		
		var table2 = $("#table2").DataTable({
			 "dom": '<"top"il>t<"bottom center"p><"clear">',
			 // l(페이지당),f(검색),i(전체),p(페이저),t,r
			 ajax: { 
				 url: "sell_list2.do",
				 data: { "paymentcd":paymentcd },
				 error: function() { alert("오류"); },
				 dataSrc: function(res) {
					 console.log('선택한 상품내역', res);
					 var data = res.data;
					 return data;
				 }
			 }, 
					 columns: [
						{ data: "no" }, // NO.
						{ data: "barcode" }, // 바코드
						{ data: "productname", width: "15%" }, // 상품명
						{ data: "maker" }, // 제조사
						{ data: "packingunit" }, // 포장수량
						{ data: "spec" }, // 규격
						{ data: "unit" }, // 단위
						{ data: "size" }, // 용량
						{ data: "cnt" }, // 판매수량
						{ data: "price" }, // 판매가
						{ data: "discount" }, // 할인
						{ data: "total" }, // 판매금액
						{ data: "stock" }, // 재고수량
					 ],
					 columnDefs: [
						{ targets: [2], render: function(data, type, row) {
							if(data.length > 14) { var short = data.substr(0,13)+".."; }  
							else { var short = data; }
							return '<div class="productname"><div class="productname-hover"><span class="productname-line">'
							 +data+'</span><span class="tri"></span></div>'+short+'</div>';
						} },
						{ targets: [3], render: function(data, type, row) {
							if(data.length > 9) { var short = data.substr(0,8)+".."; }  
							else { var short = data; }
							return '<div class="productname"><div class="productname-hover"><span class="productname-line">'
							 +data+'</span><span class="tri"></span></div>'+short+'</div>';
						} },
						{ targets: [5,6,7], render: function(data, type, row) {
							if(data == null || data == '') { var data = '-'; return data; }
							else { return data; }
						} },
						{ targets: [4,8,12], render: function(data, type, row) {
							return numWithCommas(data)+"개";
						} },
						{ targets: [9,10,11], render: function(data, type, row) {
							if(data == null || data == '') { var data = '-'; return data; }
							else { return numWithCommas(data)+"원"; }
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
			 lengthMenu: [ 100, 200, 300 ],
			 displayLength: 100,

			 buttons:[{
				extend:'excelHtml5',
				text: '<i class="fa-solid fa-download mr-1"></i>엑셀',
				footer: true,
				bom: true,
				className: 'btnexcel2',
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
			});// table2
			$.fn.DataTable.ext.pager.numbers_length = 10;

			$('#table2_paginate').appendTo('.page-wrap2');
			$('#table2_length').prependTo('.length-wrap2');
			$('#table2_info').prependTo('#table2_length');
			$('.btnexcel2').appendTo('.bf-wrap2');
	})// 판매내역 tr 클릭 시 테이블 조회
	
 });//ready1

$(document).ajaxStart(function () {
    $('#loading').show(); // ajax 시작 -> 로딩바 표출
});

$(document).ajaxStop(function () {
    $('#loading').hide(); // ajax 끝 -> 로딩바 히든
});

//데이터 테이블 1 
function dt1(chaincode, pageno, pagecnt) {
	var search1 = $('[name=search1] option:selected').val();
	var searchInput = $('[name=searchInput]').val();
	var search2 = $('[name=search2] option:selected').val();
	var searchDate1 = $('[name=searchDate1]').val();
	var searchDate2 = $('[name=searchDate2]').val();
	var paygubn = $('[name=paygubn] option:selected').val();
	var paymethod = $('[name=paymethod] option:selected').val();
	
	var sd1 = searchDate1.replace(/-/g,"");
	var sd2 = searchDate2.replace(/-/g,"");
	
	var cardinfo = [];
	for(var i = 0; i< 10; i++) {
		if($('#card'+(i+1)).is(':checked')){
			var card = $('#card'+(i+1)).val();
			cardinfo.push(card);
		} // checked된 값만 가져오기(check안된건 undefined로 가져와짐)
	}
	console.log(cardinfo);
	
	var cardcnt = cardinfo.length;
	console.log(cardcnt);
	
	var table1 = $("#table").DataTable({
		 "dom": '<"top"il>t<"bottom center"><"clear">',
		 // l(페이지당),f(검색),i(전체),p(페이저),t,r
		 ajax: {
			 url: "sell_list.do",
			 data: {
				"chaincode":chaincode,
				"search1":search1,
				"searchInput":searchInput,
				"search2":search2,
				"searchDate1":sd1,
				"searchDate2":sd2,
				"paygubn":paygubn,
				"paymethod":paymethod,
				"pageno":pageno,
				"pagecnt":pagecnt,
				"cardcnt":cardcnt,
				"cardArr":JSON.stringify(cardinfo)
			 },
			 contentType: false,
	         processData: true,
	         complete: function(result) {
				 console.log('complete', result.responseJSON);
				 var count = result.responseJSON.count;
			     $('#table_info').html('전체  <span>'+numWithCommas(count)+'</span> 건'); // 전체 건수 표시
			     paging(pageno, count);
			 },
			 error: function() { alert("오류"); },
			 dataSrc: function(result) {
				console.log('검색 후 리스트 조회', result.data);
				var data = result.data;
				return data;
			 }//dataSrc
		 }, 
				 columns: [
					{ data: "no" }, // NO.
					{ data: "auth_date" }, // 승인일시
					{ data: "tid" }, // tid
					{ data: "codename1" }, // 카드사
					{ data: "auth_no" }, // 승인번호
					{ data: "installments" }, // 할부
					{ data: "codename2" }, // 결제구분
					{ data: "total" }, // 금액
					{ data: "vat" }, // 부가세
					{ data: "discount" }, // 할인
					{ data: "productnames" }, // 상품
					{ data: "salesman" }, // 판매자
					{ data: "name" }, // 고객명
					{ data: "paymentcd" }// 결제코드
				 ],
				 columnDefs: [
					 { targets: [1,2,3,4,5,6,10,11,12], render: function(data, type, row) {
							if(data == null || data == '') { var data = '-'; return data; }
							else { return data; }
						} },
						{ targets: [7,8,9], render: function(data, type, row) {
							if(data == null || data == '') { var data = '-'; return data; }
							else { return numWithCommas(data)+"원"; }
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
		 order: [ [ 0, "asc" ] ],
		/*  columnDefs: [
			{ targets: 0, width: 10},
		], */
		 lengthMenu: [ 5, 10, 50, 100, 200 ],
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
		 	}]//buttons
		});//table1
		$.fn.DataTable.ext.pager.numbers_length = 10;
	
//		$('#table_paginate').appendTo('.page-wrap');
		$('#table_length').prependTo('.length-wrap');
		$('#table_info').prependTo('#table_length');
		$('.btnexcel').appendTo('.bf-wrap');
}//dt1

//페이징 처리
function paging(pageno, count) {
	$('.page-wrap a.paginate_button').remove();//만들어져 있던 페이지들 지우기
	$('.page-wrap #table_next').remove();//만들어져 있던 다음버튼 지우기
	$('.page-wrap #table_previous').remove();//만들어져 있던 이전버튼 지우기
	
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
			$('.page-wrap .dataTables_paginate').prepend('<button class="btn paginate_button previous" id="table_previous"><i class="fa-solid fa-angle-left"></i></button>');
//			$('.dataTables_paginate').prepend('<button class="btn paginate_button first" id="table_first"><i class="fa-solid fa-angles-left"></i></button>');
		}// 첫번째 페이지에서 이전버튼 안보이게
		for(var i = startPage; i <= endPage; i++) {// 페이지버튼 만들기
			if(pageno == i) {//현재 페이지 current 클래스 추가
				$('.page-wrap .dataTables_paginate span').append('<a class="paginate_button current" value="'+i+'">'+i+'</a>');
			} else {
				$('.page-wrap .dataTables_paginate span').append('<a class="paginate_button" value="'+i+'">'+i+'</a>');
			}
		}// 페이지버튼 만들기
		pageCount = Math.floor(pageCount); // 소수점 내림
		if(pageno < pageCount) { // 마지막 페이지에서 다음버튼 안보이게
			$('.page-wrap .dataTables_paginate').append('<button class="btn paginate_button next" id="table_next"><i class="fa-solid fa-angle-right"></i></button>');
//			$('.dataTables_paginate').append('<button class="btn paginate_button last" id="table_last"><i class="fa-solid fa-angles-right"></i></button>');
		}// 마지막 페이지에서 다음버튼 안보이게
		
		// 다음페이지 버튼 클릭시
		$('.page-wrap .paginate_button.next').click(function() {
			var pageno = $('.page-wrap .paginate_button.current').text();// 현재 페이지
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
						$('.page-wrap .dataTables_paginate span').html('<a class="paginate_button current" value="'+i+'">'+i+'</a>');
					} else {
						$('.page-wrap .dataTables_paginate span').append('<a class="paginate_button" value="'+i+'">'+i+'</a>');
					}
				}
				
				// 데이터 테이블 담긴 요소에 따라 다시 부르기
				dt1(chaincode, pageno, pagecnt);
			} else {//else(마지막 페이지 아닐때 다음페이지로 넘어가기)
				var pageno = Number(pageno) + 1;
				var pagecnt = $('[name=table_length] option:selected').val(); // 표시 건수
				
				$('.page-wrap .paginate_button').removeClass('current'); //원래 선택된 페이지 클래스 지우고
				$('.page-wrap .paginate_button[value='+pageno+']').attr('class','paginate_button current');
				
				$('#table').DataTable().destroy();
				$('#table_paginate').remove();
				$('#table_length').remove();
				dt1(chaincode, pageno, pagecnt);
			}//else(마지막 페이지 아닐때 다음페이지로 넘어가기)
		});// 다음페이지 버튼 클릭시
		
		// 이전 페이지 버튼 클릭시
		$('.page-wrap .paginate_button.previous').click(function() {
			var pageno = $('.page-wrap .paginate_button.current').text();// 현재 페이지
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
						$('.page-wrap .dataTables_paginate span').html('<a class="paginate_button current" value="'+i+'">'+i+'</a>');
					} else {
						$('.page-wrap .dataTables_paginate span').append('<a class="paginate_button" value="'+i+'">'+i+'</a>');
					}
				}
				
				// 데이터 테이블 담긴 요소에 따라 다시 부르기
				dt1(chaincode, pageno, pagecnt);
			} else {//else(마지막 페이지 아닐때 다음페이지로 넘어가기)
				var pageno = Number(pageno) - 1;
				var pagecnt = $('[name=table_length] option:selected').val(); // 표시 건수
				
				$('.page-wrap .paginate_button').removeClass('current'); //원래 선택된 페이지 클래스 지우고
				$('.page-wrap .paginate_button[value='+pageno+']').attr('class','paginate_button current');
				
				$('#table').DataTable().destroy();
				$('#table_paginate').remove();
				$('#table_length').remove();
				dt1(chaincode, pageno, pagecnt);
			}//else(마지막 페이지 아닐때 다음페이지로 넘어가기)
		});// 이전 페이지 버튼 클릭시
	}//if(result>0) -> 상품리스트가 존재할 때
}// 페이징 처리

//상단 집계 조회
function sell_tt(code, date1, date2) {
	$.ajax({
		url: "prod_tt.do",
		type: "post",
		data: { 
			"chaincode": code,
			"searchDate1":date1,
			"searchDate2":date2
		},
		success: function(result) {
			console.log(result);
			
			$('#ptcnt-tcnt').html(numWithCommas(result.ptcnt) + "개" + "<span class='square-total ml-2'>(" 
					+ numWithCommas(result.tcnt) + "건" + ")</span>");
			$('#total').html(numWithCommas(result.total)+"원 "+"<span class='square-target' data-speed='1' data-target='"
					+result.amt+"' data-gap='53421'>(<span></span>원)</span>");
			
			$('#sncnt-scnt').html(numWithCommas(result.sncnt) + "개" + "<span class='square-total ml-2'>(" 
					+ numWithCommas(result.scnt) + "건" + ")</span>");
			$('#stotal').html(numWithCommas(result.stotal)+"원 "+"<span class='square-target' data-speed='1' data-target='"
					+result.samt+"' data-gap='32235'>(<span></span>원)</span>");
			
			$('#pncnt-ncnt').html(numWithCommas(result.pncnt) + "개" + "<span class='square-total ml-2'>(" 
					+ numWithCommas(result.ncnt) + "건" + ")</span>");
			$('#ntotal').html(numWithCommas(result.ntotal)+"원 "+"<span class='square-target' data-speed='1' data-target='"
					+result.namt+"' data-gap='26235'>(<span></span>원)</span>");
			
			square_target();
		},//success
		error: function(jqXHR, textStatus, errorThrown) {
			 alert("오류");
			 console.log(jqXHR);
			 console.log(textStatus);
			 console.log(errorThrown);
		}//error
	});//ajax
}//sell_tt(상단 집계 조회)

//천단위 콤마 찍기
function numWithCommas(x) {
	return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function enterkey() {
	if(window.event.keyCode == 13) {
		$('#searchBtn').click();
	}
}// 엔터키 발생 이벤트




































