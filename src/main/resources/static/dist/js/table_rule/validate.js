 function serializeJsonCondition() {
    var jsonArray = $("#condition tbody").serializeJsonArray("tr");
    var groupArray = [];
    var group = {};
    var conditions = [];
    for (var i = 0; i < jsonArray.length; i++) {
        if (jsonArray[i].type == 1) {
            conditions.push(jsonArray[i]);
        } else if (jsonArray[i].type == 2){
            if (i != (jsonArray.length - 1)) { // 如果最后一行是分组，则不添加
                group.conditions = conditions;
                group.logic = jsonArray[i].logic;
                groupArray.push(group);
                group = {};
                conditions = [];
            }
        }
        if (i == jsonArray.length - 1) {
            group.conditions = conditions;
            group.logic = "";
            groupArray.push(group);
        }
    }
    return groupArray;
}
 
 /**
  * 判断某个字段是否是关联了其他字段，这种字段在前台用的是 easy uid combobox，取值方式会有不同
  * kind = 4 参数域; kind = 5 外建域
  */
  function isExtraneousField(columnId) {
      var flag = false;
      if (conditonFields) {
          for (var i = 0; i < conditonFields.length; i++) {
              if(conditonFields[i].value == columnId) {
                  if (conditonFields[i].kind == "4" || conditonFields[i].kind == "5") {
                      flag = true;
                      break;
                  }
              }
          }
      }
      return flag;
  }

  function getValueExpressionStr(columnId) {
      // combobox 控件获取 Value 的方式不一样
      // v2 combobox已弃用，改用select和jquery-autocomplete实现
      var result = ".val()";
      if (conditonFields) {
          for (var i = 0; i < conditonFields.length; i++) {
              if(conditonFields[i].value == columnId) {
                  if (conditonFields[i].kind == "4") {
                      // select 下拉框, 使用.val()获取
                  } else if (conditonFields[i].kind == "5") {
                     // 外键域也修改为了select下拉框，使用.val()获取
                  } else if (conditonFields[i].kind == "6") {
                     // 函数域目前用的是普通的input，使用.val()获取
                  }
              }
          }
      }
      return result;
  }
  
  
  function getTextExpressionStr(columnId) {
      // dict,fk域获取Text值
      var result = ".val()";
      if (conditonFields) {
          for (var i = 0; i < conditonFields.length; i++) {
              if(conditonFields[i].value == columnId) {
                  if (conditonFields[i].kind == "4") {
                      // 参数域，select 下拉框
                      result = '.find("option:selected").text()';
                  } else if (conditonFields[i].kind == "5") {
                      // 外建域，select 下拉框
                      result = '.find("option:selected").text()';
                  }
                  break;
              }
          }
      }
      return result;
  }
  
// 展示 (生成校验规则脚本)
function createType(isSubmit) {
    var rule_type_id = $("#rule_type_id").val();
    
    switch (rule_type_id) {
    case "1": // 单字段强制校验规则
        return createSingleRule();
        break;
    case "2": // 多字段强制规则
        return createMultipleRule();
        break;
    case "3": // 多字段提醒规则
        return createMultipleTip();
        break;
    case "4":
    case "5": // 唯一性校验规则
        return createUnique();
        break;
    case "6":
    case "7": // 数据库查询校验规则
        return createSql(isSubmit);
        break;
    case "8": // 计算规则
        return createCalculate(isSubmit);
        break;
    case "":
        throw new Error("请选择校验规则类型");
        break;
    }
}

// 生成单字段强制校验规则
function createSingleRule() {
    var singleField = $("#singleField").val();
    if (singleField == "") {
        $("#singleField").focus();
        throw new Error("请把值补充完整");
    }
    
    var singleType = $("#singleType").val();
    if (singleType == "") {
        $("#singleType").focus();
        throw new Error("请把值补充完整");
    }
    
    if ($("#singleCondition").length > 0) {
        if ($("#singleCondition").val() == "") {
            $("#singleCondition").focus();
            throw new Error("请把值补充完整");
        }
    }
    
    var content = "";
    var description = "";
    switch (singleType) {
    case "maxlength":
    case "minlength":
        if (/^\d+$/.test($("#singleCondition").val())) {
            content = content + $("#singleField").val() + ":{"
                    + $("#singleType").val() + ":" + $("#singleCondition").val()
                    + "}";
            
            description = description + $("option:selected", "#singleField").text()
                + $("option:selected", "#singleType").text() + "为"
                + $("#singleCondition").val();
            
        } else {
            throw new Error("请输入整数");
        }
        break;
    case "max":
    case "min":
        if (/^-?(?:\d+)(?:\.\d+)?$/.test($("#singleCondition").val())) {
            content = content + $("#singleField").val() + ":{"
                    + $("#singleType").val() + ":" + $("#singleCondition").val()
                    + "}";
            
            description = description + $("option:selected", "#singleField").text()
                + $("option:selected", "#singleType").text() + "为"
                + $("#singleCondition").val();
        } else {
            throw new Error("请输入数字");
        }
        break;
    case "rangelength":
        if (/^\d+$/.test($("#singleCondition1").val())
                && /^\d+$/.test($("#singleCondition2").val())
                && Number($("#singleCondition2").val()) >= Number($(
                        "#singleCondition1").val())) {
            content = content + $("#singleField").val() + ":{"
                    + $("#singleType").val() + ":["
                    + $("#singleCondition1").val() + ","
                    + $("#singleCondition2").val() + "]}";
            
            description = description + $("option:selected", "#singleField").text()
                + $("option:selected", "#singleType").text() + "为"
                + $("#singleCondition1").val() + "至"
                + $("#singleCondition2").val();
        } else {
            throw new Error("请输入合法范围");
        }
        break;
    case "range":
        if (/^-?(?:\d+)(?:\.\d+)?$/.test($("#singleCondition1").val())
                && /^-?(?:\d+)(?:\.\d+)?$/.test($("#singleCondition2").val())
                && Number($("#singleCondition2").val()) >= Number($(
                        "#singleCondition1").val())) {
            content = content + $("#singleField").val() + ":{"
                    + $("#singleType").val() + ":["
                    + $("#singleCondition1").val() + ","
                    + $("#singleCondition2").val() + "]}";
            
            description = description + $("option:selected", "#singleField").text()
                + $("option:selected", "#singleType").text() + "为"
                + $("#singleCondition1").val() + "至"
                + $("#singleCondition2").val();
        } else {
            throw new Error("请输入合法范围");
        }
        break;
    case "positiveFloat":
        if (/^\d+$/.test($("#singleCondition1").val())
                && /^\d+$/.test($("#singleCondition2").val())
                && Number($("#singleCondition1").val()) >= Number($(
                        "#singleCondition2").val())&& Number($("#singleCondition1").val()) > 0) {
            content = content + $("#singleField").val() + ":{"
                    + $("#singleType").val() + ":["
                    + $("#singleCondition1").val() + ","
                    + $("#singleCondition2").val() + "]}";
            
            description = description + $("option:selected", "#singleField").text()
                + $("option:selected", "#singleType").text() + "为 有效位长"
                + $("#singleCondition1").val() + "，小数位长"
                + $("#singleCondition2").val();
        } else {
            throw new Error("请输入合法范围");
        }
        break;
    default:// 一般情况校验规则
        if ($("#singleCondition").val() == "1") { // 无条件
            content = content + $("#singleField").val() + ":{"
                    + $("#singleType").val() + ":true}";
            description = description + $("option:selected", "#singleField").text()
            + " 在无条件下 " + $("option:selected", "#singleType").text();
        } else {
            content = content + $("#singleField").val() + ":{"
                    + $("#singleType").val() + ":" + "function(e){return "
                    + getConnector(false) + ";}}";
            
            description = description + $("option:selected", "#singleField").text()
                    + " 在特定条件：" + $("#rule_description").val();
            description = description + " 下 "
                    + $("option:selected", "#singleType").text();
        }
    }
    
    $("#rule_description").val(description);
    $("#rule_content_script").val(content);
    $("#rule_content_json").val("{"+content+"}");
    return content;
}

//生成多字段强制校验规则
function createMultipleRule() {
    
    var content = "if(!(" + getConnector(false)
            + ")){strMegT1 = strMegT1 + i1 + \"、" + $("#rule_error_hint").val() + "\\"
            + "n\"; i1++;}";
    
    
    $("#rule_content_script").val(content);
    
    return content;
}

//生成多字段提醒校验规则
function createMultipleTip() {
    var content = "if(!(" + getConnector(false)
            + ")){strMegT = strMegT + i + \"、" + $("#rule_error_hint").val() + "\\"
            + "n\"; i++;}";
    
    $("#rule_content_script").val(content);
    
    return content;
}

//  唯一性校验规则
function createUnique() {
    var content = "";
    var uniqueConditionJson="";
    var scriptDesc = "";
    var checkedFields = $('input:checkbox[name=column]:checked');
    var fieldValueStr = new Array(checkedFields.length);
    var fieldValueAndTypeStr = new Array(checkedFields.length);
    var fieldNameTextStr = new Array(checkedFields.length);
    
    if (checkedFields.length > 0) {
        
        checkedFields.each(function(i){
            fieldValueStr[i] = $(this).val();
            fieldValueAndTypeStr[i] = $(this).val()+"@"+$(this).attr("columntype");
            fieldNameTextStr[i] = $(this).attr("text");
        });
        
        
        scriptDesc = fieldNameTextStr.join(",") + " " + "唯一";
        
        var uniqueScriptJson = {};
        uniqueScriptJson.fields = fieldValueStr.join("|");
        uniqueScriptJson.message = scriptDesc;
        content = $.toJSON(uniqueScriptJson);
        
        var uniqueJson = {};
        uniqueJson.fields = fieldValueAndTypeStr.join("|");
        uniqueJson.message = scriptDesc;
        
        $("#rule_content_json").val($.toJSON(uniqueJson));
        $("#rule_content_script").val(content);
        $("#rule_error_hint").val(scriptDesc);
        $("#rule_description").val(scriptDesc);
        
    } else {
        throw new Error("请把值补充完整");
    }
    
    return content;
}

// 数据库查询校验规则
function createSql(isSubmit) {
    var content = "";
    var sqlJson = {};
    var sqlScriptJson = {};
    var sql = $.trim(editor.getCode());
    
    // sql 查询校验规则中不允许查询dual表,查询dual表的请尽量配置为前台校验
    if((/FROM\s+DUAL\s+/).test(sql.toUpperCase()) || (/FROM\s+DUAL$/).test(sql.toUpperCase())) {
        throw new Error("sql语句中不允许使用虚拟表dual");
    }
    
    // 为了保证效率，这里建议使用count()来进行查询，仅需要知道sql语句返回的结果条数
    if (sql.toUpperCase().indexOf("COUNT(*)") == -1) {
        throw new Error("sql语句中需使用COUNT(*)进行查询");
    }
    
    if(isSubmit) { // 保存操作
        if($.trim($("#rule_error_hint").val()) == "") {
            $("#rule_error_hint").focus();
            throw new Error("请填写错误提示");
        }
        
        if ($.trim($("#rule_description").val()) == "") {
            $("#rule_description").focus();
            throw new Error("请填写校验规则描述");
        }
    }
    
    if (sql != "") {
        
        if (!isSubmit) {  // 展示的时候仅生成错误消息，描述信息不能智能生成，需要用户手动填写
            $("#rule_error_hint").val("违反自定义sql语句规则");
        }
        
        //  去掉sql里面的\n
        sql = sql.replace(/[\r\n]/g,"");
        
        sqlScriptJson.sql = sql;
        sqlScriptJson.fields = $("#chosenField").val();
        sqlScriptJson.message = $("#rule_error_hint").val();
        content = $.toJSON(sqlScriptJson);
        
        
        sqlJson.sql = sql;
        sqlJson.fields = $("#chosenFieldHidden").val();
        sqlJson.message = $("#rule_error_hint").val();
        
        $("#rule_content_json").val($.toJSON(sqlJson));
        $("#rule_content_script").val(content);
        
    } else {
        $("#rule_sql").focus();
        throw new Error("请把值补充完整");
    }
    
    
    return content;
}

// 计算规则
function createCalculate(isSubmit) {
    var content = $.trim(editor2.mirror.getCode());
    
    if(isSubmit) { // 保存操作  
        if ($.trim($("#rule_description").val()) == "") {
            $("#rule_description").focus();
            throw new Error("请填写校验规则描述");
        }
    }
    
    var jsonObj = {};
    jsonObj.script = content;
    jsonObj.fields = $("#calculateChosenField").val();
    
    $("#rule_content_json").val($.toJSON(jsonObj));
    $("#rule_content_script").val(content);
    
    return content;
}

//生成条件内容
function getConnector(n) {
    if (n == "true") {
        return n;
    }
    var scriptContent = "";
    var scriptDesc = "";
    var fields = $("[ch='field']", "#conditionText");
    var relations = $("[ch='relations']", "#conditionText");
    var connectors = $("[ch='connector']", "#conditionText");
    var content = $("[ch='content']", "#conditionText");
    var expression = $("[ch='expression']", "#conditionText");
    
    // 值完整性校验
    for (i = 0; i < fields.length; i++) {
        /*if ($(fields[i]).val() == "" || $(relations[i]).val() == "" || $(connectors[i]).val() == "" || $(content[i]).val() == "") {
            throw new Error("请把值补充完整");
        }*/
        
        var errorMessage = "请把值补充完整";
        if ($(fields[i]).val() == "") {
            $(fields[i]).focus();
            throw new Error(errorMessage);
        } else if ($(relations[i]).val() == ""){
            $(relations[i]).focus();
            throw new Error(errorMessage);
        } else if ($(connectors[i]).val() == "") {
            $(connectors[i]).focus();
            throw new Error(errorMessage);
        } else if ($(content[i]).val() == "") {
            $(content[i]).focus();
            throw new Error(errorMessage);
        } else if ($(expression[i]).val() == "") {
            throw new Error(errorMessage);
        }
    }
    
    //  拼装校验规则脚本
    var conditionArray = serializeJsonCondition();
    var conditionJson = $.toJSON(conditionArray);
    
    if (conditionArray && conditionArray.length > 0) {
        for (var i = 0; i < conditionArray.length; i++) {
            
            // 遍历分组里面的条件，每个分组用括号括起来
            if (conditionArray.length > 1) {
                scriptContent += "(";
                scriptDesc += "(";
            }
            
            var conditions = conditionArray[i].conditions;
            var grouplogic = conditionArray[i].logic;
            for (var j = 0; j < conditions.length; j++) {
                
                // 拼装条件 conditions
                // 表达式左侧
                //scriptContent += "$(\"#" + conditions[j].colname + "\").val()";
                //var conditionColname = "$(\"#" + conditions[j].colname + "\")";
                var conditionColname = "$(\"[name='" + conditions[j].colname + "']\",$(form))";
                
                if ($("#rule_type_id").val() == "1") {
                    // 单字段校验规则
                    conditionColname = "$(\"[name='" + conditions[j].colname + "']\",$(e).parents('.record'))";
                } 
                
                //var conditionColnameSuffix = ".val()";
                var conditionColnameSuffix = getValueExpressionStr(conditions[j].colname);
                
                var conditionRelation;
                // 表达式
                var needParenthese = false;
                var type = conditions[j].coltype;
                switch(conditions[j].relation) {
                case "indexOf": // 包含
                    conditionRelation= ".contain";
                    needParenthese = true;
                    break;
                case "notIndexOf": // 不包含
                    conditionRelation= ".notContain";
                    needParenthese = true;
                    break;
                case "textIndexOf": // 文本值包含
                    //conditionColnameSuffix = ".combobox('getText')";
                    conditionColnameSuffix = getTextExpressionStr(conditions[j].colname);
                    conditionRelation= ".contain";
                    needParenthese = true;
                    break;
                case "textNotIndexOf": // 文本值不包含
                    //conditionColnameSuffix = ".combobox('getText')";
                    conditionColnameSuffix = getTextExpressionStr(conditions[j].colname);
                    conditionRelation= ".notContain";
                    needParenthese = true;
                    break;
                case "lengthLe": // 长度不大于
                    conditionRelation= ".length <= ";
                    needParenthese = false;
                    break;
                case "lengthGe": // 长度不小于
                    conditionRelation= ".length >= ";
                    needParenthese = false;
                    break;
                case "==": // 等于
                    if (type == 'TIMESTAMP' || type == 'DATE') { // 日期类型
                        conditionRelation= ".dateEq";
                        needParenthese = true;
                    } else {
                        conditionRelation= conditions[j].relation;
                    }
                    break;
                case "!=": // 不等于
                    if (type == 'TIMESTAMP' || type == 'DATE') { // 日期类型
                        conditionRelation= ".dateNeq";
                        needParenthese = true;
                    } else {
                        conditionRelation= conditions[j].relation;
                    }
                    break;
                case "<": // 小于
                    if (type == 'TIMESTAMP' || type == 'DATE') { // 日期类型
                        conditionRelation= ".dateLt";
                        needParenthese = true;
                    } else {
                        conditionRelation= conditions[j].relation;
                    }
                    break;
                case ">=": // 不小于
                    if (type == 'TIMESTAMP' || type == 'DATE') { // 日期类型
                        conditionRelation= ".dateGe";
                        needParenthese = true;
                    } else {
                        conditionRelation= conditions[j].relation;
                    }
                    break;
                case ">": // 大于
                    if (type == 'TIMESTAMP' || type == 'DATE') { // 日期类型
                        conditionRelation= ".dateGt";
                        needParenthese = true;
                    } else {
                        conditionRelation= conditions[j].relation;
                    }
                    break;
                case "<=": // 不大于
                    if (type == 'TIMESTAMP' || type == 'DATE') { // 日期类型
                        conditionRelation= ".dateLe";
                        needParenthese = true;
                    } else {
                        conditionRelation= conditions[j].relation;
                    }
                    break;
                default:
                    conditionRelation= conditions[j].relation;
                }
                
                scriptContent += (conditionColname + conditionColnameSuffix + conditionRelation);
                
                if (needParenthese) {scriptContent += "(";}
                // 表达式右侧
                var connector = conditions[j].connector;
                if (connector == "1") { // 特定值
                    if (type == "NUMBER") { // 数字类型
                        if (conditions[j].relation == "textIndexOf" || conditions[j].relation == "textNotIndexOf") { // 文本值包含
                            scriptContent += "\"" + conditions[j].content + "\"";
                        } else {
                            if (isNaN(conditions[j].content)) {
                                scriptContent += "\"" + conditions[j].content + "\"";
                            } else {
                                scriptContent += conditions[j].content;
                            }
                        }
                    } else {
                        scriptContent += "\"" + conditions[j].content + "\"";
                    }
                } else if (connector == "2") { // 字段
                    //scriptContent += "$(\"#" + conditions[j].content + "\").val()";
                    var suffix = getValueExpressionStr(conditions[j].content);
                    //scriptContent += "$(\"#" + conditions[j].content + "\")" + suffix;
                    if ($("#rule_type_id").val() == "1") {
                        // 单字段校验规则
                        scriptContent += "$(\"[name='" + conditions[j].content + "']\",$(e).parents('.record'))" + suffix;
                    } else {
                        scriptContent += "$(\"[name='" + conditions[j].content + "']\",$(form))" + suffix;
                    }
                } else if (connector == "3") { // 表达式
                    scriptContent += conditions[j].expression;
                }
                
                if (needParenthese) {scriptContent += ")";}
                
                // 描述
                scriptDesc += conditions[j].colnameDesc + " " + "应该" + conditions[j].relationDesc + conditions[j].connectorDesc + " ";
                
                if (conditions[j].contentDesc != "") {
                    scriptDesc += conditions[j].contentDesc;
                } else {
                    if (connector == 3) { // 表达式
                        scriptDesc += "【" + conditions[j].expressionDesc + "】";
                    } else {
                        scriptDesc +=  "【" + conditions[j].content + "】";
                    }
                }
                
                if (j < conditions.length - 1) {
                    if (conditions[j].logic == "and") {
                        scriptContent += " && ";
                        scriptDesc += " 并且 ";
                    } else if (conditions[j].logic == "or") {
                        scriptContent += " || ";
                        scriptDesc += " 或者 ";
                    }
                }
            }
            // 分组里面的条件遍历完成，结束分组表达式
            if (conditionArray.length > 1) {
                scriptContent += ")";
                scriptDesc += ")";
            }
            
           if (i < conditionArray.length - 1) {
               // 连接下一个分组
               if (grouplogic == "and") {
                   scriptContent += " && ";
                   scriptDesc += " 并且 ";
               } else if (grouplogic == "or") {
                   scriptContent += " || ";
                   scriptDesc += " 或者 ";
               }
           }
        }
    }
    $("#rule_content_json").val(conditionJson);
    $("#rule_error_hint").val(scriptDesc);
    $("#rule_description").val(scriptDesc);
    return scriptContent;
};