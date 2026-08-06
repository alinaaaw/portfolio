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

test("server renders a personal laboratory before revealing the mystery", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Lab 17 Interactive Portfolio/i);
  assert.match(html, /Come in.*lab is.*still awake/is);
  assert.match(html, /ENTER LAB 17/);
  assert.match(html, /Wenrui.*Alina.*Wu/i);
  assert.doesNotMatch(html, /missing person/i);
  assert.doesNotMatch(html, /[\u4e00-\u9fff]/);
});

test("source contains six room objects, real work, and a progressive reveal", async () => {
  const page = await import("node:fs/promises").then(({ readFile }) => readFile(new URL("../app/page.tsx", import.meta.url), "utf8"));
  for (const zone of ["computer", "drawer", "notebook", "books", "board", "fieldcase"]) {
    assert.match(page, new RegExp(`active===\\"${zone}\\"|active!==\\"${zone}\\"|\\"${zone}\\"`));
  }
  assert.match(page, /ALINA\.OS/);
  assert.match(page, /PROJECTS \/ 3 ITEMS/);
  assert.match(page, /ABOUT\.txt/);
  assert.match(page, /Quality of Life in Shanghai/);
  assert.match(page, /Automatic and Satisfactory Course Assignment/);
  assert.match(page, /Muscle Usage.*Behavior Monitor/);
  assert.match(page, /Social Futures Lab/i);
  assert.match(page, /Thermo Fisher Scientific/i);
  assert.match(page, /offline for four days/);
  assert.match(page, /I am not missing/);
  assert.match(page, /PRINTER ACTIVE/);
});

test("3D room supports object hitboxes, camera moves, and fax state", async () => {
  const game = await import("node:fs/promises").then(({ readFile }) => readFile(new URL("../app/_components/LabGame.tsx", import.meta.url), "utf8"));
  const css = await import("node:fs/promises").then(({ readFile }) => readFile(new URL("../public/site.css", import.meta.url), "utf8"));
  assert.match(game, /WebGLRenderer/);
  assert.match(game, /cameraPoses/);
  assert.match(game, /Raycaster/);
  assert.match(game, /pointermove/);
  assert.match(game, /onInspect/);
  assert.match(game, /faxReady/);
  assert.doesNotMatch(game, /rover/i);
  for (const selector of ["lab-game", "computer-view", "os-screen", "drawer-closeup", "notebook-closeup", "board-closeup", "fax-paper"]) {
    assert.match(css, new RegExp(`\\.${selector}`));
  }
  assert.match(css, /@media \(max-width: 620px\)/);
  assert.match(css, /prefers-reduced-motion/);
});
