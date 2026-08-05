import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    {
      ASSETS: {
        fetch: async (request) => {
          const url = new URL(request.url);
          if (url.pathname.startsWith("/styles/")) {
            return new Response("/* Versioned stylesheet */", {
              headers: { "content-type": "text/css" },
            });
          }
          return new Response("Not found", { status: 404 });
        },
      },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("root renders the version index", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /Portfolio versions/i);
  assert.match(html, /href="\/version1"/);
  assert.match(html, /href="\/version2"/);
  assert.match(html, /href="\/styles\/version-index\.css"/);
  assert.doesNotMatch(html, /[\u4e00-\u9fff]/);
});

test("Version 1 renders independently at its own route", async () => {
  const response = await render("/version1");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Alina.*Pixels, Algorithms.*People/i);
  assert.match(html, /I solve problems with code/i);
  assert.match(html, /WORKBENCH/);
  assert.match(html, /href="\/styles\/version1\.css"/);
  assert.doesNotMatch(html, /[\u4e00-\u9fff]/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview/);
});

test("Version 1 source keeps all five interactive areas", async () => {
  const page = await readFile(new URL("../app/version1/page.tsx", import.meta.url), "utf8");

  for (const area of ["web", "algorithm", "hardware", "notes", "travel"]) {
    assert.match(page, new RegExp(`openPanel\\(\\"${area}\\"\\)`));
  }
  assert.match(page, /RUN SEARCH/);
  assert.match(page, /POWER ON/);
});

test("Version 2 renders independently at its own route", async () => {
  const response = await render("/version2");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Follow.*your.*focus/i);
  assert.match(html, /FOCUS FIELD/);
  assert.match(html, /href="\/styles\/version2\.css"/);
  assert.doesNotMatch(html, /[\u4e00-\u9fff]/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview/);
});

test("Version 2 source keeps all five signals and lightweight demos", async () => {
  const page = await readFile(new URL("../app/version2/page.tsx", import.meta.url), "utf8");

  for (const area of ["web", "algorithm", "hardware", "notes", "travel"]) {
    assert.match(page, new RegExp(`openZone\\(\\"${area}\\"\\)`));
  }
  assert.match(page, /RUN PATH/);
  assert.match(page, /POWER ON/);
  assert.match(page, /RECALCULATE ROUTE/);
});
