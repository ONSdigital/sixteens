/**
 * Created by crispin on 28/10/2015.
 */


//Toggles between showing and hiding content on click. Possible replacement for accordion.js in the future.

// Credit goes to Heydon Pickering (http://heydonworks.com/practical_aria_examples/#progressive-collapsibles)

function showHide(remove) {
    var showHideTrigger = $('.js-show-hide .js-show-hide__title');

    if (showHideTrigger.length > 0) {
        showHideTrigger.each(function (i) {
            var $this = $(this),
                panel = $this.next(),
                button = $this.children('button');

            if (!remove) {

                // create unique id for a11y relationship
                var id = 'collapsible-' + $this.index();

                if ($this.hasClass('is-shown')) {
                    var bool = false;
                } else {
                    var bool = true;
                }

                // wrap the content and make it focusable
                $this.nextUntil('.js-show-hide__title').attr({id: id, 'aria-hidden': bool});

                // inverse the boolean value
                bool = !bool;

                // Add the button inside the title so both the heading and button semantics are read - if prevents multiple buttons being added
                if (button.length == 0) {
                    $this.wrapInner('<button class="js-show-hide__button" type="button" aria-expanded="' + bool + '" aria-controls="' + id + '">');
                }
                button = $this.children('button');

                // Toggle the state properties on click
                button.on('click', function () {
                    var state = $(this).attr('aria-expanded') === 'false' ? true : false;
                    $(this).attr('aria-expanded', state);
                    panel.attr('aria-hidden', !state);
                });
            } else {
                // Set filters to show
                $this.children('button').attr('aria-expanded', 'true');
                panel.attr('aria-hidden', 'false');

                // Remove show/hide functionality
                var heading = $this.children('button').contents();
                heading.unwrap();
            }
        });
    }
}

showHide();
