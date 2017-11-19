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
    $.ajax({
        url:url,
        async:true,
        success:function (data) {
            data = data.datas==null?"":data.datas;
            if(data!="") {
                $('.scrollimg').empty();
                $.each(data, function (i, value) {
                    if(value.SOURCE_TYPE==1) {
                        $('.tbUrl').empty();
                        $('.tbUrl').append("贴吧链接：<a href='" + value.PAGE_URL + "' target='_blank'>" + value.PAGE_URL + "</a>");
                        $('.tbFloor').empty();
                        $('.tbFloor').append("贴吧楼层：" + value.BELONG_FLOOR);
                    }else{
                        var userId =value.USER_ID;
                        var url2 =api+'User/getUserInfoByID?userId='+encodeURI(userId);
                        $.getJSON(url2,function (data1) {
                           data1=data1.datas[0]==null?'':data1.datas[0];
                           if(data!=''){
                               $('.tbUrl').empty();
                               $('.tbFloor').empty();
                               if(data1.USER_QQ!=null) {
                                   $('.tbFloor').append("发布者QQ：" + data1.USER_QQ);
                               }else{
                                   $('.tbFloor').append("发布者QQ：--");
                               }
                           }else {
                               $('.tbUrl').empty();
                               $('.tbFloor').empty();
                               $('.tbFloor').append("用户QQ：--");
                           }
                        });
                    }
                    $('.account').empty();
                    $('.account').append("详情简介："+value.REPLY_CONTENT);
                    mainId = value.MAIN_ID==null?1:value.MAIN_ID;
                    replyTime = value.REPLY_TIME==null?"":value.REPLY_TIME;
                    sourceType =value.SOURCE_TYPE==null?1:value.SOURCE_TYPE;
                    userId = value.userId==null?1:value.userId;
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
        },
        complete:function () {
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
            var colose = $('.close');
            var cancel = $('.btn-default');
            $(colose,cancel).unbind('click');
            $(colose,cancel).click(function () {
                $(this).parents('.modal').removeClass('madalHide');
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
        }
    });
}
