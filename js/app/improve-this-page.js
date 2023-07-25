$(document).ready(function () {
    var pageURL = window.location.href;
    var feedbackOrigin = window.feedbackOrigin;
    var useFeedbackAPI = document.querySelector("#feedback-api-enabled");
    if (document.querySelector("#feedback-api-enabled") && 
        document.querySelector("#feedback-api-enabled").value === "true" && 
        document.querySelector("#feedback-api-url")) {
        var feedbackURL = document.querySelector("#feedback-api-url").value;
    } else {
        var feedbackURL ="/feedback";
    }

    if (feedbackOrigin && feedbackOrigin.length > 0) {
        feedbackURL = feedbackOrigin + feedbackURL;
    }

    var feedbackMessage = (
        '<span id="feedback-form-confirmation" class="font-size--18">Thank you. Your feedback will help us as we continue to improve the service.</span>'
    )

    var feedbackErrorMessage = (
        '<span id="feedback-form-error" class="font-size--18">Sorry. Your feedback has failed to send.</span>'
    )

    $("#feedback-form-url").val(pageURL);

    $("a.js-toggle").click(function (e) {
        e.preventDefault();

        var id = $(this).attr('id');
        $("#feedback-form").toggleClass("js-hidden");
        $("#feedback-form-header").toggleClass("js-hidden");

        if (id !== "feedback-form-close") {
            $(" #description-field ").focus();
        }
    });

    $("#feedback-form-yes").click(function (e) {
        e.preventDefault();
        var postData = $("#feedback-form-container").serialize();
        var postObject = new Object();
        postObject.is_page_useful = true;
        postObject.is_general_feedback = false;
        postObject.ons_url  = window.location.href;
        var postJson = JSON.stringify(postObject);

        if (useFeedbackAPI && useFeedbackAPI.value === "true") { 
            $.ajax({
                type: "POST",
                url: feedbackURL,
                dataType: 'json',
                processData: false ,
                data: postJson,
                contentType: "application/json",
                beforeSend: function () {
                    var formHeader = $("#feedback-form-header")
                    $("#feedback-form").addClass("js-hidden");
                    formHeader.removeClass("js-hidden");
                },
                success: function () {
                    $("#feedback-form-header").html(feedbackMessage);
                },
                error: function () {
                    $("#feedback-form-header").html(feedbackErrorMessage);
                },
            })
        } else {
            $.ajax({
                type: "POST",
                url: feedbackURL,
                data: postData,
                beforeSend: function () {
                    var formHeader = $("#feedback-form-header")
                    $("#feedback-form").addClass("js-hidden");
                    formHeader.removeClass("js-hidden");
                },
                success: function () {
                    $("#feedback-form-header").html(feedbackMessage);
                },
                error: function () {
                    $("#feedback-form-header").html(feedbackErrorMessage);
                },
            })            
        }
    });

    $("#feedback-form-container").on("submit", function (e) {
        e.preventDefault();
        var emailField = $(" #email-field ")
        var nameField = $(" #name-field ")
        var descriptionField = $(" #description-field ")
        descriptionField.removeClass("form-control__error");
        emailField.removeClass("form-control__error");
        $(" .form-error ").each(function () {
            $(this).remove();
        })

        var hasErrors = false;

        if (descriptionField.val() === "") {
            var descriptionError = "<span class=\"form-error\" role=\"alert\">Write some feedback</span>";
            if (!$(" #description-field-label .form-error").length) {
                $(" #description-field-label ").append(descriptionError);
                descriptionField.addClass("form-control__error");
            }
            hasErrors = true
        }

        var email = emailField.val();
        if (email !== "") {
            var emailError;
            // If this is not the first alert then don't announce it (otherwise screen readers will battle between the two alerts)
            if (hasErrors) {
                emailError = "<span class=\"form-error\" role=\"alert\" aria-live=\"polite\">This is not a valid email address, correct it or delete it</span>";
            } else {
                emailError = "<span class=\"form-error\" role=\"alert\">This is not a valid email address, correct it or delete it</span>";
            }

            var emailReg = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/g;

            if (!emailReg.test(email)) {
                if (!$(" #email-field-label .form-error").length) {
                    $(" #email-field-label ").append(emailError);
                    emailField.addClass("form-control__error");
                }
                hasErrors = true
            }
        }

        if (hasErrors) {
            return
        }

        var postData = $("#feedback-form-container").serialize();
        var postObject = new Object();
        postObject.is_page_useful = false;
        postObject.is_general_feedback = false;
        postObject.feedback = descriptionField.val();
        postObject.ons_url  = window.location.href;
        postObject.name = nameField.val();
        postObject.email_address = email;
        var postJson = JSON.stringify(postObject);

        if (useFeedbackAPI && useFeedbackAPI.value === "true") { 
            $.ajax({
                type: "POST",
                url: feedbackURL,
                dataType: 'json',
                processData: false ,
                data: postJson,
                contentType: "application/json",
                beforeSend: function () {
                    var formHeader = $("#feedback-form-header")
                    $("#feedback-form").addClass("js-hidden");
                    formHeader.removeClass("js-hidden");
                },
                success: function () {
                    $("#feedback-form-header").html(feedbackMessage);
                },
                error: function () {
                    $("#feedback-form-header").html(feedbackErrorMessage);
                },
            })
        } else {
            $.ajax({
                type: "POST",
                url: feedbackURL,
                data: postData,
                beforeSend: function () {
                    var formHeader = $("#feedback-form-header")
                    $("#feedback-form").addClass("js-hidden");
                    formHeader.removeClass("js-hidden");
                },
                success: function () {
                    $("#feedback-form-header").html(feedbackMessage);
                },
                error: function () {
                    $("#feedback-form-header").html(feedbackErrorMessage);
                },
            })            
        }
    });
});

