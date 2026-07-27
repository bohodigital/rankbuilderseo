"use client";

import { useRef, useState } from "react";
import type { IndexabilityReport, ToolApiError } from "../tool-types";

function values(items: readonly string[]): string {
  return items.length ? items.join(", ") : "None found";
}

function reportText(report: IndexabilityReport): string {
  return [
    `Requested URL: ${report.requestedUrl}`,
    `Final URL: ${report.finalUrl ?? "Unavailable"}`,
    `Result: ${report.classification}`,
    `Summary: ${report.summary}`,
    `HTTP status: ${report.finalResponse?.status ?? "Unavailable"}`,
    `Redirects: ${report.redirectCount}`,
    `Content type: ${report.finalResponse?.contentType ?? "Unavailable"}`,
    `Robots.txt: ${report.robotsTxt?.allowed == null ? "Indeterminate" : report.robotsTxt.allowed ? "Allowed" : "Disallowed"}`,
    `Robots meta: ${values(report.directives.robotsMeta)}`,
    `Googlebot meta: ${values(report.directives.googlebotMeta)}`,
    `X-Robots-Tag: ${values(report.directives.xRobotsTag)}`,
    `HTML canonical: ${values(report.canonicals.html)}`,
    `HTTP canonical: ${values(report.canonicals.httpHeader)}`,
    `Title: ${report.document.title ?? "None found"}`,
    `H1 count: ${report.document.h1Count ?? "Unavailable"}`,
    `Meaningful returned text: ${report.document.hasMeaningfulText == null ? "Unavailable" : report.document.hasMeaningfulText ? "Yes" : "No"}`,
    ...report.warnings.map((item) => `Warning [${item.severity}]: ${item.message}`),
    "",
    "This report describes observable public signals. It does not prove that Google has indexed the URL.",
  ].join("\n");
}

function download(filename: string, content: string, type: string): void {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([content], { type }));
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function InspectorClient() {
  const [url, setUrl] = useState("");
  const [report, setReport] = useState<IndexabilityReport | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const controller = useRef<AbortController | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    controller.current?.abort();
    controller.current = new AbortController();
    setBusy(true);
    setError("");
    setReport(null);
    try {
      const response = await fetch("/api/tools/indexability-inspector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
        signal: controller.current.signal,
      });
      const payload = await response.json() as IndexabilityReport | ToolApiError;
      if (!response.ok || "error" in payload) throw new Error("error" in payload ? payload.error : "The inspection failed.");
      setReport(payload);
      requestAnimationFrame(() => resultHeading.current?.focus());
    } catch (reason) {
      if (reason instanceof DOMException && reason.name === "AbortError") return;
      setError(reason instanceof Error ? reason.message : "The inspection failed.");
    } finally {
      setBusy(false);
    }
  }

  function clear() {
    controller.current?.abort();
    setUrl("");
    setReport(null);
    setError("");
    setBusy(false);
  }

  return <section className="tool-console" aria-labelledby="inspector-form-heading">
    <div className="tool-console-intro">
      <p className="eyebrow">Public signal check</p>
      <h2 id="inspector-form-heading">Inspect one public URL</h2>
      <p>Submitted URLs and reports are processed for this request and are not intentionally stored.</p>
    </div>
    <form onSubmit={submit} className="tool-form">
      <label htmlFor="inspector-url">Public URL to inspect</label>
      <input
        id="inspector-url"
        type="url"
        inputMode="url"
        autoComplete="off"
        spellCheck={false}
        maxLength={2048}
        placeholder="https://example.com/page/"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        required
      />
      <p id="inspector-help">Use a complete public http or https URL. The inspector does not log in, submit forms, execute JavaScript, or impersonate Googlebot.</p>
      <div className="tool-actions">
        <button className="button button-dark" type="submit" disabled={busy} data-umami-event="indexability-inspector-submit">
          {busy ? "Inspecting…" : "Inspect URL"}
        </button>
        <button className="button button-ghost" type="button" onClick={clear}>Clear report</button>
      </div>
    </form>
    <div className="tool-live-region" role="status" aria-live="polite">
      {busy ? "The public response is being inspected within the tool limits." : ""}
    </div>
    {error && <div className="tool-error" role="alert"><strong>Inspection stopped</strong><p>{error}</p></div>}
    {report && <div className="tool-results">
      <div className={`tool-summary tool-summary-${report.classification}`}>
        <p className="eyebrow">Inspection result</p>
        <h2 ref={resultHeading} tabIndex={-1}>{report.classification.split("-").map((word) => `${word[0].toUpperCase()}${word.slice(1)}`).join(" ")}</h2>
        <p>{report.summary}</p>
      </div>
      <dl className="tool-result-grid">
        <div><dt>Requested URL</dt><dd>{report.requestedUrl}</dd></div>
        <div><dt>Final URL</dt><dd>{report.finalUrl ?? "Unavailable"}</dd></div>
        <div><dt>HTTP status</dt><dd>{report.finalResponse?.status ?? "Unavailable"}</dd></div>
        <div><dt>Redirects</dt><dd>{report.redirectCount}</dd></div>
        <div><dt>Content type</dt><dd>{report.finalResponse?.contentType ?? "Unavailable"}</dd></div>
        <div><dt>Robots.txt</dt><dd>{report.robotsTxt?.allowed == null ? "Indeterminate" : report.robotsTxt.allowed ? "Allowed" : "Disallowed"}{report.robotsTxt?.matchedRule ? ` — ${report.robotsTxt.matchedRule}` : ""}</dd></div>
        <div><dt>Robots meta</dt><dd>{values(report.directives.robotsMeta)}</dd></div>
        <div><dt>Googlebot meta</dt><dd>{values(report.directives.googlebotMeta)}</dd></div>
        <div><dt>X-Robots-Tag</dt><dd>{values(report.directives.xRobotsTag)}</dd></div>
        <div><dt>HTML canonical</dt><dd>{values(report.canonicals.html)}</dd></div>
        <div><dt>HTTP canonical</dt><dd>{values(report.canonicals.httpHeader)}</dd></div>
        <div><dt>Title</dt><dd>{report.document.title ?? "None found"}</dd></div>
        <div><dt>H1 count</dt><dd>{report.document.h1Count ?? "Unavailable"}</dd></div>
        <div><dt>Text sample</dt><dd>{report.document.hasMeaningfulText == null ? "Unavailable" : report.document.hasMeaningfulText ? "Meaningful returned text found" : "No meaningful returned text found"}</dd></div>
      </dl>
      <section className="tool-warnings" aria-labelledby="inspector-warnings">
        <h3 id="inspector-warnings">Warnings and boundaries</h3>
        <ul>{report.warnings.map((item) => <li key={`${item.code}-${item.message}`}><strong>{item.severity}</strong> {item.message}</li>)}</ul>
      </section>
      <div className="tool-actions">
        <button type="button" className="button button-dark" onClick={() => navigator.clipboard.writeText(reportText(report))} data-umami-event="indexability-inspector-export">Copy report</button>
        <button type="button" className="button button-ghost" onClick={() => download("indexability-report.json", JSON.stringify(report, null, 2), "application/json")} data-umami-event="indexability-inspector-export">Download JSON</button>
      </div>
    </div>}
  </section>;
}
