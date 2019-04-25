// gtm dataLayer push functions

// Tracking time form selections in the cmd journey
var timeForm = $('#time-form'), timeFormData;
function timeFormSubmit(){
    timeForm.submit(function () {
      timeFormData = $(this).serializeArray().reduce(function(obj, item) {
          obj[item.name] = item.value;
          return obj;
      }, {});
      gtmDataLayerTime(timeFormData);
    });
}

// Push time form data to the data layer
function gtmDataLayerTime(data) {
  var selectedTimeType = data["time-selection"];

  switch(selectedTimeType) {
    case "latest":
      var date = data["latest-month"] + ' ' + data["latest-year"];

      window.dataLayer.push({
        'event' : 'SaveTimeFilter',
        'timeFilterType' : 'I just want the latest data',
        'startMonth' : date,
        'endMonth' : date,
        'numberOfMonths' : '1'
      });
      break;

      case "single":
        var date = data["month-single"] + ' ' + data["year-single"];

        window.dataLayer.push({
          'event' : 'SaveTimeFilter',
          'timeFilterType' : 'Add a single month',
          'startMonth' : date,
          'endMonth' : date,
          'numberOfMonths' : '1'
        });
      break;


      case "range":
        var startDate = data["start-month"] + ' ' + data["start-year"],
            endDate = data["end-month"] + ' ' + data["end-year"];
        // Convert dates to calculate difference
        var newStart = new Date(startDate),
            newEnd = new Date(endDate),
            months = newEnd.getMonth() - newStart.getMonth()
            + (12 * (newEnd.getFullYear() - newStart.getFullYear()));


        window.dataLayer.push({
          'event' : 'SaveTimeFilter',
          'timeFilterType' : 'Add a range of months',
          'startMonth' : startDate,
          'endMonth' : endDate,
          'numberOfMonths' : months + 1
        });

      break;

      case "list":
        var startDate = $('.checkbox-group').find('input[type=checkbox]:checked', timeForm).last().val(),
            endDate = $('.checkbox-group').find('input[type=checkbox]:checked', timeForm).first().val(),
            dateCount = $('input[type=checkbox]:checked', timeForm).length;

        window.dataLayer.push({
          'event' : 'SaveTimeFilter',
          'timeFilterType' : 'Add months from a list',
          'startMonth' : startDate,
          'endMonth' : endDate,
          'numberOfMonths' : dateCount
        });
      break;
    }
}

if(timeForm){
  timeFormSubmit();
}

// Tracking "Goods and services" selections

var filterForm = $('#filter-form'),
    saveButton = $('input[name="save-and-return"]'),
    saveButtonLoc = 'saveGoodsServicesBottom'

function goodsFormSubmit(){

  // Store which submit button was clicked
  saveButton.on('click', function(){
    if($(this).hasClass('save-button-right')){
      saveButtonLoc = 'saveGoodsServicesRight' 
    } else {
      saveButtonLoc = 'saveGoodsServicesBottom' 
    }
  });
  
  filterForm.submit(function () {

    var selectedFilters = $('.filter-selection li span:first-child'), filters = [];
    // Build an object of selections and it's index and add to filters array
    $.each(selectedFilters, function(i) {
      var filter = {};
      i = i + 1;
      i = i < 10 ? "0" + i : i; // Makes 01, 02, 03 etc
      filter.id = 'goodsItem' + i;
      filter.name = $(this).text().trim();
      filters.push(filter);
    });

    // Create an object of key value pairs from the array
    var filtersObj = filters.reduce(function(obj, item) {
      obj[item.id] = item.name;
      return obj;
    }, {});

    // Object containing the other data we need to push
    var event = {
      'event' : saveButtonLoc,
      'goodsItemsAdded' : Object.keys(filtersObj).length,
    }
    
    // Merge the two objects together and push to the data layer
    var mergedObject = $.extend({}, filtersObj, event);
    window.dataLayer.push(
      mergedObject
    );
  });
}

if(filterForm){

    var hasBasket = document.getElementsByClassName('filter-selection').length;
    if (hasBasket) {
        goodsFormSubmit();
    }

    if(!hasBasket) {
        simpleSelectorForm()
    }
}

function simpleSelectorForm() {
    filterForm.submit(function() {
        var filterName = $('.page-intro__title').text().replace(/\s/g, '');
        var selectedFilters = $('.checkbox-group input[type=checkbox]:checked');
        //var selections = [];
        var dataLayerEvent = {
            'event': 'save' + filterName,
            'selectionsCount': selectedFilters.length
        };
        $.each(selectedFilters, function(index) {
            //selections.push(selectedFilters[index].defaultValue);
            var i = index + 1 < 10 ? "0" + (index + 1) : (index + 1);
            dataLayerEvent[filterName.toLowerCase() + i ] = selectedFilters[index].defaultValue;
        });

        //dataLayerEvent.selections = selections;
        window.dataLayer.push( dataLayerEvent )
    })
}
