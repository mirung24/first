 /* datatable */
$(document).ready(function() {

	dt1();//테이블 조회
	
	// tr 클릭 이벤트
	$('#table tbody').on( 'click', 'tr', function () {
		var count = $('[name=codelist]').length;
		
		if(count > 0) {
			$(".box-show").css("display", "block");
			$('#table tbody tr').removeClass('selected');
			$(this).addClass('selected');
			
			var code = $(this).children('td:eq(1)').text();
			var codename = $(this).children('td:eq(2)').text();
			var remarks = $(this).children('td:eq(3)').text();
			var useyn = $(this).children('td:eq(4)').text();
			
			// 코드 수정에 클릭한 정보 보여주기
			if(useyn == "사용안함") {
				$('.pop-list input[type="checkbox"][name="use"]').prop('checked',false);
				$('.pop-list input[type="checkbox"]#use2').prop('checked',true);
			} else { // 사용
				$('.pop-list input[type="checkbox"][name="use"]').prop('checked',false);
				$('.pop-list input[type="checkbox"]#use1').prop('checked',true);
			}
			
			$("[name=box_code]").prop('value',code);
			$("[name=box_codename]").prop('value',codename);
			$("[name=box_remarks]").prop('value',remarks);
			
			showLowList(code);
		}
		
	} );// tr 클릭 
	
	// 마스터 코드 수정(변경사항 저장)
	$('#box_save').on( 'click', function() {
		var box_code = $('[name=box_code]').val();
		var box_codename = $('[name=box_codename]').val();
		var box_remarks = $('[name=box_remarks]').val();
		var box_useyn = $('.pop-list input[type="checkbox"][name="use"]:checked').val();
		
		$.ajax({
			url: "master_edit.do",
			data: {
				"code":box_code,
				"codename":box_codename,
				"remarks":box_remarks,
				"useyn":box_useyn
			},
			success: function(result) {
				console.log(result);
				
				$('#table').DataTable().destroy();
				$('#table_paginate').remove();
				$('#table_length').remove();
				
				dt1();//테이블 재조회
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert("오류");
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	});

	// 코드 수정/하위 코드 관리 보이게 하기
//	$('#table tbody').on('click', function () {
//		var count = $('[name=codelist]').val();
//		if(count > 0) {
//			$(".box-show").css("display", "block");
//		}
//	});
	
	// 검색 버튼
	$('#searchBtn').on( 'click', function() {
		$('#table').DataTable().destroy();
		$('#table_paginate').remove();
		$('#table_length').remove();
		
		dt1();//테이블 재조회
	});//검색 버튼
});//ready

function dt1() {
	var searchInput = $('[name=searchInput]').val();
	
	var table = $("#table").DataTable({
		 "dom": '<"top"il>t<"bottom center"p><"clear">',
		 // l(페이지당),f(검색),i(전체),p(페이저),t,r
		ajax: { 
			 url: "code_list.do",
			 data: { "searchInput": searchInput },
//			 destroy: true,
//			 searching: false,
			 error:function(jqXHR, textStatus, errorThrown) {
				alert("오류");
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			},
			dataSrc: function(res) {
				console.log('데이터', res);
				var data = res.data;
					
				// 리스트 번호
				for(let i = 0; i < data.length; i++) {
					data[i].listIndex = i + 1;
					console.log(data[i]);
				}
				return data;
			}
		}, 
		columns: [
			{ data: "listIndex" },
			{ data: "code" },
			{ data: "codename" },
			{ data: "remarks" },
			{ data: "useyn" }
		 ],
		 columnDefs:[
			 { orderable: false, targets:[0] },
			 {
				 orderable: false,
				 targets:[4],
				 render: function(data, type, row) {
					 if(data == 'Y') {
						 data = "사용";
					 } else {
						 data = "사용안함";
					 }
					 return data;
				 }
			 }
		 ],
		 createdRow: function(row, data, dataIndex) {
			$(row).attr('name', 'codelist'); 
		 },
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
				 last: '<i class="fa-solid fa-angles-right"></i>'
			 }
		 },
		 pagingType: "full_numbers",
		 orderMulti: true,
		 order: [ [ 0, "desc" ] ],
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
	});//table
	$.fn.DataTable.ext.pager.numbers_length = 10;
	
	$('#table_paginate').appendTo('.page-wrap');
	$('#table_length').prependTo('.length-wrap');
	$('.dataTables_info').prependTo('#table_length');
	$('.btnexcel').appendTo('.bf-wrap');
}

/* 체크박스 하나만 선택 */
$('.pop-list input[type="checkbox"][name="use"]').click(function(){
	$('.pop-list input[type="checkbox"][name="use"]').prop('checked',false);
	$(this).prop('checked',true);
	});

$('.pop-list input[type="checkbox"][name="popuse"]').click(function(){
	$('.pop-list input[type="checkbox"][name="popuse"]').prop('checked',false);
	$(this).prop('checked',true);
	});


 /* modal */
$(".pop-link2").click(function(){
	$(".modal-wrap2").css({"display": "flex"});
});
$(".pop-close2").click(function(){
	$(".modal-wrap2").css({"display": "none"});
});


 /* 등록 */
$(".pop2 .btn-save").click(function(){
	
	if($(".code-name").val().length == 0)
		swal({title: "코드명을 입력하세요.", button: "확인"})
		.then(function() {swal.close(); $(".code-name").focus(); return false;
	})
	
	 else {
		swal({
			title: '코드를 등록하시겠습니까?',
			icon: "info",
			buttons: true,
			imfoMode: true,
			buttons: ["취소", "확인"]
		}).then(function(willDelete) {
			if(willDelete)	{
				var codename = $('#codename').val();
				var remarks = $('#remarks').val();
				var useyn = $('.pop-list input[type="checkbox"][name="popuse"]:checked').val();
				
				$.ajax({
					url: "master_ins.do",
					data: {
						"codename":codename,
						"remarks":remarks,
						"useyn":useyn
					},
//					dataType: "json",
					type: "post",
//					success: function(result) {
//						console.log(result);
//						location.href = "code.do";
//						$('.content').load(location.href + ' .content');
//					},
					error: function(jqXHR, textStatus, errorThrown) {
						alert("오류");
						console.log(jqXHR);
						console.log(textStatus);
						console.log(errorThrown);
					}
				});
				
				$('.pop2 input, .pop2 textarea').val("");
				$(".modal-wrap2").css({"display": "none"});
				swal({
					title: '등록이 완료되었습니다.',
					type: 'success',
					icon: "success",
					button: "확인"
				}).
				then(function(result) {
					console.log(result);
					if(result) {
						location.href = "/code.do?title=기초관리&name=코드관리";
					}
				})
			}
		});
	}
});

// 하위 코드 추가 버튼
$('#low_ins').click(function(){
	var i = $('.low_tbody tr').length;
	var upcode = $("#table tbody tr.selected").children('td:eq(1)').text();
	
	$.ajax({
		url: "low_list.do",
		data: { "code" : upcode },
		type: "post",
		success: function(data) {
			var ori_i = data.l_list.length;
			var ni = i-1;
			
			if(i == ori_i) {
				makeLowList(i);
				$("#low_code"+i+"").focus();
				return;
			} if(i >= ori_i+1) { // 추가를 다시 눌러도 다시 추가 되지 않도록 막기
				var ni = i-1;
				$("#low_code"+ni+"").focus();
				return;
			}
		}
	});
});

// 하위 코드 전체선택 checkbox
$('#magicBtn').click(function() {
	if($('#magicBtn').prop('checked')) {
		$('input[name=low-check]').prop('checked', true);
	} else {
		$('input[name=low-check]').prop('checked', false);
	}
});

// 하위코드 저장
$('#low_sv').click(function() {
	var i = $('.low_tbody tr').length; //3개는 3으로 표시됨
	var upcode = $("#table tbody tr.selected").children('td:eq(1)').text();
	var ni = i-1;
	
	if($("#low_code"+ni+"").val() == '') {
		swal({title: "코드명을 입력하세요.", button: "확인"})
		.then(function() {swal.close(); $("#low_code"+ni+"").focus(); return false;});
	} else {
		$.ajax({ // ori_i를 알기위해 실행
			url: "low_list.do",
			data: { "code" : upcode },
			type: "post",
			success: function(data) {
				var ori_i = data.l_list.length;
				if(i != ori_i) {
					var code = $("#low_code"+ni+"").val();
					var remarks = $("#low_remarks"+ni+"").val();
					var useyn = $("#low_useyn"+ni+"").val();
					
					if(useyn == "사용") {
						useyn = 'Y';
					} 
					if(useyn == "사용안함") {
						useyn = 'N';
					}
					
					$.ajax({
						url: "/low_save.do",
						type: "post",
						data: {
							"codename":code,
							"remarks":remarks,
							"useyn":useyn,
							"upcode":upcode
						},
						success: function(data) {
							console.log(data);
							showLowList(upcode);
						}
					});
				} if(i == ori_i) {
					var checked = $(".low_tbody [name=low-check]:checked");
					
					if(checked.length < 1) {
						swal({
							title: '저장할 항목을 선택해주세요.',
							type: 'info',
							icon: "info",
							button: "확인"
						});	
					}
					
					$.each(checked, function(k, v) {
						var code = $(this).parent().parent().next().children().val();
						var codename = $(this).parent().parent().next().next().children().val();
						var remarks = $(this).parent().parent().next().next().next().children().val();
						var useyn = $(this).parent().parent().next().next().next().next().children().val();
						
						if(useyn == "사용") {
							useyn = 'Y';
						} else {
							useyn = 'N';
						}

						$.ajax({
							url: "low_modi.do",
							type: "post",
							data: {
								"code":code,
								"codename":codename,
								"remarks":remarks,
								"useyn":useyn
							},
							success: function(data) {
								swal({
									title: '저장이 완료되었습니다.',
									type: 'success',
									icon: "success",
									button: "확인"
								}).then(function(result) {
									if(result) {
										$('input[name=low-check]').prop('checked', false);
										showLowList(upcode);
									}
								});//swal&then
							}//success
						});//ajax
					});//each
				}//if
			}//success
		});//ajax
	}
});//하위코드 저장

// 하위 코드 - 추가된 빈칸 삭제
$('#low_del').click(function() {
	var i = $('.low_tbody tr').length;
	var upcode = $("#table tbody tr.selected").children('td:eq(1)').text();
	
	var checked = $(".low_tbody [name=low-check]:checked");
	console.log(checked.length);
	
	if(checked.length < 1) {
		swal({
			title: '삭제할 항목을 선택해주세요.',
			type: 'info',
			icon: "info",
			button: "확인"
		});
	}
	
	$.each(checked, function(k, v) {
		var code = $(this).parent().parent().next().children().val();
		if(code == "") {
			var a = $(this).parent().parent().parent();
			$(a).remove();
			swal({
				title: '삭제가 완료되었습니다.',
				type: 'success',
				icon: "success",
				button: "확인"
			});	
		} else {
			swal({
				title: '삭제가 불가능한 항목입니다.',
				type: 'warning',
				icon: "warning",
				button: "확인"
			});
		}
		
		
	});
	
//	swal({
//		title: count + '개를 삭제하시겠습니까?',
//		icon: "info",
//		buttons: true,
//		imfoMode: true,
//		buttons: ["취소", "확인"]
//	}).then(function(willDelete) {
//		if(willDelete)	{
//			swal({
//				title: '삭제가 완료되었습니다.',
//				type: 'success',
//				icon: "success",
//				button: "확인"
//			}).
//			then(function(result) {
//				console.log(result);
//				if(result) {
//					location.href = "/code.do";
//				}
//			})
//		}
//	});
});

// 하위 코드 조회
function showLowList(code) {
	var url = "/low_list.do";
	var paramData = { "code" : code };
	
	$.ajax({
		url: url,
		type: "post",
		data: paramData,
		success: function(data) {
			console.log(data);
			
			let html = "";
			const count = data.l_list.length;
			
			if(count > 0) {
				for(var i = 0; i < count; i++) {
					var useyn = data.l_list[i].useyn;
					if(data.l_list[i].remarks == null) {
						data.l_list[i].remarks = '';
					}
					
					if(useyn == 'Y') {
						html += "<tr>"
						html += 	"<td>"
						html +=			"<div class='custom-control custom-checkbox'><input id='magicBtn"+ i +"' type='checkbox'"
						html +=					"class='custom-control-input' name='low-check'><label class='custom-control-label' for='magicBtn"+ i +"'></label>"
						html += 		"</div>"
						html +=		"</td>"
						html +=		"<td><input type='text' class='form-control' value='" + data.l_list[i].code + "' disabled></td>"
						html +=		"<td><input type='text' class='form-control' value='" + data.l_list[i].codename + "' id='low_code"+ i +"'></td>"
						html +=		"<td><input type='text' class='form-control' value='" + data.l_list[i].remarks + "' id='low_remarks"+ i +"'></td>"
						html +=		"<td><select class='form-control' id='low_useyn"+ i +"'>"
						html +=				"<option value='사용' selected>사용</option>"
						html +=				"<option value='사용안함'>사용안함</option>"
						html +=			"</select></td>"
						html +=		"</td>"
						html += "</tr>"
					} if(useyn == 'N') {
						html += "<tr>"
						html += 	"<td>"
						html +=			"<div class='custom-control custom-checkbox'><input id='magicBtn"+ i +"' type='checkbox'"
						html +=					"class='custom-control-input' name='low-check'><label class='custom-control-label' for='magicBtn"+ i +"'></label>"
						html += 		"</div>"
						html +=		"</td>"
						html +=		"<td><input type='text' class='form-control' value='" + data.l_list[i].code + "' disabled></td>"
						html +=		"<td><input type='text' class='form-control' value='" + data.l_list[i].codename + "' id='low_code"+ i +"'></td>"
						html +=		"<td><input type='text' class='form-control' value='" + data.l_list[i].remarks + "' id='low_remarks"+ i +"'></td>"
						html +=		"<td><select class='form-control' id='low_useyn"+ i +"'>"
						html +=				"<option value='사용'>사용</option>"
						html +=				"<option value='사용안함' selected>사용안함</option>"
						html +=			"</select></td>"
						html +=		"</td>"
						html += "</tr>"
					}
				}
			}
			$(".low_tbody").html(html);
		},//success
		error:function(jqXHR, textStatus, errorThrown) {
			alert("오류");
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}// error
	});
}//showLowList()

// 하위 코드 추가
function makeLowList(i) {
	let html = "";
	
	html += "<tr>"
	html += 	"<td>"
	html +=			"<div class='custom-control custom-checkbox'><input id='magicBtn"+ i +"' type='checkbox'"
	html +=					"class='custom-control-input' name='low-check'><label class='custom-control-label' for='magicBtn"+ i +"'></label>"
	html += 		"</div>"
	html +=		"</td>"
	html +=		"<td><input type='text' class='form-control' disabled></td>"
	html +=		"<td><input type='text' class='form-control' id='low_code"+ i +"'></td>"
	html +=		"<td><input type='text' class='form-control' id='low_remarks"+ i +"'></td>"
	html +=		"<td><select class='form-control' id='low_useyn"+ i +"'>"
	html +=				"<option value='사용' selected>사용</option>"
	html +=				"<option value='사용안함'>사용안함</option>"
	html +=			"</select></td>"
	html +=		"</td>"
	html += "</tr>"
		
	$(".low_tbody").prepend(html);
}
function enterkey() {
	if(window.event.keyCode == 13) {
		$('#searchBtn').click();
	}
}// 엔터키 발생 이벤트
