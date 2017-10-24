$(function () {
    initTable();
    timer();
});

function timer() {
    setInterval("timeFun()",10*60*1000)
    function timeFun() {
        initTable();
    }
}

function initTable() {
    var url = api+'index/index';
    layer.load();
    $.getJSON(url,function (data) {
        var table1Datas = data.datas1==null?"":data.datas1;
        var table2Datas = data.datas2==null?"":data.datas2;
        var table3Datas = data.datas3==null?"":data.datas3;
        var table4Datas = data.datas4==null?"":data.datas4;
        var table5Datas = data.datas5==null?"":data.datas5;
        var table6Datas = data.datas6==null?"":data.datas6;
        $("#table1").empty();
        $("#table1").append("<div class=\"table-tr tablered\">\n" +
            "        <div class=\"table-th table-th1\" style=\"width: 11% !important;padding-left: 30px;\">区服</div>\n" +
            "        <div class=\"table-th\" style=\"width: 8%\">门派体型</div>\n" +
            "        <div class=\"table-th\" style=\"width: 59%;padding-left: 34px;\">资料简介</div>\n" +
            "        <div class=\"table-th\" style=\"width: 10%\">价格(元)</div>\n" +
            "        <div class=\"table-th\" style=\"width: 12%\">关注度</div>\n" +
            "      </div>");
        $.each(table1Datas,function (i,value) {
            var follow = value.USER_FOLLOW ==null?"--":value.USER_FOLLOW;
            var belongOf = value.BELONG_QF.replace("[","");
            belongOf = belongOf.replace("]","");
            if(belongOf.length>6) {
                belongOf = replace(belongOf);
            }
            belongOf = belongOf.split(',')[0];
            var TIXIN = value.TIXIN.replace("[","");
            TIXIN = TIXIN.replace("]","");
            TIXIN = TIXIN.split(',')[0];
            var price = value.PRICE_NUM.replace("[", "");
            price = price.replace("]", "");
            price = price.split(',')[0];
            $("#table1").append("<div class=\"table-tr\">\n" +
                "        <div class=\"table-td\" style=\"width: 11% !important;\">"+belongOf+"</div>\n" +
                "        <div class=\"table-td\" style=\"width: 8%\">"+TIXIN+"</div>\n" +
                "        <div class=\"table-td table_lw\" style=\"width: 59%;padding-left: 34px;\">"+value.REPLY_CONTENT+"</div>\n" +
                "        <div class=\"table-td\" style=\"width: 10%\">"+price+"</div>\n" +
                "        <div class=\"table-td\" style=\"width:12%;\">"+follow+"</div>\n" +
                "      </div>")
        });
        $("#table2").empty();
        $("#table2").append("<div class=\"table-tr tableyellow\">\n" +
            "        <div class=\"table-th table-th1\" style=\"width: 11% !important;padding-left: 30px;\">区服</div>\n" +
            "        <div class=\"table-th\" style=\"width: 8%\">门派体型</div>\n" +
            "        <div class=\"table-th\" style=\"width: 59%;padding-left: 34px;\">资料简介</div>\n" +
            "        <div class=\"table-th\" style=\"width: 10%\">价格(元)</div>\n" +
            "        <div class=\"table-th\" style=\"width: 12%\">关注度</div>\n" +
            "      </div>");
        $.each(table2Datas,function (i,value) {
            var follow = value.USER_FOLLOW ==null?"--":value.USER_FOLLOW;
            var belongOf = value.BELONG_QF.replace("[","");
            belongOf = belongOf.replace("]","");
            belongOf = belongOf.split(',')[0];
            if(belongOf.length>6) {
                belongOf = replace(belongOf);
            }
            var TIXIN = value.TIXIN.replace("[","");
            TIXIN = TIXIN.replace("]","");
            TIXIN = TIXIN.split(',')[0];
            var price = value.PRICE_NUM.replace("[", "");
            price = price.replace("]", "");
            price = price.split(',')[0];
            $('#table2').append("<div class=\"table-tr\">\n" +
                "        <div class=\"table-td\" style=\"width: 11% !important;\">"+belongOf+"</div>\n" +
                "        <div class=\"table-td\" style=\"width: 8%\">"+TIXIN+"</div>\n" +
                "        <div class=\"table-td table_lw\" style=\"width: 59%;padding-left: 34px;\">"+value.REPLY_CONTENT+"</div>\n" +
                "        <div class=\"table-td\" style=\"width: 10%\">"+price+"</div>\n" +
                "        <div class=\"table-td\" style=\"width:12%;\">"+follow+"</div>\n" +
                "      </div>");
        });
        $("#table3").empty();
        $("#table3").append("<div class=\"table-tr tablec1\">\n" +
            "        <div class=\"table-th\" style=\"width: 25% !important\">区服</div>\n" +
            "        <div class=\"table-th\" style=\"width: 20%\">外观</div>\n" +
            "        <div class=\"table-th\" style=\"width: 25%;\">价格(元)</div>\n" +
            "        <div class=\"table-th\" style=\"width: 30%;\">关注度</div>\n" +
            "      </div>" +
            "      </div>");
        $.each(table3Datas,function (i,value) {
            var follow = value.USER_FOLLOW ==null?"--":value.USER_FOLLOW;
            var tixin = value.VIEW_NAME ==null?'--':value.VIEW_NAME;
            tixin = tixin.replace("[","");
            tixin = tixin.replace("]","");
            tixin = tixin.split(',')[0];
            var price = value.PRICE_NUM ==null?'--':value.PRICE_NUM;
            var belongOf = value.BELONG_QF.replace("[","");
            belongOf = belongOf.replace("]","");
            belongOf = belongOf.split(',')[0];
            if(belongOf.length>6) {
                belongOf = replace(belongOf);
            }
            $('#table3').append("<div class=\"table-tr\">\n" +
                "        <div class=\"table-td\" style=\"width: 25% !important\">"+belongOf+"</div>\n" +
                "        <div class=\"table-td\" style=\"width: 20%\">"+tixin+"</div>\n" +
                "        <div class=\"table-td\" style=\"width: 25%;\">"+price+"</div>\n" +
                "        <div class=\"table-td\" style=\"width: 30%\">"+follow+"</div>\n" +
                "      </div>");
        });
        $("#table4").empty();
        $("#table4").append("<div class=\"table-tr tablec1\">\n" +
            "        <div class=\"table-th\" style=\"width: 25% !important\">区服</div>\n" +
            "        <div class=\"table-th\" style=\"width: 20%\">外观</div>\n" +
            "        <div class=\"table-th\" style=\"width: 25%;\">价格(元)</div>\n" +
            "        <div class=\"table-th\" style=\"width: 30%;\">关注度</div>\n" +
            "      </div>" +
            "      </div>");
        $.each(table4Datas,function (i,value) {
            var follow = value.USER_FOLLOW ==null?"--":value.USER_FOLLOW;
            var tixin = value.VIEW_NAME ==null?'--':value.VIEW_NAME;
            var price = value.PRICE_NUM ==null?'--':value.PRICE_NUM;
            tixin = tixin.replace("[","");
            tixin = tixin.replace("]","");
            tixin = tixin.split(',')[0];
            var belongOf = value.BELONG_QF.replace("[","");
            belongOf = belongOf.replace("]","");
            belongOf = belongOf.split(',')[0];
            if(belongOf.length>6) {
                belongOf = replace(belongOf);
            }
            $('#table4').append("<div class=\"table-tr\">\n" +
                "        <div class=\"table-td\" style=\"width: 25% !important;\">"+belongOf+"</div>\n" +
                "        <div class=\"table-td\" style=\"width: 20%\">"+tixin+"</div>\n" +
                "        <div class=\"table-td\" style=\"width: 25%\">"+price+"</div>\n" +
                "        <div class=\"table-td\" style=\"width:30%;\">"+follow+"</div>\n" +
                "      </div>");
        });
        $("#table5").empty();
        $("#table5").append("<div class=\"table-tr tablec3\">\n" +
            "            <div class=\"table-th\" style=\"width: 25% !important\">区服</div>\n" +
            "            <div class=\"table-th\" style=\"width: 20%\">道具</div>\n" +
            "            <div class=\"table-th\" style=\"width: 25%;\">价格(元)</div>\n" +
            "            <div class=\"table-th\" style=\"width: 30%;\">关注度</div>\n" +
            "          </div>");
        $.each(table5Datas,function (i,value) {
            var follow = value.USER_FOLLOW ==null?"--":value.USER_FOLLOW;
            var propName = value.PROP_NAME==null?"--":value.PROP_NAME;
            propName = propName.replace("[","");
            propName = propName.replace("]","");
            propName = propName.split(',')[0];
            var belongOf = value.BELONG_QF.replace("[","");
            belongOf = belongOf.replace("]","");
            belongOf = belongOf.split(',')[0];
            if(belongOf.length>6) {
                belongOf = replace(belongOf);
            }
            $('#table5').append("<div class=\"table-tr\">\n" +
                "            <div class=\"table-td\" style=\"width: 25% !important\">"+belongOf+"</div>\n" +
                "            <div class=\"table-td\" style=\"width: 20%\">"+propName+"</div>\n" +
                "            <div class=\"table-td\" style=\"width: 25%;\">"+value.PRICE_NUM+"</div>\n" +
                "            <div class=\"table-td\" style=\"width: 30%\">"+follow+"</div>\n" +
                "          </div>");
        });
        $("#table6").empty();
        $("#table6").append("<div class=\"table-tr tablec3\">\n" +
            "            <div class=\"table-th\" style=\"width: 25% !important\">区服</div>\n" +
            "            <div class=\"table-th\" style=\"width: 20%\">道具</div>\n" +
            "            <div class=\"table-th\" style=\"width: 25%;\">价格(元)</div>\n" +
            "            <div class=\"table-th\" style=\"width: 30%;\">关注度</div>\n" +
            "          </div>");
        $.each(table6Datas,function (i,value) {
            var follow = value.USER_FOLLOW ==null?"--":value.USER_FOLLOW;
            var propName = value.PROP_NAME==null?"--":value.PROP_NAME;
            propName = propName.replace("[","");
            propName = propName.replace("]","");
            propName = propName.split(',')[0];
            var belongOf = value.BELONG_QF.replace("[","");
            belongOf = belongOf.replace("]","");
            belongOf = belongOf.split(',')[0];
            if(belongOf.length>6) {
                belongOf = replace(belongOf);
            }
            $('#table6').append("<div class=\"table-tr\">\n" +
                "            <div class=\"table-td\" style=\"width: 25% !important\">"+belongOf+"</div>\n" +
                "            <div class=\"table-td\" style=\"width: 20%\">"+propName+"</div>\n" +
                "            <div class=\"table-td\" style=\"width: 25%;\">"+value.PRICE_NUM+"</div>\n" +
                "            <div class=\"table-td\" style=\"width: 30%\">"+follow+"</div>\n" +
                "          </div>");
        });
    }).error(function (e) {
        layer.msg("数据请求失败!")
    }).complete(function (e) {
        layer.closeAll();
    });
    function replace(str){
        str = str.replace("电月","");
        str = str.replace("电点","");
        str = str.replace("网点","");
        str = str.replace("网月","");
        str = str.replace("双点","");
        str = str.replace("双月","");
        return str;
    }
}
