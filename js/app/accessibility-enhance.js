$(window).load(function() {
    $('.highcharts-container').each(function() {
        var $this = $(this);
        $this.attr('aria-label', 'Chart representing data in following XLS and CSV file').attr('role', 'img');
        $this.find('svg').attr('aria-hidden', 'true');
    });
});
