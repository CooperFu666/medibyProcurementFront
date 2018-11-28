//引入页头、页脚、导航
$('#header').load('../html/header.html');
$('#nav').load('../html/nav.html');
$('#footer').load('../html/footer.html');
$('#change_password').load('../html/changePassword.html');


// 关闭弹窗
$('.box_operate_no,.fork').click(function () {
    $('.report_alert') .css({'display':'none'})
});
// 添加功能
$("body").off('click', '.pro_inp_add').on('click', '.pro_inp_add', function() {
    pro_inp_add($(this));
});
function pro_inp_add(obj) {
    var isSpan = obj.parent().parent().find(".isSpan").hasClass('isSpan');
    html = "<div class='dataAll' style='clear: both;height:auto;overflow:hidden;'><div>" +
        "<input type='text' value='' maxlength='100' class='pro_inp_one'>" +
        "<input class='unitPrice' disabled='disabled' style='width: 60px;'/>" +
        "<div><input type='text' class='PurchaseNum reckon' onkeyup='this.value=this.value.replace(/[^0-9]/g, \"\")' value='' maxlength='20' style='width: 60px;margin-left: 3.5%;'></div>" +
        "<span class='mar_left w_100'>" +
        "<input type='text' value='' class='freight reckon' onkeyup='this.value=this.value.replace(/[^0-9]/g, \"\")' style=' width:60px;margin:12% 0;'>" +
        "</span>" +
        "<span class='w_100'>" +
        "<input type='text' class='subtotal reckon' onkeyup='this.value=this.value.replace(/[^0-9]/g, \"\")' value='' style='width:60px;margin:12% 0;'></span>" +
        "<span class='tax' style='margin: 1% 0 0 5.5%;min-width: 60px'>" +
        "<span style='display: inline-block;line-height: 24px;margin: 0 20% 0 10%'>含税</span>" +
        "<input type='checkbox' id='check'>" +
        "</span>"
    isSpan?html+="<span class='w_170 mar_operation' style='width: 10%;float: right;margin-right:16px'><p><img src='../images/delete.gif' class='on_delete' alt=''></p></span></div></div>":html += "<span class='w_170 w_172 isSpan' style='width:10%;'><p class='combined'>--</p></span><span class='w_170 mar_operation' style='width: 10%;float: right;margin-right:16px'><p><img src='../images/delete.gif' class='on_delete' alt=''></p></span></div></div>";
    obj.parent().prev().append(html)
}

function del_data(obj) {
    var len = $(obj).parents('.w_170').parent().parent().length;
    if(len>0){
        $(obj).parents('.w_170').parent().parent().remove()
    }
}
// 删除功能
$("body").off('click', '.on_delete').on('click', '.on_delete', function() {
    del_data($(this));
});
$('.close').click(function () {
    $('.report_alert').css({'display':'none'})
});


// 自动计算单价
// unitPrice
// freight
// PurchaseNum
// subtotal

$('body').on('blur','.reckon',function () {
    // 合计
    subtotal = $(this).parent().parent().find(".subtotal").val();
    freight = $(this).parent().parent().find(".freight").val();
    PurchaseNum = $(this).parent().parent().find(".PurchaseNum").val();
    if(subtotal-freight<=0 || PurchaseNum==0){
        unitPrice = "0.00";
    }else{
        unitPrice = (subtotal-freight)/PurchaseNum;
        unitPrice = unitPrice.toFixed(2);
    }
    $(this).parent().parent().find(".unitPrice").val(unitPrice)


    var sum = 0;
    for(var i = 0 ;i<$(this).parents(".Select").find(".subtotal").length;i++){
        num = $(this).parents(".Select").find(".subtotal").eq(i).val()
        num = !num?0:num;
        sum += parseInt(num);
        $(this).parents(".Select").find('.combined').text(sum)
    }



    var zong_num = 0;
    for(var i = 0 ;i<$('.combined').length;i++){
        zong_num += parseInt($('.combined').eq(i).text())
    }
    $(".num_price").html(zong_num)
});

(function($) {
	$.session = {
		_id: null,
		_cookieCache: undefined,
		_init: function() {
			if(!window.name) {
				window.name = Math.random();
			}
			this._id = window.name;
			this._initCache();
			var matches = (new RegExp(this._generatePrefix() + "=([^;]+);")).exec(document.cookie);
			if(matches && document.location.protocol !== matches[1]) {
				this._clearSession();
				for(var key in this._cookieCache) {
					try {
						window.sessionStorage.setItem(key, this._cookieCache[key]);
					} catch(e) {};
				}
			}
			document.cookie = this._generatePrefix() + "=" + document.location.protocol + ';path=/;expires=' + (new Date((new Date).getTime() + 120000)).toUTCString();
		},
		_generatePrefix: function() {
			return '__session:' + this._id + ':';
		},
		_initCache: function() {
			var cookies = document.cookie.split(';');
			this._cookieCache = {};
			for(var i in cookies) {
				var kv = cookies[i].split('=');
				if((new RegExp(this._generatePrefix() + '.+')).test(kv[0]) && kv[1]) {
					this._cookieCache[kv[0].split(':', 3)[2]] = kv[1];
				}
			}
		},
		_setFallback: function(key, value, onceOnly) {
			var cookie = this._generatePrefix() + key + "=" + value + "; path=/";
			if(onceOnly) {
				cookie += "; expires=" + (new Date(Date.now() + 120000)).toUTCString();
			}
			document.cookie = cookie;
			this._cookieCache[key] = value;
			return this;
		},
		_getFallback: function(key) {
			if(!this._cookieCache) {
				this._initCache();
			}
			return this._cookieCache[key];
		},
		_clearFallback: function() {
			for(var i in this._cookieCache) {
				document.cookie = this._generatePrefix() + i + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
			}
			this._cookieCache = {};
		},
		_deleteFallback: function(key) {
			document.cookie = this._generatePrefix() + key + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
			delete this._cookieCache[key];
		},
		get: function(key) {
			return window.sessionStorage.getItem(key) || this._getFallback(key);
		},
		set: function(key, value, onceOnly) {
			try {
				window.sessionStorage.setItem(key, value);
			} catch(e) {}
			this._setFallback(key, value, onceOnly || false);
			return this;
		},
		'delete': function(key) {
			return this.remove(key);
		},
		remove: function(key) {
			try {
				window.sessionStorage.removeItem(key);
			} catch(e) {};
			this._deleteFallback(key);
			return this;
		},
		_clearSession: function() {
			try {
				window.sessionStorage.clear();
			} catch(e) {
				for(var i in window.sessionStorage) {
					window.sessionStorage.removeItem(i);
				}
			}
		},
		clear: function() {
			this._clearSession();
			this._clearFallback();
			return this;
		}
	};
	$.session._init();
})(jQuery);