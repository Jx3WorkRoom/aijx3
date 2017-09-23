(function($) {

    var initData = function($table) {
        $table.data('cell-attr', '');       // 存放单元格自定义属性(合并属性)
        $table.data('cell-rowspan', 1);     // 存放计算的rowspan值 默认为1
        $table.data('cell-merge', $());     // 存放发现的第一个与前一行比较结果不同td(jQuery封装过的), 默认一个"空"的jquery对象
    };

    var mergeCell = function($table, colIndex, attrName) {
        initData($table);
        $('tbody tr', $table).each(function(index) {
            var $td = $('td:eq(' + colIndex + ')', this);
            var attrValue = $td.attr(attrName);
            if (attrValue == "" || attrValue == null || attrValue == undefined) {     //没有定义属性
                if ($table.data('cell-attr') != '') { //上一次有保存属性
                    if ($table.data('cell-rowspan') != 1) {  // cell-rowspan默认为1, 如果统计出的cell-rowspan没有变化, 不处理
                        $table.data('cell-merge').attr('rowspan', $table.data('cell-rowspan'));
                    }
                }
                initData($table);
            }
            else {   //有定义属性
                if ($table.data('cell-attr') == '') {    //没有上一次保存的属性值
                    $table.data('cell-attr', attrValue);
                    $table.data('cell-rowspan', 1);
                    $table.data('cell-merge', $td);
                }
                else {
                    if ($table.data('cell-attr') == attrValue) { //属性值等于上次保存的值
                        var rowspan = $table.data('cell-rowspan') + 1;    // 上一行与当前行内容相同则col-rowspan累加, 保存新值
                        $table.data('cell-rowspan', rowspan);
                        $td.addClass("merged_unused").hide();    // 值得注意的是 如果用了$td.remove()就会对其他列的处理造成影响
                        if (1 + index == $table.data('rowLength')) {    //到最后一行
                            $table.data('cell-merge').attr('rowspan', $table.data('cell-rowspan'));
                        }
                    }
                    else {
                        if ($table.data('cell-rowspan') != 1) {
                            $table.data('cell-merge').attr('rowspan', $table.data('cell-rowspan'));
                        }
                        $table.data('cell-attr', attrValue);
                        $table.data('cell-rowspan', 1);
                        $table.data('cell-merge', $td);
                    }
                }
            }
        });
    };

    var clearData = function($table) {
        $table.removeData();
    };

    $.fn.extend({
        mergeCell: function(options) {
            $(this).data("rowLength", $('tbody:eq(0) tr', $(this)).length);
            var cols = options.cols;
            var attribute = options.attrName;
            for (var i = cols.length - 1; i >= 0; i--) {
                mergeCell($(this), cols[i], attribute);
            }
            $("tbody td.merged_unused",$(this)).remove();
            clearData($(this));
        }
    });


})(jQuery);
