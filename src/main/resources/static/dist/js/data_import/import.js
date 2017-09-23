jQuery(function(){
	//sel = $("#impSel");		//表头配置下拉列表
	texxtarea = $("#impTextarea");	//文本框
	tab = $("#impTab");		//表格
});

//添加表头点击事件
function addSelChg(tabT){
	
	tabT.find("thead select").on('change',function(event){
	    var ary = [];
	    $("#impTab thead select").each(function(index,element){
	        $(element).css("border","");
	        if ($(element).val() != "") {
	            ary.push($(element).val());
	        }
	    });
	    var nary=ary.sort(); 
	    for(var i = 0; i < (ary.length-1); i++){  
	        if (nary[i]==nary[i+1]) {  
	            $("#impTab thead select").find("option:selected[value=" + nary[i] + "]").parent().css("border", "1px red dashed");
	        }  
	   } 
	});
}

function selChg(tabT){
	
	//remove
	tabT.find("thead select option").not("[value='']").not(":selected").remove();
	
	//add
	var selObjT = $("#tempSel").clone();
	
	tabT.find("thead select").each(function(i, selObj){
		
		if(selObj.value != "")
			selObjT.children("[value='"+selObj.value+"']").remove();
	})
	
	tabT.find("thead select").append(selObjT.html());
}


//生成临时表头下拉列表
function createTempSel(arr){

	//清空临时表头下拉列表
	$("#tempSel").html("");
	
	//生成临时表头下拉列表
	$(arr).each(function(i,n){
		 
		$("#fieldSel option").each(function(j,m){
			if(n==$(m).text()){
				$("#tempSel").append($(m).clone());
				return false;
			}
		})
	})
}


//标准化
function normativeness(texxtareaT, tabT, f){
	var textStr = $.trim(texxtareaT.val());
	
	//文本框为空时返回
	if(textStr == '')
		return;
	
	//将文本框内容转换成数组
	var arr = areaToArr(textStr);
	
	//数组最大行数
	var arrMaxRowNum = arr.length;
	
	//数组最大列数
	var arrMaxColumnNum = 0;
	$(arr).each(function(i, n){
		if(n.length>arrMaxColumnNum)
			arrMaxColumnNum = n.length;
	})
	
	var maxRowNum = arrMaxRowNum;
	var maxColumnNum = arrMaxColumnNum;
	
	//是否纵转横
	var arrT = new Array();
	if($("#statusCheck").is(':checked')){
		maxRowNum = arrMaxColumnNum;
		maxColumnNum = arrMaxRowNum;
		
		for ( var rowIdx = 0; rowIdx < maxRowNum; rowIdx++) {
			arrT[rowIdx] = new Array(maxColumnNum);
		}
		
		$(arr).each(function(arrRowIdx, arrRow){
			
			$(arrRow).each(function(arrColIdx, arrCol){
				arrT[arrColIdx][arrRowIdx] = arrCol;
			})
		})
		
	}else{
		
		$(arr).each(function(arrRowIdx, arrRow){
			arrT[arrRowIdx] = new Array(maxColumnNum);
			
			$(arrRow).each(function(arrColIdx, arrCol){
				arrT[arrRowIdx][arrColIdx] = arrCol;
			})
		})
	}
	
	//if((($("[name='formulaType']:checked").val()==1 && $("isHead").attr("checked"))?(maxRowNum-1): maxRowNum)<1 || maxColumnNum<1)
		//return;
	
	
	//清空表格，创建表格框架
	tabT.html("<thead><tr></tr></thead><tbody></tbody>");
	
	if(f)
		f(maxColumnNum);
	
	/******表头******/
	if($("[name='formulaType']:checked").val()==1){	//文本导入规则
		
		//表头带入
		if($("#isHead").prop("checked")){
			createTempSel(arrT[0]);
			
			for ( var colIdx = 0; colIdx < maxColumnNum; colIdx++) {
				tabT.find("thead tr").append("<th><select class='txtSel'><option value=''>无效列</option>"+$("#tempSel").html()+"</select></th>");
			}
			
			$(arrT[0]).each(function(i,n){
				tabT.find("thead tr select:eq("+i+") option[innerText='"+n+"']").attr("selected","selected");
			})
			
			arrT.shift();
		}else{
			//清空临时表头下拉列表
			$("#tempSel").html("");
			
			var arrv = $("#impSel").val().split(",");
			var arrt = $("#impSel").find("option:selected").text().split(" ");
		
			$(arrv).each(function(i,n){
				$("#tempSel").append("<option value="+n+">"+ arrt[i] +"</option>");
			})
			
			for ( var colIdx = 0; colIdx < maxColumnNum; colIdx++) {
			    if (!f) { // 通用导入
			        tabT.find("thead tr").append("<th><select class='txtSel'><option value=''>无效列</option>"+$("#fieldSel").html()+"</select></th>");
			    } else { // 财务导入
			        tabT.find("thead tr").append("<th><select class='txtSel'><option value=''>无效列</option>"+$("#tempSel").html()+"</select></th>");
			    }
				
			}
			
			tabT.find("th select").each(function(i,n){
				
				if(i < $("#tempSel option").length) {
				    var field_name_en = $("#tempSel").find("option:eq("+(i)+")").val();
				    $(n).find("option[value="+field_name_en+"]").attr("selected","selected");
				}
			});
			
		}
		
		if (f) { // 财务导入
		    selChg(tabT);
		}
		
		if(tabT.find("thead tr select").length != maxColumnNum)
			$("legend span").text("数据异常，请检查！");
		
	}else{											//EXCELL导入规则
		
		tabT.find("thead tr th").each(function(i,n){
			$(this).append("<select class='excelSel'><option value='colu"+i+"'>有效列</option><option value=''>无效列</option></select>");
		})
		
	}
	
	//添加事件
	addSelChg(tabT);
	
	/******表体******/
	var strTbody = "";
	for ( var colIdx = 0; colIdx < maxColumnNum; colIdx++) {
		strTbody = strTbody + "<td><input type='text' /></td>";
	}
	
	$(arrT).each(function(rowIdx, row){
		//if(rowIdx==0)
			//return;
		
		tabT.find("tbody").append("<tr>"+strTbody+"</tr>");
		
		$(row).each(function(colIdx, column){
			
			column=$.trim(column);
			
			//将*替换成空
			if(column=="*"||column=="--"||column=="-"||column=="/")
				column="";
			
			tabT.find("tbody tr:last td:eq("+colIdx+") input").val(column);
		})
	})
	
	//排版
	composingContent(arr);
}

//将文本框的内容填充到数组
function areaToArr(){
	//将一个或多个空格替换成一个空格
	var v = replBlank(texxtarea.val());
	
	//填充行数组
	var arrR = v.split("\n");
	
	//删除空行
	arrR = $.grep(arrR, function(v){
	  return $.trim(v) == "";
	},true);
	
	/*try{
		//排版文字的方法，如果报错则按原来的处理
		composingContent(arrR);
	}catch(exception){
		//按照以前的方法
			//去掉每行的首尾空格
		    texxtarea.val("");
			$(arrR).each(function(i){
				texxtarea.val(texxtarea.val()+(texxtarea.val()==""?"":"\n")+$.trim(this));
			})
	}finally{
			var arr = new Array();
			$(arrR).each(function(i, n){
				arr[i] = $.trim(n).split(" ");
			})
		
			return arr;
	}*/
	
	
	//去掉每行的首尾空格
	texxtarea.val("");
	$(arrR).each(function(i){
		texxtarea.val(texxtarea.val()+(texxtarea.val()==""?"":"\n")+$.trim(this))
	})
	
	
	//填充单元格数组
	/*var arr = new Array()
	$(arrR).each(function(i, n){
		arr[i] = $.trim(n).split(" ");
	})*/
	
	//填充单元格数组
	var arr = new Array()
	$(arrR).each(function(i, r){
		if(r == " ")
			return;
			
		arr[i] = new Array();
		if($("#englishCheck").prop("checked")){
			
			var arrT = $.trim(r).split(" ");
			
			
			//将英语单词存入数组中
			var engArr = new Array();
			var idx = 0;
			$(arrT).each(function(j,m){				
				
				
				if(j!=0){
					var n = arrT[j-idx-1];

					if(checkEnglish(n) && checkEnglish(m)){
						
						arrT[j-idx-1] = n + " " + m;
						arrT.splice(j-idx,1);
						idx++;  
					}
				}
			})
			
			arr[i] = arrT;
		}else{
			arr[i] = $.trim(r).split(" ");
		}
		
	})
	
	return arr;
	
}

//将文本框的内容填充到数组
function areaToArr1(val){
	//将一个或多个空格替换成一个空格
	var v = val.replace(/[" "\t]+/g , " ");
	
	//填充行数组
	var arrR = v.split("\n");
	
	//删除空行
	$(arrR).each(function(i){
		if($.trim(this) == "")
			arrR.splice(i,1);
	})
	
	return arrR;
}

function checkSave(){
    var records = [];
    var record = {};
    
    // 检查是否有重复列
    var ary = []; 
    $("#actionf table thead th").each(function(index,element){
        if ($("select",element).val() != "") {
            ary.push($("select",element).val()); 
        }
    });
    
    var nary=ary.sort(); 
    for(var i = 0; i < (ary.length-1); i++){  
        if (nary[i]==nary[i+1]) {  
            try {
                $.messager.alert("系统提示", "包含重复列！", "info");
            } catch(e) {
                alert("包含重复列！");
            }
            return false;
        }  
   }
    
    // 数据量大时需要锁定页面
    try {
        $.showLoad2();
    } catch(e){
    }
    
    //迭代字段配置列表
    $("#actionf table").each(function(){
        var tabObj = $(this);
        records = [];
        tabObj.find("tbody tr").each(function(){
            var trObj = $(this);
            record = {};
            tabObj.find("thead select.txtSel[value!=''][value!='-WXL-']").each(function(i,n){
                var tdo = $(this).parents("th:first");
                //trObj.find("td:eq("+tdo.prop("cellIndex")+") input").attr("name", this.value+"@"+rowIdx);
                
                var value = trObj.find("td:eq("+tdo.prop("cellIndex")+") input").val();
                eval("record['"+this.value+"']=value");
            });
            records.push(record);
        });
    });
    
    var json = $.toJSON(records);
    $("input[name='recordJson']",$("#actionf")).val(json);
    
    $("#actionf").submit();
}

function checkSave1(){
	var fieldNameVal = $.trim($("#fieldName").val());
	
	
	if(fieldNameVal==""){
		alert("请选择字段");
		return false;
	}
	
	
	// 清空非法主键样式
	$("#actionf table tbody th.error").removeClass("error");
	
	// 将每行披露名存到数组
	var arr = new Array();
	$("#actionf table thead th select").each(function(i) {
		if(this.value=='alias_name'){
			$("#actionf table tbody td[cellIndex="+i+"] input").each(function(j){
				arr[j] = new Array();
				arr[j][0] = j;
				arr[j][1] = this.value;
			})
		}
	})
	
	// 检查本页重复记录，并且标识
	var arr1 = arr;
	var str = '';
	var bl = true;
	$(arr).each(function(i, n) {
		// 获得与当前元素相同的元素数组
		var t = $.grep(arr1, function(v) {
			return v[1] == n[1];
		})

		// 删除与当前元素相同的元素
		arr1 = $.grep(arr1, function(v) {
			return v[1] == n[1];
		}, true)

		
		if (t.length > 1){
			bl = false;
			
			$(t).each(
					function() {
						$("#actionf table tr:eq(" + (this[0]+1)+ ") td").addClass("error");
						str = str + (this[0]+1) + ",";
					});
			str = str + "\n";
		}
	})

	if (!bl) 
		alert("本页有以下重复主键：\n" + str);
	else{
		
		// 主键字段值
		var pkValueStr = '';
		$(arr).each(function() {
			pkValueStr = pkValueStr + this[1] + ";";
		})
		
		$.post($("base").attr("href") + "servlet/alias/ImpAliasCheckPkServlet", {
			tableId : $("#tabId").val(),
			fieldName : $("#fieldName").val(),
			v : pkValueStr
		}, function(data) {
			data = $.trim(data);
			
			if (data == ''){
				alert("与数据库中主键重复的记录为：\n无");
					
			}else {
				// 改变重复记录样式
				var arrT = data.split(",");
				$(arrT).each(
					function() {
						if (this != ''){
							$("#actionf table tr:eq("+(Number(this) + 1)+") td").addClass("error");
						}
					})
						
				var arrT = data.split(",");
				var str = '';
				$(arrT).each(function() {
					if (this != '')
						str = str + (Number(this) + 1) + "、";
				})
				alert("与数据库中主键重复的记录为：\n" + str);
				
				bl = false;
			}
			
			if(bl){
				$("#actionf table thead th select").each(function(i,n){
					$("#actionf table tbody td[cellIndex="+i+"] input").attr("name", n.value);
				})	
				
				$("#actionf").submit();
			}
			
		});
	}
	
}

//分隔中英文
//TODO 除第一行外的其他行前面多了一个空格
function splitCE(){
	//取得textarea的值
	var val = texxtarea.val();
	var str = '';
	
	//迭代字符串中的每个字符
	for (var i=0; i<val.length; i++) {  
	   //当前字符UNICODE编码
	   var c = val.charAt(i);  
	   //下个字符UNICODE编码
	   var n = val.charAt(i+1);
	   
	   //如果为中文
	   if(checkChinese(c) == checkChinese(n))
		   str = str + c;
	   else
		   str = str + c + ' ';
	}  
	
	texxtarea.val(str);
}


//清空中文中的空格
function clearBlank(){
	
	if($.trim(texxtarea.val()) == '')
		return;
	
	var arr = areaToArr();
	
	var newArr = new Array();
	
	$(arr).each(function(ri,r){
		
		
		var rowArr = new Array();
		
		
		for ( var ci = 0; ci < r.length; ci++) {
			
			var c = r[ci];
			var cc = c.charAt(0);	
			
			var t = rowArr[rowArr.length-1];
			
			if(rowArr.length>0&&checkChinese(t.charAt(t.length-1))&&checkChinese(cc))
				rowArr[rowArr.length-1] = t+c;
			else
				rowArr.push(c);
			
		}
		
		newArr.push(rowArr);
		
	})
	
	composingContent(newArr);
}



//是否为中文
function checkChinese(c){
	return /^[\u0391-\uFFE5]+$/.test(c);
}

//是否为英文
function checkEnglish(val){
	if(val=="-"||val=="--"){
		return false;
	}
	var bl = true;
	for (var i=0; i<val.length; i++) {  
		   var c = val.charAt(i);  
		   if(!/^[_a-zA-Z]| |-|\.|'|\,|\(|\)|&$/.test(c)){
			   bl = false;
			   break;
		   }
	}
	return bl;
}

//替换
function rep(){
	//取得textarea的值
	var val = texxtarea.val();
	
	texxtarea.val(val.replace(new RegExp($("#r1").val(), "gi"), $("#r2").val()));
}

//横向追加
function normativeness1(){
	//创建新表格框架
	var tableNum = $("#actionf table").length;
	tab.after("<table id='impTab"+tableNum+"'></table>");
	
	normativeness($('#impTextarea'), $('#impTab'+tableNum));
}

//选择表头
function selHead(){
	
	$("#impSel").find("option:eq(1)").attr("selected", "selected");
} 

//添加表头到文本框
function addTHeadToTextarea(){
	if($("#impSel").val()=="")
		return;
	
	if($("#statusCheck").prop("checked")){
		//表头
		var arrT = $("#impSel").children(":selected").text().split(" ");
		for ( var i = 0; i < arrT.length; i++) {
			if(arrT[i]==""){
				arrT.splice(i,1);
				i++;
			}
		}
		
		
		//将文本框内容转换成数组
		var arr = areaToArr($("#impTextarea").val());
		$(arr).each(function(i,n){
			
			if(typeof arrT[i] != 'undefined')
				n.unshift(arrT[i]);
		})
		
		var str="";
		$(arr).each(function(i,n){
			
			$(n).each(function(j,m){
				if(j!=0){
					str=str+" ";
				}
				
				str = str + m;
			})
			
			str = str + "\n";
		})
		
		texxtarea.val(str);
		
	}else
		texxtarea.val($("#impSel").children(":selected").text()+"\n"+texxtarea.val())
}

//获取字符串字节长度，汉字算2个
function getNewLen(str){
	 return str.replace(/[^\x00-\xff]/g, "xx").length; 
}

//排版导入文字
function composingContent(arr){
	var contentStr = ""; 
	
	var newArr = new Array();
	
	var maxcol ="";
	
	$(arr).each(function(i,r){
		
		//a = $.trim(a);
		//a = meizz(a);
		//var re2 = /\s/;
		//newArr[i] = new Array();
		//newArr[i] = a.split(re2);
		newArr[i] = r;
		
		//记录最大的列数
		if(i==0){
			maxcol = newArr[i].length;
		}else{
			maxcol = newArr[i].length> maxcol?newArr[i].length:maxcol;
		}
		
	})
	
	
	var lenArr=new Array();
	
	//第一列为名称,单独处理,按左对齐
	
	
	for(var i=1;i<newArr.length;i++){
		var lastlen;
		var nowlen;
		if(i==1){
			lastlen = getNewLen(newArr[i-1][0]);
			nowlen = getNewLen(newArr[i][0])
			lenArr[0] = lastlen>nowlen? lastlen:nowlen;
		}else{
			lastlen = lenArr[0];
			nowlen = getNewLen(newArr[i][0]);
			lenArr[0] = (nowlen > lastlen )  ? nowlen : lastlen;
		}
		
		
	}
	
	for(var i=0;i<newArr.length;i++){
		 var blankstr = "";
		 var templen = getNewLen(newArr[i][0]);
		 if(lenArr[0]>templen){
		 	
		 	for(var ii=0;ii<(lenArr[0]-templen)*1.5;ii++){
			 		blankstr = blankstr+" ";
			}
			
			newArr[i][0]=newArr[i][0]+blankstr+"\t";
			
		 }else{
		 			newArr[i][0]=newArr[i][0]+"\t";
		 		
		 }
	}
	
	//从第2列往后都按数字右对齐处理
	
	for(var j=1;j<maxcol;j++){
		
		for(var i=1;i<newArr.length;i++){
			
				if(i==1){
					if(newArr[i-1][j]&&newArr[i][j]){
						lenArr[j] = getNewLen(newArr[i-1][j])>getNewLen(newArr[i][j])?getNewLen(newArr[i-1][j]):getNewLen(newArr[i][j]);
					}else{
						if(newArr[i-1][j]){
							lenArr[j] = getNewLen(newArr[i-1][j]);
						}
						if(newArr[i][j]){
							lenArr[j] = getNewLen(newArr[i][j]);
						}
					}
					
				}else{
					var lastlen = lenArr[j];
					var nowlen = 0;
					
					if(newArr[i][j]){
						var nowlen = getNewLen(newArr[i][j]);
					}
					
			
					lenArr[j] = nowlen > lastlen  ? nowlen : lastlen;
				}
		}
	}
	
	for(var i=0;i<newArr.length;i++){
		
		
		for(var j=1;j<maxcol;j++){
			
			 var blankstr = "";
			 var templen = 0;
			 if(newArr[i][j]){
			 	templen = getNewLen(newArr[i][j]);
			 }
			 
			 
			 
			 if(templen < lenArr[j]){
			 	for(var ii=0;ii<(lenArr[j]-templen)*1.5;ii++){
				 		blankstr = blankstr+" ";
				 }
			 	if(newArr[i][j]){
			 			newArr[i][j]=newArr[i][j]+blankstr+"\t\t";
			 	}
			 	
			 }else{
			 	if(newArr[i][j]){
			 		newArr[i][j]=newArr[i][j]+"\t\t";
			 	}
			 }
			
		}
		 
	}
	
	$(newArr).each(function(i){
		var arrStr = newArr[i].join(" ");
		contentStr = contentStr+arrStr+"\n";
	})
	
	texxtarea.val("");
	texxtarea.val(contentStr);
}

//将一个或多个空格替换成一个空格
replBlank  =  function(val) {	
	//将全角空格替换成半角空格
	val = val.replace(/[\u3000]/g," "); 
	
	//将多个空格替换成一个空格
	val= val.replace(/[ \t]+/g , " ");	//将多个空格替换成一个空格
	return val;
}

