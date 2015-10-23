//  Ugliest code ever, copy paste stuff from pattern-library and alpha site, hence a bit messy

var renderLineChart = function(timeseries) {
	var chart = {};
	chart.years = false;
	chart.months = false;
	chart.quarters = false;
	var chartContainer = $('[data-chart]');
	var currentFrequency;
	var currentDisplay = 'chart'; //chart or table
	var currentData;
	var currentFilter = 'all'; //10yr, 5yr, all, custom
	var table = $('[data-table]');
	var customDownloads = $('[data-chart-custom]');
	var sortArray = []; //To store data on render for use in table sort

	initialize();

	function initialize() {
		//console.log(table);
		chart = window.linechart;
		chart.years = isNotEmpty(timeseries.years);
		chart.months = isNotEmpty(timeseries.months);
		chart.quarters = isNotEmpty(timeseries.quarters);
		chartControls = new ChartControls();

		var frequency = '';

		if (!(chart.years || chart.months || chart.quarters)) {
			//console.debug('No data found');
			// return; // No data to render chart with
		}

		// Order affects which frequency is selected by default on-load
		if (chart.years) {
			timeseries.years = formatData(timeseries.years)
			frequency = 'years';
		}

		if (chart.quarters) {
			timeseries.quarters = formatData(timeseries.quarters)
			frequency = 'quarters';
		}

		if (chart.months) {
			timeseries.months = formatData(timeseries.months);
			frequency = 'months';
		}

		changeFrequency(frequency);
		chartControls.initialize();
	}


	function getLinechartConfig(){
		var chartConfig;
		 $.getJSON(timeseries.uri + 'linechartconfig', function(config) {
            // console.log("Successfuly read timseries data");
            chartConfig = config; //Global variable
        }).fail(function(d, textStatus, error) {
            // console.error("Failed reading timseries, status: " + textStatus + ", error: " + error)
        });
        return chartConfig;
	}


	function changeFrequency(frequency) {
		if (currentFrequency == frequency) {
			return;
		}
		currentFrequency = frequency;
		currentData = getAllData();
		chartControls.changeDates();
		filter();
	}



	function filter() {
		// console.log("filter start");
		//Filter
		var data = getAllData();
		if (currentFilter === 'all') {
			currentData = data;
			hide(customDownloads);
		} else {
			var filter = chartControls.getFilterValues();
			var from = filter.start.year + (isQuarters() ? filter.start.quarter : '') + (isMonths() ? filter.start.month : '');
			var to = filter.end.year + (isQuarters() ? filter.end.quarter : '') + (isMonths() ? filter.end.month : '');
			from = +from; //Cast to number
			to = +to;

			try {
				$('.chart-area__controls__custom__errors').empty();
				validateFilter(from, to);
			} catch (err) {
				$('<p>' + err.message + '</p>').appendTo('.chart-area__controls__custom__errors');
				return;
			}

			var filteredData = {
				values: [],
				min: undefined
			}

			var min = undefined;
			for (i = 0; i < data.values.length; i++) {
				current = data.values[i]
				if (current.value >= from && current.value <= to) {
					filteredData.values.push(current)
					if (!min || current.y < min) {
						min = current.y;
					}
				}
			}
			filteredData.min = min;
			currentData = filteredData;
			show(customDownloads);

		}
		sortArray = []; //Remove any previously selected data from array when new frequency selected
		render();
		// console.log("filter end");
	}

	function render() {
		if (currentDisplay === 'chart') {
			hide(table);
			renderChart();
		} else {
			hide(chartContainer);
			renderTable();
			inverse = true; //Used to default table sort function to correct order
		}
	}

	function renderTable() {
		//Find empty table body to add data to
		var tbody = table.find('tbody');
		//Empty that tbody of its current contents
		tbody.empty();

		for (i = 0; i < currentData.values.length; i++) {
			current = currentData.values[i];
			tr = $(document.createElement('tr'));
			tbody.append(tr);
			tr.append('<td>' + current.name + '</td>');
			tr.append('<td>' + current.y + '</td>');

			//Populate array for sorting function with date and value
			sortArray.push({'date' : current.name, 'value' : current.y});
		}
		show(table);

	}


	function renderChart() {
		//console.log(currentData);
		chart.series[0].data = currentData.values;
		chart.xAxis.tickInterval = tickInterval(currentData.values.length);
		var min = currentData.min;
		if (min < 0) {
			min = min - 1;
		} else {
			min = 0;
		}

		chart.yAxis.min = min;
		show(chartContainer);
		chartContainer.highcharts(chart);
	}


	function validateFilter(from, to) {

		//console.debug("From: " + from);
		//console.debug("To: " + to);

		if (from === to) {
			throw new Error('Sorry, the start date and end date cannot be the same');
		} else if (to < from) {
			throw new Error('Sorry, the chosen date range is not valid');
		}
	}

	function tickInterval(length) {
		if (length <= 20) {
			return 1;
		} else if (length <= 80) {
			return 4;
		} else if (length <= 240) {
			return 12;
		} else if (length <= 480) {
			return 48;
		} else if (length <= 960) {
			return 96;
		} else {
			return 192;
		}
	}

	//Format data into high charts compatible format
	function formatData(timeseriesValues) {
		var data = {
			values: [],
			years: []
		};
		var current;
		var value;
		var i;
		var min;

		for (i = 0; i < timeseriesValues.length; i++) {
			current = timeseriesValues[i]
			value = isNotEmpty(current.value) ? current.value : null;
			if (value) {
				if (!min || +current.value < +min) {
					min = +current.value;
				}
				data.min = min;
			}

			data.values.push(enrichData(current, i));
			data.years.push(current.year);

		}
		toUnique(data.years);
		return data
	}

	function getAllData() {
		return timeseries[currentFrequency];
	}

	function enrichData(timeseriesValue) {
		var quarter = timeseriesValue.quarter;
		var year = timeseriesValue.year;
		var month = timeseriesValue.month;

		timeseriesValue.y = isNotEmpty(timeseriesValue.value) ? (+timeseriesValue.value) : null; //Cast to number
		timeseriesValue.value = +(year + (quarter ? quarterVal(quarter) : '') + (month ? monthVal(month) : ''));
		timeseriesValue.name = timeseriesValue.date; //Appears on x axis
		delete timeseriesValue.date;

		return timeseriesValue;
	}


	function hide(element) {
		element.hide();
	}

	function show(element) {
		element.show();
	}

	function monthVal(mon) {
		switch (mon.slice(0, 3).toUpperCase()) {
			case 'JAN':
				return '01'
			case 'FEB':
				return '02'
			case 'MAR':
				return '03'
			case 'APR':
				return '04'
			case 'MAY':
				return '05'
			case 'JUN':
				return '06'
			case 'JUL':
				return '07'
			case 'AUG':
				return '08'
			case 'SEP':
				return '09'
			case 'OCT':
				return '10'
			case 'NOV':
				return '11'
			case 'DEC':
				return '12'
			default:
				throw 'Invalid Month:' + mon

		}
	}

	function quarterVal(quarter) {
		switch (quarter) {
			case 'Q1':
				return 1
			case 'Q2':
				return 2
			case 'Q3':
				return 3
			case 'Q4':
				return 4
			default:
				throw 'Invalid Quarter:' + quarter

		}
	}

	function isMonths() {
		return currentFrequency === 'months';
	}

	function isQuarters() {
		return currentFrequency === 'quarters';
	}


	//Check if arrray  or string is not empty
	function isNotEmpty(array) {
		return (array && array.length > 0)
	}


	//Remove duplicate values in given array
	function toUnique(a) { //array,placeholder,placeholder
		var b = a.length;
		var c
		while (c = --b) {
			while (c--) {
				a[b] !== a[c] || a.splice(c, 1);
			}
		}
	}

	/*Chart Controls*/
	function ChartControls() {

		var element = $('[data-chart-controls]');

		function initialize() {
			bindFrequencyChangeButtons();
			bindDisplayChangeButtons();
			// bindLinkEvents();
			bindTimePeriodButtons();
			setCollapsible();
			bindCustomDateFilters();
			setYears();
			resetFilters();
		}

		function changeDates() {
			resolveQuarters();
			resolveMonths();
		}

		function setYears() {
			var years = currentData.years;
			var $fromYear = $('[data-chart-controls-from-year]');
			var $toYear = $('[data-chart-controls-to-year]');
			$fromYear.empty();
			$toYear.empty();
			$.each(years, function(value, key) {
				$fromYear.append($("<option></option>")
					.attr("value", +key).text(key));
				$toYear.append($("<option></option>")
					.attr("value", +key).text(key));
			});
		}

		function resolveQuarters() {
			fromQuarters = $('[data-chart-controls-from-quarter]');
			toQuarters = $('[data-chart-controls-to-quarter]');
			if (isQuarters()) {
				show(fromQuarters);
				show(toQuarters);
			} else {
				hide(fromQuarters);
				hide(toQuarters);
			}

		}

		function resolveMonths() {
			fromMonths = $('[data-chart-controls-from-month]');
			toMonths = $('[data-chart-controls-to-month]');
			if (isMonths()) {
				show(fromMonths);
				show(toMonths);
			} else {
				hide(fromMonths);
				hide(toMonths);
			}
		}

		function resetFilters() {
			/*
			 * Set the select options
			 */
			$('[data-chart-controls-from-month]', element).val('01');
			$('[data-chart-controls-from-quarter]', element).val(1);
			$('[data-chart-controls-from-year]', element).find('option:first-child').attr('selected', true);
			$('[data-chart-controls-to-month]', element).val(12);
			$('[data-chart-controls-to-quarter]', element).val(4);
			$('[data-chart-controls-to-year]', element).find('option:last-child').attr('selected', true);
		}


		/**
		 * Collect the values from the various controls
		 */
		function getFilterValues() {
			return {
				start: {
					year: $('[data-chart-controls-from-year]').val(),
					quarter: $('[data-chart-controls-from-quarter]').val(),
					month: $('[data-chart-controls-from-month]').val()
				},
				end: {
					year: $('[data-chart-controls-to-year]').val(),
					quarter: $('[data-chart-controls-to-quarter]').val(),
					month: $('[data-chart-controls-to-month]').val()
				}
			};
		};

		function getDisplayType() {
			$('[data-chart-controls-from-year]').val()
		}

		function bindFrequencyChangeButtons() {

			/*
			 * Add click handlers to the controls
			 */

			$('[data-chart-controls-scale]').each(function() {
				var frequency = this.value;
				if (!chart[frequency]) {
					$(this).attr("disabled", true);
					$(this).parent().addClass('btn--secondary--disabled');
				} else {
					if ($(this).data('chart-controls-scale') == currentFrequency) {
						$(this).attr('checked', true);
					}
					$(this).on('click', function(e, data) {
						var frequency = this.value;
						toggleSelectedButton();
						changeFrequency(frequency);
					});
				}
			})

			toggleSelectedButton();
		}

		function bindDisplayChangeButtons() {
			$('[data-chart-controls-type]', element).on('click', function(e, data) {
				currentDisplay = $(this).data('chart-controls-type');
				toggleSelectedButton();
				filter();

				// Changes the title above chart/table
				// Capitalise the first character
				displayTitle = currentDisplay[0].toUpperCase() + currentDisplay.slice(1);
				$('#title-type').text(displayTitle );


				//Bind click event handlebars to table headings

				var tableHeaders = $('#table thead').find('th');
				//Get header click and assign which column to sort by
				$(tableHeaders).off().click(function() {
					var column = $(this).text();
					if (column == 'Period') {
						column = 'date';
					} else if (column == 'Value') {
						column = 'value';
					}

					//Call sorting function and parse through population data array and which column it needs to sort by
					triggerSort(sortArray, column);

				});

			});
		}

		function bindCustomDateFilters() {
			$('select', element).change(function() {
				currentFilter = 'custom';
				filter();
			})
		}

		function bindTimePeriodButtons() {

			$('[data-chart-controls-range]', element).on('click', function(e) {

				var elem = $(this);
				var filterDate;
				var fromYear;
				var fromMonth;
				var fromQuarter;
				e.preventDefault();
				// toggleSelectedLink(elem);
				// toggleTimePeriodButton(elem);
				toggleSelectedButton();
				var filterValue = elem.data('chart-controls-range');
				if (filterValue === currentFilter) {
					return;
				}
				currentFilter = filterValue;
				resetFilters();


				/*
				 * Work out what the dates are
				 */

				switch (currentFilter) {
					case '10yr':
						filterDate = moment().subtract(10, 'years');
						fromMonth = filterDate.month() + 1;
						fromQuarter = filterDate.quarter() + 1;
						fromYear = filterDate.year();
						break;
					case '5yr':
						filterDate = moment().subtract(5, 'years');
						fromMonth = filterDate.month() + 1;
						fromQuarter = filterDate.quarter() + 1;
						fromYear = filterDate.year();
						break;
					case 'all':
						fromMonth = 1;
						fromQuarter = 1;
						fromYear = $('[data-chart-controls-from-year] option:first-child', element).val();
						break;
				}

				/*
				 * Set the select options
				 */
				$('[data-chart-controls-from-month]', element).find('option[value="' + pad(fromMonth, 2) + '"]').attr('selected', true);
				$('[data-chart-controls-from-quarter]', element).find('option[value="' + fromQuarter + '"]').attr('selected', true);
				$('[data-chart-controls-from-year]', element).find('option[value="' + fromYear + '"]').attr('selected', true);

				console.log(filterValue); //TO BE DELETED

				filter();
			});
		};

		function pad(number, length) {
			var str = '' + number;
			while (str.length < length) {
				str = '0' + str;
			}
			//console.log(str);
			return str;

		}


		/**
		 * Add the collape / expand behaviour to the custom date filter
		 */
		function setCollapsible() {


			// var customControl = $('[data-chart-control-custom-range]', element);
			// var elem;
			// var target;

			$('[data-chart-control-custom-trigger-for]', element).on('click', function(e) {

				// console.log('hello');
				e.preventDefault();
				toggleSelectedButton();
				toggleCollapsible();


			});
		};

		function toggleCollapsible() {
			dropdown = $('.chart-area__controls__custom');

			if (dropdown.hasClass('chart-area__controls__custom--active')) {
				// console.log('closing custom dd');
				dropdown.removeClass('chart-area__controls__custom--active');
				dropdown.stop(true, true).slideUp();
			} else {
				// console.log('opening custom dd');
				// dropdown.height(0);
				dropdown.removeClass('js-hidden');
				dropdown.hide();
				dropdown.addClass('chart-area__controls__custom--active');
				dropdown.stop(true, true).slideDown();

			}
		}

		function hideCollapsible() {
			$('.chart-area__controls__custom').slideUp;
		}

		function toggleSelectedLink(clickedElem) {
			$('a', element).removeClass('chart-area__controls__active');
			clickedElem.addClass('chart-area__controls__active');

		};

		function toggleSelectedButton() {

			// hideCollapsible();
			// setCollapsible();

			var selectedElement = $('input:checked', element);


			var customcontrols = $('.chart-area__controls__custom');
			var toggleTheCollapsible;
			var devNote;

			// $('.chart-area__controls__custom').hasClass('chart-area__controls__custom--active')

			selectedElement.each(function(index){
				var selectedElementDataAttr = $(this).attr('data-chart-control-custom-trigger-for');



				if ($(this).attr('data-chart-controls-range')){
					devNote = "time period not custom";
					if($('.chart-area__controls__custom').hasClass('chart-area__controls__custom--active')){
						toggleTheCollapsible = true;
					}
					// toggleTheCollapsible = true;
				} else if ($(this).attr('data-chart-control-custom-trigger-for')){
					devNote = "is custom";
					toggleTheCollapsible = false;
				}else{
					devNote = "not time period, not custom";
					// if($('.chart-area__controls__custom').hasClass('chart-area__controls__custom--active')){
						toggleTheCollapsible = false;
					// }
				}


				// console.log($(this).attr('data-chart-control-custom-trigger-for'));
				// var n = selectedElementDataAttr.length;
				// console.log(n);
				// if(selectedElement.attr('data-chart-control-custom-trigger-for').length() > 0){
				// 	console.log('not custom');
				// 	// if($('.chart-area__controls__custom').hasClass('chart-area__controls__custom--active')){
				// 	// 	toggleCollapsable();
				// 	// }
				// }
			});
			// console.log(devNote);
			if (toggleTheCollapsible) {
					toggleCollapsible();
				}


			// if(!selectedElement.attr('data-chart-control-custom-trigger-for')){
			// 	console.log('not custom');
			// 	// if($('.chart-area__controls__custom').hasClass('chart-area__controls__custom--active')){
			// 	// 	toggleCollapsable();
			// 	// }

			// }
			// console.log(selectedElement.attr('data-chart-control-custom-trigger-for'));
			// console.log(selectedElement);




			selectedElement.closest('.btn-group').find('.btn').removeClass('btn--secondary--active');

			selectedElement.each(function() {

				$(this).closest('.btn').addClass('btn--secondary--active');
			});

		};

		$.extend(this, {
			initialize: initialize,
			changeDates: changeDates,
			getFilterValues: getFilterValues
		});

	}

	$.extend(this, {})
	return this;

};

function removeHiddenInputs() {
	$( "input[name='fromMonth']" ).remove();
	$( "input[name='fromQuarter']" ).remove();
	$( "input[name='fromYear']" ).remove();
	$( "input[name='toMonth']" ).remove();
	$( "input[name='toQuarter']" ).remove();
	$( "input[name='toYear']" ).remove();
}

$('.dlCustomData').submit(function(){

	//Grab all the custom date values
	fromYear = $('[data-chart-controls-from-year]').val();
	fromQuarter = $('[data-chart-controls-from-quarter]').val();
	fromMonth = $('[data-chart-controls-from-month]').val();
	toYear = $('[data-chart-controls-to-year]').val();
	toQuarter = $('[data-chart-controls-to-quarter]').val();
	toMonth = $('[data-chart-controls-to-month]').val();

	// get the selected frequency
	selectedFrequency = $( ".btn--secondary--active.frequency-select" ).text();
	selectedFrequency = selectedFrequency.trim();

	switch (selectedFrequency) {
		case 'Monthly':
			// create a string to input hidden values to POST
			str = '<input type="hidden" name="fromMonth" value="'+fromMonth+'" /><input type="hidden" name="fromYear" value="'+fromYear+'" /><input type="hidden" name="toMonth" value="'+toMonth+'" /><input type="hidden" name="toYear" value="'+toYear+'" />';
			// remove any previous custom date hidden inputs
			removeHiddenInputs();
			// append the inputs to end of form
			$( ".dlCustomData" ).append(str);
			break;

		case 'Quarterly':
			// create a string to input hidden values to POST
			str = '<input type="hidden" name="fromQuarter" value="Q'+fromQuarter+'" /><input type="hidden" name="fromYear" value="'+fromYear+'" /><input type="hidden" name="toQuarter" value="Q'+toQuarter+'" /><input type="hidden" name="toYear" value="'+toYear+'" />';
			// remove any previous custom date hidden inputs
			removeHiddenInputs();
			// append the inputs to end of form
			$( ".dlCustomData" ).append(str);
			break;

		case 'Yearly':
			// create a string to input hidden values to POST
			str = '<input type="hidden" name="fromYear" value="'+fromYear+'" /><input type="hidden" name="toYear" value="'+toYear+'" />';
			// remove any previous custom date hidden inputs
			removeHiddenInputs();
			// append the inputs to end of form
			$( ".dlCustomData" ).append(str);
			break;
	}
  return true;

});