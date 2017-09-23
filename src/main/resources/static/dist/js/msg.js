/**
 * Created with IntelliJ IDEA.
 * To change this template use File | Settings | File Templates.
 */

//home页消息回调函数
function showHomeMessage(json) { //console.dir(json);
    $("span.menu1").removeClass("msg_num").html("");
    $("span.menu2").html("");
    var menu, childMenu;
    var childList;
    for (var i = 0; i < json.length; i++) {
        menu = json[i];
        childList = menu["childList"];
        $("#" + menu["id"]).html(menu["count"]).addClass("msg_num");
        if (childList != null && childList != "") {
            for (var j = 0; j < childList.length; j++) {
                childMenu = childList[j];
                $("#" + childMenu["id"]).html("（<span class='red'>" + childMenu["count"] + "</span>）");
            }
        }
    }
}

function ellipsis(str, len) {
    if (str == null) return "";
    if (str == "") return "";
    if (str.length <= len) return str;
    if (str.length > len) return str.substring(0, len) + "...";
}


function showModuleMessage(json) {
    if(json.length==0){
        $("#content").html("");
        $(".msgbox").hide();
        $(".msgbox_mini").show();
        $("#imgTip1,#imgTip2").css("display","none");
    }
    else{
        var html = "";
        var msgKind,msgList,msgInfo;
        for(var i=0;i<json.length;i++){
            msgKind = json[i];
            html += "<div class='msgbox_title'>" + msgKind["sm_title"] + "</div>";
            html += "<div class='msgbox_list'>";
            html += "<a href=\"javascript:runLink('"+msgKind.sm_statenote+"','" + msgKind.sm_action + "')\">你有<span style='color:red'>(" + 1 + ")</span>条" + msgKind.sm_modelnote + "" + msgKind.sm_statenote + "</a>";
            html += "<div class='msgbox_list'>";
        }
        $("#content").html(html);
        $(".msgbox").show();
        $(".msgbox_mini").hide();
        $("#imgTip1,#imgTip2").css("display","block");
    }
}


//各模块消息回调函数
function showModuleMessage_old(json) {
    //console.info($.toJSON(json));
    $("#msg_table").html("");
    var data, html = "";
    for (var i = 0; i < json.length; i++) {
        data = json[i];
        html += "<tr>";
        html += "   <td class=\"msg_td\">";
        html += "       <div class=\"msg_left\">";
        html += "           <a href=\"#\" onclick=\"actionMessage('" + data.sm_action + "', '" + data.sm_type + "', '" + data.sm_id + "')\" title=" + data.sm_title + " >" + ellipsis(data.sm_title, 15) + "</a>&nbsp;的";
        html += "           <span class=\"green\">" + data.sm_modelnote + "</span><br />";
        html += "           <span class=\"red\">" + data.sm_statenote + "</span>";
        html += "       </div>";
        if (data.sm_type == 0 || data.sm_type == "0") {
            html += "       <a href=\"###\" onclick=\"deleteMessage('" + data.sm_id + "')\" class=\"msg_clear fright mt8 mr10\"></a>";
        }
        html += "   </td>";
        html += "</tr>";
    }
    $("#msg_table").append(html);
}

//删除消息
function deleteMessage(sm_id) {
    $.ajaxPost(path + "/sys/message_delete.do", {"sm_id": sm_id}, function (result) {
        if (result != "") {
        }
    });
}

//通过消息超链接至相应的页面
function actionMessage(sm_action, sm_type, sm_id) {
    if (sm_type == 0 || sm_type == "0") {//提示类消息，直接删除
        deleteMessage(sm_id);
    }
}
