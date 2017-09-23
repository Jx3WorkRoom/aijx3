api = api+'userInfo/';
var isChecked = false;
$(function () {
    initBunding()
});

function initBunding() {
    $('#loginName').blur(function () {
        if($('#loginName').val()!="") {
            var url = api + 'patchUserAndTel?loginName=' + encodeURI($('#loginName').val());
            $.getJSON(url, function (data) {
                if (data.info != "") {
                    layer.msg(data.info);
                }
            });
        }
    });
    $('#tel').blur(function () {
        if($('#tel').val()!="") {
            var url = api + 'patchUserAndTel?loginName=' + encodeURI($('#loginName').val()) + '&tel=' + encodeURI($('#tel').val());
            $.getJSON(url, function (data) {
                if (data.info != "") {
                    isChecked =false;
                    layer.msg(data.info);
                }else{
                    isChecked =true;
                }
            });
        }
    });
    $('#getCheckNum').click(function () {
        var telphone = $('#tel').val();
        if(telphone!="") {
            var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;

            if(!myreg.test(telphone)){
                layer.msg("请输入有效的手机号码！")
            }else {
                if(isChecked) {
                    $.ajax({
                        url: '/testDemo/message/sendMessage?tel=' + encodeURI(telphone) + '&type=3',
                        dataType: 'text',
                        success: function (info) {
                            layer.msg(info);
                        }
                    })
                }else {
                    layer.msg("你的手机号还未注册!")
                }
            }
        }else{
            layer.msg("请输入手机号!")
        }
    });
    $('#checkNum').blur(function () {
        var checkNum = $('#checkNum').val();
        var telphone = $('#tel').val();
        if(checkNum.length!=4&&checkNum!=""){
            layer.msg("验证码位数不正确!");
        }else{
            if(checkNum!="") {
                $.ajax({
                    url: '/testDemo/message/checkNum?tel=' + encodeURI(telphone) + '&checkNum=' + encodeURI(checkNum),
                    dataType: 'text',
                    success: function (info) {
                        if (info == '1') {
                            $('#checkResult').text("验证通过!");
                            $('#checkNum').attr('disabled', 'true');
                        } else {
                            $('#checkResult').text("验证码错误!");
                        }
                    }
                })
            }
        }
    });
    $('#newPassword2').blur(function () {
        var newPassword = $('#newPassword').val();
        var newPassword2 = $('#newPassword2').val();
        if(newPassword!=newPassword2){
            $('#passwordCheck').text("两次密码输入不一致!");
        }else if(newPassword==""&&newPassword2==""){
            $('#passwordCheck').text("两次密码不能为空!");
        }else {
            $('#passwordCheck').text("密码正确!");
        }
    });
    $('#sureRecover').click(function () {
        var loginName =$('#loginName').val();
        var newPassword =$('#newPassword').val();
        var passwordCheck = $('#passwordCheck').text();
        if(passwordCheck.indexOf("不一致")>-1){
            layer.msg("两次密码输入不一致!")
        }else{
            if(newPassword!=""&&loginName!="") {
                var url = api + 'recoverPassword?loginName=' + encodeURI(loginName) + '&newPassword=' + encodeURI(newPassword);
                $.getJSON(url, function (data) {
                    layer.msg(data.info);
                    window.location.href = 'login';
                });
            }else{
                layer.msg("请先完善信息!");
            }
        }
    });
}