api = api+"register/";
var canRegister = false;
$(function () {
    initBunding();
});

function initBunding() {
    $('input').blur(function () {
        if($(this).is('#loginName')){
            if( this.value!="" && this.value.length < 6){
                layer.msg("账号格式不对!");
            }else{
                var loginName = $(this).val();
                var url = api+'checkIsEmpty?loginName='+encodeURI(loginName);
                $.getJSON(url,function (data) {
                    if (data.info != "") {
                        layer.msg(data.info);
                    }
                });
            }
        }
        if($(this).is('#userName')){
            var reg = /^[\u4E00-\u9FA5]+$/;
            if(!reg.test(this.value)&&this.value!=""){
                layer.msg("昵称必须为汉字!");
            }else{
                var userName = $(this).val();
                var url = api+'checkIsEmpty?userName='+encodeURI(userName);
                $.getJSON(url,function (data) {
                    if (data.info != "") {
                        layer.msg(data.info);
                    }
                });
            }
        }
        if($(this).is('#loginWord')){
            if( this.value!="" &&( this.value.length < 4||this.value.length>16)){
                layer.msg("密码格式不对!");
            }
        }
        if($(this).is('#loginWordSure')){
            if( this.value!="" &&( this.value.length < 4||this.value.length>16)){
                layer.msg("确认密码格式不对!");
            }else{
                if(this.value!=$('#loginWord').val()){
                    layer.msg("两次输入的密码不匹配,请从新输入!")
                }
            }
        }
        if($(this).is('#tel')){
            if(this.value.length !=11&&this.value!=""){
                layer.msg("手机号应为11位数字!");
            }else{
                var tel = $(this).val();
                var url = api+'checkIsEmpty?tel='+encodeURI(tel);
                $.getJSON(url,function (data) {
                    if (data.info != "") {
                        canRegister=false;
                        layer.msg(data.info);
                    }else{
                        canRegister=true;
                    }
                });
            }
        }
    });
    $('#addUser').click(function () {
        var loginName = $('#loginName').val();
        var userName = $('#userName').val();
        var loginWord = $('#loginWord').val();
        var tel = $('#tel').val();
        if((loginName==""||userName==""||loginWord==""||tel=="")){
            layer.msg("账号,昵称,密码,手机号不能为空!");
        }else {
            if($('#checkResult').text().indexOf("通过")>-1) {
                var url = api + 'addUser?loginName=' + encodeURI(loginName) +
                    '&userName=' + encodeURI(userName) +
                    '&loginWord=' + encodeURI(loginWord) +
                    '&tel=' + encodeURI(tel);
                var flag = 0;
                $.getJSON(url, function (data) {
                    layer.msg(data.info);
                    if (data.info.indexOf("用户") == -1) {
                        flag++;
                    }
                }).complete(function () {
                    if (flag > 0) {
                        setTimeout(function(){
                            window.location.href='login';
                        },3000);
                    }
                });
            }else{
                layer.msg("短信验证码未通过!");
            }
        }
    });
    $('#checkNum').click(function () {
        var telphone =$('#tel').val();
        if(canRegister) {
            if (telphone.length!=11) {
                layer.msg("请输入有效的手机号码！")
            } else {
                $.ajax({
                    url: '/message/sendMessage?tel=' + encodeURI(telphone) + '&type=1',
                    dataType: 'text',
                    success: function (info) {
                        $('#checkNum').hide();
                        $('#getcodetime').show();
                        c = 60;
                        document.getElementById('checkNum').innerText = c + "S后重新获取";
                        c = c - 1;
                        id1 = '#getcodetime';
                        id2 = '#checkNum';
                        t = setTimeout("timedCount()", 1000);
                        layer.msg(info);
                    }
                })
            }
        }else{
            layer.msg("此手机号已经被注册过了!");
        }
    });

    $('#sureFerry').blur(function () {
        var checkNum = $('#sureFerry').val();
        var telphone = $('#tel').val();
        if(checkNum.length!=4&&checkNum!=""){
            layer.msg("验证码位数不正确!");
        }else{
            $.ajax({
                url: '/message/checkNum?tel=' + encodeURI(telphone)+'&checkNum='+encodeURI(checkNum),
                dataType:'text',
                success:function (info) {
                    if(info=='1') {
                        $('#checkResult').text("验证通过!");
                        $('#sureFerry').attr('disabled','true');
                    }else{
                        $('#checkResult').text("验证码错误!");
                    }
                }
            })
        }
    });
}

function timedCount() {
    document.getElementById('getcodetime').innerText=c+"S后重新获取";
    c=c-1;
    if(c>0) {
        t = setTimeout("timedCount()", 1000);
    }else{
        $(id1).hide();
        $(id2).show();
    }
}