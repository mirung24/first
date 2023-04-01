var doc = document;

/* 기본 정보 */
var chaincode = $("#chaincode").val();

/* 현재 날짜 구하기 */
var today = new Date();
var year = today.getFullYear();
var year1 = ("0" + today.getFullYear()).slice(-2); // 뒤에 두개만 가져오기
var month = ("0" + (today.getMonth() + 1)).slice(-2);
var day = ("0" + today.getDate()).slice(-2);

/* 날짜 집어넣기 */
$(".thisyear").text(year+"년"); // 금년

/* 이벤트 처리 */
doc.addEventListener("DOMContentLoaded", function(event) {
	jsFun.ready();
}, false);

/* 탭(주간통계) */
$(".tab > .tablink").click(function () {
	$(".tab > .tablink").removeClass("active");
	$(this).addClass("active");
	$(".tab-wrap > .tabcontent").hide();
	$(".tab-wrap > .tabcontent").eq($(this).index()).show();
});
$(".tab > .tablink").eq(0).trigger("click");

/* 탭(신규 가맹점 매출) */
$(".tab > .tablink2").click(function () {
	$(".tab > .tablink2").removeClass("active");
	$(this).addClass("active");
	$(".tab-wrap > .tabcontent2").hide();
	$(".tab-wrap > .tabcontent2").eq($(this).index()).show();
});
$(".tab > .tablink2").eq(0).trigger("click");

/* 탭(주간 순위) */
$(".tab > .tablink3").click(function () {
	$(".tab > .tablink3").removeClass("active");
	$(this).addClass("active");
	$(".tab-wrap > .tabcontent3").hide();
	$(".tab-wrap > .tabcontent3").eq($(this).index()).show().css("display","flex");
});
$(".tab > .tablink3").eq(0).trigger("click");

/* 탭(주간 순위의 금액, 수량) */
$(".tab > .option2").click(function () {
	$(".tab > .option2").removeClass("active");
	$(this).addClass("active");
	$(".tab-wrap > .option2").hide();
	$(".tab-wrap > .option2").eq($(this).index()).show();
});
$(".tab > .option2").eq(0).trigger("click");

/* 상품순위 (매출, 건수 클릭이벤트) */
$(".option2[name=total]").click(function() {
	var sel1 = $(".tablink3.active").attr('name');
	jsFun.comprank(sel1, "total");
});
$(".option2[name=count]").click(function() {
	var sel1 = $(".tablink3.active").attr('name');
	jsFun.comprank(sel1, "count");
});

/* function 모음 */
var jsFun = {
		/* 초기 이벤트 */
		ready : function() {
			jsFun.load();		// 페이지 로그될 때
			jsFun.topstat();	// 상단집계
			jsFun.weektl();		// 타임라인(주간)
			jsFun.monthtl();	// 타임라인(월간)
		},
		
		
		/* 페이지 로드 */
		load : function() {
//			jsFun.comprank("top", "total");
			$("[name=weekrank]").text("매출");
		}, // load
		
		/* 상단 집계 */
		topstat : function() {
			$.ajax({
				url: "/chain/topstat.do",
				type: "GET",
				data: { "chaincode":chaincode },
				success: function(result) {
					topstat(result);
				},
				error: function() { alert("상단집계 오류"); }
			});
		}, // topstat
		
		/* 타임라인(주간) */
		weektl : function() {
			$.ajax({
				url: "/chain/weektl.do",
				type: "GET",
				data: { "chaincode":chaincode },
				success: function(result) {
					weektimeline(result);
				},
				error: function() { alert("주간 타임라인 오류"); }
			});
		}, // weektl
		
		/* 타임라인(월간) */
		monthtl : function() {
			$.ajax({
				url: "/chain/monthtl.do",
				type: "GET",
				data: { "chaincode":chaincode },
				success: function(result) {
					monthtimeline(result);
				},
				error: function() { alert("월간 타임라인 오류"); }
			});
		}, // monthtl
		
		/* 주간 가맹점 순위 */
		comprank : function(sel1, option1) {
			$.ajax({
				url: "/chain/comprank.do",
				type: "GET",
				data: {
					"chaincode":chaincode,
					"sel":sel1,
					"option":option1
				},
				success: function(result) {
					console.log("주간순위", result);
					comprank(result);
				},
				error: function() { alert("주간 가맹점 순위 오류"); }
			});
		} // weekrank
} // jsFun

/* 상단집계 */
function topstat(result) {
	/* 전일 */
	var yesterday = result.yesterday;
	if(yesterday != null) {
		$('#tetc').attr('data-target', yesterday.tetc);
		$('#totc').attr('data-target',yesterday.totc);
		$('#cust').attr('data-target',yesterday.cust);
		$('#compcnt').attr('data-target',yesterday.compcnt);
		$('#mfcust').html('남 '+numWithCommas(yesterday.mcnt)
		+'명 <span class="line">|</span> 여 '+numWithCommas(yesterday.fcnt)+'명');
	}
	
	/* 금년 */
	var thisyear = result.thisyear;
	$("#yetc").text(numWithCommas(thisyear.yetc)+"원");
	$("#yotc").text(numWithCommas(thisyear.yotc)+"원");
	$("#ytotal").text(numWithCommas(thisyear.ytotal)+"원");
	
	/* 이번달 */
	var thismonth = result.thismonth;
	$("#metc").text(numWithCommas(thismonth.metc)+"원");
	$("#motc").text(numWithCommas(thismonth.motc)+"원");
	
	/* 주간 */
	var thisweek = result.thisweek;
	$("#wetc").text(numWithCommas(thisweek.wetc)+"원");
	$("#wotc").text(numWithCommas(thisweek.wotc)+"원");
	$("#wcust").text(numWithCommas(thisweek.wcust)+"명");
	
	/* 신규가맹점 */
	var newcomp = result.newcomp;
	$("#yycnt").text(numWithCommas(newcomp.yycnt)+"개");
	$("#mmcnt").text(numWithCommas(newcomp.mmcnt)+"개");
	$("#wecnt").text(numWithCommas(newcomp.wecnt)+"개");
	
	/* best고객 */
	var best = result.best.best;
	if(best.substr(2,3) == 'f') { $("#best").text(best.substr(0,2)+"대 여성"); } 
	else if(best.substr(2,3) == 'm') { $("#best").text(best.substr(0,2)+"대 남성"); } 
	else { $("#best").text("-"); }
	
	square_target();
} // topstat

/* 타임라인(주간) */
function weektimeline(result) {
	let html = "";
	const cnt = result.length;
	
	for(var i = 0; i < cnt; i++) {
		if(result[i].mxcompcd.length > 7) { mxcompcd = result[i].mxcompcd.substr(0,7)+"..."; } // 최대가맹점
		else { mxcompcd = result[i].mxcompcd }
		if(result[i].micompcd.length > 7) { micompcd = result[i].micompcd.substr(0,7)+"..."; } // 최소가맹점
		else { micompcd = result[i].micompcd }
		
		html += '<div class="bar-wrap"><div class="bar bar'+(i+1)+'"><div class="circle"><span>'+result[i].tldate+'</span></div></div>'
		html += 	'<ul class="bar-cont ml-0">'
		html += 		'<li>가맹점 : '+result[i].compcnt+'</li>'
		html +=			'<li>매&nbsp;&nbsp;출 : '+result[i].total+'</li>'
		html += 		'<li>조&nbsp;&nbsp;제 : '+result[i].etc+'</li>'
		html +=			'<li>일&nbsp;&nbsp;반 : '+result[i].otc+'</li>'
		html += 		'<li>평&nbsp;&nbsp;균 : '+numWithCommas(result[i].average)+'</li>'
		html += 		'<li>최&nbsp;&nbsp;대 : <span class="productname"><div class="productname-hover"><span class="productname-line">'
						+result[i].mxcompcd+'</span><span class="tri"></span></div>'+mxcompcd+'</span></td></li>'
		html +=			'<li>최&nbsp;&nbsp;저 : <span class="productname"><div class="productname-hover"><span class="productname-line">'
						+result[i].micompcd+'</span><span class="tri"></span></div>'+micompcd+'</span></td></li>'
		html +=		'</ul>'
		html += '</div>'
	}
	$(".timeline").prepend(html);
} // weektimeline

/* 타임라인(월간) */
function monthtimeline(result) {
	let html = "";
	const cnt = result.length;
	
	for(var i = 0; i < cnt; i++) {
		if(result[i].mxcompcd.length > 7) { mxcompcd = result[i].mxcompcd.substr(0,7)+"..."; } // 최대가맹점
		else { mxcompcd = result[i].mxcompcd }
		if(result[i].micompcd.length > 7) { micompcd = result[i].micompcd.substr(0,7)+"..."; } // 최소가맹점
		else { micompcd = result[i].micompcd }
		
		html += '<div class="bar-wrap"><div class="bar bar'+(i+7)+'"><div class="circle"><span>'+result[i].tldate+'</span></div></div>'
		html += 	'<ul class="bar-cont ml-0">'
		html += 		'<li>가맹점 : '+numWithCommas(result[i].compcnt)+'</li>'
		html +=			'<li>매&nbsp;&nbsp;출 : '+numWithCommas(result[i].total)+'</li>'
		html += 		'<li>조&nbsp;&nbsp;제 : '+numWithCommas(result[i].etc)+'</li>'
		html +=			'<li>일&nbsp;&nbsp;반 : '+numWithCommas(result[i].otc)+'</li>'
		html += 		'<li>평&nbsp;&nbsp;균 : '+numWithCommas(result[i].average)+'</li>'
		html += 		'<li>최&nbsp;&nbsp;대 : <span class="productname"><div class="productname-hover"><span class="productname-line">'
						+result[i].mxcompcd+'</span><span class="tri"></span></div>'+mxcompcd+'</span></td></li>'
		html +=			'<li>최&nbsp;&nbsp;저 : <span class="productname"><div class="productname-hover"><span class="productname-line">'
						+result[i].micompcd+'</span><span class="tri"></span></div>'+micompcd+'</span></td></li>'
		html +=		'</ul>'
		html += '</div>'
	}
	$(".timeline").append(html);
} // monthtimeline

/* 가맹점 주간 순위 */
function comprank(result) {
	let html = "";
	const cnt = result.length;
	
	for(var i = 0; i < cnt; i++) {
		html += '<tr>'
		html += 	'<td><div>'+result[i].no+'</div></td>'
		html += 	'<td>'+result[i].companyname+'</td>'
		html += 	'<td>'+numWithCommas(result[i].total)+'원</td>'
		html += '</tr>'
	}
	$(".comprank").html(html);
}

/* 그래프1 */
var ChartHelper = {
	chartColors: {
		blue: '#2c7be5',
		red: '#e63946',
		ce: '#6372a0'
	}
};

var color = Chart.helpers.color;
var ctx = document.getElementById('graph1').getContext('2d');

data1 = ['900', '600', '700', '800', '900', '1000', '110'];
data2 = ['90', '100', '80', '60', '50', '40', '40'];
data3 = ['55', '61', '37', '49', '65', '112', '91', '98', '68', '57', '70', '61'];
data4 = ['50', '60', '45', '39', '70', '128', '104', '92', '81', '88', '73', '81'];

chartData1 = {
	labels: ['월', '화', '수', '목', '금', '토', '일'],
	datasets: [{
		label: ['판매 (만원)'],
		backgroundColor: color(ChartHelper.chartColors.blue).alpha(0.7).rgbString(),
		borderColor: ChartHelper.chartColors.blue,
		borderWidth: 1,
		data: data1,
	},
	/* {
		label: ['전주판매'],
		backgroundColor: color(ChartHelper.chartColors.red).alpha(0.7).rgbString(),
		borderColor: ChartHelper.chartColors.red,
		borderWidth: 1,
		data: data2,
	}, */
	{
		type : 'line',
		fill : false,
		borderWidth: 3,
		label: ['금주내방 (명)'],
		backgroundColor: color(ChartHelper.chartColors.red).alpha(0.5).rgbString(),
		borderColor: ChartHelper.chartColors.red,
		data: data3,
	},
	/* {
		type : 'line',
		fill : false,
		borderWidth: 2,
		label: '전주내방',
		backgroundColor: color(ChartHelper.chartColors.red).alpha(0.5).rgbString(),
		borderColor: ChartHelper.chartColors.red,
		data: data4,
	} */]
};

window.BarChart = new Chart(ctx, {
	type: 'bar',
	data: chartData1,
	options: {
		responsive: true //auto size : true
			,
		maintainAspectRatio: false,
		legend: {
			display: true // 안보이게 하려면 false
				,
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
			}]
		}
	}
});

/* 그래프2 */
var ChartHelper = {
	chartColors: {
		blue: '#2c7be5',
		red: '#e63946'
	}
};

var color = Chart.helpers.color;
var ctx = document.getElementById('graph2').getContext('2d');

data1 = ['1', '60', '70', '80', '90', '100', '70'];
data2 = ['90', '100', '80', '60', '50', '40', '40'];

chartData2 = {
	labels: ['월', '화', '수', '목', '금', '토', '일'],
	datasets: [{
		label: ['금주'],
		backgroundColor: color(ChartHelper.chartColors.blue).alpha(0.7).rgbString(),
		borderColor: ChartHelper.chartColors.blue,
		borderWidth: 1,
		data: data1
	}, {
		label: ['전주'],
		backgroundColor: color(ChartHelper.chartColors.red).alpha(0.7).rgbString(),
		borderColor: ChartHelper.chartColors.red,
		borderWidth: 1,
		data: data2
	}]
};

window.BarChart = new Chart(ctx, {
	type: 'bar',
	data: chartData2,
	options: {
		responsive: true //auto size : true
			,
		maintainAspectRatio: false,
		legend: {
			display: true // 안보이게 하려면 false
				,
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
			}]
		}
	}
});

/* 그래프3 */
var ChartHelper = {
	chartColors: {
		blue: '#2c7be5',
		red: '#e63946'
	}
};

var color = Chart.helpers.color;
var ctx = document.getElementById('graph3').getContext('2d');

data1 = ['1', '60', '70', '80', '90', '100', '100'];
data2 = ['190', '200', '180', '260', '150', '90', '20'];

chartData3 = {
	labels: ['월', '화', '수', '목', '금', '토', '일'],
	datasets: [{
		label: ['금주'],
		backgroundColor: color(ChartHelper.chartColors.blue).alpha(0.7).rgbString(),
		borderColor: ChartHelper.chartColors.blue,
		borderWidth: 1,
		data: data1
	}, {
		label: ['전주'],
		backgroundColor: color(ChartHelper.chartColors.red).alpha(0.7).rgbString(),
		borderColor: ChartHelper.chartColors.red,
		borderWidth: 1,
		data: data2
	}]
};

window.BarChart = new Chart(ctx, {
	type: 'bar',
	data: chartData3,
	options: {
		responsive: true //auto size : true
			,
		maintainAspectRatio: false,
		legend: {
			display: true // 안보이게 하려면 false
				,
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
			}]
		}
	}
});

$(document).ajaxStart(function () {
    $('#loading').show(); // ajax 시작 -> 로딩바 표출
});

$(document).ajaxStop(function () {
    $('#loading').hide(); // ajax 끝 -> 로딩바 히든
});

//천단위 콤마 찍기
function numWithCommas(x) {
	return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
