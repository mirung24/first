$(document).ready(function() {
	var corpnum = $("#corpnum").val();//사업자번호
	
	var now = new Date(); //현재날짜
	var year = now.getFullYear();
	var month = now.getMonth();//현재월 (0부터시작 11끝)
	var day = ("0" + now.getDate()).slice(-2);
	var startM = Number(month)+1;//분기계산할 때 사용 월
	var date = year+month+day;
	
	api(corpnum, date);//api 승인내역 업데이트
	
	$('[name=year]').html('<option value="'+year+'" selected>'+year+'</option>'
			+ '<option value="'+(year-1)+'">'+(year-1)+'</option>'
			+ '<option value="'+(year-2)+'">'+(year-2)+'</option>');
	$('[name=year2]').html('<option value="'+year+'" selected>'+year+'</option>'
			+ '<option value="'+(year-1)+'">'+(year-1)+'</option>'
			+ '<option value="'+(year-2)+'">'+(year-2)+'</option>');
	
	// 해당월의 분기로 처음에 시작하기
	if(startM == 1|| startM == 2 || startM == 3) {//1분기
		$(".tab-wrap > .tabcontent").eq(0).find($(".tab2 .tablinks2")).removeClass("active");
		$('#quarter1').addClass("active"); daystat("01","03"); 
		$(".tab-wrap > .tabcontent").eq(1).find($(".tab2 .tablinks2")).removeClass("active");
		$('#quarter5').addClass("active"); timestat("01", "03");
	} else if(startM == 4 || startM == 5 || startM == 6){//2분기
		$(".tab-wrap > .tabcontent").eq(0).find($(".tab2 .tablinks2")).removeClass("active");
		$('#quarter2').addClass("active"); daystat("04","06");
		$(".tab-wrap > .tabcontent").eq(1).find($(".tab2 .tablinks2")).removeClass("active");
		$('#quarter6').addClass("active"); timestat("04","06");
	} else if(startM == 7 || startM == 8 || startM == 9){//3분기
		$(".tab-wrap > .tabcontent").eq(0).find($(".tab2 .tablinks2")).removeClass("active");
		$('#quarter3').addClass("active"); daystat("07", "09");
		$(".tab-wrap > .tabcontent").eq(1).find($(".tab2 .tablinks2")).removeClass("active");
		$('#quarter7').addClass("active"); timestat("07", "09");
	} else if(startM == 10 || startM == 11 || startM == 12){//4분기
		$(".tab-wrap > .tabcontent").eq(0).find($(".tab2 .tablinks2")).removeClass("active");
		$('#quarter4').addClass("active"); daystat("10", "12");
		$(".tab-wrap > .tabcontent").eq(1).find($(".tab2 .tablinks2")).removeClass("active");
		$('#quarter8').addClass("active"); timestat("10", "12");
	}
	$('[name=quarter]').eq(0).trigger("click");
//	console.log('클릭', $('[name=quarter]').eq(0).val());
	
	// 분기 버튼 클릭하면 해당분기 통계내역으로 이동
	$('[name=quarter]').click(function() {
		var quarter = $(this).val().split(",");
		var m1 = quarter[0];// 분기 시작 월
		var m2 = quarter[1];// 분기 막월
		
		$('#graph1').remove();//겹치는 경우 생겨서 그래프 지웠다가
		$('.graph .gr1').html('<canvas id="graph1"></canvas>');//다시 생성
		daystat(m1, m2);// 분기별 요일 통계
	});// 분기 선택(요일)
	
	// 분기 버튼 클릭하면 해당분기 통계내역으로 이동
	$('[name=quarter2]').click(function() {
		var quarter = $(this).val().split(",");
		var m1 = quarter[0];// 분기 시작 월
		var m2 = quarter[1];// 분기 막월
		
		$('#graph3').remove();//겹치는 경우 생겨서 그래프 지웠다가
		$('.graph .gr2').html('<canvas id="graph3"></canvas>');//다시 생성
		timestat(m1, m2);// 분기별 요일 통계
	});// 분기 선택(시간)
	
	// 년도 변경해도 다시 불러오기
	$('[name=year]').change(function() {
		$('#graph1').remove();//지웠다가
		$('.graph .gr1').html('<canvas id="graph1"></canvas>');//다시 생성
		$(".tab-wrap > .tabcontent").eq(0).find($(".tab2 .tablinks2")).removeClass("active");
		$('#quarter1').addClass("active"); daystat("01", "03");
	});// 년도 변경해도 다시 불러오기(요일)
	
	// 년도 변경해도 다시 불러오기
	$('[name=year2]').change(function() {
		$('#graph3').remove();//지웠다가
		$('.graph .gr2').html('<canvas id="graph3"></canvas>');//다시 생성
		$(".tab-wrap > .tabcontent").eq(1).find($(".tab2 .tablinks2")).removeClass("active");
		$('#quarter5').addClass("active"); timestat("01", "03");
	});// 년도 변경해도 다시 불러오기(요일)
});//ready

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
		async: false,
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

// 분기별 요일 통계
function daystat(m1, m2) {
	var compcd = $('#compcd').val(); //가맹점 코드
	var year = $('[name=year] option:selected').val();
	var corpnum = $("#corpnum").val();//사업자번호
	console.log(year);
	
	// 현재날짜 구하기
	var today1 = new Date();
	var year1 =  today1.getFullYear();
	var month1 = ("0" + (today1.getMonth() + 1)).slice(-2);
	var day1 = ("0" + today1.getDate()).slice(-2);
	var date1 = year1+month1+day1;//오늘날짜
	
	var ym = year+m1;
	if(year == year1){
		if(Number(m1) <= Number(month1) && Number(month1) <= Number(m2)) { api(corpnum, date1); }
	}
//	console.log(Number(m1) <= Number(month1) && Number(month1) <= Number(m2));
//	console.log('m1 ',Number(m1));
//	console.log('month1 ', Number(month1));
//	console.log('m2 ', Number(m2));
	
	$.ajax({
		url: "sdaystat.do",
		data: {
			"y":year,
			"m1":m1,
			"m2":m2,
			"compcd":compcd
		},
		async: false,
		success: function(result) {
			console.log(result);
			var data = result.data;
			var count = data.length;
			var totamt = 0;//매출금액 주누계
			var totcnt = 0;//매출건수 주누계
			var h = 0;//내방객수 주누계
			var m = 0;//남자 내방객 주누계
			var f = 0;//여자 내방객 주누계
			
			for(var j= 1; j < 8; j++) {//값 초기화 작업
				$('#totamt').children().eq(j).html("0원");
				$('#totcnt').children().eq(j).html("0건");
				$('#cust').children().eq(j).html("0명 <p>남 0명 | 여 0명");
				$('#top').children().eq(j).html("-");
				$('#best').children().eq(j).html("-");
			}//for(j)
			for(var i = 0; i < count; i++) {
				$('#totamt').children().eq(data[i].we).html(numWithCommas(data[i].totamt)+"원");//판매금액
				$('#totcnt').children().eq(data[i].we).html(numWithCommas(data[i].totcnt)+"건");//판매건수
				$('#cust').children().eq(data[i].we).html(numWithCommas(data[i].h)+"명 <p>남 "+numWithCommas(data[i].m)+"명 | 여 "+numWithCommas(data[i].f)+"명");//내방객
				$('#top').children().eq(data[i].we).html(data[i].pname);//매출top
				
				var best = String(data[i].best);//substr 오류나서 문자로 바꾸고 사용해주기
				if(best.substr(2,3) == 'F') {//f일때 여성으로 표시
					$('#best').children().eq(data[i].we).html(best.substr(0,2)+"대 여성");
				} else if(best.substr(2,3) == 'M') {//m일때 여성으로 표시
					$('#best').children().eq(data[i].we).html(best.substr(0,2)+"대 남성");
				}
				
				totamt += data[i].totamt;
				totcnt += data[i].totcnt;
				h += data[i].h;
				m += data[i].m;
				f += data[i].f;
			}//for(i)
			
			// 주누계 표시
			$('#totamt').children().eq(8).html(numWithCommas(totamt)+"원");//판매금액
			$('#totcnt').children().eq(8).html(numWithCommas(totcnt)+"건");//판매건수
			$('#cust').children().eq(8).html(numWithCommas(h)+"명 <p>남 "+numWithCommas(m)+"명 | 여 "+numWithCommas(f)+"명");//내방객
			
			/* 그래프1 */
			var ChartHelper = {
				chartColors: {
					ye: '#ffb703',
					blue: '#2c7be5',
					red: '#e63946'
				}
			};

			var color = Chart.helpers.color;
			var ctx = document.getElementById('graph1').getContext('2d');
			
			var totamt = ["0", "0", "0", "0", "0", "0", "0"];// data1 매출금액
			var totcnt = ["0", "0", "0", "0", "0", "0", "0"];// data2 매출건수
			var cust = ["0", "0", "0", "0", "0", "0", "0"];// data3 내방객수
			
			for1: for(var i = 1 ; i < 8 ; i++) {
				for2: for(var j = 0 ; j < count ; j++) {
					if(data[j].we == i){
						var d = String(Number(data[j].totamt)/10000);
						totamt[data[j].we-1] = d;
								
						var d2 = String(data[j].totcnt);
						totcnt[data[j].we-1] = d2;
								
						var d3 = String(data[j].h);
						cust[data[j].we-1] = d3;
					}//if
				}//for2
			}//for1
			
			data1 = totamt;//매출금액
			data2 = totcnt;//매출건수
			data3 = cust;//내방객수

			chartData1 = {
				labels: ['일', '월', '화', '수', '목', '금', '토'],
				datasets: [{
					label: ['매출금액'],
					backgroundColor: color(ChartHelper.chartColors.ye).alpha(0.7).rgbString(),
					borderColor: ChartHelper.chartColors.ye,
					/* 	borderWidth: 1, */
					data: data1,
				}, {
					label: ['매출건수'],
					backgroundColor: color(ChartHelper.chartColors.blue).alpha(0.7).rgbString(),
					borderColor: ChartHelper.chartColors.blue,
					/* borderWidth: 1, */
					data: data2,
				}, {
					label: ['내방객수'],
					backgroundColor: color(ChartHelper.chartColors.red).alpha(0.7).rgbString(),
					borderColor: ChartHelper.chartColors.red,
					/* borderWidth: 1, */
					data: data3,
				}]
			};//chartData1

			window.BarChart = new Chart(ctx, {
				type: 'bar',
				data: chartData1,
				options: {
					responsive: true, //auto size : true
					maintainAspectRatio: false,
					legend: {
						display: true, // 안보이게 하려면 false
						position: 'bottom'
					},
					scales: {
						xAxes: [{
							categoryPercentage: 0.4,
							barPercentage: 0.4,
							ticks: {
								fontColor: "#98a4b6",
								fontSize: 12
							},
							gridLines: {
								display: false,
								color: "#fff"
							}
						}],//xAxes
						yAxes: [{
							ticks: {
								fontColor: "#98a4b6",
								fontSize: 12,
								beginAtZero: true,
								callback: function (value) {
									if (0 === value % 1) {
										return value;
									}
								}
							}
						}]//yAxes
					}//scales
				}//options
			});//window.BarChart
		},//success
		error: function() { alert("오류"); }
	});//ajax(sdaystat)
}// 분기별 요일 통계(daystat)

//분기별 시간대 통계
function timestat(m1, m2) {
	var compcd = $('#compcd').val(); //가맹점 코드
	var year = $('[name=year2] option:selected').val();
	console.log(year);
	
	$.ajax({
		url: "stimestat.do",
		data: {
			"y":year,
			"m1":m1,
			"m2":m2,
			"compcd":compcd
		},
		async: false,
		success: function(result) {
			console.log(result);
			var data = result.data;
			var count = data.length;
			var totamt = 0;//매출금액 주누계
			var totcnt = 0;//매출건수 주누계
			var h = 0;//내방객수 주누계
			var m = 0;//남자 내방객 주누계
			var f = 0;//여자 내방객 주누계
			
			for(var j= 1; j < 15; j++) {//값 초기화 작업
				$('#totamt2').children().eq(j).html("0원");
				$('#totcnt2').children().eq(j).html("0건");
				$('#cust2').children().eq(j).html("0명 <p>남 0명 | 여 0명");
				$('#top2').children().eq(j).html("-");
				$('#best2').children().eq(j).html("-");
			}//for(j)
			for(var i = 0; i < count; i++) {
				$('#totamt2 .'+data[i].ti+'').html(numWithCommas(data[i].totamt)+"원");//판매금액
				$('#totcnt2 .'+data[i].ti+'').html(numWithCommas(data[i].totcnt)+"건");//판매건수
				$('#cust2 .'+data[i].ti+'').html(numWithCommas(data[i].h)+"명 <p>남 "+numWithCommas(data[i].m)+"명 | 여 "+numWithCommas(data[i].f)+"명");//내방객
				$('#top2 .'+data[i].ti+'').html(data[i].pname);//매출top
				
				var best = String(data[i].best);//substr 오류나서 문자로 바꾸고 사용해주기
				if(best.substr(2,3) == 'F') {//f일때 여성으로 표시
					$('#best2 .'+data[i].ti+'').html(best.substr(0,2)+"대 여성");
				} else if(best.substr(2,3) == 'M') {//m일때 여성으로 표시
					$('#best2 .'+data[i].ti+'').html(best.substr(0,2)+"대 남성");
				}
			}//for(i)
			

			/* 그래프3 */
			var ChartHelper = {
				chartColors: {
					ye: '#ffb703',
					blue: '#2c7be5',
					red: '#e63946'
				}
			};

			var color = Chart.helpers.color;
			var ctx = document.getElementById('graph3').getContext('2d');
			
			var totamt = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];// data1 매출금액
			var totcnt = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];// data2 매출건수
			var cust = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];// data3 내방객수
			
			for1: for(var i = 8 ; i < 22 ; i++) {
				for2: for(var j = 0 ; j < count ; j++) {
					if(Number(data[j].ti) == i) {
						var d = String(Number(data[j].totamt)/10000);
						totamt[Number(data[j].ti)-8] = d;
						
						var d2 = String(data[j].totcnt);
						totcnt[Number(data[j].ti)-8] = d2;
						
						var d3 = String(data[j].h);
						cust[Number(data[j].ti)-8] = d3;
					}//if
				}//for2
			}//for1
			
			console.log(totamt);
			console.log(totcnt);
			console.log(cust);
			
			data1 = totamt;//매출금액
			data2 = totcnt;//매출건수
			data3 = cust;//내방객수

			chartData3 = {
				labels: ['00~08시', '09시', '10시', '11시', '12시', '13시', '14시', '15시', '16시', '17시', '18시', '19시', '20시', '21~24시'],
				datasets: [{
					label: ['매출금액'],
					backgroundColor: color(ChartHelper.chartColors.ye).alpha(0.7).rgbString(),
					borderColor: ChartHelper.chartColors.ye,
					/* borderWidth: 1, */
					data: data1,
				}, {
					label: ['매출건수'],
					backgroundColor: color(ChartHelper.chartColors.blue).alpha(0.7).rgbString(),
					borderColor: ChartHelper.chartColors.blue,
					/* borderWidth: 1, */
					data: data2,
				}, {
					label: ['내방객수'],
					backgroundColor: color(ChartHelper.chartColors.red).alpha(0.7).rgbString(),
					borderColor: ChartHelper.chartColors.red,
					/* borderWidth: 1, */
					data: data3,
				}]
			};

			window.BarChart = new Chart(ctx, {
				type: 'bar',
				data: chartData3,
				options: {
					responsive: true, //auto size : true
					maintainAspectRatio: false,
					legend: {
						display: true, // 안보이게 하려면 false
						position: 'bottom'
					},
					scales: {
						xAxes: [{
							categoryPercentage: 0.5,
							barPercentage: 0.5,
							ticks: {
								fontColor: "#b4bfd0",
								fontSize: 12
							},
							gridLines: {
								display: false,
								color: "#fff"
							}
						}],
						yAxes: [{
							ticks: {
								fontColor: "#b4bfd0",
								fontSize: 12,
								beginAtZero: true,
								callback: function (value) {
									if (0 === value % 1) {
										return value;
									}
								}
							}
						}]//yaxes
					}//scales
				}//option
			});//barchart
		},//success
		error: function() { alert("오류"); }
	});//ajax(timestat)
}//분기별 시간대 통계(timestat)

/* 탭1(요일별, 시간대별) */
$(".tab > .tablinks").click(function(){
	$(".tab > .tablinks").removeClass("active");
	$(this).addClass("active");
	$(".tab-wrap > .tabcontent").hide();
	$(".tab-wrap > .tabcontent").eq($(this).index()).show();
});
$(".tab > .tablinks").eq(0).trigger("click");

/* 탭2(1,2,3,4 분기) */
$(".tab-wrap > .tabcontent").eq(0).find($(".tab2 .tablinks2")).click(function(){
	$(".tab-wrap > .tabcontent").eq(0).find($(".tab2 .tablinks2")).removeClass("active");
	$(this).addClass("active");
});
$(".tab-wrap > .tabcontent").eq(1).find($(".tab2 .tablinks2")).click(function(){
	$(".tab-wrap > .tabcontent").eq(1).find($(".tab2 .tablinks2")).removeClass("active");
	$(this).addClass("active");
});
$(".tab2 .tablinks2").eq(0).trigger("click");

/*modal */
$(".pop-link1").click(function () {
	$(".modal-wrap1").css({"display": "flex"});
});
$(".pop-close1").click(function () {
	$(".modal-wrap1").css({"display": "none"});
});

$(".pop-link2").click(function () {
	$(".modal-wrap2").css({"display": "flex"});
});
$(".pop-close2").click(function () {
	$(".modal-wrap2").css({"display": "none"});
});

/* 테두리선 */
$('.table-responsive').scroll(onScroll).trigger("scroll");

function onScroll() {
	var scTop = $(this).scrollTop();
	var scleft = $(this).scrollLeft();
	if (scTop > 1) {
		$('.pop-cont .table thead th').css("box-shadow", "inset 0 -1px 0 #eee");
	} else if (scleft > 1) {
		$('.box .table tbody tr td:nth-child(1)').css("box-shadow", "inset -1px 0 0 #eee");
	} else {
		$('.pop-cont .table thead th').css("box-shadow", "none");
		$('.box .table tbody tr td:nth-child(1)').css("box-shadow", "none");
	}
}

//천단위 콤마 찍기
function numWithCommas(x) {
	return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}