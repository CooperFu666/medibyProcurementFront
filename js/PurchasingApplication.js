//引入页头、页脚、导航
$('#header').load('../html/header.html');
$('#nav').load('../html/nav.html');
$('#footer').load('../html/footer.html');
$('#change_password').load('../html/changePassword.html');

$('.screening li input').click(function () {
    var spanColor =$(this).siblings('span').css('color');
    spanColor=='rgb(144, 144, 144)'? $(this).siblings('span').css({'color':'rgb(96, 182, 255)'}): $(this).siblings('span').css({'color':'rgb(144, 144, 144)'})
});
new Vue({
    el: '#app',
    data: function() {
        return {
            value1: '',
            value2:''
        }
    }
});
