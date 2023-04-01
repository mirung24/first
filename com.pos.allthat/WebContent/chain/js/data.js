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
	if (scTop > 1) {
		$('.table thead th').css("box-shadow", "inset 0 -1px 0 #eee");
	} else {
		$('.table thead th').css("box-shadow", "none");
	}
}