/* 달 선택 캘린더 */
//var currentYear = (new Date()).getFullYear();
//var startYear = currentYear - 1;
//var options = {
//	startYear: startYear,
//	finalYear: currentYear,
//	pattern: 'yyyy-mm',
//	monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
//};
//$('#currnetMonth').monthpicker(options);
/*캘린더 이번달 지정 */
//document.getElementById('currnetMonth').value = new Date().toISOString().slice(0, 7);

$(document).ready(function() {
	var compcd = $('#compcd').val();
	var corpnum = $('#corpnum').val();
	
	// 현재날짜 구하기
	var today = new Date();
	var year =  today.getFullYear();
	var month = ("0" + (today.getMonth() + 1)).slice(-2);
	var day = ("0" + today.getDate()).slice(-2);
	var date = year+month+day;//오늘날짜
	
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
			console.log("api승인내역 조회", result);
			console.log(result.RET_CODE);
			
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
	
	// 매출집계 가져오기
	$.ajax({
		url: "smain_info.do",
		data: { "compcd":compcd },
		success: function(result) {
			console.log(result);
			$('#ttot').attr('data-target', result.vo1.ttot);// 일 매출
			$('#ytot').append(numWithCommas(result.vo1.ytot)+"원");// 연 매출
			$('#mtot').append(numWithCommas(result.vo1.mtot)+"원"); // 월 매출
			$('#wtot').append(numWithCommas(result.vo1.wtot)+"원"); // 주간 매출
			
			$('#towtot').attr('data-target', result.vo1.towtot);// 일 otc 매출
			$('#oytot').append(numWithCommas(result.vo1.oytot)+"원");// 연 otc 매출
			$('#omtot').append(numWithCommas(result.vo1.omtot)+"원"); // 월 otc 매출
			$('#owtot').append(numWithCommas(result.vo1.owtot)+"원"); // 주간 otc 매출
			$('#ppoytot').append(numWithCommas(result.vo1.ytot - result.vo1.oytot)+"원");// 연 기타 매출
			$('#ppomtot').append(numWithCommas(result.vo1.mtot - result.vo1.omtot)+"원"); // 월 기타 매출
			$('#ppowtot').append(numWithCommas(result.vo1.wtot - result.vo1.owtot)+"원"); // 주간 기타 매출
			
			$('#dcust').attr('data-target',result.vo2.dcust); // 당일 고객
			$(".today").text(result.vo2.dcust);
			$('#custcnt').html(numWithCommas(result.vo2.mcust+result.vo2.fcust)+"명 (남 "
					+numWithCommas(result.vo2.mcust)+"명 <span class='line'>|</span> 여 "
					+numWithCommas(result.vo2.fcust)+"명)");
			$('#wcust').append(numWithCommas(result.vo2.wcust)+"명");
			
			if(numWithCommas(result.vo2.best).substr(2,3) == 'F') {
				$('#best').append(numWithCommas(result.vo2.best).substr(0,2)+"대 여성");
			} else if(numWithCommas(result.vo2.best).substr(2,3) == 'M') {
				$('#best').append(numWithCommas(result.vo2.best).substr(0,2)+"대 남성");
			} else {
				$('#best').append(result.vo2.best);
			}
			
			square_target();
		},//success
		error: function() { alert("오류"); }
	});//ajax(매출집계)
	
//	var myval = $('#currnetMonth').val();// 현재 달력 년도와 월 가져오기
//	var calen = myval.split("-");// 기준으로 자르기
//	var sYear = calen[0];
//	var sMonth = calen[1];
//	var yearmonth = sYear+sMonth;
//	console.log('년월', yearmonth);
	
	// 그래프
	$.ajax({
		url: "sstat_graph.do",
		data: {
			"compcd":compcd
//			"yearmonth":yearmonth
		},
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
			
			var mcustavg1 = [];// data1 가맹점 otc 평균
			var mamt = [];// data2 당월 otc
			var mamt1 = [];// data3 전월 otc
			var month = [];// labels(1~31일 표현)
			
			var mcount = result.mlist.length;
			console.log('mcount', mcount);
			
			for(var i1 = 1; i1 < 32; i1++) {
				var t = String(i1);
				month.push(t);
				
				var mao = String(0);
				mcustavg1.push(mao);
				
				var mo = String(0);
				mamt.push(mo);
				
				var mo2 = String(0);
				mamt1.push(mo2);
			}

			
			for1: for(var i1 = 1; i1 < 32; i1++) {
				for2: for(var m1 = 0; m1 < mcount; m1++) {
					if(Number(result.mlist[m1].mday) == i1) {
						var mao = String(result.mlist[m1].mcustavg1);
						mcustavg1[Number(result.mlist[m1].mday-1)] = mao;
						
						var mo = String(result.mlist[m1].mamt);
						mamt[Number(result.mlist[m1].mday-1)] = mo;
						
						var mo2 = String(result.mlist[m1].mamt1);
						mamt1[Number(result.mlist[m1].mday-1)] = mo2;
					}
				}//for2
			}//for1
			
			console.log(mcustavg1);

			data1 = mcustavg1;
			data2 = mamt;
			data3 = mamt1;

			chartData1 = {
				labels: month,
				datasets: [{
					label: ['가맹점평균'],
					backgroundColor: color(ChartHelper.chartColors.ye).alpha(0.1).rgbString(),
					borderColor: ChartHelper.chartColors.ye,
					borderWidth: 2,
					data: data1,
				}, {
					label: ['금월'],
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
			});// 그래프1 (월간 otc 매출)
			
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
			
			var wocustavg1 = [];// data1 가맹점 otc 평균(주간)
			var wamt1 = [];// data2 금주 otc
			var wamt2 = [];// data3 전주 otc
		
			for(var i1 = 1; i1 < 8; i1++) {
				var wao = String(result.wlist[i1-1].wocustavg1);
				wocustavg1.push(wao);
				
				var wo = String(result.wlist[i1-1].wamt1);
				wamt1.push(wo);
				
				var wo2 = String(result.wlist[i1-1].wamt2);
				wamt2.push(wo2);
			}

			data1 = wocustavg1;
			data2 = wamt1;
			data3 = wamt2;

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
			});// 그래프2 (주간 otc 매출)
			
			/* 그래프3 (시간 otc 매출) */
			var ChartHelper = {
				chartColors: {
					ye: '#52489c',
					blue: '#2c7be5',
					red: '#e63946'
				}
			};

			var color = Chart.helpers.color;
			var ctx = document.getElementById('graph3').getContext('2d');
			
			// labels
			var tcustavg1 = []; // otc 평균
			var tamt = []; // otc 당월
			var tamt1 = []; // otc 전월 
			var timeotc = [];// (00~23시 표현)
			
			var tcount = result.tlist.length;
			console.log('tcount', tcount);
			
			for(var i1 = 0; i1 < 24; i1++) {
				var s = String(i1);
				timeotc.push(s);
				
				var hao = String(0);
				tcustavg1.push(hao);
				
				var ho = String(0);
				tamt.push(ho);
				
				var ho2 = String(0);
				tamt1.push(ho2);
			}

			
			for1: for(var i1 = 0; i1 < 24; i1++) {
				for2: for(var m1 = 0; m1 < tcount; m1++) {
					if(Number(result.tlist[m1].ti) == i1) {
						var hao = String(result.tlist[m1].tcustavg1);
						tcustavg1[Number(result.tlist[m1].ti)] = hao;
						
						var ho = String(result.tlist[m1].tamt);
						tamt[Number(result.tlist[m1].ti)] = ho;
						
						var ho2 = String(result.tlist[m1].tamt1);
						tamt1[Number(result.tlist[m1].ti)] = ho2;
					}
				}//for2
			}//for1
			
			console.log(tcustavg1);

			data1 = tcustavg1;
			data2 = tamt;
			data3 = tamt1;

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
			});// 그래프3 (시간 otc 매출)
			
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
			
			var mcustavg2 = [];// data1 가맹점 전체 평균
			var mtot = [];// data2 당월 전체
			var mtot1 = [];// data3 전월 전체
			
//			for(var i1 = 1; i1 < 32; i1++) {
//				var mat = String(result.mlist[i1-1].mcustavg2);
//				mcustavg2.push(mat);
//				
//				var mt = String(result.mlist[i1-1].mtot);
//				mtot.push(mt);
//				
//				var mt2 = String(result.mlist[i1-1].mtot1);
//				mtot1.push(mt2);
//			}
			
			for(var i1 = 1; i1 < 32; i1++) {
				
				var mat = String(0);
				mcustavg2.push(mat);
				
				var mt = String(0);
				mtot.push(mt);
				
				var mt2 = String(0);
				mtot1.push(mt2);
			}

			
			for1: for(var i1 = 1; i1 < 32; i1++) {
				for2: for(var m1 = 0; m1 < mcount; m1++) {
					if(Number(result.mlist[m1].mday) == i1) {
						var mat = String(result.mlist[m1].mcustavg2);
						mcustavg2[Number(result.mlist[m1].mday-1)] = mat;
						
						var mt = String(result.mlist[m1].mtot);
						mtot[Number(result.mlist[m1].mday-1)] = mt;
						
						var mt2 = String(result.mlist[m1].mtot1);
						mtot1[Number(result.mlist[m1].mday-1)] = mt2;
					}
				}//for2
			}//for1
			
			console.log(mcustavg2);

			data1 = mcustavg2;
			data2 = mtot;
			data3 = mtot1;

			chartData4 = {
				labels: month,
				datasets: [{
					label: ['가맹점평균'],
					backgroundColor: color(ChartHelper.chartColors.ye).alpha(0.1).rgbString(),
					borderColor: ChartHelper.chartColors.ye,
					borderWidth: 2,
					data: data1,
				}, {
					label: ['금월'],
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
			});// 그래프4 (월간 매출)
			
			/* 그래프5 (주간 매출) */
			var ChartHelper = {
				chartColors: {
					ye: '#52489c',
					blue: '#2c7be5',
					red: '#e63946'
				}
			};

			var color = Chart.helpers.color;
			var ctx = document.getElementById('graph5').getContext('2d');
			
			var wcustavg1 = [];// data1 가맹점 평균(주간)
			var wtot1 = [];// data2 금주
			var wtot2 = [];// data3 전주
		
			for(var i1 = 1; i1 < 8; i1++) {
				var wao = String(result.wlist[i1-1].wcustavg1);
				wcustavg1.push(wao);
				
				var wt = String(result.wlist[i1-1].wtot1);
				wtot1.push(wt);
				
				var wt2 = String(result.wlist[i1-1].wtot2);
				wtot2.push(wt2);
			}

			data1 = wcustavg1;
			data2 = wtot1;
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
			});// 그래프5 (주간 매출)
			
			/* 그래프6 (시간 매출) */
			var ChartHelper = {
				chartColors: {
					ye: '#52489c',
					blue: '#2c7be5',
					red: '#e63946'
				}
			};

			var color = Chart.helpers.color;
			var ctx = document.getElementById('graph6').getContext('2d');
			
			var tcustavg2 = []; // 평균
			var ttot = []; // 당월
			var ttot1 = []; // 전월 
			
			for(var i1 = 0; i1 < 24; i1++) {
				var hat = String(0);
				tcustavg2.push(hat);
				
				var ht = String(0);
				ttot.push(ht);
				
				var ht2 = String(0);
				ttot1.push(ht2);
			}

			for1: for(var i1 = 0; i1 < 24; i1++) {
				for2: for(var m1 = 0; m1 < tcount; m1++) {
					if(Number(result.tlist[m1].ti) == i1) {
						var hat = String(result.tlist[m1].tcustavg2);
						tcustavg2[Number(result.tlist[m1].ti)] = hat;
						
						var ht = String(result.tlist[m1].ttot);
						ttot[Number(result.tlist[m1].ti)] = ht;
						
						var ht2 = String(result.tlist[m1].ttot1);
						ttot1[Number(result.tlist[m1].ti)] = ht2;
					}
				}//for2
			}//for1
			
			console.log(tcustavg2);
			
//			
//			for(var i2 = 0; i2 < 24; i2++) {
//				var hat = String(result.tlist[i2].tcustavg2);
//				tcustavg2.push(hat);
//				
//				var ht = String(result.tlist[i2].ttot);
//				ttot.push(ht);
//				
//				var ht2 = String(result.tlist[i2].ttot1);
//				ttot1.push(ht2);
//			}

			data1 = tcustavg2;
			data2 = ttot;
			data3 = ttot1;

			chartData6 = {
				labels: timeotc,
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
			});// 그래프6 (시간 매출)
			
		},// success
		error: function() { alert("오류"); }
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
