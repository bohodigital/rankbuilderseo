import type { RedirectHop } from "./tool-types.ts";

function cleanCell(value: string): string {
  return value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, 8_192);
}

export function escapeCsvCell(value: unknown): string {
  let text = cleanCell(String(value ?? ""));
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function redirectReportCsv(hops: readonly RedirectHop[]): string {
  const header = "sequence,status,url,location_raw,location_resolved,elapsed_ms,redirect_kind,warnings";
  return [header, ...hops.map((hop) => [
    hop.sequence,
    hop.status ?? "",
    hop.url,
    hop.locationRaw ?? "",
    hop.locationResolved ?? "",
    hop.elapsedMs,
    hop.redirectKind,
    hop.warnings.join("; "),
  ].map(escapeCsvCell).join(","))].join("\n");
}
