//引入页头、页脚、导航
$('#header').load('../html/header.html');
$('#nav').load('../html/nav.html');
$('#footer').load('../html/footer.html');

$('.close').click(function() {
	$('.bg_color').css({
		'display': 'none'
	})
}).on('mouseover', function() {
	$('.close').attr('src', '../images/clickClose.gif')
}).on('mouseout', function() {
	$('.close').attr('src', '../images/close.gif')
});
// 取消
$('.cancel').click(function() {
	$('.bg_color').css({
		'display': 'none'
	})
});
$("body").on('click', '.notice', function() {
	$.session.clear();
	$.session.set('key', 'null')
});
//获取用户名
var userId = $.cookie('userId');
//获取资源令牌
var userToken = $.cookie('userToken');

var projectHeader = '<tr>' +
	'<th width="35%">项目名称</th>' +
	'<th>进度</th>' +
	'<th>当前执行者</th>' +
	'<th>优先级</th>' +
	'<th>更新时间</th>' +
	'</tr>'
var projectBody = '';
var todoHeader = '<h2>待办事宜</h2>';
var newsHeader = '<h2>最新动态</h2>';
var newsFooter = ' <button class="myBtn">更多</button>';
var todoBody = '';
var newsBody = '';
var todoFooter = '<button  class="myBtn">更多</button>';
$(document).ready(function() {
	// 渲染最新动态
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
			if(data.isFirstLogin == 1) {
				$('.bg_notice').css({
					'display': 'block'
				})
			} //控制第一次登录
			if(data.isShow.purchaseApply == 1) {
				$('.give_apply img').attr('src', '../images/blueApply.gif');
				$('.give_apply').find('a').attr('href','./demandManagement.html')
			} //控制采购申请的跳转
			if(data.isShow.purchaseDoc == 1) {
				$('.archives img').attr('src', '../images/blueArchives.gif');
				$('.archives').find('a').attr('href','./PurchasingRecords.html');
				$('.purchaseDoc').show().find('a').attr('href','./PurchasingRecords.html');
			}
			// 渲染最新动态
			if(data.news.length > 4) {
				data.news.length = 4
			}
			for(var i = 0; i < data.news.length; i++) {
				var status = data.news[i].status; //判断跳转位置 0提交采购申请 1提交调研报告 2定价 3填写建议采购量 4提交采购报告 5是否继续 6已完结 7关闭
				var procurementId = data.news[i].procurementId; //采购id
				newsBody += '<div class="ctrl">' +
					'<div>' +
					'<img src="../images/clock.gif" alt="">' +
					'<p class="time">' + data.news[i].time + '</p>' +
					'</div>' +
					'<a href="" id="' + status + '" class="skip">' +
					'<p class="decision ver_zuixin" data-id="' + procurementId + '">' + data.news[i].desc + '</p>' +
					'</a>' +
					//					'<button>查看</button>' +
					'</div>'
			}
			// 渲染我的项目
			for(var i = 0; i < data.projects.length; i++) {
				var status = data.projects[i].status; //判断跳转位置 0提交采购申请 1提交调研报告 2定价 3填写建议采购量 4提交采购报告 5是否继续 6已完结 7关闭
				var procurementId = data.projects[i].procurementId; //采购id
				projectBody += '<tr class="ver_price" data-id="' + procurementId + '">' +
					'<td>' +
					'<a href="" id="' + status + '" class="skip1">' +
					'<img src="../images/project.gif" alt="">' +
					'<span>' + data.projects[i].procurementTitle + '</span>' +
					// '<span>（'+data.projects[i].procurementStatus+'）</span>' +
					'</a>' +
					'</td>' +
					'<td>' +
					data.projects[i].procurementStatus +
					'</td>' +
					'<td>' +
					data.projects[i].currentUser +
					'</td>' +
					'<td>' +
					'<span>' + data.projects[i].level + '</span>' +
					'</td>' +
					'<td  width="20%">' +
					data.projects[i].time +
					'</td>' +
					'</tr>'
			}

			// 渲染待办事宜
			if(data.toDo.length > 4) {
				data.toDo.length = 4
			}
			for(var i = 0; i < data.toDo.length; i++) {
				var status = data.toDo[i].status; //判断跳转位置 0提交采购申请 1提交调研报告 2定价 3填写建议采购量 4提交采购报告 5是否继续 6已完结 7关闭
				var procurementId = data.toDo[i].procurementId; //采购id
				todoBody += '<div class="ctrl">' +
					'<div>' +
					'<img src="../images/clock.gif" alt="">' +
					'<p class="time">' + data.toDo[i].time + '</p>' +
					'</div>' +
					'<a href="" id="' + status + '" class="skip2">' +
					'<p class="decision ver_daiban" data-id="' + procurementId + '">' + data.toDo[i].str + '</p>' +
					'</a>' +
					//					'<button>处理</button>' +
					'</div>'
			}
			$('.project_table').html(projectHeader + projectBody) //添加项目进度
			for(var i = 0; i < $(".ver_price").length; i++) {
				var skip1 = $(".ver_price:eq(" + i + ")").find(".skip1").attr("id");
				var procurementId = $(".ver_price:eq(" + i + ")").attr("data-id");

			};
			//0提交采购申请
			$(".skip1[id='0']").each(function() {
				var procurementId = $(this).parent().parent(".ver_price").attr("data-id");
				$(this).attr("href", "ProjectDetails.html?id=" + 0 + "&procurementId=" + procurementId);
			});
			//1提交调研报告
			$(".skip1[id='1']").each(function() {
				var procurementId = $(this).parent().parent(".ver_price").attr("data-id");
				$(this).attr("href", "ProjectDetails.html?id=" + 1 + "&procurementId=" + procurementId);
			});
			//2定价
			$(".skip1[id='2']").each(function() {
				var procurementId = $(this).parent().parent(".ver_price").attr("data-id");
				$(this).attr("href", "ProjectDetails.html?id=" + 2 + "&procurementId=" + procurementId);
			});
			//3填写建议采购量
			$(".skip1[id='3']").each(function() {
				var procurementId = $(this).parent().parent(".ver_price").attr("data-id");
				$(this).attr("href", "ProjectDetails.html?id=" + 3 + "&procurementId=" + procurementId);
			});
			//4提交采购报告
			$(".skip1[id='4']").each(function() {
				var procurementId = $(this).parent().parent(".ver_price").attr("data-id");
				$(this).attr("href", "ProjectDetails.html?id=" + 4 + "&procurementId=" + procurementId);
			});
			//5是否继续
			$(".skip1[id='5']").each(function() {
				var procurementId = $(this).parent().parent(".ver_price").attr("data-id");
				$(this).attr("href", "ProjectDetails.html?id=" + 5 + "&procurementId=" + procurementId);
			});
			//6已完结
			$(".skip1[id='6']").each(function() {
				var procurementId = $(this).parent().parent(".ver_price").attr("data-id");
				$(this).attr("href", "ProjectDetails.html?id=" + 6 + "&procurementId=" + procurementId);
			});
			//7关闭
			$(".skip1[id='7']").each(function() {
				var procurementId = $(this).parent().parent(".ver_price").attr("data-id");
				$(this).attr("href", "ProjectDetails.html?id=" + 7 + "&procurementId=" + procurementId);
			});
			$('.todo').html(todoHeader + todoBody) //添加待办事宜
			//			$('.todo').html(todoHeader + todoBody + todoFooter) //添加待办事宜
			for(var i = 0; i < $(".ver_daiban").length; i++) {
				var skip2 = $(".ver_daiban:eq(" + i + ")").find(".skip2").attr("id");
				var procurementId = $(".ver_daiban:eq(" + i + ")").attr("data-id");

			};
			//0提交采购申请
			$(".skip2[id='0']").each(function() {
				var procurementId = $(this).find(".ver_daiban").attr("data-id");
				$(this).attr("href", "ProjectDetails.html?id=" + 0 + "&procurementId=" + procurementId);
			});
			//1提交调研报告
			$(".skip2[id='1']").each(function() {
				var procurementId = $(this).find(".ver_daiban").attr("data-id");
				$(this).attr("href", "ProjectDetails.html?id=" + 1 + "&procurementId=" + procurementId);
			});
			//2定价
			$(".skip2[id='2']").each(function() {
				var procurementId = $(this).find(".ver_daiban").attr("data-id");
				$(this).attr("href", "ProjectDetails.html?id=" + 2 + "&procurementId=" + procurementId);
			});
			//3填写建议采购量
			$(".skip2[id='3']").each(function() {
				var procurementId = $(this).find(".ver_daiban").attr("data-id");
				$(this).attr("href", "ProjectDetails.html?id=" + 3 + "&procurementId=" + procurementId);
			});
			//4提交采购报告
			$(".skip2[id='4']").each(function() {
				var procurementId = $(this).find(".ver_daiban").attr("data-id");
				$(this).attr("href", "ProjectDetails.html?id=" + 4 + "&procurementId=" + procurementId);
			});
			//5是否继续
			$(".skip2[id='5']").each(function() {
				var procurementId = $(this).find(".ver_daiban").attr("data-id");
				$(this).attr("href", "ProjectDetails.html?id=" + 5 + "&procurementId=" + procurementId);
			});
			//6已完结
			$(".skip2[id='6']").each(function() {
				var procurementId = $(this).find(".ver_daiban").attr("data-id");
				$(this).attr("href", "ProjectDetails.html?id=" + 6 + "&procurementId=" + procurementId);
			});
			//7关闭
			$(".skip2[id='7']").each(function() {
				var procurementId = $(this).find(".ver_daiban").attr("data-id");
				$(this).attr("href", "ProjectDetails.html?id=" + 7 + "&procurementId=" + procurementId);
			});
			$('.new_dynamic').html(newsHeader + newsBody) //最新动态
			//			$('.new_dynamic').html(newsHeader + newsBody + newsFooter) //最新动态
			for(var i = 0; i < $(".ver_zuixin").length; i++) {
				var skip = $(".ver_zuixin:eq(" + i + ")").find(".skip").attr("id");
				var procurementId = $(".ver_zuixin:eq(" + i + ")").attr("data-id");

			};
			//0提交采购申请
			$(".skip[id='0']").each(function() {
				var procurementId = $(this).find(".ver_zuixin").attr("data-id");
				$(this).attr("href", "ProjectDetails.html?id=" + 0 + "&procurementId=" + procurementId);
			});
			//1提交调研报告
			$(".skip[id='1']").each(function() {
				var procurementId = $(this).find(".ver_zuixin").attr("data-id");
				$(this).attr("href", "ProjectDetails.html?id=" + 1 + "&procurementId=" + procurementId);
			});
			//2定价
			$(".skip[id='2']").each(function() {
				var procurementId = $(this).find(".ver_zuixin").attr("data-id");
				$(this).attr("href", "ProjectDetails.html?id=" + 2 + "&procurementId=" + procurementId);
			});
			//3填写建议采购量
			$(".skip[id='3']").each(function() {
				var procurementId = $(this).find(".ver_zuixin").attr("data-id");
				$(this).attr("href", "ProjectDetails.html?id=" + 3 + "&procurementId=" + procurementId);
			});
			//4提交采购报告
			$(".skip[id='4']").each(function() {
				var procurementId = $(this).find(".ver_zuixin").attr("data-id");
				$(this).attr("href", "ProjectDetails.html?id=" + 4 + "&procurementId=" + procurementId);
			});
			//5是否继续
			$(".skip[id='5']").each(function() {
				var procurementId = $(this).find(".ver_zuixin").attr("data-id");
				$(this).attr("href", "ProjectDetails.html?id=" + 5 + "&procurementId=" + procurementId);
			});
			//6已完结
			$(".skip[id='6']").each(function() {
				var procurementId = $(this).find(".ver_zuixin").attr("data-id");
				$(this).attr("href", "ProjectDetails.html?id=" + 6 + "&procurementId=" + procurementId);
			});
			//7关闭
			$(".skip[id='7']").each(function() {
				var procurementId = $(this).find(".ver_zuixin").attr("data-id");
				$(this).attr("href", "ProjectDetails.html?id=" + 7 + "&procurementId=" + procurementId);
			});
			if(data.redMark.toDo > 0) {
				$('.todo_thing').html(data.redMark.toDo) //待办事宜条数
			} else {
				$('.todo_thing').hide()
			}

			if(data.redMark.myPurchase > 0) {
				$('.myPurchase').html(data.redMark.myPurchase)
			} else {
				$('.myPurchase').hide()
			}
			//de
		},
		error: function(data) {
			console.log("失败");
		}
	})

});

// 修改密码
$('.Confirm_change').click(function() {
	var password = $('.myInput1').val();
    var oldPassword = $('.oldPassword').val();
    if(oldPassword == ''){
        $.Pop('原始密码不能为空',{BoxBg:false},'alert')
        return false
    }
	if($('.myInput1').val() == $('.input2').val()) {
		$.ajax({
			url: dataUrl,
			type: "post",
			dataType: "json",
			data: {
				api: "user.passwordReset", //接口名
				apiVersion: "v1", //接口版本
				userId: userId, //用户名
                oldPassword:oldPassword,
				password: password, //密码
				userToken: userToken //资源令牌
			},
			success: function(data) {
				if(data.data.flag == 1) {
					$('.bg_color').hide()
                    $.cookie("roleName", null); //角色名
                    $.cookie("userId", null); //用户id
                    $.cookie("userName", null); //用户名
                    $.cookie("userToken", null); //资源令牌
                    window.location.href = './login.html'
				}else if(data.data.flag == 2) {
                   $.Pop('旧密码错误',{BoxBg:false},'alert')
                }
			},
			error: function(data) {
				console.log("失败");
			}
		})
	} else {
		$('.alert_box_bottom p').show()
	}
});

// 第一次登录强制修改
$('.good').click(function() {
	var password = $('.psd').val();
	if($('.psd').val() == $('.agin_psd').val()) {
		$.ajax({
			url: dataUrl,
			type: "post",
			dataType: "json",
			data: {
				api: "user.passwordReset", //接口名
				apiVersion: "v1", //接口版本
				userId: userId, //用户名
				password: password, //密码
                oldPassword:'',
				userToken: userToken //资源令牌
			},
			success: function(data) {
				if(data.data.flag == 1) {
					$('.bg_notice').css({
						'display': 'none'
					})
				}
			},
			error: function(data) {
				console.log("失败");
			}
		})
	} else {
		$('.set_password p').css({
			'display': 'block'
		})
	}
});

// 点击待办事宜
// $('.todo_things').click(function () {
//     $.ajax({
//         url: "http://procurement.mediby.com/rest",
//         type: "post",
//         dataType: "json",
//         data: {
//             api: "index.toDo", //接口名
//             apiVersion: "v1", //接口版本
//             page:'',//第几页
//             userId: userId, //用户名
//             userToken: userToken //资源令牌
//         },
//         success: function (data) {
//             console.log(data)
//         }, error: function (data) {
//             console.log("失败");
//         }
//     })
// });