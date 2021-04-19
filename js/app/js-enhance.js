//progressive enhancement (jQuery) - JS specific to beta.ons.gov.uk, not applicable to whole pattern library

$(function() {
    // jQuery(window).load(function() {

    var browserNotSupported = (function() {
        var div = document.createElement('DIV');
        // http://msdn.microsoft.com/en-us/library/ms537512(v=vs.85).aspx
        div.innerHTML = '<!--[if lte IE 8]><I></I><![endif]-->';
        return div.getElementsByTagName('I').length > 0;
    }());


    if (browserNotSupported) {
        setTimeout(function() {
            $('#loading-overlay').fadeOut(300);
        }, 500);
    } else {
        jsEnhance();
    }



    function jsEnhance() {
        var path = $('#pagePath').text();
        setTimeout(function() {
            $('#loading-overlay').fadeOut(300);
        }, 500);
    }
});