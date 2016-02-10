var timeseriesTool = (function() {

    var listContainer = $(".timeseries__list-container"),
        basket = $(".timeseries__basket"),
        resultsContainer = $("#results"),
        buttons = $('.timeseries__remember, .timeseries__download'),
        noTimeseries = $('.timeseries__empty'),
        xlsForm = $("#xls-form"),
        csvForm = $("#csv-form"),
        list = $(".timeseries__list"),
        timeseriesList = {},
        timeseriesUris = [], //saved as cookie, to load selections from the server on page load
        basketCookieName = 'timeseriesbasket',
        rememberCookieName = 'rememberBasket',
        remember,
        listCount = 0,
        counter = $('.timeseries__count');


    if('/timeseriestool' === window.location.pathname) {
        initialize();
    }

    function initialize() {
        bindEvents();
        //add position:relative container for basket modal
        modalWrapper();
        //check 'Updated' select for whether Custom dates should be showing
        resolveCustomDateFilter();

        remember = getCookie(rememberCookieName);
        if (typeof remember === 'undefined') { //remember cookie never set, sets to true by default
            remember = true;
            setCookie(rememberCookieName, remember);
        }

        if (remember) {
            timeseriesUris = Cookies.getJSON(basketCookieName) || [];
            $.each(timeseriesUris, function(index, uri) {
                loadTimeseries(uri);
            });
            check($('#remember-selection'));
        } else {
            deleteCookie(basketCookieName);
        }

        function loadTimeseries(uri) {
            $.ajax({
                url: uri + '/data?description',
                success: function(data) {
                    var timeseries = {
                        uri: data.uri,
                        cdid: data.description.cdid,
                        title: data.description.title
                    };
                    timeseriesList[timeseries.cdid] = timeseries;
                    addToPage(timeseries);
                    check(findIn(resultsContainer, timeseries.cdid));
                }
            });
        }
    }

    function addToCookie(timeseries) {
        timeseriesUris.push(timeseries.uri);
        setCookie(basketCookieName, timeseriesUris);
    }

    function removeFromCookie(timeseries) {
        remove();
        setCookie(basketCookieName, timeseriesUris);

        function remove() {
            var index = -1;
            $.each(timeseriesUris, function(i, value) {
                if (timeseries.uri !== value) {
                    return true; //continue
                }
                timeseriesUris.splice(i, 1); //remove
                return false; //break loop
            });
        }
    }

    //init timeseries tool
    function bindEvents() {

        //Modal
        $('body, .timeseries__list--exit').on('click', function(e) {
            e.stopPropagation();
            listContainer.hide();
            basket.removeClass('timeseries__basket--focus');
        });

        $('.timeseries__list--exit').keydown(function(e) {
            e.stopPropagation();
            listContainer.hide();
            basket.removeClass('timeseries__basket--focus');
            basket.focus();
        });

        basket.on('click', function(e) {
            e.stopPropagation();
            listContainer.toggle();
            $(this).toggleClass('timeseries__basket--focus');
        });

        listContainer.on('click', function(e) {
            e.stopPropagation();
            listContainer.show();
        });

        //Selection
        resultsContainer.on("click", ".js-timeseriestool-select", function() {
            var checkbox = $(this);
            if (checkbox.prop('checked')) {
                select(checkbox);
            } else {
                deselect(checkbox);
            }
        });

        resultsContainer.on("click", ".js-timeseriestool-select-all", function() {
            var selectall = $(this);
            if (selectall.prop('checked')) {
                selectAll();
            } else {
                deselectAll();
            }
        });

        listContainer.on("click", "#remember-selection", function() {
            var rememberSelectionInput = $(this);
            if (rememberSelectionInput.prop('checked')) {
                setCookie(rememberCookieName, true);
            } else {
                setCookie(rememberCookieName, false);
            }
        });

        list.on("click", ".js-remove-selected", function() {
            var listElement = $(this).closest('li');
            var id = getCdid(listElement);
            removeElement(id);
            uncheck(findIn(resultsContainer, id));
            basket.focus();
        });
    }

    function selectAll() {
        getAllCheckboxes().each(function() {
            var element = $(this);
            var selected =  select(element);
            return selected;//continue if successfully selected
        });
    }

    function deselectAll() {
        getAllCheckboxes().each(function() {
            var element = $(this);
            deselect(element);
        });
    }

    function select(element) {
        if(assertMaximum()) {
            addTimeSeries(element);
            check(element);    
            return true;
        } else {
            uncheck(element);
            return false;
        }
        
    }

    function deselect(element) {
        removeTimeSeries(element);
        uncheck(element);
    }

    function uncheck(element) {
        if (element.hasClass('js-timeseriestool-select')) {
            element.prop('checked', false);
            $('.js-timeseriestool-select-all').prop('checked', false); //uncheck select all if a time series is deselected
        }
    }

    function check(element) {
        element.prop('checked', true);
    }

    //runs when time series checkbox checked
    function addTimeSeries(element) {
        var timeseries = {
            uri: element.data('uri'),
            cdid: getCdid(element),
            title: element.data('title')
        };

        if (timeseriesList.hasOwnProperty(timeseries.cdid)) {
            return; // it is already in the list    
        }
        timeseriesList[timeseries.cdid] = timeseries;
        addToPage(timeseries);
        addToCookie(timeseries);
    }

    //Add time series markup to basket, and put hidden inputs for download
    function addToPage(timeseries) {
        list.prepend(getListElementMarkup(timeseries));
        var inputMarkup = getInputMarkup(timeseries);
        xlsForm.append(inputMarkup);
        csvForm.append(inputMarkup);
        buttons.show();
        noTimeseries.hide();
        updateCount();
    }

    //Remove time series from forms and lists
    function removeTimeSeries(element) {
        var id = getCdid(element),
            uri = element.data('uri');
        removeElement(id);
    }

    function removeElement(id) {
        var timeseries = timeseriesList[id];
        delete timeseriesList[id];
        if (count(timeseriesList) === 0) {
            buttons.hide();
            noTimeseries.show();
        }
        remove(list, id);
        remove(xlsForm, id);
        remove(csvForm, id);
        removeFromCookie(timeseries);
        updateCount();
    }

    function getListElementMarkup(timeseries) {
        return '<li data-cdid="' + timeseries.cdid + '" class="flush col-wrap" data-uri="' + timeseries.uri + '"><p class="flush col col--md-22 col--lg-22">' + timeseries.title + '</p>' + '<div class="col col--md-4 col--lg-4"><button class="btn btn--primary btn--thin btn--small btn--narrow float-right margin-top-md--1 js-remove-selected">remove</button></div></li>';
    }

    function getInputMarkup(timeseries) {
        return '<input type="hidden" name="uri" data-cdid="' + timeseries.cdid + '" value="' + timeseries.uri + '"/>';
    }

    //Remove time series with given cdid in given parent element
    function remove(element, cdid) {
        findIn(element, cdid).remove();
    }

    function count(o) {
        var c = 0;
        for (var p in o) {
            if (o.hasOwnProperty(p)) ++c;
        }
        return c;
    }

    function getAllCheckboxes() {
        return $(".js-timeseriestool-select");
    }

    function findIn(parent, cdid) {
        var elem = parent.find('[data-cdid="' + cdid + '"]');
        return elem;
    }

    //returns cdid data attribute of element
    function getCdid(element) {
        return element.data('cdid');
    }

    //re-initializes various fields on js refresh of results
    function refresh() {
        resolveCustomDateFilter();
        //Checks all elements in basket on result list after results are refreshed
        getAllCheckboxes().each(function() {
            checkbox = $(this);
            if (timeseriesList.hasOwnProperty(checkbox.data('cdid'))) {
                check(checkbox);
            }
        });

        jsEnhanceShow();
    }

    function resolveCustomDateFilter() {
        var val = $('#select-updated').val();
        var fromTo = $('.js-from-to-filters');
        if ('custom' === val) {
            fromTo.show();
        } else {
            fromTo.hide();
        }
    }

    function getCookie(name) {
        return Cookies.getJSON(name);
    }

    function setCookie(name, value) {
        Cookies.set(name, value, {
            expires: (10 * 365),
            path: '',
            secure: document.secureCookies != false
        });
    }

    function deleteCookie(name, value) {
        Cookies.remove(name, {
            path: ''
        });
    }

    function modalWrapper() {
        var closestWrapper = $(listContainer).closest('div.wrapper');
        closestWrapper.wrapInner('<div class="timeseries-modal-container"></div>')
    }


    function updateCount(number) {
        listCount = count(timeseriesList);
        counter.empty().append(listCount);
        if (listCount > 0 && !counter.hasClass('timeseries__basket--active')) {
            $(counter.parent()).addClass('timeseries__basket--active');
        } else {
            $(counter.parent()).removeClass('timeseries__basket--active');
        }
    }

    function assertMaximum() {
        if (count(timeseriesList) >= 50) {
            alert("Sorry, no more than 50 time series can be selected at one time");
            return false;
        }
        return true;
    }

    //expose functions
    return {
        refresh: refresh,
    };

})();