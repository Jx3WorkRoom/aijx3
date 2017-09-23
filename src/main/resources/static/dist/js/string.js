String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
};
/**
 * 半角字符替换为全角字符：将半角'、"替换为全角‘、“
 */
String.prototype.replaceToDBC = function () {
    return this.replace(/\s*[\\']+\s*/g, "’").replace(/\s*[\\"]+\s*/g, "“");
};
/**
 * 去掉特殊字符：$、*、?、？、\、|、：、+、-、(、)、$等等
 */
String.prototype.removeSpecialChar = function () {
    return this.replace(/\s*[\*\?\s？~!\^&\(\)\-\+:\|\\"\\'\$]+\s*/g, "");
};
/**
 * 按照特殊字符：$、*、?、？、\、|、：、+、-、(、)、$切割字符串
 */
String.prototype.splitBySpecialChar = function () {
    return this.split(/\s*[\*\?\s？~!\^&\(\)\-\+:\|\\"\\'\$]+\s*/g);
};
/**
 * 去掉所有的空格
 */
String.prototype.removeAllSpace = function () {
    return this.replace(/[\s]+/, "");
};

/**
 * 判断keys是不是只由特殊字符组成，如果只由特殊字符组成则返回true，包含其它字符返回false
 */
function isOnlyWildcardChar(keys) {
    var pattern = /^\s*[\*\?\s？~!\^&\(\)\-\+:\|\\"\$]+\s*$/g;
    return pattern.test(keys);
}
(function ($) {

    $.trimChar = function (str, delChar) {
        var result = str;
        if (str.length) {
            while ('' + result.charAt(0) == delChar) {
                result = result.substring(1);
            }
            while ('' + result.charAt(result.length - 1) == delChar) {
                result = result.substring(0, result.length - 1);
            }
        }
        return result;
    };

    $.addzero = function (str, lenght) {
        var val = "" + str;
        if (val.length >= lenght)
            return val;
        else
            return $.addzero("0" + val, lenght);
    };

    /**
     * 判断字符串为空，
     * @param str
     */
    $.isEmpty = function (str) {
        return null == str || "" == $.trim(str);
    };

    /**
     * 判断邮箱
     * @param str
     */
    $.isEmail = function (str) {
        var patrn = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
        return patrn.test(str);
    };


    $.isUrl = function (str) {
        var patrn = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
        return patrn.test(str);
    };


    $.primaryKey = function () {
        var dateString = (new Date()).format('yyyy-MM-dd HH:mm:ss');
        var time = ((dateString.replaceAll('-', '')).replaceAll(':', '')).replaceAll(' ', '');
        return time.concat($.randomChar(18));
    };

    $.randomChar = function (len) {
        if (len == null) len = 10;
        var charArray = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        var randomString = "";
        for (var i = 0; i < len; i++) {
            randomString += charArray[Math.round((Math.random() * 35))];
        }
        charArray = null;
        return randomString;
    };

    $.randomNum = function (len) {
        if (len == null) {
            len = 10;
        }
        var randomNumber = "";
        for (var i = 0; i < len; i++) {
            randomNumber += Math.round((Math.random() * 9));
        }
        return randomNumber;
    };


    $.randomUUID = function (separator) {

        var sp = "-";
        if (separator != undefined && separator != null) sp = separator;
        var s = [], itoh = '0123456789ABCDEF'.split('');
        for (var i = 0; i < 36; i++) {
            s[i] = Math.floor(Math.random() * 0x10);
        }
        s[14] = 4;
        s[19] = (s[19] & 0x3) | 0x8;
        for (var i = 0; i < 36; i++) {
            s[i] = itoh[s[i]];
        }
        s[8] = s[13] = s[18] = s[23] = sp;
        return s.join('');
    };

    $.toHexColor = function (rgb) {
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        var that = rgb;
        if (/^(rgb|RGB)/.test(that)) {
            var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
            var strHex = "#";
            for (var i = 0; i < aColor.length; i++) {
                var hex = Number(aColor[i]).toString(16);
                if (hex === "0") {
                    hex += hex;
                }
                strHex += hex;
            }
            if (strHex.length !== 7) {
                strHex = that;
            }
            return strHex;
        } else if (reg.test(that)) {
            var aNum = that.replace(/#/, "").split("");
            if (aNum.length === 6) {
                return that;
            } else if (aNum.length === 3) {
                var numHex = "#";
                for (var i = 0; i < aNum.length; i += 1) {
                    numHex += (aNum[i] + aNum[i]);
                }
                return numHex;
            }
        } else {
            return that;
        }
    };


    $.toRgbColor = function (hex) {
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        var sColor = hex.toLowerCase();
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
                var sColorNew = "#";
                for (var i = 1; i < 4; i += 1) {
                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值
            var sColorChange = [];
            for (var i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
            }
            return "RGB(" + sColorChange.join(",") + ")";
        } else {
            return sColor;
        }
    };

    $.lowerFirstChar = function (str) {
        return str.substr(0, 1).toLowerCase() + str.substr(1);
    };

    $.lastChar = function (str) {
        return str.charAt(str.length - 1);
    };

    $.firstChar = function (str) {
        return str.charAt(0);
    };

})(jQuery);