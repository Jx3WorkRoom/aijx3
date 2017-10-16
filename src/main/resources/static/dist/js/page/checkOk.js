$(function () {
    var flag =$('.userIsvalid').text().indexOf('null');
    if(flag>-1){
        location.reload();
    }
});