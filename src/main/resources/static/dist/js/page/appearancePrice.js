//------------------------------------常量定义 Start------------------------------------
reportApi = api+"iwantRelease/";
pageApi = api+"accountList/";

//设置一个省的公共下标
var pIndex = 0;
var preEle = document.getElementById("pre");
var cityEle = document.getElementById("city");
var areaEle = document.getElementById("area");
var username = null;
var userId = null;

$(function () {
    username = $('#userName').text();
    $('.last').text(username);
    initBunding();
    initForm();    //初始化Form
});
//------------------------------------常量定义 Start------------------------------------

//------------------------------------填充区域选择框 Start------------------------------------
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
//一级连动
function setup()
{
    for(i=0;i <s.length-1;i++)
        document.getElementById(s[i]).onchange=new Function("change("+(i+1)+")");
    change(0);
}
var pres = null;
var cities = null;
var area = null;
//二级连动
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
//三级连动
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
//------------------------------------填充区域选择框 End------------------------------------
//------------------------------------Function定义 Start------------------------------------
//初始区服下拉数据
function initSelections(selecttions) {
    var typeArr = [];
    var quArr = [];
    var areaArr = [];
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
//加载Form
function initForm() {
    var url = reportApi+'accountTransactionListSelection?mainId='+getUrlParam('mainId');
    $.getJSON(url,function (data) {
        var selecttions = data.selecttions==null?"":data.selecttions;
        //填充区域选择框
        if(selecttions!="") {
            initSelections(selecttions);
        }
    }).error(function () {
    }).complete(function () {
    });
}

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

function initBunding() {
    var url = api+'dataAndSecurity/getUserInfo?userName='+encodeURI(username);
    $.getJSON(url,function (data) {
        data=data.datas[0]==null?'':data.datas[0];
        if(data!=''){
            userId = data.USER_ID;
        }else{
            layer.msg("加载用户信息错误!")
        }
    });

    $("#favorDate1").datetimepicker({
        format: "yyyy-mm-dd",
        weekStart: 1,
        zIndex:9999,
        minView:2,
        timezone: 'GMT',
        language:'zh-CN',
        autoclose:true
    });
    var now = dateUtil.nowDate2String("yyyy-MM-dd");
    $("#favorDate1").val(now);
    $('.ht').click(function () {
       $('.ht').removeClass("cur");
       $(this).addClass("cur");
        $('.mt15').hide();
       if($(this).attr('class').indexOf('1')>-1){
           $('#pre').val(-1);
           $('#city').val(0);
           $('#area').val(0);
            $('.trType3').hide();
            $('.tableType1').show();
            $('.trType1').show();
           $("#favorDate1").datetimepicker({
               format: "yyyy-mm-dd",
               weekStart: 1,
               zIndex:9999,
               minView:2,
               timezone: 'GMT',
               language:'zh-CN',
               autoclose:true
           });
           var now = dateUtil.nowDate2String("yyyy-MM-dd");
           $("#favorDate1").val(now);
       }else if($(this).attr('class').indexOf('2')>-1){
           $('.tableType2').show();

       }else if($(this).attr('class').indexOf('3')>-1){
            $('#pre').val(-1);
           $('#city').val(0);
           $('#area').val(0);
           $('.trType1').hide();
           $('.tableType1').show();
           $('.trType3').show();
           $("#favorDate3").datetimepicker({
               format: "yyyy-mm-dd",
               weekStart: 1,
               zIndex:9999,
               minView:2,
               timezone: 'GMT',
               language:'zh-CN',
               autoclose:true
           });
           var now = dateUtil.nowDate2String("yyyy-MM-dd");
           $("#favorDate3").val(now);
       }else if($(this).attr('class').indexOf('4')>-1){
           $('.tableType4').show();

       }
    });

    $('#save1').click(function () {
        var qufu = "["+$('#pre').find("option:selected").text()+$('#city').find("option:selected").text()+$('#area').find("option:selected").text()+"]";
        var viewName = $('#viewName1').val();
        var priceNum = $('#priceNum1').val();
        var favorDate = $('#favorDate1').val();
        if(qufu==""||viewName==""||priceNum==""||favorDate==""){
            layer.msg("区服，外观名，成交价格，成交时间不能为空!")
        }else{
            if(!isNaN(priceNum)) {
                var url = pageApi + 'appearancePrice1?qufu=' + encodeURI(qufu) +
                    '&viewName=' + encodeURI(viewName) +
                    '&priceNum=' + encodeURI(priceNum) +
                    '&favorDate=' + encodeURI(favorDate)+
                    '&userID=' + encodeURI(userId);
                layer.load();
                $.getJSON(url, function (data) {
                    if(data.info==1){
                        layer.msg("添加成功!");
                    }else{
                        layer.msg("添加失败!");
                    }
                }).complete(function () {
                    layer.closeAll("loading");
                });
            }else{
                layer.msg("价格必须为整数!");
            }
        }
    });

    $('#save2').click(function () {

    });

    $('#save3').click(function () {
        var qufu = "["+$('#pre').find("option:selected").text()+$('#city').find("option:selected").text()+$('#area').find("option:selected").text()+"]";
        var viewName = $('#viewName3').val();
        var priceLow = $('#priceLow3').val();
        var priceHigh = $('#priceHigh3').val();
        var favorDate = $('#favorDate3').val();
        if(qufu==""||viewName==""||priceLow==""||priceHigh==""||favorDate==""){
            layer.msg("区服，外观名，市场价格下限，市场价格上限，成交时间不能为空!")
        }else{
            if(!isNaN(priceLow)&&!isNaN(priceHigh)) {
                var url = pageApi + 'appearancePrice3?qufu=' + encodeURI(qufu) +
                    '&viewName=' + encodeURI(viewName) +
                    '&priceLow=' + encodeURI(priceLow) +
                    '&priceHigh=' + encodeURI(priceHigh) +
                    '&favorDate=' + encodeURI(favorDate)+
                    '&userID=' + encodeURI(userId);
                layer.load();
                $.getJSON(url, function (data) {
                    if(data.info==1){
                        layer.msg("添加成功!");
                    }else{
                        layer.msg("添加失败!");
                    }
                }).complete(function () {
                    layer.closeAll("loading");
                });
            }else{
                layer.msg("价格必须为整数!");
            }
        }
    });

    $('#save4').click(function () {

    });
}
