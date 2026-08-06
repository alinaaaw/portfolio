import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html", host: "localhost" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server renders the gradual Lab 17 portfolio opening", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Lab 17 Interactive Portfolio/i);
  assert.match(html, /A workspace.*still.*thinking/is);
  assert.match(html, /LAUNCH INSPECTION UNIT/);
  assert.match(html, /Wenrui.*Alina.*Wu/i);
  assert.doesNotMatch(html, /A person is.*missing/i);
  assert.doesNotMatch(html, /[\u4e00-\u9fff]/);
});

test("source contains real portfolio records and a progressive mystery", async () => {
  const page = await import("node:fs/promises").then(({ readFile }) => readFile(new URL("../app/page.tsx", import.meta.url), "utf8"));
  for (const station of ["terminal", "route", "hardware", "notebook", "fieldcase"]) {
    assert.match(page, new RegExp(`inspect\\(\\"${station}\\"\\)|active === \\"${station}\\"`));
  }
  assert.match(page, /Quality of Life in Shanghai/);
  assert.match(page, /Automatic and Satisfactory Course Assignment/);
  assert.match(page, /Muscle Usage.*Behavior Monitor/);
  assert.match(page, /Social Futures Lab/i);
  assert.match(page, /Thermo Fisher Scientific/i);
  assert.match(page, /has not responded for four days/);
  assert.match(page, /I&apos;m not missing/);
});

test("3D game supports driving, proximity inspection, touch, and direct access", async () => {
  const game = await import("node:fs/promises").then(({ readFile }) => readFile(new URL("../app/_components/LabGame.tsx", import.meta.url), "utf8"));
  const css = await import("node:fs/promises").then(({ readFile }) => readFile(new URL("../public/site.css", import.meta.url), "utf8"));
  assert.match(game, /WebGLRenderer/);
  assert.match(game, /destinationStation/);
  assert.match(game, /keydown/);
  assert.match(game, /mobile-drive/);
  assert.match(css, /\.lab-game/);
  assert.match(css, /\.proximity-prompt/);
  assert.match(css, /\.portfolio-index/);
  assert.match(css, /@media \(max-width: 620px\)/);
});
