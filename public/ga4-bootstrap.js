(() => {
  const config = document.currentScript;
  if (!config || window.__bohoAnalyticsLoaded) return;

  function hosts(value) {
    return [...new Set(
      (value || "").split(",").map((host) => host.trim().toLowerCase()).filter(Boolean),
    )].sort();
  }

  function sameHosts(left, right) {
    return left.length > 0
      && left.length === right.length
      && left.every((host, index) => host === right[index]);
  }

  const umamiHosts = hosts(config.dataset.umamiDomains);
  const gaHosts = hosts(config.dataset.gaPublicHosts);
  const host = window.location.hostname.toLowerCase();
  const umamiScriptUrl = config.dataset.umamiScriptUrl;
  const umamiWebsiteId = config.dataset.umamiWebsiteId;
  const gaId = config.dataset.gaId;
  if (
    !sameHosts(umamiHosts, gaHosts)
    || !umamiHosts.includes(host)
    || !umamiScriptUrl
    || !umamiWebsiteId
    || !gaId
  ) return;

  const qaMarker = "boho_qa";
  let qaSuppressed = false;
  let currentMarker = null;
  try {
    currentMarker = new URLSearchParams(window.location.search).get(qaMarker);
    if (currentMarker === "1") sessionStorage.setItem(qaMarker, "1");
    if (currentMarker === "0") sessionStorage.removeItem(qaMarker);
    qaSuppressed = sessionStorage.getItem(qaMarker) === "1";
  } catch {
    qaSuppressed = currentMarker === "1";
  }

  const dntSuppressed =
    navigator.doNotTrack === "1"
    || navigator.msDoNotTrack === "1"
    || window.doNotTrack === "1";
  const suppressionReason = navigator.webdriver === true
    ? "webdriver"
    : dntSuppressed
      ? "dnt"
      : qaSuppressed
        ? "boho-qa"
        : "";
  if (suppressionReason) {
    document.documentElement.dataset.analyticsSuppressed = suppressionReason;
    return;
  }

  window.__bohoAnalyticsLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  const pendingUmamiPageviews = [];
  const umamiRetryLimit = 20;
  const umamiRetryDelay = 250;
  let umamiLoadObserved = false;
  let umamiRetryAttempts = 0;
  let umamiRetryScheduled = false;
  let lastPathname = null;
  let lastLocation = "";
  let scheduled = false;
  window.gtag("set", { send_page_view: false });
  window.gtag("js", new Date());
  setGoogleLocation();
  window.gtag("config", gaId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    anonymize_ip: true,
    send_page_view: false,
  });

  function sanitizedUrl(value) {
    if (!value) return "";
    try {
      const url = new URL(value, window.location.origin);
      if (url.protocol !== "http:" && url.protocol !== "https:") return "";
      return `${url.origin}${url.pathname || "/"}`;
    } catch {
      return "";
    }
  }

  function setGoogleLocation() {
    const pathname = window.location.pathname || "/";
    const location = `${window.location.origin}${pathname}`;
    const fields = { page_location: location, page_path: pathname };
    const referrer = lastLocation || sanitizedUrl(document.referrer);
    if (referrer) fields.page_referrer = referrer;
    window.gtag("set", fields);
    return { fields, location, pathname, referrer };
  }

  function sendUmamiPageview(pageview, umami, track) {
    track.call(umami, { website: umamiWebsiteId, url: pageview.location });
  }

  function scheduleUmamiFlush() {
    if (umamiRetryScheduled || umamiRetryAttempts >= umamiRetryLimit) return;
    umamiRetryAttempts += 1;
    umamiRetryScheduled = true;
    window.setTimeout(() => {
      umamiRetryScheduled = false;
      flushUmamiPageviews();
    }, umamiRetryDelay);
  }

  function flushUmamiPageviews() {
    const umami = window.umami;
    const track = umami && umami.track;
    if (typeof track !== "function") {
      scheduleUmamiFlush();
      return;
    }
    while (pendingUmamiPageviews.length > 0) {
      sendUmamiPageview(pendingUmamiPageviews.shift(), umami, track);
    }
  }

  function handleUmamiLoad() {
    umamiLoadObserved = true;
    flushUmamiPageviews();
  }

  function emitPageview() {
    const pathname = window.location.pathname || "/";
    if (pathname === lastPathname) return;
    const { fields, location, referrer } = setGoogleLocation();
    const pageview = { location, referrer };
    lastPathname = pathname;
    lastLocation = location;
    window.gtag("event", "page_view", fields);
    pendingUmamiPageviews.push(pageview);
    if (umamiLoadObserved) flushUmamiPageviews();
  }

  function schedulePageview() {
    if (scheduled) return;
    scheduled = true;
    window.setTimeout(() => {
      scheduled = false;
      emitPageview();
    }, 0);
  }

  for (const method of ["pushState", "replaceState"]) {
    const original = window.history[method];
    if (typeof original !== "function") continue;
    window.history[method] = function bohoAnalyticsHistoryState() {
      const result = original.apply(this, arguments);
      setGoogleLocation();
      schedulePageview();
      return result;
    };
  }
  window.addEventListener("popstate", () => {
    setGoogleLocation();
    schedulePageview();
  });
  emitPageview();

  const umami = document.createElement("script");
  umami.async = true;
  umami.src = umamiScriptUrl;
  umami.setAttribute("data-website-id", umamiWebsiteId);
  umami.setAttribute("data-domains", umamiHosts.join(","));
  umami.setAttribute("data-do-not-track", "true");
  umami.setAttribute("data-exclude-search", "true");
  umami.setAttribute("data-exclude-hash", "true");
  umami.setAttribute("data-auto-pageview", "false");
  umami.addEventListener("load", handleUmamiLoad, { once: true });
  document.head.appendChild(umami);

  const ga = document.createElement("script");
  ga.async = true;
  ga.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
  ga.setAttribute("data-ga-loader", "boho-v2");
  document.head.appendChild(ga);
})();
