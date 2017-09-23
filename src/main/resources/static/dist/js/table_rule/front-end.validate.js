/**
 * 自定义的一些函数，用于前段数据操作时的校验
 */
var strMeg;
var isOk;
var strMeg1;
var isOk1;
var i;
var i1;
var strMegT;
var strMegT1;

function initValidateMsg() {
    strMeg = "提示：<br/>";
    isOk = true;
    strMeg1 = "警告：<br/>";
    isOk1 = true;
    i = 1;
    i1 = 1;
    strMegT = "";
    strMegT1 = "";
}

/**
 * 判断是否包含某个字符串
 */
String.prototype.contain = function(str) {
    var bool = this.indexOf(str);
    if (bool != -1) {
        return true;
    } else {
        return false;
    }
}

/**
 * 判断是否不包含某个字符串
 */
String.prototype.notContain = function(str) {
    var bool = this.indexOf(str);
    if (bool == -1) {
        return true;
    } else {
        return false;
    }
}


/**
 * 日期等于
 */
String.prototype.dateEq = function(endTime) {
    var startTime = this;
    if (startTime.length > 10) { // 去掉日期后面的时分秒
        startTime = startTime.substr(0,10);
    }
    if (endTime.length > 10) {
        endTime = endTime.substr(0,10);
    }
    var start = new Date(startTime.replace("-", "/").replace("-", "/"));
    var end = new Date(endTime.replace("-", "/").replace("-", "/"));
    
    if (start - end == 0) {
        return true;
    }
    else {
        return false;
    }
}


/**
 * 日期不等于
 */
String.prototype.dateNeq = function(endTime) {
    var startTime = this;
    if (startTime.length > 10) { // 去掉日期后面的时分秒
        startTime = startTime.substr(0,10);
    }
    if (endTime.length > 10) {
        endTime = endTime.substr(0,10);
    }
    var start = new Date(startTime.replace("-", "/").replace("-", "/"));
    var end = new Date(endTime.replace("-", "/").replace("-", "/"));
    if (start - end != 0) {
        return true;
    }
    else {
        return false;
    }
}


/**
 * 日期小于
 */
String.prototype.dateLt = function(endTime) {
    var startTime = this;
    if (startTime.length > 10) { // 去掉日期后面的时分秒
        startTime = startTime.substr(0,10);
    }
    if (endTime.length > 10) {
        endTime = endTime.substr(0,10);
    }
    var start = new Date(startTime.replace("-", "/").replace("-", "/"));
    var end = new Date(endTime.replace("-", "/").replace("-", "/"));
    if (start < end) {
        return true;
    }
    else {
        return false;
    }
}


/**
 * 日期不小于
 */
String.prototype.dateGe = function(endTime) {
    var startTime = this;
    if (startTime.length > 10) { // 去掉日期后面的时分秒
        startTime = startTime.substr(0,10);
    }
    if (endTime.length > 10) {
        endTime = endTime.substr(0,10);
    }
    var start = new Date(startTime.replace("-", "/").replace("-", "/"));
    var end = new Date(endTime.replace("-", "/").replace("-", "/"));
    if (start >= end) {
        return true;
    }
    else {
        return false;
    }
}
/**
 * 日期大于
 */
String.prototype.dateGt = function(endTime) {
    var startTime = this;
    if (startTime.length > 10) { // 去掉日期后面的时分秒
        startTime = startTime.substr(0,10);
    }
    if (endTime.length > 10) {
        endTime = endTime.substr(0,10);
    }
    var start = new Date(startTime.replace("-", "/").replace("-", "/"));
    var end = new Date(endTime.replace("-", "/").replace("-", "/"));
    if (start > end) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * 日期不大于
 */
String.prototype.dateLe = function(endTime) {
    var startTime = this;
    if (startTime.length > 10) { // 去掉日期后面的时分秒
        startTime = startTime.substr(0,10);
    }
    if (endTime.length > 10) {
        endTime = endTime.substr(0,10);
    }
    var start = new Date(startTime.replace("-", "/").replace("-", "/"));
    var end = new Date(endTime.replace("-", "/").replace("-", "/"));
    if (start <= end) {
        return true;
    }
    else {
        return false;
    }
}


/**       
 * 对Date的扩展，将 Date 转化为指定格式的String       
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符       
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)       
 * eg:       
 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423       
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04       
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04       
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04       
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18       
 */          
Date.prototype.pattern=function(fmt) {
    var o = {
    "M+" : this.getMonth()+1, //月份
    "d+" : this.getDate(), //日
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
    "H+" : this.getHours(), //小时
    "m+" : this.getMinutes(), //分
    "s+" : this.getSeconds(), //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S" : this.getMilliseconds() //毫秒
    };
    var week = {
    "0" : "/u65e5",
    "1" : "/u4e00",
    "2" : "/u4e8c",
    "3" : "/u4e09",
    "4" : "/u56db",
    "5" : "/u4e94",
    "6" : "/u516d"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
 fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}

/**
 * 日期相差 (用于日期表达式规则)
 * dtDate：需要操作的时间值，目前只有'sysdate'，表示当前时间
 * 返回 'yyyy-MM-dd' 日期格式
 */
function addDate(dtDate,numDay){
    var date=new Date(); 
    date.setDate(date.getDate()+numDay);
    return date.pattern('yyyy-MM-dd');
}