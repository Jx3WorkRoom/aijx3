$(function () {
    var favorId = getUrlParam('favorId');
    var sourceType = getUrlParam('sourceType');
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }
    var username = $('#userName').text();
    initDetail(favorId,sourceType,username);
});

function initDetail(favorId,sourceType,username) {
    var url = api+"accountList/accountDetail?favorId="+encodeURI(favorId)+
        '&sourceType='+encodeURI(sourceType)+
        '&userName='+encodeURI(username);
    var userId =null;
    var mainId =null;
    var replyTime = null;
    var sourceType = null;
    var imgLength = 0;
    $.getJSON(url,function (data) {
        data = data.datas==null?"":data.datas;
        if(data!="") {
            $('.scrollimg').empty();
            $.each(data, function (i, value) {
                $('.account').empty();
                $('.account').append(value.REPLY_CONTENT);
                mainId = value.MAIN_ID==null?1:value.MAIN_ID;
                if(mainId==1){
                    // window.location.reload();
                }
                replyTime = value.REPLY_TIME==null?"":value.REPLY_TIME;
                sourceType =value.SOURCE_TYPE==null?1:value.SOURCE_TYPE;
                userId = value.userId==null?1:value.userId;
                $('.userIsvalid').text(value.USER_ISVALID+"人提交失效!");
                var imgSrc = value.WENJIAN_PATH==null?value.PIC_PATH:value.WENJIAN_PATH;
                imgSrc = api+'uploadFile/getImage?WENJIAN_PATH='+encodeURI(imgSrc);
                var imgHtml = "";
                imgLength++;
                var picNum = value.WENJIAN_SEQ==null?value.SEQ_NUM:value.WENJIAN_SEQl
                if(picNum==1) {
                    $('.bigimgs img').attr('src',imgSrc);
                    imgHtml = "<img class=\"moveimg cur\" src='" + imgSrc + "' style=\"margin-left: 0px;\">";
                    $('.scrollimg').append(imgHtml);
                }else{
                    imgHtml = "<img src='"+imgSrc+"' style=\"margin-left: 0px;\">";
                    $('.scrollimg').append(imgHtml);
                }
            });
        }else {
            layer.msg("请求数据有误或者数据库并未查询到相关数据!")
        }
    }).complete(function () {
        //收藏
        $('.icon-save').unbind('click');
        $('.icon-save').click(function(){
            var isValided = null;
            var username = $('#userName').text();
            if(username==""){
                location.href = 'login';
            }else {
                if($(this).attr('class').indexOf("cur")==-1){
                    $(this).addClass('cur');
                    $(this).parent().find('label').text('已收藏');
                    isValided = 1;
                }else{
                    $(this).removeClass('cur');
                    $(this).parent().find('label').text('收藏');
                    isValided = 0;
                }
                replyTime =timeStamp2String(replyTime);
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
                        return year + "-" + month + "-" + date+" "+hour+":"+min+":"+second;
                    };
                var url = api+'accountList/userIsvalid?userName='+encodeURI(username)+
                    '&mainId='+encodeURI(mainId)+
                    '&isValided='+encodeURI(isValided)+
                    '&replyTime='+encodeURI(replyTime);
                $.getJSON(url,function (data) {
                    layer.msg(data.info);
                }).error(function () {
                    layer.msg("提交到服务器失效!");
                    return false;
                });
            }
        });
        //查看源
        $('.modalBtn').unbind('click');
        $('.modalBtn').click(function () {
            if(sourceType==1){
                initTable();
            }else{
                var username = $('#userName').text();
                if(username==""){
                    layer.msg("你还未登陆,请先前往用户中心登陆!");
                }else {
                    var url = api + 'accountList/accountDetailSource?mainId=' + encodeURI(mainId) +
                        '&sourceType=' + encodeURI(sourceType) +
                        '&userId=' + encodeURI(userId) +
                        '&userName=' + encodeURI(username);
                    $.getJSON(url, function (data) {
                        if (data.datas == 'noAuth') {
                            layer.msg('您没有查看权限,请前往用户中心充值!');
                        } else {
                            if (data.datas.length < 1) {
                                layer.msg('未查到有效数据!');
                            } else {
                                $('#identifier').addClass('madalHide');
                                data = data.datas[0].user_qq == null ? "null" : data.datas[0].user_qq;
                                var $table = $('#identifier').find('table');
                                $table.empty();
                                $table.append("<p>用户联系方式：</p>\n" +
                                    "                    <p>QQ：" + data + "</p>\n" +
                                    "                    <p>特别提示：请注意交易安全，本平台不对信息真实性和信息的安全性提供保证。若有疑问，请联系客服。</p>\n" +
                                    "                    <p>客服QQ：153435143</p>")
                            }
                        }
                    }).error(function () {
                        layer.msg("提交到服务器失效!");
                        return false;
                    });
                }
            }
        });
        var colose = $('.close');
        var cancel = $('.btn-default');
        $(colose,cancel).unbind('click');
        $(colose,cancel).click(function () {
            $(this).parents('.modal').removeClass('madalHide');
        });

        //提交失效
        $('.sumbitIsvalid').unbind('click');
        $('.sumbitIsvalid').click(function () {
            var url =api+"accountList/accountDetailSubmitIsValid?favorId="+encodeURI(favorId);
            $.getJSON(url,function (data) {
               layer.msg(data.info);
            });
        });

        var username = $('#userName').text();
        var url = api+'accountList/queryHasCollected?mainId='+encodeURI(mainId)+'&username='+encodeURI(username);
        $.getJSON(url,function (data) {
            data =data.info[0]==null?'':data.info[0];
            data = data.coll_type==null?0:parseInt(data.coll_type);
            if(data!=0){
                $('.icon-save').addClass('cur');
                $('.icon-save').parent().find('label').text('已收藏');
            }
        });

        //图片加载 失败处理
        $(".scrollimg img").each(function(){
            var num = $(this).index();
            $(this).error(function () {
                if(num!=0) {
                    $(this).attr('src', './dist/css/images/nopicture' + num + '.jpg');
                }else{
                    $(this).attr('src', './dist/css/images/nopicture.jpg');
                }
            });
        });
        $(".bigimgs img").error(function () {
            $(this).attr('src', './dist/css/images/nopicture.jpg');
        });
        //图片轮播
        $(".scrollimg img").click(function(){
            $(".scrollimg img").removeClass('cur');
            $(this).addClass('cur');
            $(".bigimgs img").attr("src",$(this).attr('src'));
        });
        var startnum=0;
        var imglen=$(".scrollimg img").length;
        $(".lefttg").click(function(){
            if(startnum==0) return;
            startnum++;
            $('.moveimg').css("margin-left",startnum*270+"px");
            var imgNum = Math.abs(startnum);
            $(".bigimgs img").attr("src",$('.scrollimg img').eq(imgNum).attr('src'));
        });
        $(".righttg").click(function(){
            if(startnum<(imgLength-imglen)) return;
            startnum--;
            $('.moveimg').css("margin-left",startnum*270+"px");
            var imgNum = Math.abs(startnum);
            $(".bigimgs img").attr("src",$('.scrollimg img').eq(imgNum).attr('src'));
        });
    });
    function initTable(url,keyNum) {
        var startNum = 0;
        var endNum =10;
        if(keyNum!=null){
            endNum = 10;
            startNum = keyNum*10-10;
        }
        var username = $('#userName').text();
        if(username==""){
            layer.msg("你还未登陆,请先前往用户中心登陆!");
        }else {
            var url = api + 'accountList/accountDetailSource?mainId=' + encodeURI(mainId) +
                '&sourceType=' + encodeURI(sourceType) +
                '&userId=' + encodeURI(userId) +
                '&userName=' + encodeURI(username) +
                '&startNum=' + encodeURI(startNum) +
                '&endNum=' + encodeURI(endNum);
            $.getJSON(url, function (data) {
                var pageList = data.pageList == null ? "" : data.pageList;
                if (data.datas == 'noAuth') {
                    layer.msg("您没有查看权限,请前往用户中心充值!")
                } else {
                    data = data.datas == null ? '' : data.datas;
                    if (data == "") {
                        layer.msg("未查到有效数据!");
                    } else {
                        $('#myModal').addClass('madalHide');
                        $('#source1').empty();
                        $('#source1').append("<tr>\n" +
                            "                        <td align=\"center\"  valign=\"middle\" bgcolor=\"#ccc\" width=\"150px\" height=\"30\">发布时间</td>\n" +
                            "                        <td align=\"center\"  valign=\"middle\" bgcolor=\"#ccc\" width=\"300px\" height=\"30\">页面链接</td>\n" +
                            "                        <td align=\"center\"  valign=\"middle\" bgcolor=\"#ccc\" width=\"150px\" height=\"30\">贴吧楼层</td>\n" +
                            "                    </tr>");
                        $.each(data, function (i, value) {
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
                                if(parseInt(month)<10){
                                    second = '0'+second;
                                }
                                return year + "-" + month + "-" + date+" "+hour+":"+min+":"+second;
                            };
                            var time = timeStamp2String(value.REPLY_TIME);
                            $('#source1').append("<tr>\n" +
                                "                        <td align=\"center\"  valign=\"middle\" width=\"150px\" height=\"30\">" + time + "</td>\n" +
                                "                        <td align=\"center\"  valign=\"middle\" width=\"300x\" height=\"30\" class='sourceHref'><a href='" + value.PAGE_URL + "' target='_blank'>" + value.PAGE_URL + "</a></td>\n" +
                                "                        <td align=\"center\"  valign=\"middle\" width=\"150px\" height=\"30\">" + value.BELONG_FLOOR + "</td>\n" +
                                "                    </tr>")
                        });
                        if (pageList != "") {
                            initPage(pageList, keyNum);
                        } else {
                            $('.pagination').empty();
                            layer.msg("加载数据出错!");
                        }
                    }
                }
            }).error(function () {
                layer.msg("加载数据为空!");
            }).complete(function () {
                $('.sourceHref').click(function () {
                    var url = $(this).find('a').attr('href');
                    $('#sourceIfame').attr('src',url);
                    $('#sourceIfame').load(function () {
                        var title = $($("#sourceIfame").context).find('title');
                        console.log(title);
                    });
                });
            });
        }
    }
    function initPage(pageList,keyNum) {
        var pageDatas = pageList;
        pageList = pageList==null?100:pageList-1;
        var pageNum = parseInt(pageList/10)+1;
        $('.pagination').empty();
        if(keyNum==null) {
            if (pageNum > 6) {
                $('.pagination').append(
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
                $('.pagination').append(
                    "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">首页</a></li>\n" +
                    "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">上一页</a></li>\n"
                );
                for (var i = 1; i <= pageNum; i++) {
                    if(i==1){
                        $('.pagination').append(
                            "          <li class=\"active\"><a href=\"javascrpit:void(0)\">" + i + "</a></li>\n"
                        );
                    }else {
                        $('.pagination').append(
                            "          <li><a href=\"javascrpit:void(0)\">" + i + "</a></li>\n"
                        );
                    }
                }
                if (pageNum == 1) {
                    $('.pagination').append(
                        "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                        "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
                    );
                } else {
                    $('.pagination').append(
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
                initPage(pageDatas);
            }else if(keyNum==2){
                if (pageNum > 6) {
                    $('.pagination').append(
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
                    $('.pagination').append(
                        "          <li><a href=\"javascrpit:void(0)\">首页</a></li>\n" +
                        "          <li><a href=\"javascrpit:void(0)\">上一页</a></li>\n"
                    );
                    for (var i = 1; i <= pageNum; i++) {
                        if(i==keyNum){
                            $('.pagination').append(
                                "          <li class=\"active\"><a href=\"javascrpit:void(0)\">" + i + "</a></li>\n"
                            );
                        }else {
                            $('.pagination').append(
                                "          <li><a href=\"javascrpit:void(0)\">" + i + "</a></li>\n"
                            );
                        }
                    }
                    if(pageNum!=2) {
                        $('.pagination').append(
                            "          <li><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                            "          <li><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
                        );
                    }else{
                        $('.pagination').append(
                            "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                            "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
                        );
                    }
                }
            }else if(keyNum==3){
                if (pageNum > 6) {
                    $('.pagination').append(
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
                    $('.pagination').append(
                        "          <li><a href=\"javascrpit:void(0)\">首页</a></li>\n" +
                        "          <li><a href=\"javascrpit:void(0)\">上一页</a></li>\n"
                    );
                    for (var i = 1; i <= pageNum; i++) {
                        if(i==keyNum){
                            $('.pagination').append(
                                "          <li class=\"active\"><a href=\"javascrpit:void(0)\">" + i + "</a></li>\n"
                            );
                        }else {
                            $('.pagination').append(
                                "          <li><a href=\"javascrpit:void(0)\">" + i + "</a></li>\n"
                            );
                        }
                    }
                    if(pageNum==3){
                        $('.pagination').append(
                            "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                            "          <li class=\"disabled\"><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
                        );
                    }else {
                        $('.pagination').append(
                            "          <li><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                            "          <li><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
                        );
                    }
                }
            }else if(pageNum-keyNum>3&&keyNum>=4){
                $('.pagination').append(
                    "          <li><a href=\"javascrpit:void(0)\">首页</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">上一页</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">1</a></li>\n" +
                    "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">...</a></li>\n"
                );
                $('.pagination').append(
                    "          <li><a href=\"javascrpit:void(0)\">" + parseInt(keyNum-1) + "</a></li>\n"+
                    "          <li  class=\"active\"><a href=\"javascrpit:void(0)\">" + keyNum + "</a></li>\n"+
                    "          <li><a href=\"javascrpit:void(0)\">" + parseInt(keyNum+1) + "</a></li>\n"
                );
                $('.pagination').append(
                    "          <li  class=\"disabled\"><a href=\"javascrpit:void(0)\">...</a></li>\n"+
                    "          <li><a href=\"javascrpit:void(0)\">" + pageNum + "</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">下一页</a></li>\n" +
                    "          <li><a href=\"javascrpit:void(0)\">尾页</a></li>\n"
                );
            }else if(keyNum==pageNum){
                $('.pagination').append(
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
                $('.pagination').append(
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
                $('.pagination').append(
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
}
