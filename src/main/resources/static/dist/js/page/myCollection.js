api = api+"myCollection/";
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
    var url = api+'myCollectionInfo?userName='+encodeURI(name)+'&num='+encodeURI(startNum);
    var dataTemp=null;
    $.getJSON(url,function (data) {
        dataTemp=data;
        data = data.datas==null?'':data.datas;
        if(data!=""){
            $('.table').empty();
            $('.table').append("<div class=\"table-tr tablech1\">\n" +
                "                    <div class=\"table-th table-th3\"></div>\n" +
                "                    <div class=\"table-th\">收藏类别</div>\n" +
                "                    <div class=\"table-th\">收藏内容资料简介</div>\n" +
                "                    <div class=\"table-th\">状态</div>\n" +
                "                    <div class=\"table-th\">收藏时间</div>\n" +
                "                    <div class=\"table-th\">发布时间</div>\n" +
                "                  </div>");
            $.each(data,function(i,value){
                var collectType = "";
                if(parseInt(value.COLLECT_TYPE)==1){
                    collectType = '账号交易';
                }else if(parseInt(value.COLLECT_TYPE)==2){
                    collectType = '外观交易';
                }else if(parseInt(value.COLLECT_TYPE)==3){
                    collectType = '道具交易';
                }else if(parseInt(value.COLLECT_TYPE)==4){
                    collectType = '金币交易';
                }else if(parseInt(value.COLLECT_TYPE)==5){
                    collectType = '代练代打';
                }else if(parseInt(value.COLLECT_TYPE)==6){
                    collectType = '剑三黑鬼';
                }
                // else if(parseInt(value.COLLECT_TYPE)==7){
                //     collectType = '金币交易';
                // }else if(parseInt(value.COLLECT_TYPE)==8){
                //     collectType = '代练代打';
                // }
                var time =timeStamp2String(value.FAVOR_DATE);
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
                var cont = value.COLLECT_CONT.replace("【","");
                cont = cont.replace("】","");
                cont = cont.replace("[","");
                cont = cont.replace("]","");
                cont = cont.split('').join('');
                var stusta = value.COLLECT_STUSTA!=0?'正常':'失效';
                $('.table').append("<div class=\"table-tr\">\n" +
                    "                    <div class=\"table-td\"><i class=\"icon1\"></i></div>\n" +
                    "                    <div class=\"table-td recordId\" style='display: none'>"+value.RECORD_ID+"</div>\n" +
                    "                    <div class=\"table-td\">"+collectType+"</div>\n" +
                    "                    <div class=\"table-td table_lw\">"+cont+"</div>\n" +
                    "                    <div class=\"table-td warn\">"+stusta+"</div>\n" +
                    "                    <div class=\"table-td\">"+value.COLLECT_DATE+"</div>\n" +
                    "                    <div class=\"table-td\">"+time+"</div>\n" +
                    "                  </div>");
            });
        }else{
            $('.table').empty();
            $('.table').append("<div class=\"table-tr tablech1\">\n" +
                "                    <div class=\"table-th table-th3\"></div>\n" +
                "                    <div class=\"table-th\">收藏类别</div>\n" +
                "                    <div class=\"table-th\">收藏内容资料简介</div>\n" +
                "                    <div class=\"table-th\">状态</div>\n" +
                "                    <div class=\"table-th\">收藏时间</div>\n" +
                "                    <div class=\"table-th\">发布时间</div>\n" +
                "                  </div>");
            layer.msg("暂无收藏!");
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
    }).error(function () {
       layer.msg("加载收藏信息失败!");
    }).complete(function () {
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
               initTable(username);
           });
        });
        layer.closeAll();
        var pageList = dataTemp.pageList==null?"":dataTemp.pageList;
        if(pageList!=""){
            initPage(pageList,keyNum);
        }else{
            $('.pagination').empty();
            layer.msg("暂无收藏!");
        }
    });
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