$(document).ready(function() {
	var compcd = $('#compcd').val();//체인코드
	console.log("가맹점입니다");
	
	// 만들어진 카테고리가 있는지 확인
	$.ajax({
		url: "/scate_check.do",
		data: { "compcd":compcd },
		success: function(result) {
			console.log("카테고리1 개수",result);
			
			if(result == 0) { // 카테고리 없으면 템플릿 선택 보이게하기
				chaincategory1();// 본점 카테고리 보여주기
				atcategory1();// 올댓 카테고리 보여주기
				$(".modal-wrap3").css({"display": "flex"});
			} else { // 만들어진 카테고리가 있으면 카테고리1 리스트 뿌리깅~
				category1();
			}//else
		},//success
		error: function() { alert("오류"); }
	});//ajax
	
	/* checked */
	$(document).on('change', '.custom-control-input', function() {
		$(this).is(':checked') ? ($(this).parents('td').css({"color": "#212f30"}), $(this).parents('td').removeClass("active")) 
				: ($(this).parents('td').css({"color": "#ccc"}), $(this).parents('tr').removeClass('selected'))
	});// 사용안함이면, 글씨색 변경 & checkbox disable
	// 1차 카테고리 checkbox
	$(document).on('change', ".table1 .custom-control-input", function() {
		if($(this).is(':checked') == false && $(this).parent('tr').addClass('selected')) {
			$(".table2 tbody tr, .table3 tbody tr").hide(); }// 1차 사용안함 체크하면, 2차/3차 숨기기
		
		var category1cd = $(this).parent().parent().parent().parent().next().text();
		var useyn; $(this).is(':checked') ? useyn = "Y" : useyn = "N" //useyn 값 
		useyn1(category1cd, useyn); //실시간으로 db에 useyn 값 업데이트
	});
	// 2차 카테고리 checkbox
	$(document).on('change', ".table2 .custom-control-input", function() {
		if ($(this).is(':checked') == false && $(this).parent('tr').addClass('selected')) {// 사용안함 인데, 선택되면 숨기기
			$(".table3 tbody tr").hide(); }// 2차 사용안함 체크하면, 3차 숨기기
		
		var category2cd = $(this).parent().parent().parent().parent().next().text();
		var useyn; $(this).is(':checked') ? useyn = "Y" : useyn = "N" //useyn 값 
		useyn2(category2cd, useyn); //실시간으로 db에 useyn 값 업데이트
	});
	// 3차 카테고리 checkbox
	$(document).on('change', ".table3 .custom-control-input", function() {
		var category3cd = $(this).parent().parent().parent().parent().next().text();
		var useyn; $(this).is(':checked') ? useyn = "Y" : useyn = "N" //useyn 값 
		useyn3(category3cd, useyn); //실시간으로 db에 useyn 값 업데이트
	});
	
	$(document).on('click', ".custom-control-input", function (e) {
		console.log("stopPropagation 실행");
		e.stopPropagation();
	});// 겹쳐는 작업 막기
	
	$(document).on('click', ".btn-change", function (e) {
		console.log("stopPropagation 실행");
		e.stopPropagation();
	});// 겹쳐는 작업 막기
	
});//ready

$(document).ajaxStart(function () {
    $('#loading').show(); // ajax 시작 -> 로딩바 표출
});

$(document).ajaxStop(function () {
    $('#loading').hide(); // ajax 끝 -> 로딩바 히든
});

/* 테두리선 */
$('.table-responsive').scroll(onScroll).trigger("scroll");

function onScroll() {
	var scTop = $(this).scrollTop();
	if (scTop > 1) {
		$('.table thead th').css("box-shadow", "inset 0 -1px 0 #eee");
	} else {
		$('.table thead th').css("box-shadow", "none");
	}
}

/* select */
$('.table1 tbody').on('click', 'tr td', function () {
	var category1cd = $(this).next().text();
	if ($(this).find('input[type="checkbox"]').is(":checked")) { // 사용함으로 되어있으면 카테고리 2 보여줌
		var name = $(this).children().children().eq(0).html();// 카테고리이름과 연결된 개수 함께 가져와서
		var categoryname = name.split("<p>");// p태그 기준으로 자르면 카테고리이름만 남음
		$(".selcate1").html(categoryname[0]+" >  ");// 선택된 카테고리에 붙여넣기
		$(".selcate2").html("");// 2차는 비우기
		
		$('.table tbody tr').removeClass('selected');
		$(this).parent('tr').addClass('selected');

		category2(category1cd);// 카테고리2 리스트 보여주기
	} else {
		$('.table tbody tr').removeClass('selected');
		$(".table2 tbody tr").hide();
	}//else
	$(".table3 tbody tr").hide();
	$("#selcode1").val(category1cd);
});//1차 카테고리 tr클릭

$('.table2 tbody').on('click', 'tr td', function () {
	var category2cd = $(this).next().text();
	if ($(this).find('input[type="checkbox"]').is(":checked")) {// 사용함으로 되어있으면 카테고리 3 보여줌
		var name = $(this).children().children().eq(0).html();// 카테고리이름과 연결된 개수 함께 가져와서
		var categoryname = name.split("<p>");// p태그 기준으로 자르면 카테고리이름만 남음
		$(".selcate2").html(categoryname[0]);// 선택된 카테고리에 붙여넣기
		
		$('.table2 tbody tr').removeClass('selected');
		$(this).parent('tr').addClass('selected');
		$(".table3 tbody tr").css({"visibility": "visible"});
		
		var chaincode = $('#chaincode').val();
		console.log('카테고리 코드',category2cd);
		category3(category2cd);// 3차 카테고리 리스트 보여주기
	} else {
		$(".table3 tbody tr").css({"visibility": "hidden"});
	}
	$("#selcode2").val(category2cd);
});//2차 카테고리 tr클릭

// 카테고리1 리스트 보여주기
function category1() {
	var compcd = $("#compcd").val();
	
	$.ajax({
		url: "scate1_list.do",
		data: { "compcd":compcd },
		success: function(result) {
			console.log('카테고리1 리스트 ',result);
			var data = result.data;
			var count = data.length;
			let html = '';
			
			for(var i = 0; i < count; i++) {
				html += '<tr>'
				if(data[i].useyn == 'Y') { // 사용하면
					html += 	'<td><ul><li>'+data[i].categoryname+'<p>'+data[i].cnt+'개 카테고리 연결됨</p></li>'
					html += 		'<li class="d-flex"><button type="button" class="btn btn-change">수정하기</button>'
					html += 			'<span class="custom-control custom-switch ml-4">'
					html += 			'<input type="checkbox" class="custom-control-input" checked id="customSwitch'+(i+1)+'">'
				} else {
					html += 	'<td style="color: rgb(204,204,204);"><ul><li>'+data[i].categoryname+'<p>'+data[i].cnt+'개 카테고리 연결됨</p></li>'
					html += 		'<li class="d-flex"><button type="button" class="btn btn-change">수정하기</button>'
					html += 			'<span class="custom-control custom-switch ml-4">'
					html += 			'<input type="checkbox" class="custom-control-input" id="customSwitch'+(i+1)+'">'
				}
				html += 				'<label class="custom-control-label" for="customSwitch'+(i+1)+'"></label>'
				html +=				'</span>'
				html += 		'</li>'
				html += 	'</ul></td>'
				html += 	'<td style="display: none;">'+data[i].category1cd+'</td>'
				html += 	'<td style="display: none;" id="cate1Num'+(i+1)+'">'+data[i].ordernum+'</td>'
				html += '</tr>'
			}//for
			$('.cate1_list').html(html);
		},//success
		error: function() { alert("오류"); }
	});//ajax
}//category1

// 2차 카테고리 리스트 보여주기
function category2(code) {
	var compcd = $("#compcd").val();
	
	// 카테고리2 리스트 보여주기
	$.ajax({
		url: "scate2_list.do",
		data: {
			"compcd":compcd,
			"category1cd":code
		},
		async: false,
		success: function(result) {
			console.log('카테고리2 리스트',result);
			var j = $('.cate1_list tr').length;
			var data = result.data;
			var count = data.length;
			let html = '';
			
			for(var i = 0; i < count; i++) {
				html += '<tr>'
				if(data[i].useyn == 'Y') { // 사용하면
					html += 	'<td><ul><li>'+data[i].categoryname+'<p>'+data[i].cnt+'개 카테고리 연결됨</p></li>'
					html += 		'<li class="d-flex"><button type="button" class="btn btn-change">수정하기</button>'
					html += 			'<span class="custom-control custom-switch ml-4">'
					html += 			'<input type="checkbox" class="custom-control-input" checked id="customSwitch'+(j+i+1)+'">'
				} else {
					html += 	'<td style="color: rgb(204,204,204);"><ul><li>'+data[i].categoryname+'<p>'+data[i].cnt+'개 카테고리 연결됨</p></li>'
					html += 		'<li class="d-flex"><button type="button" class="btn btn-change">수정하기</button>'
					html += 			'<span class="custom-control custom-switch ml-4">'
					html += 			'<input type="checkbox" class="custom-control-input" id="customSwitch'+(j+i+1)+'">'
				}
				html += 				'<label class="custom-control-label" for="customSwitch'+(j+i+1)+'"></label>'
				html +=				'</span>'
				html += 		'</li>'
				html += 	'</ul></td>'
				html += 	'<td style="display: none;">'+data[i].category2cd+'</td>'
				html += 	'<td style="display: none;" id="cate2Num'+(i+1)+'">'+data[i].ordernum+'</td>'
				html += '</tr>'
			}//for
			$('.cate2_list').html(html);
		},//success
		error: function() { alert("오류"); }
	});//ajax(해당되는 카테고리2 보여주기
}//category2

// 3차 카테고리 리스트 보여주기
function category3(code) {
	var compcd = $("#compcd").val();
	
	// 카테고리3 리스트 보여주기
	$.ajax({
		url: "scate3_list.do",
		data: {
			"compcd":compcd,
			"category2cd":code
		},
		async: false,
		success: function(result) {
			console.log('카테고리3 리스트',result);
			var j = $('.cate1_list tr').length;
			var l = $('.cate2_list tr').length;
			var z = j+l;
			var data = result.data;
			var count = data.length;
			let html = '';
			
			for(var i = 0; i < count; i++) {
				html += '<tr>'
				if(data[i].useyn == 'Y') { // 사용하면
					html += 	'<td><ul><li>'+data[i].categoryname+'<p>'+data[i].cnt+'개 상품 연결됨</p></li>'
					html += 		'<li class="d-flex"><button type="button" class="btn btn-change">수정하기</button>'
					html += 			'<span class="custom-control custom-switch ml-4">'
					html += 			'<input type="checkbox" class="custom-control-input" checked id="customSwitch'+(z+i+1)+'">'
				} else {
					html += 	'<td style="color: rgb(204,204,204);"><ul><li>'+data[i].categoryname+'<p>'+data[i].cnt+'개 상품 연결됨</p></li>'
					html += 		'<li class="d-flex"><button type="button" class="btn btn-change">수정하기</button>'
					html += 			'<span class="custom-control custom-switch ml-4">'
					html += 			'<input type="checkbox" class="custom-control-input" id="customSwitch'+(z+i+1)+'">'
				}
				html += 				'<label class="custom-control-label" for="customSwitch'+(z+i+1)+'"></label>'
				html +=				'</span>'
				html += 		'</li>'
				html += 	'</ul></td>'
				html += 	'<td style="display: none;">'+data[i].category3cd+'</td>'
				html += 	'<td style="display: none;" id="cate3Num'+(i+1)+'">'+data[i].ordernum+'</td>'
				html += '</tr>'
			}//for
			$('.cate3_list').html(html);
		},//success
		error: function() { alert("오류"); }
	});//ajax(해당되는 카테고리2 보여주기)
}//category3

// 사용유무 변경하기
function useyn1(code, useyn) {
	var compcd = $("#compcd").val();
	$.ajax({
		url: "scate1_useyn.do",
		data: {
			"compcd":compcd,
			"category1cd":code,
			"useyn":useyn
		},
		success: function(result) {
			console.log('카테고리1 : '+code+' - useyn 변경 - '+useyn);
		},
		error: function() { alert("오류"); }
	});//ajax
}//useyn1
function useyn2(code, useyn) {
	var compcd = $("#compcd").val();
	$.ajax({
		url: "scate2_useyn.do",
		data: {
			"compcd":compcd,
			"category2cd":code,
			"useyn":useyn
		},
		success: function(result) {
			console.log('카테고리2 : '+code+' - useyn 변경 - '+useyn);
		},
		error: function() { alert("오류"); }
	});//ajax
}//useyn2
function useyn3(code, useyn) {
	var compcd = $("#compcd").val();
	$.ajax({
		url: "scate3_useyn.do",
		data: {
			"compcd":compcd,
			"category3cd":code,
			"useyn":useyn
		},
		success: function(result) {
			console.log('카테고리3 : '+code+' - useyn 변경 - '+useyn);
		},
		error: function() { alert("오류"); }
	});//ajax
}//useyn3


/*modal */
$("th .btn-plus").click(function () {
	$(".modal-wrap1").css({"display": "flex"});
});
$(".pop-close1").click(function () {
	$(".modal-wrap1").css({"display": "none"});
	// 초기화
	$(".modal-wrap1 .name").val("");
	$(".selinput1").val("");
	$(".selinput2").val("");
	$(".sel1").val("self").prop("selected", true);
	$(".sel2").val("self").prop("selected", true);
	$(".selinput1").css({"display": "flex"});
	$(".selinput2").css({"display": "flex"});
});

$(".table-wrapper .table-responsive:nth-child(1) .btn-plus").click(function () {//카테고리1 추가 버튼 클릭
	$("#whichBtn").val("aaaa");// 1차 카테고리를 추가하는 것을 알기 위해서
	
	$(".modal-wrap1 .pop-list").css({"display": "flex"});
	$(".modal-wrap1 .pop-list:not(:last-child)").css({"display":"none"});
});

$(".table-wrapper .table-responsive:nth-child(2) .btn-plus").click(function () {//카테고리2 추가 버튼 클릭
	$("#whichBtn").val("bbbb");// 2차 카테고리를 추가하는 것을 알기 위해서
	
	$(".modal-wrap1 .pop-list").css({"display": "flex"});
	$(".modal-wrap1 .pop-list:nth-child(2)").css({"display": "none"});
	
	var compcd = $("#compcd").val();
	
	$.ajax({
		url: "scate1_list.do",
		data: { "compcd":compcd },
		success: function(result) {
			console.log(result);
			var data = result.data;
			var count = data.length;
			
			let html = "";
			var category1cd = $(".cate1_list tr.selected").children().eq(1).text();
			console.log("category1cd", category1cd);
			var cnt = $(".cate1_list tr.selected").length;
			
			if(cnt == 0) {// 1차 카테고리를 선택하지 않고 추가 하는 경우
				html = '<option value="self" selected>직접입력</option>'
				for(var i = 0; i < count; i++) {
					if(data[i].useyn == 'Y') {
						html += '<option value="'+data[i].category1cd+'" data-cnt="'+data[i].cnt+'">'+data[i].categoryname+'</option>'
					}//if
				}//for
				$(".sel1").html(html);
			} else { // 1차 카테고리를 선택한 경우
				$(".selinput1").css({"display": "none"});
				html = '<option value="self">직접입력</option>'
				for(var i = 0; i < count; i++) {
					if(data[i].useyn == 'Y') {
						if(data[i].category1cd == category1cd) {
							html += '<option value="'+data[i].category1cd+'" data-cnt="'+data[i].cnt+'" selected>'+data[i].categoryname+'</option>'
						} else {
							html += '<option value="'+data[i].category1cd+'" data-cnt="'+data[i].cnt+'">'+data[i].categoryname+'</option>'
						}
					}//if
				}//for
				$(".sel1").val(category1cd).prop("selected", true); // 직접선택 selected하기
				$(".sel1").html(html);
			}//else
			
//			for(var i = 0; i < count; i++) {
//				if(data[i].useyn == 'Y') {
//					html += '<option value="'+data[i].category1cd+'" data-cnt="'+data[i].cnt+'">'+data[i].categoryname+'</option>'
//				}
//			}//for
//			$(".sel1").append(html);
		},
		error: function() { alert("오류"); }
	});//ajax 카테고리1 리스트
	
	$(".sel1").on('change', function() {
		var select = $(".sel1 option:selected").val();
		if(select == 'self') { $(".selinput1").val(""); $(".selinput1").css({"display": "flex"}); }
	});
});// 카테고리2 추가 버튼 클릭

$(".table-wrapper .table-responsive:nth-child(3) .btn-plus").click(function () {//카테고리3 추가 버튼 클릭
	$("#whichBtn").val("cccc");// 3차 카테고리를 추가하는 것을 알기 위해서
	
	$(".modal-wrap1 .pop-list").css({"display": "flex"});
	
	var compcd = $("#compcd").val();
	
	$.ajax({
		url: "scate1_list.do",
		data: { "compcd":compcd },
		success: function(result) {
			console.log(result);
			var data = result.data;
			var count = data.length;
			
			let html = "";
			var category1cd = $(".cate1_list tr.selected").children().eq(1).text();
			console.log("category1cd", category1cd);
			var cnt1 = $(".cate1_list tr.selected").length;
			var cnt2 = $(".cate2_list tr.selected").length;
			
			if(cnt1 == 0) {// 1차 카테고리를 선택하지 않고 추가 하는 경우
				html = '<option value="self" selected>직접입력</option>'
				for(var i = 0; i < count; i++) {
					if(data[i].useyn == 'Y') {
						html += '<option value="'+data[i].category1cd+'" data-cnt="'+data[i].cnt+'">'+data[i].categoryname+'</option>'
					}//if
				}//for
				$(".sel1").html(html);
			} else { // 1차 카테고리를 선택한 경우
				$(".selinput1").css({"display": "none"});
				html = '<option value="self">직접입력</option>'
				for(var i = 0; i < count; i++) {
					if(data[i].useyn == 'Y') {
						if(data[i].category1cd == category1cd) {
							html += '<option value="'+data[i].category1cd+'" data-cnt="'+data[i].cnt+'" selected>'+data[i].categoryname+'</option>'
						} else {
							html += '<option value="'+data[i].category1cd+'" data-cnt="'+data[i].cnt+'">'+data[i].categoryname+'</option>'
						}
					}//if
				}//for
				$(".sel1").val(category1cd).prop("selected", true); // 직접선택 selected하기
				$(".sel1").html(html);
			}//else
			
			if(cnt1 > 0 && cnt2 > 0) {//if(1차, 2차 모두 선택한 경우)
				$.ajax({
					url: "scate2_list.do",
					data: {
						"compcd":compcd,
						"category1cd":category1cd
					},
					success: function(result) {
						console.log(result);
						var data = result.data;
						var count = data.length;
						
						let html = "";
						var category2cd = $(".cate2_list tr.selected").children().eq(1).text();
						console.log("category2cd", category2cd);
						var cnt2 = $(".cate2_list tr.selected").length;

						$(".selinput2").css({"display": "none"});
						html = '<option value="self">직접입력</option>'
						for(var i = 0; i < count; i++) {
							if(data[i].useyn == 'Y') {
								if(data[i].category2cd == category2cd) {
									html += '<option value="'+data[i].category2cd+'" data-cnt="'+data[i].cnt+'" selected>'+data[i].categoryname+'</option>'
								} else {
									html += '<option value="'+data[i].category2cd+'" data-cnt="'+data[i].cnt+'">'+data[i].categoryname+'</option>'
								}
							}//if
						}//for
						$(".sel2").val(category2cd).prop("selected", true); // 직접선택 selected하기
						$(".sel2").html(html);

//						for(var i = 0; i < count; i++) {
//							if(data[i].useyn == 'Y') {
//								html += '<option value="'+data[i].category2cd+'" data-cnt="'+data[i].cnt+'">'+data[i].categoryname+'</option>' }
//						}//for
//						$(".sel2").html('<option value="self" selected>직접입력</option>');
//						$(".selinput2").css({"display": "flex"});
//						$(".sel2").append(html);
					},//success
					error: function() { alert("오류"); }
				});//ajax
			}//if(1차, 2차 모두 선택한 경우)
			
			
//			for(var i = 0; i < count; i++) {
//				if(data[i].useyn == 'Y') {
//					html += '<option value="'+data[i].category1cd+'" data-cnt="'+data[i].cnt+'">'+data[i].categoryname+'</option>' }
//			}//for
//			$(".sel1").append(html);
		},//success
		error: function() { alert("오류"); }
	});//ajax 카테고리1 리스트
	
	$(".sel1").on('change', function() {
		var category1cd = $(".sel1 option:selected").val();
		if(category1cd == 'self') { 
			$(".selinput1").val(""); 
			$(".selinput1").css({"display": "flex"});
			$(".sel2").val("self").prop("selected", true);
			$(".sel2").html('<option value="self" selected>직접입력</option>');
			$(".selinput2").css({"display":"flex"});
		}
		
		if(category1cd != 'self') {
			$.ajax({
				url: "scate2_list.do",
				data: {
					"compcd":compcd,
					"category1cd":category1cd
				},
				success: function(result) {
					console.log(result);
					var data = result.data;
					var count = data.length;
					
					let html = "";
					
					for(var i = 0; i < count; i++) {
						if(data[i].useyn == 'Y') {
							html += '<option value="'+data[i].category2cd+'" data-cnt="'+data[i].cnt+'">'+data[i].categoryname+'</option>' }
					}//for
					$(".sel2").html('<option value="self" selected>직접입력</option>');
					$(".selinput2").css({"display": "flex"});
					$(".sel2").append(html);
				},//success
				error: function() { alert("오류"); }
			});//ajax 카테고리1 리스트
		}//if
	});// sel1 change
	
	$(".sel2").on('change', function() {
		var category2cd = $(".sel2 option:selected").val();
		if(category2cd == 'self') { $(".selinput2").val(""); $(".selinput2").css({"display": "flex"}); }
	});
});//카테고리3 추가 버튼 클릭

// 카테고리 추가하깅~
$("#addBtn").on("click", function() {
	var whichBtn = $("#whichBtn").val();
	var name = $(".modal-wrap1 .name").val();
	console.log(name);
	console.log(whichBtn);
	
	if(whichBtn == "aaaa") { // 1차 카테고리 추가하기 경우
		if(name == "") {
			swal({title: "카테고리명을 입력하세요.", button: "확인"})
			.then(function() {swal.close(); $('.modal-wrap1 .name').focus(); return; });
		} else {
			addcate1(name);// 1차 카테고리 저장
		}
	} else if(whichBtn == "bbbb") { // 2차 카테고리 추가하기 경우
		var category1cd = $(".sel1 option:selected").val();
		var selinput1 = $(".selinput1").val();
		
		if(category1cd == "self" && selinput1 == "") {
			swal({title: "카테고리명을 입력하세요.", button: "확인"})
			.then(function() {swal.close(); $('.modal-wrap1 .selinput1').focus(); return; });
		} else if(name == "") {
			swal({title: "카테고리명을 입력하세요.", button: "확인"})
			.then(function() {swal.close(); $('.modal-wrap1 .name').focus(); return; });
		} else {
			if(category1cd == "self") { addcate1(selinput1); }// 1차 카테고리가 '직접입력'이면 입력된 값 먼저 저장하고, 2차 저장
			else { addcate2(category1cd, name); } // 2차 카테고리 저장
		}
	} else if(whichBtn == "cccc") { // 3차 카테고리 추가하기 경우
		var category1cd = $(".sel1 option:selected").val();
		var category2cd = $(".sel2 option:selected").val();
		var selinput1 = $(".selinput1").val();
		var selinput2 = $(".selinput2").val();
		
		if(category1cd == "self" && selinput1 == "") {
			swal({title: "카테고리명을 입력하세요.", button: "확인"})
			.then(function() {swal.close(); $('.modal-wrap1 .selinput1').focus(); return; });
		} else if(category2cd == "self" && selinput2 == "") {
			swal({title: "카테고리명을 입력하세요.", button: "확인"})
			.then(function() {swal.close(); $('.modal-wrap1 .selinput2').focus(); return; });
		} else if(name == "") {
			swal({title: "카테고리명을 입력하세요.", button: "확인"})
			.then(function() {swal.close(); $('.modal-wrap1 .name').focus(); return; });
		} else {
			console.log("저장 할 수 있는 상태가 되었습니다.");
			if(category1cd == "self") { addcate1(selinput1); }// 1차 카테고리가 '직접입력'이면 입력된 값 먼저 저장하고, 2차 저장
			else if(category1cd != "self" && category2cd == "self") { addcate2(category1cd, selinput2); }
			else { addcate3(category2cd, name); }
		}
	}//else if(3차 카테고리 유효성 검사)
});// 카테고리 추가하깅~

function addcate1(name) {
	console.log("먼저와야하는뎅");
	var compcd = $("#compcd").val();
	var count = $(".cate1_list tr").length;
	var whichBtn = $("#whichBtn").val();
	
	swal({
		title: '저장하시겠습니까?',
		icon: "info",
		buttons: true,
		imfoMode: true,
		buttons: ["취소", "확인"]
	}).then(function(willDelete) {
		if(willDelete) {
			$.ajax({
				url: "scate1_add.do",
				data: {
					"compcd":compcd,
					"categoryname":name,
					"ordernum":count+1
				},
				async: false,
				success: function(result) {
					console.log("1차 카테고리 추가함", result);
					
					if(whichBtn == "aaaa") {// 1차 카테고리 추가할 때
						swal({
							title: '저장되었습니다.',
							type: 'success',
							icon: "success",
							button: "확인"
						}).then(function(willDelete) {
							$(".modal-wrap1").css({"display": "none"});
							location.href="scategory.do?title=상품관리&name=카테고리관리";
						});
					} else if(whichBtn == "bbbb") {// 2차 카테고리 추가할 때
						$("#catecode1").val(result.data);
						var category1cd = $(".sel1 option:selected").val();
						var name = $(".modal-wrap1 .name").val();
						addcate2(category1cd, name);
					} else if(whichBtn == "cccc") {// 3차 카테고리 추가할 때
						$("#catecode1").val(result.data);
						var category1cd = $(".sel1 option:selected").val();
						var selinput2 = $(".modal-wrap1 .selinput2").val();
						addcate2(category1cd, selinput2);
					}
					
				}, //success
				error: function() { alert("오류"); }
			});//ajax
		}//if(willDelete)
	});//swal then
}//addcate1

function addcate2(code, name) {
	var compcd = $("#compcd").val();
	var selinput1 = $(".selinput1").val();// 직접입력에서 입력한 값
	var category1cd = $("#catecode1").val();// 직접이력에서 추가한 1차 카테고리
	var count = $(".sel1 option:selected").data("cnt");
	if(count == null || count == undefined || count == "") { count = 0; }
	
	if(code == "self") {// '직접입력'이고 1차 카테고리 저장한 상태에서 2차 카테고리만 저장하면 됨!
		$.ajax({
			url: "scate2_add.do",
			data: {
				"compcd":compcd,
				"category1cd":category1cd,
				"categoryname":name,// 2차 카테고리 이름
				"ordernum":count+1
			},
			async: false,
			success: function(result) {
				console.log("2차 카테고리 추가함", result);
				var whichBtn = $("#whichBtn").val();
				
				if(whichBtn == "bbbb") {
					swal({
						title: '저장되었습니다.',
						type: 'success',
						icon: "success",
						button: "확인"
					}).then(function(willDelete) {
						console.log("직접입력한 2차 카테고리 추가했습니당~");
						$(".modal-wrap1").css({"display": "none"});
						location.href="scategory.do?title=상품관리&name=카테고리관리";
					});
				} else if(whichBtn == "cccc") {
					$("#catecode2").val(result.data);
					var category2cd = $(".sel2 option:selected").val();
					var name = $(".modal-wrap1 .name").val();
					addcate3(category2cd, name);
				}
				
			}, //success
			error: function() { alert("오류"); }
		});//ajax
	} else { // 원래 있던 카테고리를 선택한 경우
		swal({
			title: '저장하시겠습니까?',
			icon: "info",
			buttons: true,
			imfoMode: true,
			buttons: ["취소", "확인"]
		}).then(function(willDelete) {
			if(willDelete) {
				$.ajax({
					url: "scate2_add.do",
					data: {
						"compcd":compcd,
						"category1cd":code,
						"categoryname":name,
						"ordernum":count+1
					},
					success: function(result) {
						console.log("2차 카테고리 추가함", result);
						var whichBtn = $("#whichBtn").val();
						
						if(whichBtn == "bbbb") {
							swal({
								title: '저장되었습니다.',
								type: 'success',
								icon: "success",
								button: "확인"
							}).then(function(willDelete) {
								console.log("원래 있던 코드로 2차 카테고리 추가했습니당~");
								$(".modal-wrap1").css({"display": "none"});
								location.href="scategory.do?title=상품관리&name=카테고리관리";
							});
						} else if(whichBtn == "cccc") {
							$("#catecode2").val(result.data);
							var category2cd = $(".sel2 option:selected").val();
							var name = $(".modal-wrap1 .name").val();
							console.log("여기로 들어오는 거 맞음?");
							addcate3(category2cd, name);
						}
					}, //success
					error: function() { alert("오류"); }
				});//ajax
			}//if(willDelete)
		});//swal then
	}//else
}//addcate2

function addcate3(code, name) {
	var compcd = $("#compcd").val();
	var category2cd = $("#catecode2").val();// 직접이력에서 추가한 1차 카테고리
	var count = $(".sel2 option:selected").data("cnt");
	if(count == null || count == undefined || count == "") { count = 0; }
	
	if(code == "self") { // 2차 카테고리가 '직접입력'일 경우
		$.ajax({
			url: "scate3_add.do",
			data: {
				"compcd":compcd,
				"category2cd":category2cd,
				"categoryname":name,// 3차 카테고리 이름
				"ordernum":count+1
			},
			async: false,
			success: function(result) {
				console.log("3차 카테고리 추가함", result);
				swal({
					title: '저장되었습니다.',
					type: 'success',
					icon: "success",
					button: "확인"
				}).then(function(willDelete) {
					console.log("원래 있던 코드로 2차 카테고리 추가했습니당~");
					$(".modal-wrap1").css({"display": "none"});
					location.href="scategory.do?title=상품관리&name=카테고리관리";
				});
			}, //success
			error: function() { alert("오류"); }
		});//ajax
	} else { // 2차 카테고리를 원래있던 카테고리를 선택한 경우
		swal({
			title: '저장하시겠습니까?',
			icon: "info",
			buttons: true,
			imfoMode: true,
			buttons: ["취소", "확인"]
		}).then(function(willDelete) {
			if(willDelete) {
				$.ajax({
					url: "scate3_add.do",
					data: {
						"compcd":compcd,
						"category2cd":code,
						"categoryname":name,
						"ordernum":count+1
					},
					success: function(result) {
						console.log("3차 카테고리 추가함", result);
						swal({
							title: '저장되었습니다.',
							type: 'success',
							icon: "success",
							button: "확인"
						}).then(function(willDelete) {
							console.log("원래 있던 코드로 3차 카테고리 추가했습니당~");
							$(".modal-wrap1").css({"display": "none"});
							location.href="scategory.do?title=상품관리&name=카테고리관리";
						});
					}, //success
					error: function() { alert("오류"); }
				});//ajax
			}//if(willDelete)
		});//swal then
	}
}

/*modal2*/
$(document).on("click", ".btn-change", function() {
	$(".modal-wrap2").css({"display":"flex"});
});
$(".pop-close2").click(function () {
	$(".modal-wrap2").css({"display": "none"});
	// 초기화
	$(".modal-wrap2 .name").val("");
	$(".sel3").children().eq(0).prop("selected", true);
	$(".sel4").children().eq(0).prop("selected", true);
});

$(document).on("click", ".table-wrapper .table-responsive:nth-child(1) .btn-change", function() {// 1차 카테고리 수정하기 버튼 클릭했을 때
	$(".modal-wrap2 .pop-list").css({"display": "flex"});
	$(".modal-wrap2 .pop-list:nth-child(1), .modal-wrap2 .pop-list:nth-child(2)").css({"display": "none"}); //1,2번째 숨기기
	$("#whichModi").val("aaaa");// 1차 수정하는거 알리기
	
	var category1cd = $(this).parent().parent().parent().next().text();// 1차 카테고리 코드
	var name = $(this).parent().parent().children().eq(0).html();
	var categoryname = name.split("<p>");// p태그 기준으로 자르면 카테고리이름만 남음
	$(".modal-wrap2 .name").val(categoryname[0]);
});

$(document).on("click", ".table-wrapper .table-responsive:nth-child(2) .btn-change", function() {// 2차 카테고리 수정하기 버튼 클릭했을 때
	$(".modal-wrap2 .pop-list").css({"display": "flex"});
	$(".modal-wrap2 .pop-list:nth-child(2)").css({"display": "none"});// 2차 숨기기
	$("#whichModi").val("bbbb");// 2차 수정하는거 알리기
	
	var compcd = $("#compcd").val();
	
	$.ajax({
		url: "scate1_list.do",
		data: { "compcd":compcd },
		success: function(result) {
			console.log(result);
			var data = result.data;
			var count = data.length;
			
			let html = "";
			
			for(var i = 0; i < count; i++) {
				if(data[i].useyn == 'Y') {
					html += '<option value="'+data[i].category1cd+'" data-cnt="'+data[i].cnt+'">'+data[i].categoryname+'</option>' }
			}//for
			$(".sel3").append(html);
			
			var selcode1 = $("#selcode1").val();
			$(".sel3").val(selcode1).prop("selected", true);
		},//success
		error: function() { alert("오류"); }
	});//ajax 카테고리1 리스트
	
	var category2cd = $(this).parent().parent().parent().next().text();// 1차 카테고리 코드
	var name = $(this).parent().parent().children().eq(0).html();
	var categoryname = name.split("<p>");// p태그 기준으로 자르면 카테고리이름만 남음
	$(".modal-wrap2 .name").val(categoryname[0]);
});

$(document).on("click", ".table-wrapper .table-responsive:nth-child(3) .btn-change", function() {// 3차 카테고리 수정하기 버튼 클릭했을 때
	$(".modal-wrap2 .pop-list").css({"display": "flex"});
	$("#whichModi").val("cccc");// 1차 수정하는거 알리기
	
	var compcd = $("#compcd").val();
	var category1cd = $("#selcode1").val();
	
	$.ajax({// 1차 카테고리 리스트
		url: "scate1_list.do",
		data: { "compcd":compcd },
		success: function(result) {
			console.log(result);
			var data = result.data;
			var count = data.length;
			
			let html = "";
			
			for(var i = 0; i < count; i++) {
				if(data[i].useyn == 'Y') {
					html += '<option value="'+data[i].category1cd+'" data-cnt="'+data[i].cnt+'">'+data[i].categoryname+'</option>' }
			}//for
			$(".sel3").append(html);
			
			var selcode1 = $("#selcode1").val();
			$(".sel3").val(selcode1).prop("selected", true);
		},//success
		error: function() { alert("오류"); }
	});//ajax 카테고리1 리스트
	
	$.ajax({// 2차 카테고리 리스트
		url: "scate2_list.do",
		data: {
			"compcd":compcd,
			"category1cd":category1cd
		},
		success: function(result) {
			console.log(result);
			var data = result.data;
			var count = data.length;
			
			let html = "";
			
			for(var i = 0; i < count; i++) {
				if(data[i].useyn == 'Y') {
					html += '<option value="'+data[i].category2cd+'" data-cnt="'+data[i].cnt+'">'+data[i].categoryname+'</option>' }
			}//for
			$(".sel4").append(html);
			
			var selcode2 = $("#selcode2").val();//선택된 2차 카테고리 코드
			$(".sel4").val(selcode2).prop("selected", true);// 2차 카테고리 선택으로 만들기
		},//success
		error: function() { alert("오류"); }
	});//ajax 카테고리2 리스트
	
	$(".sel3").on('change', function() {
		var code1 = $(".sel3 option:selected").val();
		
		$.ajax({// 2차 카테고리 리스트
			url: "scate2_list.do",
			data: {
				"compcd":compcd,
				"category1cd":code1
			},
			success: function(result) {
				console.log(result);
				var data = result.data;
				var count = data.length;
				
				let html = "";
				
				for(var i = 0; i < count; i++) {
					if(data[i].useyn == 'Y') {
						html += '<option value="'+data[i].category2cd+'" data-cnt="'+data[i].cnt+'">'+data[i].categoryname+'</option>' }
				}//for
				$(".sel4").html(html);
				$(".sel4").children().eq(0).prop("selected", true);// 첫번째꺼로 선택됨
			},//success
			error: function() { alert("오류"); }
		});//ajax 카테고리2 리스트
	});//change
	
	var category3cd = $(this).parent().parent().parent().next().text();// 1차 카테고리 코드
	var name = $(this).parent().parent().children().eq(0).html();
	var categoryname = name.split("<p>");// p태그 기준으로 자르면 카테고리이름만 남음
	$(".modal-wrap2 .name").val(categoryname[0]);
	$("#selcode3").val(category3cd);
});// 3차 카테고리 수정하기 버튼 눌렀을 때

//카테고리 추가하깅~
$("#modiBtn").on("click", function() {
	var whichModi = $("#whichModi").val();
	var name = $(".modal-wrap2 .name").val();
	
	if(whichModi == "aaaa") { // 1차 카테고리 수정하기 경우
		if(name == "") {
			swal({title: "카테고리명을 입력하세요.", button: "확인"})
			.then(function() {swal.close(); $('.modal-wrap2 .name').focus(); return; });
		} else { modicate1(name); }
	} else if(whichModi == "bbbb") { // 2차 카테고리 수정하기 경우
		if(name == "") {
			swal({title: "카테고리명을 입력하세요.", button: "확인"})
			.then(function() {swal.close(); $('.modal-wrap2 .name').focus(); return; });
		} else { modicate2(name); }
	} else if(whichModi == "cccc") { // 3차 카테고리 수정하기 경우
		if(name == "") {
			swal({title: "카테고리명을 입력하세요.", button: "확인"})
			.then(function() {swal.close(); $('.modal-wrap2 .name').focus(); return; });
		} else { modicate3(name); }
	}//else if(3차 카테고리 유효성 검사)
});// 카테고리 추가하깅~

//1차 카테고리 수정
function modicate1(name) {
	var category1cd = $("#selcode1").val();
	var compcd = $("#compcd").val();
	
	swal({
		title: '저장하시겠습니까?',
		icon: "info",
		buttons: true,
		imfoMode: true,
		buttons: ["취소", "확인"]
	}).then(function(willDelete) {
		if(willDelete) {
			$.ajax({
				url: "scate1_modi.do",
				data: {
					"compcd":compcd,
					"category1cd":category1cd,
					"categoryname":name
				},
				success: function(result) {
					swal({
						title: '저장되었습니다.',
						type: 'success',
						icon: "success",
						button: "확인"
					}).then(function(willDelete) {
						$(".modal-wrap2").css({"display": "none"});
						location.href="scategory.do?title=상품관리&name=카테고리관리";
					});
				},
				error: function() { alert("오류"); }
			});//ajax
		}//if(willDelete)
	});//swal then
}//1차 카테고리 수정

// 2차 카테고리 수정
function modicate2(name) {
	var category1cd = $(".sel3 option:selected").val();
	var category2cd = $("#selcode2").val();
	var compcd = $("#compcd").val();
	
	swal({
		title: '저장하시겠습니까?',
		icon: "info",
		buttons: true,
		imfoMode: true,
		buttons: ["취소", "확인"]
	}).then(function(willDelete) {
		if(willDelete) {
			$.ajax({
				url: "scate2_modi.do",
				data: {
					"compcd":compcd,
					"category1cd":category1cd,
					"category2cd":category2cd,
					"categoryname":name
				},
				success: function(result) {
					swal({
						title: '저장되었습니다.',
						type: 'success',
						icon: "success",
						button: "확인"
					}).then(function(willDelete) {
						$(".modal-wrap2").css({"display": "none"});
						location.href="scategory.do?title=상품관리&name=카테고리관리";
					});
				},//success
				error: function() { alert("오류"); }
			});//ajax
		}//if(willDelete)
	});//swal then
}//2차 카테고리 수정

// 3차 카테고리 수정
function modicate3(name) {
	var category1cd = $(".sel3 option:selected").val();
	var category2cd = $(".sel4 option:selected").val();
	var category3cd = $("#selcode3").val();
	var compcd = $("#compcd").val();
	
	console.log("1111111",category2cd);
	if(category2cd == undefined) {
		swal({title: "2차 카테고리를 추가해주세요.", button: "확인"})
		.then(function() {swal.close(); $('.modal-wrap2 .sel4').focus(); return; });
	} else {
		swal({
			title: '저장하시겠습니까?',
			icon: "info",
			buttons: true,
			imfoMode: true,
			buttons: ["취소", "확인"]
		}).then(function(willDelete) {
			if(willDelete) {
				$.ajax({
					url: "scate3_modi.do",
					data: {
						"compcd":compcd,
						"category2cd":category2cd,
						"category3cd":category3cd,
						"categoryname":name
					},
					success: function(result) {
						swal({
							title: '저장되었습니다.',
							type: 'success',
							icon: "success",
							button: "확인"
						}).then(function(willDelete) {
							$(".modal-wrap2").css({"display": "none"});
							location.href="scategory.do?title=상품관리&name=카테고리관리";
						});
					},//success
					error: function() { alert("오류"); }
				});//ajax
			}//if(willDelete)
		});//swal then
	}//else
}//3차 카테고리 수정

/* 메뉴 이동 */
$(function () { 
	$(".section .table1 tbody").sortable({// 1차 카테고리 이동
		start:function(event,ui){},// 드래그 시작 시 호출
		stop:function(event,ui){reorder1();}// 드래그 종료 시 호출
	});
	$(".section .table1 tbody").disableSelection();
	
	$(".section .table2 tbody").sortable({// 2차 카테고리 이동
		start:function(event,ui){},// 드래그 시작 시 호출
		stop:function(event,ui){reorder2();}// 드래그 종료 시 호출
	});
	$(".section .table2 tbody").disableSelection();
	
	$(".section .table3 tbody").sortable({// 3차 카테고리 이동
		start:function(event,ui){},// 드래그 시작 시 호출
		stop:function(event,ui){reorder3();}// 드래그 종료 시 호출
	});
	$(".section .table3 tbody").disableSelection();
});

function reorder1() {
	$('.cate1_list tr').each(function(i, box) {
		$(box).children('td').eq(2).text(i + 1);
	});
}
function reorder2() {
	$('.cate2_list tr').each(function(i, box) {
		$(box).children('td').eq(2).text(i + 1);
	});
}
function reorder3() {
	$('.cate3_list tr').each(function(i, box) {
		$(box).children('td').eq(2).text(i + 1);
	});
}

// 순서변경 저장
$("#odernumBtn").on("click", function() {
	var selcount1 = $(".cate1_list tr.selected").length;// 선택된 카테고리1 있는지 확인 (0이면 없음, 1이면 있음)
	var selcount2 = $(".cate2_list tr.selected").length;// 선택된 카테고리1 있는지 확인 (0이면 없음, 1이면 있음)
	
	if(selcount1 == 0) { // 선택된 1차 카테고리 없을 때 (1차만 변경)
		ordernumChange1("aaaa");
	} else if(selcount1 > 0 && selcount2 == 0) {// 선택된 1차 카테고리 있고, 선택된 2차 카테고리 없을 때 (1,2차만 변경)
		ordernumChange1("bbbb"); ordernumChange2("bbbb");
	} else if(selcount1 > 0 && selcount2 > 0) {// 선택된 1차 카테고리 있고, 선택된 2차 카테고리도 있을 때 (1,2,3 차 모두 변경)
		ordernumChange1("cccc"); ordernumChange2("cccc"); ordernumChange3();
	}
});// 순서변경 저장

// 1차 카테고리 순서변경
function ordernumChange1(which) {
	var compcd = $("#compcd").val();
	
	var count = $(".cate1_list tr").length;
	var cd = {};
	var scncd = [];
	
	for(var i = 0; i < count; i++) {
		cd = {};//초기화
		cd.category1cd = $(".cate1_list tr").eq(i).children().eq(1).text();
		cd.ordernum = $(".cate1_list tr").eq(i).children().eq(2).text();
		scncd.push(cd);
	}
	
	if(count > 0) {
		$.ajax({
			url: "scate1_numC.do",
			data: {
				"scncd":JSON.stringify(scncd),
				"compcd":compcd
			},
			success: function(result) {
				if(which == "aaaa") {
					swal({
						title: '저장되었습니다.',
						type: 'success',
						icon: "success",
						button: "확인"
					}).then(function(willDelete) {
						location.href="scategory.do?title=상품관리&name=카테고리관리";
					});
				} else {//which == "bbbb"
					console.log("1차 순서 바꿈");
				}
			},//success
			error: function() { alert("오류"); }
		});//ajax
	}//if
}//ordernumChange1()

// 2차 카테고리 순서변경
function ordernumChange2(which) {
	var compcd = $("#compcd").val();
	
	var count = $(".cate2_list tr").length;
	var cd = {};
	var scncd = [];
	
	for(var i = 0; i < count; i++) {
		cd = {};//초기화
		cd.category2cd = $(".cate2_list tr").eq(i).children().eq(1).text();
		cd.ordernum = $(".cate2_list tr").eq(i).children().eq(2).text();
		scncd.push(cd);
	}
	
	if(count > 0) {
		$.ajax({
			url: "scate2_numC.do",
			data: {
				"scncd":JSON.stringify(scncd),
				"compcd":compcd
			},
			success: function(result) {
				if(which == "bbbb") {
					swal({
						title: '저장되었습니다.',
						type: 'success',
						icon: "success",
						button: "확인"
					}).then(function(willDelete) {
						location.href="scategory.do?title=상품관리&name=카테고리관리";
					});
				} else {//which == "cccc"
					console.log("2차 순서 바꿈");
				}
			},
			error: function() { alert("오류"); }
		});//ajax
	}//if
}//ordernumChange2()

// 3차 카테고리 순서변경
function ordernumChange3() {
	var compcd = $("#compcd").val();
	
	var count = $(".cate3_list tr").length;
	var cd = {};
	var scncd = [];
	
	for(var i = 0; i < count; i++) {
		cd = {};//초기화
		cd.category3cd = $(".cate3_list tr").eq(i).children().eq(1).text();
		cd.ordernum = $(".cate3_list tr").eq(i).children().eq(2).text();
		scncd.push(cd);
	}
	
	if(count > 0) {
		$.ajax({
			url: "scate3_numC.do",
			data: {
				"scncd":JSON.stringify(scncd),
				"compcd":compcd
			},
			success: function(result) {
				swal({
					title: '저장되었습니다.',
					type: 'success',
					icon: "success",
					button: "확인"
				}).then(function(willDelete) {
					location.href="scategory.do?title=상품관리&name=카테고리관리";
				});
			},
			error: function() { alert("오류"); }
		});//ajax
	}//if
}//ordernumChange3()

/* 직접입력 */
$('.sel1').change(function () {
	const result = $('.sel1 option:selected').val();
	if (result == '직접입력') {$('.selinput1').show();} 
	else {$('.selinput1').hide();}
});

$('.sel2').change(function () {
	const result = $('.sel2 option:selected').val();
	if (result == '직접입력') {$('.selinput2').show();} 
	else {$('.selinput2').hide();}
});

/* select */
/////////////// 체인점
$('.pop3 .chain_cate1').on('click', 'tr td', function() {
	$('.pop3 .table tbody tr').removeClass('selected');// 선택 되어있는 tr에 selected 지우기
	$(this).parent('tr').addClass('selected');// 클릭한 tr에 selected 추가
	var category1cd = $(this).next().text();
	chaincategory2(category1cd);// 카테고리2 보여주기
});// 본점 1차 카테고리 클릭

$('.pop3 .chain_cate2').on('click', 'tr td', function() {
	$('.pop3 .chain_cate2 tr').removeClass('selected');// 선택 되어있는 tr에 selected 지우기
	$('.pop3 .chain_cate3 tr').removeClass('selected');// 선택 되어있는 tr에 selected 지우기
	var category2cd = $(this).next().text();
	chaincategory3(category2cd);
});// 본점 2차 카테고리 클릭

$('.pop3 .chain_cate3').on('click', 'tr td', function() {
	$('.pop3 .chain_cate3 tr').removeClass('selected');// 선택 되어있는 tr에 selected 지우기
	$(this).parent('tr').addClass('selected');
});// 본점 3차 카테고리 클릭

/////////////// 올댓
$('.pop3 .at_cate1').on('click', 'tr td', function() {
	$('.pop3 .table tbody tr').removeClass('selected');// 선택 되어있는 tr에 selected 지우기
	$(this).parent('tr').addClass('selected');// 클릭한 tr에 selected 추가
	var category1cd = $(this).next().text();
	atcategory2(category1cd);// 카테고리2 보여주기
});// 본점 1차 카테고리 클릭

$('.pop3 .at_cate2').on('click', 'tr td', function() {
	$('.pop3 .at_cate2 tr').removeClass('selected');// 선택 되어있는 tr에 selected 지우기
	$('.pop3 .at_cate3 tr').removeClass('selected');// 선택 되어있는 tr에 selected 지우기
	$(this).parent('tr').addClass('selected');
	var category2cd = $(this).next().text();
	atcategory3(category2cd);
});// 본점 2차 카테고리 클릭

$('.pop3 .at_cate3').on('click', 'tr td', function() {
	$('.pop3 .at_cate3 tr').removeClass('selected');// 선택 되어있는 tr에 selected 지우기
	$(this).parent('tr').addClass('selected');
});// 본점 3차 카테고리 클릭


//$('.pop3 .table1 tbody').on('click', 'tr td', function () {
//	$('.pop3 .table tbody tr').removeClass('selected');
//	$(this).parent('tr').addClass('selected');
//	$(".pop3 .table2 tbody tr").css({"visibility": "visible"});
//	$(".pop3 .table3 tbody tr").css({"visibility": "hidden"});
//	var category1cd = $(this).next().text();
//	atcategory2(category1cd);
//});
//
//$('.pop3 .table2 tbody').on('click', 'tr td', function () {
//	$('.pop3 .table2 tbody tr').removeClass('selected');
//	$('.pop3 .table3 tbody tr').removeClass('selected');
//	$(this).parent('tr').addClass('selected');
//	$(".pop3 .table3 tbody tr").css({"visibility": "visible"});
//	var category2cd = $(this).next().text();
//	atcategory3(category2cd);
//});
//
//$('.pop3 .table3 tbody').on('click', 'tr td', function () {
//	$('.pop3 .table3 tbody tr').removeClass('selected');
//	$(this).parent('tr').addClass('selected');
//});

// 체인본점 1차 카테고리 리스트 불러오기
function chaincategory1() {
	var chaincode = $("#chaincode").val();
	
	$.ajax({
		url: "cate1_list.do",
		data: { "chaincode":chaincode },
		success: function(result) {
			console.log("본점 카테고리1 리스트", result);
			var data = result.data;
			var count = data.length;
			let html = '';
		
			for(var i = 0; i < count; i++) {
				if(data[i].useyn == 'Y') {
					html += '<tr>'
					html += 	'<td><ul><li>'+data[i].categoryname+'<p>'+data[i].cnt+'개 카테고리 연결됨</p></li></ul></td>'
					html += 	'<td style="display: none;">'+data[i].category1cd+'</td>'
					html += '</tr>'
				}//if
			}//for
			$('.chain_cate1').html(html);
		},
		error: function() { alert("오류"); }
	});//ajax
}//chaincategory1()

// 체인본점 2차 카테고리 리스트 불러오기
function chaincategory2(code) {
	var chaincode = $("#chaincode").val();
	
	$.ajax({
		url: "cate2_list.do",
		data: {
			"chaincode":chaincode,
			"category1cd":code
		},
		success: function(result) {
			console.log("카테고리2 리스트", result);
			var data = result.data;
			var count = data.length;
			let html = '';
			
			for(var i = 0; i < count; i++) {
				if(data[i].useyn == 'Y') {
					html += '<tr>'
					html += 	'<td><ul><li>'+data[i].categoryname+'<p>'+data[i].cnt+'개 카테고리 연결됨</p></li></ul></td>'
					html += 	'<td style="display: none;">'+data[i].category2cd+'</td>'
					html += '</tr>'
				}//if
			}//for
			$('.chain_cate2').html(html);
		},//success
		error: function() { alert("오류"); }
	});//ajax
}//chaincategory2()

// 체인본점 3차 카테고리 리스트 불러오기
function chaincategory3(code) {
	var chaincode = $("#chaincode").val();
	
	$.ajax({
		url: "cate3_list.do",
		data: {
			"chaincode":chaincode,
			"category2cd":code
		},
		success: function(result) {
			console.log("카테고리3 리스트", result);
			var data = result.data;
			var count = data.length;
			let html = '';
			
			for(var i = 0; i < count; i++) {
				if(data[i].useyn == 'Y') {
					html += '<tr>'
					html += 	'<td><ul><li>'+data[i].categoryname+'</li></ul></td>'
					html += 	'<td style="display: none;">'+data[i].category3cd+'</td>'
					html += '</tr>'
				}
			}//for
			$('.chain_cate3').html(html);
		},//success
		error: function() { alert("오류"); }
	});//ajax
}//chaincategory3()

// 올댓 1차 카테고리 리스트 불러오기
function atcategory1() {
	$.ajax({
		url: "at_cate1.do",
		success: function(result) {
			console.log('카테고리1 리스트 ',result);
			var data = result.data;
			var count = data.length;
			let html = '';
			
			for(var i = 0; i < count; i++) {
				html += '<tr>'
				html += 	'<td><ul><li>'+data[i].categoryname+'<p>'+data[i].cnt+'개 카테고리 연결됨</p></li></ul></td>'
				html += 	'<td style="display: none;">'+data[i].category1cd+'</td>'
				html += '</tr>'
			}//for
			$('.at_cate1').html(html);
		},//success
		error: function() { alert("오류"); }
	});//ajax
}//atcategory1()

// 올댓 2차 카테고리 리스트 불러오기
function atcategory2(category1cd) {
	$.ajax({
		url: "at_cate2.do",
		data: { "category1cd":category1cd },
		success: function(result) {
			console.log("카테고리2 리스트", result);
			var data = result.data;
			var count = data.length;
			let html = '';
			
			for(var i = 0; i < count; i++) {
				html += '<tr>'
				html += 	'<td><ul><li>'+data[i].categoryname+'<p>'+data[i].cnt+'개 카테고리 연결됨</p></li></ul></td>'
				html += 	'<td style="display: none;">'+data[i].category2cd+'</td>'
				html += '</tr>'
			}//for
			$('.at_cate2').html(html);
		},
		error: function() { alert("오류"); }
	});//ajax
}//atcategory2()

// 올댓 3차 카테고리 리스트 불러오기
function atcategory3(category2cd) {
	$.ajax({
		url: "at_cate3.do",
		data: { "category2cd":category2cd },
		success: function(result) {
			console.log("카테고리3 리스트", result);
			var data = result.data;
			var count = data.length;
			let html = '';
			
			for(var i = 0; i < count; i++) {
				html += '<tr>'
				html += 	'<td><ul><li>'+data[i].categoryname+'</li></ul></td>'
				html += 	'<td style="display: none;">'+data[i].category3cd+'</td>'
				html += '</tr>'
			}//for
			$('.at_cate3').html(html);
		},
		error: function() { alert("오류"); }
	});//ajax
}//atcategory3()

// 템플릿 선택완료 클릭
$("#catetemp").on("click", function() {
	var chaincode = $("#chaincode").val();
	var compcd = $("#compcd").val();
	var template = $(".pop3 input[type=checkbox][name=use]:checked").attr("id");
	console.log(template);
	
	if(template == "use1") { // 체인 본점 카테고리 사용하기 선택
		swal({
			title: '선택하시겠습니까?',
			icon: "info",
			buttons: true,
			imfoMode: true,
			buttons: ["취소", "확인"]
		}).then(function(willDelete) {
			if(willDelete) {
				$.ajax({
					url: "chaincate_use.do",
					data: { 
						"compcd":compcd,
						"chaincode":chaincode
					},
					success: function(result) {
						swal({
							title: '선택되었습니다.',
							type: 'success',
							icon: "success",
							button: "확인"
						}).then(function(willDelete) {
							location.href="scategory.do?title=상품관리&name=카테고리관리";
						});
					},
					error: function() { alert("오류"); }
				});//ajax
			}//if(willDelete)
		});//swal then
	}//if(use1)
	else if(template == "use2") { // 올댓페이 카테고리 사용하기 선택
		swal({
			title: '선택하시겠습니까?',
			icon: "info",
			buttons: true,
			imfoMode: true,
			buttons: ["취소", "확인"]
		}).then(function(willDelete) {
			if(willDelete) {
				$.ajax({
					url: "atscate_use.do",
					data: { "compcd":compcd },
					success: function(result) {
						swal({
							title: '선택되었습니다.',
							type: 'success',
							icon: "success",
							button: "확인"
						}).then(function(willDelete) {
							location.href="scategory.do?title=상품관리&name=카테고리관리";
						});
					},
					error: function() { alert("오류"); }
				});//ajax
			}//if(willDelete)
		});//swal then
	}//if(use2)
	else if(template == "use3") {
		$(".modal-wrap3").css({"display": "none"});
	}
});// 템플릿 선택완료 클릭

/*modal3*/
//$(".pop-close3").click(function () {
//	$(".modal-wrap3").css({"display": "none"});
//});

/* 카테고리 템플릿 선택 */
$('.category-wrap').click(function () {
	$(this).find('.category-cont').stop().slideToggle('0').each(function(){$('.category-cont').not(this).stop().slideUp('0');});
	$(this).find('.fa-solid').toggleClass('active');
	$(this).siblings().find('.active').each(function () {$(this).removeClass('active');});
});

$(".category-wrap:nth-child(1) .category").trigger("click");


$(".category-cont").click(function (e) {
	e.stopPropagation();
});

/* 체크박스 하나만 선택 */
$('.pop3 input[type="checkbox"][name="use"]').click(function(){
	$('.pop3 input[type="checkbox"][name="use"]').prop('checked',false);
	$(this).prop('checked',true);
});


function useYN(categorycd, x) {
	var chaincode = $('#chaincode').val();
	console.log(x);
	console.log(categorycd);
	console.log("bbbb");
}