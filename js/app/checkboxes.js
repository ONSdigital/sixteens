$(function() {
    var selectEl = $('.js--select-all-none').find('button'),
   		checkBoxGroup = $('.checkbox-group'),
   		checkBox = $('input', checkBoxGroup);

   	// Select button is clicked.
    selectEl.on('click', function(){
    	var el = $(this),
    		selectVal = el.attr('aria-disabled'),
    		selectID = el.attr('ID'),
    		selectWrap = el.parent();

    	// Check if button is disabled.
    	if(selectVal == 'false') {
    		// Select all checkboxes.
    		if(selectID == 'select-all'){
    			selectWrap.next(checkBoxGroup).find('input').prop('checked', true);
    		}
    		// Deselect all checkboxes.
    		if(selectID == 'select-none'){
    			selectWrap.next(checkBoxGroup).find('input').prop('checked', false);
    		}
			// Run the function to check how many checkboxes are checked.
    		checkCheckBoxes();
    	}

    	return false;
    });

    // Each time a checkbox is clicked run the fuction to check how many checkboxes are checked.
    checkBox.on('click', function(){
		checkCheckBoxes();
    });

    // Function to monitor how many checkboxes are checked.
    function checkCheckBoxes(){
    	// Loop through each instance of a checkbox grouping (so we can have more than one).
    	checkBoxGroup.each(function(i){
    		var relatedSelector = $(this).prev(),
    			selectAll = relatedSelector.find('#select-all'),
    			selectNone = relatedSelector.find('#select-none');
    		
    		// When all checkboxes are checked.
	    	if ($('input:checked', this).length == $('input', this).length) {
				selectAll.attr({'aria-disabled': 'true','disabled': 'true'}).addClass('btn--link-disabled');
				selectNone.attr('aria-disabled', 'false').removeAttr('disabled').removeClass('btn--link-disabled');
	    	// When no checkboxes are checked.
			} else if ($('input:checked', this).length == 0) {
				selectNone.attr({'aria-disabled': 'true','disabled': 'true'}).addClass('btn--link-disabled');
				selectAll.attr('aria-disabled', 'false').removeAttr('disabled').removeClass('btn--link-disabled');
			// When some checkboxes are checked.
			} else {
				selectEl.attr('aria-disabled', 'false').removeAttr('disabled').removeClass('btn--link-disabled');
			}
		});
	}
	// Run on page load.
	checkCheckBoxes();
});
