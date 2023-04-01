 /* datatable */
$(document).ready(function() {
	var table = $("#table").DataTable({
	 "dom": '<"top"il>t<"bottom center"p><"clear">',
	 // l(페이지당),f(검색),i(전체),p(페이저),t,r
	 ajax: { url: "../json/client.json"}, 
			 columns: [
				{ data: "no" },
				{ data: "companyname" },
				{ data: "companynumber" },
				{ data: "name" },
				{ data: "adress" },
				{ data: "number" },
				{ data: "tell" },
				{ data: "email" },
				{ data: "date"},
				{ data: "today"},
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
 });

 /*modal */
 $(".pop-link2").click(function(){
	$(".modal-wrap2").css({"display": "flex"});
});
$(".pop-close2").click(function(){
	$(".modal-wrap2").css({"display": "none"});
});

 /*등록 */
$(".pop2 .btn-save").click(function(){

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
	else if($(".adress").val().length==0)
	swal({title: "주소를 입력하세요.", button: "확인"})
	.then(function() {swal.close(); $(".adress").focus(); return false;
})
	else if($(".number").val().length==0)
	swal({title: "전화번호를 입력하세요.", button: "확인"})
	.then(function() {swal.close(); $(".number").focus(); return false;
})
	else if($(".tell").val().length==0)
	swal({title: "휴대폰번호를 입력하세요.", button: "확인"})
	.then(function() {swal.close(); $(".tell").focus(); return false;
})
	else if($(".fax").val().length==0)
	swal({title: "팩스번호를 입력하세요.", button: "확인"})
	.then(function() {swal.close(); $(".fax").focus(); return false;
})
	else if($(".email").val().length==0)
	swal({title: "이메일을 입력하세요.", button: "확인"})
	.then(function() {swal.close(); $(".email").focus(); return false;
})
	else if($(".register1").val().length==0)
	swal({title: "개설일을 입력하세요.", button: "확인"})
	.then(function() {swal.close(); $(".register1").focus(); return false;
})
	else if($(".register2").val().length==0)
	swal({title: "거래시작일을 입력하세요.", button: "확인"})
	.then(function() {swal.close(); $(".register2").focus(); return false;
})

	else if($(".register3").val().length==0)
	swal({title: "거래종료일을 입력하세요.", button: "확인"})
	.then(function() {swal.close(); $(".register3").focus(); return false;
})
	else if($(".tax-email").val().length==0)
	swal({title: "세금계산서 이메일을 입력하세요.", button: "확인"})
	.then(function() {swal.close(); $(".tax-email").focus(); return false;
})

 else {
	swal({
		title: '가맹점을 등록하시겠습니까?',
		icon: "info",
		buttons: true,
		imfoMode: true,
		buttons: ["취소", "확인"]
	}).then(function(willDelete) {
	if(willDelete)	{
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
});