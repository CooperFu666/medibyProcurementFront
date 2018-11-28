//引入页头、页脚、导航
$('#header').load('../html/header.html');
$('#nav').load('../html/nav.html');
$('#footer').load('../html/footer.html');


//获取用户名
var userId = $.cookie('userId');
//获取资源令牌
var userToken = $.cookie('userToken');
//获取procurementId
PoId = window.location.href.split("&")[1];
procurementId = PoId.split("=")[1];
// 封装查看调研数组转换
function _for(arr) {
    var yemei = [];

    for(var i = 0; i < arr.length; i++) {
        obj = [{
            'name': arr[i].nickname,
            'type': arr[i].type
        }];
        if(yemei.length == 0) {
            yemei.push(obj);
        } else {
            for(var ii = 0; ii < yemei.length; ii++) {
                if(yemei[ii][0].name == arr[i].nickname && yemei[ii][0].type == arr[i].type) {
                    break;
                } else {
                    yemei.push(obj);
                    break;
                }
            }
        }
    }
    return yemei;
};
// 点击继续
$('.Continue').click(function () {
    $.ajax({
        url: dataUrl,
        type: "post",
        dataType: "json",
        data: {
            api: "re.researchEnd", //接口名
            apiVersion: "v1", //接口版本
            procurementId: procurementId,
            userId: userId, //用户名
            userToken: userToken //资源令牌
        },
        success: function (data) {
            console.log(data.data.flag)
        }, error: function (data) {
            console.log("失败")
        }
    })
});
// 点击直接归档
$('.Reinvestigation').click(function () {
    $.ajax({
        url: dataUrl,
        type: "post",
        dataType: "json",
        data: {
            api: "purchase.finish", //接口名
            apiVersion: "v1", //接口版本
            procurementId: procurementId,
            userId: userId, //用户名
            userToken: userToken //资源令牌
        },
        success: function (data) {
            console.log(data.data.flag)
            if(data.data.flag ==1){
                window.location.href = './workbench.html'
            }else {
            	$.Pop('归档失败',{BoxBg:false},'alert')
            }
        }, error: function (data) {
            console.log("失败")
        }
    })
});
// 关闭弹出框
$('.fork').click(function () {
    $('.report_alert').css({'display':'none'})
})

// 渲染主页页面
$(document).ready(function () {
    $.ajax({
        url: dataUrl,
        type: "post",
        dataType: "json",
        data: {
            api: "get.purchaseReport", //接口名
            apiVersion: "v1", //接口版本
            procurementId:procurementId,
            userId: userId, //用户名
            userToken: userToken //资源令牌
        },
        success: function (data) {
            var data = data.data
            console.log(data)
            $('.purchaseTitle').text(data.purchaseTitle);
            $('.purchaseItemNumber').text(data.purchaseItemNumber);
            $('.purchaseEndTime').text(data.purchaseEndTime);
            $('.purchasePrincipal').text(data.purchasePrincipal);
            $('.textarea').text(data.purchaseRemark);
            $('.purchaseSubmitter').text(data.purchaseSubmitter);
            $('.purchaseSubmitterTime').text(data.purchaseSubmitterTime);
            $('.level').text(data.level);
            $('.researchSubmitter').text(data.researchSubmitter);
            $('.researchTime').text(data.researchTime);
            $('.purchasePeople').text(data.purchasePeople);
            $('.purchaseTime').text(data.purchaseTime);
            $('.purchaseResultDesc').text(data.purchaseResultDesc);
        }, error: function (data) {
            console.log("失败")
        }
    })
});


// 查看调研
$(".see_research").click(function() {
    $('.report_alert').css({'display':'block'});
    $('.box_title h2').text($(this).text());
    $.ajax({
        url: dataUrl,
        type: "post",
        dataType: "json",
        data: {
            api: "get.research", //接口名
            apiVersion: "v1", //接口版本
            procurementId: 12, //采购申请id
            userId: userId, //用户名
            userToken: userToken //资源令牌
        },
        success: function(data) {
            console.log(data)
            var html = '';
            var barMain = '';
            var typeNickname = '';
            var yemei = _for(data.data[0].researchList)
            for(var aa = 0; aa < yemei.length; aa++) {
                if(yemei[aa][0].type == 0) {
                    type = "国内"
                } else if(type == 1) {
                    type = "国外"
                }
                typeNickname += "<span class='w_280 text_left'>" + type + "价格（<i>" + yemei[aa][0].name + "</i>）</span>"
            }
            for(var i = 0; i < data.data.length; i++) {
                var brandTitle = data.data[i].brandTitle; //品牌名
                var commodityId = data.data[i].commodityId; //商品id
                var modelTitle = data.data[i].brandTitle; //型号
                var commodityTitle = data.data[i].commodityTitle; //商品名称
                var commodityTitleEnglish = data.data[i].commodityTitleEnglish; //商品名称（英文）
                var number = data.data[i].number; //数量
                var unit = data.data[i].unit; //规格
                var isRegister = data.data[i].isRegister; //是否注册
                var targetTaxPrice = data.data[i].targetTaxPrice; //目标含税价
                var targetNoTaxPrice = data.data[i].targetNoTaxPrice; //目标不含税价
                var suggestQuantity = data.data[i].suggestQuantity; //建议采购量
                var researchList = data.data[i].researchList; //供应商，价格
                var realList = data.data[i].realList; //实际采购量

                html += "<tr class='tr_list' id='" + commodityId + "'><td class='ver_mid ver_bor'><span class='w_90'>" + brandTitle + "</span><span class='w_120'>" + modelTitle + "</span><span class='w_150'>" + commodityTitle + "</span><span class='w_108'>" + commodityTitleEnglish + "</span><span class='w_72'>" + number + "</span><span class='w_92'>" + unit + "</span><span class='w_74' style='width:94px'>" + isRegister + "</span></td><td class='bar_bor'>"

                for(var a = 0; a < yemei.length; a++) {
                    html += "<span class='w_280 text_left'><p class='bar_bor_nav'><i>供应商</i><i>含税价</i><i>不含税价</i></p>"

                    for(var r = 0; r < researchList.length; r++) {
                        var company = researchList[r].company; //供应商
                        var taxPrice = researchList[r].taxPrice; //含税价
                        var noTaxPrice = researchList[r].noTaxPrice; //不含税价
                        var type = researchList[r].type; //0国内1国外
                        var nickname = researchList[r].nickname; //调研者用户名

                        if(type == yemei[a][0].type && nickname == yemei[a][0].name) {
                            html += "<p class='bar_bor_list'><i>" + company + "</i><i>" + taxPrice + "</i><i>" + noTaxPrice + "</i></p>"
                        }
                    }
                    html += "</span>";
                }

                html += "</td><td class='ver_mid ver_price'><span class='w_280'><p class='bar_bor_nav ar_bor_nav_price'><i>含税价</i><i class='w_140'>不含税价</i></p><p class='bar_bor_list'><i>" + targetTaxPrice + "</i><i class='w_140'>" + targetNoTaxPrice + "</i></p></span></td><td class='ver_mid sugQ'><span class='w_140'><p class='bar_bor_nav ar_bor_nav_price'><i>建议采购量</i></p><p class='bar_bor_list' style='width: 280px;'><i class='suggestQuantity'>" + suggestQuantity + "</i></p></span></td><td class='ver_mid barMain' style='background: #f5fbfe;'>"

                html += "<span style='width: 560px'><p class='bar_bor_nav ar_bor_nav_price'><i>供应商</i><i class='w_140'>单价</i><i class='w_140'>数量</i><i class='w_140' style='display: inline-block;'>小计</i></p>"

                for(var rt = 0; rt < realList.length; rt++) {
                    var isTax = realList[rt].isTax; //是否含税
                    var realCompany = realList[rt].realCompany; //公司名
                    var realNumber = realList[rt].realNumber; //数量
                    var subtotal = realList[rt].subtotal; //小计
                    var realPrice = realList[rt].realPrice; //金额
                    if(isTax == 0) {
                        isTax = "不含税"
                    } else if(isTax == 1) {
                        isTax = "含税"
                    }
                    html += "<p class='bar_bor_list'><i>" + realCompany + "</i><i class='w_140'>" + realPrice + "（" + isTax + "）</i><i class='w_140'>" + realNumber + "</i><i class='w_140' style='display: inline-block;'>" + subtotal + "</i></p>"
                }
                html += "</span>";

                html += "</td></tr>"

            }
            $(".box_list").html(html);
            $(".typeNickname").html(typeNickname);

        },
        error: function(data) {
            console.log("失败")
        }
    });
});

