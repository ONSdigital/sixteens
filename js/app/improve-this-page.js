$(document).ready(function () {
  const feedbackURLElement = document.querySelector("#feedback-api-url");
  
  if (feedbackURLElement) {
    const pageURL = window.location.href;
    const feedbackURL = feedbackURLElement.value;

    $("#feedback-form-url").val(pageURL);

    $("a.js-toggle").click(function (e) {
      e.preventDefault();

      const $id = $(this).attr("id");
      $("#feedback-form").toggleClass("js-hidden");
      $("#feedback-form-header").toggleClass("js-hidden");

      if ($id !== "feedback-form-close") {
        $("#description-field").focus();
      }
    });

    $("#feedback-form-yes").click(function (e) {
      e.preventDefault();
      let postObject = new Object();
      postObject.is_page_useful = true;
      postObject.is_general_feedback = false;
      postObject.ons_url = window.location.href;
      const postJson = JSON.stringify(postObject);

      fetchFeedbackAPI(feedbackURL, postJson);
    });

    $("#feedback-form-container").on("submit", function (e) {
      e.preventDefault();
      let $emailField = $("#email-field");
      const $nameField = $("#name-field");
      let $descriptionField = $("#description-field");
      $descriptionField.removeClass("form-control__error");
      $emailField.removeClass("form-control__error");
      $(".form-error").each(function () {
        $(this).remove();
      });

      let hasErrors = false;

      if ($descriptionField.val() === "") {
        const descriptionError =
          '<span class="form-error" role="alert">Write some feedback</span>';
        if (!$("#description-field-label .form-error").length) {
          $("#description-field-label").append(descriptionError);
          $descriptionField.addClass("form-control__error");
        }
        hasErrors = true;
      }

      const $email = $emailField.val();
      if ($email !== "") {
        let emailError;
        // If this is not the first alert then don't announce it (otherwise screen readers will battle between the two alerts)
        if (hasErrors) {
          emailError =
            '<span class="form-error" role="alert" aria-live="polite">This is not a valid email address, correct it or delete it</span>';
        } else {
          emailError =
            '<span class="form-error" role="alert">This is not a valid email address, correct it or delete it</span>';
        }

        let emailReg =
          /^[A-Za-z0-9.`!#$%&'*+-/=?^_{|}~]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/g;

        if (!emailReg.test($email)) {
          if (!$("#email-field-label .form-error").length) {
            $("#email-field-label").append(emailError);
            $emailField.addClass("form-control__error");
          }
          hasErrors = true;
        }
      }

      if (hasErrors) {
        return;
      }

      let postObject = new Object();
      postObject.is_page_useful = false;
      postObject.is_general_feedback = false;
      postObject.feedback = $descriptionField.val();
      postObject.ons_url = window.location.href;
      postObject.name = $nameField.val();
      postObject.email_address = $email;
      const postJson = JSON.stringify(postObject);

      fetchFeedbackAPI(feedbackURL, postJson);
    });
  }
});

function fetchFeedbackAPI(url, data) {
  const feedbackMessage =
    '<span id="feedback-form-confirmation" class="font-size--18">Thank you. Your feedback will help us as we continue to improve the service.</span>';

  const feedbackErrorMessage =
    '<span id="feedback-form-error" class="font-size--18">Sorry. Your feedback has failed to send.</span>';

  $.ajax({
    type: "POST",
    url: url,
    data: data,
    dataType: "json",
    contentType: "application/json",
    statusCode: {
      201: function () {
        $("#feedback-form-header").html(feedbackMessage);
      },
    },
    beforeSend: function () {
      let $formHeader = $("#feedback-form-header");
      $("#feedback-form").addClass("js-hidden");
      $formHeader.removeClass("js-hidden");
    },
    error: function () {
      $("#feedback-form-header").html(feedbackErrorMessage);
    },
  });
}
