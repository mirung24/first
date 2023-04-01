$(document).ready(function() {
var chaincode = $('#chaincode').val();
	
	// 매출집계 불러오기(전체)
	$.ajax({
		url: "main_info.do",
		type: "post",
		data: { "chaincode":chaincode },
		success: function(result) {
			console.log(result);
			$('#toamt1').attr('data-target',result.vo1.toamt1);
			$('#total1').append(numWithCommas(result.vo1.total1)+"원");
			$('#moamt1').append(numWithCommas(result.vo1.moamt1)+"원");
			$('#wwamt1').append(numWithCommas(result.vo1.wwamt1)+"원");
			
			$('#toamt2').attr('data-target',result.vo1.toamt2);
			$('#total2').append(numWithCommas(result.vo1.total2)+"원");
			$('#moamt2').append(numWithCommas(result.vo1.moamt2)+"원");
			$('#wwamt2').append(numWithCommas(result.vo1.wwamt2)+"원");
			
			$('#ddcnt').attr('data-target',result.vo3.ddcnt);
			$('#totcnt').append(numWithCommas(result.vo3.totcnt)+"개");
			$('#yycnt').append(numWithCommas(result.vo3.yycnt)+"개");
			$('#wecnt').append(numWithCommas(result.vo3.wecnt)+"개");
			
			$('#dcust').attr('data-target',result.vo4.dcust);
			$('#custcnt').html(numWithCommas(result.vo4.mcust+result.vo4.fcust)+"명 (남 "
					+numWithCommas(result.vo4.mcust)+"명 <span class='line'>|</span> 여 "
					+numWithCommas(result.vo4.fcust)+"명)");
			$('#wcust').append(numWithCommas(result.vo4.wcust)+"명");
			
			if(numWithCommas(result.vo4.best).substr(2,3) == 'F') {
				$('#best').append(numWithCommas(result.vo4.best).substr(0,2)+"대 여성");
			} else if(numWithCommas(result.vo4.best).substr(2,3) == 'M') {
				$('#best').append(numWithCommas(result.vo4.best).substr(0,2)+"대 남성");
			}
			
			square_target();
		},
		error: function(jqXHR, textStatus, errorThrown) {
			 alert("오류");
			 console.log(jqXHR);
			 console.log(textStatus);
			 console.log(errorThrown);
		}
	});//매출집계
	
	// 그래프
	$.ajax({
		url: "stat_graph.do",
		data: { "chaincode":chaincode },
		success: function(result) {
			console.log(result);
			
			/* 그래프1 (월간 otc 매출) */
			var ChartHelper = {
				chartColors: {
					ye: '#52489c',
					blue: '#2c7be5',
					red: '#e63946'
				}
			};

			var color = Chart.helpers.color;
			var ctx = document.getElementById('graph1').getContext('2d');
			
			var mavgotc = [];// data1 가맹점 otc 평균
			var motc = [];// data2 당월 otc
			var motc2 = [];// data3 전월 otc
			var month = [];// labels(1~31일 표현)
			
			for(var i1 = 1; i1 < 32; i1++) {
				var t = String(i1);
				month.push(t);
				
				var mao = String(result.mlist[i1-1].mavgotc);
				mavgotc.push(mao);
				
				var mo = String(result.mlist[i1-1].motc);
				motc.push(mo);
				
				var mo2 = String(result.mlist[i1-1].motc2);
				motc2.push(mo2);
			}

			data1 = mavgotc;
			data2 = motc;
			data3 = motc2;

			chartData1 = {
				labels: month,
				datasets: [{
					label: ['가맹점평균'],
					backgroundColor: color(ChartHelper.chartColors.ye).alpha(0.1).rgbString(),
					borderColor: ChartHelper.chartColors.ye,
					borderWidth: 2,
					data: data1,
				}, {
					label: ['당월'],
					backgroundColor: color(ChartHelper.chartColors.blue).alpha(0).rgbString(),
					borderColor: ChartHelper.chartColors.blue,
					borderWidth: 2,
					data: data2,
				},  {
					label: ['전월'],
					backgroundColor: color(ChartHelper.chartColors.red).alpha(0).rgbString(),
					borderColor: ChartHelper.chartColors.red,
					borderWidth: 2,
					data: data3,
				}]
			};

			window.BarChart = new Chart(ctx, {
				type: 'line',
				data: chartData1,
				options: {
					responsive: true, //auto size : true
					maintainAspectRatio: false,
					legend: {
						display: true, // 안보이게 하려면 false
						position: 'bottom'
					},
					tooltips: {
						mode: 'point',
						intersect: true,
						callbacks: {
							label: function(tooltipItem, data) {
								return data.datasets[tooltipItem.datasetIndex].label + ": " 
								+ numWithCommas(tooltipItem.yLabel.toString()) + "원";
							}//label
						}//callbacks
					},//tooltips
					hover: {
						mode: 'point',
						intersect: true
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
						}],//xAxes
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
						}]//yAxes
					}//scales
				}
			});//그래프 1(월간 otc매출)
			
			/* 그래프2 (주간 otc 매출) */
			var ChartHelper = {
				chartColors: {
					ye: '#52489c',
					blue: '#2c7be5',
					red: '#e63946'
				}
			};

			var color = Chart.helpers.color;
			var ctx = document.getElementById('graph2').getContext('2d');

			var wavgotc = [];// data1 가맹점 otc 평균(주간)
			var wotc = [];// data2 금주 otc
			var wotc2 = [];// data3 전주 otc
		
			for(var i1 = 1; i1 < 8; i1++) {
				var wao = String(result.wlist[i1-1].wavgotc);
				wavgotc.push(wao);
				
				var wo = String(result.wlist[i1-1].wotc);
				wotc.push(wo);
				
				var wo2 = String(result.wlist[i1-1].wotc2);
				wotc2.push(wo2);
			}
			
			data1 = wavgotc;
			data2 = wavgotc;
			data3 = wotc2;

			chartData2 = {
				labels: ['일', '월', '화', '수', '목', '금', '토'],
				datasets: [{
					label: ['가맹점평균'],
					backgroundColor: color(ChartHelper.chartColors.ye).alpha(0.1).rgbString(),
					borderColor: ChartHelper.chartColors.ye,
					borderWidth: 2,
					data: data1,
				}, {
					label: ['금주'],
					backgroundColor: color(ChartHelper.chartColors.blue).alpha(0).rgbString(),
					borderColor: ChartHelper.chartColors.blue,
					borderWidth: 2,
					data: data2,
				},  {
					label: ['전주'],
					backgroundColor: color(ChartHelper.chartColors.red).alpha(0).rgbString(),
					borderColor: ChartHelper.chartColors.red,
					borderWidth: 2,
					data: data3,
				}]
			};

			window.BarChart = new Chart(ctx, {
				type: 'line',
				data: chartData2,
				options: {
					responsive: true, //auto size : true
					maintainAspectRatio: false,
					legend: {
						display: true, // 안보이게 하려면 false
						position: 'bottom'
					},
					tooltips: {
						mode: 'point',
						intersect: true,
						callbacks: {
							label: function(tooltipItem, data) {
								return data.datasets[tooltipItem.datasetIndex].label + ": " 
								+ numWithCommas(tooltipItem.yLabel.toString()) + "원";
							}//label
						}//callbacks
					},//tooltips
					hover: {
						mode: 'point',
						intersect: true
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
						}],//xAxes
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
						}]//yAxes
					}//scales
				}//options
			});//그래프2 (주간 otc 매출)
			
			/* 그래프3 */
			var ChartHelper = {
				chartColors: {
					ye: '#52489c',
					blue: '#2c7be5',
					red: '#e63946'
				}
			};

			var color = Chart.helpers.color;
			var ctx = document.getElementById('graph3').getContext('2d');

			// labels(00~23시 표현)
			var havgotc = []; // otc 평균
			var hotc = []; // otc 당월
			var hotc2 = []; // otc 전월 
			var timeotc = [];
			for(var i2 = 0; i2 < 24; i2++) {
				var s = String(i2);
				timeotc.push(s);
				
				var hao = String(result.hlist[i2].havgotc);
				havgotc.push(hao);
				
				var ho = String(result.hlist[i2].hotc);
				hotc.push(ho);
				
				var ho2 = String(result.hlist[i2].hotc2);
				hotc2.push(ho2);
			}
			
			data1 = havgotc;
			data2 = hotc;
			data3 = hotc2;

			chartData3 = {
				labels: timeotc,
				datasets: [{
					label: ['가맹점평균'],
					backgroundColor: color(ChartHelper.chartColors.ye).alpha(0.1).rgbString(),
					borderColor: ChartHelper.chartColors.ye,
					borderWidth: 2,
					data: data1,
				}, {
					label: ['당월'],
					backgroundColor: color(ChartHelper.chartColors.blue).alpha(0).rgbString(),
					borderColor: ChartHelper.chartColors.blue,
					borderWidth: 2,
					data: data2,
				},  {
					label: ['전월'],
					backgroundColor: color(ChartHelper.chartColors.red).alpha(0).rgbString(),
					borderColor: ChartHelper.chartColors.red,
					borderWidth: 2,
					data: data3,
				}]
			};

			window.BarChart = new Chart(ctx, {
				type: 'line',
				data: chartData3,
				options: {
					responsive: true, //auto size : true
					maintainAspectRatio: false,
					legend: {
						display: true, // 안보이게 하려면 false
						position: 'bottom'
					},
					tooltips: {
						mode: 'point',
						intersect: true,
						callbacks: {
							label: function(tooltipItem, data) {
								return data.datasets[tooltipItem.datasetIndex].label + ": " 
								+ numWithCommas(tooltipItem.yLabel.toString()) + "원";
							}//label
						}//callbacks
					},//tooltips
					hover: {
						mode: 'point',
						intersect: true
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
			});// 그래프3 (시간별 otc)
			
			/* 그래프4 (월간 매출) */
			var ChartHelper = {
				chartColors: {
					ye: '#52489c',
					blue: '#2c7be5',
					red: '#e63946'
				}
			};

			var color = Chart.helpers.color;
			var ctx = document.getElementById('graph4').getContext('2d');

			var mavgtot = [];// data1 가맹점 전체 평균
			var mtot = [];// data2 당월 전체
			var mtot2 = [];// data3 전월 전체
			
			for(var i1 = 1; i1 < 32; i1++) {
				var mat = String(result.mlist[i1-1].mavgtot);
				mavgtot.push(mat);
				
				var mt = String(result.mlist[i1-1].mtot);
				mtot.push(mt);
				
				var mt2 = String(result.mlist[i1-1].mtot2);
				mtot2.push(mt2);
			}
			
			data1 = mavgtot;
			data2 = mtot;
			data3 = mtot2;

			chartData4 = {
				labels: month,
				datasets: [{
					label: ['가맹점평균'],
					backgroundColor: color(ChartHelper.chartColors.ye).alpha(0.1).rgbString(),
					borderColor: ChartHelper.chartColors.ye,
					borderWidth: 2,
					data: data1,
				}, {
					label: ['당월'],
					backgroundColor: color(ChartHelper.chartColors.blue).alpha(0).rgbString(),
					borderColor: ChartHelper.chartColors.blue,
					borderWidth: 2,
					data: data2,
				},  {
					label: ['전월'],
					backgroundColor: color(ChartHelper.chartColors.red).alpha(0).rgbString(),
					borderColor: ChartHelper.chartColors.red,
					borderWidth: 2,
					data: data3,
				}]
			};

			window.BarChart = new Chart(ctx, {
				type: 'line',
				data: chartData4,
				options: {
					responsive: true, //auto size : true
					maintainAspectRatio: false,
					legend: {
						display: true, // 안보이게 하려면 false
						position: 'bottom'
					},
					tooltips: {
						mode: 'point',
						intersect: true,
						callbacks: {
							label: function(tooltipItem, data) {
								return data.datasets[tooltipItem.datasetIndex].label + ": " 
								+ numWithCommas(tooltipItem.yLabel.toString()) + "원";
							}//label
						}//callbacks
					},//tooltips
					hover: {
						mode: 'point',
						intersect: true
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
			});//그래프 4(월간 매출)
			
			/* 그래프5 */
			var ChartHelper = {
				chartColors: {
					ye: '#52489c',
					blue: '#2c7be5',
					red: '#e63946'
				}
			};

			var color = Chart.helpers.color;
			var ctx = document.getElementById('graph5').getContext('2d');

			var wavgtot = [];// data1 가맹점 평균(주간)
			var wtot = [];// data2 금주
			var wtot2 = [];// data3 전주
		
			for(var i1 = 1; i1 < 8; i1++) {
				var wao = String(result.wlist[i1-1].wavgtot);
				wavgtot.push(wao);
				
				var wt = String(result.wlist[i1-1].wtot);
				wtot.push(wt);
				
				var wt2 = String(result.wlist[i1-1].wtot2);
				wtot2.push(wt2);
			}
			
			data1 = wavgtot;
			data2 = wtot;
			data3 = wtot2;

			chartData5 = {
				labels: ['일', '월', '화', '수', '목', '금', '토'],
				datasets: [{
					label: ['가맹점평균'],
					backgroundColor: color(ChartHelper.chartColors.ye).alpha(0.1).rgbString(),
					borderColor: ChartHelper.chartColors.ye,
					borderWidth: 2,
					data: data1,
				}, {
					label: ['금주'],
					backgroundColor: color(ChartHelper.chartColors.blue).alpha(0).rgbString(),
					borderColor: ChartHelper.chartColors.blue,
					borderWidth: 2,
					data: data2,
				},  {
					label: ['전주'],
					backgroundColor: color(ChartHelper.chartColors.red).alpha(0).rgbString(),
					borderColor: ChartHelper.chartColors.red,
					borderWidth: 2,
					data: data3,
				}]
			};

			window.BarChart = new Chart(ctx, {
				type: 'line',
				data: chartData5,
				options: {
					responsive: true, //auto size : true
					maintainAspectRatio: false,
					legend: {
						display: true, // 안보이게 하려면 false
						position: 'bottom'
					},
					tooltips: {
						mode: 'point',
						intersect: true,
						callbacks: {
							label: function(tooltipItem, data) {
								return data.datasets[tooltipItem.datasetIndex].label + ": " 
								+ numWithCommas(tooltipItem.yLabel.toString()) + "원";
							}//label
						}//callbacks
					},//tooltips
					hover: {
						mode: 'point',
						intersect: true
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
			});// 그래프5(주간 매출)
			
			/* 그래프6 */
			var ChartHelper = {
				chartColors: {
					ye: '#52489c',
					blue: '#2c7be5',
					red: '#e63946'
				}
			};

			var color = Chart.helpers.color;
			var ctx = document.getElementById('graph6').getContext('2d');

			
			var havgtot = []; // 평균
			var htot = []; // 당월
			var htot2 = []; // 전월 
			var timeotc = []; // labels(00~23시 표현)
			
			for(var i2 = 0; i2 < 24; i2++) {
				var s = String(i2);
				timeotc.push(s);
				
				var hat = String(result.hlist[i2].havgtot);
				havgtot.push(hat);
				
				var ht = String(result.hlist[i2].htot);
				htot.push(ht);
				
				var ht2 = String(result.hlist[i2].htot2);
				htot2.push(ht2);
			}
			
			data1 = havgtot;
			data2 = htot;
			data3 = htot2;

			chartData6 = {
				labels: timeotc,
				datasets: [{
					label: ['가맹점평균'],
					backgroundColor: color(ChartHelper.chartColors.ye).alpha(0.1).rgbString(),
					borderColor: ChartHelper.chartColors.ye,
					borderWidth: 2,
					data: data1,
				}, {
					label: ['당월'],
					backgroundColor: color(ChartHelper.chartColors.blue).alpha(0).rgbString(),
					borderColor: ChartHelper.chartColors.blue,
					borderWidth: 2,
					data: data2,
				},  {
					label: ['전월'],
					backgroundColor: color(ChartHelper.chartColors.red).alpha(0).rgbString(),
					borderColor: ChartHelper.chartColors.red,
					borderWidth: 2,
					data: data3,
				}]
			};

			window.BarChart = new Chart(ctx, {
				type: 'line',
				data: chartData6,
				options: {
					responsive: true, //auto size : true
					maintainAspectRatio: false,
					legend: {
						display: true, // 안보이게 하려면 false
						position: 'bottom'
					},
					tooltips: {
						mode: 'point',
						intersect: true,
						callbacks: {
							label: function(tooltipItem, data) {
								return data.datasets[tooltipItem.datasetIndex].label + ": " 
								+ numWithCommas(tooltipItem.yLabel.toString()) + "원";
							}//label
						}//callbacks
					},//tooltips
					hover: {
						mode: 'point',
						intersect: true
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
			});// 그래프6 (시간 전체 매출)
		},//success
		error: function() {
			 alert("오류");
		}
	});// 그래프
});//ready

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
