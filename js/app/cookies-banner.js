// cookies settings
let cookiesSet = hasCookiesPreferencesSet();
let $cookiesBanner = $(".js-cookies-banner-form");

document.addEventListener("DOMContentLoaded", setDefaultConsentCookie());

document.addEventListener("DOMContentLoaded", determineWhetherToRenderBanner());

// determineWhetherToRenderBanner() render cookie banner when cookies are not set or page is not /cookies
function determineWhetherToRenderBanner() {
  let cookiesAreNotSet = !cookiesSet || userIsOnCookiesPreferencesPage();
  if (cookiesAreNotSet) {
    $cookiesBanner.removeClass("cookies-banner--hidden");
    initCookiesBanner();
  }
}

// initCookiesBanner() initialise the cookie banner if cookies are not set
function initCookiesBanner() {
  $(".js-hide-cookies-banner").click(function (e) {
    $cookiesBanner.addClass("hidden");
  });
  $cookiesBanner.on("submit", submitCookieForm);
}

// submitCookieForm() sets the cookie values when accepted
function submitCookieForm(e) {
  e.preventDefault();
  let cookiesAcceptBanner = $(".js-accept-cookies");

  cookiesAcceptBanner.prop("disabled");
  cookiesAcceptBanner.addClass("btn--primary-disabled");

  approveAllCookieTypes();
  setLegacyCookie(); // Deprecated: Only used for maintaining legacy cookie values

  $(".js-cookies-banner-inform").addClass("hidden");
  $(".js-cookies-banner-confirmation").removeClass("hidden");
}

// hasCookiesPreferencesSet() check if cookie preference is set
function hasCookiesPreferencesSet() {
  return (
    document.cookie.indexOf("cookies_preferences_set=true") > -1 ||
    document.cookie.indexOf("ons_cookie_message_displayed=true") > -1
  );
}

// userIsOnCookiesPreferencesPage() check if user in in cookie page
function userIsOnCookiesPreferencesPage() {
  let href = window.location.href.split("/");

  // check that last element in href array is 'cookies' - in case we add further pages within the cookies path
  const isCookiesPreferencesPage = href[href.length - 1] === "cookies";
  return isCookiesPreferencesPage;
}
