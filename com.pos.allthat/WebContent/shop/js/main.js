$(document).ready(function() {
	
	var chaincode = $('#chaincode').val();
	var compcd = $('#compcd').val();
	var corpnum = $("#corpnum").val();
	
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
	
	var wprodsel = $(".tablink.active").attr('name');

	if(wprodsel == null) {
		bestworst("aaaa");
	} else {
		bestworst(wprodsel);
	}

	/* 탭 */
	$(".tab2 .tablink").click(function(){
	   $(".tab2 > .tablink").removeClass("active");
	   $(this).addClass("active");
	   $("thead > tr").find(".co1").attr('colSpan', 2);
	   $("tbody > tr").find(".tabcont").attr('colSpan', 2);
	   $("thead tr > .co1").css("display","none");
	   $("thead tr > .co1").eq($(this).index()).css("display","block");
	   $(".table2 thead tr > .co1").css("display","none");
	   $(".table2 thead tr > .co1").eq($(this).index()).css("display","block");
	   for (let i = 0; i < 10; i++) {
	      $("tbody > tr").eq(i).find(".tabcont").hide();
	      $("tbody > tr").eq(i).find(".tabcont").eq($(this).index()).show();
	   }
	   for (let i = 0; i < 10; i++) {
	      $(".table2 tbody > tr").eq(i).find(".tabcont").hide();
	      $(".table2 tbody > tr").eq(i).find(".tabcont").eq($(this).index()).show();
	   }
	   
	   var wprodsel = $(".tablink.active").attr('name');
	   bestworst(wprodsel);
	});
	$(".tab2 .tablink").eq(0).trigger("click");
	
	// 매출집계 불러오기(전체)
	$.ajax({
		url: "smain_info.do",
		type: "post",
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
			$("#tocust").append(result.vo2.dvisit+"명");
			$('#wcust').append(numWithCommas(result.vo2.wcust)+"명");
			
			if(numWithCommas(result.vo2.best).substr(2,3) == 'F') {
				$('#best').append(numWithCommas(result.vo2.best).substr(0,2)+"대 여성");
			} else if(numWithCommas(result.vo2.best).substr(2,3) == 'M') {
				$('#best').append(numWithCommas(result.vo2.best).substr(0,2)+"대 남성");
			} else {
				$('#best').append(result.vo2.best);
			}
			
			square_target();
		}, //success
		error: function() { alert("오류"); }
	});//ajax(매출집계)
	
	// 그래프
	$.ajax({
		url: "smain_graph.do",
		data: { "compcd":compcd },
		success: function(result) {
			console.log(result);
			
			/* 그래프1 */
			var ChartHelper = {
				chartColors: {
					blue: '#2c7be5',
					red: '#e63946'
				}
			};

			var color = Chart.helpers.color;
			var ctx = document.getElementById('graph1').getContext('2d');

			data1 = [result[0].tot1, result[1].tot1, result[2].tot1, result[3].tot1, result[4].tot1, result[5].tot1, result[6].tot1];
			data2 = [result[0].tot2, result[1].tot2, result[2].tot2, result[3].tot2, result[4].tot2, result[5].tot2, result[6].tot2];

			chartData1 = {
				labels: ['일', '월', '화', '수', '목', '금', '토'],
				datasets: [
					{
						label: ['금주'],
						backgroundColor: color(ChartHelper.chartColors.blue).alpha(0.7).rgbString(),
						borderColor: ChartHelper.chartColors.blue,
						borderWidth: 1,
						data: data1,
						pointStyle: 'line'
					}, 
					{
						label: ['전주'],
						backgroundColor: color(ChartHelper.chartColors.red).alpha(0.7).rgbString(),
						borderColor: ChartHelper.chartColors.red,
						borderWidth: 1,
						data: data2,
						pointStyle: 'line'
					}
				]
			};

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
					tooltips: {
						mode: 'point',
						intersect: true,
						callbacks: {
							label: function(tooltipItem, data) {
								return data.datasets[tooltipItem.datasetIndex].label + ": " 
								+ numWithCommas(tooltipItem.yLabel.toString());
							}//label
						}//callbacks
					},//tooltips
					hover: {
						mode: 'point',
						intersect: true
					},
//					title: {
//						display: true,
//						text: "단위 : 천원",
//						position: "left",
//						padding: 5,
//						fontColor: "#666"
//					},
					
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
				}//option
			}); //그래프1(주간판매)
			
			/* 그래프2 */
			var ChartHelper = {
				chartColors: {
					blue: '#2c7be5',
					red: '#e63946'
				}
			};

			var color = Chart.helpers.color;
			var ctx = document.getElementById('graph2').getContext('2d');

			data1 = [result[0].amt1, result[1].amt1, result[2].amt1, result[3].amt1, result[4].amt1, result[5].amt1, result[6].amt1];
			data2 = [result[0].amt2, result[1].amt2, result[2].amt2, result[3].amt2, result[4].amt2, result[5].amt2, result[6].amt2];

			chartData2 = {
				labels: ['일', '월', '화', '수', '목', '금', '토'],
				datasets: [{
					label: ['금주'],
					backgroundColor: color(ChartHelper.chartColors.blue).alpha(0.7).rgbString(),
					borderColor: ChartHelper.chartColors.blue,
					borderWidth: 1,
					data: data1,
					pointStyle: 'line'
				}, {
					label: ['전주'],
					backgroundColor: color(ChartHelper.chartColors.red).alpha(0.7).rgbString(),
					borderColor: ChartHelper.chartColors.red,
					borderWidth: 1,
					data: data2,
					pointStyle: 'line'
				}]
			};

			window.BarChart = new Chart(ctx, {
				type: 'bar',
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
								+ numWithCommas(tooltipItem.yLabel.toString());
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
			});//그래프2(OTC매출)
			
			/* 그래프3 */
			var ChartHelper = {
				chartColors: {
					blue: '#2c7be5',
					red: '#e63946'
				}
			};

			var color = Chart.helpers.color;
			var ctx = document.getElementById('graph3').getContext('2d');

			data1 = [result[0].cust1, result[1].cust1, result[2].cust1, result[3].cust1, result[4].cust1, result[5].cust1, result[6].cust1];
			data2 = [result[0].cust2, result[1].cust2, result[2].cust2, result[3].cust2, result[4].cust2, result[5].cust2, result[6].cust2];

			chartData3 = {
				labels: ['일', '월', '화', '수', '목', '금', '토'],
				datasets: [{
					label: ['금주'],
					backgroundColor: color(ChartHelper.chartColors.blue).alpha(0.7).rgbString(),
					borderColor: ChartHelper.chartColors.blue,
					borderWidth: 1,
					data: data1,
					pointStyle: 'line'
				}, {
					label: ['전주'],
					backgroundColor: color(ChartHelper.chartColors.red).alpha(0.7).rgbString(),
					borderColor: ChartHelper.chartColors.red,
					borderWidth: 1,
					data: data2,
					pointStyle: 'line'
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
					tooltips: {
						mode: 'point',
						intersect: true,
						callbacks: {
							label: function(tooltipItem, data) {
								return data.datasets[tooltipItem.datasetIndex].label + ": " 
								+ numWithCommas(tooltipItem.yLabel.toString()) + "명";
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
			});//그래프3(주간 내방)
		},//success
		error: function() { alert('오류'); }
	});//ajax(그래프)
	
	// 주간 chart
	$.ajax({
		url: "smain_chart.do",
		data: { 
			"compcd":compcd
		},
		success: function(result) {
			console.log(result);
			let htmlnc = "";// 신규 내방 고객
			const countnc = result.list3.length;//1 - 신규 내방 고객
			
			// 주간 신규 내방 고객
			if(countnc > 0) {
				for(var i = 0; i < countnc; i++) {
					htmlnc += "<tr>"
					htmlnc += 	"<td><div>"+ result.list3[i].no +"</div></td>"
					if(result.list3[i].cust.substr(2,3) == 'F') {
						htmlnc += 	"<td>"+ result.list3[i].cust.substr(0,2)+"대 여</td>";
					} else if(result.list3[i].cust.substr(2,3) == 'M') {
						htmlnc += 	"<td>"+ result.list3[i].cust.substr(0,2)+"대 남</td>";
					} else {
						htmlnc += 	"<td>-</td>";
					}
					htmlnc += 	"<td>"+ result.list3[i].visday.substr(2,10) +" ("+ result.list3[i].vistime +")</td>"
					htmlnc +=	"<td class='rank-red' style='text-align: right;'>"+ numWithCommas(result.list3[i].total) +"원</td>"
					htmlnc += "</tr>"
				}
			} else if(countnc == 0) {
				htmlnc += "<tr>"
				htmlnc += 	"<td>-</td>"
				htmlnc += 	"<td>-</td>"
				htmlnc += 	"<td>-</td>"
				htmlnc += 	"<td>-</td>"
				htmlnc += "</tr>"
			}// 주간 신규 내방 고객
			
			// 주간 매출 상위 상품
			$('#tp_day').append(result.list4[0].name);// 요일
			$('#tp_time').append(result.list4[2].name);// 시간
			
			if(result.list4[1].name.length > 20) {
				var tprodname = result.list4[1].name.substr(0,20)+"...";
			} else { var tprodname = result.list4[1].name; }
			$('#tp_prod').append(tprodname);// 상품
			
			if(result.list4[3].name.substr(2,3) == 'F' && result.list4[3].name.length >= 3) {// 연령
				$('#tp_age').append(result.list4[3].name.substr(0,2)+"대 여");//여자일 경우
			} else if(result.list4[3].name.substr(2,3) == 'M' && result.list4[3].name.length >= 3) {
				$('#tp_age').append(result.list4[3].name.substr(0,2)+"대 남");//남자일 경우
			} else {
				$("#tp_age").append("-");
			}
			
			
			// 주간 매출 하위 상품
			$('#sp_day').append(result.list5[0].name);// 요일
			$('#sp_time').append(result.list5[2].name);// 시간

			if(result.list5[1].name.length > 20) {
				var sprodname = result.list5[1].name.substr(0,20)+"...";
			} else { var sprodname = result.list5[1].name; }
			$('#sp_prod').append(sprodname);// 상품
			
			if(result.list5[3].name.substr(2,3) == 'F' && result.list5[3].name.length >= 3) {// 연령
				$('#sp_age').append(result.list5[3].name.substr(0,2)+"대 여");//여자일 경우
			} else if(result.list5[3].name.substr(2,3) == 'M' && result.list5[3].name.length >= 3) {
				$('#sp_age').append(result.list5[3].name.substr(0,2)+"대 남");//남자일 경우
			} else {
				$("#sp_age").append("-");
			}
			
			$('.new_cust').html(htmlnc);// 주간 신규 내방 고객
		},//success
		error: function(){ alert("오류"); }
	});//ajax(차트)
	
	//제외상품관리 버튼
	$(document).on('click', '#searchBtn2', function() {
		var compcd = $('#compcd').val();
		var search4 = $('[name=search4] option:selected').val();
		var searchInput2 = $('[name=searchInput2]').val();
		
		if(searchInput2 == null || searchInput2 == '') {
			swal({title: "검색어를 입력하세요.", button: "확인"})
			.then(function() {
				swal.close(); 
				$('[name=searchInput2]').focus();
				return false;
			})
		} else {
			prod_except(compcd, search4, searchInput2);
		}
	});//제외상품관리 버튼

})//ready

$(document).ajaxStart(function () {
    $('#loading').show(); // ajax 시작 -> 로딩바 표출
});

$(document).ajaxStop(function () {
    $('#loading').hide(); // ajax 끝 -> 로딩바 히든
});

function bestworst(wprodsel) {
	var compcd = $("#compcd").val();
	
	$.ajax({
		url: "smain_bestworst.do",
		data: {
			"compcd":compcd,
			"wprodsel":wprodsel
		},
		success: function(result) {
			console.log("bestworst",result);
			
			if(wprodsel == "aaaa") {
				let htmlbp = "";// best 상품
				let htmlwp = "";// worst 상품
				const countbp = result.list1.length;//0 - best 상품
				const countwp = result.list2.length;//0 - worst 상품
				console.log('best 상품 길이',countbp);
				
				// 주간 best 상품
				if(countbp > 0) {
					for(var i = 0; i < countbp; i++) {
						htmlbp += "<tr>"
						htmlbp += 	"<td><div>"+ result.list1[i].no +"</div></td>"
						if(result.list1[i].productname.length > 14) {
							var short = result.list1[i].productname.substr(0,13)+"...";
							htmlbp += 	"<td style='text-align: left;'>"+
									"<div class='productname'><div class='productname-hover'><span class='productname-line'>"+result.list1[i].productname
									+"</span><span class='tri'></span></div>"+short+"</div></td>"
						} else {
							htmlbp += 	"<td style='text-align: left;'>"+
									"<div class='productname'><div class='productname-hover'><span class='productname-line'>"+result.list1[i].productname
									+"</span><span class='tri'></span></div>"+result.list1[i].productname+"</div></td>"
						}
						htmlbp += 	"<td class='rank-red tabcont' style='text-align: right;'>"+ numWithCommas(result.list1[i].total) +"원</td>"
						htmlbp += 	"<td class='tabcont' style='text-align: right;'>"+ numWithCommas(result.list1[i].tcnt) +"건</td>"
						htmlbp += "</tr>"
					}
				} else if(countbp == 0) {
					htmlbp += "<tr>"
					htmlbp += 	"<td>-</td>"
					htmlbp += 	"<td>-</td>"
					htmlbp += 	"<td>-</td>"
					htmlbp += "</tr>"
				}// 주간 best 상품
				
				// 주간 worst 상품
				if(countwp > 0) {
					for(var i = 0; i < countwp; i++) {
						htmlwp += "<tr>"
						htmlwp += 	"<td><div>"+ result.list2[i].no +"</div></td>"
						if(result.list2[i].productname.length > 14) {
							var short = result.list2[i].productname.substr(0,13)+"...";
							htmlwp += 	"<td style='text-align: left;'>"+ 
									"<div class='productname'><div class='productname-hover'><span class='productname-line'>"+result.list2[i].productname
									+"</span><span class='tri'></span></div>"+short+"</div></td>"
						} else {
							htmlwp += 	"<td style='text-align: left;'>"+ 
									"<div class='productname'><div class='productname-hover'><span class='productname-line'>"+result.list2[i].productname
									+"</span><span class='tri'></span></div>"+result.list2[i].productname+"</div></td>"
						}
						htmlwp += 	"<td class='rank-red tabcont' style='text-align: right;'>"+ numWithCommas(result.list2[i].total) +"원</td>"
						htmlwp += 	"<td class='tabcont' style='text-align: right;'>"+ numWithCommas(result.list2[i].tcnt) +"건</td>"
						htmlwp += "</tr>"
					}
				} else if(countwp == 0) {
					htmlwp += "<tr>"
					htmlwp += 	"<td>-</td>"
					htmlwp += 	"<td>-</td>"
					htmlwp += 	"<td>-</td>"
					htmlwp += "</tr>"
				}// 주간 worst 상품
				$('.best_prod').html(htmlbp);// 주간 best 상품
				$('.worst_prod').html(htmlwp);// 주간 worst 상품
			}//if(aaaa)?
			
			else if(wprodsel == "bbbb") {
				let htmlbp = "";// best 상품
				let htmlwp = "";// worst 상품
				const countbp = result.list1.length;//0 - best 상품
				const countwp = result.list2.length;//0 - worst 상품
				console.log('best 상품 길이',countbp);
				
				// 주간 best 상품
				if(countbp > 0) {
					for(var i = 0; i < countbp; i++) {
						htmlbp += "<tr>"
						htmlbp += 	"<td><div>"+ result.list1[i].no +"</div></td>"
						if(result.list1[i].productname.length > 14) {
							var short = result.list1[i].productname.substr(0,13)+"...";
							htmlbp += 	"<td style='text-align: left;'>"+
									"<div class='productname'><div class='productname-hover'><span class='productname-line'>"+result.list1[i].productname
									+"</span><span class='tri'></span></div>"+short+"</div></td>"
						} else {
							htmlbp += 	"<td style='text-align: left;'>"+
									"<div class='productname'><div class='productname-hover'><span class='productname-line'>"+result.list1[i].productname
									+"</span><span class='tri'></span></div>"+result.list1[i].productname+"</div></td>"
						}
						htmlbp += 	"<td class='rank-red tabcont' style='text-align: right; display: none;'>"+ numWithCommas(result.list1[i].total) +"원</td>"
						htmlbp += 	"<td class='tabcont' style='text-align: right; display: table-cell;'>"+ numWithCommas(result.list1[i].tcnt) +"건</td>"
						htmlbp += "</tr>"
					}
				} else if(countbp == 0) {
					htmlbp += "<tr>"
					htmlbp += 	"<td>-</td>"
					htmlbp += 	"<td>-</td>"
					htmlbp += 	"<td>-</td>"
					htmlbp += "</tr>"
				}// 주간 best 상품
				
				// 주간 worst 상품
				if(countwp > 0) {
					for(var i = 0; i < countwp; i++) {
						htmlwp += "<tr>"
						htmlwp += 	"<td><div>"+ result.list2[i].no +"</div></td>"
						if(result.list2[i].productname.length > 14) {
							var short = result.list2[i].productname.substr(0,13)+"...";
							htmlwp += 	"<td style='text-align: left;'>"+ 
									"<div class='productname'><div class='productname-hover'><span class='productname-line'>"+result.list2[i].productname
									+"</span><span class='tri'></span></div>"+short+"</div></td>"
						} else {
							htmlwp += 	"<td style='text-align: left;'>"+ 
									"<div class='productname'><div class='productname-hover'><span class='productname-line'>"+result.list2[i].productname
									+"</span><span class='tri'></span></div>"+result.list2[i].productname+"</div></td>"
						}
						htmlwp += 	"<td class='rank-red tabcont' style='text-align: right; display: none;'>"+ numWithCommas(result.list2[i].total) +"원</td>"
						htmlwp += 	"<td class='tabcont' style='text-align: right; display: table-cell;'>"+ numWithCommas(result.list2[i].tcnt) +"건</td>"
						htmlwp += "</tr>"
					}
				} else if(countwp == 0) {
					htmlwp += "<tr>"
					htmlwp += 	"<td>-</td>"
					htmlwp += 	"<td>-</td>"
					htmlwp += 	"<td>-</td>"
					htmlwp += "</tr>"
				}// 주간 worst 상품
				$('.best_prod').html(htmlbp);// 주간 best 상품
				$('.worst_prod').html(htmlwp);// 주간 worst 상품
			}//else if(bbbb)?
		},//success
		error: function() { alert("오류"); }
	});//ajax
	
}//bestworst


// 제외한 상품 미리보기
function preview_prod(compcd) {
	$.ajax({
		url: "preview_prod.do",
		data: { "compcd":compcd },
		success: function(result) {
			console.log('제외상품 미리보기',result);
			
			var count = result.data.length;
			console.log(count);
			
			let html = '';
			var arr = result.data;
			
			for(var i = 0; i < count; i++) {
				html += "<tr>"
				html +=		"<td>"+arr[i].productcd+"</td>"
				html +=		"<td>"+arr[i].productname+"</td>"
				html +=		"<td>"+arr[i].maker+"</td>"
				if(arr[i].unit == '' && arr[i].spec != '') {
					html +=		"<td>"+arr[i].spec+"</td>"
				} else if(arr[i].unit == '' && arr[i].spec == '') {
					html +=		"<td>-</td>"
				} else {
					html +=		"<td>"+arr[i].spec+"("+arr[i].unit+")</td>"
				}
				html +=		"<td><i class='fa-solid fa-xmark' name='xmarkPre'></i></td>"
				html +=		"<td style='display: none;'>"+arr[i].productid+"</td>"
				html += "</tr>"
			}
			$('.regi_sel').append(html);
			
		},
		error: function() { alert("오류"); }
	});
}

// 제외상품관리 검색 리스트 
function prod_except(compcd, search4, searchInput2) {
	if(searchInput2.length < 3) {
		swal({title: "3자리 이상 입력하세요.", button: "확인"})
		.then(function() {
			swal.close(); 
			$('[name=searchInput2]').focus();
			return false;
		})
	} else {
		$.ajax({
			url: "smain_regiList.do",
			data: {
				"compcd":compcd,
				"search4":search4,
				"searchInput2":searchInput2
			},
			success: function(result) {
				console.log('상품추가 리스트',result);
				
				let html = "";
				const count = result.data.length;
				
				if(count == 0) {
					swal({title: "데이터가 없습니다.", button: "확인"})
					.then(function() {
						swal.close(); 
						$('[name=searchInput2]').val('');
						return false;
					})
				}
				
				if(count > 0) {
					for(var i = 0; i < count; i++) {
						html += "<tr>"
						html +=		"<td>"+result.data[i].productcd+"</td>"
						html +=		"<td>"+result.data[i].productname+"</td>"
						html +=		"<td>"+result.data[i].maker+"</td>"
						html +=		"<td>"+result.data[i].spec+"</td>"
						html +=		"<td><div class='custom-control custom-checkbox'><input id='magicBtn"+(i+1)+"' type='checkbox'"
						html +=			"class='custom-control-input' name='regiChk'><label class='custom-control-label'"
						html +=					"for='magicBtn"+(i+1)+"'></label></div></td>"
						html +=		"<td style='display:none;'>"+result.data[i].unit+"</td>"
						html +=		"<td style='display:none;'>"+result.data[i].productid+"</td>"
						html += "</tr>"
					}//for
				}//if
				$('.regi_list').html(html);	
			},
			error: function() { alert("오류"); }
		});//ajax
	}//else
}//prod_except

//상품선택 후 화살표 클릭하면 배열로 받기
$(document).on('click','#addListBtn', function() {
	var chkProd = [];
	var chk = {};
	
	$('input:checkbox[name=regiChk]').each(function(i) {
		if($(this).is(":checked") == true) {
			var productcd = $(this).parent().parent().parent().children("td:eq(0)").text();
			var productname = $(this).parent().parent().parent().children("td:eq(1)").text();
			var maker = $(this).parent().parent().parent().children("td:eq(2)").text();
			var spec = $(this).parent().parent().parent().children("td:eq(3)").text();
			var unit = $(this).parent().parent().parent().children("td:eq(5)").text();
			var productid = $(this).parent().parent().parent().children("td:eq(6)").text();
			
			var chk = {"productcd":productcd, "productname":productname
			, "maker":maker, "spec":spec, "unit":unit, "productid":productid};
			chkProd.push(chk);
		}//if
	});//each
	console.log(chkProd);
	regi_sel(chkProd);
	$('input:checkbox[name=regiChk]').prop('checked', false);
});// 상품선택 후 화살표 클릭하면 배열로 받기

//선택된 상품 리스트 뿌리기
function regi_sel(arr) {
	let html;
	const count = arr.length;
	
	if(count > 0) {
		for(var i = 0; i < count; i++) {
			html += "<tr>"
			html +=		"<td>"+arr[i].productcd+"</td>"
			html +=		"<td>"+arr[i].productname+"</td>"
			html +=		"<td>"+arr[i].maker+"</td>"
			if(arr[i].unit == '' && arr[i].spec != '') {
				html +=		"<td>"+arr[i].spec+"</td>"
			} else if(arr[i].unit == '' && arr[i].spec == '') {
				html +=		"<td>-</td>"
			} else {
				html +=		"<td>"+arr[i].spec+"("+arr[i].unit+")</td>"
			}
			html +=		"<td><i class='fa-solid fa-xmark' name='xmark'></i></td>"
			html +=		"<td style='display: none;'>"+arr[i].productid+"</td>"
			html += "</tr>"
		}//for
	}//if
	$('.regi_sel').append(html);
}// 선택된 상품 리스트 뿌리기

//선택완료 버튼
$(document).on('click', '#selBtn', function(){
	var compcd = $('#compcd').val();
	var count1 = $('.regi_sel').children('tr').length;//제외할 상품 선택한 갯수
	var count2 = $('[name=removePre]').length;// 제외 취소한 상품 갯수
	console.log(count2);
	
	// 제외할 상품 대상
	if(count1 == 0) {// 선택한 상품이 없을 경우
		swal({
			title: '저장하시겠습니까?',
			icon: 'info',
			buttons: true,
			imfoMode: true,
			buttons: ["취소", "확인"]
		}).then(function(willDelete) {
			if(willDelete) {
				$.ajax({// 다 삭제하깅
					url: "all_remove.do",
					data: {
						"compcd":compcd
					},
					success: function(result) {
						swal({
							title: '저장이 완료되었습니다.',
							type: 'success',
							icon: "success",
							button: "확인"
						}).then(function(willDelete) {
							location.href = "/smain.do";
						});
					}, 
					error: function() { alert("오류"); }
				});//ajax
			}//if(willDelete)
		});//swal then
	}
	
	if(count1 > 0) {
		var selProd = [];
		var prod = {};
		
		for(var i = 0; i < count1; i++) {
			var productid = $('.regi_sel').children('tr:eq('+i+')').children('td:eq(5)').text();
			selProd.push(productid); // 배열에 추가
		}//for(i)
		console.log(selProd);
		except(compcd, selProd);
		
		// 제외 취소할 상품 대상
		if(count2 > 0) {// 취소한 상품이 있을 경우
			var rp = [];
			
			for(var i = 0; i < count2; i++) {
				var removePre = $('[name=removePre]').eq(i).val();
				rp.push(removePre);
			}
			console.log(rp);
			
			$.ajax({
				url: "remove_pre.do",
				data: {
					"compcd":compcd,
					"productid":JSON.stringify(rp)
				},
				success: function(result) {
					console.log(result);
				},
				error: function() { alert("오류"); }
			});//ajax
		}//제외 취소할 상품
	
	}//if
});// 선택완료 버튼

// 제외
function except(compcd, selProd) {
	swal({
		title: '저장하시겠습니까?',
		icon: 'info',
		buttons: true,
		imfoMode: true,
		buttons: ["취소", "확인"]
	}).then(function(willDelete) {
		if(willDelete) {
			$.ajax({
				url: "prod_except.do",
				data: {
					"compcd":compcd,
					"productid":JSON.stringify(selProd)
				},
				success: function(result) {
					console.log("제외한 상품 db에 추가 완료!");
					swal({
						title: '저장이 완료되었습니다.',
						type: 'success',
						icon: "success",
						button: "확인"
					}).then(function(willDelete) {
						location.href = "/smain.do";
					});
				}, 
				error: function() { alert("오류"); }
			});//ajax
		}//if(willDelete)
	});//swal then
}// 제외

//xmark 클릭하면 없애기
$(document).on('click', '[name=xmark]', function(){
	$(this).parent().parent().remove();
});// xmark 클릭하면 없애기

//xmark 클릭하면 없애기(제외된 상품 미리보기 db에 있는 상품)
$(document).on('click', '[name=xmarkPre]', function(){
	var test = $(this).parent().parent().children().eq(5).text();// 제외취소한 상품 id
	$(this).parent().parent().remove();// 행 지우기
	$('.pop-cont').append('<input type="hidden" value="'+test+'" name="removePre">');
});// xmark 클릭하면 없애기(제외된 상품 미리보기 db에 있는 상품)

// 제외상품관리 모달창
$('.option').click(function() {
	$(".modal-wrap1").css({"display": "flex"});//모달창 열기
	var compcd = $('#compcd').val();
	preview_prod(compcd);// 제외된 상품 띄우기
});
$(".pop-close1").click(function(){
	$(".modal-wrap1").css({"display": "none"});//모달창 닫기
	$(".regi_sel").children('tr').remove();
	$("[name=searchInput2]").val('');
});

function enterkey() {
	if(window.event.keyCode == 13) {
		$('#searchBtn2').click();
	}
}// 엔터키 발생 이벤트

//천단위 콤마 찍기
function numWithCommas(x) {
	return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



