 /* datatable */
$(document).ready(function() {
	
	var compcd = $('#compcd').val();
	var corpnum = $("#corpnum").val();
	
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
	
	var searchDate1 = $('[name=searchDate1]').val();
	var searchDate2 = $('[name=searchDate2]').val();
	var sd1 = searchDate1.replace(/-/g,"");
	var sd2 = searchDate2.replace(/-/g,"");
	
	var pagecnt = $('[name=table_length] option:selected').val();
	var pageno = $('.paginate_button.current').text();
	if(pagecnt == 'undefined' || pagecnt == null || pagecnt == '') { pagecnt = '12'; }
	if(pageno == 'undefined' || pageno == null || pageno == '' || pageno < 0) { pageno = '1'; }
	
	dt1(compcd, pageno, pagecnt);//데이터테이블 조회
	
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
	});// 검색 버튼
	
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
   console.log(startInputDate);
   console.log(endInputDate);
   
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

// 데이터 테이블
function dt1(compcd, pageno, pagecnt) {
	var search1 = $('[name=search1] option:selected').val();
	var searchInput = $('[name=searchInput]').val();
	var searchDate1 = $('[name=searchDate1]').val();
	var searchDate2 = $('[name=searchDate2]').val();
	
	var sd1 = searchDate1.replace(/-/g,"");
	var sd2 = searchDate2.replace(/-/g,"");
	
	var table = $("#table").DataTable({
		"dom": '<"top"il>t<"bottom center"><"clear">',
		 // l(페이지당),f(검색),i(전체),p(페이저),t,r
		 ajax: {
			 url: "/ssell2_list.do",
			 data: {
				 "compcd":compcd,
				 "search1":search1,
				 "searchInput":searchInput,
				 "searchDate1":sd1,
				 "searchDate2":sd2,
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
				 console.log('가맹점 상품관리 리스트', result.data);
				 var data = result.data;
				 return data;
			 }
		 }, 
		 columns: [
			{ data: "no" },//NO 0
			{ data: "salesday" },//판매일자 1
			{ data: "productname" },//상품명 2
			{ data: "maker" },//제조사 3
			{ data: "unit" },//단위 4
			{ data: "spec" },//규격5
			{ data: "packingunit" },//포장수량6
			{ data: "cnt" },//총판매수량
			{ data: "discount" },//총할인금액
			{ data: "total" },//총판매금액
			{ data: "purtot" },//총사입가
			{ data: "margin" },//마진
		 ],
		 columnDefs: [
			 { targets: [0], width: 25 },
			 { targets: [1], render: function(data, type, row) {
				 return data.substr(0,4)+"-"+data.substr(4,2)+"-"+data.substr(6,2);
			 }, width: 80 },
			 { targets: [2], render: function(data, type, row) {
				 if(data.length > 20) { var short = data.substr(0,19)+"..."; }  
				 else { var short = data; }
				 return '<div class="productname"><div class="productname-hover"><span class="productname-line">'
				 +data+'</span><span class="tri"></span></div>'+short+'</div>';
			 }, width: 250 },
			 { targets: [3], render: function(data, type, row) {
				 if(data.length > 10) { var short = data.substr(0,9)+"..."; }  
				 else { var short = data; }
				 return '<div class="productname"><div class="productname-hover"><span class="productname-line">'
				 +data+'</span><span class="tri"></span></div>'+short+'</div>';
			 }, width: 100 },
			 { targets: [4, 5], render: function(data, type, row) {
				if(data == null || data == '') { var data = '-'; return data; } 
				else { return data; }
			 } },
			 { targets: [6, 7], width: 70},
			 { targets: [8, 9, 10], render: function(data, type, row) {
				 return numWithCommas(data)+"원";
			 }, width: 85 },
			 { targets: [11], render: function(data, type, row) {
				 if(row.purtot == 0) { var html = numWithCommas(data)+'원 <span style="color: red;">('
					 +numWithCommas(row.total)+'%)</span>'; }
				 else {var html = numWithCommas(data)+'원 <span style="color: red;">('
					 +Math.round((row.total - row.purtot)/row.purtot * 100 * 100)/ 100+'%)</span>';}
				 return html;
			 }, width: 140 }
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
		});
		$.fn.DataTable.ext.pager.numbers_length = 10;

		$('#table_paginate').appendTo('.page-wrap');
		$('#table_length').prependTo('.length-wrap');
		$('.dataTables_info').prependTo('#table_length');
		$('.btnexcel').appendTo('.bf-wrap');
}//dt1(데이터 테이블)




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

function enterkey() {
	if(window.event.keyCode == 13) {
		$('#searchBtn').click();
	}
}// 엔터키 발생 이벤트
//천단위 콤마 찍기
function numWithCommas(x) {
	return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}