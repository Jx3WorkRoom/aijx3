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
        //initUploader();
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
        layer.msg('账号收售发布成功！');
        setTimeout(function () { save(); }, 3000);

        function save() {
            $.ajax({
                url: url,
                async: false,
                success: function (data) {
                    layer.closeAll();
                    //跳转
                    window.location.href = "myRelease";
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

        //var cheatType = $('.dropdown.all-camera-dropdown').find("a").eq(0).text().trim();   //2017-10-28 del
        var cheatType = $('input[name="tradeType"]:checked').val();     //2017-10-28 add
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
        console.log('initTable()----------->'+cheatType);
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
//            $("#save").hide();      //隐藏保存按钮
        }

    }

    //设置编辑数据
    function setInfo(info){
        var dataObj=eval(info);//转换为json对象
        var obj=eval(dataObj[0]);
        //var obj = {"datas":[{"RECORD_ID":"5c56dedb-14b4-4a7b-905d-1a453a233585","CREATETIME":1505363994000,"UPDATETIME":1505363994000,"ISVALID":1,"FAVOR_ID":134,"USER_ID":4548444,"TRADE_TYPE":2,"FAVOR_DATE":1505363994000,"BELONG_QF":"[电月电一长安城]","TIXIN":"[纯阳]","PRICE_NUM":10,"ACCO_INFO":"茜春树暮云 夺"}]};

        var tradeType=obj.TRADE_TYPE;
        /*if(tradeType=="1"){
            tradeType="买号";
        }else if(tradeType=="2"){
            tradeType="卖号";
        }else{
            tradeType="换号";
        }*/
        // alert(tradeType);
        //$(".nav-pills ul li").parents('.nav-pills').find('.dropdown-toggle').html(tradeType+'<b class="caret"></b>');//欺诈类型
        //$('input:radio').slice(tradeType).attr('checked', 'true');
        $("input:radio[value="+tradeType+"]").attr('checked','true');
        $("#pre").find("option:selected").text(obj.BELONG_QF.substring(1,3));
        $("#city").find("option:selected").text(obj.BELONG_QF.substring(3,5));
        $("#area").find("option:selected").text(obj.BELONG_QF.substring(5,obj.BELONG_QF.length-1));

        var tixin=$("#tixin").select2();
        var tixin2=$("#tixin2").select2();  //2017-10-28 add
        //tixin.val(obj.TIXIN.substring(1,obj.TIXIN.length-1)).trigger("change");
        tixin.val(obj.TIXIN).trigger("change");
        tixin.change();
        tixin2.val(obj.MENPAI).trigger("change");
        tixin2.change();

        $('#priceNum').val(obj.PRICE_NUM);//价格
        $('#accoInfo').val(obj.ACCO_INFO);//账号资料

        //$('.dropdown-menu li').addClass('disabled');    //2017-10-28 del
        $('.radioTest').attr("disabled",true);
        $('.areaSelect select').attr('disabled','true');
        $('.tixin').attr('disabled','true');
        $('.tixin2').attr('disabled','true');
        $('#priceNum').attr('disabled','true');
        $('#accoInfo').attr('disabled','true');
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
        var url = reportApi+'quickReleaseListSelection?mainId='+getUrlParam('mainId');
        var maxImgId=0;

        $.getJSON(url,function (data) {
            var selecttions = data.selecttions==null?"":data.selecttions;
            //填充区域选择框
            if(selecttions!="") {
                initSelections(selecttions);
            }
            var tixin = data.tixin==null?"":data.tixin;
            //初始化下拉 - 填充体型选择框
            var tixinList = data.tixinList==null?"":data.tixinList;
            if(tixinList!="") {
                initTixin(tixinList);
            }
            var info = data.info==null?"":data.info;
            if(info!=""){
                setInfo(info);
            }

            //图片加载
            var imgs='';
            $.each(data.imgList,function (i,obj) {
                var pic_path = obj.pic_path;
                imgSrc = api+'uploadFile/getImage?WENJIAN_PATH='+encodeURI(obj.pic_path);
                var record_id = obj.record_id;
                if(obj.seq_num>maxImgId){
                    maxImgId=obj.seq_num;
                }
                imgs = imgs+'<li class="upload" id="img' + record_id + '"><img src="' + imgSrc + '" width="167" height="99" /><i class="icon1" id="' + record_id + '"></i></li>';
            });
            $('#imgs').html(imgs);
            // alert(data.imgList.length);
        }).error(function () {
        }).complete(function () {
            $('#save').unbind("click");
            $('#save').click(function () {
                    var tradeType = '1';//账号交易类别
                    var belongQf = ''; //涉事区服
                    var tixin = $('#tixin').val();//门派体型
                    var tixin2 = $('#tixin2').val();//体型
                    var priceNum = $('#priceNum').val();//价格
                    var accoInfo = $('#accoInfo').val();//账号资料

                    /*tradeType = $('.dropdown.all-camera-dropdown').find("a").eq(0).text().trim();   //2017-10-28 del
                    if(tradeType=="买号"){
                        tradeType=1;
                    }else if(tradeType=="卖号"){
                        tradeType=2;
                    }else{
                        tradeType=3;
                    }*/
                    tradeType = $('input[name="tradeType"]:checked').val();     //2017-10-28 add

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
                    console.log('开始tradeType----------->'+tradeType);
                    console.log('输出----------->'+userId);
                    console.log('输出----------->'+belongQf);
                    console.log('输出tixin----------->'+tixin);
                    console.log('输出tixin2----------->'+tixin2);
                    console.log('输出----------->'+priceNum);
                    console.log('输出----------->'+accoInfo);

                    //验证
                    var submit=true;
                    if($.trim(priceNum).length>0) {
                        var reg = /^[0-9]*$/;
                        if(!reg.test(priceNum)){
                            $('#msg1').text("* 请输入正整数!");
                            submit=false;
                        }else{
                            $('#msg1').text("*");
                        }
                    }else{
                        $('#msg1').text("* 本项不可为空!");
                        submit=false;
                    }
                var imgNum =parseInt($('#fileList li').length);
                var imgTotal =parseInt($('.icon1').length);

                    if(submit){
                        if(imgNum==0) {   //无图片保存
                            if(getUrlParam('mainId') == null){
                                url = reportApi + 'saveZhssInfoNotImg?operate=save&userId=' + encodeURI(userId)
                                    + '&tradeType=' + encodeURI(tradeType)
                                    + '&belongQf=' + encodeURI(belongQf)
                                    + '&tixin=' + encodeURI(tixin)
                                    + '&tixin2=' + encodeURI(tixin2)
                                    + '&priceNum=' + encodeURI(priceNum)
                                    + '&accoInfo=' + encodeURI(accoInfo)
                                    + '&favorId=-1';
                                saveTable(url);
                            }else{
                                url = reportApi + 'saveZhssInfoNotImg?operate=update&userId=' + encodeURI(userId)
                                    + '&tradeType=' + encodeURI(tradeType)
                                    + '&belongQf=' + encodeURI(belongQf)
                                    + '&tixin=' + encodeURI(tixin)
                                    + '&tixin2=' + encodeURI(tixin2)
                                    + '&priceNum=' + encodeURI(priceNum)
                                    + '&accoInfo=' + encodeURI(accoInfo)
                                    + '&favorId=' +getUrlParam('mainId');
                                saveTable(url);
                            }
                        }else {  //有图片保存
                            if (getUrlParam('mainId') == null) {
                                // 数据封装
                                uploader.options.formData.operate = "save";
                                uploader.options.formData.userId = userId;
                                uploader.options.formData.tradeType = tradeType;
                                uploader.options.formData.belongQf = belongQf;
                                uploader.options.formData.tixin = tixin;
                                uploader.options.formData.tixin2 = tixin2;
                                uploader.options.formData.priceNum = priceNum;
                                uploader.options.formData.accoInfo = accoInfo;
                                uploader.options.formData.imgNum = imgNum;
                                uploader.upload();
                                saveTable();
                            } else {
                                // 数据封装
                                uploader.options.formData.operate = "upedit";
                                uploader.options.formData.favorId = getUrlParam('mainId');
                                uploader.options.formData.userId = userId;
                                uploader.options.formData.tradeType = tradeType;
                                uploader.options.formData.belongQf = belongQf;
                                uploader.options.formData.tixin = tixin;
                                uploader.options.formData.tixin2 = tixin2;
                                uploader.options.formData.priceNum = priceNum;
                                uploader.options.formData.accoInfo = accoInfo;
                                uploader.options.formData.imgNum = imgNum;
                                uploader.options.formData.imgTotal = imgTotal;//原图片总数
                                uploader.upload();
                                saveTable();
                            }
                        }
                    }else{
                        layer.closeAll();
                    }
            });
            $('#upedit').unbind("click");
            $('#upedit').click(function () {

                //$('.dropdown-menu li').removeClass('disabled');     //2017-10-28 del
                $('.radioTest').attr("disabled",false);
                $('.areaSelect select').removeAttr('disabled');
                $('.tixin').removeAttr('disabled');
                $('.tixin2').removeAttr('disabled');
                $('#priceNum').removeAttr('disabled');
                $('#accoInfo').removeAttr('disabled');

            });

            //initTable();
            //删除图片
            $(".icon1").click(function(){
                var id= $(this).attr("id");
                //信息框
                layer.msg('是否确定要删除图片？', {
                    time: 0 //不自动关闭
                    ,btn: ['确定', '取消']
                    ,yes: function(index){
                        //$(this).hide();
                        $("#img"+id).hide();
                        $.ajax({
                            url: reportApi+'delImgInfo?recordId='+id,
                            async: false,
                            success: function (data) {
                                layer.closeAll();
                                //跳转
                                //window.location.href = reportApi+'delImgInfo?recordId='+id;
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
                });
            });
        });

        function initTixin(data) {
            $.each(data,function (i,value) {
                var val1 = value.MENPAI_NAME;
                $('.tixin').append("  <option value="+val1+">"+val1+"</option> ");
            });
            $(".js-example-basic-single").select2();
        }

        //------------------------------------上传 Start------------------------------------
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
            threads:10,
            fileSingleSizeLimit: 1*1024*1024,//限制大小1M，单文件
            fileSizeLimit: 10*1024*1024,//限制大小10M，所有被选文件，超出选择不上
            // 文件接收服务端。
            server: reportApi + 'saveZhssInfo',
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
                '<li id="' + file.id + '" class="file-item thumbnail">' +
                '<img>' +
                '<i class="icon1 deleteImg" id="\' + record_id + \'"></i>'+
                '</li>'
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
            $('.deleteImg').unbind('click');
            $('.deleteImg').click(function () {
                $(this).parent().remove();
                uploader.removeFile( $(this).parent().attr('id'));
            });
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

        //------------------------------------上传 End------------------------------------
    }



    //获取url中的参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }
//------------------------------------Function定义 End------------------------------------

