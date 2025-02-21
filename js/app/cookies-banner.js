// cookies settings
const cookiesSet = hasCookiesPreferencesSet();
const cookiesBanner = $(".js-cookies-banner-form");

const oneYearInSeconds = 31622400;
const url = window.location.hostname;
const cookiesDomain = extractDomainFromUrl(url);
const cookiesPreference = true;
const encodedCookiesPolicy = "%7B%22essential%22%3Atrue%2C%22usage%22%3Atrue%7D";
const defaultCookiesPolicy = "%7B%22essential%22%3Atrue%2C%22usage%22%3Afalse%7D";
const cookiesPath = "/";

document.addEventListener("DOMContentLoaded", determineWhetherToRenderBanner());

// determineWhetherToRenderBanner() render cookie banner when cookies are not set or page is not /cookies
function determineWhetherToRenderBanner() {
    const cookiesAreNotSet = !cookiesSet || userIsOnCookiesPreferencesPage()
    if (cookiesAreNotSet) {
        cookiesBanner.removeClass("cookies-banner--hidden")
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
    
    const $acceptButton = $('.js-accept-cookies');
    const $rejectButton = $('.js-reject-cookies');
    const action = document.activeElement.getAttribute('data-action');

    if ($acceptButton || $rejectButton) {
        $acceptButton.prop('disabled');
        $acceptButton.addClass("btn--primary-disabled");
        $rejectButton.prop('disabled');
        $rejectButton.addClass("btn--primary-disabled");
    }

    document.cookie = `cookies_preferences_set=${cookiesPreference};max-age=${oneYearInSeconds};domain=${cookiesDomain};path=${cookiesPath}`;
    switch(action) {
        case 'accept':
            document.cookie = `cookies_policy=${encodedCookiesPolicy};max-age=${oneYearInSeconds};domain=${cookiesDomain};path=${cookiesPath}`;
            $('.ons-js-accepted-text').removeClass('hidden');
            break;
        case 'reject':
            document.cookie = `cookies_policy=${defaultCookiesPolicy};max-age=${oneYearInSeconds};domain=${cookiesDomain};path=${cookiesPath}`;
            $('.ons-js-rejected-text').removeClass('hidden');
            break;   
        default:
            return;                 
    }

    $('.js-cookies-banner-inform').addClass('hidden');
    $('.js-cookies-banner-confirmation').removeClass('hidden');
}

function extractDomainFromUrl(url) {
    if (url.indexOf('localhost') >= 0 || url.indexOf('127.0.0.1') >= 0) {
        return 'localhost';
    }

    // top level domains (TLD/SLD) in use
    const tlds = new RegExp("(\\.co\\.uk|\\.onsdigital\\.uk|\\.gov\\.uk)");

    const topLevelDomain = url.match(tlds)[0];
    const secondLevelDomain = url.replace(topLevelDomain, '').split('.').pop();

    return `.${secondLevelDomain}${topLevelDomain}`;
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
    const href = window.location.href.split("/");

    // check that last element in href array is 'cookies' - in case we add further pages within the cookies path
    const isCookiesPreferencesPage = href[href.length - 1] === "cookies";
    return isCookiesPreferencesPage;
}
