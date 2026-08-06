import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html", host: "localhost" } }),
    {
      ASSETS: {
        fetch: async (request) => {
          const url = new URL(request.url);
          if (url.pathname === "/site.css") {
            return new Response("/* Version 3 stylesheet */", { headers: { "content-type": "text/css" } });
          }
          return new Response("Not found", { status: 404 });
        },
      },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the English Version 3 investigation", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Case File 03.*Missing Researcher/i);
  assert.match(html, /A person is.*missing.*The work is not/is);
  assert.match(html, /ENTER LAB/);
  assert.match(html, /EVIDENCE WALL/);
  assert.match(html, /href="\/site\.css"/);
  assert.doesNotMatch(html, /[\u4e00-\u9fff]/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview/);
});

test("source contains five discoverable evidence files and the final reveal", async () => {
  const page = await import("node:fs/promises").then(({ readFile }) =>
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  );

  for (const clue of ["terminal", "route", "device", "notebook", "fieldbag"]) {
    assert.match(page, new RegExp(`openClue\\(\\"${clue}\\"\\)`));
  }
  assert.match(page, /She was never missing/);
  assert.match(page, /RUN SEARCH/);
  assert.match(page, /POWER ON/);
  assert.match(page, /RECALCULATE \/ PLAN B/);
});

test("Version 3 styles the lab, evidence board, and responsive investigation", async () => {
  const css = await import("node:fs/promises").then(({ readFile }) =>
    readFile(new URL("../public/site.css", import.meta.url), "utf8"),
  );

  assert.match(css, /\.lab-shell/);
  assert.match(css, /\.clue-object/);
  assert.match(css, /\.evidence-board/);
  assert.match(css, /\.clue-drawer/);
  assert.match(css, /@media \(max-width: 680px\)/);
});
