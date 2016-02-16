/* Load search/list results into a page without refreshing (eg when changing a filter) */

function loadNewResults(url, focus, clear) {
    // Selector classes/IDs
    var results = '.results',
        resultsText = '.search-page__results-text',
        paginationContainer = '#js-pagination-container',
        tabsContainer = '.tabs--js',
        checkboxContainer = '.js-checkbox-container',
        atozFilters = '.filters__a-z';

    //Show 'Loading...' in place of results text before Ajax starts
    updateContents(resultsText, 'Loading...');

    //Ajax request for new URL
    $.ajax({
        url: url,
        success: function (result) {
            //Results
            var newResults = $(result).find(results).html(),
                newResultsText = $(result).find(resultsText).html(),
                newTabsContainer = $(result).find(tabsContainer).html(),
                newPagination;
            if ($(result).find(paginationContainer).length > 0) {
                newPagination = $(result).find(paginationContainer).html();
            }
            replaceResults(url, newResults, newResultsText, newPagination);

            //Filters
            if ($(result).find(checkboxContainer).length > 0) {
                var $filters = $(result).find(checkboxContainer);
                $filters.each(function () {
                    replaceFilters(this);
                });
            }
            if ($(result).find(atozFilters).length > 0) {
                var $atozFilters = $(result).find(atozFilters);
                replaceFilters($atozFilters);
            }
            // Commented out as not sure this is necessary and adds complexity to the code
            //if (clear) { //Clear all filters
            //    $('.filters input, select').each(function () {
            //        var thisId = '#' + $(this).attr('id');
            //        updateContents(thisId);
            //    });
            //}

            //Tab counts (only when page has tab container and keyword search or custom dates - otherwise no update required
            if (newTabsContainer && $('.filters').find('input[type="search"], input[type="text"]')) {
                updateContents(tabsContainer, newTabsContainer);
            }

            //Put focus back onto element on page
            if (focus) {
                var focusId = '#' + focus.attr('id');
                $(focusId).focus();
            }
            insertRssLink();
        }
    });

    //Removes current results from page and loads in new results
    function replaceResults(url, newResults, newResultsText, newPagination) {
        $(results).empty();
        $(newResults).hide().appendTo(results).fadeIn(300);

        //Re-run functions done on load that are needed after Ajax
        jsEnhanceSparkline();
        jsEnhanceHover();
        timeseriesTool.refresh();

        //Update results text
        updateContents(resultsText, newResultsText);

        //Update pagination for results
        if (newPagination) {
            updateContents(paginationContainer, newPagination);
        }

        //Pushes new url into browser, if browser compatible (enhancement)
        if (typeof (history.pushState) != undefined) {
            window.history.pushState({}, '', url);
        }
    }

    //Update filters
    function replaceFilters(newFilters) {
        if ($(newFilters).is(checkboxContainer)) {
            //Detect what filters are being updated
            var checkboxId = $(newFilters).find('input').attr('id');

            //Find corresponding filters on current page
            var $checkboxFilters = $('#' + checkboxId).closest(checkboxContainer);

            //Empty and replace checkboxes
            updateContents($checkboxFilters, $(newFilters).html());
        }

        if ($(newFilters).is(atozFilters)) {
            //If page A-Z and no checkboxes
            updateContents('.js-atoz-container', newFilters);
        }

    }
}

//Remove and replaces content according to selector and results parsed into function
function updateContents(id, newContents) {
    var $element = $(id);

    //Remove values from search and text inputs
    if ($element.is('input[type="search"], input[type="text"], select') && $element.val()) {
        $element.val('');
    }

    //Replace other inputs/elements with new HTML from Ajax results
    if (newContents) {
        $element.empty();
        $element.append(newContents)
    }

    //Reset anything functions running on timeseries tool on load (ie custom date resolver)
    timeseriesTool.refresh();

}