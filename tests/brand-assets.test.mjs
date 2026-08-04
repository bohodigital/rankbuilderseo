import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

function pngDimensions(buffer) {
  assert.deepEqual([...buffer.subarray(0, 8)], [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

test("dual-color RB identity is wired to every crawler and device icon size", async () => {
  const [favicon, mark, png32, apple, png192, png512, layout, structuredData] = await Promise.all([
    readFile(new URL("public/favicon.svg", root), "utf8"),
    readFile(new URL("public/brand-mark.svg", root), "utf8"),
    readFile(new URL("public/favicon-32x32.png", root)),
    readFile(new URL("public/apple-touch-icon.png", root)),
    readFile(new URL("public/icon-192.png", root)),
    readFile(new URL("public/icon-512.png", root)),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("app/content/structured-data.ts", root), "utf8"),
  ]);

  for (const source of [favicon, mark]) {
    assert.match(source, /#ff5147/i);
    assert.match(source, /#f7f6f2/i);
    assert.match(source, /Rank Builder SEO/i);
  }

  assert.deepEqual(pngDimensions(png32), { width: 32, height: 32 });
  assert.deepEqual(pngDimensions(apple), { width: 180, height: 180 });
  assert.deepEqual(pngDimensions(png192), { width: 192, height: 192 });
  assert.deepEqual(pngDimensions(png512), { width: 512, height: 512 });

  for (const asset of ["favicon.svg", "favicon-32x32.png", "favicon.ico", "apple-touch-icon.png"]) {
    assert.ok(layout.includes(`/${asset}`), asset);
  }
  assert.match(structuredData, /logo: `\$\{origin\}\/icon-512\.png`/);
});
