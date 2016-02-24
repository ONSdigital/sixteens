function toggleSubnav(element) {
    element
        .toggleClass('js-expandable-active')
        .find('.js-expandable__content').toggleClass('js-nav-hidden');
}

function expandSubnav(element) {
    if (!(element.hasClass('js-expandable-active'))) {
        element
            .addClass('js-expandable-active')
            .find('.js-expandable__content')
            .removeClass('js-nav-hidden');
    }
}

function collapseSubnav(element) {
    if (element.hasClass('js-expandable-active')) {
        element
            .removeClass('js-expandable-active')
            .find('.js-expandable__content')
            .addClass('js-nav-hidden');
    }
}

function showMenu(toggleElement, menuElement) {
    toggleElement.addClass('menu-is-expanded');
    menuElement.removeClass('nav-main--hidden');
    menuElement.attr('aria-expanded', true);
}

function hideMenu(toggleElement, menuElement) {
    toggleElement.removeClass('menu-is-expanded');
    menuElement.addClass('nav-main--hidden');
    menuElement.attr('aria-expanded', false);
}

function showSearch(toggleElement, searchElement) {
    toggleElement.addClass('search-is-expanded');
    toggleElement.find('.nav--controls__icon')
        .removeClass('icon-search-1')
        .addClass('icon-cancel');
    toggleElement.find('.nav--controls__text').text('Hide');
    searchElement.removeClass('nav-search--hidden');
    searchElement.attr('aria-expanded', true);
}

function hideSearch(toggleElement, searchElement) {
    toggleElement.removeClass('search-is-expanded');
    toggleElement.find('.nav--controls__icon')
        .removeClass('icon-cancel')
        .addClass('icon-search-1');
    toggleElement.find('.nav--controls__text').text('Search');
    searchElement.addClass('nav-search--hidden');
    searchElement.attr('aria-expanded', false);
}

function cloneSecondaryNav() {
    // On mobile move secondary nav items in header to primary nav

    var $navLink = $('.js-nav-clone__link');

    if ($('body').hasClass('viewport-sm') && $('.js-nav-clone__list').find($navLink).length > 0) {
        // Remove from separate UL and add into primary
        $navLink.each(function() {
            $(this)
                .removeClass('secondary-nav__link')
                .insertAfter('.primary-nav__item:last')
                .addClass('primary-nav__link col')
                .wrap('<li class="primary-nav__item">');

        });
    } else if (!$('body').hasClass('viewport-sm') && $('.secondary-nav__item').is(':hidden')) {
        // Remove from primary nav and add into separate secondary list
        $navLink.each(function(i) {
            var index = i + 1;
           $(this)
               .unwrap()
               .removeClass('primary-nav__link col')
               .addClass('secondary-nav__link')
               .appendTo('.js-nav-clone__list li:nth-child(' + index + ')');
        });
    }
}

function clonePrimaryItems() {
    var $detectDuplicate = $('.js-nav__duplicate');

    // Clone primary nav items into sub-menu on mobile, so it can still be selected on mobile
    if ($('body').hasClass('viewport-sm') && $detectDuplicate.length == 0) {
        $('.js-expandable').each(function () {
            var $this = $(this),
                $thisHref = $this.find('a:first').attr('href'),
                $thisText = $this.find('a:first').html(),
                $childList = $this.find('.js-expandable__content'),
                $newLink = '<a class="primary-nav__child-link" href="' + $thisHref + '">' + $thisText + '</a>',
                $newItem = '<li class="primary-nav__child-item js-nav__duplicate js-expandable__child">' + $newLink + '</li>';

            $childList.prepend($newItem);
        });

    } else if (!$('body').hasClass('viewport-sm') && $detectDuplicate.length > 0) {
        $detectDuplicate.remove();
    }

    // OLD CODE
    //$primaryNav.find('.nav__expandable').each(function () {
    //    var subNav = $(this).find('.nav--primary__sub');
    //    $(this).find(' > a').clone()
    //        .removeClass()
    //        .prependTo(subNav)
    //        .wrap('<li class="nav__top-level-duplicate"></li>');
    //});
}

function cloneLanguageToggle() {
    var $toggle = $('.language--js'),
        $toggleContainer = $('.language--js__container'),
        extraClass = 'margin-top-sm--1 margin-bottom-sm--4 margin-left-sm--1';

    if ($('body').hasClass('viewport-sm') && $('#nav-primary').find($toggle).length == 0) {
        // Move toggle to menu drop-down
        $toggle.appendTo('#nav-primary')
            .addClass(extraClass);

    } else if (!$('body').hasClass('viewport-sm') && $('#nav-primary').find($toggle).length > 0) {
        // Move toggle back to original location on tablet or larger
        $toggle.appendTo($toggleContainer)
            .removeClass(extraClass);
    }
}


$(window).resize(function() {
    clonePrimaryItems();
    cloneSecondaryNav();
    cloneLanguageToggle();
});


$(document).ready(function () {
    var $primaryNav = $('#nav-primary');
    var $searchBar = $('#searchBar');
    var $navItem = $('.js-nav');
    var $expandableItem = $('.js-expandable');

    clonePrimaryItems();
    cloneSecondaryNav();
    cloneLanguageToggle();

    $primaryNav.addClass('nav-main--hidden').attr('aria-expanded', false);
    //$searchBar.addClass('nav-search--hidden').attr('aria-expanded', false);

    $expandableItem.on('click', function (event) {
        if ($('body').hasClass('viewport-sm')) {
            event.preventDefault();
            toggleSubnav($(this));
        }
    });
    
    $expandableItem.doubleTapToGo();

    // stop parent element from taking over all click events
    $('.js-expandable > .js-expandable__content').on('click', function (event) {
        event.stopPropagation();
    });

    // Menu navigation using keyboard
    $navItem.on('keydown', function(e) {
        var $this = $(this),
            $focusedItem = $('.js-expandable__child a:focus'), // only selects child item that is in focus
            keycode = e.keyCode,
            up = '38',
            down = '40',
            right = '39',
            left = '37',
            esc = '27',
            tab = '9';
        if (keycode == tab && $focusedItem) {
            $this.removeClass('primary-nav__item--focus');
            $this.next().focus();
        }
        if (keycode == esc) {
            $this.removeClass('primary-nav__item--focus');
            $this.closest('.js-nav').find('a:first').addClass('hide-children').focus();
            $this.closest('.js-nav').find('a:first').focusout(function() {
               $(this).removeClass('hide-children');
            });
        }
        if (keycode == down) {
            e.preventDefault();
            $this.addClass('primary-nav__item--focus');
            if ($focusedItem.length > 0) {
                $focusedItem.parent().next().find('a').focus();
            } else {
                $this.find('.js-expandable__child:first a').focus();
            }
        }
        if (keycode == up) {
            e.preventDefault();
            if ($focusedItem.length > 0 && $focusedItem.parent().prev().length > 0) {
                $focusedItem.parent().prev().find('a').focus();
            } else {
                $this.removeClass('primary-nav__item--focus');
                $this.find('a:first').focus();
            }
        }
        if (keycode == right) {
            e.preventDefault();
            $this.removeClass('primary-nav__item--focus');
            $this.closest('.js-nav').next().find('a:first').focus();
        }
        if (keycode == left) {
            e.preventDefault();
            $this.removeClass('primary-nav__item--focus');
            $this.closest('.js-nav').prev().find('a:first').focus();
        }
    });

    // Remove focus and styling classes if mouse hovers over nav
    $navItem.hover(function() {
        if ($navItem.find(':focus')) {
            $navItem.find(':focus').blur();
            $navItem.removeClass('primary-nav__item--focus');
        }
    });

    // Close menu on click of the page
    $('body').not('js-expandable .js-expandable__child').click(function(e) {
        e.stopPropagation();
        $('.primary-nav__item--focus').removeClass('primary-nav__item--focus');
    });


    //$('.js-expandable > a').on('keydown', function (event) {
    //    // Enter || spacebar
    //    if (event.keyCode === 13 || event.keyCode === 32) {
    //        if ($(window).width() < 767) {
    //            event.preventDefault();
    //            toggleSubnav($(this));
    //        }
    //    }
    //
    //    // Right arrow
    //    if (event.keyCode === 39) {
    //        if ($(window).width() < 767) {
    //            event.preventDefault();
    //            expandSubnav($(this));
    //        }
    //        else {
    //            // TODO: Make sure the large viewport breakpoint is exact
    //            // This should move the focus to the next nav item and expand its subnav
    //            //event.preventDefault();
    //            //var nextNode = $(this).closest('.js-expandable').next();
    //            //$(nextNode).focus();
    //        }
    //    }
    //
    //    // Left arrow
    //    if (event.keyCode === 37) {
    //        if ($(window).width() < 767) {
    //            event.preventDefault();
    //            collapseSubnav($(this));
    //        }
    //        else {
    //            // TODO: Make sure the large viewport breakpoint is exact
    //            // This should move the focus to the previous item and expand its subnav
    //            //event.preventDefault();
    //            //var previousNode = $(this).closest('.js-expandable').prev();
    //            //$(previousNode).focus();
    //        }
    //    }
    //});

    // stop parent element from taking over enter/space events
    $('.js-expandable > .nav--primary__sub').on('keydown', function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            event.stopPropagation();
        }
    });

    var $menuToggle = $('#menu-toggle').parent();
    var $searchToggle = $('#search-toggle').parent();

    $('#menu-toggle').on('click', function (event) {
        event.preventDefault();

        if ($primaryNav.hasClass('nav-main--hidden')) {
            showMenu($menuToggle, $primaryNav);
            hideSearch($searchToggle, $searchBar);
        }
        else {
            hideMenu($menuToggle, $primaryNav);
        }
    });

    $('#search-toggle').on('click', function (event) {
        event.preventDefault();
        var $searchToggle = $(this).parent();

        if ($searchBar.hasClass('nav-search--hidden')) {
            showSearch($searchToggle, $searchBar);
            hideMenu($menuToggle, $primaryNav);
        }

        else {
            hideSearch($searchToggle, $searchBar);
        }
    });


    // The following function to enable focus-tabbing through menu graciously
    // taken from Simply Accessible — thank you kindly.
    // http://simplyaccessible.com/article/better-for-accessibility

    //$(function () {
    //    //$('.primary-nav__list').setup_navigation();
    //});
    //
    //$.fn.setup_navigation = function (settings) {
    //    settings = jQuery.extend({
    //        focusClass: 'menu-focus',
    //    }, settings);
    //
    //
    //    // Set tabIndex to -1 so that links can't receive focus until menu is open
    //    $(this).find('> li > a').next('ul').find('a').attr('tabIndex', -1);
    //
    //    $(this).find('> li > a').hover(function () {
    //        $(this).closest('ul')
    //            .find('.' + settings.focusClass).removeClass(settings.focusClass)
    //            .find('a').attr('tabIndex', -1);
    //    });
    //    $(this).find('> li > a').focus(function () {
    //        $(this).closest('ul')
    //            .find('.' + settings.focusClass).removeClass(settings.focusClass)
    //            .find('a').attr('tabIndex', -1);
    //        $(this).next('ul')
    //            .addClass(settings.focusClass)
    //            .find('a').attr('tabIndex', 0);
    //    });
    //
    //    // Hide menu if click or focus occurs outside of navigation
    //    $(this).find('a').last().keydown(function (e) {
    //        if (e.keyCode === 9) {
    //            // If the user tabs out of the navigation hide all menus
    //            $('.' + settings.focusClass)
    //                .removeClass(settings.focusClass)
    //                .find('a').attr('tabIndex', -1);
    //        }
    //    });
    //    $(document).click(function () {
    //        $('.' + settings.focusClass)
    //            .removeClass(settings.focusClass)
    //            .find('a').attr('tabIndex', -1);
    //    });
    //
    //    $(this).click(function (e) {
    //        e.stopPropagation();
    //    });
    //};

});
