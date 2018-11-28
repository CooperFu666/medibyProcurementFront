//引入页头、页脚、导航
$('#header').load('../html/header.html');
$('#nav').load('../html/nav.html');
$('#footer').load('../html/footer.html');
$('#change_password').load('../html/changePassword.html');



var userId = $.cookie('userId');
//获取资源令牌
var userToken = $.cookie('userToken');
//假ID
C1=window.location.href.split("&")[1]; //得到'procurementId'=procurementId
var procurementId = C1.split("=")[1];//得到procurementId



$('body').on('click','.fork',function () {
    $('.report_alert_write').hide();
    $('.report_alert').hide();
})

$('.To_withdraw').click(function () {
   $('.report_alert').hide();
   $('.alert_box').show();
});

$('.withdraw_notice').click(function () {
    $('.withdraw_box').hide();
    window.location.reload()
});
$('.withdraw_cancel').click(function () {
    $('.report_alert').hide();
});
$('.no_research_cancel').click(function () {
    $('.alert_box').hide();
});
$('.perform_cancel').click(function () {
    $('.no_perform_box').hide();
});


$('.sure').click(function () {
    $('.successful_submission').hide();
    window.location.href = './workbench.html'
});
Array.prototype.distinct = function(){
    var arr = this,
        result = [],
        i,
        j,
        len = arr.length;
    for(i = 0; i < len; i++){
        for(j = i + 1; j < len; j++){
            if(arr[i] === arr[j]){
                j = ++i;
            }
        }
        result.push(arr[i]);
    }
    return result;
}

// 解决 重复的算法
function _for(arr) {
    var yemei = [];
    for(var ii = 0; ii < arr.length; ii++) {
        yemei.push(arr[ii].type);
    }
    yemei = yemei.distinct()
    return yemei;
};


// 填写完毕提交调研报告
$('body').on('click','.Successful',function () {
    var commodityList = [];
    var isSave;
    var researchListAll = $("#myFrom").serializeArray();
    //console.log(researchListAll)

    // 添加所有数据
    for(var i = 0; i<$('.write_mid').length;i++){
        var obj ={}
        var commodityId = parseInt($('.write_mid:eq('+i+')').find('.w_90').attr('commodityId'));
        obj.commodityId = commodityId;
        obj.commodityTitle = $('.write_mid:eq('+i+')').find('.w_150').text();
        obj.commodityTitleEnglish =$('.write_mid:eq('+i+')').find('.w_109').text();
        obj.unit =$('.write_mid:eq('+i+')').find('.ww_108').text();
        obj.isRegister =$('.write_mid:eq('+i+')').find('.projectUnit').text();
        if(obj.isRegister == '有'){
            obj.isRegister = 1
        }else if(obj.isRegister == '无'){
            obj.isRegister = 0
        }else {
            obj.isRegister = 2
        }
        obj.researchList =[];
        var give_companyArray = [];
        var notTax_priceArray = [];
        var tax_priceArray = [];
        var type_Array = [];
        for(var a=0;a<researchListAll.length;a++){
            if(researchListAll[a].name=="give_company_"+commodityId){
                give_companyArray.push(researchListAll[a].value)
            }
            if(researchListAll[a].name=="notTax_price_"+commodityId){
                notTax_priceArray.push(researchListAll[a].value)
            }
            if(researchListAll[a].name=="tax_price_"+commodityId){
                tax_priceArray.push(researchListAll[a].value)
            }
            if(researchListAll[a].name=="give_type_"+commodityId){
                type_Array.push(researchListAll[a].value)
            }
        }

        for(var b=0;b<give_companyArray.length;b++){
            notTax_priceArray[b]= notTax_priceArray[b]== ''?null: notTax_priceArray[b];
            tax_priceArray[b]= tax_priceArray[b]== ''?null: tax_priceArray[b];
            obj.researchList[b] = {"company":give_companyArray[b],"noTaxPrice":notTax_priceArray[b],"taxPrice":tax_priceArray[b],"type":type_Array[b]};
        }
        obj.stopRemark ='';
        commodityList.push(obj)
    }
    if($(this).text() == '保存' ){
        isSave = 0
    }else {
        isSave = 1
    }
    $('.report_alert_write').css({'display':'none'});
    // 限制提交
    if(isSave == 1){
        for(var i = 0 ;i<commodityList.length;i++){
            if(commodityList[i].isRegister === '' ||commodityList[i].unit == ''){
                $.Pop('请填写完必填项',{BoxBg:false},'alert')
                return false
            }else if(commodityList[i].isRegister == 2){
                $.Pop('请选择有无图片',{BoxBg:false},'alert')
                return false
            }
            for(var j = 0;j<commodityList[i].researchList.length; j++){
                var researchList = commodityList[i].researchList
                if(researchList[j].company === ''){
                    $.Pop('请填写公司名',{BoxBg:false},'alert')
                    return false
                }else if(researchList[j].noTaxPrice == null && researchList[j]. taxPrice == null){
                    $.Pop('含税价、不含税价，其中一项为必填项',{BoxBg:false},'alert')
                    return false
                }
            }
        }
    }
    $.ajax({
        url: dataUrl,
        type: "post",
        dataType: "json",
        data: {
            action:isSave,//0保存 1提交
            api:"run.researchReport", //接口名
            apiVersion:"v1", //接口版本
            commodityList:JSON.stringify(commodityList),//用户提交的内容
            procurementId:procurementId,
            userId: userId, //用户名
            userToken: userToken,//资源令牌
        },
        success: function(data) {
            if(data.code != 200){
            	$.Pop(data.message,{BoxBg:false},'alert')
            }
            if(data.data.flag == 1){
                if(isSave == 0){
                    $('.notice_content p').text('已经成功保存调研报告了哦~');
                    $('.successful_submission').css({'display':'block'})
                }else {
                    $('.notice_content p').text('已经成功提交调研报告了哦~');
                    $('.successful_submission').css({'display':'block'})
                }
            }else {
            	$.Pop('失败',{BoxBg:false},'alert')
            }
        }, error: function(data) {
            console.log("失败")
        }
    })
})




// 增加输入框
$("body").on("click", ".box_add", function(){
    var datacommodityId = $(this).attr("data-id");
    var datatype = $(this).attr("data-type");
    $(this).parent().parent().before('<tr class="w_610 pad_bot"> ' +
        '<td  class="inp_box">' +
        ' <div style="width: 230px;"> ' +
        '<a>单位</a> ' +
        '<input type="hidden" name="give_type_'+datacommodityId+'" value="'+datatype+'">'+
        '<input type="text" name="give_company_'+datacommodityId+'" style="width: 230px;">'+
        '</div>' +
        '</td> ' +
        '<td class="inp_box">' +
        '<div  style="width: 120px;">' +
        '<a>价格</a> ' +
        '<input type="text"  name="tax_price_'+datacommodityId+'" style="width: 120px;"> ' +
        //'<input type="text" placeholder="1000.00" style="width: 120px;" name="tax_price_1"> ' +
        '</div> ' +
        '</td> ' +
        '<td  class="inp_box">' +
        '<div style="width: 120px;">' +
        '<a>价格</a>' +
        ' <input type="text"  name="notTax_price_'+datacommodityId+'" style="width: 120px;"> ' +
        //' <input type="text" placeholder="1000.00" style="width: 120px;" name="notTax_price_1"> ' +
        '</div> ' +
        '</td> ' +
        '<td  class="inp_box">' +
        '<div>' +
        '<img src="../images/Pack.gif" alt="" class="Pack_up">' +
        '</div> ' +
        '</td>'+
        '</tr>')
});


// 页面加载时数据
var isHave;
$(function () {
    $(document).ready(function() {
        $.ajax({
            url: dataUrl,
            type: "post",
            dataType: "json",
            data: {
                api: "get.purchaseCommodity", //接口名
                apiVersion: "v1", //接口版本
                procurementId:procurementId,//假ID
                userId: userId, //用户名
                userToken: userToken //资源令牌
            },
            success: function(data) {
                console.log(data)
                var isResearch = data.data.isResearch;
                // 隐藏不执行按钮
                if(data.data.commodityList[0].researchList.length == 0){
                    var researchScope =  data.data.researchScope
                    if(researchScope == 1){
                        var yemei =[0];
                    }else if(researchScope == 2){
                        var yemei =[1];
                    }else {
                        var yemei =[0,1];
                    }
                }else{
                    var yemei = _for(data.data.commodityList[0].researchList);
                }
                var box_operate_html = isResearch == 1?'<button class="withdraw_research">撤回调研报告</button><button class="fork">取消</button>':'<button class="Successful">提交调研报告</button><button class="Successful">保存</button><button class="fork">取消</button>';
                $(".box_operate").html(box_operate_html);


                var commodityList = data.data.commodityList;

                var html = '';//采纳的表格内容
                var html1 ='';//不采纳的表格内容
                var writeBody; //填写调研报告的内容部分
                // 填写写调研报告的头部
                var writeHeader = ' <tr>' +
                    '<td>' +
                    '<div class="weitre">' +
                    '<span class="w_90">品牌</span>' +
                    '<span class="w_120">型号</span>' +
                    '<span class="w_120">数量</span>' +
                    '<span class="w_150">中文名</span>' +
                    '<span class="w_108">英文名</span>'+
                    '<span class="w_108">规格/包装</span>'+
                    '<span class="w_108">注册证</span>'+
                    '</div>' +
                    '</td>';
                for($i=0;$i<yemei.length;$i++){
                    $typeName = yemei[$i]==0?"国内价格":"国外价格";
                    writeHeader +='<td>' +
                        '<span class="w_610">'+$typeName+'</span>' +
                        '</td>';
                }



                    writeHeader += '</tr>'

                // 采纳表头
                var htmlHeader = ' <tr>' +
                    '<th>品牌</th>' +
                    '<th>型号</th>' +
                    '<th>数量</th>' +
                    '<th>中文名</th>' +
                    '<th>英文名称</th>' +
                    '<th>规格/包装</th>' +
                    '<th>注册证</th>' +
                    '<th class="isShow">调研报告</th>' +
                    '<th width="10%" class="operation">操作</th>' +
                    '</tr>'
                // 不采纳表头
                var htmlHeader1='<tr>' +
                    '<th>品牌</th>' +
                    '<th>型号</th>' +
                    '<th>中文名</th>' +
                    '<th>英文名称</th>' +
                    '<th>不采购理由</th>' +
                    '<th class="edit">编辑</th>' +
                    '</tr>'
                $('.priority').text(data.data.level);//优先级
                $('.procurementSubmitterTime').text(data.data.purchaseSubmitterTime);//采购
                $('.procurementSubmitterUser').text(data.data.purchaseSubmitter);
                $('.textarea').text(data.data.purchaseRemark);//采购原由
                $('.purchaseTitle').text(data.data.purchaseTitle);//项目名称
                $('.purchaseItemNumber').text(data.data.purchaseItemNumber);//采购编号
                $('.purchaseEndTime').text(data.data.purchaseEndTime);//采购截止时间
                $('.purchasePrincipal').text(data.data.purchasePrincipal);
                // 渲染填写调研报告

                        for(var i = 0; i < commodityList.length; i++) {
                            var photo;
                            if(commodityList[i].isRegister == 0){
                                photo = '无'
                            }else if(commodityList[i].isRegister == 1){
                                photo = '有'
                            }else {
                                photo = ''
                            }
                            var brandTitle = commodityList[i].brandTitle; //品牌名
                            var modelTitle = commodityList[i].modelTitle; //型号
                            var applyPurchaseQuantity = commodityList[i].applyPurchaseQuantity;
                            var commodityTitle = commodityList[i].commodityTitle; //商品名称
                            var commodityTitleEnglish = commodityList[i].commodityTitleEnglish; //商品名称（英文）
                            var isRegister = commodityList[i].isRegister; //是否注册
                            var unit = commodityList[i].unit; //供应商，价格
                            var isPurchase = commodityList[i].isPurchase; //是否采购

                            if(isPurchase == 1){
                                writeBody += '<tr style="border-bottom: 20px solid #f7f7f7;">' +
                                    '<td class="ver_mid ver_bor write_mid">' +
                                    '<span class="w_90" commodityId = '+commodityList[i].commodityId+'>'+brandTitle+'</span>'+
                                    '<span class="w_120">'+modelTitle+'</span>'+
                                    '<span class="w_120">'+applyPurchaseQuantity+'</span>'+
                                    '<span class="w_150 ww_150">'+commodityTitle+'</span>'+
                                    '<span class="w_108 w_109">'+commodityTitleEnglish+'</span>'+
                                    '<span class="w_108 ww_108">'+photo+'</span>'+
                                    '<span class="w_108 projectUnit">'+unit+'</span>'
                                '</td>';
                                for($i=0;$i<yemei.length;$i++){
                                    writeBody +='<td class="bar_bor" style="vertical-align:baseline">'+
                                        '<table class="domestic_price"  width="100%">' +
                                        '<tr class="tr_header">'+
                                        '<td width="260px">' +
                                        '<p>供应商</p>' +
                                        '</td>' +
                                        '<td>' +
                                        '<p>含税价</p>' +
                                        '</td>' +
                                        '<td>' +
                                        '<p>不含税价</p>' +
                                        '</td>';
                                    writeBody +=isResearch==1?"":'<td style="width: 40px"><p></p></td>';
                                    writeBody +='</tr>';
                                    if(commodityList[i].researchList.length==0){
                                        writeBody += ' <tr class="w_610 pad_bot">' +
                                            '<td  class="inp_box">' +
                                            '<div style="width: 230px;">' +
                                            '<a>单位</a>' +
                                            '<input type="hidden" name="give_type_'+commodityList[i].commodityId+'" value="'+ yemei[$i]+'">'+
                                            '<input type="text" name="give_company_'+commodityList[i].commodityId +'"  style="width: 230px;">' +
                                            '</div>' +
                                            '</td>' +
                                            ' <td class="inp_box">' +
                                            '<div  style="width: 120px;">' +
                                            '<a>价格</a>' +
                                            '<input type="text"  onkeyup="this.value=this.value.replace(/[^0-9]/g, \'\')"  style="width: 120px;" name="tax_price_'+commodityList[i].commodityId +'">' +
                                            '</div>' +
                                            '</td>' +
                                            '<td  class="inp_box">' +
                                            '<div style="width: 120px;">' +
                                            '<a>价格</a>' +
                                            '<input  type="text" onkeyup="this.value=this.value.replace(/[^0-9]/g, \'\')"  style="width: 120px;"  name="notTax_price_'+commodityList[i].commodityId +'">' +
                                            '</div>' +
                                            ' </td>' +
                                            '<td  class="inp_box">' +
                                            '<div>' +
                                            '<img src="../images/Pack.gif" alt="" class="Pack_up">' +
                                            '</div>' +
                                            '</td>' +
                                            '</tr>'
                                    }else{
                                        for(var a = 0; a < commodityList[i].researchList.length; a++){
                                            if(commodityList[i].researchList[a].type==yemei[$i]){
                                                writeBody += ' <tr class="w_610 pad_bot">' +
                                                    '<td  class="inp_box">';
                                                writeBody +=isResearch==1?'<div style="width: 230px; text-align: center">'+commodityList[i].researchList[a].company+'</div>':'<div style="width: 230px;"><a>单位</a><input type="hidden" name="give_type_'+commodityList[i].commodityId+'" value="'+yemei[$i]+'"/> <input type="text"  name="give_company_'+commodityList[i].commodityId +'" style="width: 230px;" value=' + commodityList[i].researchList[a].company + '></div>' ;
                                                writeBody += '</td>' +
                                                    ' <td class="inp_box">' +
                                                    '' ;
                                                writeBody +=isResearch==1?'<div style="width: 120px; text-align: center">'+commodityList[i].researchList[a].taxPrice+'</div>':'<div  style="width: 120px;"><a>价格</a><input  onkeyup="this.value=this.value.replace(/[^0-9]/g, \'\')" type="text"  name="tax_price_'+commodityList[i].commodityId +'" style="width: 120px;" value=' + commodityList[i].researchList[a].taxPrice + '></div>';
                                                writeBody +='</td>' +
                                                    '<td  class="inp_box">' +
                                                    '';
                                                writeBody +=isResearch==1?'<div style="width: 120px; text-align: center">'+commodityList[i].researchList[a].noTaxPrice+'</div>':'<div style="width: 120px;"><a>价格</a><input onkeyup="this.value=this.value.replace(/[^0-9]/g, \'\')" type="text"  name="notTax_price_'+commodityList[i].commodityId +'" style="width: 120px;" value=' + commodityList[i].researchList[a].noTaxPrice + '></div>';
                                                writeBody +=isResearch==1?"":'</td><td  class="inp_box"><div><img src="../images/Pack.gif" alt="" class="Pack_up"></div></td></tr>'
                                            }
                                        }
                                    }

                                    writeBody +=isResearch==1?"":'<tr><td colspan="4"><button type="button" data-id="'+commodityList[i].commodityId+'" data-type="'+yemei[$i]+'" class="box_add" >+增加</button></td></tr>';
                                    writeBody +='</table></td>';
                                }
                            }
                         }


                // 渲染采采购和不采购
                for(var i = 0 ;i<commodityList.length;i++) {
                    var applyPurchaseQuantity = commodityList[i].applyPurchaseQuantity
                    isHave = commodityList[i].isProductLibrary == 1 ? 'readonly= true style = "border:0"'  :'';
                    if(commodityList[i].isPurchase==1){
                        var plaseCheck = commodityList[i].isRegister==2?'selected="selected"':"";
                        var isRegisterHas = commodityList[i].isRegister==1?'selected="selected"':"";
                        var isRegisterNotHas = commodityList[i].isRegister==0?'selected="selected"':"";
                    html += '<tr class="prductList" commodityId ='+commodityList[i].commodityId+'>' +
                            '<td class="brandTitle">'+commodityList[i].brandTitle+'</td>' +
                            '<td class="modelTitle">'+commodityList[i].modelTitle+'</td>' +
                        '<td class="modelTitle">'+applyPurchaseQuantity+'</td>' +
                            '<td>' +
                                '<input '+isHave+' onmouseover="this.title=this.value" class="commodityTitle" type="text" maxlength="50"  value='+commodityList[i].commodityTitle+ '>' +
                            '</td>' +
                            '<td>' +
                                '<input '+isHave+' onmouseover="this.title=this.value" type="text" class="commodityTitleEnglish" maxlength="200"  value='+commodityList[i].commodityTitleEnglish+'>' +
                            '</td>' +
                            '<td>' +
                                '<input '+isHave+' onmouseover="this.title=this.value" type="text" style="width: 100px" maxlength="20"  class="unit" value='+commodityList[i].unit+'>' +
                            '</td>' +
                            '<td>' +
                                '<select class="isRegister">' +
                                    '<option value="2" '+plaseCheck+'>请选择</option>' +
                                    '<option value="0"'+ isRegisterNotHas +'>无</option>' +
                                    '<option value="1"' + isRegisterHas +'>有</option>' +
                                '</select>' +
                            '</td>' +
                            '<td>' +
                                '<button  class="dynamicBtn" onclick="content_edit(this)" isResearch='+isResearch+'>填写</button>' +
                            '</td>' +
                            '<td>' +
                                '<img src="../images/fasle.gif" alt="不予采纳" class="to_noAdopt" commodityId ='+commodityList[i].commodityId+'>' +
                            '</td>' +
                            '</tr>'
                    }else {
                        html1 += '<tr>' +
                            '<td>'+commodityList[i].brandTitle+'</td>' +
                            '<td>'+commodityList[i].modelTitle+'</td>' +
                            '<td>'+commodityList[i].commodityTitle+'</td>' +
                            '<td>'+commodityList[i].commodityTitleEnglish+'</td>' +
                            '<td width="500px">'+
                            '<div class="reason">' +commodityList[i].stopRemark+'</div>'+
                            '</td>' +
                            '<td>' +
                            '<img src="../images/open.gif" alt="" class="to_adopt" commodityId ='+commodityList[i].commodityId+'>' +
                            '</td>' +
                            '</tr>'
                    }
                }


                $('.detail_A').html(htmlHeader+html);//采购
                $('.detail_b').html(htmlHeader1+html1);//不采购
                $('.write_table').html(writeHeader+writeBody);


                $(document).ready(function () {
                    if(isResearch == 0){
                        $('.dynamicBtn').text('填写')
                    }else if(isResearch == 1){
                        $('.dynamicBtn').text('查看')
                    }
                });

                // 判断权限
                if(data.data. isAccessButtonNotPurchase = 0){
                    $('.no_perform').hide()
                }//是否有不执行权限

                if(data.data.isBaseInfo == 0){
                    $('.prductList input').attr('readonly','readonly').css({'border':'0'});
                    $('.prductList select').attr('disabled','disabled');
                    $('.prductList select').addClass('hideArrow')
                }//判断是否有有基础信息修改权限

                if(data.data.isResearcher == 0){
                    $('.dynamicBtn').parent().hide()
                    $('.isShow').hide()
                }//是否为调研者
                if(data.data.isShowPurchaseButton == 0){
                    $('.operation').hide();
                    $('.to_noAdopt').parent().hide();
                    $('.edit').hide();
                    $('.to_adopt').parent().hide();
                }//是否显示采购不采购
            },
            error: function(data) {
                console.log("失败")
            }
        })
    });
});




// 点击变为采纳，图片移入样式
$("body").on("mouseover", ".to_adopt",function() {
    $(this).attr('src','../images/true.gif')
}).on("mouseout", ".to_adopt",function() {
    $(this).attr('src','../images/open.gif')
}).on("click", ".to_adopt",function() {
    var that = $(this);
    var commodityId = $(this).attr('commodityId');
    var content = $(this).parent().siblings('td').find('.reason').val();
    $(this).parent().parent().remove();
    $.ajax({
        url: dataUrl,
        type: "post",
        dataType: "json",
        data: {
            api: "run.isPurchase", //接口名
            apiVersion: "v1", //接口版本
            stopRemark:content,
            userId: userId, //用户名
            isPurchase:1,
            userToken: userToken,//资源令牌
            commodityId:commodityId//商品ID
        },
        success: function(data) {
            var data = data.data;
            var plaseCheck = data.isRegister==2?'selected="selected"':"";
            var isRegisterHas = data.isRegister==1?'selected="selected"':"";
            var isRegisterNotHas = data.isRegister==0?'selected="selected"':"";
            var commodityTitle = data.commodityTitle||"";
            var commodityTitleEnglish = data.commodityTitleEnglish||"";
            var unit = data.unit||"";
            var html = '<tr class="prductList" commodityId ='+data.commodityId+'>' +
                '<td class="brandTitle">'+data.brandTitle+'</td>' +
                '<td class="modelTitle">'+data.modelTitle+'</td>' +
                '<td class="modelTitle">'+data.apply_purchase_quantity+'</td>' +
                '<td>' +
                '<input '+isHave+' onmouseover="this.title=this.value" class="commodityTitle" type="text" maxlength="50"  value='+commodityTitle+'>' +
                '</td>' +
                '<td>' +
                '<input '+isHave+' onmouseover="this.title=this.value" type="text" class="commodityTitleEnglish" maxlength="200"  value='+commodityTitleEnglish+'>' +
                '</td>' +
                '<td>' +
                '<input '+isHave+' onmouseover="this.title=this.value" type="text" style="width: 100px" maxlength="20"  class="unit" value='+unit+'>' +
                '</td>' +
                '<td>' +
                '<select class="isRegister">' +
                '<option value="2" '+plaseCheck+'>请选择</option>' +
                '<option value="0"'+ isRegisterNotHas +'>无</option>' +
                '<option value="1"' + isRegisterHas +'>有</option>' +
                '</select>' +
                '</td>' +
                '<td>' +
                '<button  class="dynamicBtn" onclick="content_edit(this)" isResearch='+data.isResearch+'>填写</button>' +
                '</td>' +
                '<td>' +
                '<img src="../images/fasle.gif" alt="不予采纳" class="to_noAdopt" commodityId ='+data.commodityId+'>' +
                '</td>' +
                '</tr>';
            $('.detail_A').append(html)
        }, error: function(data) {
            $.Pop('采纳失败',{BoxBg:false},'alert')
        }
    })
});


// 移入改变图片样式,点击变成不采纳
$('body').on('mouseover','.to_noAdopt',function() {
    $(this).attr('src','../images/clickfalse.gif')
}).on('mouseout','.to_noAdopt',function(){
    $(this).attr('src','../images/fasle.gif')
}).on('click','.to_noAdopt',function () {
    var that = $(this)
    var commodityId = $(this).attr('commodityId');
    $('.alert_box').show();
    $('.sure_withdraw').unbind("click").click(function () {
        var content = $('.alert_box textarea').val();
        if(content!=''){
            $.ajax({
                url: dataUrl,
                type: "post",
                dataType: "json",
                data: {
                    api: "run.isPurchase", //接口名
                    apiVersion: "v1", //接口版本
                    stopRemark:content,
                    userId: userId, //用户名
                    isPurchase:0,
                    userToken: userToken,//资源令牌
                    commodityId:commodityId//商品ID
                },
                success: function(data) {
                    var data = data.data;
                    that.parent().parent().remove();
                    $('.alert_box').hide();
                    // window.location.reload()
                    var html = '<tr>' +
                        '<td>'+data.brandTitle+'</td>' +
                        '<td>'+data.modelTitle+'</td>' +
                        '<td>'+data.commodityTitle+'</td>' +
                        '<td>'+data.commodityTitleEnglish+'</td>' +
                        '<td width="500px">'+
                            '<div class="reason">' +content+'</div>'+
                        '</td>' +
                        '<td>' +
                            '<img src="../images/open.gif" alt="" class="to_adopt" commodityId ='+commodityId+'>' +
                        '</td>' +
                        '</tr>';
                    $('.detail_b').append(html)

                }, error: function(data) {
                    $.Pop('不采纳失败',{BoxBg:false},'alert')
                }
            })

        }else {
        	$.Pop('请输入不采购理由',{BoxBg:false},'alert')
        }
    });
});

// 弹框内移入样式
$("body").on("mouseover", ".Pack_up",function() {
    $(this).attr('src','../images/Shut.gif')
}).on("mouseout", ".Pack_up",function() {
    $(this).attr('src','../images/Pack.gif')
});

//点击填写||查看出来的弹出框
function content_edit(obj) {
    var arr = $('.prductList')
    for(var i = 0 ;i<arr.length;i++){
        var commodityTitle = $('.prductList').eq(i).find('.commodityTitle').val()
        var commodityTitleEnglish = $('.prductList').eq(i).find('.commodityTitleEnglish').val()
        var projectUnit = $('.prductList').eq(i).find('.unit').val()
        var photo = $('.prductList').eq(i).find('.isRegister option:selected').text()
        $('.ww_150').eq(i).text(commodityTitle)
        $('.ww_150').eq(i).attr("title",commodityTitle)
        $('.w_109').eq(i).text(commodityTitleEnglish)
        $('.w_109').eq(i).attr("title",commodityTitleEnglish)
        $('.ww_108').eq(i).text(projectUnit)
        $('.projectUnit').eq(i).text(photo)
    }
    $('.report_alert_write').css({'display':'block'})
}

// 填写调研报告输入框移入改变
$("body").on("mouseover", ".Pack_up", function (){
    $(this).attr('src','../images/Shut.gif')
}).on('mouseout',".Pack_up",function () {
    $(this).attr('src','../images/Pack.gif')
}).on('click',".Pack_up",function () {
    var len = $(this).parent().parent().parent().siblings().length;
    if(len>2){
        $(this).parent().parent().parent().remove()
    }
});


// 点击不执行该项目,使用通用接口
$('.no_perform').click(function () {
    $('.no_perform_box').css({'display':'block'});
    $('.sure_noPerform').unbind("click").click(function () {
        var stopRemark = $('.noPerform_reason').val()
        $.ajax({
            url: dataUrl,
            type: "post",
            dataType: "json",
            data: {
                api: "common.closeProcurement", //接口名
                apiVersion: "v1", //接口版本
                procurementId:procurementId,
                stopRemark:stopRemark,
                userId: userId, //用户名
                userToken: userToken,//资源令牌
            },
            success: function(data) {
                if(data.data.flag == 1){
                    window.location.href="./workbench.html"
                }else {
                	$.Pop('没有该权限',{BoxBg:false},'alert')
                }
            }, error: function(data) {
                console.log("失败")
            }
        })

    });
});

// 返回跳转
$('.go_home').click(function () {
    window.location.href="./workbench.html"
});


// 撤回调研
$('body').on('click','.withdraw_research',function () {
    $.ajax({
        url: dataUrl,
        type: "post",
        dataType: "json",
        data: {
            api: "withdrawal.research", //接口名
            apiVersion: "v1", //接口版本
            procurementId:procurementId,
            userId: userId, //用户名
            userToken: userToken,//资源令牌
        },
        success: function(data) {
            if(data.data.flag == 1){
                $('.report_alert_write').css({'display':'none'});
                $('.withdraw_box').css({'display':'block'})
                // window.location.reload()
            }else {
            	$.Pop('撤回失败',{BoxBg:false},'alert')
            }
        }, error: function(data) {
            console.log("失败")
        }
    })
});




// 主页面保存按钮
$('.save').click(function () {
    var arr =[]
    for(var i = 0;i<$('.prductList').length;i++){
        var obj = {}
        obj.commodityId =$('.prductList').eq(i).attr('commodityId');
        obj.commodityTitle = $('.prductList').eq(i).find('.commodityTitle').val();
        obj.commodityTitleEnglish =$('.prductList').eq(i).find('.commodityTitleEnglish').val();
        obj.isRegister =$('.prductList').eq(i).find('.isRegister option:selected').val();
        obj.unit =$('.prductList').eq(i).find('.unit').val();
        arr.push(obj)
    }
    $.ajax({
        url: dataUrl,
        type: "post",
        dataType: "json",
        data: {
            api:"run.researchBaseInfo", //接口名
            apiVersion:"v1", //接口版本
            commodityList: JSON.stringify(arr),//用户提交的内容
            procurementId:procurementId,
            userId: userId, //用户名
            userToken: userToken,//资源令牌
        }, success: function(data) {
            console.log(data)
            window.location.href = './workbench.html'
        }, error: function(data) {
            console.log("失败")
        }
    })
});
