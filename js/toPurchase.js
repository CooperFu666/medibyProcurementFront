//引入页头、页脚、导航
$('#header').load('../html/header.html');
$('#nav').load('../html/nav.html');
$('#footer').load('../html/footer.html');
$('#change_password').load('../html/changePassword.html');

$('.fork').click(function () {
    $('.report_alert').css({'display':'none'})
})
$('.see_research').click(function () {
    $('.report_alert') .css({'display':'block'})
    $('.box_title>h2').text($(this).text())
});
$(".move_num").click(function () {
	$('.report_alert') .css({'display':'block'})
});
$(".box_operate_no").click(function () {
	$('.report_alert').css({'display':'none'})
});
