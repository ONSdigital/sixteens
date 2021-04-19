$(document).ready(function() {
    $("#preview-download").click(function(e) {
        var errorDimensions = [];

        if ($(".filter-overview__error").length > 0) {
            e.preventDefault();
            return
        }

        $(".js-filter-option").each(function() {
            if ($(this).hasClass("filter-overview__add")) {
                e.preventDefault();
                $(this).removeClass("filter-overview__add");
                $(this).addClass("filter-overview__error");
                var label = $(this).find(".js-filter-option-label").html();
                if (errorDimensions.length > 0) {
                    label = " " + label;
                }
                var options = $(this).find("div.block-with-text span");
                options.html("Add at least one");
                options.addClass("form-error");
                errorDimensions.push(label);
            }
        })

        if (errorDimensions.length > 0 && $("#options-error").length === 0) {
            var breadcrumbs = $("a.breadcrumb__link")
            var landingPageUrl = breadcrumbs[breadcrumbs.length - 1].href

            $("#error-container").append("<div id=\"options-error\" class=\"font-size--16 form-error filter-overview__error-message margin-bottom--1\">Add at least one filter to '" + errorDimensions + "' to generate data</div>")
            $("#error-container").append("<div class=\"font-size--16 margin-bottom--4\"> Alternatively, return to the <a href=\""+landingPageUrl+"\">landing page</a> to download the complete dataset.</div>")
        }
    })

    $(".js-filter-option").hover(function() {
        var label = $(this).find(".js-filter-option-label");
        var labelText = label.text();
        var url = $(this).find("a").attr("href");
        var newLabel = "<a class=\"js-filter-option-label font-size-16\" href=\""+url+"\">"+labelText+"</a>"

        label.replaceWith(newLabel);
    }, function() {
        var label = $(this).find(".js-filter-option-label");
        var labelText = label.text();
        var newLabel = "<span class=\"js-filter-option-label font-size-16\">"+labelText+"</a>"

        label.replaceWith(newLabel);
    });

});
