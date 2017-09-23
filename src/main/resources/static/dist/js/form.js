(function ($) {
    var focusElement = function (element) {
        var input;
        if (element.constructor == String) {
            $("#" + $.trimChar(element, "#")).focus();
        }
        else if (element.constructor == Object) {
            $(element).focus();
        }
    };
    /**
     * 序列化表单对象为json对象,主表数据转换
     * 对于表单中有name相同的input,则使用逗号连接value值
     */
    $.fn.extend({
        serializeJson: function () {
            var inputs = $(this).find(":input[name]"); //查找所有有name的input select textarea

            if (inputs == null || inputs.length == 0) return null;
            var json = {};//json对象
            for (var i = 0; i < inputs.length; i++) {
                var elem = $(inputs[i]);
                if (elem.is(':checkbox') && !elem.prop('checked')) continue; //未选中的checkbox
                if (elem.is(':radio') && !elem.prop('checked')) continue; //未选中的radio
                if (json.hasOwnProperty(elem.attr('name'))) {//json对象包含输入框名称(如checkbox多选)
                    json[elem.attr('name')] += "," + elem.val();
                } else {
                    json[elem.attr('name')] = elem.val();
                }
            }
            return !$.isEmptyObject(json) ? json : null;
        },

        /**
         * 序列化表单对象为JsonArray对象,从表数据的转换
         * @param tagName 对象集合中的元素的tagname （通常是tr）
         */
        serializeJsonArray: function (tagName) {
            var jsonArray = [];
            if ($(this).length == 0) return jsonArray;
            if (!$.isEmpty(tagName)) {
                var elems = $(this).find(tagName);
                for (var i = 0; i < elems.length; i++) {
                    var json = $(elems[i]).serializeJson();
                    if (json != null) jsonArray.push(json);
                }
            }
            else {
                for (var i = 0; i < $(this).length; i++) {
                    var json = $($(this)[i]).serializeJson();
                    if (json != null) jsonArray.push(json);
                }
            }
            return jsonArray;
        },


        /**
         * 将json对象转换成字符串设置到隐藏域中
         * @param json
         */
        setJson: function (json) {
            $(this).val($.toJSON(json));
        },

        dateValue: function () {
            return $.parseDate($(this).val());
        },

        floatValue: function () {
            return $.isFloat($(this).val()) ? parseFloat($(this).val()) : null;
        },

        integerValue: function () {
            return $.isInteger($(this).val()) ? parseInt($(this).val()) : null;
        },


        checkEmpty: function (msg, focusInput) {
            if ($.isEmpty($(this).val())) {
                alert(msg);
                focusElement(focusInput != null ? focusInput : $(this));
                return true;
            }
            else {
                return false;
            }
        },

        checkNotEmpty: function (msg, focusInput) {
            if ($.isEmpty($(this).val())) {
                alert(msg);
                focusElement(focusInput != null ? focusInput : $(this));
                return false;
            }
            else {
                return true;
            }
        },

        checkDigit: function (msg, focusInput) {
            if (!$.isDigit($(this).val())) {
                alert(msg);
                focusElement(focusInput != null ? focusInput : $(this));
                return false;
            }
            else {
                return true;
            }
        },

        checkInteger: function (msg, focusInput) {
            if (!$.isInteger($(this).val())) {
                alert(msg);
                focusElement(focusInput != null ? focusInput : $(this));
                return false;
            }
            else {
                return true;
            }
        },

        checkFloat: function (msg, focusInput) {
            if (!$.isFloat($(this).val())) {
                alert(msg);
                focusElement(focusInput != null ? focusInput : $(this));
                return false;
            }
            else {
                return true;
            }
        },


        checkDate: function (msg, focusInput) {
            if (!$.isDate($(this).val())) {
                alert(msg);
                focusElement(focusInput != null ? focusInput : $(this));
                return false;
            }
            else {
                return true;
            }
        },

        checkEmail: function (msg, focusInput) {
            if (!$.isEmail($(this).val())) {
                alert(msg);
                focusElement(focusInput != null ? focusInput : $(this));
                return false;
            }
            else {
                return true;
            }
        },

        checkUrl: function (msg, focusInput) {
            if (!$.isUrl($(this).val())) {
                alert(msg);
                focusElement(focusInput != null ? focusInput : $(this));
                return false;
            }
            else {
                return true;
            }
        },

        /**
         * 复选框的状态选择
         * IDName:checkbox框id或name
         * status:选中状态 true or false
         */
        statusChecked: function (IDName, status) {
            var objCheckBoxs = this.getObjects(IDName);
            if (objCheckBoxs != null) {
                for (var i = 0; i < objCheckBoxs.length; i++) {
                    objCheckBoxs[i].checked = (status != null) ? status : (!objCheckBoxs[i].checked);
                }
            }
        },

        /**
         * 获得对象数组
         * elementName:对象数组的名字
         * objWindow:window对象
         */
        getObjects: function (elementName, objWindow) {
            var objs;
            if (objWindow == null) {
                objs = window.document.getElementsByName(elementName);
            }
            else {
                objs = objWindow.document.getElementsByName(elementName);
            }
            return objs;
        },

        /**
         * 获得对象
         * elementID:对象的id
         * objWindow:window对象
         */
        getObject: function (elementID, objWindow) {
            var obj;
            if (objWindow == null) {
                obj = window.document.getElementById(elementID);
            }
            else {
                obj = objWindow.document.getElementById(elementID);
            }
            return obj;
        },

        /**
         * 所有子复选框被选中后，父复选框自动被选中；反之，则未选中
         * cellsBoxName 子复选框名称
         * mainBoxName全选父复选框名称
         */
        superStatusAutoChecked: function (cellsBoxName, mainBoxName) {
            var objLen = 0;
            var objs = this.getObjects(cellsBoxName);
            for (var i = 0; i < objs.length; i++) {
                if (objs[i].checked) {
                    objLen += 1;
                }
            }
            this.getObject(mainBoxName).checked = objs.length == objLen;
        },

        /**
         * 像radio一样的复选框
         */
        statusCheckedAsRadio: function (object) {
            var name = object.name;
            var objCheckBoxs = this.getObjects(name);
            if (objCheckBoxs != null) {
                for (var i = 0; i < objCheckBoxs.length; i++) {
                    if (objCheckBoxs[i] != object) {
                        objCheckBoxs[i].checked = false;
                    }
                }
            }
        }
    });

    /**
     * 连接DOM对象数组中每个对象的属性值，以,号拼接
     * @param objArray dom对象数组
     * @param name
     * @return str
     */
    $.joinAttribute = function (objArray, name) {
        var str = "";
        var key = name;
        if (key == null || key == undefined) key = "value";
        for (var i = 0; i < objArray.length; i++) str += "," + $(objArray[i]).attr(key);
        return str.length > 0 ? str.substring(1) : "";
    };

    /**
     * 连接数组，以,号拼接
     * @param array
     */
    $.joinArray = function (array) {
        var str = "";
        for (var i = 0; i < array.length; i++)
            str += "," + array[i];
        return str.length > 0 ? str.substring(1) : "";
    };

    /**
     * 将json对象数组中的某列属性值连接成字符串, 连接字符, 如主键
     * @param jsonArray
     */
    $.joinJsonArray = function (jsonArray, name) {
        if (jsonArray == null) return null;
        var str = "";
        for (var i = 0; i < jsonArray.length; i++) {
            str += "," + jsonArray[i][name];
        }
        return str.length > 0 ? str.substring(1) : "";
    };

    /*
     * @description        根据某个字段实现对json数组的排序
     * @param     array    要排序的json数组对象
     * @param     field    排序字段（此参数必须为字符串）
     * @param     reverse  是否倒序（默认为false）
     * @return    array    返回排序后的json数组
     */
    $.jsonSort = function (array, field, reverse) {
        //数组长度小于2 或 没有指定排序字段 或 不是json格式数据
        if (array.length < 2 || !field || typeof array[0] !== "object") return array;
        if (typeof array[0][field] === "number") {//数字类型排序
            array.sort(function (x, y) {
                return x[field] - y[field]
            });
        }
        if (typeof array[0][field] === "string") {//字符串类型排序
            array.sort(function (x, y) {
                return x[field].localeCompare(y[field])
            });
        }
        if (reverse) {//倒序
            array.reverse();
        }
        return array;
    };

    /**
     * 禁用form表单中所有的input[文本框、复选框、单选框],select[下拉选],多行文本框[textarea]
     * @param formId
     * @param isDisabled
     */
    $.disableForm = function (formId, isDisabled) {
        var attr = "disable";
        if (!isDisabled) {
            attr = "enable";
        }
        $("form[id='" + formId + "'] :text").attr("disabled", isDisabled);
        $("form[id='" + formId + "'] textarea").attr("disabled", isDisabled);
        $("form[id='" + formId + "'] select").attr("disabled", isDisabled);
        $("form[id='" + formId + "'] :radio").attr("disabled", isDisabled);
        $("form[id='" + formId + "'] :checkbox").attr("disabled", isDisabled);

        //禁用jquery easyui中的下拉选（使用input生成的combox）可用
        $("#" + formId + " input.combobox-f").each(function () {
            if (this.id) {
                $("#" + this.id).combobox(attr);
            }
        });

        //禁用jquery easyui中的下拉选（使用input生成的combox）
        $("#" + formId + " input[class='combobox-f combo-f']").each(function () {
            if (this.id) {
                $("#" + this.id).combobox(attr);
            }
        });

        //禁用jquery easyui中的下拉选（使用select生成的combox）
        $("#" + formId + " select[class='combobox-f combo-f']").each(function () {
            if (this.id) {
                $("#" + this.id).combobox(attr);
            }
        });

        //禁用jquery easyui中的日期组件dataBox
        $("#" + formId + " input[class='datebox-f combo-f']").each(function () {
            if (this.id) {
                $("#" + this.id).datebox(attr);
            }
        });

        // 禁用附件上传按钮
        $("form[id='" + formId + "'] a[name='uploadBtn']").linkbutton(attr);
    };

})(jQuery);
