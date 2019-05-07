$(document).ready(function() {
    var pageURL = window.location.href;
    var feedbackOrigin = window.feedbackOrigin;
    var feedbackURL = "/feedback";

    if (feedbackOrigin && feedbackOrigin.length > 0) {
        feedbackURL = feedbackOrigin + feedbackURL;
    }

    var feedbackMessage = (
        '<span id="feedback-form-confirmation" class="font-size--16">Thank you. Your feedback will help us as we continue to improve the service.</span>'
    )

    $( "#feedback-form-url" ).val(pageURL);

    $( "a.js-toggle" ).click(function(e) {
        e.preventDefault();

        var id = $(this).attr('id');
        $( "#feedback-form" ).toggleClass("js-hidden");
        $( "#feedback-form-header" ).toggleClass("js-hidden");

        if (id !== "feedback-form-close") {
            $(" #description-field ").focus();
        }
    });

    $( "#feedback-form-yes" ).click(function(e) {
        e.preventDefault();

        $.ajax({
            type: "POST",
            url: feedbackURL + "/positive",
            data: $("#feedback-form-container").serialize(),
            beforeSend: function() {
                $( "#feedback-form-header" ).html(feedbackMessage);
            }
        })
    });

    $( "#feedback-form-container" ).on("submit", function(e) {
        e.preventDefault();
        $(" #description-field ").removeClass("form-control__error");
        $(" #purpose-field ").removeClass("form-control__error");
        $(" #email-field ").removeClass("form-control__error");
        $(" .form-error ").each(function() {
            $(this).remove();
        })

        var hasErrors = false;

        if ($(" #description-field ").val() === "") {
            var descriptionError = "<span class=\"form-error\">Write some feedback</span>";
            if (!$(" #description-field-label .form-error").length) {
                $(" #description-field-label ").append( descriptionError );
                $(" #description-field ").addClass("form-control__error");
            }
            hasErrors = true
        }

        if ($(" #purpose-field ").val() === "") {
            var descriptionError = "<span class=\"form-error\">Enter a purpose</span>";
            if (!$(" #purpose-field-label .form-error").length) {
                $(" #purpose-field-label ").append( descriptionError );
                $(" #purpose-field ").addClass("form-control__error");
            }
            hasErrors = true
        }

        var email = $(" #email-field ").val();
        if (email != "") {
            var emailError = "<span class=\"form-error\">This is not a valid email address, correct it or delete it</span>";
            var emailReg = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/g;

            if ( !emailReg.test(email) ) {
                if (!$(" #email-field-label .form-error").length) {
                    $(" #email-field-label ").append( emailError );
                    $(" #email-field ").addClass("form-control__error");
                }
                hasErrors = true
            }
        }

        if (hasErrors) { return };

        $.ajax({
            type: "POST",
            url: feedbackURL,
            data: $("#feedback-form-container").serialize(),
            beforeSend: function() {
                $( "#feedback-form" ).addClass("js-hidden");
                $( "#feedback-form-header" ).removeClass("js-hidden");
                $( "#feedback-form-header" ).html(feedbackMessage);
            }
        })

        if (window.location.pathname === feedbackURL) {
            $(this).remove();
            $("h1").html("Thank you");
            var displayURL = document.referrer;
            var len = displayURL.length;
            if (len > 50) {
                displayURL = "..." + displayURL.slice(len - 50, len);
            }
            $("#feedback-description").html("<div class=\"font-size--16\"><br>Your feedback will help us to improve the website. We are unable to respond to all enquiries. If your matter is urgent, please <a href=\"/aboutus/contactus\">contact us</a>.<br><br>Return to <a class=\"underline-link\" href=\""+document.referrer+"\">"+displayURL+"</a></div>")
        }
    });

    
});