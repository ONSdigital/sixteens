$(window).load(function() {
    if ($('.timeseries__chart').length == 0) {
        // Enhance markdown charts
        $('.highcharts-container').each(function () {
            highchartsAccessibilityAttrs($(this), 'Chart representing data available in following XLS or CSV download');
        });
    } else {
        // Do accessibility goodness to T5
        timeseriesAccessibiliyAttrs()
    }
});

function highchartsAccessibilityAttrs(selector, labelText, removeAttrs) {
    if (!removeAttrs) {
        selector.attr('aria-label', labelText);
        selector.find('svg').attr('aria-hidden', 'true');
    } else {
        selector.attr('aria-label', '');
        selector.find('svg').attr('aria-hidden', 'false');
    }
}

function timeseriesAccessibiliyAttrs(removeAttrs) {
    highchartsAccessibilityAttrs($('.timeseries__chart'), 'Chart representing data available in table alternative. Select "table" in filters to display table', removeAttrs);
}
