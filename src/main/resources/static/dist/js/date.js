Date.prototype.format = function(mask) {

    var d = this;

    var zeroize = function (value, length) {

        if (!length) length = 2;

        value = String(value);

        for (var i = 0, zeros = ''; i < (length - value.length); i++) {

            zeros += '0';

        }

        return zeros + value;

    };

    return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g, function($0) {

        switch ($0) {

            case 'd':    return d.getDate();

            case 'dd':    return zeroize(d.getDate());

            case 'ddd':    return ['Sun','Mon','Tue','Wed','Thr','Fri','Sat'][d.getDay()];

            case 'dddd':    return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d.getDay()];

            case 'M':    return d.getMonth() + 1;

            case 'MM':    return zeroize(d.getMonth() + 1);

            case 'MMM':    return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];

            case 'MMMM':    return ['January','February','March','April','May','June','July','August','September','October','November','December'][d.getMonth()];

            case 'yy':    return String(d.getFullYear()).substr(2);

            case 'yyyy':    return d.getFullYear();

            case 'h':    return d.getHours() % 12 || 12;

            case 'hh':    return zeroize(d.getHours() % 12 || 12);

            case 'H':    return d.getHours();

            case 'HH':    return zeroize(d.getHours());

            case 'm':    return d.getMinutes();

            case 'mm':    return zeroize(d.getMinutes());

            case 's':    return d.getSeconds();

            case 'ss':    return zeroize(d.getSeconds());

            case 'l':    return zeroize(d.getMilliseconds(), 3);

            case 'L':    var m = d.getMilliseconds();

                if (m > 99) m = Math.round(m / 10);

                return zeroize(m);

            case 'tt':    return d.getHours() < 12 ? 'am' : 'pm';

            case 'TT':    return d.getHours() < 12 ? 'AM' : 'PM';

            case 'Z':    return d.toUTCString().match(/[A-Z]+$/);

            // Return quoted strings with the surrounding quotes removed

            default:    return $0.substr(1, $0.length - 2);
        }
    });
};


(function($) {

    /*将String类型解析为Date类型.
     #   parseDate('2006-1-1') return new Date(2006,0,1)
     #   parseDate(' 2006-1-1 ') return new Date(2006,0,1)
     #   parseDate('2006-1-1 15:14:16') return new Date(2006,0,1,15,14,16)
     #   parseDate(' 2006-1-1 15:14:16 ') return new Date(2006,0,1,15,14,16);
     #   parseDate('2006-1-1 15:14:16.254') return new Date(2006,0,1,15,14,16,254)
     #   parseDate(' 2006-1-1 15:14:16.254 ') return new Date(2006,0,1,15,14,16,254)
     #   parseDate('不正确的格式') retrun null
     # */
    $.parseDate = function(str) {
        var date = new Date(Date.parse(str.replace(/-/g, "/")));
        return isNaN(date) ? null : date;
    };

    /*
     #   将Date/String类型,解析为String类型.
     #   传入String类型,则先解析为Date类型
     #   不正确的Date,返回 ''
     #   如果时间部分为0,则忽略,只返回日期部分.
     # */
    $.formatDate = function(date, mask) {
        var v;
        if (date.constructor == String) {
            v = $.parseDate(date);
        }
        else if (date.constructor == Date) {
            v = date;
        }
        else {
            return '';
        }

        if (v instanceof Date) {
            return v.format(mask);
        }
        else {
            return '';
        }
    };

    $.formatLocal = function(date) {
        var yy = date.getFullYear();
        var mm = date.getMonth() + 1;
        var dd = date.getDate();
        var hh = date.getHours();
        var mi = date.getMinutes();
        var se = date.getSeconds();
        var ww = "";
        switch (date.getDay()) {
            case 0: ww = "星期日"; break;
            case 1: ww = "星期一"; break;
            case 2: ww = "星期二"; break;
            case 3: ww = "星期三"; break;
            case 4: ww = "星期四"; break;
            case 5: ww = "星期五"; break;
            case 6: ww = "星期六"; break;
        }
        return yy + "年" + mm + "月" + dd + "日&nbsp;" + ww + "&nbsp;" + (hh < 10 ? "0" + hh : hh) + ":" + (mi < 10 ? "0" + mi : mi) + ":" + (se < 10 ? "0" + se : se)
    };

    $.formatLocal = function(date,notime) {
        var yy = date.getFullYear();
        var mm = date.getMonth() + 1;
        var dd = date.getDate();
        var hh = date.getHours();
        var mi = date.getMinutes();
        var se = date.getSeconds();
        var ww = "";
        switch (date.getDay()) {
            case 0: ww = "星期日"; break;
            case 1: ww = "星期一"; break;
            case 2: ww = "星期二"; break;
            case 3: ww = "星期三"; break;
            case 4: ww = "星期四"; break;
            case 5: ww = "星期五"; break;
            case 6: ww = "星期六"; break;
        }
        return yy + "年" + mm + "月" + dd + "日&nbsp;" + ww;
    };


    $.isDate = function (str) {
//        var reg =/\d{4}(\.|\/|\-)\d{1,2}(\.|\/|\-)\d{1,2}/;
        var reg =/\d{1,4}(-)\d{1,2}(-)\d{1,2}/;
        if (!reg.test(str)) {
            return false;
        }
        var r = str.match(/\d{1,4}/g);
        if (r == null) {
            return false;
        }
        var d = new Date(r[0], r[1] - 1, r[2]);
        return (d.getFullYear() == r[0] && (d.getMonth() + 1) == r[1] && d.getDate() == r[2]);
    };

    $.isDatetime=function (str){
        var reg = /\d{1,4}(-)\d{1,2}(-)\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}/;
        if (!reg.test(str)) {
            return false;
        }
        var r = str.match(/\d{1,4}/g);
    };

    //判断字符串是否是时间01:30时间格式
    $.isTimeHM=function(str) {
        //var reg=/^(0?[0-9]|1[0-9]|2[0-3]):(0?[0-9]|[1-5][0-9])$/;
        //var reg=/^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
        var reg=/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
        return reg.test(str);
    };

    //判断字符串是否是时间01:30:10时间格式
    $.isTimeHMS=function(str) {
        var reg=/^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
        return reg.test(str);
    }

})(jQuery);