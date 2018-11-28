//点击样式
function change(obj) {
    $(obj).addClass('navactive').siblings('li').removeClass('navactive')
}
$(document).ready(function() {
    // 渲染最新动态
    //获取用户名
    var userId = $.cookie('userId');
    //获取资源令牌
    var userToken = $.cookie('userToken');
    $('.purchaseDoc').hide();
    $.ajax({
        url: dataUrl,
        type: "post",
        dataType: "json",
        data: {
            api: "get.workIndex", //接口名
            apiVersion: "v1", //接口版本
            userId: userId, //用户名
            userToken: userToken //资源令牌
        },
        success: function(data) {
            var data = data.data

            if(data.isShow.purchaseDoc == 1) {
                $('.purchaseDoc').show();
            } //控制采购档案的跳转
        },
        error: function(data) {
            console.log("失败");
        }
    })
});