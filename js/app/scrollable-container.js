$(function () {
    function showHideShadows(element) {
        var scrollLeft = element.scrollLeft;
        var $element = $(element);
        if (scrollLeft > 0) {
            $element.addClass('scroll-container__left-shadow')
        }
        else {
            $element.removeClass('scroll-container__left-shadow')
        }

        var scrollLeftMax = element.scrollWidth - element.clientWidth;
        // Can be greater due to iOS overscroll
        if (scrollLeft >= scrollLeftMax) {
            $element.removeClass('scroll-container__right-shadow')
        }
        else {
            $element.addClass('scroll-container__right-shadow')
        }
    }

    var observer = new ResizeObserver(function (entries) {
        for (var i = 0; i < entries.length; ++i) {
            var entry = entries[i];
            var container = entry.target;
            var $container = $(container);
            var hasOverflow = container.scrollWidth > $container.width();
            if (!hasOverflow) {
                $container.removeClass('scrollable-container__overflow');
                $container.off('scroll');
                continue;
            }
            $container.addClass('scrollable-container__overflow');
            showHideShadows(container);
            $container.on('scroll', function (event) {
                showHideShadows(event.target)
            });
        }
    });
    $('.scrollable-container').each(function (i, container) {
        $(container).wrap('<div class="scrollable-container__parent"></div>');
        observer.observe(container)
    });
});