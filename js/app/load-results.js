
function loadNewResults(url, focus) {
    // Selector classes/IDs
    var results = '.results',
        resultsText = '.search-page__results-text',
        paginationContainer = '#js-pagination-container',
        tabsContainer = '.tabs--js',
        checkboxContainer = '.js-checkbox-container',
        atozFilters = '.filters__a-z',
        errorMsg = '.js-auto-submit__error',
        $results = $(results),
        resultsHeight = $results.height();

    // Use to stop animation event being bound/fired twice on Chrome - https://davidwalsh.name/css-animation-callback
    function whichAnimationEvent() {
        var t;
        var el = document.createElement('fakeelement');
        var animations = {
            'animation':'animationend',
            'OAnimation':'oAnimationEnd',
            'WebkitTransition':'webkitTransitionEnd'
        };

        for (t in animations) {
            if( el.style[t] !== undefined ){
                return animations[t];
            }
        }
    }
    var animationEvent = whichAnimationEvent();

    //Show 'Loading...' in place of results text before Ajax starts
    updateContents(resultsText, 'Loading...');

    //Ajax request for new URL
    $.ajax({
        url: url,
        success: function (result) {
            //Removes current results from page and loads in new results
            function replaceResults(url, newResults, newResultsText, newPagination) {
                var $newResults = $(newResults);

                $newResults.hide().appendTo(results).fadeIn(300);

                //Re-run functions done on load that are needed after Ajax
                getSparkline();
                hoverState();
                timeseriesTool.refresh();

                //Update results text
                updateContents(resultsText, newResultsText);

                if (newPagination || newPagination == '') {
                    //Update pagination for results
                    updateContents(paginationContainer, newPagination);
                }

                //Pushes new url into browser, if browser compatible (enhancement)
                if (history.pushState) {
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


            /* Run functions to replace content on page */

            //Errors
            var $errorMsg = $(errorMsg);
            var $newErrorMsg = $(result).find(errorMsg);
            $errorMsg.addClass('enhanced');
            if ($newErrorMsg.children().length > 0 || $errorMsg.children().length > 0) {
                // Replace error message/s
                $errorMsg.each(function(i) {
                    var $this = $(this),
                        id = $this.attr('id'),
                        hasError = $this.children().length > 0;

                    // Add active class for CSS animation to work
                    if (hasError && $newErrorMsg[i].children.length <= 0) {
                        // Remove old error
                        $this.one(animationEvent, function() {
                            $('#' + id).empty();
                        });
                        $this.toggleClass('active');
                    } else if (!hasError && $newErrorMsg[i].children.length > 0) {
                        // Show new error
                        $('#' + id).empty().html($newErrorMsg[i].innerHTML);
                        $this.toggleClass('active');
                    } else if (hasError && $newErrorMsg[i].children.length > 0) {
                        // Update existing error with new error
                        $('#' + id).empty().html($newErrorMsg[i].innerHTML);
                    }
                });
            }
            if (($newErrorMsg.children().length > 0)) {
                // Stop rest of replace and update results text if there's an error
                updateContents(resultsText, 'There is an error with the date you have selected.');
                return false;
            }

            // Empty results & pagination
            $results.height(resultsHeight).empty(); // Set height so that footer doesn't move around page erratically
            $('#js-pagination-container').empty();

            //Results
            var newResults = $(result).find(results).html(),
                newResultsText = $(result).find(resultsText).html(),
                newTabsContainer = $(result).find(tabsContainer).html(),
                newPagination = '';
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

            //Tab counts (only when page has tab container and keyword search or custom dates - otherwise no update required
            if (newTabsContainer && $('.filters').find('input[type="search"], input[type="text"]')) {
                updateContents(tabsContainer, newTabsContainer);
            }

            //Ensure focus back onto correct element on page
            if (focus) {
                var focusId = '#' + focus.attr('id');
                $(focusId).focus();
            }

            insertRssLink();
        }
    });

    // Revert results height to auto after Ajax is finished
    $(document).ajaxComplete(function() {
        $results.height('auto');
    });
}

//Remove and replaces content according to selector and results parsed into function
function updateContents(id, newContents) {
    var $element = $(id);

    //Remove values from search and text inputs
    if ($element.is('input[type="search"], input[type="text"], select') && $element.val()) {
        $element.val('');
    }

    //Replace other inputs/elements with new HTML from Ajax results
    if (newContents || newContents == '') {
        $element.empty();
        $element.append(newContents)
    }

    //Reset anything functions running on timeseries tool on load (ie custom date resolver)
    timeseriesTool.refresh();

}