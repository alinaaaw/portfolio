import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    {
      ASSETS: {
        fetch: async (request) => {
          const url = new URL(request.url);
          if (url.pathname === "/site.css") {
            return new Response("/* Version 1 stylesheet */", {
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

test("server-renders the English Version 1 portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Alina.*Pixels, Algorithms.*People/i);
  assert.match(html, /I solve problems with code/i);
  assert.match(html, /WORKBENCH/);
  assert.match(html, /FOCUS MAP/);
  assert.match(html, /MOVE \/ AIM \/ CLICK/);
  assert.match(html, /VISITOR TRACE/);
  assert.match(html, /href="\/site\.css"/);
  assert.doesNotMatch(html, /[\u4e00-\u9fff]/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview/);
});

test("source keeps the five interactive portfolio areas", async () => {
  const page = await import("node:fs/promises").then(({ readFile }) =>
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  );

  for (const area of ["web", "algorithm", "hardware", "notes", "travel"]) {
    assert.match(page, new RegExp(`openPanel\\(\\"${area}\\"\\)`));
  }
  assert.match(page, /RUN SEARCH/);
  assert.match(page, /POWER ON/);
  assert.match(page, /handleTargetClick/);
  assert.match(page, /focusProfiles/);
  assert.match(page, /NEXT TRACE/);
});

test("Version 1 styles the focus and discovery interactions", async () => {
  const css = await import("node:fs/promises").then(({ readFile }) =>
    readFile(new URL("../public/site.css", import.meta.url), "utf8"),
  );

  assert.match(css, /\.focus-target/);
  assert.match(css, /\.target-crosshair/);
  assert.match(css, /\.discovery-ledger/);
  assert.match(css, /\.panel-route/);
});

