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
  assert.doesNotMatch(page, /I am not missing/);
  assert.match(page, /The signal holds outside the lab/);
  assert.match(page, /EMG classifier is separating intentional contraction from drift/);
  assert.match(page, /bringing the hardware and full logs back to Lab 17/);
  assert.match(page, /PRINTER ACTIVE/);
  assert.match(page, /onDoubleClick/);
  assert.match(page, /SINGLE CLICK TO SELECT \/ DOUBLE CLICK TO OPEN/);
  assert.match(page, /lab-bookshelf-closeup\.png/);
  assert.match(page, /lab-drawer-open\.png/);
  assert.match(page, /GRAB HANDLE AND PULL DOWN/);
  assert.match(page, /TURN PAGE/);
  assert.match(page, /fax-output/);
});

test("photoreal room supports precise hotspots, parallax, and layered object exploration", async () => {
  const game = await import("node:fs/promises").then(({ readFile }) => readFile(new URL("../app/_components/LabGame.tsx", import.meta.url), "utf8"));
  const css = await import("node:fs/promises").then(({ readFile }) => readFile(new URL("../public/site.css", import.meta.url), "utf8"));
  assert.match(game, /lab-workspace-v2\.png/);
  assert.match(game, /photo-stage/);
  assert.match(game, /zone-hotspot/);
  assert.match(game, /pointerMove/);
  assert.match(game, /focus-\$\{requested\}/);
  assert.match(game, /onInspect/);
  assert.match(game, /faxReady/);
  assert.doesNotMatch(game, /rover/i);
  for (const selector of ["photo-lab", "zone-hotspot", "computer-view", "os-screen", "drawer-photo-stage", "bookshelf-photo-stage", "physical-book", "fax-output", "fax-paper"]) {
    assert.match(css, new RegExp(`\\.${selector}`));
  }
  assert.match(css, /@media \(max-width: 620px\)/);
  assert.match(css, /prefers-reduced-motion/);
});

test("photographic room and object close-up assets are present", async () => {
  const { stat } = await import("node:fs/promises");
  for (const asset of ["lab-workspace-v2.png", "lab-bookshelf-closeup.png", "lab-drawer-open.png"]) {
    const info = await stat(new URL(`../public/${asset}`, import.meta.url));
    assert.ok(info.size > 1_000_000, `${asset} should be a high-resolution photographic asset`);
  }
});
