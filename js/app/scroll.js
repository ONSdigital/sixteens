$(function() {
    //Animate scroll to anchor on same page
    $('.js-scroll').click(function(e) {
        e.preventDefault();

        var targetId = this.hash;
        var target = targetId,
            scrollOffset = $(target).offset().top;

        $('html, body').animate({
            scrollTop: scrollOffset
        }, 1000, function() {
            //Progressive enhancement (not on IE8-9) - adds location hash to url without causing page to jump to it - credit to http://lea.verou.me/2011/05/change-url-hash-without-page-jump/
            if (history.pushState) {
                history.pushState(null, null, target);
            }
        });
        $(targetId).attr('tabindex','-1');
        $(targetId).focus();
    });

});
