$(window).resize(onResize).trigger("resize");

/* 테두리선 */
$('.table-responsive').scroll(onScroll).trigger("scroll");

function onScroll() {
	var scTop = $(this).scrollTop();
	if (scTop > 1) {
		$('.box .table thead th').css("box-shadow", "inset 0 -1px 0 #eee");
	} else {
		$('.box .table thead th').css("box-shadow", "none");
	}
}

$(document).ready(function() {
	onResize();
	
	var compcd = $('#compcd').val();
	var chaincode = $('#chaincode').val();
	
	// 30일 전 날짜 넣기
	var today = new Date();
	var d30 = new Date(today.setDate(today.getDate() - 30));
	var year =  d30.getFullYear();
	var month = ("0" + (d30.getMonth() + 1)).slice(-2);
	var day = ("0" + d30.getDate()).slice(-2);
	$('.d-30').val(year + '-' + month + "-" + day);
	
	var today2 = new Date();
	var pre_year = today2.getFullYear();
	var pre_month = today2.getMonth() + 1
	var pre_day = today2.getDate();
	
	$('.pre_year1').append('매출총액 ('+pre_year+'년)');
	$('.pre_year2').append('매출횟수 ('+pre_year+'년)');
	
	$('.d-30').pignoseCalendar({
		format: 'YYYY-MM-DD', 
		lang: 'ko',
		week: 0,
		theme: 'blue',
		modal: true,
		select: function(date, context){}
	});// d-30 날짜
	
	// 해당 가맹점 정보 조회
	$.ajax({
		url: "sfran_info.do",
		data: {
			"compcd":compcd,
			"chaincode":chaincode
		},
		success: function(result) {
			console.log(result);
			
			if(result.opendate == null) {
//				var open = pre_year + '-' + pre_month + "-" + pre_day;
				var open = '';
			} else {
				var opendate = result.opendate;
				var open = opendate.substr(0, 10);
			}
			
			if(result.registerdate == null) {
				var regi = '';
			} else {
				var registerdate = result.registerdate;
				var regi = registerdate.substr(0, 10);
			}
			
			if(result.canceldate == null) {
				var can = '';
			} else {
				var canceldate = result.canceldate;
				var can = canceldate.substr(0, 10);
			}
			
			$('#pop_copnum').val(result.corporatenumber);
			$('#pop_name').val(result.companyname);
			$('#pop_pres').val(result.president);
			$('#pop_pcnt').val(result.presidentcnt);
			$('#pop_addr').val(result.address);
			$('#pop_addr2').val(result.address2);
			$('#pop_tel').val(result.tel);
			$('#pop_hp').val(result.hp);
			$('#pop_fax').val(result.fax);
			$('#pop_email').val(result.email);
			$('[name=pop_date1]').val(open);
			$('[name=pop_date2]').val(regi);
			$('[name=pop_date3]').val(can);
			$('#pop_taxem').val(result.taxuseremail);
			$('[name=pop_memo]').val(result.remarks);
		},//success
		error: function() { alert("오류"); }
	});//ajax(가맹점 정보 조회)
	
	// 판매집계 조회
	$.ajax({
		url: "sfran_tally.do",
		type: "post",
		data: { "compcd":compcd },
		success: function(result) {
			console.log(result);
			const count = result.length;
			if(count == 0) {
				$('#salestot').val('0원');
				$('#salescnt').val('0건');
				$('#avgtot').val('0원');
				$('#avgcnt').val('0건');
			} else {
				$('#salestot').val(numWithCommas(result.total)+'원');
				$('#salescnt').val(numWithCommas(result.cnt)+'건');
				$('#avgtot').val(numWithCommas(result.avgtot)+'원');
				$('#avgcnt').val(numCommasdeci(result.avgcnt)+'건');
			}
		},
		error:function(jqXHR, textStatus, errorThrown) {
			alert("오류");
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}// error
	});//ajax(판매집계 조회)
	
	// 사용자 추가 리스트 조회
	userAddList(compcd);
	//판매이력 조회
	sfran_hist(compcd, chaincode);
});//ready

$(document).ajaxStart(function () {
    $('#loading').show(); // ajax 시작 -> 로딩바 표출
});

$(document).ajaxStop(function () {
    $('#loading').hide(); // ajax 끝 -> 로딩바 히든
});

//사용자 추가 리스트
function userAddList(compcd) {
	$.ajax({
		url: "sfran_ua.do",
		type: "post",
		data: { "compcd":compcd },
		success: function(result) {
			console.log('사용자 추가 리스트', result);
			
			let html = "";
			const count = result.data.length;
			
			if(count > 0) {
				for(var i = 0; i < count; i++) {
					var joindate = result.data[i].jo;
					var resigndate = result.data[i].resign;
					
					
					if(joindate == 'undefined' || joindate == null) join = '';
					else var join = joindate;
					
					if(resigndate == 'undefined' || resigndate == null) resign = '';
					else var resign = resigndate;
					
					html += "<tr>"
					html += 	"<td><input type='text' class='form-control' name='ua_name' id='ua_name" + i + "' value='" + result.data[i].name + "'></td>"
					html += 	"<td><input type='text' class='form-control' name='ua_userid' id='ua_userid" + i + "' value='" + result.data[i].userid + "' readonly='true'></td>"
					html += 	"<td><input type='password' class='form-control' name='ua_passwd' id='ua_passwd" + i + "' value='" + result.data[i].passwd + "'></td>"
					html += 	"<td><input type='text' class='form-control' name='ua_hp' id='ua_hp" + i + "' value='" + result.data[i].hp + "' maxlength='13' autoTelHyphen></td>"
					html += 	"<td><input type='text' class='form-control' name='ua_licence' id='ua_licence" + i + "' value='" + result.data[i].licence + "'></td>"
					html +=		"<td><input type='text' value='" + join + "' name='ua_date1' id='ua_date1-" + i + "'"
					html +=			"class='form-control date1 calendar calendar-img'></td>"
					html +=		"<td><input type='text' id='ua_date2-" + i + "' name='ua_date2'"
					html +=			"class='date2 calendar calendar-img' value='" + resign + "'></td>"
					html +=		"<td><select class='form-control' name='ua_level' id='ua_level" + i + "'>"
					html +=			"</select></td>"
					html +=		"</td>"
					html += "</tr>"	
				}//for
				$.ajax({
					url: "com_ua.do",
					type: "post",
					dataType: "json",
					data: { "upcode":"CO1047" },
					success: function(res) {
						console.log('select 부분 ajax',res);
						console.log('addList 부분 ajax',result);
						for(var i = 0; i < count; i++){
							util.MakeSelOptions($('#ua_level'+i+''), res.data, result.data[i].level, '');
						}
					},//success
					error:function(jqXHR, textStatus, errorThrown) {
						alert("오류");
						console.log(jqXHR);
						console.log(textStatus);
						console.log(errorThrown);
					}// error
				});//ajax
			}//if(count>0)
			$(".ua_tbody").html(html);
			pignoseCalendar1();
			$("input:text[autoTelHyphen]").on("keyup", function() {
				$(this).val($(this).val().replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`));
			});
		}, 
		error:function(jqXHR, textStatus, errorThrown) {
			alert("오류");
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}// error
	});//ajax
}//사용자 추가 리스트(userAddList)

// 사용자 추가 행 추가하기
function makeLowList(i) {
	let html = "";
	
	html += "<tr>"
	html += 	"<td><input type='text' class='form-control' name='ua_name' id='ua_name" + i + "' value=''></td>"
	html += 	"<td><input type='text' class='form-control' name='ua_userid' id='ua_userid" + i + "' value=''></td>"
	html += 	"<td><input type='password' class='form-control' name='ua_passwd' id='ua_passwd" + i + "' value=''></td>"
	html += 	"<td><input type='text' class='form-control' name='ua_hp' id='ua_hp" + i + "' value='' maxlength='13' autoTelHyphen></td>"
	html += 	"<td><input type='text' class='form-control' name='ua_licence' id='ua_licence" + i + "' value=''></td>"
	html +=		"<td><input type='text' value='' id='ua_date1-" + i + "' name='ua_date1'"
	html +=			"class='calendar calendar-img date1'></td>"
	html +=		"<td><input type='text' id='ua_date2-" + i + "' name='ua_date2'"
	html +=			"class='calendar calendar-img date2' value=''></td>"
	html +=		"<td><select class='form-control' name='ua_level' id='ua_level" + i + "'>"
	html +=			"</select></td>"
	html +=		"</td>"
	html += "</tr>"
		
	$.ajax({
		url: "com_ua.do",
		type: "post",
		dataType: "json",
		data: { "upcode":"CO1047" },
		success: function(res) {
			console.log('select 부분 ajax',res);
			util.MakeSelOptions($('#ua_level'+i+''), res.data, res.data[0], '');
		},//success
		error:function() { alert("오류"); }// error
	});//ajax
	
	$('.ua_tbody').prepend(html);
	pignoseCalendar1();
	$("input:text[autoTelHyphen]").on("keyup", function() {
		$(this).val($(this).val().replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`));
	});
}// 사용자 추가 행 추가하기(makeLowList)

//popup 사용자 추가 행 추가하기
$(document).on("click","#ua_btn", function(){
	var i = $('.ua_tbody tr').length;
	var compcd = $('#compcd').val();
	
	$.ajax({
		url: "sfran_ua.do",
		type: "post",
		data: { "compcd":compcd },
		success: function(result) {
			var ori_i = result.data.length;
			var ni = i-1;
			
			if(i == ori_i) {
				makeLowList(i);
				$('#ua_name'+i+'').focus();
				return;
			} if(i >= ori_i+1) { // 추가를 다시 눌러도 다시 추가 되지 않도록 하기
				var ni = i-1;
				$('#ua_name'+ni+'').focus();
				return;
			}
		}
	});
}); //popup 사용자 추가 행 추가하기

//popup 상세정보 저장하기 버튼
$('#popsv_btn').on('click', function() {
	var i = $('.ua_tbody tr').length;
	var compcd = $('#compcd').val();
	
	if($('#pop_name').val() == '') {
		swal({title: "가맹점명을 입력하세요.", button: "확인"})
		.then(function() {swal.close(); $('#pop_name').focus(); return; });
	} else if($('#pop_pres').val() == '') {
		swal({title: "대표자를 입력하세요.", button: "확인"})
		.then(function() {swal.close(); $('#pop_pres').focus(); return; });
	} else if($('#pop_addr').val() == '') {
		swal({title: "주소를 입력하세요.", button: "확인"})
		.then(function() {swal.close(); $('#pop_addr').focus(); return; });
	} else if($('#pop_addr2').val() == '') {
		swal({title: "상세주소를 입력하세요.", button: "확인"})
		.then(function() {swal.close(); $('#pop_addr2').focus(); return; });
	} else if($('#pop_tel').val() == '') {
		swal({title: "전화번호를 입력하세요.", button: "확인"})
		.then(function() {swal.close(); $('#pop_tel').focus(); return; });
	} else if($('#pop_date2').val() == '') {
		swal({title: "가맹일을 입력하세요.", button: "확인"})
		.then(function() {swal.close(); $('#pop_date2').focus(); return; });
	} 
//	else if($('#pop_date3').val() == '') {
//		swal({title: "해지일을 입력하세요.", button: "확인"})
//		.then(function() {swal.close(); $('#pop_dat3').focus(); return; });
//	} 
	else {
		$.ajax({
			url: "sfran_ua.do",
			type: "post",
			data: { "compcd":compcd },
			success: function(result) {
				var ori_i = result.data.length;
				var ni = i-1;
				console.log('ori_i : ', ori_i, ', i : ', i, ', ni : ', ni);
				
				var checkid = $('#ua_userid'+ori_i+'').val();
				console.log("checkid", checkid);
				$.ajax({
					url: "ua_idcheck.do",
					data: {
						"compcd":compcd,
						"ua_userid":checkid
					},
					success: function(result) {
						console.log("아이디 중복체크", result);
						if(result.data == 1) {
							swal({title: "중복된 아이디가 존재합니다.", button: "확인"})
							.then(function() {swal.close(); $('#ua_userid'+ori_i+'').focus(); return; });
						} else {
							console.log("ajax 안에서도 밖의 값 가져올 수 있는지 확인 " );
							console.log('ori_i : ', ori_i, ', i : ', i, ', ni : ', ni);
							ssave(i, ori_i, ni);
						}
					},
					error: function() { alert("오류"); }
				});//ajax
			},//success
			error: function() { alert("오류"); }
		});//ajax
	}//else
});// popup 상세정보 저장하기 버튼

function ssave(i, ori_i, ni) {
	if(i >= ori_i+1) {
		if($('#ua_name'+ni+'').val()=='') {
			swal({title: "사용자 이름을 입력하세요.", button: "확인"})
			.then(function() {swal.close(); $('#ua_name'+ni+'').focus(); return; });
		} else if($('#ua_userid'+ni+'').val()=='') {
			swal({title: "사용자 아이디를 입력하세요.", button: "확인"})
			.then(function() {swal.close(); $('#ua_userid'+ni+'').focus(); return; });
		} else if($('#ua_passwd'+ni+'').val()=='') {
			swal({title: "사용자 비밀번호를 입력하세요.", button: "확인"})
			.then(function() {swal.close(); $('#ua_passwd'+ni+'').focus(); return; });
		}
		else {
			var detail_com = $('form[name=detail_f]').serialize();
			swal({
				title: '저장하시겠습니까?',
				icon: "info",
				buttons: true,
				imfoMode: true,
				buttons: ["취소", "확인"]
			}).then(function(willDelete) {
				if(willDelete) {
					$.ajax({
						url: "shop_detail_sv.do",
						type: "post",
						dataType: "json",
						data: detail_com,
						success: function(result) {
							console.log('상세보기 저장', result);
							$(".modal-wrap1").css({"display": "none"});
							swal({
								title: '저장되었습니다.',
								type: 'success',
								icon: "success",
								button: "확인"
							}).then(function(willDelete) {
								location.href="sfranchise.do?title=거래처관리&name=가맹점정보";
							});
						}//success
					});//저장 ajax
				}//if(willDelete)
			});//swal then
		}//else
	} // 추가한 행이 비어있을 경우 유효성 검사 후 저장
	else if(i == 0) {
		swal({title: "사용자를 추가해주세요.", button: "확인"})
		.then(function() {swal.close(); $('#ua_btn').focus(); return; });
	}
	else if(i == ori_i) {
		var detail_com = $('form[name=detail_f]').serialize();
		swal({
			title: '저장하시겠습니까?',
			icon: "info",
			buttons: true,
			imfoMode: true,
			buttons: ["취소", "확인"]
		}).then(function(willDelete) {
			if(willDelete) {
				$.ajax({
					url: "shop_detail_sv.do",
					type: "post",
					dataType: "json",
					data: detail_com,
					success: function(result) {
						console.log('상세보기 저장', result);
						$(".modal-wrap1").css({"display": "none"});
						swal({
							title: '저장되었습니다.',
							type: 'success',
							icon: "success",
							button: "확인"
						}).then(function(willDelete) {
							location.href="sfranchise.do?title=거래처관리&name=가맹점정보";
						});
					}//success
				});//저장 ajax
			}//if(willDelete)
		});//swal then
	}//else if
}//ssave

//판매이력 조회
function sfran_hist(compcd, chaincode) {
	var popSearch1 = $('[name=popSearch1]').val();
	var popSearch2 = $('[name=popSearch2]').val();
	var sd1 = popSearch1.replace(/-/g,"");
	var sd2 = popSearch2.replace(/-/g,"");
	
	$.ajax({
		url: "sfran_hist.do",
		type: "post",
		data: {
			"chaincode":chaincode,
			"compcd":compcd,
			"popSearch1":sd1,
			"popSearch2":sd2
		},
		success: function(result) {
			console.log(result);
			
			let html = "";
			const count = result.data.length;
			
			if(count > 0) {
				for(var i = 0; i < count; i++) {
					var salesdt = changeDateString(result.data[i].salesdt); // 판매일자
					var tot = result.data[i].tot; // 판매금액

					if(i == count-1) {
						roc2 = '';
					} else {
						var roc1 = ((result.data[i].tot - result.data[i+1].tot)/result.data[i+1].tot)*100 // 증감률
						var roc2 = roc1.toFixed(1);
						var parts = String(roc2).split("."); 
						if(parts[1] == 0) {
							roc2 = parts[0];
						}
					}
					
					if(roc2 > 0) {
						html += "<tr>"
						html += 	"<td>" + salesdt + "</td>"
						html += 	"<td id='saleprice" + i + "'>" + numWithCommas(result.data[i].tot) + "원</td>"
						if(roc2 == 'Infinity') {
							html += 	"<td style='text-align: right;'>" + numWithCommas(result.data[i].tot) + "%<i class='fa-solid fa-up-long ml-1'></i></td>"
						} else {
							html += 	"<td style='text-align: right;'>" + numWithCommas(Math.abs(roc2)) + "%<i class='fa-solid fa-up-long ml-1'></i></td>"
						}
						html += 	"<td>" + result.data[i].cnt + "건</td>"
						html += "</tr>"
					} else if(roc2 < 0) {
						html += "<tr>"
						html += 	"<td>" + salesdt + "</td>"
						html += 	"<td id='saleprice" + i + "'>" + numWithCommas(result.data[i].tot) + "원</td>"
						html += 	"<td style='text-align: right;'>" + Math.abs(roc2) + "%<i class='fa-solid fa-down-long ml-1'></i></td>"
						html += 	"<td>" + result.data[i].cnt + "건</td>"
						html += "</tr>"
					}
				}
			}
			$(".sh_tbody").html(html);
		},
		error:function(jqXHR, textStatus, errorThrown) {
			alert("오류");
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}// error
	});//ajax(가맹점 판매이력 조회)
}//function() sfran_hist

//pop판매이력 검색 버튼
$('#pophistbtn').click(function() {
	var compcd = $('#compcd').val();
	var chaincode = $('#chaincode').val();
	sfran_hist(compcd, chaincode);
});

//주소창 띄우기 (다음 api)
function Address() {
	new daum.Postcode({
        oncomplete: function(data) {
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var addr = ''; // 주소 변수
            var extraAddr = ''; // 참고항목 변수

            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress;
            }

            // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
            if(data.userSelectedType === 'R'){
                // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                    extraAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가한다.
                if(data.buildingName !== '' && data.apartment === 'Y'){
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if(extraAddr !== ''){
                    extraAddr = ' (' + extraAddr + ')';
                }
            
            } else {
//                document.getElementById("sample6_extraAddress").value = '';
            }

            $('.address').val(addr);
            $('.address2').focus();
        }
    }).open();
}//주소창 띄우기 (다음 api)

$('.address').focus(function() {
	Address();
	$('.address').blur();
});
// 숫자만 입력했는지 확인
$("input:text[numberOnly]").on("keyup", function() {
    $(this).val($(this).val().replace(/[^0-9]/g,""));
 });
// 전화번호, 휴대폰번호, 팩스번호 자동으로 하이픈 넣기
$("input:text[autoTelHyphen]").on("keyup", function() {
	$(this).val($(this).val().replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`));
});
// 사업자번호 자동으로 하이픈 넣기
$("input:text[autoCorpHyphen]").on("keyup", function() {
	$(this).val($(this).val().replace(/[^0-9]/g, '').replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3'));
});

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
//날짜 구분자 넣기
function changeDateString(date) {
	var year = date.substr(0,4);
	var month = date.substr(4,2);
	var day = date.substr(6,2);
	return year + "-" + month + "-" + day;
}

function onResize() {
	const tot = $(".tot").innerWidth();
	$(".t1").css("width", tot + "px");
}