 /* datatable */
$(document).ready(function() {
	
	var compcd = $('#compcd').val(); // 가맹점 코드
	
	// y,n 유무에 따라 보이기/숨기기 설정 (디폴트는 숨기기)
	$.ajax({
		url: "connectyn.do",
		data: { "compcd":compcd },
		success: function(result) {
			console.log('yn 유무',result.data);
			if(result.data == 'N') {
				$('.connectyn').css('display', 'block');
			}
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
	
	var search2 = $('[name=search2] option:selected').val();
	var searchDate1 = $('[name=searchDate1]').val();
	var searchDate2 = $('[name=searchDate2]').val();
	var sd1 = searchDate1.replace(/-/g,"");
	var sd2 = searchDate2.replace(/-/g,"");
	
	var pagecnt = $('[name=table_length] option:selected').val();
	var pageno = $('.paginate_button.current').text();
	if(pagecnt == 'undefined' || pagecnt == null || pagecnt == '') { pagecnt = '12'; }
	if(pageno == 'undefined' || pageno == null || pageno == '' || pageno < 0) { pageno = '1'; }
	
	dt1(compcd, pageno, pagecnt);// 재고 리스트 조회(데이터 테이블)
	account_list(compcd);// 거래처 리스트 조회
	
	// 검색 option 변경시 리스트 재조회
	$(document).on('click','#searchBtn', function() {
		var pagecnt = $('[name=table_length] option:selected').val();
		
		$('#table').DataTable().destroy();
		$('#table_paginate').remove();
		$('#table_length').remove();
		
		dt1(compcd, 1, pagecnt);
	});// 검색 버튼 
	
	// tr 클릭 이벤트
	$('#table tbody').on( 'click', 'tr', function () {
		$('#table tbody tr').removeClass('selected');
		$(this).addClass('selected');
		
		var productid = $(this).children('td:eq(1)').text();
		
		$.ajax({
			url: "sinven_sel.do",
			data: {
				"compcd":compcd,
				"productid":productid
			},
			success: function(result) {
				console.log('가맹점 재고관리 상세보기 리스트', result.data);
				
				let html = "";
				const count = result.data.length;
				
//				if(count == 0) {
//					
//				}
				if(count > 0) {
					for(var i = 0; i < count; i++) {
						if(result.data[i].name == '' || result.data[i].name == null) {
							result.data[i].name = '-';
						}
						html += "<tr>"
						html += 	"<td>"+result.data[i].no+"</td>"
						html += 	"<td>"+result.data[i].stockgubn+"</td>"
						html += 	"<td style='text-align: center !important;'>"+result.data[i].name+"</td>"
						html += 	"<td>"+result.data[i].dat+"</td>"
						html += 	"<td>"+numWithCommas(result.data[i].cnt)+"개</td>"
						html += 	"<td>"+numWithCommas(result.data[i].price)+"원</td>"
						html += 	"<td>"+numWithCommas(result.data[i].discount)+"원</td>"
						html += 	"<td>"+numWithCommas(result.data[i].total)+"원</td>"
						html += "</tr>"
					}//for
				}//if
				$('.sinven_sel').html(html);
			},//success
			error: function() { alert("오류"); }
		});//ajax
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
			$('#magicBtn').prop('checked', false);// 페이지 이동하면 체크된 체크박스 체크해제
		}
	}); // 페이지 변경 이벤트
	
	// 적정재고 반영 버튼 클릭
	$(document).on('click','#approBtn', function() {
		var search4 = $('[name=search4] option:selected').val();
		var percent = $('#percent').val();
		var period = $('#period').val();
		
		if(percent == null || percent == '') {
			swal({title: "퍼센트를 입력하세요.", button: "확인"})
			.then(function() {
				swal.close(); 
				$('#percent').focus();
				return false;
			})
		}//if
		else if(period == null || period == '') {
			swal({title: "보유일수를 입력하세요.", button: "확인"})
			.then(function() {
				swal.close(); 
				$('#period').focus();
				return false;
			})
		}//else if
		else {
			var pageno = $('.paginate_button.current').text(); // 새로 바뀐 페이지 번호 가져오고
			var pagecnt = $('[name=table_length] option:selected').val();// 표시건수는 몇개인지 확인
			
			$('#table').DataTable().destroy();
			$('#table_paginate').remove();
			$('#table_length').remove();
			dt1(compcd, pageno, pagecnt);
		}//else
	});// 적정재고반영 버튼
	
	// 재고 변경 저장버튼
	$(document).on('click','#saveBtn', function() {
		var count = $('.table_tbody').children('tr').length;// 리스트 tr의 길이
		var cnt = $('.table_tbody').find('input[type=checkbox]:checked').length;// 체크된 상품의 개수
		
		var updStock = [];
		var sto = {};
		
		if(cnt == 0) {
			swal({title: "저장할 상품을 선택하세요.", button: "확인"})
			.then(function() {swal.close(); return; });
		} else {
			for(var i = 0; i < count; i++) {
				if($('#magicBtn'+i+'').is(':checked')) {
					var productid = $('#magicBtn'+i+'').parent().parent().parent().children("td:eq(1)").text();
					var stock = $('#magicBtn'+i+'').parent().parent().parent().children("td:eq(6)").children().val();
					var appropriatestock = $('#magicBtn'+i+'').parent().parent().parent().children("td:eq(7)").children().val();

					sto = {};
					sto.productid = productid;
					sto.stock = stock;
					sto.appropriatestock = appropriatestock;
					
					updStock.push(sto);
				}//if
			}//for
			console.log(updStock);
			updateStock(updStock);// 변경된 재고 저장하기
		}// else
	});// 재고 변경 저장버튼
	
	// 재고 실시간 변경 감지하기
	$(document).on('click','.table_tbody input[type=text]', function() {
		var ori_stock = $(this).parent().parent().children('td:eq(6)').children().val();
		var ori_appro = $(this).parent().parent().children('td:eq(7)').children().val();
		
		$(document).on('change keyup paste','.table_tbody input[type=text]', function() {
			var stock = $(this).parent().parent().children('td:eq(6)').children().val();
			var appro = $(this).parent().parent().children('td:eq(7)').children().val();
			
			if(ori_stock == stock && ori_appro == appro) {
				$(this).parent().parent().children('td:eq(0)').children().children('input[type=checkbox]').prop('checked', false);
			} else {
				$(this).parent().parent().children('td:eq(0)').children().children('input[type=checkbox]').prop('checked', true);
			}
		});//change
	});//click // 재고 실시간 변경 감지하기
	
});//ready

$(document).ajaxStart(function () {
    $('#loading').show(); // ajax 시작 -> 로딩바 표출
});

$(document).ajaxStop(function () {
    $('#loading').hide(); // ajax 끝 -> 로딩바 히든
});

// 엔터키 발생 이벤트
function enterkey() {
	if(window.event.keyCode == 13) {
		$('#searchBtn').click();
	}
}// 엔터키 발생 이벤트

// 재고 리스트 조회(데이터 테이블)
function dt1(compcd, pageno, pagecnt) {
	var search1 = $('[name=search1] option:selected').val();
	var searchInput = $('[name=searchInput]').val();
	var search2 = $('[name=search2] option:selected').val();
	var searchDate1 = $('[name=searchDate1]').val();
	var searchDate2 = $('[name=searchDate2]').val();
	var search3 = $('[name=search3] option:selected').val();
	var search4 = $('[name=search4] option:selected').val();
	var percent = $('#percent').val();
	var period = $('#period').val();
	
	if(search3==undefined){ search3='all'; }
	
	var sd1 = searchDate1.replace(/-/g,"");
	var sd2 = searchDate2.replace(/-/g,"");
	
	var table = $("#table").DataTable({
		 "dom": '<"top"il>t<"bottom center"><"clear">',
		 // l(페이지당),f(검색),i(전체),p(페이저),t,r
		 ajax: {
			url: "/sinven_list.do",
			data: {
				"compcd":compcd,
				"search1":search1,
				"searchInput":searchInput,
				"search2":search2,
				"searchDate1":sd1,
				"searchDate2":sd2,
				"search3":search3,
				"pageno":pageno,
				"pagecnt":pagecnt,
				"search4":search4,
				"percent":percent,
				"period":period
			},
			contentType: false,
	        processData: true,
			complete: function(result) {
				console.log('complete', result.responseJSON);
				var count = result.responseJSON.count;
			    $('#table_info').html('전체  <span>'+numWithCommas(count)+'</span> 건'); // 전체 건수 표시
			    paging(pageno,count);// 페이저 만들기
			},
			error: function() { alert("오류"); },
			dataSrc: function(result) {
				console.log('재고 리스트 조회', result.data);
				var data = result.data;
				return data;
			}
		 },//ajax
		 autoWidth: false,
		 columns: [
			{ data: "no", width: 5 },
			{ data: "productid", width: 40 },// 제품코드
			{ data: "productname", width: 85 },// 상품명
			{ data: "maker", width: 70 },// 제조사
			{ data: "spec", width: 20 },// 규격
			{ data: "unit", width: 20 },// 단위
			{ data: "stock", width: 50,// 현재재고
			'render': function(data, type, full, meta) {return '<input type="text" class="form-control text-center" value="'+data+'">';}},
			{ data: "appropriatestock", width: 50}// 적정재고}
		 ],
		 columnDefs: [
			{ targets: [0], render: function(data, type, row) {
				return '<div class="custom-control custom-checkbox"><input id="magicBtn'+data
				+'" type="checkbox" class="custom-control-input"><label class="custom-control-label" for="magicBtn'
				+data+'"></label></div>'
			} },
			{ targets: [2,3], render: function(data, type, row) {
				if(data.length > 8) {
					var short = data.substr(0,7)+"...";
				} else { var short = data; }
				return '<div class="productname"><div class="productname-hover"><span class="productname-line">'+data+'</span><span class="tri"></span></div>'+short+'</div>';
			} },
			{ targets: [4, 5], render: function(data, type, row) {
				if(data == null || data == '') { var data = '-'; return data; }
				else { return data; }
			} },
			{ targets: [7], render: function(data, type, row) {
				if(data == null || data == '' || data == undefined) { 
					var data = '0'; return '<input type="text" class="form-control text-center" value="'+Math.round(data)+'">';}
				else { return '<input type="text" class="form-control text-center" value="'+Math.round(data)+'">'; }
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
		}],//buttons
	});//table
	$.fn.DataTable.ext.pager.numbers_length = 10;

	$('#table tbody').on('click', function () {
		$(".box-show").css("display", "block");
	});

	$('#table_paginate').appendTo('.page-wrap');
	$('#table_length').prependTo('.length-wrap');
	$('.dataTables_info').prependTo('#table_length');
	$('.btnexcel').appendTo('.bf-wrap');
	
	$(table.table().body()).addClass('table_tbody'); // tbody에 클래스 추가하기
}//dt1

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
	$('#magicBtn').prop('checked', false);// 페이지 이동하면 체크된 체크박스 체크해제하기
}// 페이징 처리

//거래처 리스트 가져오기(select)
function account_list(compcd) {
	$.ajax({
		url: "com_account.do",
		data: { "compcd":compcd },
		success: function(result) {
			console.log('거래처 리스트', result);
			util.MakeSelAccount($('#account'), result.data, result.data.accountname, '전체');
		},
		error: function() { alert("오류"); }
	});//ajax
}// 거래처 리스트 가져오기(select)

// 체크박스 전체선택
$('#magicBtn').click(function() {
	var checked = $('#magicBtn').is(':checked');
	
	if(checked) {
		$('.table_tbody').find('input[type=checkbox]').prop('checked', true);
	}
	else {
		$('.table_tbody').find('input[type=checkbox]').prop('checked', false);
	}
});// 체크박스 전체선택

// 변경된 재고 저장하기
function updateStock(updStock) {
	var compcd = $('#compcd').val();
	
	$.ajax({
		url: "sinven_updStock.do",
		data: {
			"compcd":compcd,
			"stockArr":JSON.stringify(updStock)
		},
		success: function(result) {
			console.log('재고 변경 저장하기', result);
			swal({
				title: '저장이 완료되었습니다.',
				type: 'success',
				icon: "success",
				button: "확인"
			}).then(function(willDelete) {
				location.href = "/sinventory.do?title=입고관리&name=재고관리";
			});
		},
		error: function() { alert("오류"); }
	});// ajax
}// 변경된 재고 저장하기

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