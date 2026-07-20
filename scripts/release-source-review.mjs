import { runSourceLinkCheck } from "./check-source-links.mjs";

const args = process.argv.slice(2);

function numericOption(name, fallback) {
  const index = args.indexOf(name);
  if (index < 0) return fallback;
  const value = Number(args[index + 1]);
  if (!args[index + 1] || args[index + 1].startsWith("--") || !Number.isInteger(value)) {
    throw new Error(`${name} requires an integer value`);
  }
  return value;
}

const maxSources = numericOption("--max-sources", 25);
const concurrency = numericOption("--concurrency", 3);
const reports = [];
let batch = 1;

do {
  reports.push(await runSourceLinkCheck({ maxSources, batch, concurrency }));
  batch += 1;
} while (reports.at(-1).remaining > 0);

const results = reports.flatMap((report) => report.results);
const output = {
  results,
  total: reports[0].total,
  batches: reports.length,
  maxSources,
  concurrency,
  issues: results.filter((result) => result.issue).length,
  advisory: !args.includes("--strict"),
};

if (args.includes("--json")) {
  console.log(JSON.stringify(output, null, 2));
} else {
  for (const result of results) {
    console.log(`${result.issue ? "REVIEW" : "OK"} [${result.category}] ${result.url}${result.issue ? ` (${result.issue})` : ""}`);
  }
  console.log(`Release source review covered ${output.total} URLs in ${output.batches} deterministic batch(es); ${output.issues} need review.`);
}

if (args.includes("--strict") && output.issues > 0) process.exitCode = 1;
