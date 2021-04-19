// cookies settings
var cookiesSet = hasCookiesPreferencesSet();
var cookiesBanner = $(".js-cookies-banner-form");

var oneYearInSeconds = 31622400;
var url = window.location.hostname;
var cookiesDomain = extractDomainFromUrl(url);
var cookiesPreference = true;
var encodedCookiesPolicy = "%7B%22essential%22%3Atrue%2C%22usage%22%3Atrue%7D";
var cookiesPath = "/";

document.addEventListener("DOMContentLoaded", determineWhetherToRenderBanner());

function determineWhetherToRenderBanner() {
    var cookiesAreNotSet = !cookiesSet || userIsOnCookiesPreferencesPage()
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
    var cookiesAcceptBanner = $('.js-accept-cookies');

    cookiesAcceptBanner.prop('disabled');
    cookiesAcceptBanner.addClass("btn--primary-disabled");

    document.cookie = "cookies_preferences_set=" + cookiesPreference + ";" + "max-age=" + oneYearInSeconds + ";" + "domain=" + cookiesDomain + ";" + "path=" + cookiesPath + ";";
    document.cookie = "cookies_policy=" + encodedCookiesPolicy + ";" + "max-age=" + oneYearInSeconds + ";" + "domain=" + cookiesDomain + ";" + "path=" + cookiesPath + ";";

    $('.js-cookies-banner-inform').addClass('hidden');
    $('.js-cookies-banner-confirmation').removeClass('hidden');
}

function extractDomainFromUrl(url) {
    if (url.indexOf('localhost') >= 0 || url.indexOf('127.0.0.1') >= 0) {
        return 'localhost';
    }

    // top level domains (TLD/SLD) in use
    var tlds = new RegExp('(.co.uk|.gov.uk)');

    var topLevelDomain = url.match(tlds)[0];
    var secondLevelDomain = url.replace(topLevelDomain, '').split('.').pop();

    return "." + secondLevelDomain + topLevelDomain;
}

function hasCookiesPreferencesSet() {
    return document.cookie.indexOf("cookies_preferences_set=true") > -1;
}

function userIsOnCookiesPreferencesPage() {
    var href = window.location.href.split("/");

    // check that last element in href array is 'cookies' - in case we add further pages within the cookies path
    var isCookiesPreferencesPage = href[href.length - 1] === "cookies";
    return isCookiesPreferencesPage;
}