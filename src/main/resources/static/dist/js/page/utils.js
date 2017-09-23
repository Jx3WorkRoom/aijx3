var api = 'http://127.0.0.1:8881/testDemoRest/';
api = 'http://101.132.64.51:8881/testDemoRest/';

function checkValue(value, rtValue) {
	if (typeof (value) != undefined && value != null && value != 'undefined') {
		if (value == "null") {
			return rtValue;
		} else {
			return value;
		}
	} else {
		return rtValue;
	}
}
/**
 * 返回两个值的最大值［从外层判断是否为null］
 * @param v1
 * @param v2
 * @returns
 */
function getMaxValue(v1,v2){
	if(v1>=v2){
		return v1;
	}else{
		return v2;
	}
}

/**
 * 返回两个值的最小值［从外层判断是否为null］
 * @param v1
 * @param v2
 * @returns
 */
function getMinValue(v1,v2){
	if(v1>=v2){
		return v2;
	}else{
		return v1;
	}
}

//将url参数转换成hashmap对象
function paramToHashMap(param) {
    var tmpArr = param.split("&");
    var hashMap = new Object();
    for (var i = 0; i < tmpArr.length; i++) {
        var para = tmpArr[i];
        if (para.indexOf("=") != -1) {
            var kv = para.split("=");
            hashMap[kv[0]] = kv[1];
        }
    }
    return hashMap;
}

/**
 * 将数组对象转换为key-object的数组
 * @param data 数组对象
 * @param key 已哪个为关键字
 */
function dataToHashMap(data,key){
	var map = {};
	 for(var i = 0;i<data.length;i++){
		 var o = data[i];
//		 if(map.hasOwnProperty(o[key])){
//			 
//		 }else{
			 map[o[key]] = o;
//		 }
	 }
	 return map;
}
function dataToHashMap3(data,key){
	var map = {};
	 for(var i = 0;i<data.length;i++){
		 var o = data[i];
		 if(map.hasOwnProperty(o[key])){
			 map[o[key]].push(o);
		 }else{
			 map[o[key]] = [o];
		 }
	 }
	 return map;
}
/**
 * 将数组对象转化为key-array的对象
 * @param data
 * @param key
 * @returns {___anonymous6309_6310}
 */
function dataToHashMap2(data,key,valuekey){
	var map = {};
	 for(var i = 0;i<data.length;i++){
		 var o = data[i];
		 if(map.hasOwnProperty(o[key])){
			 map[o[key]].push(o[valuekey]);
		 }else{
			 map[o[key]] = [o[valuekey]];
		 }
	 }
	 return map;
}

/*******************常用工具集合********************************/
//日期时间工具类
function DateUtil(){
	var MINUTE = 60;
	var HOUR = 60*60;
	var DATE = 60*60*24;
	//按指定格式格式化日期时间
	this.formatDate = function(format,d){
		var year = d.getFullYear();
		var month = d.getMonth()+1;
		var date = d.getDate();
		var hour = d.getHours();
		var minute = d.getMinutes();
		var second = d.getSeconds();
		month=month<10?"0"+month:month;
		date=date<10?"0"+date:date;
		hour=hour<10?"0"+hour:hour;
		minute=minute<10?"0"+minute:minute;
		second=second<10?"0"+second:second;
		var datetime = format.replace("yyyy",year);
		datetime = datetime.replace("MM",month);
		datetime = datetime.replace("dd",date);
		datetime = datetime.replace("HH",hour);
		datetime = datetime.replace("mm",minute);
		datetime = datetime.replace("ss",second);
		return datetime;
	}
	//将日期时间按指定格式转化成字符串
	this.date2String = function(formater,date){
		if(formater==null || formater==""){
			formater = "yyyy-MM-dd HH:mm:ss";
		}
		if(date==null || date==""){
			date = new Date();
		}
		return this.formatDate(formater,date);
	}
	//将当前日期时间按指定格式转化成字符串
	this.nowDate2String = function(formater){
		return this.formatDate(formater,new Date());
	}
	//将标准日期时间格式(yyyy-MM-dd HH:mm:ss)字符串转成日期对象
	this.dateString2Date = function(dateString){
		var year = parseInt(dateString.substring(0,4),10);
		var month = parseInt(dateString.substring(5,7),10)-1*1;
		var date = parseInt(dateString.substring(8,10),10);
		var hour = parseInt(dateString.substring(11,13),10);
		var minute = parseInt(dateString.substring(14,16),10);
		var second = parseInt(dateString.substring(17,19),10);
		var d = new Date(year,month,date,hour,minute,second);
		return d;
	}
	//将标准日期时间格式(yyyy-MM-dd HH)字符串转成日期对象
	this.dateString2Date2 = function(str){
		var yearMouthDay = str.substring(0,10);
		var hour = parseInt(str.substring(11,13),10);
		var date = yearMouthDay + " " + hour + ":00:00" ;
		return date ;
	}
	//通过分钟计算时间差{dateString:标准时间字符串2013-08-07 12:00:00,amount:时间差数值[正数则是计算后面的时间，负数则是计算前面的时间]}
	this.calculateByMinute = function(dateString,amount){
		return this.calculate(dateString,MINUTE,amount);
	}
	//通过小时计算时间差{dateString:标准时间字符串2013-08-07 12:00:00,amount:时间差数值[正数则是计算后面的时间，负数则是计算前面的时间]}
	this.calculateByHour = function(dateString,amount){
		return this.calculate(dateString,HOUR,amount);
	}
	//通过天计算时间差{dateString:标准时间字符串2013-08-07 12:00:00,amount:时间差数值[正数则是计算后面的时间，负数则是计算前面的时间]}
	this.calculateByDate = function(dateString,amount){		
		return this.calculate(dateString,DATE,amount);
	}
	this.calculateByMonth = function(dateString,amount){
		var d = this.dateString2Date(dateString);
		d.setMonth(d.getMonth()+amount);
		return this.date2String("yyyy-MM-dd HH:mm:ss", d);
	}
	//通过指定的类型,时间差值计算时间差
	this.calculate = function(dateString,field,amount){
		var d = this.dateString2Date(dateString);
		var oldtime = d.getTime();
		var space = field*amount*1000;
		var newtime = oldtime + space;
		var newDate = new Date(newtime);
		return this.date2String("yyyy-MM-dd HH:mm:ss",newDate);
	}
	/** 比较两个日期时间大小,返回时间差
	* startDate:开始时间,标准时间字符串2013-08-07 12:00:00
	* endDate:结束时间,标准时间字符串2013-08-07 12:00:00
	* 返回两个时间的差,正数说明开始时间比结束时间小，反之比它大
	*/
	this.diffDateTime = function(startDate,endDate){
		var sDate = this.dateString2Date(startDate);
		var eDate = this.dateString2Date(endDate);
		var time = null;
		if(sDate!=null&&eDate!=null){
			time = eDate.getTime()-sDate.getTime();
		}
		return time;
	}
}
var dateUtil = new DateUtil();
/**
 * 字符串拼接函数
 */
function StringBuilder()
{
    this.strings=new Array(); 
}
/**
 * 字符串拼接函数--append方法
 * @param {Object} value 要拼接的内容
 */
StringBuilder.prototype.append = function(value)
{
    if(value)
    {
        this.strings.push(value);
    }
}
/**
 * 字符串拼接函数--清除所有内容
 */
StringBuilder.prototype.clear = function ()
{
    this.strings.length = 0;
}
/**
 * 字符串拼接函数--转换成字符串
 * @return 字符串 
 */
StringBuilder.prototype.toString = function ()
{
    return this.strings.join("");
}
//判断字符串是否为空
function checkStringNull(oldStr,newStr){
	var str = oldStr;
	if(oldStr==null || typeof(oldStr)=="undefined" || oldStr=="undefined"){
		str = newStr;
	}else{
		str = oldStr;
	}
	return str;
}
/**
 * 获取两个数之间的随机数
 * @param s 开始数值
 * @param e 结束数值
 * @param pos 小数位数
 * @return 数值
 */
function getRandom(s,e,pos)
{
    var random = Math.random()*(e-s+1)+s;
    random = random.toFixed(pos);
    return random;
}
//将url参数转换成hashmap对象
function paramToHashMap(param){
	var tmpArr = param.split("&");
	var hashMap = new Object();
	for(var i=0;i<tmpArr.length;i++){
		var para = tmpArr[i];
		if(para.indexOf("=")!=-1){
			var kv = para.split("=");
			hashMap[kv[0]]=kv[1];
		}
	}
	return hashMap;
}
function appendIncludeFun(){
	if (!Array.prototype.includes) {
		Array.prototype.includes = function(searchElement /*, fromIndex*/) {
			'use strict';
			if (this == null) {
				throw new TypeError('Array.prototype.includes called on null or undefined');
			}

			var O = Object(this);
			var len = parseInt(O.length, 10) || 0;
			if (len === 0) {
				return false;
			}
			var n = parseInt(arguments[1], 10) || 0;
			var k;
			if (n >= 0) {
				k = n;
			} else {
				k = len + n;
				if (k < 0) {k = 0;}
			}
			var currentElement;
			while (k < len) {
				currentElement = O[k];
				if (searchElement === currentElement ||
					(searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
					return true;
				}
				k++;
			}
			return false;
		};
	}
}
appendIncludeFun();


/**正则表达式去除空格和换行 */
//去除空格 
String.prototype.Trim = function() { 
    return this.replace(/\s+/g, ""); 
} 
     
//去除换行 
function ClearBr(key) { 
    key = key.replace(/<\/?.+?>/g,""); 
    key = key.replace(/[\r\n]/g, ""); 
    return key; 
} 
     
//去除左侧空格 
function LTrim(str) { 
    return str.replace(/^\s*/g,""); 
} 
     
//去右空格 
function RTrim(str) { 
    return str.replace(/\s*$/g,""); 
} 
     
//去掉字符串两端的空格 
function trim(str) { 
    return str.replace(/(^\s*)|(\s*$)/g, ""); 
} 
     
//去除字符串中间空格 
function CTim(str) { 
    return str.replace(/\s/g,''); 
} 
     
//是否为由数字组成的字符串 
function is_digitals(str) { 
    var reg=/^[0-9]*$/; //匹配整数 
    return reg.test(str); 
}
//by函数接受一个成员名字符串做为参数
//并返回一个可以用来对包含该成员的对象数组进行排序的比较函数
var by = function(name){
  return function(o, p){
      var a, b;
      if (typeof o === "object" && typeof p === "object" && o && p) {
          a = o[name];
          b = p[name];
          if (a === b) {
              return 0;
          }
          if (typeof a === typeof b) {
              return a < b ? -1 : 1;
          }
          return typeof a < typeof b ? -1 : 1;
      }
      else {
          throw ("error");
      }
  }
};

/*
 用途：检查输入的Email信箱格式是否正确
 输入：strEmail：字符串
 返回：如果通过验证返回true,否则返回false
 */
function checkEmail(strEmail) {
    //var emailReg = /^[_a-z0-9]+@([_a-z0-9]+\.)+[a-z0-9]{2,3}$/;
    var emailReg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    if (emailReg.test(strEmail)) {
        return true;
    }
    else {
        return false;
    }
}

/*
 用途：检查输入手机号码是否正确
 输入：strMobile：字符串
 返回：如果通过验证返回true,否则返回false
 */
function checkMobile( strMobile )
{
    var mobileReg = /^1[34578]\d{9}$/;
    if (mobileReg.test(strMobile)) {
        return true;
    }
    else {
        return false;
    }
}

//提交数据到后台，生成excel
/**
 * 创建iframe ，使用form，以post方式提交数据
 * @param url 请求地址
 * @param data 表格数据对象或者数组
 */
function commitExcelData(url,data,filename){
	var q = url;
	//code from dxhtml_grid_export.js
	if(!document.getElementById("ifr")){
		var c=document.createElement("iframe");
		c.style.display="none";
		c.setAttribute("name","dhx_export_iframe");
		c.setAttribute("src","");
		c.setAttribute("id","dhx_export_iframe");
		document.body.appendChild(c)
	}
	var r=' target="dhx_export_iframe"';
	t=document.createElement("div");
	t.style.display="none";
	document.body.appendChild(t);
	var v="form_"+new Date().getTime();
	t.innerHTML=		'<form id="'+v+'" method="post" action="'+q+'" accept-charset="utf-8"  enctype="application/x-www-form-urlencoded"'+r+'><input type="hidden" name="reportList" id="reportList"/><input type="hidden" name="filename" id="filename"/> </form>';
	document.getElementById(v).firstChild.value=encodeURIComponent(JSON.stringify(data).replace(/null/g,'"--"'));
	document.getElementById("filename").value = encodeURIComponent(filename);
	document.getElementById(v).submit();
	t.parentNode.removeChild(t);
}

