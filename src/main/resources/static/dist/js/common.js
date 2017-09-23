function getTotalHeight() { //获取网页可见区域高度
//	if ($.browser.msie) {
	if (/msie/.test(navigator.userAgent.toLowerCase())) {
		return document.compatMode == "CSS1Compat" ? document.documentElement.offsetHeight : document.body.offsetHeight;
	} else {
		return self.innerHeight;
	}
}

function getTotalWidth() {  //获取网页可见区域宽度
	if (/msie/.test(navigator.userAgent.toLowerCase())) {
		return document.compatMode == "CSS1Compat" ? document.documentElement.scrollWidth : document.body.scrollWidth;
	} else {
		return self.innerWidth;
	}
}

// 创建快捷方式（不安全）
function toDesktop(sUrl,sName){ 
	try{ 
		var WshShell = new ActiveXObject("WScript.Shell"); 
		var oUrlLink = WshShell.CreateShortcut(WshShell.SpecialFolders("Desktop") + "\\" + sName + ".url"); 
		oUrlLink.TargetPath = sUrl; 
		oUrlLink.Save(); 
	}catch(e){ 
		alert("当前IE安全级别不允许操作！"); 
		} 
}

// 添加到收藏夹
function addfavorite(sUrl,sName){
   if (document.all){
      window.external.addFavorite(sUrl,sName);
   }else if (window.sidebar){
      window.sidebar.addPanel(sName, sUrl, "");
   }
}

// 设为首页
function setHome(url) {
	if (document.all){ 
		document.body.style.behavior='url(#default#homepage)'; 
		document.body.setHomePage(url); 
	}else if (window.sidebar){ 
		if(window.netscape){ 
			try{ 
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect"); 
			}catch (e){ 
				alert( "该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true" ); 
			} 
		} 
		if(window.confirm("你确定要设置"+url+"为首页吗？")==1){ 
			var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch); 
			prefs.setCharPref('browser.startup.homepage',url); 
		} 
	} 
}

//根据表达式的值，返回字段的数据类型
function getColumnTypeByExpression(v) {
	var value = v.toLocaleUpperCase();
	if ($.inArray(value, ["CURDATE()"]) > -1) {
		return "date";
	}
	if ($.inArray(value, ["NOW()"]) > -1) {
		return "timestamp";
	}
	try {
		if ($.inArray(value.split("(")[0], ["ABS", "SQRT"]) > -1) {
			return "number";
		}
	} catch (e) {
	}
	return "varchar";
}