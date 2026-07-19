import assert from "node:assert/strict";
import test from "node:test";
import { classifyResponse, RequestBudget } from "../scripts/request-budget-lib.mjs";

test("classifies documents, RSC prefetches, assets, and analytics", () => {
  assert.equal(classifyResponse({ response: { url: "https://rankbuilderseo.com/articles" }, type: "Document" }).category, "document");
  assert.deepEqual(
    classifyResponse({
      request: { url: "https://rankbuilderseo.com/articles?_rsc=abc", headers: { "Next-Router-Prefetch": "1", RSC: "1" } },
      response: { url: "https://rankbuilderseo.com/articles?_rsc=abc", mimeType: "text/x-component" },
      type: "Fetch",
    }),
    {
      category: "rsc",
      isPrefetch: true,
      isRsc: true,
      url: "https://rankbuilderseo.com/articles?_rsc=abc",
    },
  );
  assert.equal(classifyResponse({ response: { url: "https://rankbuilderseo.com/assets/app.js" }, type: "Script" }).category, "script");
  assert.equal(classifyResponse({ response: { url: "https://analytics.bohodigitalservices.com/script.js" }, type: "Script" }).category, "analytics");
});

test("reserves headroom before another route and fails closed at the ceiling", () => {
  const budget = new RequestBudget({ ceiling: 10, stopAt: 8, reservePerRoute: 3 });
  assert.equal(budget.canOpenRoute(), true);
  for (let index = 0; index < 7; index += 1) budget.record();
  assert.equal(budget.canOpenRoute(), false);
  assert.equal(budget.remaining(), 3);
  budget.record();
  budget.record();
  assert.throws(() => budget.record(), /ceiling reached \(10\/10\)/);
});

test("rejects invalid budget configurations", () => {
  assert.throws(() => new RequestBudget({ ceiling: 10, stopAt: 10, reservePerRoute: 1 }), /stopAt must be below ceiling/);
  assert.throws(() => new RequestBudget({ ceiling: 0, stopAt: 1, reservePerRoute: 1 }), /ceiling must be a positive integer/);
});
