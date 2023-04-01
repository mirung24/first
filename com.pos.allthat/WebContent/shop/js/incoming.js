 /* datatable */
$(document).ready(function() {

	var compcd = $('#compcd').val(); // 가맹점 코드
	var regcd = $('#regcd').val();// 사용자 코드
	
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
	if(pagecnt == 'undefined' || pagecnt == null || pagecnt == '') { pagecnt = '10'; }
	if(pageno == 'undefined' || pageno == null || pageno == '' || pageno < 0) { pageno = '1'; }
	
	account_list(compcd);// 거래처 리스트 가져오기
	sincome_top(compcd, sd1, sd2);// 상단집계 조회
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
		sincome_top(compcd, sd1, sd2);//상단집계 재조회
	});// 검색 버튼 
	
	// tr 클릭 이벤트
	$('#table tbody').on( 'click', 'tr', function () {
		var purchasecd = $(this).children('td:eq(7)').text();//구매코드
		var count = $(this).children('td:eq(7)').length;
		
		if(count > 0) {
			$(".box-show").css("display", "block");
			
			$('#table tbody tr').removeClass('selected');
			$(this).addClass('selected');
			
			detailList(purchasecd);//상세보기 조회
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
	
	// 상품 추가 검색 버튼
	$(document).on('click','#searchBtn2', function() {
		var compcd = $('#compcd').val();
		var search4 = $('[name=search4] option:selected').val();
		var searchInput2 = $('[name=searchInput2]').val();
		
		if(searchInput2 == null || searchInput2 == '') {
			swal({title: "검색어를 입력하세요.", button: "확인"})
			.then(function() {
				swal.close(); 
				$('[name=searchInput2]').focus();
				return false;
			})
		} else {
			regi_list(compcd, search4, searchInput2);
		}
	});// 상품 추가 검색 버튼
	
	income_regi();//입고서 등록
	
	// 입고삭제 버튼
	$(document).on('click','#removeBtn', function() {
		var purchasecd = $('#table tbody tr.selected').children().eq(7).text();
		swal({
			title: '입고서를 삭제하시겠습니까?',
			icon: 'info',
			buttons: true,
			imfoMode: true,
			buttons: ["취소", "확인"]
		}).then(function(willDelete) {
			if(willDelete) {
				remove_income(compcd, purchasecd, regcd);
			}
		});//swal then
	});// 입고삭제 버튼
	
 });//ready

$(document).ajaxStart(function () {
    $('#loading').show(); // ajax 시작 -> 로딩바 표출
});

$(document).ajaxStop(function () {
    $('#loading').hide(); // ajax 끝 -> 로딩바 히든
});

//데이터 테이블(리스트 조회)
function dt1(compcd, pageno, pagecnt) {
	
	var search1 = $('[name=search1] option:selected').val();
	var searchInput = $('[name=searchInput]').val();
	var search2 = $('[name=search2] option:selected').val();
	var searchDate1 = $('[name=searchDate1]').val();
	var searchDate2 = $('[name=searchDate2]').val();
	var accountcd = $('[name=search3] option:selected').val();
	
	if(accountcd==undefined) { accountcd='all'; }
	
	var sd1 = searchDate1.replace(/-/g,"");
	var sd2 = searchDate2.replace(/-/g,"");
	
	var table = $("#table").DataTable({
		 "dom": '<"top"il>t<"bottom center"><"clear">',
		 // l(페이지당),f(검색),i(전체),p(페이저),t,r
		 ajax: {
			 url: "/sincome_list.do",
			 data: {
				 "compcd":compcd,
				 "search1":search1,
				 "searchInput":searchInput,
				 "search2":search2,
				 "searchDate1":sd1,
				 "searchDate2":sd2,
				 "accountcd":accountcd,
				 "pageno":pageno,
				 "pagecnt":pagecnt
			 },
			 complete: function(result) {
				 console.log('complete', result.responseJSON);
				 var count = result.responseJSON.count;
			     $('#table_info').html('전체  <span>'+numWithCommas(count)+'</span> 건'); // 전체 건수 표시
			     paging(pageno, pagecnt);
			 },
			 error: function() { alert("오류"); },
			 dataSrc: function(result) {
				 console.log('가맹점 입고관리 리스트', result);
				 var data = result.data;
				 return data;
			 }
		 },//ajax
		 columns: [
			{ data: "no", width: "3%" },//no
			{ data: "purdate", width: "10%" },//입고일자
			{ data: "accountname", width: "15%" },//거래처
			{ data: "amt" },//금액
			{ data: "vat" },//부과세
			{ data: "discount" },//할인
			{ data: "total" },//총금액
			{ data: "purchasecd" }//구매코드
		 ],
		 columnDefs: [
			{ targets: [1], render: function(data, type, row) {
				return data.substr(0, 11);
			} },
			{ targets: [3,4,5,6], render: function(data, type, row) {
				if(data == null || data == '') { var data = '0원'; return data;}
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
		 }],//buttons
	});//table
	$.fn.DataTable.ext.pager.numbers_length = 10;

//	$('#table tbody').on('click', function () {
//		$(".box-show").css("display", "block");
//	});

	$('#table_paginate').appendTo('.page-wrap');
	$('#table_length').prependTo('.length-wrap');
	$('.dataTables_info').prependTo('#table_length');
	$('.btnexcel').appendTo('.bf-wrap');
}//데이터 테이블(리스트 조회)

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

// 거래처 리스트 가져오기(select)
function account_list(compcd) {
	$.ajax({
		url: "com_account.do",
		data: { "compcd":compcd },
		success: function(result) {
			console.log('거래처 리스트', result);
			util.MakeSelAccount($('#account'), result.data, result.data.accountname, '전체');
			util.MakeSelAccount($('#account2'), result.data, result.data.accountname, '선택');
			
			account(result);//공급처명 select가 변하면 정보 넣기
		},
		error: function() { alert("오류"); }
	});//ajax
}// 거래처 리스트 가져오기(select)

// 과세 select 가져오기
function tax_sel() {
	$.ajax({
		url: "com_tax.do",
		data: { "upcode":"CO1082" },
		success: function(result) {
			console.log(result);
			util.MakeSelOptions($('.tax'), result.data, result.data[0].codename, '');
		}
	});//ajax
}//tax_sel

// 상단집계 조회
function sincome_top(compcd, sd1, sd2) {
	$.ajax({
		url: "sincome_top.do",
		data: {
			"compcd":compcd,
			"searchDate1":sd1,
			"searchDate2":sd2
		}, 
		success: function(result) {
			console.log(result.data);
			
			$('#total-cnt1').html(numWithCommas(result.data[0].total)+"원"+"<span class='square-target' data-speed='1' data-target='"
					+result.data[0].cnt+"' data-gap='2059'>(<span></span>건)</span>");
			$('#acnt1').html("당월 입고 거래처수 / "+result.data[0].acnt+"개");
			
			$('#total-cnt2').html(numWithCommas(result.data[1].total)+"원"+"<span class='square-target' data-speed='1' data-target='"
					+result.data[1].cnt+"' data-gap='2059'>(<span></span>건)</span>");
			$('#acnt2').html("입고일자 거래처수 / "+result.data[1].acnt+"개");
			
			square_target();
		},
		error: function() { alert("오류"); }
	});//ajax
}// 상단집계 조회

// 상세보기 리스트 조회
function detailList(purchasecd) {
	$.ajax({
		url: "sincome_detail.do",
		data: { "purchasecd":purchasecd },
		success: function(result) {
			console.log('상세보기 리스트 조회',result);
			
			let html = "";
			const count = result.data.length;
			
			if(count > 0) {
				for(var i = 0; i < count; i++) {
					var productname = result.data[i].productname;
					if(productname.length > 13) {
						var productname = productname.substr(0, 13)+"..";
					}
					
					var maker = result.data[i].maker;
					if(maker.length > 8) {
						var maker = maker.substr(0, 7)+"..";
					}
					html += "<tr>"
					html +=		"<td>"+result.data[i].no+"</td>"
					html +=		"<td style='display: none;'>"+result.data[i].productcd+"</td>"
					html +=		"<td><div class='productname'><div class='productname-hover'><span class='productname-line'>"+result.data[i].productcd+"</span>"
					html += 			"<span class='tri'></span></div>"+productname+"</div></td>"
					html +=		"<td><div class='productname'><div class='productname-hover'><span class='productname-line'>"+result.data[i].maker+"</span>"
					html += 			"<span class='tri'></span></div>"+maker+"</div></td>"
					html +=		"<td>"+result.data[i].packingunit+"</td>"
					if(result.data[i].unit == '' && result.data[i].spec != '') {
						html +=		"<td>"+result.data[i].spec+"</td>"
					} else if(result.data[i].spec == '' && result.data[i].unit == '') {
						html +=		"<td>-</td>"
					} else {
						html +=		"<td>"+result.data[i].spec+"("+result.data[i].unit+")</td>"
					}
					html +=		"<td>"+numWithCommas(result.data[i].price)+"원</td>"
					html +=		"<td>"+numWithCommas(result.data[i].cnt)+"개</td>"
					html +=		"<td>"+numWithCommas(result.data[i].amt)+"원</td>"
					html +=		"<td>"+numWithCommas(result.data[i].discount)+"원</td>"
					html +=		"<td>"+numWithCommas(result.data[i].vat)+"원</td>"
					html +=		"<td>"+numWithCommas(result.data[i].total)+"원</td>"
					html += "</tr>"
				}//for
			}//if
			$('.detail_list').html(html);			
		},
		error: function() { alert("오류"); }
	});//ajax
}// 상세보기 리스트 조회

// 입고서 등록 -> 공급처명 바꾸면 내용들 자동으로 입력 시키기
function account(result) {
	console.log('안',result);
	var count = result.data.length;

	$('[name=account2]').change(function() {
		console.log("change");
		console.log($('[name=account2] option:selected').val());
		console.log(result.data[0].corporatenumber);
		for(var i = 0; i < count; i++) {
			console.log("for");
			if($('[name=account2] option:selected').val() == result.data[i].accountcd) {
				console.log("if문");
				$('#cornum').text(autoCorpHyphen(result.data[i].corporatenumber));//사업자 번호
				$('#busi').text(result.data[i].business);//업태
				$('#sect').text(result.data[i].sectors);//업종
				$('#presi').text(result.data[i].president);//대표자
				$('#mana').text(result.data[i].manager);//담당자
				$('#em').text(result.data[i].email);//이메일
				$('#te').text(result.data[i].tel);//전화번호
				$('#ad').text(result.data[i].addr);//주소
				
				return;
			}
			if(i > 0) {
				if($('[name=account2] option:selected').val() != result.data[i].accountcd) {
					swal({title: "공급자를 선택하세요.", button: "확인"})
					.then(function() {
						swal.close(); 
						$('#cornum').text('');//사업자 번호
						$('#busi').text('');//업태
						$('#sect').text('');//업종
						$('#presi').text('');//대표자
						$('#mana').text('');//담당자
						$('#em').text('');//이메일
						$('#te').text('');//전화번호
						$('#ad').text('');//주소
						return false;
					})
				}
			}
		}
	});//change
}// 입고서 등록 -> 공급처명 바꾸면 내용들 자동으로 입력 시키기

// 상품추가 리스트 조회
function regi_list(compcd, search4, searchInput2) {
	if(searchInput2.length < 3) {
		swal({title: "3자리 이상 입력하세요.", button: "확인"})
		.then(function() {
			swal.close(); 
			$('[name=searchInput2]').focus();
			return false;
		})
	} else {
		$.ajax({
			url: "sincome_regiList.do",
			data: {
				"compcd":compcd,
				"search4":search4,
				"searchInput2":searchInput2
			},
			success: function(result) {
				console.log('상품추가 리스트',result);
				
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
						html += "<tr>"
						html +=		"<td>"+result.data[i].productcd+"</td>"
						html +=		"<td>"+result.data[i].productname+"</td>"
						html +=		"<td>"+result.data[i].maker+"</td>"
						html +=		"<td>"+result.data[i].spec+"</td>"
						html +=		"<td>"+result.data[i].packingunit+"</td>"
						html +=		"<td><div class='custom-control custom-checkbox'><input id='magicBtn"+(i+1)+"' type='checkbox'"
						html +=			"class='custom-control-input' name='regiChk'><label class='custom-control-label'"
						html +=					"for='magicBtn"+(i+1)+"'></label></div></td>"
						html +=		"<td style='display:none;'>"+result.data[i].unit+"</td>"
						html +=		"<td style='display:none;'>"+result.data[i].productid+"</td>"
						html += "</tr>"
					}//for
				}//if
				$('.regi_list').html(html);	
			},
			error: function() { alert("오류"); }
		});//ajax
	}//else
}//regi_list

// 상품선택 후 화살표 클릭하면 배열로 받기
$(document).on('click','#addListBtn', function() {
	var chkProd = [];
	var chk = {};
	
	$('input:checkbox[name=regiChk]').each(function(i) {
		if($(this).is(":checked") == true) {
			var productcd = $(this).parent().parent().parent().children("td:eq(0)").text();
			var productname = $(this).parent().parent().parent().children("td:eq(1)").text();
			var maker = $(this).parent().parent().parent().children("td:eq(2)").text();
			var spec = $(this).parent().parent().parent().children("td:eq(3)").text();
			var packingunit = $(this).parent().parent().parent().children("td:eq(4)").text();
			var unit = $(this).parent().parent().parent().children("td:eq(6)").text();
			var productid = $(this).parent().parent().parent().children("td:eq(7)").text();
			
			var chk = {"productcd":productcd, "productname":productname
			, "maker":maker, "spec":spec, "packingunit":packingunit, "unit":unit, "productid":productid};
			chkProd.push(chk);
		}//if
	});//each
	console.log(chkProd);
	regi_sel(chkProd);
	$('input:checkbox[name=regiChk]').prop('checked', false);
});// 상품선택 후 화살표 클릭하면 배열로 받기

// 선택된 상품 리스트 뿌리기
function regi_sel(arr) {
	let html;
	const count = arr.length;
	
	if(count > 0) {
		for(var i = 0; i < count; i++) {
			html += "<tr>"
			html +=		"<td>"+arr[i].productcd+"</td>"
			html +=		"<td>"+arr[i].productname+"</td>"
			html +=		"<td>"+arr[i].maker+"</td>"
			if(arr[i].unit == '' && arr[i].spec != '') {
				html +=		"<td>"+arr[i].spec+"</td>"
			} else if(arr[i].unit == '' && arr[i].spec == '') {
				html +=		"<td>-</td>"
			} else {
				html +=		"<td>"+arr[i].spec+"("+arr[i].unit+")</td>"
			}
			html +=		"<td>"+arr[i].packingunit+"</td>"
			html +=		"<td><i class='fa-solid fa-xmark' name='xmark'></i></td>"
			html +=		"<td style='display: none;'>"+arr[i].productid+"</td>"
			html += "</tr>"
		}//for
	}//if
	$('.regi_sel').append(html);
}// 선택된 상품 리스트 뿌리기

// xmark 클릭하면 없애기
$(document).on('click', '[name=xmark]', function(){
//	console.log($(this).parent().parent().children("td:eq(0)").text());
	$(this).parent().parent().remove();
});// xmark 클릭하면 없애기

// 선택완료 버튼
$(document).on('click', '#selBtn', function(){
	var count1 = $('.regi_sel').children('tr').length;
	console.log(count1);
	
	if(count1 == 0) {
		swal({title: "상품을 선택하세요.", button: "확인"})
		.then(function() { swal.close(); return false; })
	}
	
	if(count1 > 0) {
		var selProd = [];
		var prod = {};
		
		for(var i = 0; i < count1; i++) {
			var productcd = $('.regi_sel').children('tr:eq('+i+')').children('td:eq(0)').text();
			var productname = $('.regi_sel').children('tr:eq('+i+')').children('td:eq(1)').text();
			var maker = $('.regi_sel').children('tr:eq('+i+')').children('td:eq(2)').text();
			var specunit = $('.regi_sel').children('tr:eq('+i+')').children('td:eq(3)').text();
			var packingunit = $('.regi_sel').children('tr:eq('+i+')').children('td:eq(4)').text();
			var productid = $('.regi_sel').children('tr:eq('+i+')').children('td:eq(6)').text();

			prod = {}; //초기화 시킴 (이전 것을 참조하기 때문)
			prod.productcd = productcd;//object {}에 추가
			prod.productname = productname;
			prod.maker = maker;
			prod.specunit = specunit;
			prod.packingunit = packingunit;
			prod.productid = productid;
				
			console.log(prod);
			selProd.push(prod); // 배열에 추가
		}//for(i)
		console.log(selProd);
		
		$(".modal-wrap1").css({"display": "none"});// 상품추가 화면 닫기
		
		let html;
		const count2 = selProd.length;
		
		if(count2 > 0) {
			for(var i = 0; i < count2; i++) {
				html += "<tr>"
				html +=		"<td><input class='form-control form-control-sm' type='text' value='"+selProd[i].productcd+"' readonly='true' id='productcd"+(i+1)+"'></td>"
				html +=		"<td><input class='form-control form-control-sm' type='text' value='"+selProd[i].productname+"' readonly='true' style='width: 10rem;' id='productname"+(i+1)+"'></td>"
				html +=		"<td><input class='form-control form-control-sm' type='text' value='"+selProd[i].maker+"' readonly='true' id='maker"+(i+1)+"'></td>"
				html +=		"<td><input class='form-control form-control-sm' type='text' value='"+selProd[i].packingunit+"' readonly='true' style='width: 3.5rem;' id='packingunit"+(i+1)+"'></td>"
				html +=		"<td><input class='form-control form-control-sm' type='text' value='"+selProd[i].specunit+"' readonly='true' style='width: 4rem;' id='specunit"+(i+1)+"'></td>"
				html +=		"<td><select class='form-control text-center tax' style='width: 5.5rem;' id='tax"+(i+1)+"' onchange='javascript:setAmt("+(i+1)+")'></select></td>"
				html +=		"<td><input class='form-control form-control-sm' type='text' style='width: 3.5rem; text-align: right;' id='price"+(i+1)+"' name='price' onkeyup='javascript:setAmt("+(i+1)+")'></td>"
				html +=		"<td><input class='form-control form-control-sm' type='text' style='width: 3.5rem; text-align: right;' id='cnt"+(i+1)+"' name='cnt' onkeyup='javascript:setAmt("+(i+1)+")'></td>"
				html +=		"<td><input class='form-control form-control-sm' type='text' readonly='true' id='amt"+(i+1)+"' style='text-align: right; width: 3.5rem;'></td>"
				html +=		"<td><input class='form-control form-control-sm' type='text' readonly='true' id='vat"+(i+1)+"' style='text-align: right; width: 2.5rem;'></td>"
				html +=		"<td><input class='form-control form-control-sm' type='text' id='discount"+(i+1)+"' name='discount' onkeyup='javascript:setAmt("+(i+1)+")' style='text-align: right; width: 2.5rem;'></td>"
				html +=		"<td><input class='form-control form-control-sm' type='text' readonly='true' id='total"+(i+1)+"' style='text-align: right; width: 3.5rem;'></td>"
				html +=		"<td><input class='form-control form-control-sm' type='text' id='expirydate"+(i+1)+"' style='text-align: right; width: 3.5rem;' maxlength='8' onkeyup='javascript:numberOnly("+(i+1)+")'></td>"
				html +=		"<td><input class='form-control form-control-sm' type='text' id='lotno"+(i+1)+"' style='text-align: right; width: 3.5rem;'></td>"
				html +=		"<td style='display: none;'><input class='form-control form-control-sm' type='text' id='productid"+(i+1)+"' value='"+selProd[i].productid+"'></td>"
				html += "</tr>"
			}//for
		}//if
		tax_sel();// 과세 select 자동으로 만들기
		$('.regi_income').append(html);
	}//if
});// 선택완료 버튼

// 입고서 등록
function income_regi() {
	$(document).on('click', '#incomeRegiBtn', function(){// 입고서 등록 저장 버튼을 클릭했을 경우
		var count = $('.regi_income').children('tr').length; // 상품 리스트 길이
		var account2 = $('[name=account2] option:selected').val();// 공급처 선택한 옵션
		
		if(count == 0) {// 추가한 상품이 없을 경우
			console.log("count=0");
			swal({title: "상품을 추가하세요.", button: "확인"})
			.then(function() { swal.close(); $('.pop-link1').focus(); return false; })
		}
		else if(account2 == 'all') {// 공급처 select 선택했는지
			console.log("account2");
			swal({title: "공급처를 선택하세요.", button: "확인"})
			.then(function() { swal.close(); $('#account2').focus(); return false; })
		}
		else if(count > 0) {// 추가한 상품이 존재할 경우
			var cnt = 0;
			for(var i = 0; i < count; i++) {// 단가, 수량이 적혀있는지 확인
				if($('#total'+(i+1)+'').val().length == 0 || $('#total'+(i+1)+'').val() == '' || $('#total'+(i+1)+'').val() == '0') {
					cnt++;
				}//if
			}//for
			if(cnt > 0)	{// 단가, 수량이 없는 경우 alert 띄우기
				swal({title: "단가, 수량을 확인하세요.", button: "확인"})
				.then(function() { swal.close(); return false; })
			}// if
			else {// 모든 조건 통과하면 저장하러 이동하기~
				var regiProd = [];
				var prod = {};
				
				for(var i = 0; i < count; i++) {//배열 만드는  for문
					var productcd = $('#productcd'+(i+1)+'').val();//제품코드
					var productname = $('#productname'+(i+1)+'').val();	//제품이름
					var maker = $('#maker'+(i+1)+'').val();	//제조사
					var packingunit = $('#packingunit'+(i+1)+'').val();//포장수량	
					var specunit = $('#specunit'+(i+1)+'').val();//규격(단위)
					var tax = $('#tax'+(i+1)+' option:selected').val();	// 과세
					var price = $('#price'+(i+1)+'').val();	//단가
					var cnt = $('#cnt'+(i+1)+'').val();	// 수량	
					var amt = $('#amt'+(i+1)+'').val();	//금액
					var vat = $('#vat'+(i+1)+'').val();	//부과세
					var discount = $('#discount'+(i+1)+'').val();//할인가		
					var total = $('#total'+(i+1)+'').val();	//합계
					var expirydate = $('#expirydate'+(i+1)+'').val();//유효기간
					var lotno = $('#lotno'+(i+1)+'').val();	//로트번호
					var productid = $('#productid'+(i+1)+'').val();	//제품아이디
	
					if(specunit == '-') {
						var spec = '';
						var unit = '';
					} else {
						var sp = specunit.split('(');//하나로 묶여있는 규격(단위)를 나누기
						var spec = sp[0];// 규격
						var unit = sp[1].replace(')','');//단위
					}
					
					if(discount == '') { discount = '0'; }// 할인가를 적지 않은 경우 -> 0으로 만들기
					
					prod = {}; //초기화 시킴 (이전 것을 참조하기 때문)
					prod.productcd = productcd;//제품코드 //object {}에 추가
					prod.productname = productname;//제품이름
					prod.maker = maker;//제조사
					prod.spec = spec;//규격
					prod.unit = unit;//단위
					prod.packingunit = packingunit;//포장수량
					prod.tax = tax;//과세
					prod.price = price;//단가
					prod.cnt = cnt;//수량
					prod.amt = commasRemove(amt);//금액
					prod.vat = commasRemove(vat);//부과세
					prod.discount = discount;//할인가
					prod.total = commasRemove(total);//합계
					prod.expirydate = expirydate;//유효기간
					prod.lotno = lotno;//로트번호
					prod.productid = productid;//로트번호
	
					console.log(prod);
					regiProd.push(prod); // 배열에 추가
				}//for
				console.log(regiProd); //배열보기
				incomimg(regiProd); // 입고서 저장하기(ajax로 보냄)
			}//else
		}//else if
	});//저장 버튼 클릭
}// 입고서 등록

// 입고서 등록 금액 계산
function setAmt(i) {
	var tax = $('#tax'+i+' option:selected').val();
	
	// 금액
	var price = $('#price'+i+'').val();
	var p1 = price.replace(/[^0-9]/g,"");
	$('#price'+i+'').val(p1);
	var price = $('#price'+i+'').val();// 단가
	
	var cnt = $('#cnt'+i+'').val();
	var c1 = cnt.replace(/[^0-9]/g,"");
	$('#cnt'+i+'').val(c1);
	var cnt = $('#cnt'+i+'').val();// 수량
	
	var amt = price*cnt;
	$('#amt'+i+'').val(numWithCommas(amt));
	
	// 부가세
	if(tax == 'CO2084' || tax == 'CO2085') { // 과세가 비과세, 과세포함이면 0
		$('#vat'+i+'').val('0');
	} else {
		var amt = $('#amt'+i+'').val().replace(/,/g,"");
		var vat = amt/10;
		$('#vat'+i+'').val(numWithCommas(vat));
	}
	
	// 합계
	var amt = Number($('#amt'+i+'').val().replace(/,/g,""));
	var vat = Number($('#vat'+i+'').val().replace(/,/g,""));
	
	var discount = $('#discount'+i+'').val();
	var d1 = discount.replace(/[^0-9]/g,"");
	$('#discount'+i+'').val(d1);
	var discount = $('#discount'+i+'').val();//할인가
	
	var total = amt + vat - discount;
	$('#total'+i+'').val(numWithCommas(total));
}// 입고서 등록 금액 계산

// 입고서 등록 유효기간 : 숫자만 입력할 수 있도록
function numberOnly(i) {
	var expirydate = $('#expirydate'+i+'').val();
	var test = expirydate.replace(/[^0-9]/g,"");
	$('#expirydate'+i+'').val(test);
}

// 입고서 저장하기
function incomimg(regiProd) {
	var compcd = $('#compcd').val();// 가맹점 코드
	var regcd = $('#regcd').val();// 사용자 코드
	var account2 = $('[name=account2] option:selected').val();// 거래처 코드
	
	swal({
		title: '입고서를 저장하시겠습니까?',
		icon: 'info',
		buttons: true,
		imfoMode: true,
		buttons: ["취소", "확인"]
	}).then(function(willDelete) {
		if(willDelete) {
			$.ajax({
				url: "sincome_regi.do",
				data: {
					"regiArr":JSON.stringify(regiProd),
					"compcd":compcd,
					"regcd":regcd,
					"account2":account2
				},
				success: function(result) {
					console.log(result);
					swal({
						title: '등록이 완료되었습니다.',
						type: 'success',
						icon: "success",
						button: "확인"
					}).then(function(willDelete) {
						location.href = "/sincoming.do?title=입고관리&name=입고관리";
					});
				},
				error: function(){ alert("오류"); }
			});//ajax
		}//if(willDelete)
	});//swal then
	
}//incoming

// 입고서 삭제
function remove_income(compcd, purchasecd, regcd) {
	var count = $('.detail_list tr').length;
	console.log('길이', count);
	
	var cnt = [];
	var packingunit = [];
	
	for(var i = 0; i < count; i++) {
		var c = $('.detail_list tr').eq(i).children().eq(7).text();//수량
		c = c.replaceAll('개', '');
		
		var p = $('.detail_list tr').eq(i).children().eq(4).text();//포장수량

		cnt.push(c);
		packingunit.push(p);
	}//for
	console.log(JSON.stringify(cnt));
	console.log(JSON.stringify(packingunit));
	
	$.ajax({
		url: "remove_sincome.do",
		data: {
			"compcd":compcd,
			"regcd":regcd,
			"purchasecd":purchasecd,
			"cnts":JSON.stringify(cnt),
			"packingunit":JSON.stringify(packingunit)
		},
		success: function(result) {
			swal({
				title: '삭제가 완료되었습니다.',
				type: 'success',
				icon: "success",
				button: "확인"
			}).then(function(willDelete) {
				location.href = "/sincoming.do?title=입고관리&name=입고관리";
			});
		},//success
		error: function() { alert("오류"); }
	});//ajax
}//remove_income

/*modal */
$(".pop-link1").click(function(){
	$(".modal-wrap1").css({"display": "flex"});
	$('.regi_sel').children('tr').remove();//상품 추가의 추가된 리스트 비우기
});
$(".pop-close1").click(function(){
	$(".modal-wrap1").css({"display": "none"});
});

 /*moda2 */
$(".pop-link2").click(function(){
	$(".modal-wrap2").css({"display": "flex"});
	tax_sel();
});
$(".pop-close2").click(function(){
	$(".modal-wrap2").css({"display": "none"});
	$('.regi_income').children('tr').remove();//입고서 등록의 리스트 비우기
});

//천단위 콤마 찍기
function numWithCommas(x) {
	return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//천단위 콤마 제거
function commasRemove(x) {
	return String(x).replace(/,/g, "");
}
//사업자번호 자동으로 하이픈 넣기
function autoCorpHyphen(x) {
	return String(x).replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
}
function enterkey() {
	if(window.event.keyCode == 13) {
		$('#searchBtn').click();
	}
}// 엔터키 발생 이벤트



















