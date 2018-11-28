//引入页头、页脚、导航
$('#header').load('../html/header.html');
$('#nav').load('../html/nav.html');
$('#footer').load('../html/footer.html');
$('#change_password').load('../html/changePassword.html');

var number = 0;
new Vue({
    el: '.app',
    data: function() {
        return {
            value1: '',
            value2:''
        }
    }
});

$('.switch').click(function () {
    var value = $('.open_off').css('margin-left');
    if(value=='1px'){
        $('.open_off').css({'margin-left':'23px'});
        $('.over_time').css({'display':'none'});
        $('.app').css({'display':'none'});
        $('.switch').css({'background-color':'#adadad'});
    }else {
        $('.open_off').css({'margin-left':'1px'});
        $('.over_time').css({'display':'block'});
        $('.app').css({'display':'block'})
        $('.switch').css({'background-color':'#13ce66'})
    }
});


function del(obj) {
    if($('.Select').length>1){
        $(obj).parents('tr').remove()
    }
}


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
// 调研人数选择
//$('.research_nuber').change(function () {
//  var selectNum = parseInt($(this).val());
//  $('.check_perform').find('.executor').remove();
//  console.log(selectNum)
//  for(var i =0; i<selectNum; i++ ){
//      $('.check_perform').append(
//          '<div class="executor">' +
//          ' <select> ' +
//          '<option value ="唤雨师">唤雨师</option> ' +
//          '<option value ="唤雨师">唤雨师</option> ' +
//          '<option value="唤雨师">唤雨师</option> ' +
//          '</select> ' +
//          '<span class="circle"> ' +
//          '<span>'+(i+1)+'</span> ' +
//          '</span> ' +
//          '</div>'
//      )
//  }
//})
//$('.foreign_select').change(function () {
//  var selectNum = parseInt($(this).val());
//  $('.domestic').find('.executor').remove();
//  for(var i =0; i<selectNum; i++ ){
//      $('.domestic').append(
//          '<div class="executor">' +
//          ' <select> ' +
//          '<option value ="唤雨师">唤雨师</option> ' +
//          '<option value ="唤雨师">唤雨师</option> ' +
//          '<option value="唤雨师">唤雨师</option> ' +
//          '</select> ' +
//          '<span class="circle"> ' +
//          '<span>'+(i+1)+'</span> ' +
//          '</span> ' +
//          '</div>'
//      )
//  }
//});


$('.cancel').click(function () {
    $('.bg_color1') .css({'display':'none'})
})

$('.sure').click(function () {
    $('.bg_notice') .css({'display':'none'})
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