
$(function() {
    //TODO - Set/cache reused selectors

    //Function to submit form
    function submitForm() {
        $(form).trigger('submit');
    }

    //Find form/filters to auto-submit & ajax results
    var form = $('form#form');
    var filters = $('#form .filters');

    //Delay form submit so user has enough time to type without constant refreshes
    var timer;
    function timedSubmit() {
        clearTimeout(timer);
        timer = setTimeout(submitForm, 500);
    }

    //Find date pickers and bind events
    if ($('#input-start-date') || $('#input-end-date')) {
        var formDates = form.find('input[type="text"]');
        $(formDates).each(function () {
            $(this).change(function() {
                submitForm();
            });
        });
    }

    //Find keyword input and bind events
    if ('#input-keywords') {
        var formKeywords = form.find('#input-keywords');
        $(formKeywords).on('paste keyup search', timedSubmit); //remove 'change' for time being, causing multiple submissions
        //TODO stop submit when removing focus from keyword input
    }

    //Find and bind events to drop-down select inputs
    if ('select') {
        var formSelect = $('select');
        $(formSelect).change(function (e) {
            //updated dropdown clears from to dates on time series tool if selected options is not custom, it does not affect the results but prevents the date selected date appear in url
            var selectInput=  $(e.target);
            var id = selectInput.attr('id');
            if('select-updated' === id) {
                if(selectInput.val() != 'custom') {
                    clearDateFilters();
                }
            }
            submitForm();
        });
    }


    function clearDateFilters() {
        $('#input-start-date, #input-start-date').each(function(){
            $(this).val('');
        });
    }

    //Find and bind events to checkboxes
    if (form.has('.filters input[type="checkbox"]')) {
        var formCheckboxes = filters.find('input[type="checkbox"]');
        //TODO - Loop each checkbox and check if in a list or on own. Then wrap with js-container (if it doesn't already have one)
        //$(formCheckboxes).each(function() {
        //    var parentList = $(this).parentsUntil($(filters), 'ul');
        //    var hasJsContainer = $(this).parentsUntil($(filters), '.js-checkbox-container');
        //    if (parentList.length > 0 && hasJsContainer.length < 1) {
        //        parentList.wrap('<div class="js-checkbox-container"></div>');
        //    } else if (hasJsContainer.length < 1) {
        //        $(this).parent().wrap('<div class="js-checkbox-container"></div>');
        //    }
        //});
        var formCheckboxContainer = form.find('.js-checkbox-container');
        $(formCheckboxContainer).on('change', formCheckboxes, function(e) {
            submitForm();
        });
    }

    //Find and bind events to pagination
    var paginationContainer = '#results';
    if (form.has(paginationContainer)) {
        $(paginationContainer).on('click', 'a.page-link', function(e) {
            e.preventDefault();
            var url = $(e.target).attr('href');
            loadNewResults(url);
            $('html, body').animate({scrollTop: $('#main').offset().top}, 1000);
        });
    }

    //Find and bind events to clear form link
    var clearAll = form.find('a[value="Reset"]');
    $(clearAll).click(function(e) {
        e.preventDefault();
        $('.search-page__results-text').empty();
        $('.search-page__results-text').append('Loading...');
        var url = $(this).attr('href');
        var clear = true;
        loadNewResults(url, clear);
    });

    //The same as above but for a-z
    if ('.filters__a-z') {
        $('.filters__a-z').wrap('<div class="js-atoz-container"></div>')
        var formAtoZ = $('.js-atoz-container');
        $(formAtoZ).on('change', '.filters__a-z input', function() {
            submitForm();
        });
    }

    //Bind form submission to store form data and run ajax function
    $(form).submit(function(e) {
        e.preventDefault();
        var url = (window.location.pathname) + '?' + $(form).serialize();
        $('.search-page__results-text').empty();
        $('.search-page__results-text').append('Loading...');
        loadNewResults(url);
        return false;
    });

});