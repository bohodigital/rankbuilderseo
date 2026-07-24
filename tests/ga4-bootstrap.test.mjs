import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const bootstrapUrl = new URL("../public/ga4-bootstrap.js", import.meta.url);
const layoutUrl = new URL("../app/layout.tsx", import.meta.url);
const source = await readFile(bootstrapUrl, "utf8");

function execute({
  host = "rankbuilderseo.com",
  measurementId = "G-3VYXZ0H1P8",
  pathname = "/articles/example",
  search = "?email=private%40example.com",
  webdriver = false,
  storage = new Map(),
  existingWindow = {},
} = {}) {
  const appended = [];
  const documentElement = { dataset: {} };
  const config = { dataset: { ga4MeasurementId: measurementId } };
  const document = {
    currentScript: config,
    documentElement,
    head: { appendChild(script) { appended.push(script); } },
    createElement() {
      return { async: false, src: "", dataset: {} };
    },
  };
  const sessionStorage = {
    getItem(key) { return storage.has(key) ? storage.get(key) : null; },
    setItem(key, value) { storage.set(key, value); },
    removeItem(key) { storage.delete(key); },
  };
  const window = {
    ...existingWindow,
    location: {
      hostname: host,
      origin: `https://${host}`,
      pathname,
      search,
    },
  };
  vm.runInNewContext(source, {
    Date,
    URLSearchParams,
    document,
    encodeURIComponent,
    navigator: { webdriver },
    sessionStorage,
    window,
  });
  return { appended, documentElement, storage, window };
}

test("loads one Google tag and sends one privacy-bounded config command", () => {
  const result = execute();
  assert.equal(result.appended.length, 1);
  assert.equal(
    result.appended[0].src,
    "https://www.googletagmanager.com/gtag/js?id=G-3VYXZ0H1P8",
  );
  assert.equal(result.appended[0].dataset.ga4Loader, "rankbuilder-v1");
  assert.equal(result.window.dataLayer.length, 2);
  assert.equal(result.window.dataLayer[0][0], "js");
  assert.equal(result.window.dataLayer[1][0], "config");
  assert.equal(result.window.dataLayer[1][1], "G-3VYXZ0H1P8");
  assert.deepEqual(
    { ...result.window.dataLayer[1][2] },
    {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      anonymize_ip: true,
      page_location: "https://rankbuilderseo.com/articles/example",
    },
  );
  assert.doesNotMatch(JSON.stringify(result.window.dataLayer), /private|email|@/i);
});

test("rejects a missing or wrong measurement ID and non-production hosts", () => {
  assert.equal(execute({ measurementId: "" }).appended.length, 0);
  assert.equal(execute({ measurementId: "G-WRONG" }).appended.length, 0);
  assert.equal(execute({ host: "localhost" }).appended.length, 0);
  assert.equal(execute({ host: "rankbuilderseo.pages.dev.evil.example" }).appended.length, 0);
});

test("loads on the immutable production Pages origin", () => {
  const result = execute({ host: "abcdef12.rankbuilderseo.pages.dev" });
  assert.equal(result.appended.length, 1);
});

test("prevents duplicate loaders and config commands", () => {
  const result = execute({ existingWindow: { __rankBuilderGa4Loaded: true } });
  assert.equal(result.appended.length, 0);
  assert.equal(result.window.dataLayer, undefined);
});

test("suppresses controlled QA without sending the marker", () => {
  const storage = new Map();
  const marked = execute({ search: "?boho_qa=1", storage });
  assert.equal(marked.appended.length, 0);
  assert.equal(marked.documentElement.dataset.ga4Suppressed, "boho-qa");
  assert.equal(storage.get("boho_qa"), "1");
  assert.equal(execute({ storage }).appended.length, 0);
  const cleared = execute({ search: "?boho_qa=0", storage });
  assert.equal(cleared.appended.length, 1);
  assert.equal(storage.has("boho_qa"), false);
  assert.equal(execute({ webdriver: true }).appended.length, 0);
});

test("the root layout declares exactly one expected first-party bootstrap", async () => {
  const layout = await readFile(layoutUrl, "utf8");
  assert.equal((layout.match(/src=["']\/ga4-bootstrap\.js["']/g) ?? []).length, 1);
  assert.equal((layout.match(/data-ga4-measurement-id=["']G-3VYXZ0H1P8["']/g) ?? []).length, 1);
  assert.doesNotMatch(layout, /googletagmanager\.com\/gtm\.js/);
  assert.doesNotMatch(layout, /G-[A-Z0-9]+.*G-[A-Z0-9]+/s);
});

test("bootstrap source contains no custom event, user ID, or free-form payload", () => {
  assert.doesNotMatch(source, /gtag\(["']event["']/);
  assert.doesNotMatch(source, /user_id|user_properties|form|email/i);
  assert.equal((source.match(/gtag\(["']config["']/g) ?? []).length, 1);
});
