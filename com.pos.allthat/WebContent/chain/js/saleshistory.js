/* 탭 */
$(".tab > .tablinks").click(function () {
	$(".tab > .tablinks").removeClass("active");
	$(this).addClass("active");
	$(".tab-wrap > .tabcontent").hide();
	$(".tab-wrap > .tabcontent").eq($(this).index()).show();
});
$(".tab > .tablinks").eq(0).trigger("click");

$(".box:first .tab2 > .tablinks2").click(function () {
	$(".box:first .tab2 > .tablinks2").removeClass("active");
	$(this).addClass("active");
	$(".box:first .tab-wrap2 > .tabcontent2").hide();
	$(".box:first .tab-wrap2 > .tabcontent2").eq($(this).index()).show();
});
$(".box:first .tab2 > .tablinks2").eq(0).trigger("click");

$(".box:last .tab2 > .tablinks2").click(function () {
	$(".box:last .tab2 > .tablinks2").removeClass("active");
	$(this).addClass("active");
	$(".box:last .tab-wrap2 > .tabcontent2").hide();
	$(".box:last .tab-wrap2 > .tabcontent2").eq($(this).index()).show();
});
$(".box:last .tab2 > .tablinks2").eq(0).trigger("click");


/*modal */
$(".pop-link1").click(function () {
	$(".modal-wrap1").css({
		"display": "flex"
	});
});
$(".pop-close1").click(function () {
	$(".modal-wrap1").css({
		"display": "none"
	});
});

$(".pop-link2").click(function () {
	$(".modal-wrap2").css({
		"display": "flex"
	});
});
$(".pop-close2").click(function () {
	$(".modal-wrap2").css({
		"display": "none"
	});
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

data1 = ['100', '60', '70', '80', '90', '100', '110'];
data2 = ['10', '100', '100', '60', '50', '40', '40'];
data3 = ['60', '150', '80', '60', '70', '40', '40'];

chartData1 = {
	labels: ['월', '화', '수', '목', '금', '토', '일'],
	datasets: [{
		label: ['당월 PB상품 매출'],
		backgroundColor: color(ChartHelper.chartColors.ye).alpha(0.7).rgbString(),
		borderColor: ChartHelper.chartColors.ye,
		/* 	borderWidth: 1, */
		data: data1,
	}, {
		label: ['금주 PB상품 매출'],
		backgroundColor: color(ChartHelper.chartColors.blue).alpha(0.7).rgbString(),
		borderColor: ChartHelper.chartColors.blue,
		/* borderWidth: 1, */
		data: data2,
	}, {
		label: ['전주 PB상품 매출'],
		backgroundColor: color(ChartHelper.chartColors.red).alpha(0.7).rgbString(),
		borderColor: ChartHelper.chartColors.red,
		/* borderWidth: 1, */
		data: data3,
	}]
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
			}],
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
			}]
		}
	}
});

/* 그래프2 */
var ChartHelper = {
	chartColors: {
		ye: '#ffb703',
		blue: '#2c7be5',
		red: '#e63946'
	}
};

var color = Chart.helpers.color;
var ctx = document.getElementById('graph2').getContext('2d');

data1 = ['1', '60', '70', '80', '90', '100', '110'];
data2 = ['90', '100', '100', '60', '50', '40', '40'];
data3 = ['60', '150', '80', '60', '70', '40', '40'];

chartData2 = {
	labels: ['월', '화', '수', '목', '금', '토', '일'],
	datasets: [{
		label: ['당월 가맹점(전체) 매출'],
		backgroundColor: color(ChartHelper.chartColors.ye).alpha(0.7).rgbString(),
		borderColor: ChartHelper.chartColors.ye,
		/* borderWidth: 1, */
		data: data1,
	}, {
		label: ['금주 가맹점(전체) 매출'],
		backgroundColor: color(ChartHelper.chartColors.blue).alpha(0.7).rgbString(),
		borderColor: ChartHelper.chartColors.blue,
		/* borderWidth: 1, */
		data: data2,
	}, {
		label: ['전주 가맹점(전체) 매출'],
		backgroundColor: color(ChartHelper.chartColors.red).alpha(0.7).rgbString(),
		borderColor: ChartHelper.chartColors.red,
		/* borderWidth: 1, */
		data: data3,
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
			}],
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
			}]
		}
	}
});

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

data1 = ['1', '60', '70', '80', '90', '100', '110', '1', '60', '70', '80', '90', '100', '110'];
data2 = ['90', '110', '100', '60', '50', '40', '40', '90', '110', '100', '60', '50', '40', '40'];
data3 = ['50', '150', '80', '60', '70', '40', '40', '50', '150', '80', '60', '70', '40', '40'];

chartData3 = {
	labels: ['00~08시', '09시', '10시', '11시', '12시', '13시', '14시', '15시', '16시', '17시', '18시', '19시', '20시', '21~24시'],
	datasets: [{
		label: ['당월 PB상품 매출'],
		backgroundColor: color(ChartHelper.chartColors.ye).alpha(0.7).rgbString(),
		borderColor: ChartHelper.chartColors.ye,
		/* borderWidth: 1, */
		data: data1,
	}, {
		label: ['금주 PB상품 매출'],
		backgroundColor: color(ChartHelper.chartColors.blue).alpha(0.7).rgbString(),
		borderColor: ChartHelper.chartColors.blue,
		/* borderWidth: 1, */
		data: data2,
	}, {
		label: ['전주 PB상품 매출'],
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

/* 그래프4 */
var ChartHelper = {
	chartColors: {
		ye: '#ffb703',
		blue: '#2c7be5',
		red: '#e63946'
	}
};

var color = Chart.helpers.color;
var ctx = document.getElementById('graph4').getContext('2d');

data1 = ['1', '60', '80', '80', '90', '100', '110', '190', '50', '100', '60', '50', '40', '40'];
data2 = ['190', '50', '100', '60', '50', '40', '40', '60', '150', '80', '60', '70', '40', '40'];
data3 = ['60', '150', '80', '60', '70', '40', '40', '60', '100', '90', '80', '30', '40', '40'];

chartData4 = {
	labels: ['00~08시', '09시', '10시', '11시', '12시', '13시', '14시', '15시', '16시', '17시', '18시', '19시', '20시', '21~24시'],
	datasets: [{
		label: ['당월 가맹점(전체) 매출'],
		backgroundColor: color(ChartHelper.chartColors.ye).alpha(0.7).rgbString(),
		borderColor: ChartHelper.chartColors.ye,
		/* borderWidth: 1, */
		data: data1,
	}, {
		label: ['금주 가맹점(전체) 매출'],
		backgroundColor: color(ChartHelper.chartColors.blue).alpha(0.7).rgbString(),
		borderColor: ChartHelper.chartColors.blue,
		/* borderWidth: 1, */
		data: data2,
	}, {
		label: ['전주 가맹점(전체) 매출'],
		backgroundColor: color(ChartHelper.chartColors.red).alpha(0.7).rgbString(),
		borderColor: ChartHelper.chartColors.red,
		/* borderWidth: 1, */
		data: data3,
	}]
};

window.BarChart = new Chart(ctx, {
	type: 'bar',
	data: chartData4,
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