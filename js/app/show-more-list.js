// Component to hide a list of elements after a (configurable) number
// Adds a link to show and hide the hidden list

$.fn.showMoreList = function(options) {
  // Vars
  var opts = $.extend( {}, $.fn.showMoreList.defaults, options ),
      showMoreList = $(this),
      element = $('<span class="js-hidden"></span>'),
      link = $('<a href="#" class="show-list">show all</a>'),
      listSize = $('.list-size');

  // Loop through all instances of a list block
  $.each(showMoreList, function(i) {
    var $this = $(this),
        items = $(this).children('li');

    // Check to see if the length of the list is greater than the specified
    // number to display (avoids a show all link being added by mistake)
    if(items.length > opts.show){
      // If element exists that displays the total number of elements
      // Add the show link after it, if not add after the list.
      if (listSize){
        link.insertAfter($this.next(listSize));
      } else {
        link.insertAfter($this);
      }
      element.appendTo($this);
      // Add elements to the hidden block
      $.each(items, function(i) {
        if(i + 1 > opts.show){
          $(this).appendTo(element);
        }
      });
    }
  });

  // Show/hide on click
  link.on('click', function(e){
    e.preventDefault();
    var thisElement = $(this).siblings(showMoreList).find(element),
        txt = thisElement.is(':visible') ? 'show all' : 'show less';

    thisElement.toggleClass('js-hidden');
    $(this).prev(listSize).toggleClass('js-hidden');
    link.text(txt);
  });

};

// Default options
$.fn.showMoreList.defaults = {
    show: 15
};

$(function() {
    // Dimension values list on dataset landing page
    $('.dimension-values').showMoreList({
        show: 10
    });
});
