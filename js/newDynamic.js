//引入页头、页脚、导航
$('#header').load('../html/header.html');
$('#nav').load('../html/nav.html');
$('#footer').load('../html/footer.html');
$('#change_password').load('../html/changePassword.html');

var pageNumber =1;
var userId = $.cookie('userId');
//获取资源令牌
var userToken = $.cookie('userToken');

// 封装数据拉起
function getData(pageNumber) {
    $.ajax({
        url: dataUrl,
        type: "post",
        dataType: "json",
        data: {
            api: "index.news", //接口名
            apiVersion: "v1", //接口版本
            userId:userId,
            page:pageNumber,
            userToken: userToken //资源令牌
        },
        success: function(data) {
            var data = data.data;
            $('.pageNum').text(data.pageNum)
            $('.totalRecord').text(data.totalRecord)
            $('.pageSize').text(data.pageSize)
            var html = ''
            for(var i =0;i<data.list.length;i++){
                html+= '<tr>' +
                    '<td>' +
                    '<img src="../images/project.gif" alt="">' +
                    '<span  class="look_at" procurementId='+data.list[i].procurementId+'  status ='+data.list[i].status+'>'+data.list[i].str+'</span>' +
                    '</td>' +
                    '<td>'+data.list[i].time+' </td>' +
                    '<td>' +
                    '<button  class="look_at" procurementId='+data.list[i].procurementId+'  status ='+data.list[i].status+'>查看</button>' +
                    '</td>' +
                    '</tr>'
            }
            if(data.list.length==0){
            	$.Pop('当前已经是最后一页',{BoxBg:false},'alert')
            }else {
                $('.project_table').html('<tr>' +
                    '<th width="40%">项目名称</th>' +
                    '<th>时间</th>' +
                    '<th width="12%">操作</th>' +
                    '</tr>'+html)
            }
        }, error: function(data) {
            console.log("失败")
        }
    })
}
// 第一次进入读取
$(document).ready(function () {
    $.ajax({
        url: dataUrl,
        type: "post",
        dataType: "json",
        data: {
            api: "index.news", //接口名
            apiVersion: "v1", //接口版本
            page:1,
            userId: userId, //用户名
            userToken: userToken //资源令牌
        },
        success: function(data) {
            console.log(data)
            var data = data.data;
            $('.pageNum').text(data.pageNum)
            $('.totalRecord').text(data.totalRecord)
            $('.pageSize').text(data.pageSize)
            if(data.pageNum ==1){
                $('.check_page').css({'display':'none'})
            }
            var html = ''
            for(var i =0;i<data.list.length;i++){
                html+= '<tr>' +
                    '<td>' +
                        '<img src="../images/project.gif" alt="">' +
                        '<span class="look_at" procurementId='+data.list[i].procurementId+'  status ='+data.list[i].status+'>'+data.list[i].str+'</span>' +
                    '</td>' +
                    '<td>'+data.list[i].time+' </td>' +
                    '<td>' +
                        '<button class="look_at" procurementId='+data.list[i].procurementId+'  status ='+data.list[i].status+'>查看</button>' +
                    '</td>' +
                    '</tr>'
            }
            if(data.list.length==0){
                $('.check_page').css({'display':'none'})
                $('.project_table').html('<tr>' +
                        '<th width="40%">项目名称</th>' +
                        '<th>时间</th>' +
                        '<th width="12%">操作</th>' +
                    '</tr>' +
                    '<tr class="none_todo_box">' +
                        '<td colspan="3">' +
                        '<div class="none_todo">' +
                            '<img src="../images/newDynamic.gif" alt="">' +
                            '<h2>没有更多动态...</h2>' +
                        '</div>' +
                        '</td>' +
                    '</tr>')
            }else {
                $('.project_table').html('<tr>' +
                    '<th width="40%">项目名称</th>' +
                    '<th>时间</th>' +
                    '<th width="12%">操作</th>' +
                    '</tr>'+html)
            }
        }, error: function(data) {
            console.log("失败")
        }
    })
});

$('.next_page').click(function () {
    var pageNum = parseInt($('.pageNum').eq(0).text());//获取总页数
        pageNumber+=1
    if(pageNumber == pageNum){
        $('.next_page').addClass('active')//控制下一页显示
    }
        getData(pageNumber)
});
$('.pre_page').click(function () {
    if(pageNumber>1){
        pageNumber-=1
        getData(pageNumber)
        $('.next_page').removeClass('active')
    }

});
$('.sure_local').click(function () {
    var pageNum = parseInt($('.pageNum').eq(0).text());//获取总页数
    pageNumber = parseInt($('.write_number').val());//获取输入页数
    console.log(pageNumber)
    if(pageNumber == 0){
        pageNumber = 1//控制输入0
    }
    if(pageNumber>pageNum){
        pageNumber = pageNum//控制输入跳转
    }
    if(pageNumber == pageNum){
        $('.next_page').addClass('active')//控制下一页显示
    }
    getData(pageNumber)
});

//            点击处理后跳转
$('body').on('click','.look_at',function () {
    var procurementId = $(this).attr('procurementId');
    var status = $(this).attr('status');
    console.log(procurementId)
    console.log(status)
    var address;
    if(status == 0){
        address = './demandManagement.html'
    }else if(status == 1){
        address = './researchReport.html'
    }else if(status == 2){
        address = './fixAPrice.html'
    }else if(status == 3){
        address = './toPurchase.html'
    }else if(status == 4){
        address = './PurchaseReport.html'
    }else if(status == 5){
//                    address = './toContinue.html'
    }else if(status == 6){
        address = './ProjectDetails.html'
    }else if(status == 7){
        address = './ProjectDetails.html'
    }
    window.location.href = address+'?id='+status+'&procurementId='+procurementId;
});