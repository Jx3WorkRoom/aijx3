api = api+"myRelease/";
var username = "";
$(function () {
    username = $('#userName').text();
    initTable(username);
});

function initTable(name,keyNum) {
    name = username;
    var startNum = 0;
    if(keyNum!=null){
        startNum = keyNum*10-10;
    }
    layer.load();
    var url = api+'myReleaseInfo?userName='+encodeURI(name)+'&num='+encodeURI(startNum);
    var dataTemp=null;
    $.ajax({
        url: url,
        async: false,
        success: function (data) {
            dataTemp=data;
            data = data.datas==null?'':data.datas;
            $('.table').empty();
            $('.table').append("<div class=\"table-tr tablech1\">\n" +
                "                    <div class=\"table-th table-th3\"></div>\n" +
                "                    <div class=\"table-th\">发布类型</div>\n" +
                "                    <div class=\"table-th\">发布内容</div>\n" +
                "                    <div class=\"table-th\">状态</div>\n" +
                "                    <div class=\"table-th\">发布时间</div>\n" +
                "                  </div>");
            if(data!=""){
                $.each(data,function(i,value){
                    var pageValueEdit = "";
                    var pageValue = "";
                    var collectType = "";
                    if(parseInt(value.FAVOR_TYPE)==1){
                        pageValueEdit = 'quickRelease?mainId='+encodeURI(value.MAIN_ID);
                        collectType = '账号简报';
                    }else if(parseInt(value.FAVOR_TYPE)==2){
                        pageValueEdit = 'detailRelease?mainId='+encodeURI(value.MAIN_ID);
                        collectType = '账号详报';
                    }else if(parseInt(value.FAVOR_TYPE)==3){
                        pageValueEdit = 'appearanceTransaction?mainId='+encodeURI(value.MAIN_ID);
                        collectType = '外观交易';
                    }else if(parseInt(value.FAVOR_TYPE)==4){
                        pageValueEdit = 'propTransaction?mainId='+encodeURI(value.MAIN_ID);
                        collectType = '道具交易';
                    }else if(parseInt(value.FAVOR_TYPE)==5){
                        pageValueEdit = 'accountTransaction?mainId='+encodeURI(value.MAIN_ID);
                        collectType = '金币交易';
                    }else if(parseInt(value.FAVOR_TYPE)==6){
                        pageValueEdit = 'accountExchange?mainId='+encodeURI(value.MAIN_ID);
                        collectType = '代练代打';
                    }else if(parseInt(value.FAVOR_TYPE)==7){
                        pageValueEdit = 'report?mainId='+encodeURI(value.MAIN_ID);
                        collectType = '黑鬼举报';
                    }
                    var cont = value.COLLECT_CONT.replace(':','');
                    cont = cont.replace("BELONG_QF","");
                    cont = cont.replace("TIXIN","");
                    cont = cont.replace("TITLE_NAME","");
                    cont = cont.replace("WAIGUAN_NAME","");
                    cont = cont.replace("HORSE_NAME","");
                    cont = cont.replace("ARM_NAME","");
                    cont = cont.replace("STRA_NAME","");
                    cont = cont.replace("PEND_NAME","");
                    var time = timeStamp2String(value.FAVOR_DATE);
                    var stusta =value.COLLECT_STUSTA ==1?"正常":"下架";
                    $('.table').append("<div class=\"table-tr\">\n" +
                        "                    <div class=\"table-td\"><i class=\"icon1\"></i></div>\n" +
                        "                    <div class=\"table-td recordId\" style='display: none'>"+value.RECORD_ID+"</div>\n" +
                        "                    <div class=\"table-td\">"+collectType+"</div>\n" +
                        "                    <div class=\"table-td table_lw\"><a href='"+pageValueEdit+"'>"+cont+"</a></div>\n" +
                        "                    <div class=\"table-td\">"+stusta+"</div>\n" +
                        "                    <div class=\"table-td\">"+time+"</div>\n" +
                        "                  </div>");
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
                });
            }else{
                layer.msg("加载发布信息失败")
            }
            $('.icon1').css({
                "display": "inline-block",
                "background": "url(./dist/css/images/jx3/se0.png) no-repeat",
                "width": "21px",
                "height": "21px",
                "cursor": "pointer",
                "position": "relative",
                "bottom": "-4px"
            });
            $(".icon1").unbind('click');
            $(".icon1").click(function(){
                if($(this).parent().html().indexOf("全选")==-1){
                    if($(this).attr('class').indexOf('cur')>-1){
                        $(this).removeClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se0.png) no-repeat")
                    }else{
                        $(this).addClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se.png) no-repeat")
                    }
                }else{
                    if($(this).attr('class').indexOf('cur')>-1){
                        $(".icon1").removeClass('cur');
                        $(".icon1").css("background","url(./dist/css/images/jx3/se0.png) no-repeat")
                    }else{
                        $(".icon1").addClass('cur');
                        $(".icon1").css("background","url(./dist/css/images/jx3/se.png) no-repeat")
                    }
                }
            });
        },
        complete: function () {
            $('.remove').unbind('click');
            $('.remove').click(function () {
                var ids = [];
                $('.icon1.cur').each(function () {
                    if($(this).parent().html().indexOf("全选")==-1){
                        var recordId = $(this).parent().parent().find('.recordId').text();
                        ids.push(recordId);
                    }
                });
                var url = api+'removeRecord?ids='+encodeURI(ids);
                $.getJSON(url,function (data) {
                    layer.msg(data.info);
                }).error(function () {
                    layer.msg("删除异常!");
                }).complete(function () {
                    $('.table').empty();
                    $('.table').append("<div class=\"table-tr tablech1\">\n" +
                        "                    <div class=\"table-th table-th3\"></div>\n" +
                        "                    <div class=\"table-th\">发布类型</div>\n" +
                        "                    <div class=\"table-th\">发布内容</div>\n" +
                        "                    <div class=\"table-th\">状态</div>\n" +
                        "                    <div class=\"table-th\">发布时间</div>\n" +
                        "                  </div>");
                    initTable(username);
                });
            });
            layer.closeAll();
            var pageList = dataTemp.pageList==null?"":dataTemp.pageList;
            if(pageList!=""){
                initPage(pageList,keyNum);
            }else{
                $('.pagination').empty();
            }
        },
        error: function () {
            layer.closeAll("loading");
            layer.msg("加载发布信息失败!");
        }

    });
    // $.getJSON(url,function (data) {
    // }).error(function () {
    // }).complete(function () {
    // });
}

function initPage(pageList,keyNum) {
    var pageDatas = pageList;
    pageList = pageList==null?100:pageList-1;
    var pageNum = parseInt(pageList/10)+1;
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