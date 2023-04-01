 /* datatable */
$(document).ready(function() {
	var table = $("#table").DataTable({
	 "dom": '<"top"il>t<"bottom center"p><"clear">',
	 // l(페이지당),f(검색),i(전체),p(페이저),t,r
	 ajax: { url: "../json/pb.json"}, 
			 columns: [
				{ data: "no" },
				{ data: "groupname" },
				{ data: "price" },
				{ data: "vigo" },
				{ data: "use" }
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

	$('#table tbody').on( 'click', 'tr', function () {
		$('#table tbody tr').removeClass('selected');
		$(this).addClass('selected');
	});

	$('#table tbody').on('click', function () {
		$(".box-show").css("display", "block");
	});

	$('#table_paginate').appendTo('.page-wrap');
	$('#table_length').prependTo('.length-wrap');
	$('.dataTables_info').prependTo('#table_length');
	$('.btnexcel').appendTo('.bf-wrap');
 });


/* 체크박스 하나만 선택 */
$('.pop-list input[type="checkbox"][name="popuse"]').click(function(){
	$('.pop-list input[type="checkbox"][name="popuse"]').prop('checked',false);
		 $(this).prop('checked',true);
	 });

$('.pop-list input[type="checkbox"][name="popprice"]').click(function(){
	$('.pop-list input[type="checkbox"][name="popprice"]').prop('checked',false);
		 $(this).prop('checked',true);
	 });

$('.box-wrap .pop-list input[type="checkbox"][name="use"]').click(function(){
	$('.box-wrap .pop-list input[type="checkbox"][name="use"]').prop('checked',false);
		 $(this).prop('checked',true);
	 });

$('.box-wrap .pop-list input[type="checkbox"][name="price"]').click(function(){
	$('.box-wrap .pop-list input[type="checkbox"][name="price"]').prop('checked',false);
		 $(this).prop('checked',true);
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
	
	if($(".group-name").val().length==0)
	swal({title: "그룹명을 입력하세요.", button: "확인"})
	.then(function() {swal.close(); $(".group-name").focus(); return false;
})

 else {
	swal({
		title: 'PB상품을 등록하시겠습니까?',
		icon: "info",
		buttons: true,
		imfoMode: true,
		buttons: ["취소", "확인"]
	}).then(function(willDelete) {
	if(willDelete)	{
		$('.pop2 input, .pop2 textarea').val("");
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

/* 탭 */
$(".tab > .tablinks").click(function(){
	$(".tab > .tablinks").removeClass("active");
	$(this).addClass("active");
	$(".tab-wrap > .tabcontent").hide();
	$(".tab-wrap > .tabcontent").eq($(this).index()).show();
});
$(".tab > .tablinks").eq(0).trigger("click");