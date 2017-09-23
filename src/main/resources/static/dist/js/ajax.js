var showError = function(obj) {

    var errMsg = (obj.constructor == String) ? obj : $.getException(obj.responseText);
    if (window.top.$.fn.dialog != null) {
        if (window.top.$("#errorDialogTemp").length == 0) {
//            $("<div id='errorDialogTemp' style='width:800px;height:400px; overflow:auto;display:none;position: absolute;'>" +
//                    "<div id='errorDialogTempContent' style='padding: 10px'></div></div>").appendTo(window.top.$("body"));
//

            window.top.$("body").append("<div id='errorDialogTemp' style='width:800px;height:400px; overflow:auto;display:none;position: absolute;'>" +
                "<div id='errorDialogTempContent' style='padding: 10px'></div></div>");
        }
        if (!$.isEmpty(errMsg)) {
            window.top.$("#errorDialogTempContent").html(errMsg);
            window.top.$("#errorDialogTemp").css("display", "block").dialog({"title":"系统错误", modal:true});
        }
    } else {
        if (!$.isEmpty(errMsg)) {
            $("body").css("overflow", "auto");
            $("body").html($.getException(errMsg));
        }
    }
};

(function($) {

    /**
     * 提交对象转换ajax参数
     * @param params
     */
    $.convertData = function(params) {
        var castString = function(param) {
            if (param == null) {
                return null;
            }
            else if (param.constructor == String) {
                return param;
            }
            else if (param.constructor == Boolean) {
                return param;
            }
            else if (param.constructor == Date) {
                return $.formatDate(param);
            }
            else if (param.constructor == Number) {
                return param;
            }
            else if (param.constructor == Array) {
                return $.toJSON(param);
            }
            else if (param.constructor == Object) {
                return $.toJSON(param);
            }
        };

        if (params == null) return null;
        var obj = {};
        if (params.constructor == Array) {
            for (var i = 0; i < params.length; i++) {
                obj["arg" + i] = castString(params[i]);
            }
        }
        else {
            for (var k in params) {
                obj[k] = castString(params[k]);
            }
        }
        return $.param(obj);
    };

    /**
     * ajax get方法
     * @param action
     * @param params
     * @param successCallback
     * @param errorCallback
     * @param shutDownCallback
     */
    $.ajaxGet = function(action, params, successCallback, errorCallback, shutDownCallback) {
        var ajaxData = $.convertData(params);
        var url = action + (action.indexOf("?") == -1 ? "?timeSerialize=" : "&timeSerialize=");
        url += (new Date()).getTime();
        $.ajax({
                    type: "GET",
                    url: url,
                    dataType : "text",
                    data: ajaxData,
                    complete:function(request, textStatus) {
                        if (request.readyState == 4 && request.status == 200) {
                            var result = request.responseText;
                            if ($.isException(result)) {
                                $.hideLoad();
                                if (errorCallback) errorCallback($.getException(result));
                                else window.top.showError($.getException(result));
                                return;
                            }
                            if (successCallback != null && $.isFunction(successCallback)) {
                                successCallback(result, textStatus);
                            }
                        }
                        else {
                            $.hideLoad();
                            if (shutDownCallback != null && $.isFunction(shutDownCallback)) {
                                shutDownCallback(request);
                            }
                            else {
                                alert("请求出错:readyState=" + request.readyState + ";status=" + request.status);
                            }
                        }
                    }
                });
    };

    /**
     * ajax post方法
     * @param action
     * @param params
     * @param successCallback
     * @param errorCallback
     * @param shutDownCallback
     */
    $.ajaxPost = function(action, params, successCallback, errorCallback, shutDownCallback) {
        var ajaxData = $.convertData(params);
        var url = action + (action.indexOf("?") == -1 ? "?timeSerialize=" : "&timeSerialize=");
        url += (new Date()).getTime();
        $.ajax({
                    type: "POST",
                    url: url,
                    dataType : "text",
                    data: ajaxData,
                    complete:function(request, textStatus) {
                        if (request.readyState == 4 && request.status == 200) {
                            var result = request.responseText;
                            if ($.isException(result)) {
                                $.hideLoad();
                                $.hideLoad2();
                                if (errorCallback) errorCallback($.getException(result));
                                else window.top.showError($.getException(result));
                                return;
                            }
                            if (successCallback != null && $.isFunction(successCallback)) {
                                successCallback(result, textStatus);
                            }
                        }
                        else {
                            $.hideLoad();
                            $.hideLoad2();
                            if (shutDownCallback != null && $.isFunction(shutDownCallback)) {
                                shutDownCallback(request);
                            }
                            else {
                                //alert("请求出错:readyState="+request.readyState+";status="+request.status);
                            }
                        }
                    }
                });
    };

    /**
     * 同步ajax post方法
     * @param action
     * @param params
     * @param successCallback
     * @param errorCallback
     * @param shutDownCallback
     */
    $.ajaxAsync = function(action, params, successCallback, errorCallback, shutDownCallback) {
        var ajaxData = $.convertData(params);
        var url = action + (action.indexOf("?") == -1 ? "?timeSerialize=" : "&timeSerialize=");
        url += (new Date()).getTime();
        $.ajax({
                    type: "POST",
                    url: url,
                    dataType : "text",
                    data: ajaxData,
                    async:false,
                    complete:function(request, textStatus) {
                        if (request.readyState == 4 && request.status == 200) {
                            var result = request.responseText;
                            if ($.isException(result)) {
                                $.hideLoad();
                                if (errorCallback) errorCallback($.getException(result));
                                else window.top.showError($.getException(result));
                                return;
                            }
                            if (successCallback != null && $.isFunction(successCallback)) {
                                successCallback(result, textStatus);
                            }
                        }
                        else {
                            $.hideLoad();
                            if (shutDownCallback != null && $.isFunction(shutDownCallback)) {
                                shutDownCallback(request);
                            }
                            else {
                                //alert("请求出错:readyState="+request.readyState+";status="+request.status);
                            }
                        }
                    }
                });
    };


    $.isException = function(result) {
        return result != null && result.indexOf("<title>exception</title>") >= 0;
    };

    $.getException = function(result) {
        var inx1 = result.indexOf("<body>") + 6;
        var inx2 = result.indexOf("</body>");
        return result.substring(inx1, inx2);
    };


})(jQuery);
