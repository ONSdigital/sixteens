// cookies settings
const cookiesSet = hasCookiesPreferencesSet();
const cookiesBanner = $(".js-cookies-banner-form");

const oneYearInSeconds = 31622400;
const url = window.location.hostname;
const cookiesDomain = extractDomainFromUrl(url);
const cookiesPreference = true;
const encodedCookiesPolicy = "%7B%22essential%22%3Atrue%2C%22usage%22%3Atrue%7D";
const defaultCookiesPolicy = "%7B%22essential%22%3Atrue%2C";
const cookiesPath = "/";

document.addEventListener("DOMContentLoaded", determineWhetherToRenderBanner());

function determineWhetherToRenderBanner() {
    const cookiesAreNotSet = !cookiesSet || userIsOnCookiesPreferencesPage()
    if (cookiesAreNotSet) {
        cookiesBanner.removeClass("cookies-banner--hidden")
        initCookiesBanner();
    }
}

function initCookiesBanner() {
    $('.js-hide-cookies-banner').click(function (e) {
        cookiesBanner.addClass("hidden");
    });
    cookiesBanner.on('submit', submitCookieForm);
}

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
    if (action === 'accept') {
        document.cookie = `cookies_policy=${encodedCookiesPolicy};max-age=${oneYearInSeconds};domain=${cookiesDomain};path=${cookiesPath}`;
        $('.ons-js-accepted-text').removeClass('hidden');
    } else if (action === 'reject') {
        document.cookie = `cookies_policy=${defaultCookiesPolicy};max-age=${oneYearInSeconds};domain=${cookiesDomain};path=${cookiesPath}`;
        $('.ons-js-rejected-text').removeClass('hidden');
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

function hasCookiesPreferencesSet() {
    return document.cookie.indexOf("cookies_preferences_set=true") > -1;
}

function userIsOnCookiesPreferencesPage() {
    const href = window.location.href.split("/");

    // check that last element in href array is 'cookies' - in case we add further pages within the cookies path
    const isCookiesPreferencesPage = href[href.length - 1] === "cookies";
    return isCookiesPreferencesPage;
}
