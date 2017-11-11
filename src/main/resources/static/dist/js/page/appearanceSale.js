api = api+"appearanceSale/";
//设置一个省的公共下标
var pIndex = 0;
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
    initBunding();
});


function initBunding() {
    $('.s_top').find('ul').find('li').click(function () {
        $('.s_top').find('ul').find('li').removeClass("cur");
        $('.areaSelect').find('select').eq(0).val(-1);
        $('.areaSelect').find('select').eq(1).val(0);
        $('.areaSelect').find('select').eq(2).val(0);
        $('.tixin').val("");
        $(this).addClass('cur');
        var index = $('.s_top').find('ul').find('.cur').index();
        if(index==0){
            $('.table4Show').hide();
            $('.belongOf').show();
            initTable();
            $('.issue-l').attr('href','appearanceTransaction');
        }else if(index ==1){
            $('.table4Show').hide();
            $('.belongOf').show();
            initTable2();
            $('.issue-l').attr('href','appearanceTransaction');
        }else if(index ==2){
            $('.table4Show').hide();
            $('.belongOf').show();
            initTable3()
            $('.issue-l').attr('href','appearancePrice');
        }else if(index ==3){
            $('.belongOf').hide();
            $('.table4Show').show();
            initTable4()
            $('.issue-l').attr('href','appearancePrice');
        }
    });
}

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
    $('.show0').find('table').find('tr').eq(0).hide();
    var startNum = 0;
    var endNum =20;
    if(keyNum!=null){
        endNum = 20;
        startNum = keyNum*20-20;
    }
    if(url==null) {
        function getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg); //匹配目标参数
            if (r != null) return unescape(r[2]); return null; //返回参数值
        }
        var areaSelection = "";
        $('.areaSelect').find('select').each(function () {
            var text = $(this).find('option:selected').text();
            if(text.indexOf("请选择")==-1) {
                areaSelection += text + ',';
            }
        });
        if(areaSelection.length>2) {
            areaSelection = areaSelection.substring(0, areaSelection.length - 1);
        }else{
            areaSelection="";
        }
        var shape = $('.tixin').val();
        if(shape==""&&areaSelection=="") {
            url = api + 'appearanceSale?startNum=' + encodeURI(startNum) +
                        '&endNum=' + encodeURI(endNum);
        }else{
            url = api + 'appearanceSale?areaSelection=' + encodeURI(areaSelection)
                + '&shape=' + encodeURI(shape)
                +'&startNum=' +encodeURI(startNum)+
                +'&endNum=20';
        }
    }
    $(".table").empty();
    $(".table").append("<div class=\"table-tr tablered\">\n" +
        "        <div class=\"table-th table-th1\" style=\"width: 11% !important;padding-left: 30px;\">区服</div>\n" +
        "        <div class=\"table-th\">来源贴吧</div>\n" +
        "        <div class=\"table-th\">介绍说明</div>\n" +
        "        <div class=\"table-th\">上架时间</div>\n" +
        "        <div class=\"table-th\">收藏</div>\n" +
        "      </div>");
    layer.load();
    var dataTemp = null;
    $.ajax({
        url:url,
        async:true,
        success:function (data) {
            dataTemp = data;
            //填充表格数据
            var tableDatas = data.datas==null?"":data.datas;
                $.each(tableDatas,function (i,value) {
                    var time = sumTime(value.REPLY_TIME);
                    var belongOf = value.BELONG_QF.replace("[", "");
                    belongOf = belongOf.replace("]", "");
                    if(belongOf.length>6) {
                        belongOf = replace(belongOf);
                    }
                    belongOf = belongOf.split(',')[0];
                    if(userId!=""){
                        if(userId!=value.userIdColl){
                            value.COLL_TYPE=0;
                        }
                    }else{
                        value.COLL_TYPE=0;
                    }
                    var postContent = getNewline(value.POST_CONTENT);
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
                            if(bytesCount>=100){
                                s = s + '<br>';
                                //重置
                                bytesCount=0;
                            }
                        }
                        return s;
                    }
                    console.log(value.COLL_TYPE);
                    if(value.COLL_TYPE==null||value.COLL_TYPE==0||username=='') {
                        $(".table").append(" <div class=\"table-tr\">\n" +
                            "        <div class=\"table-td main_id\" style='display: none'>" + value.MAIN_ID + "</div>\n" +
                            "        <div class=\"table-td replyTime\" style='display: none'>" + value.REPLY_TIME + "</div>\n" +
                            "        <div class=\"table-td sourceType\" style='display: none'>" + value.SOURCE_TYPE + "</div>\n" +
                            "        <div class=\"table-td userId\" style='display: none'>" + value.USER_ID + "</div>\n" +
                            "        <div class=\"table-td\">" + belongOf + "</div>\n" +
                            "        <div class=\"table-td\">" + value.POST_BAR + "</div>\n" +
                            "        <div class=\"table-td table_lw\"><a class=\"modalBtn\" href=\"javascript:;\">" + postContent + "</a></div>\n" +
                            "        <div class=\"table-td\">" + time + "</div>\n" +
                            "        <div class=\"table-td\"><i class=\"icon-save\"></i></div>\n" +
                            "      </div>");
                    }else{
                        $(".table").append(" <div class=\"table-tr\">\n" +
                            "        <div class=\"table-td main_id\" style='display: none'>" + value.MAIN_ID + "</div>\n" +
                            "        <div class=\"table-td replyTime\" style='display: none'>" + value.REPLY_TIME + "</div>\n" +
                            "        <div class=\"table-td sourceType\" style='display: none'>" + value.SOURCE_TYPE + "</div>\n" +
                            "        <div class=\"table-td userId\" style='display: none'>" + value.USER_ID + "</div>\n" +
                            "        <div class=\"table-td\">" + belongOf + "</div>\n" +
                            "        <div class=\"table-td\">" + value.POST_BAR + "</div>\n" +
                            "        <div class=\"table-td table_lw\"><a class=\"modalBtn\" href=\"javascript:;\">" + postContent + "</a></div>\n" +
                            "        <div class=\"table-td\">" + time + "</div>\n" +
                            "        <div class=\"table-td\"><i class=\"icon-save cur\"></i></div>\n" +
                            "      </div>");
                    }
                });
                //查看源
                $('.modalBtn').unbind('click');
                $('.modalBtn').click(function () {
                    var sourceType =  $(this).parent().parent().find('.sourceType').text()==""?1:$(this).parent().parent().find('.sourceType').text();
                    var mainId = $(this).parent().parent().find('.main_id').text()==""?1:$(this).parent().parent().find('.main_id').text();
                    var userId = $(this).parent().parent().find('.userId').text()=="null"?1:$(this).parent().parent().find('.userId').text();
                    var username = $('#userName').text();
                    // if(username==""){
                    //     layer.msg("你还未登陆,请先前往用户中心登陆!");
                    // }else {
                        if (sourceType == 1) {
                            var url = api + 'appearanceSaleSource?mainId=' + encodeURI(mainId) +
                                '&sourceType=' + encodeURI(sourceType) +
                                '&userName=' + encodeURI(username) +
                                '&userId=' + encodeURI(userId);
                            $.getJSON(url, function (data) {
                                if (data.datas == 'noAuth') {
                                    layer.msg("您没有查看权限,请前往用户中心充值!");
                                } else {
                                    data = data.datas[0] == null ? "" : data.datas[0];
                                    if (data != '') {
                                        $('#myModal').addClass('madalHide');
                                        data.REPLY_TIME = data.REPLY_TIME == null ? 'null' : data.REPLY_TIME;
                                        var time = timeStamp2String(data.REPLY_TIME);
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
                                        data.BELONG_QF = data.BELONG_QF == null ? 'null' : data.BELONG_QF;
                                        data.POST_CONTENT = data.POST_CONTENT == null ? 'null' : data.POST_CONTENT;
                                        data.PAGE_URL = data.PAGE_URL == null ? 'null' : data.PAGE_URL;
                                        data.BELONG_FLOOR = data.BELONG_FLOOR == null ? 'null' : data.BELONG_FLOOR;
                                        $('.source1').find('tr').eq(0).find('td').eq(1).text(time);
                                        $('.source1').find('tr').eq(1).find('td').eq(1).text(data.BELONG_QF);
                                        $('.source1').find('tr').eq(2).find('td').eq(1).text(data.POST_CONTENT);
                                        $('.source1').find('tr').eq(3).find('td').eq(1).empty();
                                        $('.source1').find('tr').eq(3).find('td').eq(1).append("<a href='" + data.PAGE_URL + "' target=\"_blank\">" + data.PAGE_URL + "</a>");
                                        $('.source1').find('tr').eq(4).find('td').eq(1).text(data.BELONG_FLOOR + '楼');
                                    } else {
                                        layer.msg("未查到有效数据!");
                                    }
                                }
                            }).error(function () {
                                layer.msg("未查到有效信息!");
                            });
                        } else {
                            var url = api + 'appearanceSaleSource?mainId=' + encodeURI(mainId) +
                                '&sourceType=' + encodeURI(sourceType) +
                                '&userName=' + encodeURI(username) +
                                '&userId=' + encodeURI(userId);
                            $.getJSON(url, function (data) {
                                if (data.datas == 'noAuth') {
                                    layer.msg('您没有查看权限,请前往用户中心充值!');
                                } else {
                                    if (data.datas.length < 1) {
                                        layer.msg('未查到有效信息!');
                                    } else {
                                        $('#identifier').addClass('madalHide');
                                        data = data.datas[0].user_qq == null ? "null" : data.datas[0].user_qq;
                                        var $table = $('#identifier').find('table');
                                        $table.empty();
                                        $table.append("<p>用户联系方式：</p>\n" +
                                            "                    <p>QQ：" + data + "</p>\n" +
                                            "                    <p>特别提示：请注意交易安全，本平台不对信息真实性和信息的安全性提供保证。若有疑问，请联系客服。</p>\n" +
                                            "                    ");
                                    }
                                }
                            });
                        }
                    // }
                });
                var colose = $('.close');
                var cancel = $('.btn-default');
                $(colose,cancel).click(function () {
                    $(this).parents('.modal').removeClass('madalHide');
                });
                //收藏
                $('.icon-save').click(function () {
                    var username = $('#userName').text();
                    var mainId = $(this).parent().parent().find('.main_id').text();
                    var replyTime = $(this).parent().parent().find('.replyTime').text();
                    var isValided = null;
                    if(username==""){
                        location.href = 'login';
                    }else {
                        if ($(this).attr('class').indexOf('cur') > -1) {
                            $(this).removeClass('cur');
                            isValided = 0;
                        } else {
                            $(this).addClass('cur');
                            isValided = 1;
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
                        var url = api+'userIsvalid?userName='+encodeURI(username)+
                            '&mainId='+encodeURI(mainId)+
                            '&isValided='+encodeURI(isValided)+
                            '&replyTime='+encodeURI(replyTime);
                        $.getJSON(url,function (data) {
                            layer.msg(data.info);
                        });
                    }
                });
                //提交失效
                $('.protDisable').unbind("click");
                $('.protDisable').click(function () {
                    var username = $('#userName').text();
                    if(username==""){
                        layer.msg("你还未登陆,请先前往用户中心登陆!");
                    }else {
                        var mainId = $(this).parent().parent().find('.main_id').text() == "" ? 1 : $(this).parent().parent().find('.main_id').text();
                        var url = api + "protDisable?mainId=" + encodeURI(mainId) + '&userName=' + encodeURI(username);
                        $.getJSON(url, function (data) {
                            layer.msg(data.info);
                        }).error(function () {
                            layer.msg("提交失败");
                        });
                    }
                });
            //计算上架时间
            function sumTime(time) {
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
                time =timeStamp2String(time);
                // var startTime =new DateUtil().nowDate2String("yyyy-MM-dd HH:mm:ss");
                // time = time+" 00:00:00";
                // var reStr = null;
                // var diff = new DateUtil().diffDateTime(time,startTime)/1000;
                // var day = parseInt(diff / (24*60*60));//计算整数天数
                // var hour = parseInt(diff/(60*60));//计算整数小时数
                // var min = parseInt(diff/60);//计算整数分
                // if(day>1){
                //     reStr = day+"天前";
                // }else{
                //     var hour = parseInt(diff/(60*60));//计算整数小时数
                //     if(hour<1){
                //         hour = 1;
                //     }
                //     reStr = hour+"小时前";
                // }
                return time;
            }
            function replace(str){
                str = str.replace("电月","");
                str = str.replace("电点","");
                str = str.replace("网点","");
                str = str.replace("网月","");
                str = str.replace("双点","");
                str = str.replace("双月","");
                return str;
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
        },
        error:function () {
            layer.closeAll();
            layer.msg("数据请求失败!")
        }
    });
}

//填充区域选择框
function Dsy()
{
    this.Items = {};
}
Dsy.prototype.add = function(id,iArray)
{
    this.Items[id] = iArray;
};
Dsy.prototype.Exists = function(id)
{
    if(typeof(this.Items[id]) == "undefined") return false;
    return true;
};
function change(v){
    var str="0";
    for(i=0;i <v;i++){ str+=("_"+(document.getElementById(s[i]).selectedIndex-1));};
    var ss=document.getElementById(s[v]);
    with(ss){
        length = 0;
        options[0]=new Option(opt0[v],opt0[v]);
        if(v && document.getElementById(s[v-1]).selectedIndex>0 || !v)
        {
            if(dsy.Exists(str)){
                ar = dsy.Items[str];
                for(i=0;i <ar.length;i++)options[length]=new Option(ar[i],ar[i]);
                if(v)options[1].selected = true;
            }
        }
        if(++v <s.length){change(v);}
    }
}
var dsy = new Dsy();
var s=["s1","s2","s3"];
var opt0 = ["请选择","请选择","请选择"];
function setup()
{
    for(i=0;i <s.length-1;i++)
        document.getElementById(s[i]).onchange=new Function("change("+(i+1)+")");
    change(0);
}
var pres = null;
var cities = null;
var area = null;
function chg(obj) {
    if (obj.value == -1) {
        cityEle.options.length = 0;
        areaEle.options.length = 0;
    }
    //获取值
    var val = obj.value;
    pIndex = parseInt(obj.value)+1;
    //获取ctiry
    var cs = cities[val];
    //获取默认区
    var as = areas[val][0];
    //先清空市
    if(cityEle==null){
        cityEle = document.getElementById("city");
    }
    cityEle.options.length = 0;
    if(areaEle==null){
        areaEle = document.getElementById("area");
    }
    areaEle.options.length = 0;
    for (var i = 0; i < cs.length; i++) {
        var op = new Option(cs[i], i);
        cityEle.options.add(op);
    }
    for (var i = 0; i < as.length; i++) {
        var op = new Option(as[i], i);
        areaEle.options.add(op);
    }
}
function chg2(obj) {
    var val = obj.selectedIndex;
    // var as = areas[pIndex][val];
    var aIndex = obj.value;
    if(parseInt(pIndex-1)>0) {
        for(var i=0;i<parseInt(pIndex-1);i++) {
            aIndex =  parseInt(aIndex)+cities[i].length;
        }
    }
    var as = areas[aIndex];
    areaEle.options.length = 0;
    if(val!=0) {
        for (var i = 0; i < as.length; i++) {
            var op = new Option(as[i], i);
            areaEle.options.add(op);
        }
    }
}

//加载搜索框
function initSeach() {
    var url = api+'accountListSelection';
    $.getJSON(url,function (data) {
        var selecttions = data.selecttions==null?"":data.selecttions;
        //填充区域选择框
        if(selecttions!="") {
            initSelections(selecttions);
        }
    }).error(function () {
    }).complete(function () {
        $('.query-l').unbind("click");
        $('.query-l').click(function () {
            var tradeType =$('.dropdown.all-camera-dropdown').find("a").eq(0).text().trim();
            if(tradeType=="求购"){
                tradeType=1;
            }else{
                tradeType=2;
            }
            var areaSelection = "";
            $('.areaSelect').find('select').each(function () {
                var text = $(this).find('option:selected').text();
                if(text.indexOf("请选择")==-1) {
                    areaSelection += text + ',';
                }
            });
            if(areaSelection.length>2) {
                areaSelection = areaSelection.substring(0, areaSelection.length - 1);
            }else{
                areaSelection="";
            }
            var shape = $('.tixin').val()
            var index = $('.s_top').find('ul').find('.cur').index();
            if(index==0) {
                if (shape == "" && areaSelection == "") {
                    initTable();
                } else {
                    url = api + 'appearanceSale?areaSelection=' + encodeURI(areaSelection)
                        + '&shape=' + encodeURI(shape)
                        + '&startNum=0&endNum=20';
                    initTable(url);
                }
            }else if(index==1){
                if (shape == "" && areaSelection == "") {
                    initTable2();
                } else {
                    url = api + 'appearanceSale2?tradeType=' + encodeURI(tradeType)
                        + '&areaSelection=' + encodeURI(areaSelection)
                        + '&shape=' + encodeURI(shape)
                        + '&startNum=0&endNum=20';
                    initTable2(url);
                }
            }else if(index==2){
                if (shape == "" && areaSelection == "") {
                    initTable3();
                } else {
                    url = api + 'appearanceSale3?areaSelection=' + encodeURI(areaSelection)
                        + '&shape=' + encodeURI(shape)
                        + '&startNum=0&endNum=20';
                    initTable3(url);
                }
            }else if(index==3){
                if (shape == "" && areaSelection == "") {
                    initTable4();
                } else {
                    url = api + 'appearanceSale4?areaSelection=' + encodeURI(areaSelection)
                        + '&shape=' + encodeURI(shape)
                        + '&startNum=0&endNum=20';
                    initTable4(url);
                }
            }
        });
    });
    function initSelections(selecttions) {
        var typeArr = [];
        var quArr = [];
        var areaArr = []
        $.each(selecttions, function (i, value) {
            if (typeArr.indexOf(value.qufu_type) == -1) {
                typeArr.push(value.qufu_type);
            }
        });
        $.each(typeArr, function (i, value) {
            var arrTemp = [""];
            $.each(selecttions, function (j, value1) {
                if (value1.qufu_type == value) {
                    if (arrTemp.indexOf(value1.qufu_qu) == -1) {
                        arrTemp.push(value1.qufu_qu);
                    }
                }
            });
            quArr.push(arrTemp);
        });
        $.each(quArr, function (i, value) {
            $.each(value, function (j, value1) {
                var arrTemp = [""];
                $.each(selecttions, function (k, value2) {
                    if (value2.qufu_qu == value1) {
                        if (arrTemp.indexOf(value2.qufu_fu) == -1) {
                            arrTemp.push(value2.qufu_fu);
                        }
                    }
                });
                if (areaArr.indexOf(arrTemp) == -1) {
                    areaArr.push(arrTemp);
                }
            });
        });
        //声明省
        pres = typeArr;
        //声明市
        cities = quArr;
        areas = areaArr;

        dsy.add("0", pres);
        $.each(cities,function (i,value) {
            dsy.add("0_"+i,value);
        });
        var areaNum = 0;
        $.each(areas,function (i,value) {
            $.each(cities,function (j,value1) {
                dsy.add("0_"+i+"_"+j,value[areaNum]);
                areaNum++;
            });
        });

        //先设置省的值
        for (var i = 0; i < pres.length; i++) {
            //声明option.<option value="pres[i]">Pres[i]</option>
            var op = new Option(pres[i], i);
            //添加
            if(preEle==null){
                preEle = document.getElementById("pre");
            }
            preEle.options.add(op);
        }
    }
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


function initTable2(url,keyNum) {
    $('.show0').find('table').find('tr').eq(0).show();
    var startNum = 0;
    var endNum =20;
    if(keyNum!=null){
        endNum = 20;
        startNum = keyNum*20-20;
    }
    if(url==null) {
        var tradeType = $('.dropdown.all-camera-dropdown').find("a").eq(0).text().trim();
        if(tradeType=="求购"){
            tradeType=1;
        }else{
            tradeType=2;
        }
        var str = getUrlParam('tradeType');
        function getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg); //匹配目标参数
            if (r != null) return unescape(r[2]); return null; //返回参数值
        }
        if(parseInt(str)==1){
            tradeType=1;
            var sefont=$(".nav-pills ul li").eq(0).find('a').text();
            $(".nav-pills ul li").eq(0).parents('.nav-pills').find('.dropdown-toggle').html(sefont+'<b class="caret"></b>')
        }else if(parseInt(str)==2){
            tradeType=2;
            var sefont=$(".nav-pills ul li").eq(1).find('a').text();
            $(".nav-pills ul li").eq(0).parents('.nav-pills').find('.dropdown-toggle').html(sefont+'<b class="caret"></b>')
        }
        var areaSelection = "";
        $('.areaSelect').find('select').each(function () {
            var text = $(this).find('option:selected').text();
            if(text.indexOf("请选择")==-1) {
                areaSelection += text + ',';
            }
        });
        if(areaSelection.length>2) {
            areaSelection = areaSelection.substring(0, areaSelection.length - 1);
        }else{
            areaSelection="";
        }
        var shape = $('.tixin').val();
        if(shape==""&&areaSelection=="") {
            url = api + 'appearanceSale2?tradeType='+encodeURI(tradeType)+
                '&startNum=' + encodeURI(startNum) +
                '&endNum=' + encodeURI(endNum);
        }else{
            url = api + 'appearanceSale2?tradeType='+encodeURI(tradeType)
                +'&areaSelection=' + encodeURI(areaSelection)
                +'&shape=' + encodeURI(shape)
                +'&startNum=' +encodeURI(startNum)+
                +'&endNum=20';
        }
    }
    $(".table").empty();
    $(".table").append("<div class=\"table-tr tablered\">\n" +
        "        <div class=\"table-th table-th1\" style=\"width: 11% !important;padding-left: 30px;\">区服</div>\n" +
        "        <div class=\"table-th\">外观名</div>\n" +
        "        <div class=\"table-th\">说明</div>\n" +
        "        <div class=\"table-th\">收/售</div>\n" +
        "        <div class=\"table-th\">价格(元)</div>\n" +
        "        <div class=\"table-th\">上架时间</div>\n" +
        "        <div class=\"table-th\">联系</div>\n" +
        "      </div>");
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
                var time = sumTime(value.FAVOR_DATE);
                var belongOf = value.BELONG_QF.replace("[", "");
                belongOf = belongOf.replace("]", "");
                if(belongOf.length>6) {
                    belongOf = replace(belongOf);
                }
                belongOf = belongOf.split(',')[0];
                var tradeType = value.TRADE_TYPE ==1?'求购':'出售';
                var viewName = value.VIEW_NAME==null?'--':value.VIEW_NAME;
                var priceNum = value.PRICE_NUM==null?'--':value.PRICE_NUM+'元';
                if(userId!=""){
                    if(userId!=value.userIdColl){
                        value.COLL_TYPE=0;
                    }
                }else{
                    value.COLL_TYPE=0;
                }
                var postContent = getNewline(value.FAVOR_INFO.replace("<br>",""));
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
                        if(bytesCount>=120){
                            s = s + '<br>';
                            //重置
                            bytesCount=0;
                        }
                    }
                    return s;
                }
                    $(".table").append(" <div class=\"table-tr\">\n" +
                        "        <div class=\"table-td main_id\" style='display: none'>" + value.FAVOR_ID + "</div>\n" +
                        "        <div class=\"table-td userId\" style='display: none'>" + value.USER_ID + "</div>\n" +
                        "        <div class=\"table-td\">" + belongOf + "</div>\n" +
                        "        <div class=\"table-td\">" + viewName + "</div>\n" +
                        "        <div class=\"table-td table_lw\">" + postContent + "</div>\n" +
                        "        <div class=\"table-td\">" + tradeType + "</div>\n" +
                        "        <div class=\"table-td\">" + priceNum + "</div>\n" +
                        "        <div class=\"table-td\">" + time + "</div>\n" +
                        "        <div class=\"table-td\"><a class='modalBtn' href='javascript:void (0);'>联系方式</div>\n" +
                        "      </div>");
            });
            //查看源
            $('.modalBtn').unbind('click');
            $('.modalBtn').click(function () {
                var mainId = $(this).parent().parent().find('.main_id').text()==""?1:$(this).parent().parent().find('.main_id').text();
                var url = api + 'appearanceSaleSource2?mainId=' + encodeURI(mainId);
                $.getJSON(url, function (data) {
                    if (data.datas == 'noAuth') {
                        layer.msg('您没有查看权限,请前往用户中心充值!');
                    } else {
                         $('#identifier').addClass('madalHide');
                         data = data.datas == null ? "--" : data.datas;
                         var $table = $('#identifier').find('table');
                         $table.empty();
                         $table.append("<p>用户联系方式：</p>\n" +
                             "                    <p>QQ：" + data + "</p>\n" +
                             "                    <p>特别提示：请注意交易安全，本平台不对信息真实性和信息的安全性提供保证。若有疑问，请联系客服。</p>\n" +
                             "                    ");
                    }
                });
            });
            var colose = $('.close');
            var cancel = $('.btn-default');
            $(colose,cancel).click(function () {
                $(this).parents('.modal').removeClass('madalHide');
            });
            //计算上架时间
            function sumTime(time) {
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
                time =timeStamp2String(time);
                return time;
            }
            function replace(str){
                str = str.replace("电月","");
                str = str.replace("电点","");
                str = str.replace("网点","");
                str = str.replace("网月","");
                str = str.replace("双点","");
                str = str.replace("双月","");
                return str;
            }
        },
        complete:function () {
            layer.closeAll();
            var pageList = dataTemp.pageList==null?"":dataTemp.pageList;
            if(pageList!=""){
                initPage2(pageList,keyNum);
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

//加载分页组件
function initPage2(pageList,keyNum) {
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
            initPage2(pageDatas);
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
                    initTable2();
                }else if(num=='上一页'){
                    var num = parseInt($('.pagination').find('.active').find('a').text())-1;
                    initTable2(null,num);
                }else if(num=='下一页'){
                    var num = parseInt($('.pagination').find('.active').find('a').text())+1;
                    initTable2(null,num);
                }else if(num=='尾页'){
                    initTable2(null,pageNum);
                }else{
                    initTable2(null,num);
                }
            });
        }
    })
}


function initTable3(url,keyNum) {
    $('.show0').find('table').find('tr').eq(0).hide();
    var startNum = 0;
    var endNum =20;
    if(keyNum!=null){
        endNum = 20;
        startNum = keyNum*20-20;
    }
    if(url==null) {
        var areaSelection = "";
        $('.areaSelect').find('select').each(function () {
            var text = $(this).find('option:selected').text();
            if(text.indexOf("请选择")==-1) {
                areaSelection += text + ',';
            }
        });
        if(areaSelection.length>2) {
            areaSelection = areaSelection.substring(0, areaSelection.length - 1);
        }else{
            areaSelection="";
        }
        var shape = $('.tixin').val();
        if(shape==""&&areaSelection=="") {
            url = api + 'appearanceSale3?startNum=' + encodeURI(startNum) +
                '&endNum=' + encodeURI(endNum);
        }else{
            url = api + 'appearanceSale3?areaSelection=' + encodeURI(areaSelection)
                + '&shape=' + encodeURI(shape)
                +'&startNum=' +encodeURI(startNum)+
                +'&endNum=20';
        }
    }
    $(".table").empty();
    $(".table").append("<div class=\"table-tr tablered\">\n" +
        "        <div class=\"table-th table-th1\"></div>\n" +
        "        <div class=\"table-th\"></div>\n" +
        "        <div class=\"table-th\" style=\"width: 11% !important;padding-left: 30px;\">区服</div>\n" +
        "        <div class=\"table-th\">外观名</div>\n" +
        "        <div class=\"table-th\">别名</div>\n" +
        "        <div class=\"table-th\">成交价格(元)</div>\n" +
        "        <div class=\"table-th\">成交时间</div>\n" +
        "      </div>");
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
                var time = sumTime(value.TRADE_DATE);
                var belongOf = value.BELONG_QF.replace("[", "");
                belongOf = belongOf.replace("]", "");
                if(belongOf.length>6) {
                    belongOf = replace(belongOf);
                }
                belongOf = belongOf.split(',')[0];
                var viewName = value.VIEW_NAME==null?'--':value.VIEW_NAME;
                var viewName_1 = value.VIEW_NAME_1==null?'--':value.VIEW_NAME_1;
                var priceNum = value.PRICE_NUM==null?'--':value.PRICE_NUM;
                    $(".table").append(" <div class=\"table-tr\">\n" +
                        "        <div class=\"table-td\"></div>\n" +
                        "        <div class=\"table-td\"></div>\n" +
                        "        <div class=\"table-td\">" + belongOf + "</div>\n" +
                        "        <div class=\"table-td\">" + viewName + "</div>\n" +
                        "        <div class=\"table-td\">" + viewName_1 + "</div>\n" +
                        "        <div class=\"table-td\">" + priceNum + "</div>\n" +
                        "        <div class=\"table-td\">" + time + "</div>\n" +
                        "      </div>");
            });
            //计算上架时间
            function sumTime(time) {
                function timeStamp2String (time){
                    var datetime = new Date();
                    datetime.setTime(time);
                    var year = datetime.getFullYear();
                    var month = datetime.getMonth() + 1;
                    var date = datetime.getDate();
                    // var hour = datetime.getHours();
                    // var min = datetime.getMinutes();
                    // var second = datetime.getSeconds();
                    if(parseInt(month)<10){
                        month = '0'+month;
                    }
                    if(parseInt(date)<10){
                        date = '0'+date;
                    }
                    // if(parseInt(hour)<10){
                    //     hour = '0'+hour;
                    // }
                    // if(parseInt(min)<10){
                    //     min = '0'+min;
                    // }
                    // if(parseInt(second)<10){
                    //     second = '0'+second;
                    // }
                    // return year + "-" + month + "-" + date+" "+hour+":"+min+":"+second;
                    return year + "-" + month + "-" + date;
                };
                time =timeStamp2String(time);
                // var startTime =new DateUtil().nowDate2String("yyyy-MM-dd HH:mm:ss");
                // time = time+" 00:00:00";
                // var reStr = null;
                // var diff = new DateUtil().diffDateTime(time,startTime)/1000;
                // var day = parseInt(diff / (24*60*60));//计算整数天数
                // var hour = parseInt(diff/(60*60));//计算整数小时数
                // var min = parseInt(diff/60);//计算整数分
                // if(day>1){
                //     reStr = day+"天前";
                // }else{
                //     var hour = parseInt(diff/(60*60));//计算整数小时数
                //     if(hour<1){
                //         hour = 1;
                //     }
                //     reStr = hour+"小时前";
                // }
                return time;
            }
            function replace(str){
                str = str.replace("电月","");
                str = str.replace("电点","");
                str = str.replace("网点","");
                str = str.replace("网月","");
                str = str.replace("双点","");
                str = str.replace("双月","");
                return str;
            }
        },
        complete:function () {
            layer.closeAll();
            var pageList = dataTemp.pageList==null?"":dataTemp.pageList;
            if(pageList!=""){
                initPage3(pageList,keyNum);
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

//加载分页组件
function initPage3(pageList,keyNum) {
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
            initPage3(pageDatas);
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
                    initTable3();
                }else if(num=='上一页'){
                    var num = parseInt($('.pagination').find('.active').find('a').text())-1;
                    initTable3(null,num);
                }else if(num=='下一页'){
                    var num = parseInt($('.pagination').find('.active').find('a').text())+1;
                    initTable3(null,num);
                }else if(num=='尾页'){
                    initTable3(null,pageNum);
                }else{
                    initTable3(null,num);
                }
            });
        }
    })
}

function initTable4(url,keyNum) {
    $('.show0').find('table').find('tr').eq(0).hide();
    var startNum = 0;
    var endNum =20;
    if(keyNum!=null){
        endNum = 20;
        startNum = keyNum*20-20;
    }
    if(url==null) {
        var areaSelection = "";
        $('.qufu').find('.cur').each(function (i,value) {
            areaSelection += $(this).parent().text()+ ',';
        });
        if(areaSelection.length>2) {
            areaSelection = areaSelection.substring(0, areaSelection.length - 1);
        }else{
            areaSelection="";
        }
        var shape = $('.tixin').val();
        if(shape==""&&areaSelection=="") {
            url = api + 'appearanceSale4?startNum=' + encodeURI(startNum) +
                '&endNum=' + encodeURI(endNum);
        }else{
            url = api + 'appearanceSale4?areaSelection=' + encodeURI(areaSelection)
                + '&shape=' + encodeURI(shape)
                +'&startNum=' +encodeURI(startNum)
                +'&endNum=20';
        }
    }
    $(".table").empty();
    $(".table").append("<div class=\"table-tr tablered\">\n" +
        "        <div class=\"table-th table-th1\"></div>\n" +
        "        <div class=\"table-th\"></div>\n" +
        "        <div class=\"table-th\" style=\"width: 11% !important;padding-left: 30px;\">区服</div>\n" +
        "        <div class=\"table-th\">外观类型</div>\n" +
        "        <div class=\"table-th\">外观名</div>\n" +
        "        <div class=\"table-th\">别名</div>\n" +
        "        <div class=\"table-th\">说明</div>\n" +
        "        <div class=\"table-th\">市价</div>\n" +
        "        <div class=\"table-th\">黄牛价</div>\n" +
        "        <div class=\"table-th\">更新时间</div>\n" +
        "      </div>");
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
                var time = sumTime(value.TRADE_DATE);
                var belongOf = value.BELONG_QF.replace("[", "");
                belongOf = belongOf.replace("]", "");
                if(belongOf.length>6) {
                    belongOf = replace(belongOf);
                }
                belongOf = belongOf.split(',')[0];
                var viewName = value.VIEW_NAME==null?'--':value.VIEW_NAME;
                var viewName_1 = value.VIEW_NAME_1==null?'--':value.VIEW_NAME_1;
                var priceNum1 = value.PRICE_FLOOR==null||value.PRICE_FLOOR==0?'--':value.PRICE_FLOOR;
                var priceNum2 = value.PRICE_CEILING==null||value.PRICE_CEILING==0?'--':value.PRICE_CEILING;
                var priceNum3 = value.PRICE_HN==null||value.PRICE_HN==0?'--':value.PRICE_HN;
                var priceNum4 = value.PRICE_HN_HIGH==null||value.PRICE_HN_HIGH==0?'--':value.PRICE_HN_HIGH;
                var price12 = "";
                if(priceNum1=='--'&&priceNum2=='--'){
                    price12='--';
                }else if(priceNum1=='--'){
                    price12 = priceNum2;
                }else if(priceNum2=='--'){
                    price12 = priceNum1;
                }else{
                    price12 = priceNum1+'-'+priceNum2;
                }
                var price34 = "";
                if(priceNum3=='--'&&priceNum4=='--'){
                    price34='--';
                }else if(priceNum3=='--'){
                    price34 = priceNum4;
                }else if(priceNum4=='--'){
                    price34 = priceNum3;
                }else{
                    price34 = priceNum3+'-'+priceNum4;
                }
                var content = value.VIEW_CONTENT==null?'--':value.VIEW_CONTENT;
                var waiguanType = value.WAIGUAN_TYPE==1?'发型':value.WAIGUAN_TYPE==2?
                        '限量成衣':value.WAIGUAN_TYPE==3?'限时成衣':value.WAIGUAN_TYPE==4?
                        '披风':value.WAIGUAN_TYPE==5?'套装盒子':'--';
                content = getNewline(content);
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
                        if(bytesCount>=40){
                            s = s + '<br>';
                            //重置
                            bytesCount=0;
                        }
                    }
                    return s;
                }
                    $(".table").append(" <div class=\"table-tr\">\n" +
                        "        <div class=\"table-td\"></div>\n" +
                        "        <div class=\"table-td\"></div>\n" +
                        "        <div class=\"table-td\">" + belongOf + "</div>\n" +
                        "        <div class=\"table-td\">" + waiguanType + "</div>\n" +
                        "        <div class=\"table-td\">" + viewName + "</div>\n" +
                        "        <div class=\"table-td\">" + viewName_1 + "</div>\n" +
                        "        <div class=\"table-td\">" + content + "</div>\n" +
                        "        <div class=\"table-td\">" + price12 + "</div>\n" +
                        "        <div class=\"table-td\">" + price34 + "</div>\n" +
                        "        <div class=\"table-td\">" + time + "</div>\n" +
                        "      </div>");
            });
            //计算上架时间
            function sumTime(time) {
                function timeStamp2String (time){
                    var datetime = new Date();
                    datetime.setTime(time);
                    var year = datetime.getFullYear();
                    var month = datetime.getMonth() + 1;
                    var date = datetime.getDate();
                    // var hour = datetime.getHours();
                    // var min = datetime.getMinutes();
                    // var second = datetime.getSeconds();
                    if(parseInt(month)<10){
                        month = '0'+month;
                    }
                    if(parseInt(date)<10){
                        date = '0'+date;
                    }
                    // if(parseInt(hour)<10){
                    //     hour = '0'+hour;
                    // }
                    // if(parseInt(min)<10){
                    //     min = '0'+min;
                    // }
                    // if(parseInt(second)<10){
                    //     second = '0'+second;
                    // }
                    // return year + "-" + month + "-" + date+" "+hour+":"+min+":"+second;
                    return year + "-" + month + "-" + date;
                };
                time =timeStamp2String(time);
                // var startTime =new DateUtil().nowDate2String("yyyy-MM-dd HH:mm:ss");
                // time = time+" 00:00:00";
                // var reStr = null;
                // var diff = new DateUtil().diffDateTime(time,startTime)/1000;
                // var day = parseInt(diff / (24*60*60));//计算整数天数
                // var hour = parseInt(diff/(60*60));//计算整数小时数
                // var min = parseInt(diff/60);//计算整数分
                // if(day>1){
                //     reStr = day+"天前";
                // }else{
                //     var hour = parseInt(diff/(60*60));//计算整数小时数
                //     if(hour<1){
                //         hour = 1;
                //     }
                //     reStr = hour+"小时前";
                // }
                return time;
            }
            function replace(str){
                str = str.replace("电月","");
                str = str.replace("电点","");
                str = str.replace("网点","");
                str = str.replace("网月","");
                str = str.replace("双点","");
                str = str.replace("双月","");
                return str;
            }
        },
        complete:function () {
            layer.closeAll();
            var pageList = dataTemp.pageList==null?"":dataTemp.pageList;
            if(pageList!=""){
                initPage4(pageList,keyNum);
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

//加载分页组件
function initPage4(pageList,keyNum) {
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
            initPage4(pageDatas);
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
                    initTable4();
                }else if(num=='上一页'){
                    var num = parseInt($('.pagination').find('.active').find('a').text())-1;
                    initTable4(null,num);
                }else if(num=='下一页'){
                    var num = parseInt($('.pagination').find('.active').find('a').text())+1;
                    initTable4(null,num);
                }else if(num=='尾页'){
                    initTable4(null,pageNum);
                }else{
                    initTable4(null,num);
                }
            });
        }
    })
}