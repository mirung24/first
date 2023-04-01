/* 달 선택 캘린더 */
var currentYear = (new Date()).getFullYear();
var startYear = currentYear - 1;
var options = {
	startYear: startYear,
	finalYear: currentYear,
	pattern: 'yyyy-mm',
	monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
};
$('#currnetMonth').monthpicker(options);
/*캘린더 이번달 지정 */
document.getElementById('currnetMonth').value = new Date().toISOString().slice(0, 7);

/*modal */
//$(".pop-link1").click(function () {
//	$(".modal-wrap1").css({
//		"display": "flex"
//	});
//});
//$(".pop-close1").click(function () {
//	$(".modal-wrap1").css({
//		"display": "none"
//	});
//});

/* 테두리선 */
$('.table-responsive').scroll(onScroll).trigger("scroll");

function onScroll() {
	var scTop = $(this).scrollTop();
	if (scTop > 1) {
		$('.pop-cont .table thead th').css("box-shadow", "inset 0 -1px 0 #eee");
	} else {
		$('.pop-cont .table thead th').css("box-shadow", "none");
	}
}

/* 대표 캘린더 */
var today = new Date(); //현재 날짜
var yearDate = today.getFullYear(); // 현재년도
var monthDate = today.getMonth() + 1; // 현재 월
var day_Date = today.getDate(); //현재 일
var dayDate = "01"; //현재 일
var weekDate = today.getDay(); // 현재요일
var searchVal = ""; //검색된 년월
var yearVal = ""; //검색된 년도
var monthVal = ""; //검색된 월
var weekVal = ""; //검색된 총 몇주
var dateVal = ""; //datepicker에서 선택된 년월
var arrWeek = []; //요일 정보 
var month_data = ""; //조회월

$(document).ready(function () {
	var corpnum = $("#corpnum").val();//사업자번호
	
	// 현재날짜 구하기
	var today = new Date();
	var year =  today.getFullYear();
	var month = ("0" + (today.getMonth() + 1)).slice(-2);
	var day = ("0" + today.getDate()).slice(-2);
	var date = year+month+day;//오늘날짜
	
	date_search();

	$(".mtz-monthpicker-month").eq(month - 1).addClass("ui-state-active");

	calendar_data_check = "N";
	renderCalendar(yearVal, monthVal, dayDate, "calendar", calendar_data_check);

	$(".btn_pre").click(function () {
		var last_month = parseInt(monthVal) - 1; //전월
		var last_year = parseInt(yearVal) - 1; //전년

		if (1 < last_month <= 9) {
			$(".month_data").val(yearVal + "-0" + last_month);
		}
		if (last_month > 9) {
			$(".month_data").val(yearVal + "-" + last_month);
		}
		if (last_month < 1) {
			$(".month_data").val(last_year + "-12");
		}

		calendar_data();
		daysel();//현재날짜
	});

	$(".btn_next").click(function () {
		var next_month = parseInt(monthVal) + 1; //다음월
		var next_year = parseInt(yearVal) + 1; //다음년

		if (0 < next_month <= 9) {
			$(".month_data").val(yearVal + "-0" + next_month);
		}
		if (next_month > 9) {
			$(".month_data").val(yearVal + "-" + next_month);
		}
		if (next_month > 12) {
			$(".month_data").val(next_year + "-01");
		}
		calendar_data();
		daysel();//현재날짜
	});

	$(document).on('change','#currnetMonth', function() {
		date_search();// 캘린더 날짜 변경
		calendar_data();// 캘린더 전체 변경
	});
	
	calenInfo();
	monthInfo();
	daysel();//현재날짜
	
});// ready

$(document).ajaxStart(function () {
    $('#loading').show(); // ajax 시작 -> 로딩바 표출
});

$(document).ajaxStop(function () {
    $('#loading').hide(); // ajax 끝 -> 로딩바 히든
});

//api로 받은 승인내역 temp에 넣기
function api(corpnum, date) {
	var compcd = $("#compcd").val();
	// api로 승인내역 조회
	$.ajax({
		url: "/com_api.do",
		type: "post",
		data: {
			"accessKey":"elZIM0h2RmRzd3VGdEtvcVNiSktwQT09",
			"req_busiNo":corpnum,
			"req_tranDt":date,
			"req_tranDtEnd":date,
			"req_type":"ALLTALK"
		},
		success: function(result) {
			console.log("api승인내역 조회",result);
			
//			console.log("승인내역 스트링으로 변환", JSON.stringify(result));
//			console.log(result.RET_CODE);
			
			if(result.RET_CODE == "0000") { // 정상일 때
				$.ajax({
					url: "/com_temp.do",
					type: "post",
					async: false,
					data: JSON.stringify(result),
					contentType: "application/json; charset=utf8",
					success: function(res) {
						console.log("temp테이블 넣기", res);
					},
					error: function() { console.log("temp 테이블 넣기 오류"); }
				});
			} else {
				$.ajax({
					url: "/temp_del.do",
					type: "post",
					data: { "compcd": compcd },
					async: false,
					success: function(result) {
						console.log("temp 일단 지우기```", result);
					},
					error: function() { alert("오류"); }
				});//ajax
			}//else
		},//success
		error: function() { alert("승인내역 조회 오류"); }
	});//ajax(승인내역 api)
} 

// 현재날짜 하이라이트
function daysel() {
	var today = new Date(); //현재 날짜
	var yearDate = today.getFullYear(); // 현재년도
	var monthDate = today.getMonth() + 1; // 현재 월
	var day_Date = today.getDate(); //현재 일
	
	var date = $('.td_tdday').text();
	dateArr = date.split(' ');
	year = dateArr[0].replaceAll('년','');
	month = dateArr[1].replaceAll('월','');
	
	if(year == yearDate && month == monthDate) {
		$('.day_date').filter(function() {
			return $(this).text() == day_Date;
		}).parent().addClass('selected');//현재 날짜 찾아서 하이라이트 해주깅
	}//if
}//daysel

var date_search = function () {
	dateVal = $("#currnetMonth").val();
	searchVal = dateVal.split("-");
	yearVal = searchVal[0];
	monthVal = searchVal[1];
	$(".mtz-monthpicker-month").removeClass("ui-state-active");
	$(".mtz-monthpicker-month").eq(monthVal-1).addClass("ui-state-active");
	$(".mtz-monthpicker-year").val(yearVal).prop("selected", true);
	$(".td_tdday").html(yearVal + "년 " + monthVal + "월");
}

var renderCalendar = function (sYear, sMonth, sDay, id, calendar_data_check, data) {
	$("#" + id).empty();

	var nTime = new Date(sMonth + "/" + sDay + "/" + sYear); // 지정된 달은 몇일까지 있을까요?
	var nWeek = nTime.getDay(); // 지정된 달의 첫날은 무슨요일일까요?
	var nNull = nWeek % 7; // 지정된 달 1일 앞의 공백 숫자.

	var nTotal = (new Date(sYear, sMonth, 0)).getDate(); // 지정된 달의 일수
	var nWeekTotal = (nTotal + nNull) / 7;
	nWeekTotal = Math.round(nWeekTotal); //지정된 달은 총 몇주로 라인을 그어야 하나?
	weekVal = nWeekTotal
	var arrGetDay = ""; //요일

	arrGetDay += '<table class="calendar_table TableStyle"><colgroup>';
	for (var i = 0; i < 7; i++) {
		arrGetDay += '<col width="75px">';
	}
	arrGetDay += '</colgroup><tr>';
	var arrWeek = [{
			name: "sun",
			value: "일요일"
		},
		{
			name: "mon",
			value: "월요일"
		},
		{
			name: "tue",
			value: "화요일"
		},
		{
			name: "wed",
			value: "수요일"
		},
		{
			name: "thu",
			value: "목요일"
		},
		{
			name: "fri",
			value: "금요일"
		},
		{
			name: "sat",
			value: "토요일"
		}
	]

	for (var i = 0; i < arrWeek.length; i++) {
		arrGetDay += '<th class="' + arrWeek[i].name + ' calender_thStyle">' + arrWeek[i].value + '</th>';
	}
	arrGetDay += '</tr>';

	for (var r = 0; r <= nWeekTotal; r++) {
		arrGetDay += '<tr class="sum_' + r + '">';
		for (z = 1; z <= 7; z++) {
			rv = (7 * r) + z;
			ru = rv - nNull;
			if (calendar_data_check == "N") {
				if (z != 8) {
					arrGetDay += '<td class="calender_tdStyle">';
					if (ru < 1 || ru > nTotal) {
						arrGetDay += "";
					} else {
						if (z == "1") {
							arrGetDay += '<div class="sun_date day_date" id="suminfo'+ru+'">' + ru + '</div>' +
								'<div class="sum_mb div_right"><div class="mb"><span>전체</span></div>0원 (0건)</div>' +
								'<div class="sum_pharmacy div_right"><div class="tb"><span>조제</span></div>0원 (0건)</div>' +
								'<div class="sum_approve div_right"><div class="cb"><span>일반</span></div>0원 (0건)</div>' +
								'<div class="sum_cancel div_right"><div class="rb"><span>할인</span></div> 0원</div>' +
								'<div class="sum_total div_right"><div class="ub"><span>고객</span></div> 0명</div>';
						} else if (z == "7") {
							arrGetDay += '<div class="sat_date day_date" id="suminfo'+ru+'">' + ru + '</div>' +
								'<div class="sum_mb div_right"><div class="mb"><span>전체</span></div>0원 (0건)</div>' +
								'<div class="sum_pharmacy div_right"><div class="tb"><span>조제</span></div>0원 (0건)</div>' +
								'<div class="sum_approve div_right"><div class="cb"><span>일반</span></div>0원 (0건)</div>' +
								'<div class="sum_cancel div_right"><div class="rb"><span>할인</span></div> 0원</div>' +
								'<div class="sum_total div_right"><div class="ub"><span>고객</span></div> 0명</div>';
						} else {
							arrGetDay += '<div class="day_date" id="suminfo'+ru+'">' + ru + '</div>' +
								'<div class="sum_mb div_right"><div class="mb"><span>전체</span></div>0원 (0건)</div>' +
								'<div class="sum_pharmacy div_right"><div class="tb"><span>조제</span></div>0원 (0건)</div>' +
								'<div class="sum_approve div_right"><div class="cb"><span>일반</span></div>0원 (0건)</div>' +
								'<div class="sum_cancel div_right"><div class="rb"><span>할인</span></div> 0원</div>' +
								'<div class="sum_total div_right"><div class="ub"><span>고객</span></div> 0명</div>';
						}
					}//else
				}//if
				arrGetDay += '</td>';
			} else if (calendar_data_check == "Y") {
				if (z != 8) {
					arrGetDay += '<td class="calender_tdStyle">';
					if (ru < 1 || ru > nTotal) {
						arrGetDay += "";
					} else {
						if (z == "1") {
							arrGetDay += '<div class="sun_date day_date" id="suminfo'+ru+'">' + ru + '</div>';
							arrGetDay += '<div class="sum_mb div_right"><div class="mb"><span>전체</span></div></div>' +
								'<div class="sum_pharmacy div_right"><div class="tb"><span>조제</span></div></div>' +
								'<div class="sum_approve div_right"><div class="cb"><span>일반</span></div></div>' +
								'<div class="sum_cancel div_right"><div class="rb"><span>할인</span></div></div>' +
								'<div class="sum_total div_right"><div class="ub"><span>고객</span></div></div>';

						} else if (z == "7") {
							arrGetDay += '<div class="sat_date day_date" id="suminfo'+ru+'">' + ru + '</div>';
							arrGetDay += '<div class="sum_mb div_right"><div class="mb"><span>전체</span></div></div>' +
								'<div class="sum_pharmacy div_right"><div class="tb"><span>조제</span></div></div>' +
								'<div class="sum_approve div_right"><div class="cb"><span>일반</span></div></div>' +
								'<div class="sum_cancel div_right"><div class="rb"><span>할인</span></div></div>' +
								'<div class="sum_total div_right"><div class="ub"><span>고객</span></div></div>';
						} else {
							arrGetDay += '<div class="day_date" id="suminfo'+ru+'">' + ru + '</div>';
							arrGetDay += '<div class="sum_mb div_right"><div class="mb"><span>전체</span></div></div>' +
								'<div class="sum_pharmacy div_right"><div class="tb"><span>조제</span></div></div>' +
								'<div class="sum_approve div_right"><div class="cb"><span>일반</span></div></div>' +
								'<div class="sum_cancel div_right"><div class="rb"><span>할인</span></div></div>' +
								'<div class="sum_total div_right"><div class="ub"><span>고객</span></div></div>';
						}
					}
				} else {
					arrGetDay += '<td class="calender_tdStyle sum_date">';
					if (z == "8") {
						arrGetDay += '<div class="day_date" id="suminfo'+ru+'">&nbsp;</div>' +
							'<div class="result_approve div_right sum_mb"></div>' +
							'<div class="result_pharmacy div_right sum_pharmacy"></div>' +
							'<div class="result_approve div_right sum_approve"></div>' +
							'<div class="result_cancel div_right sum_cancel"></div>' +
							'<div class="result_total div_right sum_total"></div>';
					}
				}
				arrGetDay += '</td>';
			}
		}
		arrGetDay += "</tr>";
	}
	arrGetDay += '</table>';
	$('#calendar').html(arrGetDay);
	
}

var calendar_data = function () {
	date_search();
	calendar_data_check = "N";
	renderCalendar(yearVal, monthVal, dayDate, "calendar", calendar_data_check);
	calenInfo();// 매출정보 가져와서 집어넣기
	monthInfo();// 하단 정보
	daysel();//현재날짜
}

// 매출정보 가져와서 집어넣기
function calenInfo() {
	var compcd = $('#compcd').val();//가맹점 코드
	var corpnum = $("#corpnum").val();
	
	var myval = $('#currnetMonth').val();// 현재 달력 년도와 월 가져오기
	var calen = myval.split("-");// 기준으로 자르기
	var sYear = calen[0];
	var sMonth = calen[1];
	var yearmonth = sYear+sMonth;
	console.log('년월', yearmonth);
	
	// 현재날짜 구하기
	var today = new Date();
	var year =  today.getFullYear();
	var month = ("0" + (today.getMonth() + 1)).slice(-2);
	var day = ("0" + today.getDate()).slice(-2);
	var date = year+month+day;//오늘날짜
	var ym = year+month;
	
	if(yearmonth == ym) { api(corpnum, date); }// 현재년월 이면, api 승인내역 재조회
	
	var nTotal = (new Date(sYear, sMonth, 0)).getDate(); // 지정된 달의 일수

	console.log(yearmonth);
	$.ajax({
		url: "scalendar_list.do",
		data: {
			"compcd":compcd,
			"yearmonth":yearmonth
		},
		success: function(result) {
			console.log(result);
			var data = result.data;
			var count = data.length;
			
			for(var j = 0; j < count; j++) {
				var totday = Number(result.data[j].totday);
				
				var mb = $('#suminfo'+totday+'').parent().children('div:eq(1)').html('<div class="mb"><span>전체</span></div>'+numWithCommas(data[j].total)+'원 ('+numWithCommas(data[j].totcnt)+'건)');
				var tb = $('#suminfo'+totday+'').parent().children('div:eq(2)').html('<div class="tb"><span>조제</span></div>'+numWithCommas(data[j].etcamt)+'원 ('+numWithCommas(data[j].etccnt)+'건)');
				var cd = $('#suminfo'+totday+'').parent().children('div:eq(3)').html('<div class="cb"><span>일반</span></div>'+numWithCommas(data[j].amt)+'원 ('+numWithCommas(data[j].otccnt)+'건)');
				var rb = $('#suminfo'+totday+'').parent().children('div:eq(4)').html('<div class="rb"><span>할인</span></div> '+numWithCommas(data[j].discount)+'원');
				var ub = $('#suminfo'+totday+'').parent().children('div:eq(5)').html('<div class="ub"><span>고객</span></div> '+numWithCommas(data[j].cust)+'명');
			}
		},//success
		error: function() { alert("오류"); }
	});//ajax
}//calenInfo()

// 월, 전월, 전전월 정보 조회
function monthInfo() {
	var compcd = $('#compcd').val();//가맹점 코드
	
	var myval = $('#currnetMonth').val();// 현재 달력 년도와 월 가져오기
	var calen = myval.split("-");// 기준으로 자르기
	var sYear = calen[0];
	var sMonth = calen[1];
	var yearmonth = sYear+sMonth;
	
	$.ajax({
		url: "scalendar_info.do",
		data: {
			"compcd":compcd,
			"yearmonth":yearmonth
		},
		success: function(result) {
			console.log(result);
			var data = result.data[0];
			
			// 구분
			if(Number(sMonth) == 1) {
				$('#present').html(Number(sMonth)+"월");
				$('#before1').html("12월");
				$('#before2').html("11월");
			} else if(Number(sMonth) == 2) {
				$('#present').html(Number(sMonth)+"월");
				$('#before1').html(sMonth-1+"월");
				$('#before2').html("12월");
			} else {
				$('#present').html(Number(sMonth)+"월");
				$('#before1').html(sMonth-1+"월");
				$('#before2').html(sMonth-2+"월");
			}
			
			// 조제건수
			$('#present_etccnt').html(numWithCommas(data.tetccnt)+"건");
			$('#before1_etccnt').html(numWithCommas(data.tetccnt1)+"건");
			$('#before2_etccnt').html(numWithCommas(data.tetccnt2)+"건");
			
			// 조제금액
			$('#present_etcamt').html(numWithCommas(data.tetcamt)+"원<span style='color: red;'>("+numWithCommas(data.addetc)+"원)</span>");
			$('#before1_etcamt').html(numWithCommas(data.tetcamt1)+"원<span style='color: red;'>("+numWithCommas(data.addetc1)+"원)</span>");
			$('#before2_etcamt').html(numWithCommas(data.tetcamt2)+"원<span style='color: red;'>("+numWithCommas(data.addetc2)+"원)</span>");
			
			// 판매건수
			$('#present_cnt').html(numWithCommas(data.totcnt)+"건");
			$('#before1_cnt').html(numWithCommas(data.totcnt1)+"건");
			$('#before2_cnt').html(numWithCommas(data.totcnt2)+"건");
			
			// 판매금액
			$('#present_amt').html(numWithCommas(data.totamt)+"원<span style='color: red;'>("+numWithCommas(data.addamt)+"원)</span>");
			$('#before1_amt').html(numWithCommas(data.totamt1)+"원<span style='color: red;'>("+numWithCommas(data.addamt1)+"원)</span>");
			$('#before2_amt').html(numWithCommas(data.totamt2)+"원<span style='color: red;'>("+numWithCommas(data.addamt2)+"원)</span>");
			
			// 할인금액
			$('#present_dis').html(numWithCommas(data.totdis)+"원");
			$('#before1_dis').html(numWithCommas(data.totdis1)+"원");
			$('#before2_dis').html(numWithCommas(data.totdis2)+"원");
			
			// 내방객
			$('#present_cust').html(numWithCommas(data.totcust)+"명");
			$('#before1_cust').html(numWithCommas(data.totcust1)+"명");
			$('#before2_cust').html(numWithCommas(data.totcust2)+"명");
			
		}, // success
		error: function() { alert("오류"); }
	});//ajax
}// monthInfo()

//천단위 콤마 찍기
function numWithCommas(x) {
	return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}