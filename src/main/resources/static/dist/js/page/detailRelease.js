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
        //页签切换
        $('.rightcon .title span').click(function(){
            $(this).addClass('cur').siblings('span').removeClass('cur');
            var spanindex=$(this).index();
            var detailGroup=$('.detailGroup .group');
            $(detailGroup[spanindex]).show().siblings('.group').hide();
            if(spanindex==6){
                initUploader();
            }
        });
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
        layer.msg('举报成功，剑三幸甚有你');
        setTimeout(function () { save(); }, 2000);

        function save() {
            $.ajax({
                url: url,
                async: false,
                success: function (data) {

                },
                complete: function () {

                },
                error: function () {
                    //layer.closeAll();
                    //layer.msg("数据请求失败!")
                }

            });
        }
    }

    function initTable(username) {
        var url = api+'dataAndSecurity/getUserInfo?userName='+encodeURI(username);
        console.log(url);
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

        if(getUrlParam('mainId')==null){
            $("#upedit").hide();    //隐藏更新按钮
        }else{
            $("#save").text('保存');
            //$("#save").hide();      //隐藏保存按钮
        }
        //1.称号
        $.ajax({
            url:url = reportApi + 'getTzc?type=5&cate=1',
            async:false,
            success:function (data) {
                dataTemp = data;

                //清空称号
                $("#chenghao").empty();
                //填充checkbox
                // var obj = data.data;
                // var description = "";
                // for(var i in obj){
                //     var property=obj[i];
                //     description+=i+" = "+property+"\n";
                // }
                // alert(description);

                var tableDatas = data.datas==null?"":data.datas;
                $.each(tableDatas,function (i,value) {
                    var name = value.name;
                    $("#chenghao").append("<span><i class='icon0' name='ch' value='"+i+"' name='header'/></i>"+name+"</span>");
                });

                //$("#chenghao").html('<span><input type="checkbox" name="ch" value="1" />济世菩萨<input type="checkbox" name="ch" value="2" />红尘<input type="checkbox" name="ch" value="3" />济世菩萨');
            },
            complete:function () {
                $(".icon0").unbind('click');
                $(".icon0").click(function() {
                    if($(this).attr('class').indexOf('cur')>-1){
                        $(this).removeClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se0.png) no-repeat")
                    }else{
                        $(this).addClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se.png) no-repeat")
                    }
                });
            },
            error:function () {
                layer.closeAll();
                layer.msg("数据请求失败!")
            }

        });

        //2.发型
        $.ajax({
            url:url = reportApi + 'getTzc?type=6&parNum=1&cate=1',
            async:false,
            success:function (data) {
                //清空称号
                $("#fx").empty();
                //填充checkbox
                var tableDatas = data.datas==null?"":data.datas;
                $.each(tableDatas,function (i,value) {
                    var name = value.name;
                    $("#fx").append("<span><i class='icon0' name='fx' value='"+i+"' name='header'/></i>"+name+"</span>");

                });

            },
            complete:function () {
                $(".icon0").unbind('click');
                $(".icon0").click(function() {
                    if($(this).attr('class').indexOf('cur')>-1){
                        $(this).removeClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se0.png) no-repeat")
                    }else{
                        $(this).addClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se.png) no-repeat")
                    }
                });
            },
            error:function () {
                layer.closeAll();
                layer.msg("数据请求失败!")
            }
        });

        //3.披风
        $.ajax({
            url:url = reportApi + 'getTzc?type=6&parNum=4&cate=1',
            async:false,
            success:function (data) {
                //清空称号
                $("#pf").empty();
                //填充checkbox
                var tableDatas = data.datas==null?"":data.datas;
                $.each(tableDatas,function (i,value) {
                    var name = value.name;
                    $("#pf").append("<span><i class='icon0' name='fx' value='"+i+"' name='header'/></i>"+name+"</span>");
                });

            },
            complete:function () {
                $(".icon0").unbind('click');
                $(".icon0").click(function() {
                    if($(this).attr('class').indexOf('cur')>-1){
                        $(this).removeClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se0.png) no-repeat")
                    }else{
                        $(this).addClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se.png) no-repeat")
                    }
                });
            },
            error:function () {
                layer.closeAll();
                layer.msg("数据请求失败!")
            }
        });

        //4.成衣-限量
        $.ajax({
            url:url = reportApi + 'getTzc?type=6&parNum=2&cate=1',
            async:false,
            success:function (data) {
                //清空称号
                $("#cyxl").empty();
                //填充checkbox
                var tableDatas = data.datas==null?"":data.datas;
                $.each(tableDatas,function (i,value) {
                    var name = value.name;
                    $("#cyxl").append("<span><i class='icon0' name='fx' value='"+i+"' name='header'/></i>"+name+"</span>");

                });
            },
            complete:function () {
                $(".icon0").unbind('click');
                $(".icon0").click(function() {
                    if($(this).attr('class').indexOf('cur')>-1){
                        $(this).removeClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se0.png) no-repeat")
                    }else{
                        $(this).addClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se.png) no-repeat")
                    }
                });
            },
            error:function () {
                layer.closeAll();
                layer.msg("数据请求失败!")
            }
        });

        //5.成衣-限时
        $.ajax({
            url:url = reportApi + 'getTzc?type=6&parNum=3&cate=1',
            async:false,
            success:function (data) {
                //清空称号
                $("#cyxs").empty();
                //填充checkbox
                var tableDatas = data.datas==null?"":data.datas;
                $.each(tableDatas,function (i,value) {
                    var name = value.name;
                    $("#cyxs").append("<span><i class='icon0' name='fx' value='"+i+"' name='header'/></i>"+name+"</span>");
                });
            },
            complete:function () {
                $(".icon0").unbind('click');
                $(".icon0").click(function() {
                    if($(this).attr('class').indexOf('cur')>-1){
                        $(this).removeClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se0.png) no-repeat")
                    }else{
                        $(this).addClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se.png) no-repeat")
                    }
                });
            },
            error:function () {
                layer.closeAll();
                layer.msg("数据请求失败!")
            }
        });

        //6.套装盒子
        $.ajax({
            url:url = reportApi + 'getTzc?type=6&parNum=5&cate=1',
            async:false,
            success:function (data) {
                //清空称号
                $("#tzhz").empty();
                //填充checkbox
                var tableDatas = data.datas==null?"":data.datas;
                $.each(tableDatas,function (i,value) {
                    var name = value.name;
                    $("#tzhz").append("<span><i class='icon0' name='fx' value='"+i+"' name='header'/></i>"+name+"</span>");
                });

            },
            complete:function () {
                $(".icon0").unbind('click');
                $(".icon0").click(function() {
                    if($(this).attr('class').indexOf('cur')>-1){
                        $(this).removeClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se0.png) no-repeat")
                    }else{
                        $(this).addClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se.png) no-repeat")
                    }
                });
            },
            error:function () {
                layer.closeAll();
                layer.msg("数据请求失败!")
            }
        });

        //7.坐骑
        $.ajax({
            url:url = reportApi + 'getTzc?type=7&parNum=2&cate=1',
            async:false,
            success:function (data) {
                //清空称号
                $("#zq").empty();
                //填充checkbox
                var tableDatas = data.datas==null?"":data.datas;
                $.each(tableDatas,function (i,value) {
                    var name = value.name;
                    $("#zq").append("<span><i class='icon0' name='fx' value='"+i+"' name='header'/></i>"+name+"</span>");
                });

            },
            complete:function () {
                $(".icon0").unbind('click');
                $(".icon0").click(function() {
                    if($(this).attr('class').indexOf('cur')>-1){
                        $(this).removeClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se0.png) no-repeat")
                    }else{
                        $(this).addClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se.png) no-repeat")
                    }
                });
            },
            error:function () {
                layer.closeAll();
                layer.msg("数据请求失败!")
            }
        });

        //8.马具
        $.ajax({
            url:url = reportApi + 'getTzc?type=7&parNum=5&cate=1',
            async:false,
            success:function (data) {
                //清空称号
                $("#mj").empty();
                //填充checkbox
                var tableDatas = data.datas==null?"":data.datas;
                $.each(tableDatas,function (i,value) {
                    var name = value.name;
                    $("#mj").append("<span><i class='icon0' name='fx' value='"+i+"' name='header'/></i>"+name+"</span>");
                });

            },
            complete:function () {
                $(".icon0").unbind('click');
                $(".icon0").click(function() {
                    if($(this).attr('class').indexOf('cur')>-1){
                        $(this).removeClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se0.png) no-repeat")
                    }else{
                        $(this).addClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se.png) no-repeat")
                    }
                });
            },
            error:function () {
                layer.closeAll();
                layer.msg("数据请求失败!")
            }
        });

        //9.马饰
        $.ajax({
            url:url = reportApi + 'getTzc?type=7&parNum=4&cate=1',
            async:false,
            success:function (data) {
                //清空称号
                $("#ms").empty();
                //填充checkbox
                var tableDatas = data.datas==null?"":data.datas;
                $.each(tableDatas,function (i,value) {
                    var name = value.name;
                    $("#ms").append("<span><i class='icon0' name='fx' value='"+i+"' name='header'/></i>"+name+"</span>");
                });
            },
            complete:function () {
                $(".icon0").unbind('click');
                $(".icon0").click(function() {
                    if($(this).attr('class').indexOf('cur')>-1){
                        $(this).removeClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se0.png) no-repeat")
                    }else{
                        $(this).addClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se.png) no-repeat")
                    }
                });
            },
            error:function () {
                layer.closeAll();
                layer.msg("数据请求失败!")
            }
        });

        //10.骑趣
        $.ajax({
            url:url = reportApi + 'getTzc?type=7&parNum=3&cate=1',
            async:false,
            success:function (data) {
                //清空称号
                $("#qq").empty();
                //填充checkbox
                var tableDatas = data.datas==null?"":data.datas;
                $.each(tableDatas,function (i,value) {
                    var name = value.name;
                    $("#qq").append("<span><i class='icon0' name='fx' value='"+i+"' name='header'/></i>"+name+"</span>");
                });

            },
            complete:function () {
                $(".icon0").unbind('click');
                $(".icon0").click(function() {
                    if($(this).attr('class').indexOf('cur')>-1){
                        $(this).removeClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se0.png) no-repeat")
                    }else{
                        $(this).addClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se.png) no-repeat")
                    }
                });
            },
            error:function () {
                layer.closeAll();
                layer.msg("数据请求失败!")
            }
        });

        //11.十大珍稀挂件
        $.ajax({
            url:url = reportApi + 'getTzc?type=14&parNum=1&cate=1',
            async:false,
            success:function (data) {
                //清空称号
                $("#sdzxgj").empty();
                //填充checkbox
                var tableDatas = data.datas==null?"":data.datas;
                $.each(tableDatas,function (i,value) {
                    var name = value.name;
                    $("#sdzxgj").append("<span><i class='icon0' name='fx' value='"+i+"' name='header'/></i>"+name+"</span>");
                });
            },
            complete:function () {
                $(".icon0").unbind('click');
                $(".icon0").click(function() {
                    if($(this).attr('class').indexOf('cur')>-1){
                        $(this).removeClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se0.png) no-repeat")
                    }else{
                        $(this).addClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se.png) no-repeat")
                    }
                });
            },
            error:function () {
                layer.closeAll();
                layer.msg("数据请求失败!")
            }
        });

        //12.重要运营挂件
        $.ajax({
            url:url = reportApi + 'getTzc?type=14&parNum=2&cate=1',
            async:false,
            success:function (data) {
                //清空称号
                $("#zyyygj").empty();
                //填充checkbox
                var tableDatas = data.datas==null?"":data.datas;
                $.each(tableDatas,function (i,value) {
                    var name = value.name;
                    $("#zyyygj").append("<span><i class='icon0' name='fx' value='"+i+"' name='header'/></i>"+name+"</span>");
                });
            },
            complete:function () {
                $(".icon0").unbind('click');
                $(".icon0").click(function() {
                    if($(this).attr('class').indexOf('cur')>-1){
                        $(this).removeClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se0.png) no-repeat")
                    }else{
                        $(this).addClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se.png) no-repeat")
                    }
                });
            },
            error:function () {
                layer.closeAll();
                layer.msg("数据请求失败!")
            }
        });

        //13.重要副本挂件
        $.ajax({
            url:url = reportApi + 'getTzc?type=14&parNum=3&cate=1',
            async:false,
            success:function (data) {
                //清空称号
                $("#zyfjgj").empty();
                //填充checkbox
                var tableDatas = data.datas==null?"":data.datas;
                $.each(tableDatas,function (i,value) {
                    var name = value.name;
                    $("#zyfjgj").append("<span><i class='icon0' name='fx' value='"+i+"' name='header'/></i>"+name+"</span>");
                });
            },
            complete:function () {
                $(".icon0").unbind('click');
                $(".icon0").click(function() {
                    if($(this).attr('class').indexOf('cur')>-1){
                        $(this).removeClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se0.png) no-repeat")
                    }else{
                        $(this).addClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se.png) no-repeat")
                    }
                });
            },
            error:function () {
                layer.closeAll();
                layer.msg("数据请求失败!")
            }
        });

        //14.奇遇挂件
        $.ajax({
            url:url = reportApi + 'getTzc?type=14&parNum=4&cate=1',
            async:false,
            success:function (data) {
                //清空称号
                $("#qygj").empty();
                //填充checkbox
                var tableDatas = data.datas==null?"":data.datas;
                $.each(tableDatas,function (i,value) {
                    var name = value.name;
                    $("#qygj").append("<span><i class='icon0' name='fx' value='"+i+"' name='header'/></i>"+name+"</span>");
                });
            },
            complete:function () {
                $(".icon0").unbind('click');
                $(".icon0").click(function() {
                    if($(this).attr('class').indexOf('cur')>-1){
                        $(this).removeClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se0.png) no-repeat")
                    }else{
                        $(this).addClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se.png) no-repeat")
                    }
                });
            },
            error:function () {
                layer.closeAll();
                layer.msg("数据请求失败!")
            }
        });

        //15.JJC奖励挂件
        $.ajax({
            url:url = reportApi + 'getTzc?type=14&parNum=5&cate=1',
            async:false,
            success:function (data) {
                //清空称号
                $("#jlgj").empty();
                //填充checkbox
                var tableDatas = data.datas==null?"":data.datas;
                $.each(tableDatas,function (i,value) {
                    var name = value.name;
                    $("#jlgj").append("<span><i class='icon0' name='fx' value='"+i+"' name='header'/></i>"+name+"</span>");
                });
            },
            complete:function () {
                $(".icon0").unbind('click');
                $(".icon0").click(function() {
                    if($(this).attr('class').indexOf('cur')>-1){
                        $(this).removeClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se0.png) no-repeat")
                    }else{
                        $(this).addClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se.png) no-repeat")
                    }
                });
            },
            error:function () {
                layer.closeAll();
                layer.msg("数据请求失败!")
            }
        });

        //16.重要成就挂件
        $.ajax({
            url:url = reportApi + 'getTzc?type=14&parNum=6&cate=1',
            async:false,
            success:function (data) {
                //清空称号
                $("#zycjgj").empty();
                //填充checkbox
                var tableDatas = data.datas==null?"":data.datas;
                $.each(tableDatas,function (i,value) {
                    var name = value.name;
                    $("#zycjgj").append("<span><i class='icon0' name='fx' value='"+i+"' name='header'/></i>"+name+"</span>");
                });
            },
            complete:function () {
                $(".icon0").unbind('click');
                $(".icon0").click(function() {
                    if($(this).attr('class').indexOf('cur')>-1){
                        $(this).removeClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se0.png) no-repeat")
                    }else{
                        $(this).addClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se.png) no-repeat")
                    }
                });
            },
            error:function () {
                layer.closeAll();
                layer.msg("数据请求失败!")
            }
        });

        //17.重要充消挂件
        $.ajax({
            url:url = reportApi + 'getTzc?type=14&parNum=7&cate=1',
            async:false,
            success:function (data) {
                //清空称号
                $("#zycxgj").empty();
                //填充checkbox
                var tableDatas = data.datas==null?"":data.datas;
                $.each(tableDatas,function (i,value) {
                    var name = value.name;
                    $("#zycxgj").append("<span><i class='icon0' nam e='fx' value='"+i+"' name='header'/></i>"+name+"</span>");
                });
            },
            complete:function () {
                $(".icon0").unbind('click');
                $(".icon0").click(function() {
                    if($(this).attr('class').indexOf('cur')>-1){
                        $(this).removeClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se0.png) no-repeat")
                    }else{
                        $(this).addClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se.png) no-repeat")
                    }
                });
            },
            error:function () {
                layer.closeAll();
                layer.msg("数据请求失败!")
            }
        });

        //18.绝世奇遇
        $.ajax({
            url:url = reportApi + 'getTzc?type=13&parNum=1&cate=1',
            async:false,
            success:function (data) {
                //清空称号
                $("#jsqj").empty();
                //填充checkbox
                var tableDatas = data.datas==null?"":data.datas;
                $.each(tableDatas,function (i,value) {
                    var name = value.name;
                    $("#jsqj").append("<span><i class='icon0' nam e='fx' value='"+i+"' name='header'/></i>"+name+"</span>");
                });

                //$("#jsqj").html('<span><i class="icon0"></i>三山四海</span><span><i class="icon0"></i>阴阳两界</span><span><i class="icon0"></i>三尺青锋</span><span><i class="icon0"></i>塞外宝驹</span><span><i class="icon0"></i>清风捕王</span><span><i class="icon0"></i>黑白路</span><span><i class="icon0"></i>少年行</span><span><i class="icon0"></i>茶馆奇缘</span><span><i class="icon0"></i>生死判</span><span><i class="icon0"></i>炼狱厨神</span>');
            },
            complete:function () {
                $(".icon0").unbind('click');
                $(".icon0").click(function() {
                    if($(this).attr('class').indexOf('cur')>-1){
                        $(this).removeClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se0.png) no-repeat")
                    }else{
                        $(this).addClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se.png) no-repeat")
                    }
                });
            },
            error:function () {
                layer.closeAll();
                layer.msg("数据请求失败!")
            }
        });

        //19.普通奇遇
        $.ajax({
            url:url = reportApi + 'getTzc?type=13&parNum=2&cate=1',
            async:false,
            success:function (data) {
                //清空称号
                $("#ptqy").empty();
                //填充checkbox
                var tableDatas = data.datas==null?"":data.datas;
                $.each(tableDatas,function (i,value) {
                    var name = value.name;
                    $("#ptqy").append("<span><i class='icon0' nam e='fx' value='"+i+"' name='header'/></i>"+name+"</span>");
                });

            },
            complete:function () {
                $(".icon0").unbind('click');
                $(".icon0").click(function() {
                    if($(this).attr('class').indexOf('cur')>-1){
                        $(this).removeClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se0.png) no-repeat")
                    }else{
                        $(this).addClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se.png) no-repeat")
                    }
                });
            },
            error:function () {
                layer.closeAll();
                layer.msg("数据请求失败!")
            }
        });

        //20.江湖奇遇
        $.ajax({
            url:url = reportApi + 'getTzc?type=13&parNum=3&cate=1',
            async:false,
            success:function (data) {
                //清空称号
                $("#jhqy").empty();
                //填充checkbox
                var tableDatas = data.datas==null?"":data.datas;
                $.each(tableDatas,function (i,value) {
                    var name = value.name;
                    $("#jhqy").append("<span><i class='icon0' nam e='fx' value='"+i+"' name='header'/></i>"+name+"</span>");
                });

                //$("#jhqy").html('<span><i class="icon0"></i>三山四海</span><span><i class="icon0"></i>阴阳两界</span><span><i class="icon0"></i>三尺青锋</span><span><i class="icon0"></i>塞外宝驹</span><span><i class="icon0"></i>清风捕王</span><span><i class="icon0"></i>黑白路</span><span><i class="icon0"></i>少年行</span><span><i class="icon0"></i>茶馆奇缘</span><span><i class="icon0"></i>生死判</span><span><i class="icon0"></i>炼狱厨神</span>');
            },
            complete:function () {
                $(".icon0").unbind('click');
                $(".icon0").click(function() {
                    if($(this).attr('class').indexOf('cur')>-1){
                        $(this).removeClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se0.png) no-repeat")
                    }else{
                        $(this).addClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se.png) no-repeat")
                    }
                });
            },
            error:function () {
                layer.closeAll();
                layer.msg("数据请求失败!")
            }
        });

        //21.宠物奇珍
        $.ajax({
            url:url = reportApi + 'getTzc?type=13&parNum=4&cate=1',
            async:false,
            success:function (data) {
                //清空称号
                $("#cwzq").empty();
                //填充checkbox
                var tableDatas = data.datas==null?"":data.datas;
                $.each(tableDatas,function (i,value) {
                    var name = value.name;
                    $("#cwzq").append("<span><i class='icon0' nam e='fx' value='"+i+"' name='header'/></i>"+name+"</span>");
                });

                //$("#cwzq").html('<span><i class="icon0"></i>三山四海</span><span><i class="icon0"></i>阴阳两界</span><span><i class="icon0"></i>三尺青锋</span><span><i class="icon0"></i>塞外宝驹</span><span><i class="icon0"></i>清风捕王</span><span><i class="icon0"></i>黑白路</span><span><i class="icon0"></i>少年行</span><span><i class="icon0"></i>茶馆奇缘</span><span><i class="icon0"></i>生死判</span><span><i class="icon0"></i>炼狱厨神</span>');
            },
            complete:function () {
                $(".icon0").unbind('click');
                $(".icon0").click(function() {
                    if($(this).attr('class').indexOf('cur')>-1){
                        $(this).removeClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se0.png) no-repeat")
                    }else{
                        $(this).addClass('cur');
                        $(this).css("background","url(./dist/css/images/jx3/se.png) no-repeat")
                    }
                });
            },
            error:function () {
                layer.closeAll();
                layer.msg("数据请求失败!")
            }
        });

 }

    //初始欺诈类型
    function initCheatType(){
        console.log('3333333333333333');
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
        var url = pageApi+'accountListSelection';
        $.getJSON(url,function (data) {
            var selecttions = data.selecttions==null?"":data.selecttions;
            //填充区域选择框
            if(selecttions!="") {
                initSelections(selecttions);
            }
            var tixin = data.tixin==null?"":data.tixin;
            //填充体型选择框
            if(tixin!="") {
                initTixin(tixin);
            }
            var info = data.info==null?"":data.info;
            if(info!=""){
//                initInfo(info);
            }
        }).error(function () {
        }).complete(function () {
            //绑定页签
            $('.ht').unbind("click");
            $('.ht').click(function () {
                //alert($(".ht").index());
                //$(this).addClass('cur').siblings('span').removeClass('cur');
                //alert($('.ht').find('span').html());

                /*$('.ht').find('span').click(function(){
                    alert('选择了：'+this.innerHTML)
                })*/
                //$(this).addClass('cur').siblings('span').removeClass('cur');

                //alert(   $(">span",this).eq(2).html()   );

                //$(">span",this).eq(2).addClass('cur').siblings('span').removeClass('cur');
                //$('.ht').find('span').eq(2).addClass('cur').siblings('span').removeClass('cur');
            });
            //绑定保存
            $('#save').unbind("click");
            $('#save').click(function () {
                var belongQf = ''; //涉事区服
                var tixin = $('#tixin').val();//门派体型
                var priceNum = $('#priceNum').val();//价格
                var mbgjsl = $('#mbgjsl').val();//面部挂件数量
                var bbgjsl = $('#bbgjsl').val();//背部挂件数量
                var ybgjsl = $('#ybgjsl').val();//腰部挂件数量
                var zjssl = $('#zjssl').val();//左肩饰数量
                var yjssl = $('#yjssl').val();//右肩饰数量
                var qtxych = $('#qtxych').val();//其它稀有称号???
                
                var zl = $('#zl').val();//资历
                var fbwj = $('#fbwj').val();//副本五甲
                var xfcz = $('#xfcz').val();//消费充值
                var xfjf = $('#xfjf').val();//消费积分
                var yxjb = $('#yxjb').val();//游戏金币
                var cwfz = $('#cwfz').val();//宠物分值
                var jhsj = $('#jhsj').val();//建号时间
                var kdsj = $('#kdsj').val();//点卡时间
                var tbsl = $('#tbsl').val();//通宝数量
                //var yxjb2 = $('#yxjb2').val();//游戏金币2
                var en = $('#en').val();//二内
                var sn = $('#sn').val();//三内

                var _95cw = $('#95cw').val();//95橙武
                var _90cw = $('#90cw').val();//90橙武
                var _80cw = $('#80cw').val();//80橙武
                var _70cw = $('#70cw').val();//70橙武
                var mptx = $('#mptx').val();//门派特效
                var _95xj = $('#95xj').val();//95玄晶
                var _95xt = $('#95xt').val();//95小铁
                var _90xj = $('#90xj').val();//90玄晶
                var _90xt = $('#90xt').val();//90小铁
                var _80xj = $('#80xj').val();//80玄晶
                var _80xt = $('#80xt').val();//80小铁
                var _70xj = $('#70xj').val();//70玄晶
                var _70xt = $('#70xt').val();//70小铁
                var pvpnz = $('#pvpnz').val();//PVP-奶装
                var pvenz = $('#pvenz').val();//PVE-奶装
                //var pvpnz2 = $('#pvpnz2').val();//PVP-奶装2
                var pvetz = $('#pvetz').val();//PVE-T装
                var pvpdpsngz = $('#pvpdpsngz').val();//PVP-DPS-内功装
                var pvedpsngz = $('#pvedpsngz').val();//PVE-DPS-内功装
                var pvpdpswgz = $('#pvpdpswgz').val();//PVP-DPS-外功装
                var pvedpswgz = $('#pvedpswgz').val();//PVE-DPS-外功装

                var bcsm = $('#bcsm').val();//补充说明

                //称号复选框
                var ch='';
                $("input[name='ch']:checked").each(function () {
                    //alert(this.value);
                    //$('#show').append(this.value + "  ");
                    ch+=this.value + ","
                });
                ch = trimEnd(ch);
                //所在区服
                $('.areaSelect').find('select').each(function () {
                    var text = $(this).find('option:selected').text();
                    if(text.indexOf("请选择")==-1) {
                        belongQf += text ;
                    }
                });
                //belongQf=trimEnd(belongQf);
                console.log('输出----------->'+userId);
                console.log('输出tixin----------->'+tixin);

                url = reportApi + 'saveZhssxxfbInfo?userId=' + encodeURI(userId)
                    + '&belongQf=' + encodeURI(belongQf)
                    + '&tixin=' + encodeURI(tixin)
                    +'&priceNum=' + encodeURI(priceNum)
                    +'&mbgjsl=' + encodeURI(mbgjsl)
                    +'&bbgjsl=' + encodeURI(bbgjsl)
                    +'&ybgjsl=' + encodeURI(ybgjsl)
                    +'&zjssl=' + encodeURI(zjssl)
                    +'&yjssl=' + encodeURI(yjssl)
                    +'&qtxych=' + encodeURI(qtxych)
                    +'&zl=' + encodeURI(zl)
                    +'&fbwj=' + encodeURI(fbwj)
                    +'&xfcz=' + encodeURI(xfcz)
                    +'&xfjf=' + encodeURI(xfjf)
                    +'&yxjb=' + encodeURI(yxjb)
                    +'&cwfz=' + encodeURI(cwfz)
                    +'&jhsj=' + encodeURI(jhsj)
                    +'&kdsj=' + encodeURI(kdsj)
                    +'&tbsl=' + encodeURI(tbsl)
                    +'&en=' + encodeURI(en)
                    +'&sn=' + encodeURI(sn)
                    +'&_95cw=' + encodeURI(_95cw)
                    +'&_90cw=' + encodeURI(_90cw)
                    +'&_80cw=' + encodeURI(_80cw)
                    +'&_70cw=' + encodeURI(_70cw)
                    +'&mptx=' + encodeURI(mptx)
                    +'&_95xj=' + encodeURI(_95xj)
                    +'&_95xt=' + encodeURI(_95xt)
                    +'&_90xj=' + encodeURI(_90xj)
                    +'&_90xt=' + encodeURI(_90xt)
                    +'&_80xj=' + encodeURI(_80xj)
                    +'&_80xt=' + encodeURI(_80xt)
                    +'&_70xj=' + encodeURI(_70xj)
                    +'&_70xt=' + encodeURI(_70xt)
                    +'&pvpnz=' + encodeURI(pvpnz)
                    +'&pvenz=' + encodeURI(pvenz)
                    +'&pvetz=' + encodeURI(pvetz)
                    +'&pvpdpsngz=' + encodeURI(pvpdpsngz)
                    +'&pvedpsngz=' + encodeURI(pvedpsngz)
                    +'&pvpdpswgz=' + encodeURI(pvpdpswgz)
                    +'&pvedpswgz=' + encodeURI(pvedpswgz)
                    +'&bcsm=' + encodeURI(bcsm);
  //              saveTable(url);
            });
            $('#cancel').unbind("click");
            $('#cancel').click(function () {
                alert('取消');
            });
            // initTable();
        });
    }

    function initTixin(data) {
        $.each(data,function (i,value) {
            var val1 = value.MENPAI_NAME;
            $('.tixin').append("  <option value="+val1+">"+val1+"</option> ");
        });
        $(".js-example-basic-single").select2();
    }

    function nextPage(spanindex) {
        $('.ht').find('span').eq(spanindex).addClass('cur').siblings('span').removeClass('cur');
        var detailGroup=$('.detailGroup .group');
        $(detailGroup[spanindex]).show().siblings('.group').hide();
    }
    //去字符串尾部，
    function trimEnd(str) {
        if(str.length>2) {
            str = str.substring(0, str.length - 1);
        }else{
            str="";
        }

        return str;
    }
//------------------------------------Function定义 End------------------------------------

function initUploader() {
    //uploader
    // 初始化Web Uploader
    var $list = $('#fileList'),
        // 优化retina, 在retina下这个值是2
        ratio = window.devicePixelRatio || 1,

        // 缩略图大小
        thumbnailWidth = 167 * ratio,
        thumbnailHeight = 99 * ratio,

        // Web Uploader实例
        uploader;

    // 初始化Web Uploader
    uploader = WebUploader.create({
        // 自动上传。
        auto: false,
        // swf文件路径
        swf:  './dist/js/uploader/Uploader.swf',
        // 文件接收服务端。
        server: api+'uploaderImgs',
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#filePicker',
        // 只允许选择文件，可选。
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/jpg,image/jpeg,image/png'//这里默认是 image/*,但是会导致很慢
        }
    });

    // 当有文件添加进来的时候
    uploader.on( 'fileQueued', function( file ) {
        var $li = $(
            '<div id="' + file.id + '" class="file-item thumbnail">' +
            '<img>' +
            '</div>'
            ),
            $img = $li.find('img');

        $list.append( $li );

        // 创建缩略图
        uploader.makeThumb( file, function( error, src ) {
            if ( error ) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }

            $img.attr( 'src', src );
        }, thumbnailWidth, thumbnailHeight );
    });

    // 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {
        var $li = $( '#'+file.id ),
            $percent = $li.find('.progress span');

        // 避免重复创建
        if ( !$percent.length ) {
            $percent = $('<p class="progress"><span></span></p>')
                .appendTo( $li )
                .find('span');
        }

        $percent.css( 'width', percentage * 100 + '%' );
    });

    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on( 'uploadSuccess', function( file,response) {
        $( '#'+file.id ).addClass('upload-state-done');
        //console.log(response);输出
        $('#file_name').prop("value", response.data);
    });

    // 文件上传失败，现实上传出错。
    uploader.on( 'uploadError', function( file ) {
        var $li = $( '#'+file.id ),
            $error = $li.find('div.error');

        // 避免重复创建
        if ( !$error.length ) {
            $error = $('<div class="error"></div>').appendTo( $li );
        }

        $error.text('上传失败');
    });

    // 完成上传完了，成功或者失败，先删除进度条。
    uploader.on( 'uploadComplete', function( file ) {
        $( '#'+file.id ).find('.progress').remove();
    });

    $('.uploaderImgs').click(function () {
        uploader.upload();
    });
}

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}