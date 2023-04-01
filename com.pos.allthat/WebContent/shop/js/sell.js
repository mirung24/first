 /* datatable */
$(document).ready(function() {
	
	var compcd = $('#compcd').val();
	var corpnum = $('#corpnum').val();
	
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
	var sd2 = searchDate2.replace(/-/g,"");//오늘날짜
	
	var pagecnt = $('[name=table_length] option:selected').val();
	var pageno = $('.page-wrap .paginate_button.current').text();
	if(pagecnt == 'undefined' || pagecnt == null || pagecnt == '') { pagecnt = '10'; }
	if(pageno == 'undefined' || pageno == null || pageno == '' || pageno < 0) { pageno = '1'; }
	
	// 현재날짜 구하기
	var today = new Date();
	var year =  today.getFullYear();
	var month = ("0" + (today.getMonth() + 1)).slice(-2);
	var day = ("0" + today.getDate()).slice(-2);
	var date = year+month+day;//오늘날짜
	
	// api로 승인내역 조회
	$.ajax({
		url: "/com_api.do",
		type: "post",
		async: false,
		data: {
			"accessKey":"elZIM0h2RmRzd3VGdEtvcVNiSktwQT09",
			"req_busiNo":corpnum,
			"req_tranDt":date,
			"req_tranDtEnd":date,
			"req_type":"ALLTALK"
		},
		success: function(result) {
			console.log("api승인내역 조회",result);
//			console.log(result.RET_CODE);
			
			if(result.RET_CODE == "0000") { // 정상일 때
				$.ajax({
					url: "/com_temp.do",
					type: "post",
					async: false,
					data: JSON.stringify(result),
					contentType: "application/json; charset=utf8",
					success: function(res) {
						console.log("temp테이블 넣기```", res);
					},
					error: function() { alert("temp 테이블 넣기 오류"); }
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
	
//	api(corpnum);//승인내역 
	dt1(compcd, pageno, pagecnt);//데이터테이블 조회
	sell_top(compcd, sd1, sd2);//상단집계 조회
	
	// 카드사 선택 checkbox 만들기
	$.ajax({
		url: "com_card.do",
		data: { "upcode" : "CO1034" },
		success: function(res) {
//			console.log('카드사 코드', res);
			util.MakeSelCheckBox($('#cards'), res.data, '');
		}//success
	});//카드사 ajax
	
	// 검색 option 변경 시 선택한 값에 맞는 리스트 조회
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
	
		api(corpnum);//승인내역 다시 조회 후 temp 테이블 넣기
		dt1(compcd, 1, pagecnt);//데이터테이블 조회
		sell_top(compcd, sd1, sd2);//상단집계 조회
	});// 검색 버튼
	
	// 표시건수 selectbox 변경 이벤트
	$(document).on('change', '[name=table_length]', function() {
		var pagecnt = $('[name=table_length] option:selected').val();

		$('#table').DataTable().destroy();
		$('#table_paginate').remove();
		$('#table_length').remove();
		$('#table_next').remove();
		api(corpnum);//승인내역 다시 조회 후 temp 테이블 넣기
		dt1(compcd, 1, pagecnt);
	});// 표시건수 selectbox 변경 이벤트
	
	// 페이지 변경 이벤트
	$(document).on('click', 'a.paginate_button', function() {
		var page_wrap = $(this).parent().parent().parent().attr('class');
		if(page_wrap == "page-wrap") {
			$('.page-wrap .paginate_button').removeClass('current'); //원래 선택된 페이지 클래스 지우고
			$(this).addClass('current'); //새로 선택된 페이지 클래스 생성
			
			var pageno = $('.page-wrap .paginate_button.current').text(); // 새로 바뀐 페이지 번호 가져오고
			var pagecnt = $('[name=table_length] option:selected').val();// 표시건수는 몇개인지 확인
			
			$('#table').DataTable().destroy();
			$('#table_paginate').remove();
			$('#table_length').remove();
			
//			api(corpnum);//승인내역 다시 조회 후 temp 테이블 넣기
			dt1(compcd, pageno, pagecnt);
		}
	}); // 페이지 변경 이벤트
	
	// 판매내역 tr 클릭 시 테이블 조회
	$('#table tbody').on( 'click', 'tr', function() {
		var paymentcd = $(this).find("td:eq(14)").text();
		
		$('#table2').DataTable().destroy();
		$('#table2_paginate').remove();
		$('#table2_length').remove();
		$('#table2_info').prependTo('#table2_length');
		$('.btnexcel2').appendTo('.bf-wrap2');
		
		var table2 = $("#table2").DataTable({
			 "dom": '<"top"il>t<"bottom center"p><"clear">',
			 // l(페이지당),f(검색),i(전체),p(페이저),t,r
			 ajax: {
				 url: "ssell_list2.do",
				 data: { "paymentcd":paymentcd },
				 error: function() { alert("오류"); },
				 dataSrc: function(res) {
//					 console.log('선택한 상품내역', res);
					 var data = res.data;
					 return data;
				 }
			 }, 
					 columns: [
						{ data: "no" },//no.
						{ data: "barcode" },//바코드
						{ data: "productname", width: "15%" },//상품명
						{ data: "maker" },//제조사
						{ data: "packingunit" },//포장수량
						{ data: "spec" },//규격
						{ data: "unit" },//단위
						{ data: "size" },//용량
						{ data: "cnt" },//판매수량
						{ data: "price" },//판매가
						{ data: "discount" },//할인
						{ data: "total" },//판매금액
						{ data: "stock" },//재고수량
					 ],
					 columnDefs: [
						{ targets: [2], render: function(data, type, row) {
							if(data.length > 14) { var short = data.substr(0,13)+".."; }  
							else { var short = data; }
							return '<div class="productname"><div class="productname-hover"><span class="productname-line">'
							 +data+'</span><span class="tri"></span></div>'+short+'</div>';
						} },
						{ targets: [3], render: function(data, type, row) {
							if(data.length > 8) { var short = data.substr(0,7)+".."; }  
							else { var short = data; }
							return '<div class="productname"><div class="productname-hover"><span class="productname-line">'
							 +data+'</span><span class="tri"></span></div>'+short+'</div>';
						} },
						{ targets: [5,6,7], render: function(data, type, row) {
							if(data == null || data == '') { var data = ''; return data; }
							else { return data; }
						} },
						{ targets: [4,8,12], render: function(data, type, row) {
							return numWithCommas(data)+"개";
						} },
						{ targets: [9,10,11], render: function(data, type, row) {
							if(data == null || data == '') { var data = ''; return data; }
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
			});//table2
			$.fn.DataTable.ext.pager.numbers_length = 10;

			$('#table tbody tr').removeClass('selected');
		    $(this).addClass('selected');

			$('#table2_paginate').appendTo('.page-wrap2');
			$('#table2_length').prependTo('.length-wrap2');
			$('#table2_info').prependTo('#table2_length');
			$('.btnexcel2').appendTo('.bf-wrap2');
	});// 판매내역 tr 클릭 시 테이블 조회
	
	/* 기간 tap 클릭 시 처리 */
    $('.date-tab').click(function () {
       $('.date-tab').removeClass('active');   
       $(this).addClass('active');
      
       var thisId = $(this).attr('id');
       clickDateTap(thisId);      // 날짜 탭(오늘/어제/금주...) 클릭 시 처리
    });
});//ready

$(document).ajaxStart(function () {
    $('#loading').show(); // ajax 시작 -> 로딩바 표출
});

$(document).ajaxStop(function () {
    $('#loading').hide(); // ajax 끝 -> 로딩바 히든
});

// api로 받은 승인내역 temp에 넣기
function api(corpnum) {
	var compcd = $('#compcd').val();
	
	var searchDate1 = $('[name=searchDate1]').val();
	var searchDate2 = $('[name=searchDate2]').val();
	var sd1 = searchDate1.replace(/-/g,"");
	var sd2 = searchDate2.replace(/-/g,"");
	
	// 현재날짜 구하기
	var today = new Date();
	var year =  today.getFullYear();
	var month = ("0" + (today.getMonth() + 1)).slice(-2);
	var day = ("0" + today.getDate()).slice(-2);
	var date = year+month+day;//오늘날짜
	console.log(date);
	
	// api로 승인내역 조회
	$.ajax({
		url: "/com_api.do",
		type: "post",
		async: false,
		data: {
			"accessKey":"elZIM0h2RmRzd3VGdEtvcVNiSktwQT09",
			"req_busiNo":corpnum,
			"req_tranDt":date,
			"req_tranDtEnd":date,
			"req_type":"ALLTALK"
		},
		success: function(result) {
//			console.log("api승인내역 조회",result);
//			console.log(result.RET_CODE);
			console.log("api 함수로 들어왓습니당");
			
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
					error: function() { alert("temp 테이블 넣기 오류"); }
				});
			} else {// 승인내역이 없거나, 등록된 가맹점이 아니거나 등등
				$.ajax({
					url: "/temp_del.do",
					type: "post",
					data: { "compcd":compcd },
					async: false,
					success: function(result) {
						console.log("temp 일단 지우기", result);
					},
					error: function() { alert("오류"); }
				});//ajax
			}//else
		},//success
		error: function() { alert("승인내역 조회 오류"); }
	});//ajax(승인내역 api)
	
//	var pagecnt = $('[name=table_length] option:selected').val();
//	var pageno = $('.page-wrap .paginate_button.current').text();
//	if(pagecnt == 'undefined' || pagecnt == null || pagecnt == '') { pagecnt = '10'; }
//	if(pageno == 'undefined' || pageno == null || pageno == '' || pageno < 0) { pageno = '1'; }
//	console.log(pageno, pagecnt);
//	
//	dt1(compcd, pageno, pagecnt);//데이터테이블 조회
}

//데이터 테이블 1 
function dt1(compcd, pageno, pagecnt) {
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
//	console.log(cardinfo);
	
	var cardcnt = cardinfo.length;
//	console.log(cardcnt);
	
	var table1 = $("#table").DataTable({
//		 "dom": '<"top""B"il>t<"bottom center"><"clear">',
		 "dom": '<"top"il>t<"bottom center"><"clear">',
		 // l(페이지당),f(검색),i(전체),p(페이저),t,r
		 ajax: {
			 url: "ssell_list.do",
			 data: {
				"compcd":compcd,
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
	         async: false, 
	         complete: function(result) {
				 console.log('complete', result.responseJSON);
				 var count = result.responseJSON.count[0].cnt;
			     $('#table_info').html('전체  <span>'+numWithCommas(count)+'</span> 건'); // 전체 건수 표시
			     $("#ttotal").html('<i class="fa-solid fa-circle-plus mr-2"></i>금액 합계 &nbsp;:&nbsp; '+numWithCommas(result.responseJSON.count[0].ttotal)+'원');
			     $("#tetcamt").html('<i class="fa-solid fa-circle-plus mr-2"></i>조제 합계 &nbsp;:&nbsp; '+numWithCommas(result.responseJSON.count[0].tetcamt)+'원');
			     $("#tamt").html('<i class="fa-solid fa-circle-plus mr-2"></i>일반 합계 &nbsp;:&nbsp; '+numWithCommas(result.responseJSON.count[0].tamt)+'원');
			     $("#tvat").html('<i class="fa-solid fa-circle-plus mr-2"></i>부가세 합계 &nbsp;:&nbsp; '+numWithCommas(result.responseJSON.count[0].tvat)+'원');
			     $("#tdiscount").html('<i class="fa-solid fa-circle-plus mr-2"></i>할인 합계 &nbsp;:&nbsp; '+numWithCommas(result.responseJSON.count[0].tdiscount)+'원');
			     
			     $(".ttotal2").html(numWithCommas(result.responseJSON.count[0].ttotal)+' ');
			     $(".tetcamt2").html(numWithCommas(result.responseJSON.count[0].tetcamt)+' ');
			     $(".tamt2").html(numWithCommas(result.responseJSON.count[0].tamt)+' ');
			     $(".tvat2").html(numWithCommas(result.responseJSON.count[0].tvat)+' ');
			     $(".tdiscount2").html(numWithCommas(result.responseJSON.count[0].tdiscount)+' ');
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
				{ data: "no", width:10 }, //no.0
				{ data: "auth_date", width:80 },//승인일시1
				{ data: "tid" },//tid2
				{ data: "codename1" },//카드사3
				{ data: "auth_no" },//승인번호4
				{ data: "installments", width:30 },//할부5
				{ data: "codename2" },//결제구분6
				{ data: "total" },//금액7
				{ data: "etcamt" },//조제8
				{ data: "amt" },//일반9
				{ data: "vat" },//부가세10
				{ data: "discount" },//할인11
				{ data: "productnames" },//상품12
//					{ data: "salesman" },//판매자13
				{ data: "name" },//고객명13
				{ data: "paymentcd" }//결제코드14
			 ],
			 columnDefs: [
					{ targets: [1,2,3,4,5,6], render: function(data, type, row) {
						if(data == null || data == '') { var data = '-'; return data; }
						else { return data; }
					} },
					{ targets: [13,14], render: function(data, type, row) {
						if(data == null || data == '') { var data = ''; return data; }
						else { return data; }
					} },
					{ targets: [12], render: function(data, type, row) {
						if(data == null || data == '') { var data = ''; var short = ''; }
						else if(data.length > 6) { var short = data.substr(0,5)+".."; }
						else { var short = data; }
						return '<div class="productname"><div class="productname-hover"><span class="productname-line">'
						 +data+'</span><span class="tri"></span></div>'+short+'</div>';
					} },
					{ targets: [7,8,9,10,11], render: function(data, type, row) {
						if(data == null || data == '') { var data = '0원'; return data; }
						else { return numWithCommas(data)+"원"; }
					}, width: 50 }
				 ], 
				 fnRowCallback: function(row, data) {
					if(data.codename2 != undefined) {
						if(data.codename2.slice(-2) == '취소') {
							$('td', row).css('color', '#e52727');
						}
					}
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

/* 기간 tap 클릭 시 조회기간 변경 후 리스트 재조회 */
function clickDateTap(id) {
   var now = new Date();
   var startInputDate, startYear, startMonth, startDay;
   var endInputDate, endYear, endMonth, endDay;

   switch(id) {
      case 'today' :
         startInputDate = new Date();
         endInputDate = new Date();
         break;
      case 'yesterday' :
         startInputDate = getYesterdayDate(new Date());      // 어제 0시 0분 0초
         endInputDate = getYesterdayDate(new Date());      // 어제 23시 59분 59초
         break;
      case 'thisweek' :
         startInputDate = getWeekFirstDay(new Date());      // 금주 일요일부터
         endInputDate = new Date();                              // 오늘까지
         break;
      case 'lastweek' :
         var lastWeek = getSevenDayAgoDate(new Date());   // 일주일 전 날짜
         startInputDate = getWeekFirstDay(lastWeek);         // 전주 일요일부터
         endInputDate = getWeekLastDay(lastWeek);            // 전주 토요일까지
          break;
      case 'thismonth' :
         startInputDate = getMonthFirstDay(now);               // 당월 1일
         endInputDate = now;                                    // 오늘까지
         break;
      case 'lastmonth' :
         var monthAgo = getMonthAgoDate(now);
         startInputDate = getMonthFirstDay(monthAgo);      // 전월 1일
         endInputDate = getMonthLastDay(monthAgo);         // 전월 말일
         break;
   }
   startInputDate.setHours(0, 0, 0, 0); 
//   console.log(startInputDate);
//   console.log(endInputDate);
   
   startYear = startInputDate.getFullYear();
   startMonth =  ("0" + (startInputDate.getMonth() + 1)).slice(-2);
   startDay = ("0" + startInputDate.getDate()).slice(-2);
   endYear = endInputDate.getFullYear();
   endMonth =  ("0" + (endInputDate.getMonth() + 1)).slice(-2);
   endDay = ("0" + endInputDate.getDate()).slice(-2);
   
   startDate = startYear + '-' + startMonth + '-' + startDay;
   endDate = endYear + '-' + endMonth + '-' + endDay;
   
   // 검색 시작일
   $('#date1').val(startDate);   
   $('#date2').val(endDate);
   
   // 테이블 재조회
//   var pagecnt = $('[name=table_length] option:selected').val();
//   $('#table').DataTable().destroy();
//   $('#table_paginate').remove();
//   $('#table_length').remove();
//   $('#table_next').remove();
//   
//   dt(compcd, 1, pagecnt);
   
   $('#searchBtn').trigger('click');
}

/* 해당 날짜 주의 시작요일 날짜 구하기 (일요일) */
function getWeekFirstDay(d) {
    var day = d; // get current date
    var first = day.getDate() - day.getDay(); // First day is the day of the month - the day of the week
    var startDay = new Date(day.setDate(first)); 
    return startDay;
}

/* 해당 날짜 주의 끝요일 날짜 구하기 (토요일) */
function getWeekLastDay(d) {
    var day = d; // get current date
    var first = day.getDate() - day.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6
    var endDay = new Date(day.setDate(last)) 
    return endDay;
}

/* 해당 날짜 달의 첫날 구하기 */
function getMonthFirstDay(d) {
   var day = d;
   var firstDate = new Date(day.getFullYear(), day.getMonth(), 1);
   return firstDate;
}

/* 해당 날짜 달의 마지막날 구하기 */
function getMonthLastDay(d) {
   var day = d;
   var lastDate = new Date(day.getFullYear(), day.getMonth() + 1, 0);
   return lastDate;
}

/* 어제 날짜 구하기 */
function getYesterdayDate(d) {
   var day = d;
   var yesterday = new Date(day.setDate(day.getDate() - 1));
   return yesterday;
}

/* 일주일 전 날짜 구하기 */
function getSevenDayAgoDate(d) {
   var day = d;
   var dayOfMonth = day.getDate();
   day.setDate(dayOfMonth - 7);
   return day;
}

/* 한달 전 날짜 구하기 */
function getMonthAgoDate(d) {
   var day = d;
   var monthAgo = new Date(day.setDate(day.getMonth() - 2));
   return monthAgo;
}

// 페이징 처리
function paging(pageno, count) {
	$('.page-wrap a.paginate_button').remove();//만들어져 있던 페이지들 지우기
	$('.page-wrap #table_next').remove();//만들어져 있던 다음버튼 지우기
	$('.page-wrap #table_previous').remove();//만들어져 있던 이전버튼 지우기
	
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
				dt1(compcd, pageno, pagecnt);
			} else {//else(마지막 페이지 아닐때 다음페이지로 넘어가기)
				var pageno = Number(pageno) + 1;
				var pagecnt = $('[name=table_length] option:selected').val(); // 표시 건수
				
				$('.page-wrap .paginate_button').removeClass('current'); //원래 선택된 페이지 클래스 지우고
				$('.page-wrap .paginate_button[value='+pageno+']').attr('class','paginate_button current');
				
				$('#table').DataTable().destroy();
				$('#table_paginate').remove();
				$('#table_length').remove();
				dt1(compcd, pageno, pagecnt);
			}//else(마지막 페이지 아닐때 다음페이지로 넘어가기)
		});// 다음페이지 버튼 클릭시
		
		// 이전 페이지 버튼 클릭시
		$('.page-wrap .paginate_button.previous').click(function() {
			var pageno = $('.page-wrap .paginate_button.current').text();// 현재 페이지
			var pagecnt = $('[name=table_length] option:selected').val(); // 표시 건수
			var numPageGroup = Math.ceil(pageno/pageGroupSize);
			var startPage = pageGroupSize * ( numPageGroup - 1 ) + 1;//페이지 그룹의 첫번째 페이지
			var endPage = startPage + pageGroupSize - 1;//페이지 그룹의 마지막 페이지

//			console.log('startPage',startPage);
//			console.log('endPage',endPage);
			
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
				dt1(compcd, pageno, pagecnt);
			} else {//else(마지막 페이지 아닐때 다음페이지로 넘어가기)
				var pageno = Number(pageno) - 1;
				var pagecnt = $('[name=table_length] option:selected').val(); // 표시 건수
				
				$('.page-wrap .paginate_button').removeClass('current'); //원래 선택된 페이지 클래스 지우고
				$('.page-wrap .paginate_button[value='+pageno+']').attr('class','paginate_button current');
				
				$('#table').DataTable().destroy();
				$('#table_paginate').remove();
				$('#table_length').remove();
				dt1(compcd, pageno, pagecnt);
			}//else(마지막 페이지 아닐때 다음페이지로 넘어가기)
		});// 이전 페이지 버튼 클릭시
	}//if(result>0) -> 상품리스트가 존재할 때
}// 페이징 처리

	
// 상단집계 조회
function sell_top(compcd, sd1, sd2) {
	$.ajax({
		url: "sprod_top.do",
		data: { "compcd":compcd },
		success: function(result) {
//			console.log("상단집계", result);
			
			// 건수 조회
			if(result.totalcnt1 == null) { $("#totalcnt1").html("0건"); }// 당월 전체건수 
			else { $("#totalcnt1").html(numWithCommas(result.totalcnt1)+"건"); }
			if(result.etccnt1 == null) { $("#etccnt1").html("0건"); }// 당월 조제건수
			else { $("#etccnt1").html(numWithCommas(result.etccnt1)+"건"); }
			if(result.otccnt1 == null) { $("#otccnt1").html("0건"); }// 당월 일반건수
			else { $("#otccnt1").html(numWithCommas(result.otccnt1)+"건"); }
			if(result.totalcnt2 == null) { $("#totalcnt2").html("0건"); }// 금주 전체건수
			else { $("#totalcnt2").html(numWithCommas(result.totalcnt2)+"건"); }
			if(result.etccnt2 == null) { $("#etccnt2").html("0건"); }// 금주 조제건수
			else { $("#etccnt2").html(numWithCommas(result.etccnt2)+"건"); }
			if(result.otccnt2 == null) { $("#otccnt2").html("0건"); }// 금주 일반건수
			else { $("#otccnt2").html(numWithCommas(result.otccnt2)+"건"); }
			if(result.totalcnt3 == null) { $("#totalcnt3").html("0건");}// 당일 전체건수
			else { $("#totalcnt3").html(numWithCommas(result.totalcnt3)+"건"); }
			if(result.etccnt3 == null) { $("#etccnt3").html("0건"); }// 당일 조제건수
			else { $("#etccnt3").html(numWithCommas(result.etccnt3)+"건"); }
			if(result.otccnt3 == null) { $("#otccnt3").html("0건"); }// 당일 일반건수
			else { $("#otccnt3").html(numWithCommas(result.otccnt3)+"건"); }
			
			// 매출 조회
			if(result.totalamt1 == null) { $("#totalamt1").html("0원"); }// 당월 전체매출
			else { $("#totalamt1").html(numWithCommas(result.totalamt1)+"원"); }
			if(result.totalamt2 == null) { $("#totalamt2").html("0원"); }// 금주 전체매출
			else { $("#totalamt2").html(numWithCommas(result.totalamt2)+"원"); }
			if(result.totalamt3 == null) { $("#totalamt3").html("0원"); }// 당일 전체매출
			else { $("#totalamt3").html(numWithCommas(result.totalamt3)+"원");}
			
			if(result.etcamt1 == null) { $("#etcamt1").html('조제 매출<p class="square-price"><span class="square-target" data-target="0" data-speed="1" data-gap="1660"><span>0</span>원</span></p>'); }
			else { $("#etcamt1").html('조제 매출<p class="square-price"><span class="square-target" data-target="'+
					result.etcamt1 +'" data-speed="1" data-gap="1660"><span>'+numWithCommas(result.etcamt1)+'</span>원</span></p>'); }// 당월 조제매출
			if(result.etcamt2 == null) { $("#etcamt2").html('조제 매출<p class="square-price"><span class="square-target" data-target="0" data-speed="1" data-gap="1660"><span>0</span>원</span></p>'); }
			else { $("#etcamt2").html('조제 매출<p class="square-price"><span class="square-target" data-target="'+
					result.etcamt2 +'" data-speed="1" data-gap="1660"><span>'+numWithCommas(result.etcamt2)+'</span>원</span></p>'); }// 금주 조제매출
			if(result.etcamt3 == null) { $("#etcamt3").html('조제 매출<p class="square-price"><span class="square-target" data-target="0" data-speed="1" data-gap="1660"><span>0</span>원</span></p>'); }
			else { $("#etcamt3").html('조제 매출<p class="square-price"><span class="square-target" data-target="'+
					result.etcamt3 +'" data-speed="1" data-gap="1660"><span>'+numWithCommas(result.etcamt3)+'</span>원</span></p>');}// 당일 조제매출
			if(result.otcamt1 == null) { $("#otcamt1").html('일반 매출<p class="square-price"><span class="square-target" data-target="0" data-speed="1" data-gap="1660"><span>0</span>원</span></p>'); }
			else { $("#otcamt1").html('일반 매출<p class="square-price"><span class="square-target" data-target="'+
					result.otcamt1 +'" data-speed="1" data-gap="1660"><span>'+numWithCommas(result.otcamt1)+'</span>원</span></p>'); }// 당월 판매매출
			if(result.otcamt2 == null) { $("#otcamt2").html('일반 매출<p class="square-price"><span class="square-target" data-target="0" data-speed="1" data-gap="1660"><span>0</span>원</span></p>'); }
			else { $("#otcamt2").html('일반 매출<p class="square-price"><span class="square-target" data-target="'+
					result.otcamt2 +'" data-speed="1" data-gap="1660"><span>'+numWithCommas(result.otcamt2)+'</span>원</span></p>'); }// 금주 판매매출
			if(result.otcamt3 == null) { $("#otcamt3").html('일반 매출<p class="square-price"><span class="square-target" data-target="0" data-speed="1" data-gap="1660"><span>0</span>원</span></p>'); }
			else { $("#otcamt3").html('일반 매출<p class="square-price"><span class="square-target" data-target="'+
					result.otcamt3 +'" data-speed="1" data-gap="1660"><span>'+numWithCommas(result.otcamt3)+'</span>원</span></p>'); }// 당일 판매매출

			square_target();
		},//success
		error: function() { alert("오류"); }
	});//ajax
}//상단집계 조회

//천단위 콤마 찍기
function numWithCommas(x) {
	return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function enterkey() {
	if(window.event.keyCode == 13) {
		$('#searchBtn').click();
	}
}// 엔터키 발생 이벤트