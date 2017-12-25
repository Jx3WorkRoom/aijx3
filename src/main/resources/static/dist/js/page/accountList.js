api = api+"accountList/";
//设置一个省的公共下标
var pIndex = 0;
var preEle = document.getElementById("pre");
var cityEle = document.getElementById("city");
var areaEle = document.getElementById("area");
var clickSeachNum = 0;
var pageClickNum = 1;
var segDatas = null;
$(function () {
    initTable();
    initSeach();
    initKeepQuery();
    timer()
});

function timer() {
    setInterval("timeFun()",10*60*1000);
    function timeFun() {
        initTable();
        initSeach();
    }
}

//url 查询时传入新的url
//keyNum page组件点击的第几页
function initTable(url,keyNum) {
    layer.load();
    var startNum = 0;
    var endNum =30;
    if(keyNum!=null){
        endNum = 30;
        startNum = keyNum*30-30;
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
        var shape = $('.menpai').find("option:selected").text()+$('.tixin').find("option:selected").text();
        var faxin = $('.faxin').val()==null?"":$('.faxin').val().toString().replace(",","");
        var hezi = $('.hezi').val()==null?"":$('.hezi').val().toString().replace(",","");
        var pifeng = $('.pifeng').val()==null?"":$('.pifeng').val().toString().replace(",","");
        var wuxian = $('.wuxian').val()==null?"":$('.wuxian').val().toString().replace(",","");
        var liuxian = $('.liuxian').val()==null?"":$('.liuxian').val().toString().replace(",","");
        var chengyi = $('.chengyi').val()==null?"":$('.chengyi').val().toString().replace(",","");
        var qiyu = $('.qiyu').val()==null?"":$('.qiyu').val().toString().replace(",","");
        var chengyu = $('.chengwu').val()==null?"":$('.chengwu').val().toString().replace(",","");
        var guajia = $('.guajian').val()==null?"":$('.guajian').val().toString().replace(",","");
        var info = faxin+hezi+pifeng+wuxian+liuxian+chengyi+qiyu+chengyu+guajia+$('.info').val();

        var lowPrice = $('.lowPrice').val();
        var highPrice = $('.highPrice').val();
        var hasChecked = $(".hasPrice").get(0).checked;
        if(shape==""&&info==""&&areaSelection==""&&lowPrice==""&&highPrice==""){
            url = api+'accountList?tradeType='+encodeURI(tradeType)+'&startNum='+encodeURI(startNum)+'&endNum='+encodeURI(endNum);
        }else{
            if(parseInt(highPrice)<parseInt(lowPrice)){
                layer.closeAll();
                layer.msg("高价必须比低价高!");
                return false;
            }else {
                url = api + 'accountList?tradeType=' + encodeURI(tradeType)
                    + '&areaSelection=' + encodeURI(areaSelection)
                    + '&shape=' + encodeURI(shape)
                    + '&info=' + encodeURI(info)
                    + '&lowPrice=' + encodeURI(lowPrice)
                    + '&highPrice=' + encodeURI(highPrice)
                    + '&hasChecked=' + encodeURI(hasChecked)
                    + '&startNum=' + encodeURI(startNum)
                    + '&endNum=';
                +encodeURI(endNum);
            }
        }
    }
    $(".table").empty();
    $(".table").append("<div class=\"table-tr tablered\">\n" +
        "            <div class=\"table-th table-th1\" style=\"width: 11% !important;padding-left: 30px;\">区服</div>\n" +
        "            <div class=\"table-th\">门派</div>\n" +
        "            <div class=\"table-th\">资料简介</div>\n" +
        "             <div class=\"table-th\">收/售</div>\n" +
        "            <div class=\"table-th\">价格（元）</div>\n" +
        "            <div class=\"table-th\">匹配度</div>\n" +
        "            <div class=\"table-th\">上架时间</div>\n" +
        "          </div>");
    var dataTemp = null;
    $.ajax({
        url:url,
        async:true,
        success:function (data) {
            dataTemp = data;
            //填充表格数据
            var tableDatas = data.datas==null?"":data.datas;
            if(clickSeachNum!=0){
                $.each(tableDatas,function (i,value) {
                    var matchingDegree = sumMatchingDegree(value,data.segMentWordMap);
                    value['matchDegree'] = matchingDegree;
                    initDiv(value);
                });
            }else {
                $.each(tableDatas, function (i, value) {
                    initDiv(value);
                });
            }
            function initDiv(value){
                var time = sumTime(value.REPLY_TIME);
                var tradeType = value.TRADE_TYPE == 1 ? "求购" : "出售";
                var matchingDegree = '--';
                if (clickSeachNum != 0&&!isNaN(value.matchDegree)) {
                    matchingDegree = value.matchDegree + '%';
                }
                var belongOf = value.BELONG_QF.replace("[", "");
                belongOf = belongOf.replace("]", "");
                if(belongOf.length>6) {
                    belongOf = replace(belongOf);
                }
                belongOf = belongOf.split(',')[0];
                var TIXIN = value.TIXIN.replace("[", "");
                TIXIN = TIXIN.replace("]", "");
                TIXIN = TIXIN.split(',')[0];
                if(TIXIN.length>=4){
                    TIXIN = TIXIN.substring(2,TIXIN.length);
                }
                // var REPLY_CONTENT = getNewline(value.REPLY_CONTENT);
                var REPLY_CONTENT = value.REPLY_CONTENT;
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
                var price = value.PRICE_NUM.toString().replace("[", "").replace("]", "");
                $(".table").append("<div class=\"table-tr\">\n" +
                    "            <div class=\"table-td\">" + belongOf + "</div>\n" +
                    "            <div class=\"table-td\">" + TIXIN + "</div>\n" +
                    "            <div class=\"table-td table_lw\"><a href='accountDetail?favorId=" + value.FAVOR_ID + "&sourceType="+value.SOURCE_TYPE+"'  target='_blank'>" + REPLY_CONTENT + "</a></div>\n" +
                    "            <div class=\"table-td\">" + tradeType + "</div>\n" +
                    "            <div class=\"table-td\">" + price + "</div>\n" +
                    "            <div class=\"table-td\">" + matchingDegree + "</div>\n" +
                    "            <div class=\"table-td\">" + time + "</div>\n" +
                    "          </div>")
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
            //计算匹配度
            function sumMatchingDegree(value,num) {
                num = parseInt(num);
                var sumNum = 0;
                for(var i =1;i<=num;i++){
                    sumNum += parseInt(value['rate'+i]);
                }
                return parseInt(sumNum*100/num);
            }
            //计算上架时间
            function sumTime(time) {
                function timeStamp2String (time){
                    var datetime = new Date();
                    datetime.setTime(time);
                    var year = datetime.getFullYear();
                    var month = datetime.getMonth() + 1;
                    var date = datetime.getDate();
                    var hour =datetime.getHours();
                    var minute = datetime.getMinutes();
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
                    if(parseInt(minute)<10){
                        minute = '0'+minute;
                    }
                    if(parseInt(second)<10){
                        second = '0'+second;
                    }
                    return year + "-" + month + "-" + date +" "+hour+":"+minute+":"+second;
                };
                time =timeStamp2String(time);
                // var startTime =new DateUtil().nowDate2String("yyyy-MM-dd HH:mm:ss");
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
                //         reStr ="1小时内";
                //     }else {
                //         reStr = hour + "小时前";
                //     }
                // }
                return time;
            }
        },
        complete:function () {
            layer.closeAll();
            var pageList = dataTemp.pageList==null?"":dataTemp.pageList;
            if(pageList!=""){
                initPage(pageList,keyNum);
            }else{
                $('.pagination').empty();
                layer.msg("未查到相关数据!")
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
        //填充体型选择框
        initTixin(data);
        segDatas = data;
    }).error(function () {
    }).complete(function () {
        $('.query-l').unbind("click");
        $('.query-l').click(function () {
            pageClickNum = 1;
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
            var shape = $('.menpai').find("option:selected").text()+$('.tixin').find("option:selected").text();
            var info = $('.selectedOption').text().toString().replace(",","")+$('.info').val();
            var hasChecked = $(".hasPrice").get(0).checked;
            if(info!=""){
                clickSeachNum++;
            }else{
                clickSeachNum=0;
            }
            var lowPrice = $('.lowPrice').val();
            var highPrice = $('.highPrice').val();
            if(shape==""&&info==""&&areaSelection==""&&lowPrice==""&&highPrice==""){
                initTable();
            }else {
                if(parseInt(highPrice)<parseInt(lowPrice)) {
                    layer.closeAll();
                    layer.msg("高价必须比低价高!");
                    return false;
                }else{
                    url = api + 'accountList?tradeType=' + encodeURI(tradeType)
                        + '&areaSelection=' + encodeURI(areaSelection)
                        + '&shape=' + encodeURI(shape)
                        + '&info=' + encodeURI(info)
                        + '&lowPrice=' + encodeURI(lowPrice)
                        + '&highPrice=' + encodeURI(highPrice)
                        + '&hasChecked=' + encodeURI(hasChecked)
                        + '&startNum=0&endNum=30';
                    initTable(url);
                }
            }
        });
        $('.lowPrice').change(function () {
            var num = parseInt($(this).val());
            if(num<1){
                $('.lowPrice').val(1);
            }
        });
        $('.highPrice').change(function () {
            var num = parseInt($(this).val());
            if(num<1){
                $('.highPrice').val(2);
            }
        });
    });
    function initSelections(selecttions) {
        var typeArr = [];
        var quArr = [];
        var areaArr = []
        $.each(selecttions, function (i, value) {
            if (typeArr.indexOf(value.qufu_type) == -1) {
                console.log(value);
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

    function initTixin(data) {
        var tixin = data.tixin;
        $('.menpai').append("  <option value=''></option> ");
        $.each(tixin,function (i,value) {
            var val1 = value.menpai_name;
           $('.menpai').append("  <option value="+val1+">"+val1+"</option> ");
        });
        $(".js-example-basic-single").select2();

        var faxin = data.faxin;
        $('.faxin').append("  <option value=''></option> ");
        $.each(faxin,function (i,value) {
            $('.faxin').append("  <option value="+value.WAIGUAN_NAME+">"+value.WAIGUAN_NAME+"("+value.WAIGUAN_NAME_2+")"+"</option> ");
        });

        var hezi = data.hezi;
        $('.hezi').append("  <option value=''></option> ");
        $.each(hezi,function (i,value) {
            $('.hezi').append("  <option value="+value.WAIGUAN_NAME+">"+value.WAIGUAN_NAME+"("+value.WAIGUAN_NAME_2+")"+"</option> ");
        });

        var pifeng = data.pifeng;
        $('.pifeng').append("  <option value=''></option> ");
        $.each(pifeng,function (i,value) {
            $('.pifeng').append("  <option value="+value.WAIGUAN_NAME+">"+value.WAIGUAN_NAME+"("+value.WAIGUAN_NAME_2+")"+"</option> ");
        });

        var wuxian = data.wuxian;
        $('.wuxian').append("  <option value=''></option> ");
        $.each(wuxian,function (i,value) {
            $('.wuxian').append("  <option value="+value.WAIGUAN_NAME+">"+value.WAIGUAN_NAME+"("+value.WAIGUAN_NAME_2+")"+"</option> ");
        });

        var liuxian = data.liuxian;
        $('.liuxian').append("  <option value=''></option> ");
        $.each(liuxian,function (i,value) {
            $('.liuxian').append("  <option value="+value.WAIGUAN_NAME+">"+value.WAIGUAN_NAME+"("+value.WAIGUAN_NAME_2+")"+"</option> ");
        });

        var chengyi = data.chengyi;
        $('.chengyi').append("  <option value=''></option> ");
        $.each(chengyi,function (i,value) {
            $('.chengyi').append("  <option value="+value.WAIGUAN_NAME+">"+value.WAIGUAN_NAME+"("+value.WAIGUAN_NAME_2+")"+"</option> ");
        });

        var qiyu = data.qiyu;
        $('.qiyu').append("  <option value=''></option> ");
        $.each(qiyu,function (i,value) {
            $('.qiyu').append("  <option value="+value.stra_name+">"+value.stra_name+"</option> ");
        });

        var c5 = data.c5;
        $('.chengwu').append("  <option value=''></option> ");
        $.each(c5,function (i,value) {
            $('.chengwu').append("  <option value="+value.arm_name+">"+value.arm_name+"</option> ");
        });

        var guajian = data.guajian;
        $('.guajian').append("  <option value=''></option> ");
        $.each(guajian,function (i,value) {
            $('.guajian').append("  <option value="+value.pend_name+">"+value.pend_name+"</option> ");
        });

        $('.faxin,.hezi,.pifeng,.wuxian,.liuxian,.chengyi,.qiyu,.chengwu,.guajian').change(function () {
            var val = $(this).val();
            var allVal = $('.selectedOption').text().toString().replace(",","");
            if(allVal.indexOf(val)>-1){
                $('.selectedOption').each(function () {
                    var text = $(this).text();
                    if(text==val){
                        $(this).remove();
                    }
                })
            }else {
                $('.info2').append(
                    '<div class="selectedOption">' +
                    '<div>' + val + '</div>' +
                    '<span class="deleteOption"></span>' +
                    '</div>'
                );
                $('.selectedOption').unbind('click');
                $('.selectedOption').click(function () {
                    $(this).remove();
                });
            }

        });
    }

    $('input[name="fanganType"]').click(function () {
        if($(this).val()=='1'){
            $('.pipeiDiv').hide();
        }else{
            $('.pipeiDiv').show();
        }
    });
}

//加载分页组件
function initPage(pageList,keyNum) {
    var pageDatas = pageList;
    pageList = pageList==null?100:pageList-1;
    var pageNum = parseInt(pageList/30)+1;
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
    }else
        {
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
                    pageClickNum = 1;
                    initTable();
                }else if(num=='上一页'){
                    var num = parseInt($('.pagination').find('.active').find('a').text())-1;
                    pageClickNum = parseInt(num);
                    initTable(null,num);
                }else if(num=='下一页'){
                    var num = parseInt($('.pagination').find('.active').find('a').text())+1;
                    pageClickNum = parseInt(num);
                    initTable(null,num);
                }else if(num=='尾页'){
                    pageClickNum = parseInt(pageNum);
                    initTable(null,pageNum);
                }else{
                    pageClickNum = parseInt(num);
                    initTable(null,num);
                }
            });
        }
    })
}

var keepQueryDatas = null;
function initKeepQuery(){
    $('#keepQueryDetail').find('.modal-title').text('新建搜索或蹲号方案');
    var username = $('#userName').text();
    if(username!=""){
        $('.querySelect').show();
        var url = api+'getKeepQuery?username='+encodeURI(username);
        $.getJSON(url,function (data) {
            data = data.datas;
            keepQueryDatas = data;
            $.each(data,function (i,value) {
                $('.querySelect').append("<option value='"+value.user_seq+"'>&nbsp;"+value.fang_an_name+"</option>")
            });
        }).complete(function () {
            $('.querySelect').unbind('change');
            $('.querySelect').change(function () {
                var selectId = $('.querySelect').val();
                $.each(keepQueryDatas,function (i,value) {
                    if(value.user_seq==selectId){
                        var tradeType = value.trade_type;
                        if(tradeType==1){
                            $('.dropdown-menu li').eq(0).click();
                        }else{
                            $('.dropdown-menu li').eq(1).click();
                        }
                        var qufu1 = value.qf_factor_1.trim();
                        $("#pre").find("option:selected").text(qufu1);
                        var qufu2 = value.qf_factor_2.trim();
                        $("#city").find("option:selected").text(qufu2);
                        var qufu3 = value.qf_factor_3.trim();
                        $("#area").find("option:selected").text(qufu3);
                        var menpai = value.menpai_factor;
                        $('.menpai').val(menpai).trigger("change");
                        var tixin = value.tixin_factor;
                        $('.tixin').val(tixin).trigger("change");
                        var faxin = value.faxin.split(',');
                        $('.faxin').val(faxin).trigger("change");
                        var hezi = value.hezhi.split(',');
                        $('.hezi').val(hezi).trigger("change");
                        var pifeng = value.pifeng.split(',');
                        $('.pifeng').val(pifeng).trigger("change");
                        var wuxian = value.wuxian.split(',');
                        $('.wuxian').val(wuxian).trigger("change");
                        var liuxian = value.liuxian.split(',');
                        $('.liuxian').val(liuxian).trigger("change");
                        var chengyi = value.chenyi.split(',');
                        $('.chengyi').val(chengyi).trigger("change");
                        var qiyu = value.qiyu.split(',');
                        $('.qiyu').val(qiyu).trigger("change");
                        var chengwu = value.chenwu.split(',');
                        $('.chengwu').val(chengwu).trigger("change");
                        var guajian = value.gujian.split(',');
                        $('.guajian').val(guajian).trigger("change");
                        var info = value.search_factor;
                        $('.info').val(info);
                        var lowPrice = value.price_low;
                        if(lowPrice!=0) {
                            $('.lowPrice').val(lowPrice);
                        }
                        var highPrice = value.price_up;
                        if(highPrice!=0) {
                            $('.highPrice').val(highPrice);
                        }

                    }
                });
            });
        });
    }
    $('.keepQuery').click(function () {
       if(username==""){
           layer.msg("登录后方可保存!");
       }else{
           layer.confirm("搜索或自动蹲号方案",{
               btn: ['保存新的方案', '删除已有方案'],
               btn2: function(index, layero){
                   layer.closeAll();
                   $('.addQuery').hide();
                   $('.editQuery').hide();
                   $('.modal-footer').hide();
                   $('.delQuery').show();
                   $('#keepQueryDetail').modal('show');
                   initDelQuery();
               }
           }, function(index, layero){
               layer.closeAll();
               $('.delQuery').hide();
               $('.editQuery').hide();
               $('.modal-footer').show();
               $('.addQuery').show();
               $('#keepQueryDetail').modal('show');
               initAddQuery();
           });
       }
    });
}

function initDelQuery() {
    $('#keepQueryDetail').find('.modal-title').text('管理已有方案');
    var username = $('#userName').text();
    var url = api+'getKeepQuery?username='+encodeURI(username);
    $.getJSON(url,function (data) {
        data = data.datas;
        keepQueryDatas = data;
        $('.delQueryTable tbody').empty();
        $.each(data,function (i,value) {
            var type = value.fang_an_type ==1?"搜索方案":"蹲号方案";
            $('.delQueryTable tbody').append(
                "<tr><td>"+value.user_seq+"</td>"+
                "<td>"+type+"</td>"+
                "<td>"+value.fang_an_name+"</td>"+
                "<td><span class='delQueryList'>X</span></td></>"
            );
        });
    }).complete(function () {
        $('.delQueryList').unbind('click');
        $('.delQueryList').click(function () {
            var thisObj = $(this);
            layer.confirm('确定删除吗?', {icon: 3, title:'提示'}, function(index){
                var seq = thisObj.parent().parent().find('td').eq(0).text();
                var url = api+'delQuery?seq='+encodeURI(seq);
                $.getJSON(url,function (data) {
                    if(data.info!=0){
                        layer.msg("删除成功!");
                    }else{
                        layer.msg("删除失败!");
                    }
                }).complete(function () {
                    var username = $('#userName').text();
                    var url = api+'getKeepQuery?username='+encodeURI(username);
                    $.getJSON(url,function (data) {
                        data = data.datas;
                        keepQueryDatas = data;
                        $('.delQueryTable tbody').empty();
                        $.each(data,function (i,value) {
                            $('.delQueryTable tbody').append(
                                "<tr><td>"+value.user_seq+"</td>"+
                                "<td>"+value.fang_an_name+"</td>"+
                                "<td><span class='delQueryList'>X</span></td></tr>"
                            );
                        });
                    });
                });
                layer.closeAll();
            });
        })
    });
}

function initAddQuery() {
    var tradeType =$('.dropdown.all-camera-dropdown').find("a").eq(0).text().trim();
    var areaSelection = "";
    $('.areaSelect').find('select').each(function () {
        var text = $(this).find('option:selected').text();
        if(text.indexOf("请选择")==-1||text.indexOf("")==-1) {
            areaSelection += text + ' ,';
        }
    });
    areaSelection = areaSelection.substring(0,areaSelection.length-1);

    var menpai = $('.menpai').find("option:selected").text();
    var tixin = $('.tixin').find("option:selected").text();

    var faxin2 = "";

    var hezi2 = "";

    var pifeng2 = "";

    var wuxian2 = "";

    var liuxian2 = "";

    var chengyi2 = "";

    var qiyu = "";

    var chengwu = "";

    var guajia = "";

    $('.selectedOption div').each(function () {
        var str = $(this).text();
        var type = chergeType(str);
        if(type=='faxin'){
            faxin2 += str +',';
        }else if(type == 'hezi'){
            hezi2 += str +',';
        }else if(type == 'pifeng'){
            pifeng2 += str +',';
        }else if(type == 'wuxian'){
            wuxian2 += str +',';
        }else if(type == 'liuxian'){
            liuxian2 += str +',';
        }else if(type == 'chengyi'){
            chengyi2 += str +',';
        }else if(type == 'qiyu'){
            qiyu += str +',';
        }else if(type == 'c5'){
            chengwu += str +',';
        }else if(type == 'guajian'){
            guajia += str +',';
        }
    });
    faxin2 = faxin2.substring(0,faxin2.length-1);
    hezi2 = hezi2.substring(0,hezi2.length-1);
    pifeng2 = pifeng2.substring(0,pifeng2.length-1);
    wuxian2 = wuxian2.substring(0,wuxian2.length-1);
    liuxian2 = liuxian2.substring(0,liuxian2.length-1);
    chengyi2 = chengyi2.substring(0,chengyi2.length-1);
    qiyu = qiyu.substring(0,qiyu.length-1);
    chengwu = chengwu.substring(0,chengwu.length-1);
    guajia = guajia.substring(0,guajia.length-1);

    var info = $('.info').val();
    var lowPrice = $('.lowPrice').val();
    var highPrice = $('.highPrice').val();
    var username = $('#userName').text();

    $('.queryTradeType').text(tradeType);
    $('.queryQufu').text(areaSelection);
    $('.queryMenpai').text(menpai);
    $('.queryTixin').text(tixin);
    $('.queryFaxin').text(faxin2);
    $('.queryHezi').text(hezi2);
    $('.queryPifeng').text(pifeng2);
    $('.queryWuxian').text(wuxian2);
    $('.queryLiuxian').text(liuxian2);
    $('.queryCY').text(chengyi2);
    $('.queryQiyu').text(qiyu);
    $('.queryChengwu').text(chengwu);
    $('.queryGuanjian').text(guajia);
    $('.queryPrice').text(lowPrice+'-'+highPrice);
    $('.queryInfo').text(info);

    var fanganName = $('.fanganName').val();

    var fanganType = parseInt($("input[name='fanganType']:checked").val());


    $('#sureKeepBtn').unbind('click');
    $('#sureKeepBtn').click(function () {
        fanganName = $('.fanganName').val();
        if(fanganName==""){
            layer.msg("请输入搜索方案名!");
        }else {
            var url = "";
            var pipeidu = parseInt($('.pipeidu').val());
            if(pipeidu>0&&pipeidu<=100) {
                if (pipeidu != "" && tradeType == '出售') {
                    url = api + 'keepQuery?tradeType=' + encodeURI(tradeType) +
                        '&areaSelection=' + encodeURI(areaSelection) +
                        '&menpai=' + encodeURI(menpai) +
                        '&tixin=' + encodeURI(tixin) +
                        '&faxin=' + encodeURI(faxin2.toString()) +
                        '&hezi=' + encodeURI(hezi2.toString()) +
                        '&pifeng=' + encodeURI(pifeng2.toString()) +
                        '&wuxian=' + encodeURI(wuxian2.toString()) +
                        '&liuxian=' + encodeURI(liuxian2.toString()) +
                        '&chengyi=' + encodeURI(chengyi2.toString()) +
                        '&qiyu=' + encodeURI(qiyu) +
                        '&chengwu=' + encodeURI(chengwu) +
                        '&guajia=' + encodeURI(guajia) +
                        '&lowPrice=' + encodeURI(lowPrice) +
                        '&highPrice=' + encodeURI(highPrice) +
                        '&info=' + encodeURI(info) +
                        '&username=' + encodeURI(username) +
                        '&fanganName=' + encodeURI(fanganName) +
                        '&fanganType=' + encodeURI(fanganType) +
                        '&pipeidu=' + encodeURI(pipeidu);
                    layer.load();
                    $.getJSON(url, function (data) {
                        layer.closeAll();
                        if (data.info == 1) {
                            layer.msg("保存成功!");
                            $('#keepQueryDetail').modal('hide');
                        } else {
                            layer.msg("保存失败")
                        }
                    }).complete(function () {
                        $('.querySelect').show();
                        var url = api + 'getKeepQuery?username=' + encodeURI(username);
                        $.getJSON(url, function (data) {
                            data = data.datas;
                            keepQueryDatas = data;
                            $('.querySelect').empty();
                            $('.querySelect').append("<option value=\"0\">&nbsp;可选择保存的搜索方案</option>");
                            $.each(data, function (i, value) {
                                $('.querySelect').append("<option value='" + value.user_seq + "'>&nbsp;" + value.fang_an_name + "</option>")
                            });
                        }).complete(function () {
                            $('.querySelect').unbind('change');
                            $('.querySelect').change(function () {
                                var selectId = $('.querySelect').val();
                                $.each(keepQueryDatas, function (i, value) {
                                    if (value.user_seq == selectId) {
                                        var tradeType = value.trade_type;
                                        if (tradeType == 1) {
                                            $('.dropdown-menu li').eq(0).click();
                                        } else {
                                            $('.dropdown-menu li').eq(1).click();
                                        }
                                        var qufu1 = value.qf_factor_1.trim();
                                        $("#pre").find("option:selected").text(qufu1);
                                        var qufu2 = value.qf_factor_2.trim();
                                        $("#city").find("option:selected").text(qufu2);
                                        var qufu3 = value.qf_factor_3.trim();
                                        $("#area").find("option:selected").text(qufu3);
                                        var menpai = value.menpai_factor;
                                        $('.menpai').val(menpai).trigger("change");
                                        var tixin = value.tixin_factor;
                                        $('.tixin').val(tixin).trigger("change");
                                        var faxin = value.faxin.split(',');
                                        $('.faxin').val(faxin).trigger("change");
                                        var hezi = value.hezhi.split(',');
                                        $('.hezi').val(hezi).trigger("change");
                                        var pifeng = value.pifeng.split(',');
                                        $('.pifeng').val(pifeng).trigger("change");
                                        var wuxian = value.wuxian.split(',');
                                        $('.wuxian').val(wuxian).trigger("change");
                                        var liuxian = value.liuxian.split(',');
                                        $('.liuxian').val(liuxian).trigger("change");
                                        var chengyi = value.chenyi.split(',');
                                        $('.chengyi').val(chengyi).trigger("change");
                                        var qiyu = value.qiyu.split(',');
                                        $('.qiyu').val(qiyu).trigger("change");
                                        var chengwu = value.chenwu.split(',');
                                        $('.chengwu').val(chengwu).trigger("change");
                                        var guajian = value.gujian.split(',');
                                        $('.guajian').val(guajian).trigger("change");
                                        var info = value.search_factor;
                                        $('.info').val(info);
                                        var lowPrice = value.price_low;
                                        if (lowPrice != 0) {
                                            $('.lowPrice').val(lowPrice);
                                        }
                                        var highPrice = value.price_up;
                                        if (highPrice != 0) {
                                            $('.highPrice').val(highPrice);
                                        }

                                    }
                                });
                            });
                        });
                    });
                } else {
                    layer.msg("只能蹲出售的账号信息!");
                }
            }else{
                layer.msg("匹配度应为0-100内的数字!");
            }
        }
    });
    
    function chergeType(str) {
        var faxin = segDatas.faxin;
        var retStr = '';
        $.each(faxin,function (i,value) {
            if(str == value.WAIGUAN_NAME){
                retStr =  'faxin';
            }
        });
        var hezi = segDatas.hezi;
        $.each(hezi,function (i,value) {
            if(str == value.WAIGUAN_NAME){
                retStr =  'hezi';
            }
        });
        var pifeng = segDatas.pifeng;
        $.each(pifeng,function (i,value) {
            if(str == value.WAIGUAN_NAME){
                retStr =  'pifeng';
            }
        });
        var wuxian = segDatas.wuxian;
        $.each(wuxian,function (i,value) {
            if(str == value.WAIGUAN_NAME){
                retStr =  'wuxian';
            }
        });
        var liuxian = segDatas.liuxian;
        $.each(liuxian,function (i,value) {
            if(str == value.WAIGUAN_NAME){
                retStr = 'liuxian';
            }
        });
        var chengyi = segDatas.chengyi;
        $.each(chengyi,function (i,value) {
            if(str == value.WAIGUAN_NAME){
                retStr = 'chengyi';
            }
        });
        var qiyu = segDatas.qiyu;
        $.each(qiyu,function (i,value) {
            if(str == value.stra_name){
                retStr = 'qiyu';
            }
        });
        var c5 = segDatas.c5;
        $.each(c5,function (i,value) {
            if(str == value.arm_name){
                retStr = 'c5';
            }
        });
        var guajian = segDatas.guajian;
        $.each(guajian,function (i,value) {
            if(str == value.pend_name){
                retStr = 'guajian';
            }
        });
        return retStr;
    }
}

function editQuery(selectId) {
    var tradeType =$('.dropdown.all-camera-dropdown').find("a").eq(0).text().trim();
    var areaSelection = "";
    $('.areaSelect').find('select').each(function () {
        var text = $(this).find('option:selected').text();
        if(text.indexOf("请选择")==-1) {
            areaSelection += text + ' ,';
        }
    });
    areaSelection = areaSelection.substring(0,areaSelection.length-1);

    var menpai = $('.menpai').find("option:selected").text();
    var tixin = $('.tixin').find("option:selected").text();

    var faxin = $('.faxin').val()==null?"":$('.faxin').val();
    var faxin2 = "";
    $.each(faxin,function (i,value) {
        faxin2 += $('.faxin').find('option[value="'+value+'"]').text()+',';
    });
    faxin2 = faxin2.substring(0,faxin2.length-1);

    var hezi = $('.hezi').val()==null?"":$('.hezi').val();
    var hezi2 = "";
    $.each(hezi,function (i,value) {
        hezi2 += $('.hezi').find('option[value="'+value+'"]').text()+',';
    });
    hezi2 = hezi2.substring(0,hezi2.length-1);

    var pifeng = $('.pifeng').val()==null?"":$('.pifeng').val();
    var pifeng2 = "";
    $.each(pifeng,function (i,value) {
        pifeng2 += $('.pifeng').find('option[value="'+value+'"]').text()+',';
    });
    pifeng2 = pifeng2.substring(0,pifeng2.length-1);

    var wuxian = $('.wuxian').val()==null?"":$('.wuxian').val();
    var wuxian2 = "";
    $.each(wuxian,function (i,value) {
        wuxian2 += $('.wuxian').find('option[value="'+value+'"]').text()+',';
    });
    wuxian2 = wuxian2.substring(0,wuxian2.length-1);

    var liuxian = $('.liuxian').val()==null?"":$('.liuxian').val();
    var liuxian2 = "";
    $.each(liuxian,function (i,value) {
        liuxian2 += $('.liuxian').find('option[value="'+value+'"]').text()+',';
    });
    liuxian2 = liuxian2.substring(0,liuxian2.length-1);

    var chengyi = $('.chengyi').val()==null?"":$('.chengyi').val();
    var chengyi2 = "";
    $.each(chengyi,function (i,value) {
        chengyi2 += $('.chengyi').find('option[value="'+value+'"]').text()+',';
    });
    chengyi2 = chengyi2.substring(0,chengyi2.length-1);

    var qiyu = $('.qiyu').val()==null?"":$('.qiyu').val().toString();
    var chengwu = $('.chengwu').val()==null?"":$('.chengwu').val().toString();
    var guajia = $('.guajian').val()==null?"":$('.guajian').val().toString();
    var info = $('.info').val();
    var lowPrice = $('.lowPrice').val();
    var highPrice = $('.highPrice').val();
    var username = $('#userName').text();

    $('.queryTradeType').text(tradeType);
    $('.queryQufu').text(areaSelection);
    $('.queryMenpai').text(menpai);
    $('.queryTixin').text(tixin);
    $('.queryFaxin').text(faxin2);
    $('.queryHezi').text(hezi2);
    $('.queryPifeng').text(pifeng2);
    $('.queryWuxian').text(wuxian2);
    $('.queryLiuxian').text(liuxian2);
    $('.queryCY').text(chengyi2);
    $('.queryQiyu').text(qiyu);
    $('.queryChengwu').text(chengwu);
    $('.queryGuanjian').text(guajia);
    $('.queryPrice').text(lowPrice+'-'+highPrice);
    $('.queryInfo').text(info);

    $('#sureKeepBtn').unbind('click');
    $('#sureKeepBtn').click(function () {
        var fanganName = $('.fanganName2').val();
        if(fanganName==""){
            fanganName = $('.querySelect').find('option:selected').text();
            if(fanganName.indexOf("可选择保存的搜索方案")>-1){
                fanganName = $('.editKeep').find('option:selected').text();
            }
        }
        var url = api + 'keepQuery2?tradeType=' + encodeURI(tradeType) +
            '&areaSelection=' + encodeURI(areaSelection) +
            '&menpai=' + encodeURI(menpai) +
            '&tixin=' + encodeURI(tixin) +
            '&faxin=' + encodeURI(faxin.toString()) +
            '&hezi=' + encodeURI(hezi.toString()) +
            '&pifeng=' + encodeURI(pifeng.toString()) +
            '&wuxian=' + encodeURI(wuxian.toString()) +
            '&liuxian=' + encodeURI(liuxian.toString()) +
            '&chengyi=' + encodeURI(chengyi.toString()) +
            '&qiyu=' + encodeURI(qiyu) +
            '&chengwu=' + encodeURI(chengwu) +
            '&guajia=' + encodeURI(guajia) +
            '&lowPrice=' + encodeURI(lowPrice) +
            '&highPrice=' + encodeURI(highPrice) +
            '&info=' + encodeURI(info) +
            '&username=' + encodeURI(username) +
            '&fanganName=' + encodeURI(fanganName)+
            '&selectId=' + encodeURI(selectId);
        layer.load();
        $.getJSON(url, function (data) {
            layer.closeAll();
            if(data.info==1){
                layer.msg("保存成功!");
                $('#keepQueryDetail').modal('hide');
            }else{
                layer.msg("保存失败")
            }
        }).complete(function () {
            $('.querySelect').show();
            var url = api+'getKeepQuery?username='+encodeURI(username);
            $.getJSON(url,function (data) {
                data = data.datas;
                keepQueryDatas = data;
                $('.querySelect').empty();
                $('.querySelect').append("<option value=\"0\">&nbsp;可选择保存的搜索方案</option>");
                $.each(data,function (i,value) {
                    $('.querySelect').append("<option value='"+value.user_seq+"'>&nbsp;"+value.fang_an_name+"</option>")
                });
            }).complete(function () {
                $('.querySelect').unbind('change');
                $('.querySelect').change(function () {
                    var selectId = $('.querySelect').val();
                    $.each(keepQueryDatas,function (i,value) {
                        if(value.user_seq==selectId){
                            var tradeType = value.trade_type;
                            if(tradeType==1){
                                $('.dropdown-menu li').eq(0).click();
                            }else{
                                $('.dropdown-menu li').eq(1).click();
                            }
                            var qufu1 = value.qf_factor_1.trim();
                            $("#pre").find("option:selected").text(qufu1);
                            var qufu2 = value.qf_factor_2.trim();
                            $("#city").find("option:selected").text(qufu2);
                            var qufu3 = value.qf_factor_3.trim();
                            $("#area").find("option:selected").text(qufu3);
                            var menpai = value.menpai_factor;
                            $('.menpai').val(menpai).trigger("change");
                            var tixin = value.tixin_factor;
                            $('.tixin').val(tixin).trigger("change");
                            var faxin = value.faxin.split(',');
                            $('.faxin').val(faxin).trigger("change");
                            var hezi = value.hezhi.split(',');
                            $('.hezi').val(hezi).trigger("change");
                            var pifeng = value.pifeng.split(',');
                            $('.pifeng').val(pifeng).trigger("change");
                            var wuxian = value.wuxian.split(',');
                            $('.wuxian').val(wuxian).trigger("change");
                            var liuxian = value.liuxian.split(',');
                            $('.liuxian').val(liuxian).trigger("change");
                            var chengyi = value.chenyi.split(',');
                            $('.chengyi').val(chengyi).trigger("change");
                            var qiyu = value.qiyu.split(',');
                            $('.qiyu').val(qiyu).trigger("change");
                            var chengwu = value.chenwu.split(',');
                            $('.chengwu').val(chengwu).trigger("change");
                            var guajian = value.gujian.split(',');
                            $('.guajian').val(guajian).trigger("change");
                            var info = value.search_factor;
                            $('.info').val(info);
                            var lowPrice = value.price_low;
                            if(lowPrice!=0) {
                                $('.lowPrice').val(lowPrice);
                            }
                            var highPrice = value.price_up;
                            if(highPrice!=0) {
                                $('.highPrice').val(highPrice);
                            }
                        }
                    });
                });
            });
        });
    });
}