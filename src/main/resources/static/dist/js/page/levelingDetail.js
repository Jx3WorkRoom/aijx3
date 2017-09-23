$(function () {
    var favorId = getUrlParam('favorId');
    var userId = getUrlParam('userId');
    var sourceType =getUrlParam('sourceType');
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }
    initDetail(favorId,userId,sourceType);
});

function initDetail(favorId,userId,sourceType) {
    var url = api+"levelingList/levelingDetail?favorId="+encodeURI(favorId)+"&userId="+encodeURI(userId)+"&sourceType="+encodeURI(sourceType);
    var userId =null;
    var imgLength = 0;
    $.getJSON(url,function (data)   {
        data = data.datas==null?"":data.datas;
        $('.scrollimg').empty();
        $.each(data,function (i,value) {
            if(data!=""){
                $('.mt15').empty();
                var needType = value.NEED_TYPE==2?'找代练':'接代练';
                var belongOf = value.BELONG_QF.replace("[", "");
                belongOf = belongOf.replace("]", "");
                belongOf = belongOf.split(',')[0];
                belongOf = replace(belongOf);
                var follow = value.USER_FOLLOW+'人关注';
                var time = sumTime(value.REPLY_TIME);
                var qq = value.user_qq;
                function sumTime(time) {
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
                        if (parseInt(hour) < 10) {
                            hour = '0' + hour;
                        }
                        if (parseInt(min) < 10) {
                            min = '0' + min;
                        }
                        if (parseInt(month) < 10) {
                            second = '0' + second;
                        }
                        return year + "-" + month + "-" + date + " " + hour + ":" + min + ":" + second;
                    };
                    time = timeStamp2String(time);
                    var startTime = new DateUtil().nowDate2String("yyyy-MM-dd HH:mm:ss");
                    time = time + " 00:00:00";
                    var reStr = null;
                    var diff = new DateUtil().diffDateTime(time, startTime) / 1000;
                    var day = parseInt(diff / (24 * 60 * 60));//计算整数天数
                    var hour = parseInt(diff / (60 * 60));//计算整数小时数
                    var min = parseInt(diff / 60);//计算整数分
                    if (day > 1) {
                        reStr = day + "天前";
                    } else {
                        var hour = parseInt(diff / (60 * 60));//计算整数小时数
                        if (hour < 1) {
                            hour = 1;
                        }
                        reStr = hour + "小时前";
                    }
                    return reStr;
                }
                var info = value.POST_CONTENT.replace("[", "");
                info = info.replace("]", "");
                function replace(str){
                    str = str.replace("电月","");
                    str = str.replace("电点","");
                    str = str.replace("网点","");
                    str = str.replace("网月","");
                    str = str.replace("双点","");
                    str = str.replace("双月","");
                    return str;
                }
                $('.mt15').append("<tbody><tr>\n" +
                    "                                            <td align=\"right\" class=\"wr ft1\">代练类型：</td>\n" +
                    "                                            <td colspan=\"7\">"+needType+"</td>\n" +
                    "                                        </tr>\n" +
                    "                                        <tr>\n" +
                    "                                            <td align=\"right\" class=\"wr ft1\">所属区服：</td>\n" +
                    "                                            <td colspan=\"7\">"+belongOf+"</td>\n" +
                    "                                        </tr>\n" +
                    "                                        <tr>\n" +
                    "                                            <td align=\"right\" class=\"wr ft1\">关注度：</td>\n" +
                    "                                            <td colspan=\"7\">"+follow+"</td>\n" +
                    "                                        </tr>\n" +
                    "                                        <tr>\n" +
                    "                                            <td align=\"right\" class=\"wr ft1\">上架时间：</td>\n" +
                    "                                            <td colspan=\"7\">"+time+"</td>\n" +
                    "                                        </tr>\n" +
                    "                                        <tr>\n" +
                    "                                            <td align=\"right\" class=\"wr ft1\">联系QQ：</td>\n" +
                    "                                            <td colspan=\"7\">"+qq+"</td>\n" +
                    "                                        </tr>\n" +
                    "                                        <tr>\n" +
                    "                                            <td align=\"right\" class=\"wr ft1\">代练信息：</td>\n" +
                    "                                            <td colspan=\"7\">"+info+"</td>\n" +
                    "                                        </tr>\n" +
                    "                                        <tr>\n" +
                    "                                        </tr>\n" +
                    "                                    </tbody>");
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
            }else {
                layer.msg("请求数据有误或者数据库并未查询到相关数据!")
            }
        });
    }).complete(function () {
        //图片加载 失败处理
        $(".scrollimg img").each(function(){
            $(this).error(function () {
                $(this).attr('src', './dist/css/images/nopicture.jpg');
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
    }).error(function () {
        layer.msg("请求数据有误或者数据库并未查询到相关数据!")
    });
}