var api = api+'userInfo/';
$(function () {
    initTable();
    initSeach();
});

function initTable(url,keyNum) {
    var startNum = 0;
    if(keyNum!=null){
        startNum = keyNum*20-20;
    }
    if(url==null) {
        url = api+'queryUserInfo?num='+encodeURI(startNum);
    }
    $(".table").empty();
    $(".table").append("<div class=\"table-tr tablech1\">\n" +
        "                <div class=\"table-th table-th3\">用户ID</div>\n" +
        "                                                        <div class=\"table-th\">注册日期</div>\n" +
        "                                                        <div class=\"table-th\">用户名</div>\n" +
        "                                                        <div class=\"table-th\">绑定手机</div>\n" +
        "                                                        <div class=\"table-th\">用户账号</div>\n" +
        "                                                        <div class=\"table-th\">账户状态</div>\n" +
        "                                                        <div class=\"table-th\">管理员账号设置停用</div>\n" +
        "                                                    </div>");
    layer.load();
    var dataTemp = null;
    $.ajax({
        url:url,
        async:false,
        success:function (data) {
            dataTemp = data;
            //填充表格数据
            var tableDatas = data.datas==null?"":data.datas;
            $.each(tableDatas,function (i,value) {
                var timestamp = parseInt(Date.parse(new Date()));
                var tel = change(value.USER_TEL);
                var time =timeStamp2String(value.REGIST_DATE);
                var status = change2(value.ADMIN_LOCK);
                var lockTime = value.ADMIN_LOCK==null?0:value.ADMIN_LOCK;
                if(timestamp>lockTime) {
                    $(".table").append("<div class=\"table-tr\">\n" +
                        "                                                        <div class=\"table-td\">" + value.USER_ID + "</div>\n" +
                        "                                                        <div class=\"table-td\">" + time + "</div>\n" +
                        "                                                        <div class=\"table-td\"><a href='javascript:void(0)'  class='userDetail'>" + value.USER_NAME + "</a></div>\n" +
                        "                                                        <div class=\"table-td\">" + tel + "</div>\n" +
                        "                                                        <div class=\"table-td\">" + value.LOGIN_NAME + "</div>\n" +
                        "                                                        <div class=\"table-td\">" + status + "</div>\n" +
                        "                                                        <div class=\"table-td\">\n" +
                        "                                                            停用\n" +
                        "                                                            <input class='checkNum' type=\"number \" value=\"24\">小时\n" +
                        "                                                            \n" +
                        "                                                            <span class=\"codebtn\">保存</span>\n" +
                        "                                                        </div>\n" +
                        "                                                    </div>");
                }else{
                    $(".table").append("<div class=\"table-tr gray\">\n" +
                        "                                                        <div class=\"table-td\">" + value.USER_ID + "</div>\n" +
                        "                                                        <div class=\"table-td\">" + time + "</div>\n" +
                        "                                                        <div class=\"table-td\"><a href='javascript:void(0)'  class='userDetail'>" + value.USER_NAME + "</a></div>\n" +
                        "                                                        <div class=\"table-td\">" + tel + "</div>\n" +
                        "                                                        <div class=\"table-td\">" + value.LOGIN_NAME + "</div>\n" +
                        "                                                        <div class=\"table-td\">" + status + "</div>\n" +
                        "                                                        <div class=\"table-td\">\n" +
                        "                                                            停用\n" +
                        "                                                            <input class='checkNum' type=\"number \" value=\"24\">小时\n" +
                        "                                                            \n" +
                        "                                                            <span class=\"grayBtn\">禁用中</span>\n" +
                        "                                                        </div>\n" +
                        "                                                    </div>");
                }
            });

            $('.userDetail').click(function () {
                $('.tab-nav').find('li').eq(1).show();
                $('.tab-nav').find('li').eq(1).click();
                var userId = $(this).parent().parent().find('div').eq(0).text();
                var url = api+'queryUserInfoByUserId?userId='+encodeURI(userId);
                $.getJSON(url,function (data) {
                   data = data.datas[0] ==null?'': data.datas[0];
                    var tel = change(data.USER_TEL);
                    var password = change(data.LOGIN_WORD);
                    var qq = data.USER_QQ == ""?'--':data.USER_QQ;
                    var mail = data.USER_MAIL == ""?'--':data.USER_MAIL;
                    var bar = data.USER_BAR == ""?'--':data.USER_BAR;
                    var weixin = data.USER_WEIXIN == ""?'--':data.USER_WEIXIN;
                    var zfb = data.USER_ZFB == ""?'--':data.USER_ZFB;
                    var sfz = data.USER_SFZ == ""?'--':data.USER_SFZ;
                    var time = timeStamp2String(data.REGIST_DATE);
                    function timeStamp2String (time){
                        var datetime = new Date();
                        datetime.setTime(time);
                        var year = datetime.getFullYear();
                        var month = datetime.getMonth() + 1;
                        var date = datetime.getDate();
                        var hour = datetime.getHours();
                        var min = datetime.getMinutes();
                        var second = datetime.getSeconds();
                        if(parseInt(month)<10){
                            month = '0'+month;
                        }
                        if(parseInt(date)<10){
                            date = '0'+date;
                        }
                        if(parseInt(hour)<10){
                            hour = '0'+hour;
                        }
                        if(parseInt(min)<10){
                            min = '0'+min;
                        }
                        if(parseInt(second)<10){
                            second = '0'+second;
                        }
                        return year + "-" + month + "-" + date+" "+hour+":"+min+":"+second;
                    };
                    $('.mid').eq(0).text(data.USER_ID);
                    $('.mid').eq(1).text(time);
                    $('.mid').eq(2).text(data.LOGIN_NAME);
                    $('.mid').eq(3).text(password);
                    $('.mid').eq(4).text(data.USER_NAME);
                    $('.mid').eq(5).text(data.USER_SEX);
                    $('.mid').eq(6).text(tel);
                    $('.mid').eq(7).text(qq);
                    $('.mid').eq(8).text(mail);
                    $('.mid').eq(9).text(bar);
                    $('.mid').eq(10).text(weixin);
                    $('.mid').eq(11).text(zfb);
                    $('.mid').eq(12).text(sfz);
                });
            });

            $('.codebtn').click(function () {
                var userId = $(this).parent().parent().find('div').eq(0).text();
                var hour = $(this).parent().find('input').val();
                if(hour==""){
                    layer.msg("请填写禁用时间!");
                }else {
                    var url = api + 'editLockTime?userId=' + encodeURI(userId) + "&hour=" + encodeURI(hour);
                    $.getJSON(url, function (data) {
                        layer.msg(data.info)
                    });
                }
            });

            function change(str) {
                if(str==""){
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
            function timeStamp2String (time){
                var datetime = new Date();
                datetime.setTime(time);
                var year = datetime.getFullYear();
                var month = datetime.getMonth() + 1;
                var date = datetime.getDate();
                var hour =datetime.getHours();
                var min = datetime.getMinutes();
                if(parseInt(month)<10){
                    month = '0'+month;
                }
                if(parseInt(date)<10){
                    date = '0'+date;
                }
                if(parseInt(hour)<10){
                    hour = '0'+hour;
                }
                if(parseInt(min)<10){
                    min = '0'+min;
                }
                return year + "-" + month + "-" + date+' '+hour+":"+min;
            };
            function change2(str) {
                var str =timeStamp2String(str);
                if(str==null){
                    return "--";
                }
                str = str.split('-')[0]+str.split('-')[1]+str.split('-')[2];
                str = parseInt(str);
                var date  = parseInt(new DateUtil().formatDate("yyyyMMdd",new Date()));
                if(date>str){
                    return "正常";
                }else{
                    return "禁用";
                }

            }
        },
        complete:function () {
            layer.closeAll();
            var pageList = dataTemp.pageList==null?"":dataTemp.pageList;
            if(pageList!=""){
                initPage(pageList,keyNum);
            }else{
                $('.pagination').empty();
                layer.msg("加载数据出错!");
            }
            $('.checkNum').unbind('blur');
            $('.checkNum').blur(function () {
                var val = $('.checkNum').val();
                if(isNaN(Number(val))){  //当输入不是数字的时候，Number后返回的值是NaN;然后用isNaN判断。
                    layer.msg("禁用时间必须为数字!");
                    $(this).val("");
                }
            });
        },
        error:function () {
            layer.closeAll();
            layer.msg("数据请求失败!")
        }

    });
}

//加载搜索框
function initSeach() {
    $('.search-l').unbind("click");
    $('.search-l').click(function () {
        var shape = $('.w250').val();
        var type = $('.dropdown-toggle').text();
        if(shape==""){
            initTable();
        }else {
            if(type.indexOf('用户账号')>-1){
                type = 1;
            }else if(type.indexOf('用户名')>-1){
                type = 2;
            }else if(type.indexOf('手机号')>-1){
                type = 3;
            }
            url = api + 'queryUserInfo?shape=' + encodeURI(shape)
                +'&type='+encodeURI(type)
                +'&num=0';
            initTable(url);
        }
    });
}


//加载分页组件
function initPage(pageList,keyNum) {
    var pageDatas = pageList;
    pageList = pageList==null?100:pageList-1;
    var pageNum = parseInt(pageList/20)+1;
    $('.pagination').empty();
    if(keyNum==null) {
        if (pageNum > 6) {
            $('.pagination').append(
                "          <li class=\"disabled\"><a href=\"javascript:void(0)\">首页</a></li>\n" +
                "          <li class=\"disabled\"><a href=\"javascript:void(0)\">上一页</a></li>\n" +
                "          <li class=\"active\"><a href=\"javascript:void(0)\">1</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">2</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">3</a></li>\n" +
                "          <li class=\"disabled\"><a href=\"javascript:void(0)\">...</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">" + parseInt(pageNum - 1) + "</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">" + pageNum + "</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">下一页</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">尾页</a></li>\n"
            );
        } else {
            $('.pagination').append(
                "          <li class=\"disabled\"><a href=\"javascript:void(0)\">首页</a></li>\n" +
                "          <li class=\"disabled\"><a href=\"javascript:void(0)\">上一页</a></li>\n"
            );
            for (var i = 1; i <= pageNum; i++) {
                if(i==1){
                    $('.pagination').append(
                        "          <li class=\"active\"><a href=\"javascript:void(0)\">" + i + "</a></li>\n"
                    );
                }else {
                    $('.pagination').append(
                        "          <li><a href=\"javascript:void(0)\">" + i + "</a></li>\n"
                    );
                }
            }
            if (pageNum == 1) {
                $('.pagination').append(
                    "          <li class=\"disabled\"><a href=\"javascript:void(0)\">下一页</a></li>\n" +
                    "          <li class=\"disabled\"><a href=\"javascript:void(0)\">尾页</a></li>\n"
                );
            } else {
                $('.pagination').append(
                    "          <li><a href=\"javascript:void(0)\">下一页</a></li>\n" +
                    "          <li><a href=\"javascript:void(0)\">尾页</a></li>\n"
                );
            }
        }
    }else{
        keyNum=parseInt(keyNum);
        if(keyNum>pageNum){
            layer.msg("分页组件加载错误!");
        }else if(keyNum==1){
            initPage(pageDatas);
        }else if(keyNum==2){
            if (pageNum > 6) {
                $('.pagination').append(
                    "          <li><a href=\"javascript:void(0)\">首页</a></li>\n" +
                    "          <li><a href=\"javascript:void(0)\">上一页</a></li>\n" +
                    "          <li><a href=\"javascript:void(0)\">1</a></li>\n" +
                    "          <li class=\"active\"><a href=\"javascript:void(0)\">2</a></li>\n" +
                    "          <li><a href=\"javascript:void(0)\">3</a></li>\n" +
                    "          <li  class=\"disabled\"><a href=\"javascript:void(0)\">...</a></li>\n" +
                    "          <li><a href=\"javascript:void(0)\">" + parseInt(pageNum - 1) + "</a></li>\n" +
                    "          <li><a href=\"javascript:void(0)\">" + pageNum + "</a></li>\n" +
                    "          <li><a href=\"javascript:void(0)\">下一页</a></li>\n" +
                    "          <li><a href=\"javascript:void(0)\">尾页</a></li>\n"
                );
            } else {
                $('.pagination').append(
                    "          <li><a href=\"javascript:void(0)\">首页</a></li>\n" +
                    "          <li><a href=\"javascript:void(0)\">上一页</a></li>\n"
                );
                for (var i = 1; i <= pageNum; i++) {
                    if(i==keyNum){
                        $('.pagination').append(
                            "          <li class=\"active\"><a href=\"javascript:void(0)\">" + i + "</a></li>\n"
                        );
                    }else {
                        $('.pagination').append(
                            "          <li><a href=\"javascript:void(0)\">" + i + "</a></li>\n"
                        );
                    }
                }
                if(pageNum!=2) {
                    $('.pagination').append(
                        "          <li><a href=\"javascript:void(0)\">下一页</a></li>\n" +
                        "          <li><a href=\"javascript:void(0)\">尾页</a></li>\n"
                    );
                }else{
                    $('.pagination').append(
                        "          <li class=\"disabled\"><a href=\"javascript:void(0)\">下一页</a></li>\n" +
                        "          <li class=\"disabled\"><a href=\"javascript:void(0)\">尾页</a></li>\n"
                    );
                }
            }
        }else if(keyNum==3){
            if (pageNum > 6) {
                $('.pagination').append(
                    "          <li><a href=\"javascript:void(0)\">首页</a></li>\n" +
                    "          <li><a href=\"javascript:void(0)\">上一页</a></li>\n" +
                    "          <li  class=\"disabled\"><a href=\"javascript:void(0)\">...</a></li>\n" +
                    "          <li><a href=\"javascript:void(0)\">2</a></li>\n" +
                    "          <li  class=\"active\"><a href=\"javascript:void(0)\">3</a></li>\n" +
                    "          <li><a href=\"javascript:void(0)\">4</a></li>\n" +
                    "          <li  class=\"disabled\"><a href=\"javascript:void(0)\">...</a></li>\n" +
                    "          <li><a href=\"javascript:void(0)\">" + parseInt(pageNum - 1) + "</a></li>\n" +
                    "          <li><a href=\"javascript:void(0)\">" + pageNum + "</a></li>\n" +
                    "          <li><a href=\"javascript:void(0)\">下一页</a></li>\n" +
                    "          <li><a href=\"javascript:void(0)\">尾页</a></li>\n"
                );
            } else {
                $('.pagination').append(
                    "          <li><a href=\"javascript:void(0)\">首页</a></li>\n" +
                    "          <li><a href=\"javascript:void(0)\">上一页</a></li>\n"
                );
                for (var i = 1; i <= pageNum; i++) {
                    if(i==keyNum){
                        $('.pagination').append(
                            "          <li class=\"active\"><a href=\"javascript:void(0)\">" + i + "</a></li>\n"
                        );
                    }else {
                        $('.pagination').append(
                            "          <li><a href=\"javascript:void(0)\">" + i + "</a></li>\n"
                        );
                    }
                }
                if(pageNum==3){
                    $('.pagination').append(
                        "          <li class=\"disabled\"><a href=\"javascript:void(0)\">下一页</a></li>\n" +
                        "          <li class=\"disabled\"><a href=\"javascript:void(0)\">尾页</a></li>\n"
                    );
                }else {
                    $('.pagination').append(
                        "          <li><a href=\"javascript:void(0)\">下一页</a></li>\n" +
                        "          <li><a href=\"javascript:void(0)\">尾页</a></li>\n"
                    );
                }
            }
        }else if(pageNum-keyNum>3&&keyNum>=4){
            $('.pagination').append(
                "          <li><a href=\"javascript:void(0)\">首页</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">上一页</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">1</a></li>\n" +
                "          <li  class=\"disabled\"><a href=\"javascript:void(0)\">...</a></li>\n"
            );
            $('.pagination').append(
                "          <li><a href=\"javascript:void(0)\">" + parseInt(keyNum-1) + "</a></li>\n"+
                "          <li  class=\"active\"><a href=\"javascript:void(0)\">" + keyNum + "</a></li>\n"+
                "          <li><a href=\"javascript:void(0)\">" + parseInt(keyNum+1) + "</a></li>\n"
            );
            $('.pagination').append(
                "          <li  class=\"disabled\"><a href=\"javascript:void(0)\">...</a></li>\n"+
                "          <li><a href=\"javascript:void(0)\">" + pageNum + "</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">下一页</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">尾页</a></li>\n"
            );
        }else if(keyNum==pageNum){
            $('.pagination').append(
                "          <li><a href=\"javascript:void(0)\">首页</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">上一页</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">1</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">2</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">3</a></li>\n" +
                "          <li  class=\"disabled\"><a href=\"javascript:void(0)\">...</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">" + parseInt(pageNum - 1) + "</a></li>\n" +
                "          <li   class=\"active\"><a href=\"javascript:void(0)\">" + pageNum + "</a></li>\n" +
                "          <li  class=\"disabled\"><a href=\"javascript:void(0)\">下一页</a></li>\n" +
                "          <li  class=\"disabled\"><a href=\"javascript:void(0)\">尾页</a></li>\n"
            );
        }else if(keyNum==parseInt(pageNum-1)){
            $('.pagination').append(
                "          <li><a href=\"javascript:void(0)\">首页</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">上一页</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">1</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">2</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">3</a></li>\n" +
                "          <li  class=\"disabled\"><a href=\"javascript:void(0)\">...</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">" + parseInt(keyNum - 1) + "</a></li>\n" +
                "          <li  class=\"active\"><a href=\"javascript:void(0)\">" + keyNum + "</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">" + parseInt(keyNum+1) + "</a></li>\n" +
                "          <li  class=\"disabled\"><a href=\"javascript:void(0)\">下一页</a></li>\n" +
                "          <li  class=\"disabled\"><a href=\"javascript:void(0)\">尾页</a></li>\n"
            );
        }else{
            $('.pagination').append(
                "          <li><a href=\"javascript:void(0)\">首页</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">上一页</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">1</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">2</a></li>\n" +
                "          <li  class=\"disabled\"><a href=\"javascript:void(0)\">...</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">" + parseInt(keyNum - 1) + "</a></li>\n" +
                "          <li   class=\"active\"><a href=\"javascript:void(0)\">" + keyNum + "</a></li>\n" +
                "          <li  class=\"disabled\"><a href=\"javascript:void(0)\">...</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">" + pageNum + "</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">下一页</a></li>\n" +
                "          <li><a href=\"javascript:void(0)\">尾页</a></li>\n"
            );
        }
    }
    $('.pagination li').each(function () {
        $(this).unbind("click");
        if($(this).attr("class")!='disabled' && $(this).attr("class")!='active'){
            $(this).click(function () {
                var num = $(this).find('a').text();
                if(num=='首页'){
                    initTable();
                }else if(num=='上一页'){
                    var num = parseInt($('.pagination').find('.active').find('a').text())-1;
                    initTable(null,num);
                }else if(num=='下一页'){
                    var num = parseInt($('.pagination').find('.active').find('a').text())+1;
                    initTable(null,num);
                }else if(num=='尾页'){
                    initTable(null,pageNum);
                }else{
                    initTable(null,num);
                }
            });
        }
    })
}