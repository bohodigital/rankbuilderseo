(() => {
  const config = document.currentScript;
  if (!config || window.__rankBuilderGa4Loaded) return;

  const expectedMeasurementId = "G-3VYXZ0H1P8";
  const measurementId = config.dataset.ga4MeasurementId;
  const host = window.location.hostname.toLowerCase();
  const allowedHost =
    host === "rankbuilderseo.com" ||
    host === "www.rankbuilderseo.com" ||
    host.endsWith(".rankbuilderseo.pages.dev");
  if (measurementId !== expectedMeasurementId || !allowedHost) return;

  const qaMarker = "boho_qa";
  let suppressed = navigator.webdriver === true;
  try {
    const marker = new URLSearchParams(window.location.search).get(qaMarker);
    if (marker === "1") sessionStorage.setItem(qaMarker, "1");
    if (marker === "0") sessionStorage.removeItem(qaMarker);
    suppressed = suppressed || sessionStorage.getItem(qaMarker) === "1";
  } catch {
    suppressed =
      suppressed ||
      new URLSearchParams(window.location.search).get(qaMarker) === "1";
  }
  if (suppressed) {
    document.documentElement.dataset.ga4Suppressed = "boho-qa";
    return;
  }

  window.__rankBuilderGa4Loaded = true;
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    anonymize_ip: true,
    page_location: `${window.location.origin}${window.location.pathname}`,
  });

  const loader = document.createElement("script");
  loader.async = true;
  loader.src =
    "https://www.googletagmanager.com/gtag/js?id=" +
    encodeURIComponent(measurementId);
  loader.dataset.ga4Loader = "rankbuilder-v1";
  document.head.appendChild(loader);
})();
