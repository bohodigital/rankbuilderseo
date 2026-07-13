import { access, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const serverEntry = fileURLToPath(
  new URL("../dist/server/index.js", import.meta.url),
);
const clientDirectory = fileURLToPath(
  new URL("../dist/client/", import.meta.url),
);
const pagesEntry = fileURLToPath(
  new URL("../dist/client/_worker.js", import.meta.url),
);

await Promise.all([access(serverEntry), access(clientDirectory)]);

// Wrangler bundles this adapter with the generated Vinext server tree. Pages
// supplies the ASSETS binding used to serve the client build.
await writeFile(
  pagesEntry,
  'export { default } from "../server/index.js";\n',
  "utf8",
);

console.log("Prepared dist/client for Cloudflare Pages advanced mode.");
