// JavaScript Document
var refreshNum = 0;
$(document).ready(function(e) {
    var userRole =null;
    var username = $('#userName').text();
    var start='http://101.132.64.51:8881';
    if(username!=""){
        $('.last').hide();
        $('#userDetails').show();
        $('#exitUser').show();
    }
    var url = start+'/testDemoRest/User/userInfo?username='+encodeURI(username);
    $.getJSON(url,function (data) {
        userRole = data.datas[0]==null?'':data.datas[0].role==null?'':data.datas[0].role;
        if(userRole.indexOf('admin')==-1){
            $('.menuelist').find('dt').eq(2).hide();
            $('.menuelist').find('dd').eq(12).hide();
            $('.menuelist').find('dd').eq(13).hide();
            $('.menuelist').find('dd').eq(14).hide();
            $('.menuelist').find('dd').eq(15).hide();
            $('.menuelist').find('dd').eq(16).hide();
        }
        var name = data.userInfo[0]==null?'':data.userInfo[0].USER_NAME==null?'':data.userInfo[0].USER_NAME;
        $('#userDetails').text(name);
    });
    // $('#userDetails').click(function () {
    //     var url ='/logout';
    //     $.getJSON(url,function (data) {
    //         console.log(data);
    //     });
    // });
    //当内容过少时，底部对齐
    function changeheight() {
        if (window.location.href.indexOf("/index.html") > -1) {
        } else {
            var height = document.documentElement.clientHeight;
            var loginheight = null;
            if (document.getElementById('mcon') != null) {
                loginheight = document.getElementById('mcon').clientHeight + 388;
                var loginID = document.getElementById('maincontent');
                // if(loginheight<height){
                //     loginID.style.height=(height-300)+"px";
                // }
            }
        }
    };
    //浏览器窗口重置
    $(window).resize(function () {
        changeheight();
    });
    changeheight();
    $('.icon-save').click(function () {
        $(this).toggleClass('cur')
        //if($(this).hasClass('cur')){
        //return;
        //}else{
        //$(this).addClass('cur')
        //}
    });
    //页面跳转
    $('.table-td').click(function () {
        //window.open('accountDetail.html')
    });
    $(".tops .icon0").click(function () {
        if ($(this).attr("class").indexOf('cur') > -1) {
            $(".icon0").removeClass('cur')
        } else {
            $(".icon0").addClass('cur')
        }
    });
    $(".classifiedList3 .icon0").click(function () {
        if ($(this).attr("class").indexOf('cur') > -1) {
            $(this).removeClass('cur')
        } else {
            $(this).addClass('cur')
        }
    });
    $(".conlist .icon0").click(function () {
        if ($(this).attr("class").indexOf('cur') > -1) {
            $(this).removeClass('cur')
        } else {
            $(this).addClass('cur')
        }
    });

    //change selectStatus
    var location = window.location.href.split('/');
    var selectStr = location[location.length - 1];
    $('.navCon').find('a').removeClass('cur');
    $('.menuelist').find('dd').removeClass('cur');
    if (selectStr.indexOf('index')>-1) {
        $('.navCon').find('a').eq(0).addClass('cur');
    } else if (selectStr.indexOf('accountList')>-1) {
        $('.navCon').find('a').eq(1).addClass('cur');
    } else if (selectStr.indexOf('appearanceSale')>-1) {
        $('.navCon').find('a').eq(2).addClass('cur');
    } else if (selectStr.indexOf('propSale')>-1) {
        $('.navCon').find('a').eq(3).addClass('cur');
    } else if (selectStr.indexOf('goldExchangeList')>-1) {
        $('.navCon').find('a').eq(4).addClass('cur');
    } else if (selectStr.indexOf('levelingList')>-1) {
        $('.navCon').find('a').eq(5).addClass('cur');
    } else if (selectStr.indexOf('blackList')>-1) {
        $('.navCon').find('a').eq(6).addClass('cur');
    } else if (selectStr.indexOf('dataAndSecurity')>-1) {
        $('.navCon').find('a').eq(7).addClass('cur');
        $('.menuelist').find('dd').eq(0).addClass('cur');
    } else if (selectStr.indexOf('dataAndSecurity')>-1) {
        $('.navCon').find('a').eq(8).addClass('cur');
        $('.menuelist').find('dd').eq(0).addClass('cur');
    } else if (selectStr.indexOf('myCollection')>-1) {
        $('.navCon').find('a').eq(8).addClass('cur');
        $('.menuelist').find('dd').eq(1).addClass('cur');
    } else if (selectStr.indexOf('myRelease')>-1) {
        $('.navCon').find('a').eq(8).addClass('cur');
        $('.menuelist').find('dd').eq(2).addClass('cur');
    } else if (selectStr.indexOf('myService')>-1) {
        $('.navCon').find('a').eq(8).addClass('cur');
        $('.menuelist').find('dd').eq(3).addClass('cur');
    } else if (selectStr.indexOf('serviceSetting')>-1) {
        $('.navCon').find('a').eq(8).addClass('cur');
        $('.menuelist').find('dd').eq(4).addClass('cur');
    } else if (selectStr.indexOf('report')>-1) {
        $('.navCon').find('a').eq(8).addClass('cur');
        $('.menuelist').find('dd').eq(4).addClass('cur');
    } else if (selectStr.indexOf('appearanceTransaction')>-1) {
        $('.navCon').find('a').eq(8).addClass('cur');
        $('.menuelist').find('dd').eq(5).addClass('cur');
    } else if (selectStr.indexOf('propTransaction')>-1) {
        $('.navCon').find('a').eq(8).addClass('cur');
        $('.menuelist').find('dd').eq(6).addClass('cur');
    } else if (selectStr.indexOf('accountTransaction')>-1) {
        $('.navCon').find('a').eq(8).addClass('cur');
        $('.menuelist').find('dd').eq(7).addClass('cur');
    } else if (selectStr.indexOf('accountExchange')>-1) {
        $('.navCon').find('a').eq(8).addClass('cur');
        $('.menuelist').find('dd').eq(8).addClass('cur');
    } else if (selectStr.indexOf('quickRelease')>-1) {
        $('.navCon').find('a').eq(8).addClass('cur');
        $('.menuelist').find('dd').eq(9).addClass('cur');
    } else if (selectStr.indexOf('detailRelease')>-1) {
        $('.navCon').find('a').eq(8).addClass('cur');
        $('.menuelist').find('dd').eq(11).addClass('cur');
    } else if (selectStr.indexOf('userList')>-1) {
        $('.navCon').find('a').eq(8).addClass('cur');
        $('.menuelist').find('dd').eq(10).addClass('cur');
    } else if (selectStr.indexOf('userManage')>-1) {
        $('.navCon').find('a').eq(8).addClass('cur');
        $('.menuelist').find('dd').eq(11).addClass('cur');
    } else if (selectStr.indexOf('userservice')>-1) {
        $('.navCon').find('a').eq(8).addClass('cur');
        $('.menuelist').find('dd').eq(12).addClass('cur');
    } else if (selectStr.indexOf('usersetting')>-1) {
        $('.navCon').find('a').eq(8).addClass('cur');
        $('.menuelist').find('dd').eq(15).addClass('cur');
    } else if (selectStr.indexOf('userimgs')>-1) {
        $('.navCon').find('a').eq(8).addClass('cur');
        $('.menuelist').find('dd').eq(13).addClass('cur');
    }
});