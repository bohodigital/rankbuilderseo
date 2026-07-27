"use client";

import { useRef, useState } from "react";
import { redirectReportCsv } from "../export";
import type { RedirectTraceReport, ToolApiError } from "../tool-types";

function download(filename: string, content: string, type: string): void {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([content], { type }));
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function plainText(report: RedirectTraceReport): string {
  return [
    `Requested: ${report.requestedUrl}`,
    `Final: ${report.finalUrl ?? "Unavailable"}`,
    `Hops: ${Math.max(0, report.hops.length - 1)}`,
    `Result: ${report.classification}`,
    "",
    ...report.hops.flatMap((hop) => [
      `${hop.sequence}. ${hop.status ?? "Failed"} ${hop.url}`,
      ...(hop.locationRaw ? [`   Location: ${hop.locationRaw}`] : []),
      ...(hop.warnings.length ? [`   Notes: ${hop.warnings.join("; ")}`] : []),
    ]),
  ].join("\n");
}

export function VisualizerClient() {
  const [url, setUrl] = useState("");
  const [report, setReport] = useState<RedirectTraceReport | null>(null);
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
      const response = await fetch("/api/tools/redirect-chain-visualizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
        signal: controller.current.signal,
      });
      const payload = await response.json() as RedirectTraceReport | ToolApiError;
      if (!response.ok || "error" in payload) throw new Error("error" in payload ? payload.error : "The redirect trace failed.");
      setReport(payload);
      requestAnimationFrame(() => resultHeading.current?.focus());
    } catch (reason) {
      if (reason instanceof DOMException && reason.name === "AbortError") return;
      setError(reason instanceof Error ? reason.message : "The redirect trace failed.");
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

  return <section className="tool-console" aria-labelledby="visualizer-form-heading">
    <div className="tool-console-intro">
      <p className="eyebrow">Bounded redirect trace</p>
      <h2 id="visualizer-form-heading">Trace one public URL</h2>
      <p>Submitted URLs and trace results are processed for this request and are not intentionally stored.</p>
    </div>
    <form onSubmit={submit} className="tool-form">
      <label htmlFor="visualizer-url">Public URL to trace</label>
      <input
        id="visualizer-url"
        type="url"
        inputMode="url"
        autoComplete="off"
        spellCheck={false}
        maxLength={2048}
        placeholder="https://example.com/old-page/"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        required
      />
      <p>The visualizer follows public HTTP redirects only. It does not execute JavaScript, submit forms, reuse cookies, or authenticate.</p>
      <div className="tool-actions">
        <button className="button button-dark" type="submit" disabled={busy} data-umami-event="redirect-visualizer-submit">
          {busy ? "Tracing…" : "Trace redirects"}
        </button>
        <button className="button button-ghost" type="button" onClick={clear}>Clear trace</button>
      </div>
    </form>
    <div className="tool-live-region" role="status" aria-live="polite">
      {busy ? "The public redirect path is being traced within the tool limits." : ""}
    </div>
    {error && <div className="tool-error" role="alert"><strong>Trace stopped</strong><p>{error}</p></div>}
    {report && <div className="tool-results">
      <div className={`tool-summary tool-summary-${report.classification}`}>
        <p className="eyebrow">Trace result</p>
        <h2 ref={resultHeading} tabIndex={-1}>{report.classification.split("-").map((word) => `${word[0].toUpperCase()}${word.slice(1)}`).join(" ")}</h2>
        <p>{report.summary}</p>
      </div>
      <ol className="redirect-diagram" aria-label="Redirect chain diagram">
        {report.hops.map((hop) => <li key={`${hop.sequence}-${hop.url}`}>
          <span>{hop.sequence}</span>
          <strong>{hop.status ?? "Failed"}</strong>
          <p>{hop.url}</p>
          <small>{hop.redirectKind}</small>
        </li>)}
      </ol>
      <div className="article-table tool-table" tabIndex={0} role="region" aria-label="Complete redirect hop table">
        <table>
          <thead><tr><th scope="col">Hop</th><th scope="col">Status</th><th scope="col">URL</th><th scope="col">Location</th><th scope="col">Resolved target</th><th scope="col">Time</th><th scope="col">Changes</th><th scope="col">Notes</th></tr></thead>
          <tbody>{report.hops.map((hop) => <tr key={`row-${hop.sequence}-${hop.url}`}>
            <td>{hop.sequence}</td>
            <td>{hop.status ?? "Failed"}</td>
            <td>{hop.url}</td>
            <td>{hop.locationRaw ?? "—"}</td>
            <td>{hop.locationResolved ?? "—"}</td>
            <td>{hop.elapsedMs} ms</td>
            <td>{Object.entries(hop.changes).filter(([, changed]) => changed).map(([name]) => name).join(", ") || "None"}</td>
            <td>{hop.warnings.join("; ") || "—"}</td>
          </tr>)}</tbody>
        </table>
      </div>
      {report.detectedRefresh && <div className="tool-warnings"><h3>Non-HTTP refresh detected</h3><p>{report.detectedRefresh.type}: delay {report.detectedRefresh.delaySeconds ?? "unknown"} seconds; target {report.detectedRefresh.target ?? "not declared"}.</p></div>}
      <div className="tool-actions">
        <button type="button" className="button button-dark" onClick={() => navigator.clipboard.writeText(plainText(report))} data-umami-event="redirect-visualizer-export">Copy summary</button>
        <button type="button" className="button button-ghost" onClick={() => download("redirect-chain.csv", redirectReportCsv(report.hops), "text/csv")} data-umami-event="redirect-visualizer-export">Download CSV</button>
        <button type="button" className="button button-ghost" onClick={() => download("redirect-chain.json", JSON.stringify(report, null, 2), "application/json")} data-umami-event="redirect-visualizer-export">Download JSON</button>
      </div>
    </div>}
  </section>;
}
