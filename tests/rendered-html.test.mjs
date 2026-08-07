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
  assert.match(html, /This is where Alina Wu keeps projects, research notes, physical prototypes, and questions that do not fit inside a résumé/);
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
  assert.match(page, /User has not checked in/i);
  assert.match(page, /Alina Wu has been offline for four days.*This workstation continues to sync/i);
  assert.doesNotMatch(page, /Her computer/);
  assert.doesNotMatch(page, /Why is this appearing on a portfolio computer/);
  assert.doesNotMatch(page, /I am not missing/);
  assert.match(page, /The signal holds outside the lab/);
  assert.match(page, /EMG classifier is separating intentional contraction from drift/);
  assert.match(page, /bringing the hardware and full logs back to Lab 17/);
  assert.match(page, /mailto:awu78@uw\.edu/);
  assert.doesNotMatch(page, /mailto:hello@example\.com/);
  assert.match(page, /INCOMING FAX/);
  assert.match(page, /CLICK THE HIGHLIGHTED PRINTER/);
  assert.match(page, /onDoubleClick/);
  assert.doesNotMatch(page, /DOUBLE CLICK TO OPEN/);
  assert.doesNotMatch(page, />DOUBLE CLICK</);
  assert.match(page, /<h2>Alina<\/h2>/);
  for (const zone of ["drawer", "books", "notebook", "board", "fieldcase", "printer", "contact"]) {
    assert.match(page, new RegExp(`ZoneCloseup3D zone=\\"${zone}\\"`));
  }
  assert.match(page, /TURN PAGE/);
  assert.match(page, /book-turning-sheet/);
  assert.match(page, /FIELD PLANNING \/ NEXT · LATER · MAYBE/);
  assert.match(page, /PRINTER DESK \/ CONTACT CARD/);
  assert.match(page, /fax-reading/);
});

test("3D room and layered object exploration remain connected", async () => {
  const game = await import("node:fs/promises").then(({ readFile }) => readFile(new URL("../app/_components/LabGame.tsx", import.meta.url), "utf8"));
  const closeups = await import("node:fs/promises").then(({ readFile }) => readFile(new URL("../app/_components/ZoneCloseup3D.tsx", import.meta.url), "utf8"));
  const css = await import("node:fs/promises").then(({ readFile }) => readFile(new URL("../public/site.css", import.meta.url), "utf8"));
  assert.match(game, /WebGLRenderer/);
  assert.match(game, /cameraPoses/);
  assert.match(game, /Raycaster/);
  assert.match(game, /pointermove/);
  assert.match(game, /onInspect/);
  assert.match(game, /faxReady/);
  assert.match(game, /onPrinterInspect/);
  assert.match(game, /INCOMING FAX \/ CLICK PRINTER/);
  assert.doesNotMatch(game, /rover/i);
  assert.match(game, /drawer: \[-3\.53, \.84, -5\.38\]/);
  assert.match(closeups, /WebGLRenderer/);
  assert.match(closeups, /buildBooks/);
  assert.match(closeups, /buildDrawer/);
  assert.match(closeups, /monitorScreen/);
  assert.match(closeups, /roundedBox\(3\.45,2\.15,\.28/);
  assert.match(closeups, /buildNotebook/);
  assert.match(closeups, /buildBoard/);
  assert.match(closeups, /buildFieldCase/);
  assert.match(closeups, /buildPrinter/);
  assert.match(closeups, /buildContact/);
  assert.match(closeups, /RoundedBoxGeometry/);
  assert.match(closeups, /drawerProgress/);
  assert.match(closeups, /drawerWorkspace/);
  assert.match(closeups, /printProgress/);
  assert.match(closeups, /TubeGeometry/);
  assert.match(closeups, /if\(withFax&&hits\)/);
  assert.match(closeups, /USED ARCHERY PAPER/);
  for (const selector of ["lab-game", "computer-view", "os-screen", "model-scene", "model-detail", "physical-book", "book-turning-sheet", "contact-reading", "contact-card-detail", "fax-reading", "fax-paper"]) {
    assert.match(css, new RegExp(`\\.${selector}`));
  }
  assert.match(css, /@media \(max-width: 620px\)/);
  assert.match(css, /prefers-reduced-motion/);
});
