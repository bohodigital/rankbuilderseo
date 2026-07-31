import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const source = await readFile(new URL("../public/ga4-bootstrap.js", import.meta.url), "utf8");
const production = {
  host: "rankbuilderseo.com",
  alternateHost: "www.rankbuilderseo.com",
  gaId: "G-3VYXZ0H1P8",
  umamiWebsiteId: "297e47a1-fd92-42f1-a34d-5a7698e8a58f",
};

function execute({
  host = production.host,
  pathname = "/articles/example",
  search = "?boho_qa=0&email=private%40example.com",
  hash = "#private",
  referrer = "https://referrer.example/from?token=private#fragment",
  webdriver = false,
  doNotTrack = "0",
  windowDoNotTrack = "0",
  storage = new Map(),
  storageThrows = false,
  existingWindow = {},
  umamiDomains = `${production.host},${production.alternateHost}`,
  gaHosts = `${production.host},${production.alternateHost}`,
} = {}) {
  const appended = [];
  const timers = [];
  const timerDelays = [];
  const listeners = new Map();
  const documentElement = { dataset: {} };
  const config = { dataset: {
    umamiScriptUrl: "https://analytics.bohodigitalservices.com/script.js",
    umamiWebsiteId: production.umamiWebsiteId,
    umamiDomains,
    gaId: production.gaId,
    gaPublicHosts: gaHosts,
  } };
  const document = {
    currentScript: config,
    documentElement,
    referrer,
    head: { appendChild(script) { appended.push(script); } },
    createElement() {
      const attributes = new Map();
      const scriptListeners = new Map();
      return {
        async: false,
        src: "",
        setAttribute(name, value) { attributes.set(name, String(value)); },
        getAttribute(name) { return attributes.get(name) ?? null; },
        addEventListener(name, callback) { scriptListeners.set(name, callback); },
        dispatch(name) { scriptListeners.get(name)?.(); },
      };
    },
  };
  const sessionStorage = {
    getItem(key) {
      if (storageThrows) throw new Error("storage unavailable");
      return storage.has(key) ? storage.get(key) : null;
    },
    setItem(key, value) {
      if (storageThrows) throw new Error("storage unavailable");
      storage.set(key, value);
    },
    removeItem(key) {
      if (storageThrows) throw new Error("storage unavailable");
      storage.delete(key);
    },
  };
  const location = {
    hostname: host,
    origin: `https://${host}`,
    pathname,
    search,
    hash,
  };
  function setLocation(value) {
    const url = new URL(value, `${location.origin}${location.pathname}${location.search}${location.hash}`);
    Object.assign(location, {
      hostname: url.hostname,
      origin: url.origin,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
    });
  }
  const history = {
    pushState(_state, _unused, url) { if (url != null) setLocation(url); },
    replaceState(_state, _unused, url) { if (url != null) setLocation(url); },
  };
  const window = {
    ...existingWindow,
    location,
    history,
    doNotTrack: windowDoNotTrack,
    setTimeout(callback, delay = 0) {
      timers.push(callback);
      timerDelays.push(delay);
      return timers.length;
    },
    addEventListener(name, callback) { listeners.set(name, callback); },
  };
  vm.runInNewContext(source, {
    URL,
    URLSearchParams,
    document,
    encodeURIComponent,
    navigator: { webdriver, doNotTrack, msDoNotTrack: doNotTrack },
    sessionStorage,
    window,
  });
  return {
    appended,
    documentElement,
    storage,
    window,
    pendingTimers() { return timers.length; },
    scheduledDelays() { return [...timerDelays]; },
    runTimers(limit = 1000) {
      let count = 0;
      while (timers.length > 0) {
        if (count >= limit) throw new Error(`timer limit exceeded: ${limit}`);
        count += 1;
        timers.shift()();
      }
      return count;
    },
    pop(value) { setLocation(value); listeners.get("popstate")?.(); },
  };
}

function pageviews(result) {
  return (result.window.dataLayer ?? [])
    .map((entry) => Array.from(entry))
    .filter((entry) => entry[0] === "event" && entry[1] === "page_view");
}

function activateUmami(result) {
  const tracked = [];
  result.window.umami = { track(payload) { tracked.push(payload); } };
  result.appended[0].dispatch("load");
  return tracked;
}

test("normal production load queues exactly one sanitized pageview per provider", () => {
  const result = execute();
  assert.equal(result.appended.length, 2);
  assert.equal(result.appended[0].src, "https://analytics.bohodigitalservices.com/script.js");
  assert.equal(result.appended[1].src, "https://www.googletagmanager.com/gtag/js?id=G-3VYXZ0H1P8");
  for (const [name, value] of [
    ["data-auto-pageview", "false"],
    ["data-exclude-search", "true"],
    ["data-exclude-hash", "true"],
    ["data-do-not-track", "true"],
  ]) assert.equal(result.appended[0].getAttribute(name), value);
  assert.equal(pageviews(result).length, 1);
  assert.deepEqual({ ...pageviews(result)[0][2] }, {
    page_location: "https://rankbuilderseo.com/articles/example",
    page_path: "/articles/example",
    page_referrer: "https://referrer.example/from",
  });
  const umami = activateUmami(result);
  assert.deepEqual(umami.map((payload) => ({ ...payload })), [{
    website: production.umamiWebsiteId,
    url: "https://rankbuilderseo.com/articles/example",
  }]);
  assert.doesNotMatch(JSON.stringify({ ga: result.window.dataLayer, umami }), /private|token|email|%40|#fragment|#private/i);
});

test("missing Umami API after load yields to a scheduled retry", () => {
  let synchronousReads = 0;
  const umami = {};
  Object.defineProperty(umami, "track", {
    get() {
      synchronousReads += 1;
      if (synchronousReads > 2) throw new Error("synchronous retry guard");
      return undefined;
    },
  });
  const result = execute({ existingWindow: { umami } });
  assert.doesNotThrow(() => result.appended[0].dispatch("load"));
  assert.equal(synchronousReads, 1);
  assert.equal(result.pendingTimers(), 1);
});

test("missing Umami API retries finitely and quiesces", () => {
  const result = execute();
  result.appended[0].dispatch("load");
  assert.equal(result.pendingTimers(), 1);
  assert.equal(result.runTimers(25), 20);
  assert.equal(result.pendingTimers(), 0);
  assert.deepEqual(result.scheduledDelays(), Array(20).fill(250));
  assert.equal(pageviews(result).length, 1);
});

test("delayed Umami availability emits each sanitized pageview exactly once", () => {
  const result = execute();
  result.appended[0].dispatch("load");
  const tracked = [];
  result.window.umami = { track(payload) { tracked.push({ ...payload }); } };
  assert.equal(result.runTimers(), 1);
  assert.deepEqual(tracked, [{
    website: production.umamiWebsiteId,
    url: "https://rankbuilderseo.com/articles/example",
  }]);
  assert.equal(result.pendingTimers(), 0);
  result.window.history.pushState({}, "", "/tools/?lead=private#fragment");
  assert.equal(result.runTimers(), 1);
  assert.deepEqual(tracked, [
    { website: production.umamiWebsiteId, url: "https://rankbuilderseo.com/articles/example" },
    { website: production.umamiWebsiteId, url: "https://rankbuilderseo.com/tools/" },
  ]);
  assert.doesNotMatch(JSON.stringify(tracked), /private|lead|fragment/i);
});

test("pathname transitions are counted once while duplicate, query, hash, and same-path history are ignored", () => {
  const result = execute();
  const umami = activateUmami(result);
  result.window.history.pushState({}, "", "/tools/?lead=private#start");
  result.runTimers();
  assert.equal(pageviews(result).length, 2);
  assert.equal(umami.length, 2);
  assert.equal(pageviews(result)[1][2].page_location, "https://rankbuilderseo.com/tools/");
  assert.equal(umami[1].url, "https://rankbuilderseo.com/tools/");
  for (const url of ["/tools/?lead=other", "/tools/?lead=other#details", "/tools/"]) {
    result.window.history.pushState({}, "", url);
    result.runTimers();
  }
  result.pop("/tools/?back=same");
  result.runTimers();
  assert.equal(pageviews(result).length, 2);
  assert.equal(umami.length, 2);
  result.pop("/articles/example?back=meaningful");
  result.runTimers();
  assert.equal(pageviews(result).length, 3);
  assert.equal(umami.length, 3);
});

test("hard reloads and duplicate bootstraps do not duplicate pageviews", () => {
  assert.equal(pageviews(execute()).length, 1);
  assert.equal(pageviews(execute()).length, 1);
  const duplicate = execute({ existingWindow: { __bohoAnalyticsLoaded: true } });
  assert.equal(duplicate.appended.length, 0);
  assert.equal(duplicate.window.dataLayer, undefined);
});

test("DNT, webdriver, QA session state, and non-production hosts suppress before network load", () => {
  for (const options of [
    { doNotTrack: "1" },
    { windowDoNotTrack: "1" },
    { webdriver: true },
    { host: "bohodigitalservices.pages.dev" },
    { host: "preview.rankbuilderseo.com" },
    { host: "localhost" },
    { host: "owner.rankbuilderseo.com" },
    { host: "rankbuilderseo.com.evil.example" },
  ]) {
    const result = execute(options);
    assert.equal(result.appended.length, 0, JSON.stringify(options));
    assert.equal(result.window.dataLayer, undefined, JSON.stringify(options));
  }
  const storage = new Map();
  const marked = execute({ search: "?boho_qa=1", storage });
  assert.equal(marked.appended.length, 0);
  assert.equal(marked.documentElement.dataset.analyticsSuppressed, "boho-qa");
  assert.equal(storage.get("boho_qa"), "1");
  assert.equal(execute({ search: "", storage }).appended.length, 0);
  const cleared = execute({ search: "?boho_qa=0", storage });
  assert.equal(cleared.appended.length, 2);
  assert.equal(storage.has("boho_qa"), false);
  assert.equal(execute({ search: "?boho_qa=1", storageThrows: true }).appended.length, 0);
});

test("provider host allowlists must be identical and nonempty", () => {
  assert.equal(execute({ umamiDomains: "", gaHosts: "" }).appended.length, 0);
  assert.equal(execute({ gaHosts: production.host }).appended.length, 0);
  assert.equal(execute({ umamiDomains: `${production.alternateHost},${production.host}` }).appended.length, 2);
});

test("source configures manual privacy-bounded pageviews without new identifiers", () => {
  assert.equal((source.match(/window\.gtag\("event", "page_view"/g) ?? []).length, 1);
  assert.match(source, /send_page_view:\s*false/);
  assert.match(source, /allow_google_signals:\s*false/);
  assert.match(source, /allow_ad_personalization_signals:\s*false/);
  assert.doesNotMatch(source, /user_id|user_properties|localStorage|identify\(/i);
});
