var userId = null;
api = api+"dataAndSecurity/";
var id1=null;
var id2=null;
var id3=null;
var id4=null;
var c1 = 60;
var c2 = 60;
var isChecked =false;
var editPasswordChecked = false;
$(function () {
    var username = $('#userName').text();
    $('.last').text(username);
    initUserInfo(username);
});

function initUserInfo(username) {
    initDatas();

    function initDatas() {
        var url = api+'getUserInfo?userName='+encodeURI(username);
        $.getJSON(url,function (data) {
            data=data.datas[0]==null?'':data.datas[0];
            if(data!=''){
                userId = data.USER_ID;
                $('#loginName').text(data.LOGIN_NAME);
                $('#user_Name').text(data.USER_NAME);
                $('#userName').text(data.USER_NAME);
                if(data.USER_SEX=='男'){
                    $('#userSex').find('input').eq(0).click();
                }else{
                    $('#userSex').find('input').eq(1).click();
                }
                $('#userTel').text(change(data.USER_TEL));
                $('#userQQ').text(change(data.USER_QQ));
                $('#userBar').text(change2(data.USER_BAR));
                $('#userMail').text(change2(data.USER_MAIL));
                $('#userZFB').text(change(data.USER_ZFB));
                $('#userWeixin').text(change(data.USER_WEIXIN));
                $('#userSFZ').text(change(data.USER_SFZ));
            }else{
                layer.msg("加载用户信息错误!")
            }
        }).error(function () {
            layer.msg("加载用户信息错误!")
        }).complete(function () {
            initEdit();
        });
    }
    function change(str) {
        if(str==""||str==null){
            return "--";
        }else {
            if (str.indexOf('@') > -1) {
                var str1 = str.substring(0, 2);
                var str2 = str.substring(5, str.length);
                return str1 + "***" + str2;
            } else {
                var str1 = str.substring(0, 3);
                var str2 = str.substring(6, str.length);
                return str1 + "***" + str2;
            }
        }
    }

    function change2(str) {
        if(str==""||str==null){
            return "--";
        }else{
            var str1 = str.substring(0,2);
            var str2 = str.substring(5,str.length);
            return str1+"***"+str2;
            return
        }
    }
    
    function initEdit() {
        /**
         * type:
         *      1:昵称修改
         *      2：性别修改
         *      3：密码修改
         *      4：手机号码修改
         *      5：qq号修改
         *      6：百度贴吧号修改
         *      7：邮箱修改
         *      8：支付宝修改
         *      9：微信号修改
         *      10：身份证修改
         */
        $('#sureBtn').unbind('click');
        $('#sureBtn').click(function () {
            var title = $(this).parent().parent().find('.inputtitle').text();
            var url = null;
            if(title.indexOf("修改昵称")>-1){
                var newValue = $(this).parent().parent().find(".pop01").find('input').val();
                url = api+"editInfo?type=1&newValue="+encodeURI(newValue)+"&userId="+encodeURI(userId);
            }else if(title.indexOf("手机号码")>-1){
                var getcodetime2Result = $('#getcodetime2Result').text();
                var getcodetime3Result = $('#getcodetime3Result').text();
                if(getcodetime2Result.indexOf('通过')>-1&&getcodetime3Result.indexOf('通过')>-1) {
                    var newValue = $(this).parent().parent().find(".pop02").find('tr').eq(2).find('td').eq(1).find('input').val();
                    url = api + "editInfo?type=4&newValue=" + encodeURI(newValue) + "&userId=" + encodeURI(userId);
                    $('.getcode2').show();
                    $('#getcodetime3').hide();
                    $('.getcode1').show();
                    $('#getcodetime2').hide();
                }else{
                    layer.msg("验证码未通过!");
                    return false;
                }
            }else if(title.indexOf("QQ号码")>-1){
                var newValue = $(this).parent().parent().find(".pop01").find('input').val();
                url = api+"editInfo?type=5&newValue="+encodeURI(newValue)+"&userId="+encodeURI(userId);
            }else if(title.indexOf("贴吧账号")>-1){
                var newValue = $(this).parent().parent().find(".pop01").find('input').val();
                url = api+"editInfo?type=6&newValue="+encodeURI(newValue)+"&userId="+encodeURI(userId);
            }else if(title.indexOf("邮箱")>-1){
                var newValue = $(this).parent().parent().find(".pop01").find('input').val();
                url = api+"editInfo?type=7&newValue="+encodeURI(newValue)+"&userId="+encodeURI(userId);
            }else if(title.indexOf("支付宝")>-1){
                var newValue = $(this).parent().parent().find(".pop01").find('input').val();
                url = api+"editInfo?type=8&newValue="+encodeURI(newValue)+"&userId="+encodeURI(userId);
            }else if(title.indexOf("微信")>-1){
                var newValue = $(this).parent().parent().find(".pop01").find('input').val();
                url = api+"editInfo?type=9&newValue="+encodeURI(newValue)+"&userId="+encodeURI(userId);
            }else if(title.indexOf("身份证")>-1){
                var newValue = $(this).parent().parent().find(".pop01").find('input').val();
                url = api+"editInfo?type=10&newValue="+encodeURI(newValue)+"&userId="+encodeURI(userId);
            }
            $('#myModal').modal('hide');
            editRequest(url);
        });

        $('#userSex').unbind('click');
        $('#userSex').change(function () {
            var newValue = $(this).find('input:radio:checked').val();
            url = api+"editInfo?type=2&newValue="+encodeURI(newValue)+"&userId="+encodeURI(userId);
            editRequest(url);
        });

        $('.sureSubmit').unbind('click');
        $('.sureSubmit').click(function () {
            var checkResult = $('#checkResult').text();
            if(checkResult.indexOf("通过")>-1) {
                var newValue = $('#newPassword').val();
                url = api + "editInfo?type=3&newValue=" + encodeURI(newValue) + "&userId=" + encodeURI(userId);
                editRequest(url);
            }else{
                layer.msg("短信验证码不合法")
            }
        });

        $('.sureReset').unbind('click');
        $('.sureReset').click(function () {
            $('#telphone').val("");
            $('#checkNum').val("");
            $('#newPassword').val("");
        });
        function editRequest(url) {
            var info = null;
            $.getJSON(url,function (data) {
                info = data.info;
                initDatas();
            }).error(function () {
                layer.msg("修改失败")
            }).complete(function () {
                layer.msg(info);

            });
        }

        $('#getCheckNum').click(function () {
            var telphone = $('#telphone').val();
            if(telphone!="") {
                var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                if(!myreg.test(telphone)){
                    layer.msg("请输入有效的手机号码！")
                }else {
                    if(editPasswordChecked) {
                        $.ajax({
                            url: '/message/sendMessage?tel=' + encodeURI(telphone) + '&type=2',
                            dataType: 'text',
                            success: function (info) {
                                $('#getCheckNum').hide();
                                $('#getcodetime1').show();
                                c = 60;
                                document.getElementById('getcodetime1').innerText = c + "S后重新获取";
                                c = c - 1;
                                id1 = '#getcodetime1';
                                id2 = '#getCheckNum';
                                t = setTimeout("timedCount()", 1000);
                                layer.msg(info);
                            }
                        });
                    }else{
                        layer.msg("手机号与账号不匹配!");
                    }
                }
            }else{
                layer.msg("请输入手机号!")
            }
        });

        $('.getcode2').click(function () {
            var registerTel = $('#registerTel2').val();
            var oldTel = $('#registerTel').val();
            if(registerTel==oldTel){
                layer.msg('新手机和注册手机号一致,请修改!');
            }else {
                if (registerTel != "") {
                    var url = api + 'patchUserAndTel?newtel=' + encodeURI($('#registerTel2').val());
                    $.getJSON(url,function (data) {
                       if(data.info != "") {
                            layer.msg(data.info);
                       }else{
                           var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                           if (!myreg.test(registerTel)) {
                               layer.msg("请输入有效的手机号码！")
                           } else {
                               $.ajax({
                                   url: '/message/sendMessage?tel=' + encodeURI(registerTel) + '&type=4',
                                   dataType: 'text',
                                   success: function (info) {
                                       $('.getcode2').hide();
                                       $('#getcodetime3').show();
                                       c2 = 60;
                                       document.getElementById('getcodetime3').innerText = c2 + "S后重新获取";
                                       c2 = c2- 1;
                                       id3 = '#getcodetime3';
                                       id4 = '.getcode2';
                                       t = setTimeout("timedCount3()", 1000);
                                       layer.msg(info);
                                   }
                               });
                           }
                       }
                    });
                } else {
                    layer.msg("请输入手机号!")
                }
            }
        });

        $('.getcode1').click(function () {
            var registerTel = $('#registerTel').val();
            if(isChecked) {
                if (registerTel != "") {
                    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                    if (!myreg.test(registerTel)) {
                        layer.msg("请输入有效的手机号码！")
                    } else {
                        $.ajax({
                            url: '/message/sendMessage?tel=' + encodeURI(registerTel) + '&type=4',
                            dataType: 'text',
                            success: function (info) {
                                $('.getcode1').hide();
                                $('#getcodetime2').show();
                                c1 = 60;
                                document.getElementById('getcodetime2').innerText = c1 + "S后重新获取";
                                c1 = c1 - 1;
                                id1 = '#getcodetime2';
                                id2 = '.getcode1';
                                t = setTimeout("timedCount2()", 1000);
                                layer.msg(info);
                            }
                        });
                    }
                } else {
                    layer.msg("请输入手机号!")
                }
            }else{
                layer.msg("不存在此手机号!");
            }
        });

        $('#registerTel').blur(function () {
            if($('#registerTel').val()!="") {
                var url = api + 'patchUserAndTel?loginName=' + encodeURI($('#loginName').text()) + '&tel=' + encodeURI($('#registerTel').val());
                $.getJSON(url, function (data) {
                    if (data.info != "") {
                        isChecked =false
                        layer.msg(data.info);
                    }else{
                        isChecked =true;
                    }
                });
            }
        });

    }

    $('#checkNum').blur(function () {
        var checkNum = $('#checkNum').val();
        var telphone = $('#telphone').val();
        if(checkNum.length!=4){
            layer.msg("验证码位数不正确!");
        }else{
            $.ajax({
                url: '/message/checkNum?tel=' + encodeURI(telphone)+'&checkNum='+encodeURI(checkNum),
                dataType:'text',
                success:function (info) {
                    if(info=='1') {
                        $('#checkResult').text("验证通过!");
                        $('#checkNum').attr('disabled','true');
                    }else{
                        $('#checkResult').text("验证码错误!");
                    }
                }
            })
        }
    });

    $('#getcodetime2Check').blur(function () {
        var checkNum = $('#getcodetime2Check').val();
        var telphone = $('#registerTel').val();
        if(checkNum.length!=4&&checkNum.length!=0){
            layer.msg("验证码位数不正确!");
        }else{
            $.ajax({
                url: '/message/checkNum?tel=' + encodeURI(telphone)+'&checkNum='+encodeURI(checkNum),
                dataType:'text',
                success:function (info) {
                    if(info=='1') {
                        $('#getcodetime2Result').text("验证通过!");
                        $('#getcodetime2Check').attr('disabled','true');
                    }else{
                        $('#getcodetime2Result').text("验证码错误!");
                    }
                }
            })
        }
    });

    $('#getcodetime3Check').blur(function () {
        var checkNum = $('#getcodetime3Check').val();
        var telphone = $('#registerTel2').val();
        if(checkNum.length!=4&&checkNum.length!=0){
            layer.msg("验证码位数不正确!");
        }else{
            $.ajax({
                url: '/message/checkNum?tel=' + encodeURI(telphone)+'&checkNum='+encodeURI(checkNum),
                dataType:'text',
                success:function (info) {
                    if(info=='1') {
                        $('#getcodetime3Result').text("验证通过!");
                        $('#getcodetime3Check').attr('disabled','true');
                    }else{
                        $('#getcodetime3Result').text("验证码错误!");
                    }
                }
            })
        }
    });

    $('#telphone').blur(function () {
        if($('#telphone').val()!="") {
            var url = api + 'patchUserAndTel?loginName=' + encodeURI($('#loginName').text()) + '&tel=' + encodeURI($('#telphone').val());
            $.getJSON(url, function (data) {
                if (data.info != "") {
                    editPasswordChecked=false;
                    layer.msg("手机号与账号不匹配!");
                }else{
                    editPasswordChecked=true;
                }
            });
        }
    });
}

function timedCount() {
    document.getElementById('getcodetime1').innerText=c+"S后重新获取";
    c=c-1;
    if(c>0) {
        t = setTimeout("timedCount()", 1000);
    }else{
        $(id1).hide();
        $(id2).show();
    }
}

function timedCount2() {
    document.getElementById('getcodetime2').innerText=c1+"S后重新获取";
    c1=c1-1;
    if(c1>0) {
        t = setTimeout("timedCount2()", 1000);
    }else{
        $(id1).hide();
        $(id2).show();
    }
}

function timedCount3() {
    document.getElementById('getcodetime3').innerText=c2+"S后重新获取";
    c2=c2-1;
    if(c2>0) {
        t = setTimeout("timedCount3()", 1000);
    }else{
        $(id3).hide();
        $(id4).show();
    }
}