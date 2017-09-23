//------------------------------------常量定义 Start------------------------------------
    reportApi = api+"iwantRelease/";
    pageApi = api+"accountList/";

    //设置一个省的公共下标
    var pIndex = 0;
    var preEle = document.getElementById("pre");
    var cityEle = document.getElementById("city");
    var areaEle = document.getElementById("area");
    var clickSeachNum = 0;
    var userId = null;

    $(function () {
        var username = $('#userName').text();
        $('.last').text(username);
        initTable(username);
        initForm();    //初始化Form
    });
//------------------------------------常量定义 Start------------------------------------

//------------------------------------填充区域选择框 Start------------------------------------
    function Dsy()
    {
        this.Items = {};
    }
    Dsy.prototype.add = function(id,iArray)
    {
        this.Items[id] = iArray;
    };
    Dsy.prototype.Exists = function(id)
    {
        if(typeof(this.Items[id]) == "undefined") return false;
        return true;
    };
        function change(v){
            var str="0";
            for(i=0;i <v;i++){ str+=("_"+(document.getElementById(s[i]).selectedIndex-1));};
            var ss=document.getElementById(s[v]);
            with(ss){
                length = 0;
                options[0]=new Option(opt0[v],opt0[v]);
                if(v && document.getElementById(s[v-1]).selectedIndex>0 || !v)
                {
                    if(dsy.Exists(str)){
                        ar = dsy.Items[str];
                        for(i=0;i <ar.length;i++)options[length]=new Option(ar[i],ar[i]);
                        if(v)options[1].selected = true;
                    }
                }
                if(++v <s.length){change(v);}
            }
        }
    var dsy = new Dsy();
    var s=["s1","s2","s3"];
    var opt0 = ["请选择","请选择","请选择"];
    //一级连动
    function setup()
    {
        for(i=0;i <s.length-1;i++)
            document.getElementById(s[i]).onchange=new Function("change("+(i+1)+")");
        change(0);
    }
    var pres = null;
    var cities = null;
    var area = null;
    //二级连动
    function chg(obj) {
        if (obj.value == -1) {
            cityEle.options.length = 0;
            areaEle.options.length = 0;
        }
        //获取值
        var val = obj.value;
        pIndex = parseInt(obj.value)+1;
        //获取ctiry
        var cs = cities[val];
        //获取默认区
        var as = areas[val][0];
        //先清空市
        if(cityEle==null){
            cityEle = document.getElementById("city");
        }
        cityEle.options.length = 0;
        if(areaEle==null){
            areaEle = document.getElementById("area");
        }
        areaEle.options.length = 0;
        for (var i = 0; i < cs.length; i++) {
            var op = new Option(cs[i], i);
            cityEle.options.add(op);
        }
        for (var i = 0; i < as.length; i++) {
            var op = new Option(as[i], i);
            areaEle.options.add(op);
        }
    }
    //三级连动
    function chg2(obj) {
        var val = obj.selectedIndex;
        // var as = areas[pIndex][val];
        var aIndex = obj.value;
        if(parseInt(pIndex-1)>0) {
            for(var i=0;i<parseInt(pIndex-1);i++) {
                aIndex =  parseInt(aIndex)+cities[i].length;
            }
        }
        var as = areas[aIndex];
        areaEle.options.length = 0;
        if(val!=0) {
            for (var i = 0; i < as.length; i++) {
                var op = new Option(as[i], i);
                areaEle.options.add(op);
            }
        }
    }
//------------------------------------填充区域选择框 End------------------------------------

//------------------------------------Function定义 Start------------------------------------
    //保存
    function saveTable(url,keyNum) {
        //信息框
        layer.msg('金币交易发布成功！');
        setTimeout(function () { save(); }, 2000);

        function save() {
            $.ajax({
                url: url,
                async: false,
                success: function (data) {
                    layer.closeAll();
                    //跳转
                    window.location.href = "/testDemo/myRelease.html";
                },
                complete: function () {
                    layer.closeAll();
                    //layer.msg("保存出错!")
                },
                error: function () {
                    layer.closeAll();
                    layer.msg("数据请求失败!")
                }

            });
        }
    }

    function initTable(username) {
        var url = api+'dataAndSecurity/getUserInfo?userName='+encodeURI(username);

        $.getJSON(url,function (data) {
            data=data.datas[0]==null?'':data.datas[0];
            if(data!=''){
                userId = data.USER_ID;
            }else{
                layer.msg("加载用户信息错误!")
            }
        }).error(function () {
            layer.msg("加载用户信息错误!")
        }).complete(function () {
            //initEdit();
        });

        var cheatType = $('.dropdown.all-camera-dropdown').find("a").eq(0).text().trim();
        if(cheatType=="账号诈骗"){
            cheatType=1;
        }else if(cheatType=="外观诈骗"){
            cheatType=2;
        }else if(cheatType=="道具诈骗"){
            cheatType=3;
        }else if(cheatType=="金币诈骗"){
            cheatType=4;
        }else if(cheatType=="代练欺诈"){
            cheatType=5;
        }
        //var str = getUrlParam('cheatType');

        // function getUrlParam(name) {
        //     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        //     var r = window.location.search.substr(1).match(reg); //匹配目标参数
        //     if (r != null) return unescape(r[2]); return null; //返回参数值
        // }
        /*if(parseInt(str)==1){
            tradeType=1;
            var sefont=$(".nav-pills ul li").eq(0).find('a').text();
            $(".nav-pills ul li").eq(0).parents('.nav-pills').find('.dropdown-toggle').html(sefont+'<b class="caret"></b>')
        }else if(parseInt(str)==2){
            tradeType=2;
            var sefont=$(".nav-pills ul li").eq(1).find('a').text();
            $(".nav-pills ul li").eq(0).parents('.nav-pills').find('.dropdown-toggle').html(sefont+'<b class="caret"></b>')
        }*/

        if(getUrlParam('mainId')==null){
            $("#upedit").hide();    //隐藏更新按钮
        }else{
            $("#save").text('保存');
            //$("#save").hide();      //隐藏保存按钮
        }

    }

    //设置编辑数据
    function setInfo(info){
        var dataObj=eval(info);//转换为json对象
        var obj=eval(dataObj[0]);
        //var obj = {"datas":[{"RECORD_ID":"82ff120a-5789-4915-ac9a-af3af3b5aa09","CREATETIME":1505400011000,"UPDATETIME":1505400011000,"ISVALID":1,"FAVOR_ID":137,"USER_ID":4548444,"FAVOR_DATE":1505400011000,"TRADE_TYPE":1,"BELONG_QF":"[电月电二相知莫问]","GOLD_TOTAL":12,"UNIT_PRICE":34,"IF_SPLIT":1,"FAVOR_INFO":"ggg"}]};
        //alert(eval(dataObj[0]).RECORD_ID);

        var tradeType=obj.TRADE_TYPE;
        if(tradeType=="1"){
            tradeType="收购";
        }else if(tradeType=="2"){
            tradeType="出售";
        }
        $(".nav-pills ul li").parents('.nav-pills').find('.dropdown-toggle').html(tradeType+'<b class="caret"></b>');//欺诈类型
        $("#pre").find("option:selected").text(obj.BELONG_QF.substring(1,3));
        $("#city").find("option:selected").text(obj.BELONG_QF.substring(3,5));
        $("#area").find("option:selected").text(obj.BELONG_QF.substring(5,obj.BELONG_QF.length-1));

        // var tixin=$("#tixin").select2();
        // tixin.val(obj.TIXIN.substring(1,obj.TIXIN.length-1)).trigger("change");
        // tixin.change();

        var ifSplit = obj.IF_SPLIT;
        $("input[name='ifSplit']:eq("+ifSplit+")").attr("checked",'checked');
        $('#goldTotal').val(obj.GOLD_TOTAL);//金币总量
        $('#unitPrice').val(obj.UNIT_PRICE);//单价
        $('#favorInfo').val(obj.FAVOR_INFO);//其他说明

        $('.dropdown-menu li').addClass('disabled');
        $('.areaSelect select').attr('disabled','true');
        $('.viewName').attr('disabled','true');
        $('#goldTotal').attr('disabled','true');
        $('#unitPrice').attr('disabled','true');
        $('input[name="ifSplit"]').attr('disabled','true');
        $('#favorInfo').attr('disabled','true');
    }
    //初始区服下拉数据
    function initSelections(selecttions) {
        var typeArr = [];
        var quArr = [];
        var areaArr = [];
        $.each(selecttions, function (i, value) {
             if (typeArr.indexOf(value.qufu_type) == -1) {
             typeArr.push(value.qufu_type);
             }
         });
         $.each(typeArr, function (i, value) {
             var arrTemp = [""];
             $.each(selecttions, function (j, value1) {
             if (value1.qufu_type == value) {
             if (arrTemp.indexOf(value1.qufu_qu) == -1) {
             arrTemp.push(value1.qufu_qu);
             }
             }
             });
             quArr.push(arrTemp);
         });
         $.each(quArr, function (i, value) {
             $.each(value, function (j, value1) {
                 var arrTemp = [""];
                 $.each(selecttions, function (k, value2) {
                     if (value2.qufu_qu == value1) {
                         if (arrTemp.indexOf(value2.qufu_fu) == -1) {
                            arrTemp.push(value2.qufu_fu);
                         }
                     }
                 });
                 if (areaArr.indexOf(arrTemp) == -1) {
                    areaArr.push(arrTemp);
                 }
             });
         });
         //声明省
         pres = typeArr;
         //声明市
         cities = quArr;
         areas = areaArr;

         dsy.add("0", pres);
         $.each(cities,function (i,value) {
             dsy.add("0_"+i,value);
         });
         var areaNum = 0;
         $.each(areas,function (i,value) {
             $.each(cities,function (j,value1) {
             dsy.add("0_"+i+"_"+j,value[areaNum]);
                areaNum++;
             });
         });

         //先设置省的值
         for (var i = 0; i < pres.length; i++) {
             //声明option.<option value="pres[i]">Pres[i]</option>
             var op = new Option(pres[i], i);
             //添加
             if(preEle==null){
                preEle = document.getElementById("pre");
             }
             preEle.options.add(op);
         }
    }
    //加载Form
    function initForm() {
        //var url = pageApi+'accountListSelection';

        var url = reportApi+'accountTransactionListSelection?mainId='+getUrlParam('mainId');
        $.getJSON(url,function (data) {
            var selecttions = data.selecttions==null?"":data.selecttions;
            //填充区域选择框
            if(selecttions!="") {
                initSelections(selecttions);
            }
            var tixin = data.tixin==null?"":data.tixin;
            //填充体型选择框
            /*var tixinList = data.tixinList==null?"":data.tixinList;
            if(tixinList!="") {
                initTixin(tixinList);
            }*/
            var info = data.info==null?"":data.info;
            if(info!=""){
                setInfo(info);
            }
    }).error(function () {
    }).complete(function () {
        $('#save').unbind("click");
        $('#save').click(function () {
                layer.load();
                var tradeType = '1';//交易类型
                var belongQf = ''; //涉事区服
                var goldTotal = $('#goldTotal').val();;//金币总量
                var unitPrice = $('#unitPrice').val();;//单价
                var ifSplit = '';//是否可以拆分
                var favorInfo = $('#favorInfo').val();;//其他说明

                tradeType = $('.dropdown.all-camera-dropdown').find("a").eq(0).text().trim();
                if(tradeType=="收购"){
                    tradeType=1;
                }else{
                    tradeType=2;
                }

                $('.areaSelect').find('select').each(function () {
                    var text = $(this).find('option:selected').text();
                    if(text.indexOf("请选择")==-1) {
                        belongQf += text;
                    }
                });
                /*if(belongQf.length>2) {
                    belongQf = belongQf.substring(0, belongQf.length - 1);
                }else{
                    belongQf="";
                }*/

                ifSplit = $('input:radio[name="ifSplit"]:checked').val();

                console.log('开始----------->'+tradeType);
                console.log('开始----------->'+belongQf);
                console.log('开始----------->'+goldTotal);
                console.log('开始----------->'+unitPrice);
                console.log('开始----------->'+ifSplit);
                console.log('开始----------->'+favorInfo);
                /*if(tradeType=="求购"){
                 tradeType=1;
                 }else{
                 tradeType=2;
                 }*/

                //验证
                var submit=true;
                if($.trim(goldTotal).length>0) {
                    var reg = /^[0-9]*$/;
                    if(!reg.test(goldTotal)){
                        $('#msg1').text("* 请输入正整数!");
                        submit=false;
                    }else{
                        $('#msg1').text("*");
                    }
                    if(goldTotal>1000000){
                        $('#msg1').text("* 金币总量不能超过100万!");
                        submit=false;
                    }
                }else{
                    $('#msg1').text("* 本项不可为空!");
                }
                if($.trim(unitPrice).length>0) {
                    var reg = /^[0-9]*$/;
                    if(!reg.test(unitPrice)){
                        $('#msg2').text("* 请输入正整数!");
                        submit=false;
                    }else{
                        $('#msg2').text("*");
                    }
                }else{
                    $('#msg2').text("* 本项不可为空!");
                    submit=false;
                }



                if(submit){
                    if(getUrlParam('mainId')==null){
                        url = reportApi + 'saveJbjyInfo?operate=save&userId=' + encodeURI(userId)
                            + '&favorId=-1'
                            + '&tradeType=' + encodeURI(tradeType)
                            + '&belongQf=' + encodeURI(belongQf)
                            + '&goldTotal=' + encodeURI(goldTotal)
                            +'&unitPrice=' + encodeURI(unitPrice)
                            +'&ifSplit=' + encodeURI(ifSplit)
                            +'&favorInfo=' + encodeURI(favorInfo);
                        saveTable(url);
                    }else{
                        url = reportApi + 'saveJbjyInfo?operate=upedit&userId=' + encodeURI(userId)
                            + '&favorId=' + getUrlParam('mainId')
                            + '&tradeType=' + encodeURI(tradeType)
                            + '&belongQf=' + encodeURI(belongQf)
                            + '&goldTotal=' + encodeURI(goldTotal)
                            +'&unitPrice=' + encodeURI(unitPrice)
                            +'&ifSplit=' + encodeURI(ifSplit)
                            +'&favorInfo=' + encodeURI(favorInfo);
                        saveTable(url);
                    }

                }else{
                    layer.closeAll();
                }
            });
            $('#upedit').unbind("click");
            $('#upedit').click(function () {
                // layer.load();
                // var recordId = getUrlParam('mainId');
                // var tradeType = '1';//交易类型
                // var belongQf = ''; //涉事区服
                // var goldTotal = $('#goldTotal').val();;//金币总量
                // var unitPrice = $('#unitPrice').val();;//单价
                // var ifSplit = '';//是否可以拆分
                // var favorInfo = $('#favorInfo').val();;//其他说明
                //
                // tradeType = $('.dropdown.all-camera-dropdown').find("a").eq(0).text().trim();
                // if(tradeType=="收购"){
                //     tradeType=1;
                // }else{
                //     tradeType=2;
                // }
                //
                // $('.areaSelect').find('select').each(function () {
                //     var text = $(this).find('option:selected').text();
                //     if(text.indexOf("请选择")==-1) {
                //         belongQf += text;
                //     }
                // });
                // /*if(belongQf.length>2) {
                //  belongQf = belongQf.substring(0, belongQf.length - 1);
                //  }else{
                //  belongQf="";
                //  }*/
                //
                // ifSplit = $('input:radio[name="ifSplit"]:checked').val();
                //
                // console.log('开始----------->'+tradeType);
                // console.log('开始----------->'+belongQf);
                // console.log('开始----------->'+goldTotal);
                // console.log('开始----------->'+unitPrice);
                // console.log('开始----------->'+ifSplit);
                // console.log('开始----------->'+favorInfo);
                // /*if(tradeType=="求购"){
                //  tradeType=1;
                //  }else{
                //  tradeType=2;
                //  }*/
                //
                // //验证
                // var submit=true;
                // if($.trim(goldTotal).length>0) {
                //     var reg = /^[0-9]*$/;
                //     if(!reg.test(goldTotal)){
                //         $('#msg1').text("* 请输入正整数!");
                //         submit=false;
                //     }else{
                //         $('#msg1').text("*");
                //     }
                //     if(goldTotal>1000000){
                //         $('#msg1').text("* 金币总量不能超过100万!");
                //         submit=false;
                //     }
                // }else{
                //     $('#msg1').text("* 本项不可为空!");
                // }
                // if($.trim(unitPrice).length>0) {
                //     var reg = /^[0-9]*$/;
                //     if(!reg.test(unitPrice)){
                //         $('#msg2').text("* 请输入正整数!");
                //         submit=false;
                //     }else{
                //         $('#msg2').text("*");
                //     }
                // }else{
                //     $('#msg2').text("* 本项不可为空!");
                //     submit=false;
                // }
                //
                // url = reportApi + 'saveJbjyInfo?operate=upedit&userId=' + encodeURI(userId)
                //     + '&favorId=' + getUrlParam('mainId')
                //     + '&tradeType=' + encodeURI(tradeType)
                //     + '&belongQf=' + encodeURI(belongQf)
                //     + '&goldTotal=' + encodeURI(goldTotal)
                //     +'&unitPrice=' + encodeURI(unitPrice)
                //     +'&ifSplit=' + encodeURI(ifSplit)
                //     +'&favorInfo=' + encodeURI(favorInfo);
                //
                // if(submit){
                //     saveTable(url);
                // }else{
                //     layer.closeAll();
                // }

                $('.dropdown-menu li').removeClass('disabled');
                $('.areaSelect select').removeAttr('disabled');
                $('.viewName').removeAttr('disabled');
                $('#goldTotal').removeAttr('disabled');
                $('#unitPrice').removeAttr('disabled');
                $('input[name="ifSplit"]').removeAttr('disabled');
                $('#favorInfo').removeAttr('disabled');
            });

            //initTable();
        });
    }

    //获取url中的参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }
//------------------------------------Function定义 End------------------------------------
