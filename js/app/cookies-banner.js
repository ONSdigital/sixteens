// Consts
const displayCookie = "ons_cookie_message_displayed";
const preferencesCookie = "ons_cookie_policy";
const $cookiesBanner = $(".js-cookies-banner-form");

document.addEventListener("DOMContentLoaded", determineWhetherToRenderBanner());

// determineWhetherToRenderBanner() render cookie banner when cookies are not set or page is not /cookies
function determineWhetherToRenderBanner() {
  const cookiesAreNotSet = !hasCookiesPreferencesSet() || userIsOnCookiesPreferencesPage();
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

// setCookiePolicy sets a cookies policy as well as setting the banner cookie to
// being displayed
function setCookiePolicy(policy) {
  const oneYearInSeconds = 31622400;
  const currentUrl = window.location.hostname;
  const cookiesDomain = extractDomainFromUrl(currentUrl);
  const cookiesPath = "/";

  document.cookie = `${displayCookie}=true;max-age=${oneYearInSeconds};domain=${cookiesDomain};path=${cookiesPath};`;
  document.cookie = `${preferencesCookie}=${policy};max-age=${oneYearInSeconds};domain=${cookiesDomain};path=${cookiesPath};`;
}

// submitCookieForm() sets the cookie values when accepted
function submitCookieForm(e) {
  e.preventDefault();

  const acceptAllCookiesPolicy = "{'essential':true,'settings':true,'usage':true,'campaigns':true}";
  const defaultCookiesPolicy = "{'essential':true,'settings':false,'usage':false,'campaigns':false}";

  const $cookiesAcceptButton = $(".js-accept-cookies");
  const $cookiesRejectButton = $(".js-reject-cookies");
  const $cookiesAcceptText = $(".ons-js-accepted-text");
  const $cookiesRejectText = $(".ons-js-rejected-text");
  const action = document.activeElement.getAttribute("data-action");

  if ($cookiesAcceptButton || $cookiesRejectButton) {
    $cookiesAcceptButton.prop("disabled");
    $cookiesAcceptButton.addClass("btn--primary-disabled");
    $cookiesRejectButton.prop("disabled");
    $cookiesRejectButton.addClass("btn--primary-disabled");
  }

  switch (action) {
    case "accept":
      setCookiePolicy(acceptAllCookiesPolicy);
      $cookiesAcceptText.removeClass("hidden");
      break;
    case "reject":
      setCookiePolicy(defaultCookiesPolicy);
      $cookiesRejectText.removeClass("hidden");
      break;
    default:
      return;
  }

  const $informDetails = $(".js-cookies-banner-inform");
  if ($informDetails) {
    $informDetails.addClass("hidden");
  }

  const $acceptConfirmation = $(".js-cookies-banner-confirmation");
  if ($acceptConfirmation) {
    $acceptConfirmation.removeClass("hidden");
  }
}

// extractDomainFromUrl() extract and return domain
function extractDomainFromUrl(url) {
  if (url.indexOf("localhost") >= 0 || url.indexOf("127.0.0.1") >= 0) {
    return "localhost";
  }

  // top level domains (TLD/SLD) in use
  const pattern = "(\\.co\\.uk|\\.onsdigital\\.uk|\\.gov\\.uk)";
  const tlds = new RegExp(pattern);

  const isKnownDomain = tlds.test(url);

  if (isKnownDomain) {
    return url;
  }

  return "";
}

// hasCookiesPreferencesSet() check if cookie preference is set
function hasCookiesPreferencesSet() {
  return document.cookie.indexOf(`${displayCookie}=true`) > -1;
}

// userIsOnCookiesPreferencesPage() check if user in in cookie page
function userIsOnCookiesPreferencesPage() {
  const path = window.location.pathname;

  // suppress the cookies banner on the cookies preferences page
  const isCookiesPreferencesPage = path === '/cookies';
  return isCookiesPreferencesPage;
}
