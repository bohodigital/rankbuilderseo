const ANALYTICS_HOSTS = new Set(["analytics.bohodigitalservices.com"]);

function headerValue(headers, name) {
  const match = Object.entries(headers ?? {}).find(([key]) => key.toLowerCase() === name.toLowerCase());
  return match?.[1] == null ? "" : String(match[1]);
}

export function classifyResponse({ request = {}, response = {}, type = "Other" }) {
  const url = response.url ?? request.url ?? "";
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    parsed = null;
  }

  const contentType = ((response.mimeType ?? "") + " " + headerValue(response.headers, "content-type")).toLowerCase();
  const requestHeaders = request.headers ?? {};
  const isPrefetch = [
    headerValue(requestHeaders, "next-router-prefetch"),
    headerValue(requestHeaders, "purpose"),
    headerValue(requestHeaders, "sec-purpose"),
  ].some((value) => /(?:^|\s)prefetch(?:\s|$)/i.test(value) || value === "1");
  const isRsc = Boolean(
    parsed?.searchParams.has("_rsc")
    || headerValue(requestHeaders, "rsc") === "1"
    || contentType.includes("text/x-component"),
  );

  let category = "other";
  if (parsed && ANALYTICS_HOSTS.has(parsed.hostname)) category = "analytics";
  else if (type === "Document") category = "document";
  else if (isRsc) category = "rsc";
  else if (type === "Script") category = "script";
  else if (type === "Stylesheet") category = "stylesheet";
  else if (type === "Image") category = "image";
  else if (type === "Font") category = "font";

  return { category, isPrefetch, isRsc, url };
}

export class RequestBudget {
  constructor({ ceiling, stopAt, reservePerRoute }) {
    if (!Number.isInteger(ceiling) || ceiling < 1) throw new Error("ceiling must be a positive integer");
    if (!Number.isInteger(stopAt) || stopAt < 1 || stopAt >= ceiling) throw new Error("stopAt must be below ceiling");
    if (!Number.isInteger(reservePerRoute) || reservePerRoute < 1) throw new Error("reservePerRoute must be positive");
    this.ceiling = ceiling;
    this.stopAt = stopAt;
    this.reservePerRoute = reservePerRoute;
    this.count = 0;
  }

  record() {
    this.count += 1;
    if (this.count >= this.ceiling) throw new Error("request ceiling reached (" + this.count + "/" + this.ceiling + ")");
  }

  canOpenRoute() {
    return this.count < this.stopAt && this.count + this.reservePerRoute < this.ceiling;
  }

  remaining() {
    return this.ceiling - this.count;
  }
}

export function emptyCounts() {
  return {
    total: 0,
    document: 0,
    rsc: 0,
    script: 0,
    stylesheet: 0,
    image: 0,
    font: 0,
    analytics: 0,
    other: 0,
    prefetch: 0,
  };
}
