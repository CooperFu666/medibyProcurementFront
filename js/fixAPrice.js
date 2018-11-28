//引入页头、页脚、导航
$('#header').load('../html/header.html');
$('#nav').load('../html/nav.html');
$('#footer').load('../html/footer.html');
$('#change_password').load('../html/changePassword.html');



$('.seeResearch,.submit').click(function () {
    $('.report_alert').css({'display':'block'})
})
$('.fork').click(function () {
    $('.report_alert').css({'display':'none'})
})

$('.screening li input').click(function () {
    var spanColor =$(this).siblings('span').css('color');
    spanColor=='rgb(144, 144, 144)'? $(this).siblings('span').css({'color':'rgb(96, 182, 255)'}): $(this).siblings('span').css({'color':'rgb(144, 144, 144)'})
});

// 选择调研范围
$('.scope').change(function () {
    var scope = $(this).val();
    if(scope==2){
        $('#foreign').css({'display':'block'});
        $('#domestic').css({'display':'block'});
    }else if(scope==0){
        $('#foreign').css({'display':'none'});
        $('#domestic').css({'display':'block'});
    }else{
        $('#domestic').css({'display':'none'});
        $('#foreign').css({'display':'block'});
    }

});