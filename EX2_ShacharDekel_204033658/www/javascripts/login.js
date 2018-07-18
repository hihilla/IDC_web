$(function(){
    let urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('error')){
        $('#errorMessage').removeClass('hide');
    }
});