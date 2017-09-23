(function($) {
    /**
     * 加入队列
     * @param name
     * @param pk 主键id,支持逗号分割
     * @param path ${path}
     */
    $.addQueue = function (name, pk, path) {
        $.ajaxGet(path + "/export/addQueue.do", {"name":name,"pk":pk}, function(result) {
            //alert("加入队列成功");
            if ("1" == result) {
                window.top.$.messager.show({
                            title:"系统提示",
                            msg:"加入队列成功！",
                            timeout:5000,
                            showType:"slide"
                        });
            } else {
                $.messager.show({
                            title:"系统提示",
                            msg:"添加失败，打印队列的数据超过200条!",
                            timeout:5000,
                            showType:"slide"
                        });
            }
        });
    };

    /**
     * 打印队列
     * @param path ${path}
     */
    $.printQueue = function (path) {
        window.open(path + "/export/printExport.do");
    };

    /**
     * 导出excel
     * @param path ${path}
     */
    $.exportExcel = function(path) {
        window.location = path + "/export/excelExport.do";
    };

    /**
     * 导出word
     * @param path ${path}
     */
    $.exportWord = function(path) {
        window.location = path + "/export/wordExport.do";
    };

    /**
     * 删除队列
     */
    $.deleteQueue = function(obj) {
        var name = $(obj).attr("name");
        var pk = $(obj).attr("pk");
        var path = $(obj).attr("path");
        $.ajaxGet(path + "/export/delQueue.do", {"name":name,"pk":pk}, function(result) {
            var div = $(obj).closest("div");
            $(obj).closest("table").remove();
            if (div.find("table").length == 0) div.remove();
        });
    };

    $.print = function() {
        $("a").hide();
        window.print();
        $("a").show();
    }


})(jQuery);

