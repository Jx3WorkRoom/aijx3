(function ($) {

    /////////////////////////////////////////////////////////////////////////////////
    //              此js中的通用方法适用于 EasyUI 中的grid   author:Simple          //
    //                                                                             //
    ////////////////////////////////////////////////////////////////////////////////

    /*   用法：
     *    onHeaderContextMenu: function(e, field) {
     *          $.columnIsDisplay(e, field, "table");
     *    }
     */

    /**
     * 当 grid 的头部被右键单击时选择隐藏 grid中的列
     * @param e
     * @param field
     * @param table 表示grid的id
     */
    $.columnIsDisplay = function (e, field, table) {          //grid上每列控制显示
        var hideColumnMenu = '<div id="tmenu" style="width:120px;"></div>';
        if ($("#tmenu").length == 0) {
            $("body").append($(hideColumnMenu));
        }

        e.preventDefault();
        if ($('#tmenu').text() == "") {
            var fields = $('#' + table).datagrid('getColumnFields');
            for (var i = 0; i < fields.length; i++) {
                var display = $('#' + table).datagrid('getColumnOption', fields[i]);
                if (!display.hidden) {
                    var div_var = '<div iconCls="icon-ok" field="' + fields[i] + '">' + display.title + '</div>';
                    $('#tmenu').append(div_var);
                } else {
                    $('<div iconCls="icon-empty" field="' + fields[i] + '"/>').html(display.title);
                }
            }
            $('#tmenu').menu({
                onClick: function (item) {
                    if (item.iconCls == 'icon-ok') {
                        if ($('#tmenu').find("div.menu-icon.icon-ok").length > 1) {  //至少要有留一列在页面上
                            $('#' + table).datagrid('hideColumn', $(item.target).attr("field"));
                            $('#tmenu').menu('setIcon', {
                                target: item.target,
                                iconCls: 'icon-empty'
                            });
                        }
                    } else {
                        $('#' + table).datagrid('showColumn', $(item.target).attr("field"));
                        $('#tmenu').menu('setIcon', {
                            target: item.target,
                            iconCls: 'icon-ok'
                        });
                    }
                }
            });
        }
        $('#tmenu').menu('show', {
            left: e.pageX,
            top: e.pageY
        });
    };


    /*   用法：
     *    onDblClickCell:function(rowIndex, field, value) {
     *         $.columnWindow("table", field, value);
     *    }
     */

    /**
     * 双击grid中的一个单元格，单元格中的内容在弹出框中完整显示
     * @param table  表示grid的id
     * @param field
     * @param value  单元格的内容
     */
    $.columnWindow = function (table, field, value) {
        var display = $("#" + table).datagrid('getColumnOption', field);
        var temp_window = '<div id="columnWindow" style="width:350px;height:160px; overflow:hidden;display: none;padding:3px" resizable="true" maximizable="true" modal="true"><textarea class="textarea" id="column_textarea" style="width:97%;height:110px;"></textarea></div>';
        if ($("#columnWindow").length == 0) {
            $("body").append($(temp_window));
        }
        $("#columnWindow").css("display", "block").dialog({
            "title": display.title ? display.title : "无",
            "maximized": false,
            "maximizable": false,
            "modal": true,
            "onMove": function (left, top) {
                $.adjustPosition("columnWindow", left, top)
            },
            "onBeforeClose": function () {
                $.restoreDialog("columnWindow")
            }
        });
        $("#column_textarea").val(value);
    };

    /**
     *设置iframe高度
     */
    $.setActiveIframeHeight = function () {
        function getBodyHeight() {   //计算iframe内容的高度
            var height = 0;
            if (document) {
                height = $(document.body).height();//Math.max(document.body.clientHeight,document.body.offsetHeight);
                //获取iframe中显示的脱离文档流的元素
                var panels = $('.page-shadow.active'),
                    pHeight = 0;
                //计算其中最大的值
                for (var i = 0; i < panels.length; i++) {
                    //计算撑开iframe的高度
                    var panelContent = $(panels[i]),
                        panelContentHeight = panelContent.height() + panelContent.offset().top + 50;
                    pHeight = (panelContentHeight > pHeight) ? panelContentHeight : pHeight;
                }
                height = (pHeight > height) ? pHeight : height;
            }
            return height;
        }

        var curHeight = getBodyHeight(),
        //这里使用#right-content-test自适应来探测中部内容显示区域的最小高度
            minHeight = top.$('#right-content-test').height(),
        //获取iframe元素
            htmlDom = top.$('.tab-content>.active').find('iframe')[0];

        curHeight = (minHeight >= curHeight) ? minHeight : curHeight;

        //top.activeIframeHeight记录了当前的iframe的的高度
        if (htmlDom && htmlDom.height != top.activeIframeHeight) {
            htmlDom.height = top.activeIframeHeight;
        }

        //防止临界值导致滚动条时有时无使用Math.abs处理
        if ($.setActiveIframeHeight.isFirst || (Math.abs(top.activeIframeHeight - curHeight) > 2)) {
            top.activeIframeHeight = curHeight;
            htmlDom && (htmlDom.height = top.activeIframeHeight);
        }
        $.setActiveIframeHeight.isFirst = 0;
    }
    $.setActiveIframeHeight.isFirst = 1;


})(jQuery);