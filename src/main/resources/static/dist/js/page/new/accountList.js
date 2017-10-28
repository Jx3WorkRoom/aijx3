api = api+"accountList/";
//设置一个省的公共下标
var pIndex = 0;
var preEle = document.getElementById("pre");
var cityEle = document.getElementById("city");
var areaEle = document.getElementById("area");
var clickSeachNum = 0;
var pageClickNum = 1;
$(function () {
    initTable();
    initSeach();
});

function initTable(url,keyNum) {
    layer.load();
    var startNum = 0;
    var endNum =10;
    if(keyNum!=null){
        endNum = 10;
        startNum = keyNum*10-10;
    }
    if(url==null) {
        var tradeType =$("input[name='tradeType']:checked").val();
        tradeType = parseInt(tradeType);
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
        var shape = $('.tixin').find("option:selected").text();
        var info = $('.info').val();
        if(shape==""&&info==""&&areaSelection==""){
            url = api+'accountList?tradeType='+encodeURI(tradeType)+'&startNum='+encodeURI(startNum)+'&endNum='+encodeURI(endNum);
        }else{
            url = api + 'accountList?tradeType=' + encodeURI(tradeType)
                + '&areaSelection=' + encodeURI(areaSelection)
                + '&shape=' + encodeURI(shape)
                +'&info=' + encodeURI(info)
                +'&startNum=' + encodeURI(startNum)
                +'&endNum='; + encodeURI(endNum);
        }
    }
    $("#dataTable tbody").empty();
    var dataTemp = null;
    $.ajax({
        url:url,
        async:true,
        success:function (data) {
            dataTemp = data;
            //填充表格数据
            var tableDatas = data.datas==null?"":data.datas;
            var sortArrary = [];
            if(clickSeachNum!=0){
                $.each(tableDatas,function (i,value) {
                    var matchingDegree = sumMatchingDegree(value,data.segMentWordMap);
                    sortArrary.push([matchingDegree, i]);
                });
                sortArrary = sortarr(sortArrary);
                function sortarr(arr){
                    for(i=0;i<arr.length-1;i++){
                        for(j=0;j<arr.length-1-i;j++){
                            if(parseInt(arr[j][0])<parseInt(arr[j+1][0])){
                                var temp=arr[j];
                                arr[j]=arr[j+1];
                                arr[j+1]=temp;
                            }
                        }
                    }
                    return arr;
                }
                $.each(sortArrary,function (i,value) {
                    if((pageClickNum-1)*10<i&&i<pageClickNum*10) {
                        initDiv(tableDatas[value[1]]);
                    }
                });
            }else {
                $.each(tableDatas, function (i, value) {
                    initDiv(value);
                });
            }
            function initDiv(value){
                var time = sumTime(value.REPLY_TIME);
                var matchingDegree = '--';
                if (clickSeachNum != 0) {
                    matchingDegree = sumMatchingDegree(value, data.segMentWordMap) + '%';
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
                var REPLY_CONTENT = getNewline(value.REPLY_CONTENT);
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
                var price = value.PRICE_NUM.replace("[", "").replace("]", "");
                var floor = value.BELONG_FLOOR==null?'--':value.BELONG_FLOOR;
                var favorId = value.FAVOR_ID;
                $("#dataTable tbody").append(" <tr>" +
                        "<td>"+belongOf+"</td>"+
                        "<td>"+TIXIN+"</td>"+
                        "<td class='replyContent'><label favorId='"+favorId+"'>"+REPLY_CONTENT+"</label></td>"+
                        "<td>"+floor+"</td>"+
                        "<td>"+price+"</td>"+
                        "<td>"+matchingDegree+"</td>"+
                        "<td>"+time+"</td>"+
                    "</tr>")
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
            function sumMatchingDegree(value,map) {
                var m = 0;
                var n = 0;
                $.each(map,function (i,values) {
                    if(i=='title'){
                        var strs = value.TITLE_NAME;
                        m++;
                        $.each(values,function (num,obj) {
                            m = m+values.length;
                            if(strs.indexOf(obj)>-1){
                                n++;
                            }
                        });
                    }else if(i=='waiguan'){
                        var strs = value.WAIGUAN_NAME;
                        $.each(values,function (num,obj) {
                            m++;
                            if(strs.indexOf(obj)>-1){
                                n++;
                            }
                        });
                    }else if(i=='horse'){
                        var strs = value.HORSE_NAME;
                        $.each(values,function (num,obj) {
                            m++;
                            if(strs.indexOf(obj)>-1){
                                n++;
                            }
                        });
                    }else if(i=='arm'){
                        var strs = value.ARM_NAME;
                        $.each(values,function (num,obj) {
                            m++;
                            if(strs.indexOf(obj)>-1){
                                n++;
                            }
                        });
                    }else if(i=='stra'){
                        var strs = value.STRA_NAME;
                        $.each(values,function (num,obj) {
                            m++;
                            if(strs.indexOf(obj)>-1){
                                n++;
                            }
                        });
                    }else if(i=='pend'){
                        var strs = value.PEND_NAME;
                        $.each(values,function (num,obj) {
                            m++;
                            if(strs.indexOf(obj)>-1){
                                n++;
                            }
                        });
                    }else {
                        m++;
                        if(value.REPLY_CONTENT.indexOf(values)>-1){
                            n++;
                        }
                    }
                });
                if(m==0){
                    return 100
                }else{
                    return (parseInt((100 * n) / m));
                }
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
            $('.replyContent').unbind('click');
            $('.replyContent').click(function () {
                var mainId = $(this).find('label').attr('favorId');
                var tradeType = 1;
                var username = $('#userName').text();
                var url = api+'accountDetail?favorId='+encodeURI(mainId)+'&sourceType='+encodeURI(tradeType)+
                            '&userName='+encodeURI(username);
                layer.load();
                $.getJSON(url,function (data) {
                    data = data.datas[0]==null?'':data.datas[0];
                    var url =data.PAGE_URL;
                    window.location.href= url;
                }).error(function () {
                    layer.closeAll();
                }).complete(function () {
                    layer.closeAll();
                });
            });
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
        var tixin = data.tixin==null?"":data.tixin;
        //填充体型选择框
        if(tixin!="") {
            initTixin(tixin);
        }
    }).error(function () {
    }).complete(function () {
        $('.query-l').unbind("click");
        $('.query-l').click(function () {
            var tradeType =$("input[name='tradeType']:checked").val();
            tradeType = parseInt(tradeType);
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
            var info = $('.info').val();
            if(info!=""){
                clickSeachNum++;
            }else{
                clickSeachNum=0;
            }
            var shape = $('.tixin').val();
            if(shape==""&&info==""&&areaSelection==""){
                initTable();
            }else {
                url = api + 'accountList?tradeType=' + encodeURI(tradeType)
                    + '&areaSelection=' + encodeURI(areaSelection)
                    + '&shape=' + encodeURI(shape)
                    +'&info=' + encodeURI(info)
                    +'&startNum=0&endNum=10';
                initTable(url);
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
        $.each(data,function (i,value) {
            var val1 = value.MENPAI_NAME;
            $('.tixin').append("  <option value="+val1+">"+val1+"</option> ");
        });
        $(".js-example-basic-single").select2();
    }
}


//加载分页组件
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
