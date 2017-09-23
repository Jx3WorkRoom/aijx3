//加法
Number.prototype.add = function (arg) {
    var r1,r2,m;
    try {
        r1 = this.toString().split(".")[1].length;
    } catch(e) {
        r1 = 0;
    }
    try {
        r2 = arg.toString().split(".")[1].length;
    } catch(e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (this * m + arg * m) / m;
};
//减法
Number.prototype.sub = function (arg) {
    var r1,r2,m;
    try {
        r1 = this.toString().split(".")[1].length;
    } catch(e) {
        r1 = 0;
    }
    try {
        r2 = arg.toString().split(".")[1].length;
    } catch(e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (this * m - arg * m) / m;
};
//乘法
Number.prototype.mul = function (arg) {
    var m = 0,s1 = this.toString(),s2 = arg.toString();
    try {
        m += s1.split(".")[1].length;
    } catch(e) {
    }
    try {
        m += s2.split(".")[1].length;
    } catch(e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
};

//除法
Number.prototype.div = function (arg) {
    var t1 = 0,t2 = 0,r1,r2;
    try {
        t1 = this.toString().split(".")[1].length;
    } catch(e) {
    }
    try {
        t2 = arg.toString().split(".")[1].length;
    } catch(e) {
    }
    with (Math) {
        r1 = Number(this.toString().replace(".", ""));
        r2 = Number(arg.toString().replace(".", ""));
        return (r1 / r2) * pow(10, t2 - t1);
    }
};
(function($) {

    /**
     * 判断是否都是数字
     * @param str
     */
    $.isDigit = function (str) {
        var patrn = /^\d+$/;
        return patrn.test(str);
    };

    /**
     * 判断是否整形
     * @param str
     */
    $.isInteger = function (str) {
        var patrn = /^([+-]?)(\d+)$/;
        return patrn.test(str);
    };

    /**
     * 判断是否是浮点型
     * @param str
     */
    $.isFloat = function(str) {
        var patrn = /^-?\d+\.?\d*$/;
        return patrn.test(str);
    };

    /**
    * 四舍五入
    * @param number
    * @param fractionDigits
    */
    $.round = function(number,fractionDigits){
       return Math.round(number*Math.pow(10,fractionDigits))/Math.pow(10,fractionDigits);
    }

})(jQuery);