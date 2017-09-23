api = api+'myService/';
var username = "";
$(function () {
    username = $('#userName').text();
    initTable1();
    $('.userManage .tab-nav li').click(function () {
        $(this).addClass('cur').siblings('li').removeClass('cur');
        var liindex=$(this).index();
        if(liindex==0){
            initTable1();
        }else if(liindex==1){
            initTable2();
        }else if(liindex==2){
            initTable3();
        }
        var tabcontent=$('.tab-content .group');
        $(tabcontent[liindex]).show().siblings('.group').hide();
    });
});

function initTable1() {
    var url =api+'getServiceDetail?username='+encodeURI(username)+'&type=1';
    $.getJSON(url,function (data) {
        data = data.datas==null?'':data.datas;
        if(data!=""){
            $('#table1').empty();
            $('#table1').append("<div class=\"table-tr tablech1\">\n" +
                "                          <div class=\"table-th table-th3\">服务事项</div>\n" +
                "                          <div class=\"table-th\">剩余条数</div>\n" +
                "                          <div class=\"table-th\">状态</div>\n" +
                // "                          <div class=\"table-th\">续费付款</div>\n" +
                "                        </div>");
            $.each(data,function(i,value){
                var status = value.SURPLUS_NUM>0?'正常':'结束';
                if(status=='结束'){
                    $('#table1').append("<div class=\"table-tr\">\n" +
                        "                         <div class=\"table-td\">" + value.mod_name + "</div>\n" +
                        "                          <div class=\"table-td\">" + value.SURPLUS_NUM + "</div>\n" +
                        "                          <div class=\"table-td\">" + status + "</div>\n" +
                        // "                          <div class=\"table-td warn\"><a class=\"warn\" href=\"sale.html?userId="+value.USER_ID+"&mod_name="+encodeURI(value.mod_name)+"\">请付费</a></div>\n" +
                        "                        </div>");
                }else {
                    $('#table1').append("<div class=\"table-tr\">\n" +
                        "                          <div class=\"table-td\">" + value.mod_name + "</div>\n" +
                        "                          <div class=\"table-td\">" + value.SURPLUS_NUM + "</div>\n" +
                        "                          <div class=\"table-td\">" + status + "</div>\n" +
                        // "                          <div class=\"table-td warn\"><a href=\"sale.html?userId="+value.USER_ID+"&mod_name="+encodeURI(value.mod_name)+"\">可续费</a></div>\n" +
                        "                        </div>");
                }
            });

        }else{
            layer.msg("加载数据出错!");
        }
    }).error(function () {
        layer.msg("加载数据出错!");
    });
}

function initTable2(keyNum) {
    var num = 0;
    if(keyNum!=null){
        num = keyNum*20-20;
    }
    layer.load();
    var dataTemp=null;
    var url =api+'getServiceDetail?username='+encodeURI(username)+'&type=2&num='+encodeURI(num);
    $.getJSON(url,function (data) {
        dataTemp=data;
        data = data.datas==null?'':data.datas;
        if(data!=""){
            $('#table2').empty();
            $('#table2').append("<div class=\"table-tr tablech1\">\n" +
                "                          <div class=\"table-th table-th3\">服务事项</div>\n" +
                "                          <div class=\"table-th\">付费日期</div>\n" +
                "                          <div class=\"table-th\">付费额</div>\n" +
                "                          <div class=\"table-th\">新增条数</div>\n" +
                "                        </div>");
            $.each(data,function(i,value){
                var costDate  = value.COST_DATE==null?'--':value.COST_DATE;
                $('#table2').append("<div class=\"table-tr\">\n" +
                    "                          <div class=\"table-td\">"+value.mod_name+"</div>\n" +
                    "                          <div class=\"table-td\">"+costDate+"</div>\n" +
                    "                          <div class=\"table-td\">"+value.COST_QUOTA+"元</div>\n" +
                    "                          <div class=\"table-td warn\">"+value.SERVER_NUM+"</div>\n" +
                    "                        </div>");
            });

        }else{
            layer.msg("加载数据出错!");
        }
    }).error(function () {
        layer.msg("加载数据出错!");
    }).complete(function () {
        layer.closeAll();
        var pageList = dataTemp.pageList==null?"":dataTemp.pageList;
        if(pageList!=""){
            initPage2(pageList,keyNum);
        }else{
            $('#page2').empty();
            layer.msg("加载数据出错!");
        }
    });
}

function initTable3(keyNum) {
    var num = 0;
    if(keyNum!=null){
        num = keyNum*20-20;
    }
    layer.load();
    var dataTemp=null;
    var url =api+'getServiceDetail?username='+encodeURI(username)+'&type=3&num='+encodeURI(num);
    $.getJSON(url,function (data) {
        dataTemp=data;
        data = data.datas==null?'':data.datas;
        if(data!=""){
            $('#table3').empty();
            $('#table3').append("<div class=\"table-tr tablech1\">\n" +
                "                          <div class=\"table-th table-th3\">服务事项</div>\n" +
                "                          <div class=\"table-th\">查看时间</div>\n" +
                "                          <div class=\"table-th\">记录ID</div>\n" +
                "                          <div class=\"table-th\">剩余条数</div>\n" +
                "                        </div>");
            $.each(data,function(i,value){
                var time =timeStamp2String(value.CHANGE_TIME);
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
                var mainId = value.MAIN_ID ==null?'--':value.MAIN_ID;
                $('#table3').append("<div class=\"table-tr\">\n" +
                    "                          <div class=\"table-td\">"+value.mod_name+"</div>\n" +
                    "                          <div class=\"table-td\">"+time+"</div>\n" +
                    "                          <div class=\"table-td\">"+mainId+"</div>\n" +
                    "                          <div class=\"table-td warn\">"+value.SURPLUS_NUM+"</div>\n" +
                    "                        </div>");
            });

        }else{
            layer.msg("加载数据出错!");
        }
    }).error(function () {
        layer.msg("加载数据出错!");
    }).complete(function () {
        layer.closeAll();
        var pageList = dataTemp.pageList==null?"":dataTemp.pageList;
        if(pageList!=""){
            initPage3(pageList,keyNum);
        }else{
            $('#page3').empty();
            layer.msg("加载数据出错!");
        }
    });
}

function initPage2(pageList,keyNum) {
    var pageDatas = pageList;
    pageList = pageList==null?100:pageList-1;
    var pageNum = parseInt(pageList/20)+1;
    $('#page2').empty();
    if(keyNum==null) {
        if (pageNum > 6) {
            $('#page2').append(
                "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">首页</a></li>\n" +
                "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">上一页</a></li>\n" +
                "          <li class=\"active\"><a href=\"javascrpit:void(0)\">1</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">2</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">3</a></li>\n" +
                "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">...</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">" + parseInt(pageNum - 1) + "</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">" + pageNum + "</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
            );
        } else {
            $('#page2').append(
                "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">首页</a></li>\n" +
                "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">上一页</a></li>\n"
            );
            for (var i = 1; i <= pageNum; i++) {
                if(i==1){
                    $('#page2').append(
                        "          <li class=\"active\"><a href=\"javascrpit:void(0)\">" + i + "</a></li>\n"
                    );
                }else {
                    $('#page2').append(
                        "          <li><a href=\"javascrpit:void(0)\">" + i + "</a></li>\n"
                    );
                }
            }
            if (pageNum == 1) {
                $('#page2').append(
                    "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                    "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
                );
            } else {
                $('#page2').append(
                    "          <li><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
                );
            }
        }
    }else{
        keyNum=parseInt(keyNum);
        if(keyNum>pageNum){
            layer.msg("分页组件加载错误!");
        }else if(keyNum==1){
            initPage2(pageDatas);
        }else if(keyNum==2){
            if (pageNum > 6) {
                $('#page2').append(
                    "          <li><a href=\"javascrpit:void(0)\">首页</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">上一页</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">1</a></li>\n" +
                    "          <li class=\"active\"><a href=\"javascrpit:void(0)\">2</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">3</a></li>\n" +
                    "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">...</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">" + parseInt(pageNum - 1) + "</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">" + pageNum + "</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
                );
            } else {
                $('#page2').append(
                    "          <li><a href=\"javascrpit:void(0)\">首页</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">上一页</a></li>\n"
                );
                for (var i = 1; i <= pageNum; i++) {
                    if(i==keyNum){
                        $('#page2').append(
                            "          <li class=\"active\"><a href=\"javascrpit:void(0)\">" + i + "</a></li>\n"
                        );
                    }else {
                        $('#page2').append(
                            "          <li><a href=\"javascrpit:void(0)\">" + i + "</a></li>\n"
                        );
                    }
                }
                if(pageNum!=2) {
                    $('#page2').append(
                        "          <li><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                        "          <li><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
                    );
                }else{
                    $('#page2').append(
                        "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                        "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
                    );
                }
            }
        }else if(keyNum==3){
            if (pageNum > 6) {
                $('#page2').append(
                    "          <li><a href=\"javascrpit:void(0)\">首页</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">上一页</a></li>\n" +
                    "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">...</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">2</a></li>\n" +
                    "          <li  class=\"active\"><a href=\"javascrpit:void(0)\">3</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">4</a></li>\n" +
                    "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">...</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">" + parseInt(pageNum - 1) + "</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">" + pageNum + "</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
                );
            } else {
                $('#page2').append(
                    "          <li><a href=\"javascrpit:void(0)\">首页</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">上一页</a></li>\n"
                );
                for (var i = 1; i <= pageNum; i++) {
                    if(i==keyNum){
                        $('#page2').append(
                            "          <li class=\"active\"><a href=\"javascrpit:void(0)\">" + i + "</a></li>\n"
                        );
                    }else {
                        $('#page2').append(
                            "          <li><a href=\"javascrpit:void(0)\">" + i + "</a></li>\n"
                        );
                    }
                }
                if(pageNum==3){
                    $('#page2').append(
                        "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                        "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
                    );
                }else {
                    $('#page2').append(
                        "          <li><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                        "          <li><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
                    );
                }
            }
        }else if(pageNum-keyNum>3&&keyNum>=4){
            $('#page2').append(
                "          <li><a href=\"javascrpit:void(0)\">首页</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">上一页</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">1</a></li>\n" +
                "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">...</a></li>\n"
            );
            $('#page2').append(
                "          <li><a href=\"javascrpit:void(0)\">" + parseInt(keyNum-1) + "</a></li>\n"+
                "          <li  class=\"active\"><a href=\"javascrpit:void(0)\">" + keyNum + "</a></li>\n"+
                "          <li><a href=\"javascrpit:void(0)\">" + parseInt(keyNum+1) + "</a></li>\n"
            );
            $('#page2').append(
                "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">...</a></li>\n"+
                "          <li><a href=\"javascrpit:void(0)\">" + pageNum + "</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
            );
        }else if(keyNum==pageNum){
            $('#page2').append(
                "          <li><a href=\"javascrpit:void(0)\">首页</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">上一页</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">1</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">2</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">3</a></li>\n" +
                "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">...</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">" + parseInt(pageNum - 1) + "</a></li>\n" +
                "          <li   class=\"active\"><a href=\"javascrpit:void(0)\">" + pageNum + "</a></li>\n" +
                "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
            );
        }else if(keyNum==parseInt(pageNum-1)){
            $('#page2').append(
                "          <li><a href=\"javascrpit:void(0)\">首页</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">上一页</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">1</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">2</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">3</a></li>\n" +
                "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">...</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">" + parseInt(keyNum - 1) + "</a></li>\n" +
                "          <li  class=\"active\"><a href=\"javascrpit:void(0)\">" + keyNum + "</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">" + parseInt(keyNum+1) + "</a></li>\n" +
                "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
            );
        }else{
            $('#page2').append(
                "          <li><a href=\"javascrpit:void(0)\">首页</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">上一页</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">1</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">2</a></li>\n" +
                "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">...</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">" + parseInt(keyNum - 1) + "</a></li>\n" +
                "          <li   class=\"active\"><a href=\"javascrpit:void(0)\">" + keyNum + "</a></li>\n" +
                "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">...</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">" + pageNum + "</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
            );
        }
    }
    $('#page2 li').each(function () {
        $(this).unbind("click");
        if($(this).attr("class")!='disabled' && $(this).attr("class")!='active'){
            $(this).click(function () {
                var num = $(this).find('a').text();
                if(num=='首页'){
                    initTable2();
                }else if(num=='上一页'){
                    var num = parseInt($('#page2').find('.active').find('a').text())-1;
                    initTable2(num);
                }else if(num=='下一页'){
                    var num = parseInt($('#page2').find('.active').find('a').text())+1;
                    initTable2(num);
                }else if(num=='尾页'){
                    initTable2(pageNum);
                }else{
                    initTable2(num);
                }
            });
        }
    })
}

function initPage3(pageList,keyNum) {
    var pageDatas = pageList;
    pageList = pageList==null?100:pageList-1;
    var pageNum = parseInt(pageList/20)+1;
    $('#page3').empty();
    if(keyNum==null) {
        if (pageNum > 6) {
            $('#page3').append(
                "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">首页</a></li>\n" +
                "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">上一页</a></li>\n" +
                "          <li class=\"active\"><a href=\"javascrpit:void(0)\">1</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">2</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">3</a></li>\n" +
                "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">...</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">" + parseInt(pageNum - 1) + "</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">" + pageNum + "</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
            );
        } else {
            $('#page3').append(
                "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">首页</a></li>\n" +
                "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">上一页</a></li>\n"
            );
            for (var i = 1; i <= pageNum; i++) {
                if(i==1){
                    $('#page3').append(
                        "          <li class=\"active\"><a href=\"javascrpit:void(0)\">" + i + "</a></li>\n"
                    );
                }else {
                    $('#page3').append(
                        "          <li><a href=\"javascrpit:void(0)\">" + i + "</a></li>\n"
                    );
                }
            }
            if (pageNum == 1) {
                $('#page3').append(
                    "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                    "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
                );
            } else {
                $('#page3').append(
                    "          <li><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
                );
            }
        }
    }else{
        keyNum=parseInt(keyNum);
        if(keyNum>pageNum){
            layer.msg("分页组件加载错误!");
        }else if(keyNum==1){
            initPage3(pageDatas);
        }else if(keyNum==2){
            if (pageNum > 6) {
                $('#page3').append(
                    "          <li><a href=\"javascrpit:void(0)\">首页</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">上一页</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">1</a></li>\n" +
                    "          <li class=\"active\"><a href=\"javascrpit:void(0)\">2</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">3</a></li>\n" +
                    "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">...</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">" + parseInt(pageNum - 1) + "</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">" + pageNum + "</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
                );
            } else {
                $('#page3').append(
                    "          <li><a href=\"javascrpit:void(0)\">首页</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">上一页</a></li>\n"
                );
                for (var i = 1; i <= pageNum; i++) {
                    if(i==keyNum){
                        $('#page3').append(
                            "          <li class=\"active\"><a href=\"javascrpit:void(0)\">" + i + "</a></li>\n"
                        );
                    }else {
                        $('#page3').append(
                            "          <li><a href=\"javascrpit:void(0)\">" + i + "</a></li>\n"
                        );
                    }
                }
                if(pageNum!=2) {
                    $('#page3').append(
                        "          <li><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                        "          <li><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
                    );
                }else{
                    $('#page3').append(
                        "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                        "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
                    );
                }
            }
        }else if(keyNum==3){
            if (pageNum > 6) {
                $('#page3').append(
                    "          <li><a href=\"javascrpit:void(0)\">首页</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">上一页</a></li>\n" +
                    "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">...</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">2</a></li>\n" +
                    "          <li  class=\"active\"><a href=\"javascrpit:void(0)\">3</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">4</a></li>\n" +
                    "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">...</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">" + parseInt(pageNum - 1) + "</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">" + pageNum + "</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
                );
            } else {
                $('#page3').append(
                    "          <li><a href=\"javascrpit:void(0)\">首页</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">上一页</a></li>\n"
                );
                for (var i = 1; i <= pageNum; i++) {
                    if(i==keyNum){
                        $('#page3').append(
                            "          <li class=\"active\"><a href=\"javascrpit:void(0)\">" + i + "</a></li>\n"
                        );
                    }else {
                        $('#page3').append(
                            "          <li><a href=\"javascrpit:void(0)\">" + i + "</a></li>\n"
                        );
                    }
                }
                if(pageNum==3){
                    $('#page3').append(
                        "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                        "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
                    );
                }else {
                    $('#page3').append(
                        "          <li><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                        "          <li><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
                    );
                }
            }
        }else if(pageNum-keyNum>3&&keyNum>=4){
            $('#page3').append(
                "          <li><a href=\"javascrpit:void(0)\">首页</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">上一页</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">1</a></li>\n" +
                "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">...</a></li>\n"
            );
            $('#page3').append(
                "          <li><a href=\"javascrpit:void(0)\">" + parseInt(keyNum-1) + "</a></li>\n"+
                "          <li  class=\"active\"><a href=\"javascrpit:void(0)\">" + keyNum + "</a></li>\n"+
                "          <li><a href=\"javascrpit:void(0)\">" + parseInt(keyNum+1) + "</a></li>\n"
            );
            $('#page3').append(
                "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">...</a></li>\n"+
                "          <li><a href=\"javascrpit:void(0)\">" + pageNum + "</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
            );
        }else if(keyNum==pageNum){
            $('#page3').append(
                "          <li><a href=\"javascrpit:void(0)\">首页</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">上一页</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">1</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">2</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">3</a></li>\n" +
                "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">...</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">" + parseInt(pageNum - 1) + "</a></li>\n" +
                "          <li   class=\"active\"><a href=\"javascrpit:void(0)\">" + pageNum + "</a></li>\n" +
                "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
            );
        }else if(keyNum==parseInt(pageNum-1)){
            $('#page3').append(
                "          <li><a href=\"javascrpit:void(0)\">首页</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">上一页</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">1</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">2</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">3</a></li>\n" +
                "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">...</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">" + parseInt(keyNum - 1) + "</a></li>\n" +
                "          <li  class=\"active\"><a href=\"javascrpit:void(0)\">" + keyNum + "</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">" + parseInt(keyNum+1) + "</a></li>\n" +
                "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
            );
        }else{
            $('#page3').append(
                "          <li><a href=\"javascrpit:void(0)\">首页</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">上一页</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">1</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">2</a></li>\n" +
                "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">...</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">" + parseInt(keyNum - 1) + "</a></li>\n" +
                "          <li   class=\"active\"><a href=\"javascrpit:void(0)\">" + keyNum + "</a></li>\n" +
                "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">...</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">" + pageNum + "</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                "          <li><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
            );
        }
    }
    $('#page3 li').each(function () {
        $(this).unbind("click");
        if($(this).attr("class")!='disabled' && $(this).attr("class")!='active'){
            $(this).click(function () {
                var num = $(this).find('a').text();
                if(num=='首页'){
                    initTable3();
                }else if(num=='上一页'){
                    var num = parseInt($('#page3').find('.active').find('a').text())-1;
                    initTable3(num);
                }else if(num=='下一页'){
                    var num = parseInt($('#page3').find('.active').find('a').text())+1;
                    initTable3(num);
                }else if(num=='尾页'){
                    initTable3(pageNum);
                }else{
                    initTable3(num);
                }
            });
        }
    })
}