$(function() {
    //Animate scroll to anchor on same page
    $('.js-scroll').click(function(e) {
        e.preventDefault();

        var target = this.hash;

        $('html, body').animate({
            scrollTop: $(target).offset().top
        }, 1000, function() {
            location.hash = target;

            //TODO Fix root cause of IE offsetting. Temporary fix:
            //$('html, body').scrollTop( $(location.hash).offset().top - 60 );
        });
    });

});
