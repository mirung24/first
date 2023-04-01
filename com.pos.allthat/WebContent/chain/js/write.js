/* 파일 */
$(document).on("change", ".file-input1", function () {
	var maxSize = 1*1024*1024; //1MB
	var fileSize = $(this)[0].files[0].size;
	console.log(fileSize);
	
	if(fileSize > maxSize) {
		swal({title: "첨부파일은 1MB 이내로 등록하세요.", button: "확인"})
		.then(function() {swal.close(); return; });
		$(".filename1").val("");
	} else {
		if ($(this).val() != "") { $(".filename1").val($(this).val()); }
	}
	
});//file-input1 change
$(document).on("change", ".file-input2", function () {
	var maxSize = 1*1024*1024; //1MB
	var fileSize = $(this)[0].files[0].size;
	console.log(fileSize);
	
	if(fileSize > maxSize) {
		swal({title: "첨부파일은 1MB 이내로 등록하세요.", button: "확인"})
		.then(function() {swal.close(); return; });
		$(".filename2").val("");
	} else {
		if ($(this).val() != "") { $(".filename2").val($(this).val()); }
	}
});//file-input2 change
$(document).on("change", ".file-input3", function () {
	var maxSize = 1*1024*1024; //1MB
	var fileSize = $(this)[0].files[0].size;
	console.log(fileSize);
	
	if(fileSize > maxSize) {
		swal({title: "첨부파일은 1MB 이내로 등록하세요.", button: "확인"})
		.then(function() {swal.close(); return; });
		$(".filename3").val("");
	} else {
		if ($(this).val() != "") { $(".filename3").val($(this).val()); }
	}
});//file-input3 change

$(document).on("click", "#plusBtn", function () {
	var count = $('input[type=file]').length;
	var fileLength = $('a.attfile').length;
	console.log(count);

	let html = "";
	
	if(count == 2) {
		html += '<div class="d-flex mb-2">'
		html += 	'<label class="img-plus"><i class="fa-solid fa-plus mr-1"></i>'
		html += 		'<input type="file" class="file-input file-input2" name="file">'
		html += 	'</label>'
		html += 	'<input type="text" class="form-control filename2">'
		html += '</div>'
		$('.files').append(html);
	} else if(count == 3 && fileLength == 0) {
		html += '<div class="d-flex mb-2">'
		html += 	'<label class="img-plus"><i class="fa-solid fa-plus mr-1"></i>'
		html += 		'<input type="file" class="file-input file-input3" name="file">'
		html += 	'</label>'
		html += 	'<input type="text" class="form-control filename3">'
		html += '</div>'
		$('.files').append(html);
	} else if(count > 3) {
		swal({title: "첨부파일은 3개까지 가능합니다.", button: "확인"})
		.then(function() {swal.close(); return; });
	}
});//plusBtn click

$(document).on("click", "#minusBtn", function () {
	$('.file-input').parent().parent('div:last-child').remove();
});//minusBtn click

// checkbox 한개만 선택 가능하게
$('input[type="checkbox"][name="chk"]').click(function () {// 중복선택방지
	if ($(this).prop('checked')) {
		$('input[type="checkbox"][name="chk"]').prop('checked', false);
		$(this).prop('checked', true);
	}
});

$('#chk2').change(function() {
	if($('#chk2').is(":checked")) { $(".modal-wrap1").css({"display": "flex"}); }
});

$(".pop-close1").click(function(){
	$(".modal-wrap1").css({"display": "none"});
	$('.sel-table tbody tr').removeClass('selected');
	
	$('input[type="checkbox"][name="chk"]').prop('checked', false);
//	$('#chk1').prop('checked', true);
});

$(document).ready(function() {
	var chaincode = $('#chaincode').val();//체인코드
	
	$('#content').summernote({
		height: 500,
		minHeight: null,
		maxHeight: null,
		resize: false,
		disableResizeEditor: true,
		focus: true,
//		placeholder: "내용을 입력하세요.",
		lang: "ko-KR",
		toolbar: [
			['fontname', ['fontname']],
			['fontsize', ['fontsize']],
			['style', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
			['color', ['forecolor', 'color']],
//			['table', ['table']],
			['para', ['ul', 'ol', 'paragraph']],
			['height', ['height']],
			['insert', ['picture']],
//			['view', ['fullscreen', 'help']]
		],//toolbar
		fontNames: ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New','맑은 고딕','궁서','굴림체','굴림','돋움체','바탕체'],
		fontSizes: ['8','9','10','11','12','14','16','18','20','22','24','28','30','36','50','72'],
		callbacks : { 
        	onImageUpload : function(files, editor, welEditable) {
		        // 파일 업로드(다중업로드를 위해 반복문 사용)
		        for (var i = files.length - 1; i >= 0; i--) {
			        uploadSummernoteImageFile(files[i], this);
		        }
        	}//onImageUpload
        }//callbacks
	});//summernote
	
	$('.note-control-selection').remove();

	// 이미지 업로드
	function uploadSummernoteImageFile(file, el) {
		data = new FormData();
		data.append("file", file);
		
		console.log('이미지', file);
		console.log('이미지 데이터', data);
		
		$.ajax({
			data : data,
			type : "POST",
			url : "image_upload.do",
			contentType : false,
			enctype : 'multipart/form-data',
			processData : false,
			success : function(data) {
				console.log(data);
				$(el).summernote('editor.insertImage', data.url);
			}
		});
	}// 이미지 업로드
	
	// 가맹점 리스트 조회
	$.ajax({
		url:"company_list.do",
		type:"post",
		data: { "chaincode":chaincode },
		async: false, 
		success: function(result) {
			var data = result.data;
			let html = "";
			var count = result.data.length;
			console.log(count);
			$('#ori_count').val(count);
			
			if(count > 0) {
				for(var i = 0; i < count; i++) {
					html += "<tr>"
					html += 	"<td>"+data[i].corporatenumber+"</td>"
					html += 	"<td>"+data[i].companyname+"</td>"
					html += 	"<td>"+data[i].addr+"</td>"
					html += 	"<td style='display: none;' id='"+data[i].compcd+"'>"+data[i].compcd+"</td>"
					html += "</tr>"
				}//for
			}//if
			$('.comp_tbody').html(html);
		},
		error: function() { alert("오류"); }
	});// ajax
	
	// 가맹점 선택
	$('#selBtn').click(function() {
		var count = $('.selected').length;
		
		if(count < 0) {
			swal({title: "가맹점을 선택하세요.", button: "확인"})
			.then(function() {swal.close(); return; });
		} else {
			$(".modal-wrap1").css({"display": "none"});
		}//else
	});//selBtn(가맹점 선택)
	
	// 공지사항 수정할 때 
	if($('#noticecode').val() != 'null') {
		var noticecode = $('#noticecode').val();
		console.log(noticecode);
		
		//공지사항 내용 가져오기
		$.ajax({
			url: "read_info.do",
			type: "post",
			data: { "noticecode": noticecode },
			async: false,
			success: function(result) {
				console.log(result);
				$('[name=category]').val(result.category);
				$('#title').val(result.title);
//				$('.note-editable').html(result.content);
				$('#content').summernote('code', result.content);
//				$('#content').val(result.content);
			},
			error: function() { alert("오류"); }
		});// ajax(공지사항 내용 가져오기)
		
		// 공지대상 선택했던 리스트 가져오기
		$.ajax({
			url: "target.do",
			type: "post",
			data: { "noticecode":noticecode },
			async: false,
			success: function(result) {
				console.log('공지대상', result);
				var count = result.data.length;
				var ori_count = $('#ori_count').val();

				if(ori_count == count) {
					$('#chk1').prop('checked', true);
				} else {
					$('#chk2').prop('checked', true);
					for(var i = 0; i < count; i++) {
						$('#'+result.data[i].compcd+'').parent().addClass('selected');
					}//for
				}//else
			},//success
			error: function() { alert("오류"); }
		});// 공지대상 선택했던 리스트 가져오기
		
		// 첨부 파일
		$.ajax({
			url: "/attach_file.do",
			type: "post",
			data: { "noticecode" : noticecode },
			success: function(result) {
				console.log('첨부파일 리스트', result);
				var data = result.data;
				var count = data.length;
				
				let html = "";
				
				for(var i = 0; i < count; i++) {// 있던 첨부파일 불러오기
					$('.att-file').append('<a class="mr-2 attfile" data-value="'+data[i].filecode+'" href="'+data[i].url
					+'" download="'+data[i].filename+data[i].extension+'">'
					+data[i].filename+data[i].extension+' ('+(data[i].volume/1024).toFixed(2)+'KB)</a>'
					+'<i class="fa-solid fa-xmark mr-2" name="xmark"></i>');
				}// 있던 첨부파일 불러오기
				
				var fileLength = $('a.attfile').length;
				
				if(fileLength == 3) { $('.inputfile').hide(); $('.filediv').prepend('<div class="d-flex hiddendiv"></div>'); } 
				else if(fileLength == 2) { $('#plusBtn').remove(); $('#minusBtn').remove(); }
				else if(fileLength == 1) { }
			},
			error: function() { alert("오류"); }
		});//ajax(첨부파일 가져오기)
		
		//x 클릭했을 때 지우기
		$(document).on("click", "[name=xmark]", function () {
			var test = $(this).prev().attr('data-value');
			$(this).prev().remove();// 그 위의 a 태그도 지우기
			$(this).remove();//xmark 지우고
			$('.content').append('<input type="hidden" value="'+test+'" name="removefile">');
			
			var fileLength = $('a.attfile').length;
			let html = "";
			if(fileLength == 2) {
				$('.hiddendiv').remove();
				$('.inputfile').show();
				$('#plusBtn').hide();
				$('#minusBtn').hide();
			} else if(fileLength == 1) {
				$('#plusBtn').show();
				$('#minusBtn').show();
			}
		});
	}// 공지사항 수정할 때
	
	//공지사항 저장
	$('#saveBtn').click(function() {
		if($('#title').val()=='') {
			swal({title: "제목을 입력하세요.", button: "확인"})
			.then(function() {swal.close(); $('#title').focus(); return; });
		} else if($('#content').val()=='') {
			swal({title: "내용을 입력하세요.", button: "확인"})
			.then(function() {swal.close(); $('#content').focus(); return; });// 이거 왜 focus 안됨
		} else if($('[name=category] option:selected').val() == 'all') {
			swal({title: "구분을 선택하세요.", button: "확인"})
			.then(function() {swal.close(); $('[name=category]').focus(); return; });
		} else if($('#chk1').is(':checked') == false && $('#chk2').is(':checked') == false) {
			swal({title: "공지 대상을 선택하세요.", button: "확인"})
			.then(function() {swal.close(); return; });
		} else {
			if($('#chk1').is(':checked')) {
				var count = $('.comp_tbody').children('tr').length;
				
				var compcds = [];
				for(var i = 0; i < count; i++) {
					var compcd = $('.comp_tbody tr:eq('+i+')').children('td:eq(3)').text();
					compcds.push(compcd);
				}//for
				console.log(compcds);
				saveNoti(compcds);// 공지사항 저장
			} else {//if
				var count = $('.selected').length;
				
				var compcds = [];
				for(var i = 0; i < count; i++) {
					var compcd = $('.selected:eq('+i+')').children('td:eq(3)').text();
					compcds.push(compcd);
				}//for
				console.log(compcds);
				saveNoti(compcds);// 공지사항 저장
			}//else
		}//else
	});//공지사항 저장
});//ready

// 선택한거 표시하기
$('.comp_tbody').on( 'click', 'tr td', function () {
   if($(this).parent('tr').hasClass('selected')) { // 선택되어 있었으면 지우기
	   $(this).parent('tr').removeClass('selected');
   } else {// 안되어 있었으면 만들기
	   $(this).parent('tr').addClass('selected');
   }
});

// 공지사항 저장
function saveNoti(compcds) {
	var noticecode = $('#noticecode').val();//공지코드
	var chaincode = $('#chaincode').val();//체인코드
	var regcd = $('#regcd').val();//작성자
	
	var title = $('#title').val();//제목
	var content = $('#content').val();//내용
	var category = $('[name=category] option:selected').val();//구분

	swal({
		title: '저장하시겠습니까?',
		icon: "info",
		buttons: true,
		imfoMode: true,
		buttons: ["취소", "확인"]
	}).then(function(willDelete) {
		if(willDelete) {
			$.ajax({
				url: "notice_save.do",
				type: "post",
//				async: false,
				data: {
					"noticecode":noticecode,
					"chaincode":chaincode,
					"regcd":regcd,
					"title":title,
					"content":content,
					"category":category,
					"compcdArr":JSON.stringify(compcds)
				},
				success: function(result) {
					console.log(result);//noticecode
					
					var files = $('input[name=file]');
//					console.log('파일 수',files.length);
//					console.log('길이',$('a.attfile').length);
//					console.log($('.filename1').val());
					
					//파일첨부 저장
					for(var i = files.length-1; i >= 0; i--) {
						onFileUpload(files[i].files, result.data);
					}
					
//					if($('.filename1').val() == '' && $('a.attfile').length == 0) {
//						swal({
//							title: '저장되었습니다.',
//							type: 'success',
//							icon: "success",
//							button: "확인"
//						}).then(function(willDelete) {
//							location.href="/notice.do?title=전체게시판&name=공지사항"
//						});//저장완료 swal
//					} else if(($('.filename1').val() != '' && $('a.attfile').length == 0) || ($('.filename1').val() == '' && $('a.attfile').length != 0) 
//							|| ($('.filename1').val() != '' && $('a.attfile').length != 0)) {
//						//파일첨부 저장
//						for(var i = files.length-1; i >= 0; i--) {
//							onFileUpload(files[i].files, result.data);
//						}
//					}//else(파일첨부 있을 때)
				},//success
				error: function() { alert("오류"); },
			});//ajax(내용 저장)
		}//if(willDelete)
	});// swal then
}//공지사항 저장

// 파일첨부 업로드 저장
function onFileUpload(file, noticecode) {
	data = new FormData();
	data.append("file", file[0]);
	data.append("noticecode", noticecode);
	
	console.log(file[0]);
	console.log(data);
	
	if($('.filename1').val() == '' && $('a.attfile').length == 0) {
		swal({
			title: '저장되었습니다.',
			type: 'success',
			icon: "success",
			button: "확인"
		}).then(function(willDelete) {
			location.href="/notice.do?title=전체게시판&name=공지사항"
		});//저장완료 swal
	}
	
	if(file.length > 0) {
		$.ajax({
			data : data,
			type : "POST",
			url : "/file_upload.do",
			contentType : false,
			enctype : "multipart/form-data",
			processData : false,
			success : function(data) {
				console.log(data);
				if(data.responseCode == "success") {
					swal({
						title: '저장되었습니다.',
						type: 'success',
						icon: "success",
						button: "확인"
					}).then(function(willDelete) {
						location.href="/notice.do?title=전체게시판&name=공지사항"
					});//저장완료 swal
				}//if(success)
				else {
					alert("오류");
				}
			}
		});//ajax(새로 추가하는 파일)
	}
	
	var count = $('[name=removefile]').length;
	var f = {};
	var m = [];
	
	for(var i = 0; i < count; i++) {
		f = {};
		f = $('[name=removefile]').eq(i).val();// 기존에 있던 파일의 파일코드
		m.push(f);
	}
	
	if(count > 0) {
		$.ajax({
			url: "/file_check.do",
			type: "post",
			data: { 
				"m":JSON.stringify(m),
				"noticecode":noticecode
			},
			success: function(result) {
				swal({
					title: '저장되었습니다.',
					type: 'success',
					icon: "success",
					button: "확인"
				}).then(function(willDelete) {
					location.href="/notice.do?title=전체게시판&name=공지사항"
				});//저장완료 swal
			},
			error: function() { alert("오류"); }
		});//ajax(기존에 있던 것)
	}
	
}// 파일첨부 업로드 저장