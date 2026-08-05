import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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
            return new Response("/* Focus Field stylesheet */", {
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

test("renders the Version 2 Focus Field at the root", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Follow.*your.*focus/i);
  assert.match(html, /FOCUS FIELD/);
  assert.match(html, /href="\/site\.css"/);
  assert.doesNotMatch(html, /href="\/version1"|href="\/version2"/);
  assert.doesNotMatch(html, /[\u4e00-\u9fff]/);
});

test("keeps all five signals and lightweight demos", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  for (const area of ["web", "algorithm", "hardware", "notes", "travel"]) {
    assert.match(page, new RegExp(`openZone\\(\\"${area}\\"\\)`));
  }
  assert.match(page, /RUN PATH/);
  assert.match(page, /POWER ON/);
  assert.match(page, /RECALCULATE ROUTE/);
});

