// cookies functions
const DEFAULT_COOKIE_CONSENT = {
  essential: true,
  settings: false,
  usage: false,
  campaigns: false,
};

const COOKIE_CATEGORIES = {
  ons_cookie_policy: "essential",
  ons_cookie_message_displayed: "essential",
};

// cookie() return value of a cookie if options and value of a ccokie are present
function cookie(name, value, options) {
  if (typeof value !== "undefined") {
    if (value === false || value === null) {
      return setCookie(name, "", { days: -1 });
    } else {
      if (typeof options === "undefined") {
        options = { days: 30 };
      }
      return setCookie(name, value, options);
    }
  } else {
    return getCookie(name);
  }
}

// setLegacyCookie() set the cookie value for legacy cookie keys
// Deprecated: Only used for maintaining legacy cookie values
function setLegacyCookie() {
  let encodedCookiesPolicy = "%7B%22essential%22%3Atrue%2C%22usage%22%3Atrue%7D";
  let cookiesDomain = extractDomainFromUrl()
  let oneYearInSeconds = 31622400;
  let cookiesPath = "/";

  document.cookie = `cookies_preferences_set=${true};max-age=${oneYearInSeconds};domain=${cookiesDomain};path=${cookiesPath}`;
  document.cookie = `cookies_policy=${encodedCookiesPolicy};max-age=${oneYearInSeconds};domain=${cookiesDomain};path=${cookiesPath}`;
}

// extractDomainFromUrl() extract and return domain
// Deprecated: Only used for maintaining legacy cookie values
function extractDomainFromUrl() {
  let url = window.location.hostname;

  if (url.indexOf("localhost") >= 0 || url.indexOf("127.0.0.1") >= 0) {
    return "localhost";
  }

  // top level domains (TLD/SLD) in use
  let tlds = new RegExp("(\\.co\\.uk|\\.onsdigital\\.uk|\\.gov\\.uk)");

  let topLevelDomain = url.match(tlds)[0];
  let secondLevelDomain = url.replace(topLevelDomain, "").split(".").pop();

  return "." + secondLevelDomain + topLevelDomain;
}

// setDefaultConsentCookie() set default cookie values when a page is rendered
function setDefaultConsentCookie() {
  const defaultCookieConsent = {
    essential: true,
    settings: false,
    usage: false,
    campaigns: false,
  };
  const defaultConsentCookie = JSON.stringify(defaultCookieConsent).replace(
    /"/g,
    "'"
  );
  setCookie("ons_cookie_policy", defaultConsentCookie, { days: 365 });
}

// approveAllCookieTypes() set cookie values when cookie is clicked
function approveAllCookieTypes() {
  let approvedConsent = {
    essential: true,
    settings: true,
    usage: true,
    campaigns: true,
  };

  setCookie("ons_cookie_message_displayed", true, { days: 365 });
  setCookie(
    "ons_cookie_policy",
    JSON.stringify(approvedConsent).replace(/"/g, "'"),
    { days: 365 }
  );
}

// getConsentCookie() check and return ons_cookie_policy cookie value if present
function getConsentCookie() {
  const consentCookie = cookie("ons_cookie_policy");
  let consentCookieObj;

  if (consentCookie) {
    consentCookieObj = JSON.parse(consentCookie.replace(/'/g, '"'));

    if (typeof consentCookieObj !== "object" && consentCookieObj !== null) {
      consentCookieObj = JSON.parse(consentCookieObj.replace(/'/g, '"'));
    }
  } else {
    return null;
  }
  return consentCookieObj;
}

// checkConsentCookieCategory() check the category of a cookie 
function checkConsentCookieCategory(cookieName, cookieCategory) {
  let currentConsentCookie = getConsentCookie();
  if (!currentConsentCookie && COOKIE_CATEGORIES[cookieName]) {
    return true;
  }

  try {
    return currentConsentCookie[cookieCategory];
  } catch (e) {
    console.error(e);
    return false;
  }
}

// checkConsentCookie() check if cookie is accepted or denied if not in known category
function checkConsentCookie(cookieName, cookieValue) {
  // If we're setting the consent, session or RH_SESSION cookie OR deleting a cookie, allow by default
  if (
    cookieName === "ons_cookie_policy" ||
    cookieValue === null ||
    cookieValue === false
  ) {
    return true;
  }

  if (COOKIE_CATEGORIES[cookieName]) {
    const cookieCategory = COOKIE_CATEGORIES[cookieName];
    return checkConsentCookieCategory(cookieName, cookieCategory);
  } else {
    // Deny the cookie if it is not known to us
    return false;
  }
}

// setCookie() set the values for a given cookie
function setCookie(name, value, options) {
  const domain = getDomain(document.domain);
  let setDomain = "";

  if (domain.indexOf("localhost") === -1) {
    setDomain = "; domain=" + domain;
  }

  if (checkConsentCookie(name, value)) {
    if (typeof options === "undefined") {
      options = {};
    }

    let cookieString = `${name}=${value}${setDomain}; path=/`
    if (options.days) {
      const date = new Date();
      date.setTime(date.getTime() + options.days * 24 * 60 * 60 * 1000);
      cookieString = cookieString + "; expires=" + date.toGMTString();
    }
    if (document.location.protocol === "https:") {
      cookieString = cookieString + "; Secure";
    }
    document.cookie = cookieString;
  }
}

// getCookie() return the value of a given cookie
function getCookie(name) {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(";");
  for (let i = 0, len = cookies.length; i < len; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  return null;
}

// getDomain() return the domain name from a given url
function getDomain(domain) {
  let i = 0,
    domainName = domain,
    p = domainName.split("."),
    s = "_gd" + new Date().getTime();
  while (i < p.length - 1 && document.cookie.indexOf(s + "=" + s) == -1) {
    domainName = p.slice(-1 - ++i).join(".");
    document.cookie = s + "=" + s + ";domain=" + domainName + ";";
  }
  document.cookie =
    s + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=" + domainName + ";";
  return domainName;
}
