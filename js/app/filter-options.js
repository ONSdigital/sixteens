$(document).ready(function() {
    $("#preview-download").click(function(e) {
        var errorDimensions = [];

        if ($(".filter-overview__error").length > 0) {
            e.preventDefault();
            return
        }

        $("li#filter-option").each(function() {
            if ($(this).hasClass("filter-overview__add")) {
                e.preventDefault();
                $(this).removeClass("filter-overview__add");
                $(this).addClass("filter-overview__error");
                var label = $(this).find("#filter-option-label").html();
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
            var landingPageUrl = $("a.breadcrumb__link").attr("href");

            $("#error-container").append("<div id=\"options-error\" class=\"font-size--16 form-error filter-overview__error-message margin-bottom--1\">Add at least one filter to '" + errorDimensions + "' to generate data</div>")
            $("#error-container").append("<div class=\"font-size--16 margin-bottom--4\"> Alternatively, return to the <a href=\""+landingPageUrl+"\">landing page</a> to download the complete dataset.</div>")
        }
    }) 

    if ($("li#filter-option.filter-overview__add").length > 0) {
        $("#preview-download").addClass("btn--primary-disabled");
    }

    $("li#filter-option").hover(function() {
        var label = $(this).find("#filter-option-label");
        var labelText = label.text();
        var url = $(this).find("a").attr("href");
        var newLabel = "<a id=\"filter-option-label\" class=\"font-size-16\" href=\""+url+"\">"+labelText+"</a>"

        label.replaceWith(newLabel);
    }, function() {
        var label = $(this).find("#filter-option-label");
        var labelText = label.text();
        var newLabel = "<span id=\"filter-option-label\" class=\"font-size-16\">"+labelText+"</a>"

        label.replaceWith(newLabel);
    });

});
