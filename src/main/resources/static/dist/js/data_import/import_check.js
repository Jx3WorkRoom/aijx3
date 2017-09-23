$(function(){
    //单位换算
    $("#eCalcu").bind('click',function(event){
        endReplace();
        endApply();
        $("#sCalcu").show().find("#calSel").val("");
        $("#eCalcu").hide();
        
        // 只对数字类型进行单位换算 
        createCB($("div[type='number']",".tbody"),"calcuCB");
    });
    
    //文本替换
    $("#eReplace").bind('click',function(event){
        endCalcu();
        endApply();
        $("#sReplace").show();
        $("#sReplace").find("#findWith").val("");
        $("#sReplace").find("#replaceWith").val("");
        $("#eReplace").hide();
        createCB($("div[type='number'],div[type='varchar']",".tbody"),"replaceCB");
    });
    
    // 局部共用字段
    $("#eApply").bind('click',function(event){
        endCalcu();
        endReplace();
        $("#sApply").show();
        $("#eApply").hide();
        $(".tfoot .td").each(function(i){
            
            var type = $(this).attr("type");
            var value = "";
            var index ="";
            if (typeof(type) != "undefined") {
                switch(type){
                case 'number':
                    if ($(this).find(".easyui-numberbox").length > 0) { // numberbox
                        value = $(this).find(".easyui-numberbox").numberbox('getValue');
                    } else { // 非numberbox (标签域，自增长)
                        value = $(this).find("input:first").val();
                    }
                    break;
                case 'varchar':
                    value = $(this).find("input:first").val();
                    break;
                case 'date':
                case 'timestamp':
                    value = $(this).find("input:first").val();
                    break;
                case 'dict':
                    value = $(this).find("select[dict]").val();
                    break;
                case 'fk':
                    value = $(this).find("select[name]").val();
                    break;
                case 'clob':
                    value = $(this).find("textarea[name]").val();
                    break;
                }
            }
            
            if($.trim(value) != '') {
                index = $(this).attr("index");
                createCB($(".tbody .td[index='" + index + "']"), "applyCB");
            }
            
        });
    });

});

// 创建多选框
function createCB(tdo,className) {
    tdo.each(function(){
        $(this).prepend("<input class='"+className+"' type='checkbox' style='width:16px;' />");
        
        var index = $(this).attr("index");
        var thCol = $("div .table .thead .td[index='" +index + "']");
        if(thCol.has(":checkbox").length==0) {
            thCol.prepend("<input class='"+className+"' type='checkbox' style='width:16px;' />");
        }
    });
    
    //全选列
    $("." + className , ".thead").on('click',function(event) {
        var cellIndex = $(this).parent("div").attr("index");
        $(".tbody .td[index='" +cellIndex + "'] :checkbox").prop("checked",$(this).prop('checked'));
    });
}


function getResult(num,n){
    n = Number(n);
    num = Number(num);
    var numAbs = num;
    if (num < 0) {
        numAbs = -num;
    }
    var strNum = numAbs.toString();
    if (n > 0) {
        for ( var i = 0; i < n; i++) {
            strNum += "0";
        }
    } else {
        for ( var j = 0; j > n; j--) {
            strNum = "0" + strNum;
        }
    }
    var m = strNum.indexOf(".");
    if (m < 0) {
        m = strNum.length;
    }
    m = m + n;
    strNum = strNum.replace(".", "");
    strNum = strNum.substring(0, m) + "." + strNum.substring(m);
    if (num < 0) {
        strNum = "-" + strNum;
    }
    return Number(strNum);
}

//开始计算
function calculate(selo){
    $(".tbody .calcuCB:checked").each(function(){
        
        var numberboxInput = $(this).parent().find(".easyui-numberbox");
        
        var v = numberboxInput.numberbox('getValue');
        if($.trim(v) == '') {
            return;
        }
        
        //进行乘除运算 
        v = getResult(v, selo.value);
        
        //进行四舍五入
        /*var lenArr = tdo.attr("len").split(",");
        
        if(lenArr.length>1)
            v = roundDecimal(v, lenArr[1]);*/
        
        // 赋新值
        numberboxInput.numberbox('setValue',v);
        
        // 验证
        numberboxInput.numberbox("validate");
        
    });
    
    endCalcu();
}

//取消计算
function endCalcu(){
    $("#sCalcu").hide();
    $("#eCalcu").show();
    
    $(".calcuCB").remove();
}

//开始文本替换
function startReplace(){    
    $(".tbody .replaceCB:checked").each(function(){
        var cellType = $(this).parent().attr("type");
        if (cellType == "number") {
            var numberboxInput = $(this).parent().find(".easyui-numberbox");
            
            var v = numberboxInput.numberbox('getValue');
            if($.trim(v) == '') {
                return;
            }
            
            var findWith=$("#findWith").val();
            var replaceWith=$("#replaceWith").val();
            v= v.replace(new RegExp(findWith, 'g'), replaceWith);
            
            // 赋新值
            numberboxInput.numberbox('setValue',v);
            
            // 验证
            numberboxInput.numberbox("validate");
        } else if (cellType == "varchar") {
            var v = $(this).parent().find(".easyui-validatebox").val();
            if($.trim(v) == '') {
                return;
            }
            
            var findWith=$("#findWith").val();
            var replaceWith=$("#replaceWith").val();
            v= v.replace(new RegExp(findWith, 'g'), replaceWith);
            
            $(this).parent().find(".easyui-validatebox").val(v);
            $(this).parent().find(".easyui-validatebox").validatebox("validate");
        }
        
    });
    endReplace();
}

//取消文本替换
function endReplace(){
    $("#sReplace").hide();
    $("#eReplace").show();
    
    $(".replaceCB").remove();
}


//开始共用字段
function startApply(){
    $(".tbody .applyCB:checked").each(function(i){
        applyColumnData($(this).parent(),"part");
    });
    endApply();
}

/**
 * 局部共用字段，全部共用字段
 * @param tdObj       局部共用字段是为tbody里每个选中的checkbox所在的td,全部共用字段是为tfoot里面的td
 * @param applyType "part":表示局部共用字段，"all":表示是全部共用字段操作 
 */
function applyColumnData(tdObj,applyType) {
    var cellType = $(tdObj).attr("type");
    var cellIndex = $(tdObj).attr("index");
    var value = "";
    if (typeof(cellType) != "undefined") {
        switch(cellType){
        case 'number':
            if (($(".tfoot .td[index='" + cellIndex + "']").find(".easyui-numberbox").length > 0)) {  // easy ui numberbox 控件
                inputObj = $(".tfoot .td[index='" + cellIndex + "']").find("input:first");
                value = $(".tfoot .td[index='" + cellIndex + "']").find(".easyui-numberbox").numberbox('getValue');
            } else { // 普通的input控件
                value = $(".tfoot .td[index='" + cellIndex + "']").find("input:first").val();
            }
            
            if($.trim(value) == '') { break; }
            
            if (applyType=="part") {
                $(tdObj).find(".easyui-numberbox").numberbox('setValue',value);
            } else if (applyType=="all") {
                $(".tbody .td[index='" + cellIndex + "']").find(".easyui-numberbox").numberbox('setValue',value);
            }
            break;
        case 'varchar':
            value = $(".tfoot .td[index='" + cellIndex + "']").find("input:first").val();
            if($.trim(value) == '') { break; }
            
            if (applyType=="part") {
                $(tdObj).find("input[name]").val(value);
            } else if (applyType=="all") {
                $(".tbody .td[index='" + cellIndex + "']").find("input[name]").val(value);
            }
            break;
        case 'date':
        case 'timestamp':
            value = $(".tfoot .td[index='" + cellIndex + "']").find("input:first").val();
            if($.trim(value) == '') { break; }
            
            if (applyType=="part") {
                $(tdObj).find("input[name]").val(value);
            } else if (applyType=="all") {
                $(".tbody .td[index='" + cellIndex + "']").find("input[name]").val(value);
            }
            break;
        case 'dict':
            value = $(".tfoot .td[index='" + cellIndex + "']").find("select[dict]").val()
            if($.trim(value) == '') { break; }
            
            if (applyType=="part") {
                $(tdObj).find("select[dict]").val(value);
            } else if (applyType=="all") {
                $(".tbody .td[index='" + cellIndex + "']").find("select[dict]").val(value);
            }
            break;
        case 'fk':
            value = $(".tfoot .td[index='" + cellIndex + "']").find("select[name]").val();
            var text = $(".tfoot .td[index='" + cellIndex + "']").find("select[name]").find("option:selected").text();
            if($.trim(value) == '') { break; }
            
            if (applyType=="part") {
                $(tdObj).find("input[name]:first").val(text);
                
                $(tdObj).find("select[name]").find("option:selected").val(value);
                $(tdObj).find("select[name]").find("option:selected").text(text);
            } else if (applyType=="all") {
                $(".tbody .td[index='" + cellIndex + "']").find("input:first").val(text);
                
                $(".tbody .td[index='" + cellIndex + "']").find("select[name]").find("option:selected").val(value);
                $(".tbody .td[index='" + cellIndex + "']").find("select[name]").find("option:selected").text(text);
            }
            break;
        case 'clob':
            value = $(".tfoot .td[index='" + cellIndex + "']").find("textarea:first").val();
            if($.trim(value) == '') { break; }
            
            if (applyType=="part") {
                $(tdObj).find("textarea[name]").val(value);
            } else if (applyType=="all") {
                $(".tbody .td[index='" + cellIndex + "']").find("textarea[name]").val(value);
            }
            break;
        }
    }
}


//取消共用字段
function endApply(){
    $("#sApply").hide();
    $("#eApply").show();    
    $(".applyCB").remove();
}

// 全部共用字段
function apply(){
    $(".tfoot .td").each(function(i){
        applyColumnData($(this),"all");
    });
}
