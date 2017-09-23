$(function () {
    var favorId = getUrlParam('favorId');
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }
    initDetail(favorId);
});

function initDetail(favorId) {
    var username = $('#userName').text();
    var url = api+"blackList/blackDetail?favorId="+encodeURI(favorId)+"&username="+encodeURI(username);
    var userId =null;
    var mainId =null
    var replyTime = null;
    var sourceType = null;
    var imgLength = 0;
    $.getJSON(url,function (data)   {
        data = data.datas==null?"":data.datas;
        $('.scrollimg').empty();
        $.each(data,function (i,value) {
            if(data!=""){
                $('.mt15').empty();
                var cheatType = value.PAR_NAME;
                var belongOf = value.BELONG_QF.replace("[", "");
                belongOf = belongOf.replace("]", "");
                belongOf = belongOf.split(',')[0];
                belongOf = replace(belongOf);
                var tixin = value.TIXIN.replace("[", "");
                tixin = tixin.replace("]", "");
                tixin = tixin.split(',')[0];
                tixin = replace(tixin);
                function replace(str){
                    str = str.replace("电月","");
                    str = str.replace("电点","");
                    str = str.replace("网点","");
                    str = str.replace("网月","");
                    str = str.replace("双点","");
                    str = str.replace("双月","");
                    return str;
                }
                $('.mt15').append("<tr>\n" +
                    "                         <td align=\"right\" class=\"wr ft1\">欺诈类型：</td>\n" +
                    "                         <td colspan=\"7\">"+cheatType+"</td>\n" +
                    "                     </tr>\n" +
                    "                     <tr>\n" +
                    "                         <td align=\"right\" class=\"wr ft1\">涉事区服：</td>\n" +
                    "                         <td colspan=\"7\">"+belongOf+"</td>\n" +
                    "                     </tr>\n" +
                    "                     <tr>\n" +
                    "                         <td align=\"right\" class=\"wr ft1\">门派体型：</td>\n" +
                    "                         <td colspan=\"7\">"+tixin+"</td>\n" +
                    "                     </tr>\n" +
                    "                     <tr>\n" +
                    "                         <td align=\"right\" class=\"wr ft1\">角色名：</td>\n" +
                    "                         <td colspan=\"7\">"+value.ROLE_NAME+"</td>\n" +
                    "                     </tr>\n" +
                    "                     <tr>\n" +
                    "                         <td align=\"right\" class=\"wr ft1\">被黑经历：</td>\n" +
                    "                         <td colspan=\"7\">"+value.CHEAT_INTRO+"</td>\n" +
                    "                     </tr>\n" +
                    "                     <tr>\n" +
                    "                         <td align=\"right\" class=\"wr ft1\">资料信息：</td>\n" +
                    "                         <td colspan=\"7\">"+value.CHEAT_INFO+"</td>\n" +
                    "                     </tr>\n" +
                    "                     <tr>\n" +
                    "                     </tr>");
                var imgSrc = value.PIC_PATH;
                imgSrc = api+'uploadFile/getImage?WENJIAN_PATH='+encodeURI(imgSrc);
                var imgHtml = "";
                imgLength++;
                if(value.SEQ_NUM==1) {
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