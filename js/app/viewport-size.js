$(function() {
    var footers = $('footer');
    if (footers.length == 0) {
        return;
    }
    // Get the last one expected to be the main one for the page
    $(footers.get(footers.length - 1)).append("<div id='viewport-sm' class='js-viewport-size'></div>" +
        "<div id='viewport-md' class='js-viewport-size'></div>" +
        "<div id='viewport-lg' class='js-viewport-size'></div>");

    jsEnhanceViewportSize();
});

$(window).on('resize', function() {
    jsEnhanceViewportSize();
});

function clearViewportSizes() {
    $('body').removeClass('viewport-sm viewport-md viewport-lg');
}

function jsEnhanceViewportSize() {

    $.each($(".js-viewport-size"), function() {

        if ($(this).is(':visible')) {
            clearViewportSizes();
            var idName = $(this).attr('id');
            $('body').addClass(idName);
        }

    });
}
