import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", String(process.pid) + "-" + String(Date.now()));
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    {
      ASSETS: {
        fetch: async () => new Response("/* Version 4 stylesheet */", {
          headers: { "content-type": "text/css" },
        }),
      },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server renders the Observation Room entry", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /OBSERVATION ROOM/);
  assert.match(html, /You are not here.*to answer questions/i);
  assert.match(html, /No camera.*No identity.*No diagnosis/i);
  assert.match(html, /ENTER THE ROOM/);
  assert.match(html, /href="\/site\.css"/);
  assert.doesNotMatch(html, /[\u4e00-\u9fff]/);
  assert.doesNotMatch(html, /WORKBENCH|codex-preview|SkeletonPreview/);
});

test("source keeps the complete four-stage experiment", async () => {
  const page = await import("node:fs/promises").then(({ readFile }) =>
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  );

  for (const stage of ["THRESHOLD", "INFORMATION", "PACE", "PROJECTION"]) {
    assert.match(page, new RegExp(stage));
  }
  assert.match(page, /PATH CHANGES/);
  assert.match(page, /DATA TRANSMITTED/);
  assert.match(page, /not a validated psychological assessment/i);
  assert.match(page, /navigator\.clipboard/);
});

test("Version 4 styles responsive and reduced-motion states", async () => {
  const css = await import("node:fs/promises").then(({ readFile }) =>
    readFile(new URL("../public/site.css", import.meta.url), "utf8"),
  );

  assert.match(css, /\.observer-rail/);
  assert.match(css, /\.choice-card/);
  assert.match(css, /\.result-grid/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /max-width: 680px/);
});
