(function($) {
    $.showLoad2 = function(msg) {
        $("<div class=\"load-mask\"></div>").css({display:"block",width:"100%",height:$(window).height(),zIndex:999999}).appendTo("body");
        $("<div class=\"load-mask-msg\"></div>").html(msg ? msg : "正在处理，请稍候。。。").appendTo("body").css({zIndex:1000000,display:"block",left: ($(document.body).outerWidth(true) - 190) / 2,top:($(window).height() - 45) / 2});

    };

    $.hideLoad2 = function() {
        $("div.load-mask").remove();
        $("div.load-mask-msg").remove();
    };

    $.showLoad = function (msg) {
        $.messager.progress({"msg":msg ? msg : ''});
    };

    $.hideLoad = function () {
        $.messager.progress('close');
    };

    $.switchRow = function($obj, type) {
        $("tbody tr").css("background-color","");
//        var rowIndex = $($obj).parent().find("tr[name=rowIndex]").val();
        var rowIndex = $($obj).closest("tr").find("td:eq(0) span").text();
        var thisTr = $($obj).parent().parent();
        thisTr.css("background-color","#afeeee");

        var allCount = thisTr.parent().children("tr").size();
        var allTr = thisTr.parent().children("tr");
        if (type == 'up') {
            if (parseInt(rowIndex) > 1) {
                var preObj = thisTr.prev();
                preObj.before(thisTr);

            }
        } else {
            if (parseInt(rowIndex) < allCount) {
                var nextObj = thisTr.next();
                nextObj.after(thisTr);
            }
        }

        $($obj).closest("tbody").children("tr").each(function(i, item) {
            $(item).find("td:eq(0) span").text(i+1);
            $(item).find("td:eq(0) input").val(i+1);
        });
    };

    $.sortRow = function($obj, type) {
        $("tbody tr").css("background-color","");
        var thisTr = $($obj).parent().parent();
        thisTr.css("background-color","#afeeee");

        var allCount = thisTr.parent().children("tr").size();
        var allTr = thisTr.parent().children("tr");
        if (type == 'up') {
            var preObj = thisTr.prev();
            preObj.before(thisTr);
        } else {
            var nextObj = thisTr.next();
            nextObj.after(thisTr);
        }

        $($obj).closest("tbody").children("tr").each(function(i, item) {
            $(item).find("td:eq(0) input:eq(0)").val(i+1);
        });
    };

})(jQuery);