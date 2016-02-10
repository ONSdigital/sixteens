$(document).ready(function() {
	insertRssLink();
});

function isRssPage() {
	return ($("#rss-link").length > 0);
}

function insertRssLink() {
	if (isRssPage()) {
		$("#rss-link").attr("href", buildUrl().get());
	}
}

function buildUrl() {
	var rssUrl = { values: [],
		get : function() {
			var queryStr = "";
			this.values.forEach(function(item) {
				queryStr += item;
			});
			return "feed://" + $(location).attr("host") + "/rss" + queryStr;
		}
	};

	rssUrl.values.push("?uri=" + $(location).attr("pathname"));
	var fullUrl = $(location).attr("href");

	if (fullUrl.indexOf("?") > -1) {
		var parameters = fullUrl.substring(fullUrl.indexOf("?"), fullUrl.length).replace("?", "").split("&");

		if (parameters.length > 0) {

			parameters.forEach( function(item) {
				var nameValue = item.split("=");

				if (("query" == nameValue[0] || "filter" == nameValue[0])  && nameValue[1]) {
					rssUrl.values.push("&" + nameValue[0] + "=" + nameValue[1]);
				}
			});
		} 
	}
	return rssUrl;
}