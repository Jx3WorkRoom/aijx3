(function($) {

    /**
     * 关闭对话框
     */
    $.closeDialog = function(id) {
        var div = id.substr(0, 1) == "#" ? id : "#" + id;
        $(div).find("iframe").attr("src","about:blank");
        $(div).dialog("close");
    };

    /**
     * 重置对话框
     */
    $.restoreDialog = function(id) {
        var div = id.substr(0, 1) == "#" ? id : "#" + id;
        $(div).find("iframe").attr("src","about:blank");
        $(div).dialog("restore");
    };

    $.adjustPosition = function(id, left, top){
        var div = id.substr(0, 1) == "#" ? id : "#" + id;
        if(left<0||top<0) $(div).dialog("move",{"top": top<0?0:top,"left":left<0?0:left});
    };

    $.autoWidth = function (spacing) {
        var width = $(window).width();
        return width - (spacing ? spacing : 5);
    };

    $.autoHeight = function (spacing) {
        var height = $(window).height();
        return height - (spacing ? spacing : 5);
    };

})(jQuery);
