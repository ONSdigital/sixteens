// cookies settings
var cookiesSet = hasCookiesPreferencesSet();
var $cookiesBanner = $(".js-cookies-banner-form");

document.addEventListener("DOMContentLoaded", setDefaultConsentCookie());

document.addEventListener("DOMContentLoaded", determineWhetherToRenderBanner());

function determineWhetherToRenderBanner() {
  var cookiesAreNotSet = !cookiesSet || userIsOnCookiesPreferencesPage();
  if (cookiesAreNotSet) {
    $cookiesBanner.removeClass("cookies-banner--hidden");
    initCookiesBanner();
  }
}

function initCookiesBanner() {
  $(".js-hide-cookies-banner").click(function (e) {
    $cookiesBanner.addClass("hidden");
  });
  $cookiesBanner.on("submit", submitCookieForm);
}

function submitCookieForm(e) {
  e.preventDefault();
  var cookiesAcceptBanner = $(".js-accept-cookies");

  cookiesAcceptBanner.prop("disabled");
  cookiesAcceptBanner.addClass("btn--primary-disabled");

  approveAllCookieTypes();

  $(".js-cookies-banner-inform").addClass("hidden");
  $(".js-cookies-banner-confirmation").removeClass("hidden");
}

function hasCookiesPreferencesSet() {
  return (
    document.cookie.indexOf("cookies_preferences_set=true") > -1 ||
    document.cookie.indexOf("ons_cookie_message_displayed=true") > -1
  );
}

function userIsOnCookiesPreferencesPage() {
  var href = window.location.href.split("/");

  // check that last element in href array is 'cookies' - in case we add further pages within the cookies path
  var isCookiesPreferencesPage = href[href.length - 1] === "cookies";
  return isCookiesPreferencesPage;
}
