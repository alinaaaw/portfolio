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

test("server renders an unmistakable personal portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /ALINA\.WU/);
  assert.match(html, /Hi, I.*m Alina/i);
  assert.match(html, /I build with.*code/i);
  assert.match(html, /SELECTED WORK/);
  assert.match(html, /AWAY FROM THE KEYBOARD/);
  assert.match(html, /A SMALL EXPERIMENT/);
  assert.match(html, /href="\/site\.css"/);
  assert.doesNotMatch(html, /OBSERVATION ROOM|PASSIVE SIGNALS|codex-preview/);
});

test("source keeps projects and the optional experiment", async () => {
  const page = await import("node:fs/promises").then(({ readFile }) =>
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  );

  for (const area of ["WEB / PRODUCT THINKING", "ALGORITHMS / REASONING", "HARDWARE / PHYSICAL SYSTEMS"]) {
    assert.match(page, new RegExp(area));
  }
  assert.match(page, /startExperiment/);
  assert.match(page, /Nothing is saved/);
  assert.match(page, /not a definition of you/i);
});

test("Version 4 uses warm responsive styles", async () => {
  const css = await import("node:fs/promises").then(({ readFile }) =>
    readFile(new URL("../public/site.css", import.meta.url), "utf8"),
  );

  assert.match(css, /--cream: #f7f1e6/);
  assert.match(css, /\.portrait-board/);
  assert.match(css, /\.project-workspace/);
  assert.match(css, /\.experiment-card/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /max-width: 640px/);
});
