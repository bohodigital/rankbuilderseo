import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { classifyResponse, emptyCounts, RequestBudget } from "./request-budget-lib.mjs";

function parseArgs(argv) {
  const options = { baseUrl: "", routes: [], clickSelectors: [], ceiling: 100, stopAt: 85, reservePerRoute: 15, settleMs: 1800, output: "", scroll: false };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    const next = () => argv[++index];
    if (value === "--base-url") options.baseUrl = next();
    else if (value === "--route") options.routes.push(next());
    else if (value === "--click-selector") options.clickSelectors.push(next());
    else if (value === "--ceiling") options.ceiling = Number(next());
    else if (value === "--stop-at") options.stopAt = Number(next());
    else if (value === "--reserve-per-route") options.reservePerRoute = Number(next());
    else if (value === "--settle-ms") options.settleMs = Number(next());
    else if (value === "--output") options.output = next();
    else if (value === "--scroll") options.scroll = true;
    else throw new Error("unknown argument: " + value);
  }
  if (!options.baseUrl) throw new Error("--base-url is required");
  if (options.routes.length === 0) throw new Error("at least one --route is required");
  if (!Number.isInteger(options.settleMs) || options.settleMs < 250) throw new Error("--settle-ms must be at least 250");
  return options;
}

class CdpSession {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.sequence = 0;
    this.pending = new Map();
    this.listeners = new Map();
  }

  async open() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", ({ data }) => {
      const message = JSON.parse(String(data));
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(message.error.message));
        else pending.resolve(message.result);
        return;
      }
      for (const listener of this.listeners.get(message.method) ?? []) listener(message.params);
    });
  }

  send(method, params = {}) {
    const id = ++this.sequence;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  on(method, listener) {
    const listeners = this.listeners.get(method) ?? [];
    listeners.push(listener);
    this.listeners.set(method, listeners);
  }

  close() {
    this.socket.close();
  }
}

async function waitForFile(path, timeoutMs = 8000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      return await readFile(path, "utf8");
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
  throw new Error("timed out waiting for " + path);
}

async function createPage(port) {
  const response = await fetch("http://127.0.0.1:" + port + "/json/new?about:blank", { method: "PUT" });
  if (!response.ok) throw new Error("could not create Chromium target: " + response.status);
  return response.json();
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const baseUrl = new URL(options.baseUrl);
  const budget = new RequestBudget(options);
  const userDataDir = await mkdtemp(join(tmpdir(), "rankbuilderseo-request-audit-"));
  const browser = spawn(process.env.CHROMIUM_BIN ?? "/usr/bin/chromium", [
    "--headless=new",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-dev-shm-usage",
    "--remote-debugging-address=127.0.0.1",
    "--remote-debugging-port=0",
    "--user-data-dir=" + userDataDir,
    "about:blank",
  ], { stdio: ["ignore", "ignore", "pipe"] });
  let browserErrors = "";
  browser.stderr.on("data", (chunk) => { browserErrors += String(chunk); });

  let session;
  try {
    const activePort = await waitForFile(join(userDataDir, "DevToolsActivePort"));
    const [port] = activePort.trim().split("\n");
    const page = await createPage(port);
    session = new CdpSession(page.webSocketDebuggerUrl);
    await session.open();
    await session.send("Network.enable");
    await session.send("Page.enable");

    const requests = new Map();
    const responses = [];
    let budgetError = null;
    let phase = "automatic";
    session.on("Network.requestWillBeSent", ({ requestId, request, type }) => {
      requests.set(requestId, { request, type });
    });
    session.on("Network.responseReceived", ({ requestId, response, type }) => {
      if (budgetError) return;
      const requestRecord = requests.get(requestId) ?? { request: {}, type };
      const record = classifyResponse({ request: requestRecord.request, response, type: type ?? requestRecord.type });
      if (!/^https?:/.test(record.url)) return;
      try {
        budget.record();
        responses.push({ ...record, status: response.status, phase });
      } catch (error) {
        budgetError = error;
      }
    });

    const auditedRoutes = [];
    const skippedRoutes = [];
    const navigationChecks = [];
    for (const route of options.routes) {
      if (!budget.canOpenRoute()) {
        skippedRoutes.push({ route, reason: "reserve would be violated at " + budget.count + "/" + budget.ceiling });
        continue;
      }
      const routeUrl = new URL(route, baseUrl);
      if (routeUrl.origin !== baseUrl.origin) throw new Error("route escaped base origin: " + route);
      const before = budget.count;
      await session.send("Page.navigate", { url: routeUrl.href });
      await new Promise((resolve) => setTimeout(resolve, options.settleMs));
      if (options.scroll) {
        await session.send("Runtime.evaluate", {
          expression: "(async () => { for (let y = 0; y <= document.body.scrollHeight; y += Math.max(320, window.innerHeight * 0.75)) { window.scrollTo(0, y); await new Promise((resolve) => setTimeout(resolve, 180)); } })()",
          awaitPromise: true,
        });
        await new Promise((resolve) => setTimeout(resolve, options.settleMs));
      }
      if (budgetError) throw budgetError;
      auditedRoutes.push({ route, responses: budget.count - before });
    }

    for (const selector of options.clickSelectors) {
      const before = budget.count;
      phase = "navigation";
      const click = await session.send("Runtime.evaluate", {
        expression: `(() => { const target = document.querySelector(${JSON.stringify(selector)}); if (!target) return { clicked: false, reason: "missing selector" }; target.click(); return { clicked: true }; })()`,
        returnByValue: true,
      });
      await new Promise((resolve) => setTimeout(resolve, options.settleMs));
      if (budgetError) throw budgetError;
      const location = await session.send("Runtime.evaluate", {
        expression: "location.pathname + location.search + location.hash",
        returnByValue: true,
      });
      navigationChecks.push({
        selector,
        ...click.result.value,
        location: location.result.value,
        responses: budget.count - before,
      });
      phase = "automatic";
    }

    const counts = emptyCounts();
    for (const response of responses) {
      counts.total += 1;
      counts[response.category] += 1;
      if (response.isPrefetch) counts.prefetch += 1;
    }
    const rscResponses = responses.filter((response) => response.isRsc && response.phase === "automatic");
    const rscUrls = [...new Set(rscResponses.map(({ url }) => url))];
    const rscPrefetches = responses.filter((response) => response.isRsc && response.isPrefetch);
    const summary = {
      baseUrl: baseUrl.href,
      ceiling: budget.ceiling,
      stopAt: budget.stopAt,
      reservePerRoute: budget.reservePerRoute,
      scrolled: options.scroll,
      exactRequestCount: budget.count,
      remainingHeadroom: budget.remaining(),
      auditedRoutes,
      skippedRoutes,
      navigationChecks,
      counts,
      automaticRscCount: rscResponses.length,
      automaticRscUrls: rscUrls,
      duplicateAutomaticRscCount: rscResponses.length - rscUrls.length,
      rscPrefetchCount: rscPrefetches.length,
      rscPrefetchUrls: [...new Set(rscPrefetches.map(({ url }) => url))],
    };
    const serialized = JSON.stringify(summary, null, 2) + "\n";
    if (options.output) await writeFile(options.output, serialized, "utf8");
    process.stdout.write(serialized);
  } finally {
    try { await session?.send("Browser.close"); } catch {}
    session?.close();
    if (!browser.killed) browser.kill("SIGTERM");
    await rm(userDataDir, { recursive: true, force: true });
    if (browserErrors && !session) process.stderr.write(browserErrors);
  }
}

main().catch((error) => {
  process.stderr.write((error.stack ?? error.message) + "\n");
  process.exitCode = 1;
});
