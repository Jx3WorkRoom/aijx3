api = api+"blackList/";
//设置一个省的公共下标
var pIndex = -1;
var preEle = document.getElementById("pre");
var cityEle = document.getElementById("city");
var areaEle = document.getElementById("area");
var userId = '';
$(function () {
    initTable();
    initSeach();
    timer();
    var username = $('#userName').text();
    var useNameurl = api+'getUserId?username='+encodeURI(username);
    $.getJSON(useNameurl,function (data) {
        userId = data.userId;
    });
});


function timer() {
    setInterval("timeFun()",10*60*1000)
    function timeFun() {
        initTable();
        initSeach();
    }
}
//url 查询时传入新的url
//keyNum page组件点击的第几页
function initTable(url,keyNum) {
    var startNum = 0;
    var endNum =20;
    if(keyNum!=null){
        endNum = 20;
        startNum = keyNum*20-20;
    }
    if(url==null) {
        url = api+'getblackListAction?startNum='+encodeURI(startNum)+'&endNum='+encodeURI(endNum);
    }
    $(".table").empty();
    $(".table").append("<div class=\"table-tr tablered\">\n" +
        "            <div class=\"table-th table-th1\" style=\"width: 11% !important;padding-left: 30px;\">欺诈类型</div>\n" +
        "            <div class=\"table-th\">黑鬼资料</div>\n" +
        "            <div class=\"table-th\">涉及区服</div>\n" +
        "            <div class=\"table-th\">上榜时间</div>\n" +
        "        <div class=\"table-th\">收藏</div>\n" +
        "          </div>");
    layer.load();
    var dataTemp = null;
    $.ajax({
        url:url,
        async:true,
        success:function (data) {
            dataTemp = data;
            //填充表格数据
            var tableDatas = data.datas==null?"":data.datas;
                $.each(tableDatas, function (i, value) {
                    var time = sumTime(value.FAVOR_DATE);
                    var username = $('#userName').text();
                    var belongOf = value.BELONG_QF.replace("[", "");
                    belongOf = belongOf.replace("]", "");
                    if(belongOf.length>6) {
                        belongOf = replace(belongOf);
                    }
                    belongOf = belongOf.split(',')[0];
                    var username = $('#userName').text();
                    if(userId!=""){
                        if(userId!=value.userIdColl){
                            value.COLL_TYPE=0;
                        }
                    }else{
                        value.COLL_TYPE=0;
                    }
                    var cheatInfo = getNewline(value.CHEAT_INFO);
                    function getNewline(val) {
                        var str = new String(val);
                        var bytesCount = 0;
                        var s="";
                        for (var i = 0 ,n = str.length; i < n; i++) {
                            var c = str.charCodeAt(i);
                            //统计字符串的字符长度
                            if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
                                bytesCount += 1;
                            } else {
                                bytesCount += 2;
                            }
                            //换行
                            s += str.charAt(i);
                            if(bytesCount>=80){
                                s = s + '<br>';
                                //重置
                                bytesCount=0;
                            }
                        }
                        return s;
                    }
                    if (value.COLL_TYPE == null || value.COLL_TYPE == 0 || username == '') {
                        $(".table").append("<div class=\"table-tr\">\n" +
                            "        <div class=\"table-td main_id\" style='display: none'>" + value.MAIN_ID + "</div>\n" +
                            "        <div class=\"table-td replyTime\" style='display: none'>" + value.FAVOR_DATE + "</div>\n" +
                            "        <div class=\"table-td\">" + value.PAR_NAME + "</div>\n" +
                            "       <div class=\"table-td\"><a href=\"blackDetail?favorId=" + value.FAVOR_ID + "\" target='_blank'>" + cheatInfo + "</a></div>" +
                            "              <div class=\"table-td \">" + belongOf + "</div>\n" +
                            "              <div class=\"table-td\">" + time + "</div>\n" +
                            "        <div class=\"table-td\"><i class=\"icon-save\"></i></div>\n" +
                            "          </div>");
                    } else {
                        $(".table").append("<div class=\"table-tr\">\n" +
                            "        <div class=\"table-td main_id\" style='display: none'>" + value.MAIN_ID + "</div>\n" +
                            "        <div class=\"table-td replyTime\" style='display: none'>" + value.FAVOR_DATE + "</div>\n" +
                            "        <div class=\"table-td\">" + value.PAR_NAME + "</div>\n" +
                            "       <div class=\"table-td\"><a href=\"blackDetail?favorId=" + value.FAVOR_ID + "\" target='_blank'>" + cheatInfo + "</a></div>" +
                            "              <div class=\"table-td \">" + belongOf + "</div>\n" +
                            "              <div class=\"table-td\">" + time + "</div>\n" +
                            "        <div class=\"table-td\"><i class=\"icon-save cur\"></i></div>\n" +
                            "          </div>");
                    }
                });

                function replace(str) {
                    str = str.replace("电月", "");
                    str = str.replace("电点", "");
                    str = str.replace("网点", "");
                    str = str.replace("网月", "");
                    str = str.replace("双点", "");
                    str = str.replace("双月", "");
                    return str;
                }

                //计算上架时间
                function sumTime(time) {
                    function timeStamp2String(time) {
                        var datetime = new Date();
                        datetime.setTime(time);
                        var year = datetime.getFullYear();
                        var month = datetime.getMonth() + 1;
                        var date = datetime.getDate();
                        if (parseInt(month) < 10) {
                            month = '0' + month;
                        }
                        if (parseInt(date) < 10) {
                            date = '0' + date;
                        }
                        return year + "-" + month + "-" + date;
                    };
                    time = timeStamp2String(time);
                    var timeArr = time.trim().split('-');
                    return timeArr[0] + '年' + timeArr[1] + '月' + timeArr[2] + '日';
                }

                //收藏
                $('.icon-save').click(function () {
                    var username = $('#userName').text();
                    var mainId = $(this).parent().parent().find('.main_id').text();
                    var replyTime = $(this).parent().parent().find('.replyTime').text();
                    var isValided = null;
                    if (username == "") {
                        location.href = 'login';
                    } else {
                        if ($(this).attr('class').indexOf('cur') > -1) {
                            $(this).removeClass('cur');
                            isValided = 0;
                        } else {
                            $(this).addClass('cur');
                            isValided = 1;
                        }
                        replyTime = timeStamp2String(replyTime);

                        function timeStamp2String(time) {
                            var datetime = new Date();
                            datetime.setTime(time);
                            var year = datetime.getFullYear();
                            var month = datetime.getMonth() + 1;
                            var date = datetime.getDate();
                            var hour = datetime.getHours();
                            var min = datetime.getMinutes();
                            var second = datetime.getSeconds();
                            if (parseInt(month) < 10) {
                                month = '0' + month;
                            }
                            if (parseInt(date) < 10) {
                                date = '0' + date;
                            }
                            return year + "-" + month + "-" + date + " " + hour + ":" + min + ":" + second;
                        };
                        var url = api + 'userIsvalid?userName=' + encodeURI(username) +
                            '&mainId=' + encodeURI(mainId) +
                            '&isValided=' + encodeURI(isValided) +
                            '&replyTime=' + encodeURI(replyTime);
                        $.getJSON(url, function (data) {
                            layer.msg(data.info);
                        });
                    }
                });
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
        },
        error:function () {
            layer.closeAll();
            layer.msg("数据请求失败!")
        }

    });
}

//加载搜索框
function initSeach() {
        $('.query-l').unbind("click");
        $('.query-l').click(function () {
            var shape = $('.tixin').val();
            if(shape==""){
                initTable();
            }else {
                url = api + 'getblackListAction?shape=' + encodeURI(shape)
                    +'&startNum=0&endNum=20';
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