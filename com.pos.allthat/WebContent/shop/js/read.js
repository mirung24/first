/* 파일 */
//$(document).on("change", ".file-input", function () {
//	$filename = $(this).val();
//	if ($filename == "")
//		$filename = "";
//	$(".filename").text($filename);
//})

$(document).ready(function() {
	var compcd = $('#compcd').val();//가맹점 코드
	var noticecode = $('#noticecode').val();//공지코드
	console.log(compcd);
	
	// 조회수 업데이트/ 읽음 표시
	$.ajax({
		url: "readhit.do",
		data: {
			"compcd":compcd,
			"noticecode":noticecode
		}, 
		async: false,
		success: function(result) {
			console.log(result);
			$('#readhit').html('조회 '+result);
		},
		error: function() { alert("오류"); }
	});// ajax(조회수 업데이트/ 읽음 표시)
	
	// 공지사항 상세보기 정보 가져오기
	$.ajax({
		url: "read_info.do", //체인점 컨트롤러에 있는거 같이 사용
		type: "post",
		data: { "noticecode":noticecode },
		async: false,
		success: function(result) {
			console.log(result);
			$('#title').html('['+result.category+'] '+ result.title);
			$('#regdt').html(result.regdt);
			$('#author').html(result.regcd);
			$('#content').html(result.content);
		},
		error: function() { alert("오류"); }
	});// ajax(공지사항 상세보기 정보 가져오기)
	
	// 첨부 파일
	$.ajax({
		url: "/attach_file.do",
		type: "post",
		data: { "noticecode" : noticecode },
		success: function(result) {
			console.log('첨부파일 리스트', result);
			var data = result.data;
			var count = data.length;
			
			for(var i = 0 ; i < count; i++) {
				if(count == 1) {// 1개일 때 슬래시 없이 보여주기
					$('#file_down').append('<a class="mr-2" href="'+data[i].url
					+'" download="'+data[i].filename+data[i].extension+'">'
					+data[i].filename+data[i].extension+' ('+(data[i].volume/1024).toFixed(2)+'KB)</a>');
				} else {
					$('#file_down').append('<a class="mr-2" href="'+data[i].url
					+'" download="'+data[i].filename+data[i].extension+'">'
					+data[i].filename+data[i].extension+' ('+(data[i].volume/1024).toFixed(2)
					+'KB)</a><span class="slash">/</span> ');
				}// 1개 이상일 때 중간에 슬래시 붙이기
			}//for
			$('.slash:last-child').remove();// 마지막 슬래시 없애기
		},
		error: function() { alert("오류"); }
	});//ajax(첨부파일 가져오기)
});//ready

$(document).ajaxStart(function () {
    $('#loading').show(); // ajax 시작 -> 로딩바 표출
});

$(document).ajaxStop(function () {
    $('#loading').hide(); // ajax 끝 -> 로딩바 히든
});