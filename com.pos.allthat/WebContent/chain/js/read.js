/* 파일 */
//$(document).on("change", ".file-input", function () {
//	$filename = $(this).val();
//	if ($filename == "")
//		$filename = "";
//	$(".filename").text($filename);
//})

$(document).ready(function() {
	var chaincode = $('#chaincode').val();//체인코드
	var noticecode = $('#noticecode').val();//공지코드
	console.log(noticecode);
	
	// 공지사항 상세보기 정보 가져오기
	$.ajax({
		url: "read_info.do",
		type: "post",
		data: { "noticecode":noticecode },
		success: function(result) {
			console.log(result);
			$('#title').html('['+result.category+'] '+ result.title);
			$('#readhit').html('조회 '+result.readhit);
			$('#regdt').html(result.regdt);
			$('#author').html(result.regcd);
			$('#content').html(result.content);
		},
		error: function() { alert("오류"); }
	});// ajax(공지사항 상세보기 정보 가져오기)
	
	// 가맹점 수신여부
	$.ajax({
		url: "readyn.do",
		type: "post",
		data: {
			"chaincode":chaincode,
			"noticecode":noticecode
		}, 
		success: function(result) {
			console.log('가맹점 수신여부', result);
			var data = result.data;
			
			let htmly = "";
			let htmln = "";
			var count = result.data.length;
			
			for(var i = 0; i < count; i++) {
				if(data[i].readyn == 'N') {// 미수신
					htmln += "<tr>"
					htmln +=		"<td>"+data[i].corporatenumber+"</td>"
					htmln +=		"<td>"+data[i].companyname+"</td>"
					htmln +=		"<td>"+data[i].addr+"</td>"
					htmln +=		"<td>-</td>"
					htmln += "</tr>"
				} else if(data[i].readyn == 'Y') {//수신
					htmly += "<tr>"
					htmly +=		"<td>"+data[i].corporatenumber+"</td>"
					htmly +=		"<td>"+data[i].companyname+"</td>"
					htmly +=		"<td>"+data[i].addr+"</td>"
					htmly +=		"<td>"+data[i].readdt.substr(2,14)+"</td>"
					htmly += "</tr>"
				}
			}//for
			$('.readn_tbody').html(htmln);
			$('.ready_tbody').html(htmly);
		},//success
		error: function() { alert("오류"); }
	});// ajax(가맹점 수신여부)
	
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
	
	// 수정버튼 클릭
	$(document).on('click', '#modiBtn', function() {
		console.log(noticecode);
		
		let f = document.createElement('form');
		let obj;
		obj = document.createElement('input');
		obj.setAttribute('type', 'hidden');
	    obj.setAttribute('name', 'noticecode');
	    obj.setAttribute('value', noticecode);
	    
	    f.appendChild(obj);
	    f.setAttribute('method', 'post');
	    f.setAttribute('action', 'write.do?title=전체게시판&name=공지사항');
	    document.body.appendChild(f);
	    f.submit();
	});// 수정버튼 클릭
	
	
	// 삭제버튼 클릭
	$(document).on('click', '#removeBtn', function() {
		swal({
			title: '삭제하시겠습니까?',
			icon: "info",
			buttons: true,
			imfoMode: true,
			buttons: ["취소", "확인"]
		}).then(function(willDelete) {
			if(willDelete) {
				$.ajax({
					url: "noti_remove.do",
					data: { "noticecode":noticecode },
					success: function(result) {
						swal({
							title: '삭제되었습니다.',
							type: 'success',
							icon: "success",
							button: "확인"
						}).then(function(willDelete) {
							location.href="/notice.do?title=전체게시판&name=공지사항"
						});//삭제완료 swal
					},
					error: function() { alert("오류"); }
				});//ajax(removeBtn)
			}//if
		});//then
	});// 삭제버튼 클릭
});//ready

/* 탭 */
$(".tab > .tablinks").click(function(){
	$(".tab > .tablinks").removeClass("active");
	$(this).addClass("active");
	$(".tab-wrap > .tabcontent").hide();
	$(".tab-wrap > .tabcontent").eq($(this).index()).show();
});
$(".tab > .tablinks").eq(0).trigger("click");













