$(function () {
    initPage();
});


function initPage() {

    var username = $('#userName').text();
    if(username!=""){
        $('.tasks-menu').hide();
        $('.register').hide();
        $('.username').show();
        $('.exitLogout').show();
    }

    var url =api+'index/getSysLog';
    $.getJSON(url,function (data) {
        data = data.datas==null?'--':data.datas;
        if(data!=''){
            $.each(data,function (i,value) {
                $('.log').find('ul').append("<li>"+value.RECORD_CONTENT+"</li>")
            })
        }
    });
    $('.zh').click(function () {
        window.location.href='accountList';
    });
    $('.wg').click(function () {
        window.location.href='appearanceSale';
    });
    $('.dj').click(function () {
        window.location.href='propSale';
    });
    $('.dl').click(function () {
        window.location.href='levelingList';
    });
    $('.hb').click(function () {
        window.location.href='blackList';
    });
    $('.yh').click(function () {
        window.location.href='dataAndSecurity';
    });

}