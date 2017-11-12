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
        layer.msg('代练交易发布成功！');
        setTimeout(function () { save(); }, 2000);

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
        console.log('initTable()----------->'+cheatType);
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
    //var obj = {"datas":[{"RECORD_ID":"2f6637cc-9e6e-4b76-8ef4-3ce255305afb","CREATETIME":1505375864000,"UPDATETIME":1505375864000,"ISVALID":1,"FAVOR_ID":136,"USER_ID":4548444,"NEED_TYPE":1,"BELONG_QF":"[]","FAVOR_INFO":"","FAVOR_DATE":1505375864000}]};

    var needtype=obj.NEED_TYPE;
    if(needtype=="1"){
        needtype="接代练";
    }else if(needtype=="2"){
        needtype="找代练";
    }
    $(".nav-pills ul li").parents('.nav-pills').find('.dropdown-toggle').html(needtype+'<b class="caret"></b>');//欺诈类型
    $("#pre").find("option:selected").text(obj.BELONG_QF.substring(1,3));
    $("#city").find("option:selected").text(obj.BELONG_QF.substring(3,5));
    $("#area").find("option:selected").text(obj.BELONG_QF.substring(5,obj.BELONG_QF.length-1));

    /*var tixin=$("#tixin").select2();
    tixin.val(obj.TIXIN.substring(1,obj.TIXIN.length-1)).trigger("change");
    tixin.change();*/

    $('#favorInfo').val(obj.FAVOR_INFO);//代练说明

    $('.dropdown-menu li').addClass('disabled');
    $('.areaSelect select').attr('disabled','true');
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
        var url = reportApi+'accountExchangeListSelection?mainId='+getUrlParam('mainId');
        var maxImgId=0;

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
    }).error(function () {
    }).complete(function () {
            $('#save').unbind("click");
            $('#save').click(function () {
                layer.load();
                var needtype = '1';//需求类型
                var belongQf = ''; //涉事区服
                var favorInfo = $('#favorInfo').val();;//代练说明

                needtype =$('.dropdown.all-camera-dropdown').find("a").eq(0).text().trim();
                if(needtype=="接代练"){
                    needtype=1;
                }else{
                    needtype=2;
                }

                $('.areaSelect').find('select').each(function () {
                    var text = $(this).find('option:selected').text();
                    if(text.indexOf("请选择")==-1) {
                        belongQf += text;
                    }
                });

                console.log('输出----------->'+needtype);
                console.log('输出----------->'+belongQf);
                console.log('输出----------->'+favorInfo);

                //验证
                var submit=true;
                if($.trim(favorInfo)==''){
                    $('#msg1').text("* 本项不可为空!");
                    submit=false;
                }else{
                    $('#msg1').text("*");
                }

                var imgNum =parseInt($('#fileList li').length);
                var imgTotal =parseInt($('.icon1').length);
                if(submit){
                    if(imgNum==0) {   //无图片保存
                        if(getUrlParam('mainId') == null) {
                            url = reportApi + 'saveDlddInfoNotImg?operate=save&userId=' + encodeURI(userId)
                                + '&favorId=-1'
                                + '&needtype=' + encodeURI(needtype)
                                + '&belongQf=' + encodeURI(belongQf)
                                + '&favorInfo=' + encodeURI(favorInfo);
                            saveTable(url);
                        }else{
                            url = reportApi + 'saveDlddInfoNotImg?operate=update&userId=' + encodeURI(userId)
                                + '&favorId=' +getUrlParam('mainId')
                                + '&needtype=' + encodeURI(needtype)
                                + '&belongQf=' + encodeURI(belongQf)
                                + '&favorInfo=' + encodeURI(favorInfo);
                            saveTable(url);
                        }
                    }else{  //有图片保存
                        if(getUrlParam('mainId')==null){
                            // 数据封装
                            uploader.options.formData.operate = "save";
                            uploader.options.formData.userId = userId;
                            uploader.options.formData.needtype = needtype;
                            uploader.options.formData.belongQf = belongQf;
                            uploader.options.formData.favorInfo = favorInfo;
                            uploader.options.formData.imgNum = imgNum;
                            uploader.upload();
                            saveTable();
                        }else{
                            // 数据封装
                            uploader.options.formData.operate = "upedit";
                            uploader.options.formData.favorId = getUrlParam('mainId');
                            uploader.options.formData.userId = userId;
                            uploader.options.formData.needtype = needtype;
                            uploader.options.formData.belongQf = belongQf;
                            uploader.options.formData.favorInfo = favorInfo;
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
                // layer.load();
                // var recordId = getUrlParam('mainId');
                // var needtype = '1';//需求类型
                // var belongQf = ''; //涉事区服
                // var favorInfo = $('#favorInfo').val();;//代练说明
                //
                // if(needtype=="接代练"){
                //     needtype=1;
                // }else{
                //     needtype=2;
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
                // console.log('输出----------->'+needtype);
                // console.log('输出----------->'+belongQf);
                // console.log('输出----------->'+favorInfo);
                //
                // //验证
                // var submit=true;
                // if($.trim(needtype)==''){
                //     $('#msg1').text("* 本项不可为空!");
                //     submit=false;
                // }else{
                //     $('#msg1').text("*");
                // }
                //
                // /*url = reportApi + 'saveDlddInfo?operate=upedit&userId=' + encodeURI(userId)
                //     + '&favorId=' + getUrlParam('mainId')
                //     + '&tradeType=' + encodeURI(tradeType)
                //     + '&belongQf=' + encodeURI(belongQf)
                //     + '&favorInfo=' + encodeURI(favorInfo);*/
                //
                // if(submit){
                //     //saveTable(url);
                //     //uploader.upload();
                //
                //     // 数据封装
                //     uploader.options.formData.operate = "upedit";
                //     uploader.options.formData.favorId = getUrlParam('mainId');
                //     uploader.options.formData.userId = userId;
                //     uploader.options.formData.needtype = needtype;
                //     uploader.options.formData.belongQf = belongQf;
                //     uploader.options.formData.favorInfo = favorInfo;
                //
                //     uploader.upload();
                //     saveTable();
                // }else{
                //     layer.closeAll();
                // }

                $('.dropdown-menu li').removeClass('disabled');
                $('.areaSelect select').removeAttr('disabled');
                $('.viewName').removeAttr('disabled');
                $('#priceNum').removeAttr('disabled');
                $('#favorInfo').removeAttr('disabled');

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
            // 文件接收服务端。
            server: reportApi + 'saveDlddInfo',
            //prepareNextFile:false,// 是否允许在文件传输时提前把下一个文件准备好。 对于一个文件的准备工作比较耗时，比如图片压缩，md5序列化。 如果能提前在当前文件传输期处理，可以节省总体耗时。
            //chunked:false,//是否要分片处理大文件上传。
            //chunkRetry:3,//如果某个分片由于网络问题出错，允许自动重传多少次？
            threads:10,//上传并发数。允许同时最大上传进程数。
            //fileNumLimit:10,//验证文件总数量, 超出则不允许加入队列。
            fileSingleSizeLimit: 1*1024*1024,//限制大小1M，单文件
            fileSizeLimit: 10*1024*1024,//限制大小10M，所有被选文件，超出选择不上
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

