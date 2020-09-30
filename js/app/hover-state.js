/**
 ** Add enhanced hover/focus state styling & enable whole element to become clickable
 **/

function hoverState() {

    // Define our variables
    var trigger = $('.js-hover-click'), // Trigger class for enhanced hover/focus state
        link = trigger.find('a:first'), // Anchor for focus and click enhancement
        hoverActive = null, focusActive = null, // Flag for when hover state is active so hover & focus can't fire at same time
        originalClasses, originalChildClasses = []; // Store the elements original classes for use after hover has finished

    // Stop function if trigger class isn't found on the page
    if (!trigger.length) {
        return false;
    }

    // Add clickable area to first anchor that covers whole element
    trigger.each(function() {
        var $this = $(this);

        $this.css('position', 'relative');
        link = $this.find('a:first');
        link.append('<span class="box__clickable"></span>');
    });

    // Mapping for utility classes and their opposites
    var classMap = [];
    classMap.push({class1: 'background--white', class2: 'background--grey1'});
    classMap.push({class1: 'background--grey5', class2: 'background--grey1'});
    classMap.push({class1: 'background--grey4', class2: 'background--grey1'});
    classMap.push({class1: 'border-top--grey4-sm', class2: 'border-top--black-sm'});
    classMap.push({class1: 'border-top--grey4-md', class2: 'border-top--black-md'});
    classMap.push({class1: 'border-right--grey4-sm', class2: 'border-right--black-sm'});
    classMap.push({class1: 'border-right--grey4-md', class2: 'border-right--black-md'});
    classMap.push({class1: 'border-bottom--grey4-sm', class2: 'border-bottom--black-sm'});
    classMap.push({class1: 'border-bottom--grey4-md', class2: 'border-bottom--black-md'});
    classMap.push({class1: 'border-left--grey4-sm', class2: 'border-left--black-sm'});
    classMap.push({class1: 'border-left--grey4-md', class2: 'border-left--black-md'});
    classMap.push({class1: 'icon-arrow-right--dark', class2: 'icon-arrow-right--light'});
    classMap.push({class1: 'image-background', class2: 'image-background--grey4'});
    classMap.push({class1: 'border-top--grey4-sm', class2: 'border-top--black-sm'});
    classMap.push({class1: 'border-top--grey5-sm', class2: 'border-top--grey2-sm'});
    classMap.push({class1: 'border-left--grey5-sm', class2: 'border-left--grey2-sm'});
    classMap.push({class1: 'border-right--grey5-sm', class2: 'border-right--grey2-sm'});
    classMap.push({class1: 'border-top--grey5-md', class2: 'border-top--grey2-md'});
    classMap.push({class1: 'border-left--grey5-md', class2: 'border-left--grey2-md'});
    classMap.push({class1: 'border-right--grey5-md', class2: 'border-right--grey2-md'});
    classMap.push({class1: 'border-bottom--grey5-md', class2: 'border-bottom--grey2-md'});


    // Loop through array and swap matching classes
    var len = classMap.length;

    // Function to swap classes
    function swapClasses($this) {

        var elemClasses = $this.attr('class'),
            matchingChild,
            matchingChildLen,
            matchingChildClasses,
            i = 0;

        // Replace classes on hovered element
        for (i; i < len; i++) {
            var obj = classMap[i],
                class1 = obj.class1,
                class2 = obj.class2;

            if (elemClasses.indexOf(class1) >= 0) {
                elemClasses = elemClasses.replace(class1, class2);
            }

            // Detect if utility classes used on any children elements, if so leave a flag
            matchingChild = $this.find('.' + class1);
            matchingChildLen = matchingChild.length;
            if (matchingChildLen) {
                matchingChildClasses = matchingChild.attr('class');
                matchingChild.attr('class', matchingChildClasses + ' js-hover-click--child')
            }
        }
        $this.attr('class', elemClasses);

        // Replace classes on any children elements too
        $('.js-hover-click--child').each(function(index) {
            var $this = $(this);
            originalChildClasses[index] = $this.attr('class');


            $(classMap).each(function(i) {
                var obj = classMap[i],
                    class1 = obj.class1,
                    class2 = obj.class2;

                if ($this.hasClass(class1)) {
                    var childClasses = $this.attr('class');
                    childClasses = childClasses.replace(class1, class2);
                    $this.attr('class', childClasses);
                }
            });
        });

        // Don't allow the function to run twice at one time (focus and hover combined)
    }

    // Remove hover/focus classes
    function removeHoverClasses($this, originalClasses) {
        $this.attr('class', originalClasses);
    }
    function removeChildHoverClasses(originalChildClasses) {
        $('.js-hover-click--child').each(function(index) {
            $(this).attr('class', originalChildClasses[index].replace(/\ js-hover-click--child/g, ''));
        });
    }

    // Swap classes on hover and return to original state once hover over
    trigger.hover(function() {
        if (!focusActive) {
            var $this = $(this);
            originalClasses = $this.attr('class');
            swapClasses($this);
            hoverActive = true;
        }
    }, function() {
        if (!focusActive) {
            removeHoverClasses($(this), originalClasses);
            removeChildHoverClasses(originalChildClasses);
            hoverActive = null;
        }
    });

    // Add hover styling on focus
    trigger.find('a').focus(function() {
        if (!hoverActive) {
            var $this = $(this).closest(trigger),
                originalClasses = $this.attr('class');
            if ($this.parent(trigger).length) {
                swapClasses($this);
                focusActive = true;
                $this.focusout(function () {
                    removeHoverClasses($(this), originalClasses);
                    removeChildHoverClasses(originalChildClasses);
                    focusActive = null;
                });
            }
        }
    });
}

$(function() {
   hoverState();
});
