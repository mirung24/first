 /* datatable */
$(document).ready(function() {
	var table = $("#table").DataTable({
	 "dom": '<"top"il>t<"bottom center"p><"clear">',
	 // l(페이지당),f(검색),i(전체),p(페이저),t,r
	 ajax: { url: "../json/customer.json"}, 
			 columns: [
				{data: 'check',
				"render": function ( data, type, row ) {return '<div class="custom-control custom-checkbox"><input id="magicBtn'+data+'" type="checkbox" class="custom-control-input"><label class="custom-control-label" for="magicBtn'+data+'"></label></div>'}},
				{ data: "name" },
				{ data: "tell" },
				{ data: "age" },
				{ data: "gender" },
				{ data: "visitbrfore" },
				{ data: "visit" },
				{ data: "store" }
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
	 lengthMenu: [ 10, 50, 100, 200 ],
	 displayLength: 10,

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

	$('#table tbody').on( 'click', 'tr td:not(:first-child)', function () {
		$('#table tbody tr').removeClass('selected');
		$(this).parent('tr').addClass('selected');
	});

	$('#table tbody').on('click', 'tr td:not(:first-child)', function () {
		$(".box-show").css("display", "block");
	});

	$('#table_paginate').appendTo('.page-wrap');
	$('#table_length').prependTo('.length-wrap');
	$('.dataTables_info').prependTo('#table_length');
	$('.btnexcel').appendTo('.bf-wrap');
	});


 /*modal */
 $(".pop-link1").click(function(){
	$(".modal-wrap1").css({"display": "flex"});
});
$(".pop-close1").click(function(){
	$(".modal-wrap1").css({"display": "none"});
});
 $(".pop-link2").click(function(){
	$(".modal-wrap2").css({"display": "flex"});
});
$(".pop-close2").click(function(){
	$(".modal-wrap2").css({"display": "none"});
});
 $(".pop-link3").click(function(){
	$(".modal-wrap3").css({"display": "flex"});
});
$(".pop-close3").click(function(){
	$(".modal-wrap3").css({"display": "none"});
});


/* 탭 */
$(".tab > .tablinks").click(function(){
	$(".tab > .tablinks").removeClass("active");
	$(this).addClass("active");
	$(".tab-wrap > .tabcontent").hide();
	$(".tab-wrap > .tabcontent").eq($(this).index()).show();
});
$(".tab > .tablinks").eq(0).trigger("click");