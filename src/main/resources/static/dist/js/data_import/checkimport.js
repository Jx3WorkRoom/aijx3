//检查单元格值的合法性
function checkCell(tdo) {
	var isOk;
	var inputo = tdo.find("input[name]");
	
	// 值为空
	if (inputo.val() == '') {
		// 非空字段
		if (tdo.attr("nullable") == 0 || tdo.attr("isPk") != 0)
			return false;
		else
			return true;
	} else {
		return checkCellByType(tdo); // 验证字段类型
	}
}

// 根据字段类型检查单元格值的合法性
function checkCellByType(tdo) {
	var inputo = tdo.find("input[name]");
	var v = inputo.val();

	switch (tdo.attr("fieldType")) {
	// 字符型验证
	case 'varchar':

	case 'varchar2':
		return checkLen(v, tdo.attr("len"));
		break;

	case 'integer':
		// 整数型验证
		v = strToNum(v);
		return checkNum(v);
		break;

	// 浮点数验证
	case 'numeric':

	case 'number':
		v = strToNum(v);
		return checkFloat(v, tdo.attr("len").split(",")[0], tdo.attr("len")
				.split(",")[1]);
		break;

	// 日期型验证
	case 'timestamp':

	case 'date':
		return isDateString(v);
		break;

	// clob
	case 'clob':
		return true;
		break;

	default:
		break;
	}
}

// 判断字符串大小（中文占两个）
function checkLen(val, l) {
	if (val.getBytes() > l)
		return false;
	else
		return true;
}

// 取得字符串的字节数
String.prototype.getBytes = function() {
	var cArr = this.match(/([\u0391-\uffe5])/ig); // 返回中文的字符
	return this.length + (cArr == null ? 0 : cArr.length * 2);
}

// 判断是否为整数型
function checkNum(str) {
	return /^-?\d+$/.test(str);
}

// 判断浮点数
function checkFloat(val, p, s) {
	val = $.trim(String(val));
	var returns = true;

	if (typeof s == 'undefined')
		s = 0;

	// 判断输入值是否是数值
	if (/^-?(?:\d+)(?:\.\d+)?$/.test(val)) {

		var arr = val.split(".");

		// 判断整数部分
		var arr0 = arr[0].substr(0, 1) === "-" ? arr[0].substr(1) : arr[0];

		if (arr0.length > (p - s))
			returns = false;

		if (val.indexOf(".") != -1)
			// 判断小数部分
			if (arr[1].length > s) {
				returns = false;
			}
	} else
		returns = false;
	return returns;
}


//百，万，单位换算
function strToNum(v){
    if(v==null){
        return null
    }
    v = v.replace(new RegExp(",","gm"),"").replace(new RegExp("，","gm"),"").replace(new RegExp(",","gm"),"").replace(new RegExp("，","gm"),"").replace(new RegExp(",","gm"),"").replace(new RegExp("，","gm"),"").replace(new RegExp(",","gm"),"").replace(new RegExp(" ","gm"),"").replace(new RegExp("．","gm"),".");
    if (isNaN(v)) {return null}
    v = v.replace(/[０-９ａ-ｚＡ-Ｚ＋－]/g, function(a) {
        return String.fromCharCode(a.charCodeAt(0) - 65248);
    })
    var num=v.replace(/[^-?\d\.\(\)\（\）]/g,"");
    while(v.indexOf("百")!=-1){
        v=v.replace("百","");
        num=num*100;
    }
    while(v.indexOf("万")!=-1){
        v=v.replace("万","");
        num=num*10000;
    }
    return num;
}


function getNumber(v){
    if(v==null){
        return null;
    }else{
        return Number(strToNum(v));
    }
}