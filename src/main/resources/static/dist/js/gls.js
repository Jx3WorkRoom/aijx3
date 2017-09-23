//划词搜索
function doGLSSearch(selectedStr, status) {
	var url = null;
	if(status==1){
		//数据库中搜索
//		url = path+"/es/tableTask_query.do?keywords="+selectedStr+"&gls=1";
		url = path+"/compare/filecompare_inputContent.do?keywords="+selectedStr+"&gls=1";
	}else {
		//文档中搜索
//		url = path+"/es/documentIndex_localFileQuery.do?keywords="+selectedStr+"&gls=1";
		url = path+"/es/documentIndex_localFileQuery.do?keywords="+selectedStr+"&gls=1";
	}
	window.open(encodeURI(url), new Date().getTime(), 'width=1400, height=768, fullscreen=no, scrollbars=yes, resizable=yes, location=no');
	$("#GLSearch").css("display", "none");
}

var GLS = {};
GLS.startObj = null;
GLS.isdb = false;
GLS.allow = true;
GLS.isallow = function() {
    if (GLS.allow) {
        GLS.allow = false;
        alert('搜索已关闭');
    }
    else {
        GLS.allow = true;
        alert('搜索已打开');
    }
};
GLS.dblclick = function() {
    GLS.isdb = true;
};
GLS.mousedown = function(evt) {
    evt = (evt) ? evt : ((window.event) ? window.event : "");
    if (evt) {
        // alert(evt.target.tagName);
        GLS.startObj = (evt.target) ? evt.target : evt.srcElement;
    }
};
GLS.mouseup = function(evt) {
    var obj;
    var strlen;
    evt = (evt) ? evt : ((window.event) ? window.event : "");
    if (evt) {
        obj = (evt.target) ? evt.target : evt.srcElement;
        strlen = window.getSelection ? window.getSelection().toString() : document.selection.createRange().text;
    }
    var str = "";
    if (obj.tagName != "A" && obj.tagName != "INPUT" && obj == GLS.startObj && !GLS.isdb && GLS.allow) {
        if (strlen.length > 0) {
            str = strlen;
        }
    }
    
    GLS.search(str, evt);
    GLS.isdb = false;
};
GLS.search = function(str, evt) {
    var obj = $("#GLSearch");
    var sDivWidth = 88; //检索框“Google搜索”的宽度
    if (str.toString().length > 0) {
        var windowWidth; //窗口的宽
        //取得窗口的宽
        if (self.innerWidth) {
            windowWidth = self.innerWidth;
        } else if (document.documentElement && document.documentElement.clientWidth) {
            windowWidth = document.documentElement.clientWidth;
        } else if (document.body) {
            windowWidth = document.body.clientWidth;
        }
        obj.css({ 'display': 'block', 'position': 'absolute', 'zindex': '10000' });
        var rX, rX, wT;
        if (/msie/.test(navigator.userAgent.toLowerCase())) {
            wT = (evt.clientX + sDivWidth) - windowWidth;
            rY = document.documentElement.scrollTop + evt.clientY;
            rX = document.documentElement.scrollLeft + evt.clientX;
            rY = (evt.clientY < 55) ? (rY + 15) : (rY - 45);
            rX = (wT > 0) ? (rX - wT-100) : (rX + 15);
        }
        else {
            var sT = (document.documentElement.scrollTop > 0) ? document.documentElement.scrollTop : document.body.scrollTop;
            wT = (evt.pageX + sDivWidth) - windowWidth;
            rY = ((evt.pageY - sT) < 55) ? (evt.pageY + 5) : (evt.pageY - 45);
            rX = (wT > 0) ? (evt.pageX-wT-100) : (evt.pageX + 15);
        }
        
        obj.css("top", rY+7);
        obj.css("left", rX);
        obj.find("a:eq(0)").unbind();
        obj.find("a:eq(0)").bind("click", function() {
        	doGLSSearch(str, 1);
        });
        obj.find("a:eq(1)").unbind();
        obj.find("a:eq(1)").bind("click", function() {
        	doGLSSearch(str, 2);
        });
    }
    else {
        obj.css("display", "none");
    }
};

$(function(){
	// 添加划词搜索
    $("body").append('<div id="GLSearch" class="search_alertbox"><ul><li><a href="#"  class="underline db">划词1</a></li><li><a href="#"  class="underline doc">划词2</a></li></ul></div>');
    var downEvent=function(event){
        GLS.mousedown(event);
    };
    var dbclickEvent=function(event){
        GLS.dblclick(event);
    };
    var upEvent=function(event){
        event.stopPropagation();
        GLS.mouseup(event);
    };
    $("#showSearchResultArea, #table, .table-border, div").mousedown(downEvent).dblclick(dbclickEvent).mouseup(upEvent);
    $("body").mouseup(function(){
        $("#GLSearch").css("display", "none");
    });
});

