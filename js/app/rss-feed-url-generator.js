$(document).ready(function() {
	insertRssLink();
});

var expectedListPageParams = ["query", "filter"];
var expectedReleaseCalPageParams = ["query", "view"];

/* Insert the RSS url into the page if the expected element id exists. */
function insertRssLink() {
	if ( $("#rss-list-link").length > 0 ) {
		$("#rss-list-link").attr("href", rssUrl(expectedListPageParams));
	}

	if ( $("#rss-calendar-link").length > 0) {
		$("#rss-calendar-link").attr("href", rssUrl(expectedReleaseCalPageParams));
	}
}

/* Generate the RSS url based on the expected params required by the current page. */
function rssUrl(expectedParameters) {
	var fullUrl = $(location).attr("href");
	var query = $(location).attr("search");
	var qs = "?rss";

	if (query.length > 0) {
		var parameters = query.replace("?", "").split("&");

		if (parameters.length > 0) {

			parameters.forEach( function(item) {
				var nameValue = item.split("=");

				if (contains(nameValue, expectedParameters)) {
					qs += "&" + nameValue[0] + "=" + nameValue[1];
				}
			});
		}
	}
	return "feed://" + $(location).attr("host") + $(location).attr("pathname") + qs;
}

function contains(valuePair, expectedParameters) {
	return ($.inArray(valuePair[0], expectedParameters) > -1) && valuePair[1];
}