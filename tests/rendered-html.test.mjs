import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
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
  assert.match(html, /href="\/about"/);
  assert.match(html, /href="\/projects"/);
  assert.match(html, /href="\/notes"/);
  assert.match(html, /href="\/away"/);
  assert.match(html, /href="\/site\.css"/);
  assert.doesNotMatch(html, /href="\/version1"|href="\/version2"/);
  assert.doesNotMatch(html, /[\u4e00-\u9fff]/);
});

test("keeps all five signals and lightweight demos", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const engine = await readFile(new URL("../app/_components/focus-field/useArcheryEngine.ts", import.meta.url), "utf8");
  const physics = await readFile(new URL("../app/_components/focus-field/archery-physics.ts", import.meta.url), "utf8");

  for (const area of ["web", "algorithm", "hardware", "notes", "travel"]) {
    assert.match(page, new RegExp(`openZone\\(\\"${area}\\"\\)`));
  }
  assert.match(page, /RUN ALLOCATION/);
  assert.match(page, /START STREAM/);
  assert.match(page, /TRACE THE WORKFLOW/);
  assert.match(page, /Quality of Life in Shanghai/);
  assert.match(page, /Social Futures Lab/);
  assert.match(page, /MOVE TO AIM · HOLD TO DRAW · RELEASE/);
  assert.match(page, /setPointerCapture/);
  assert.match(page, /data-zone="notes"/);
  assert.match(page, /HOLD A LITTLE LONGER/);
  assert.match(page, /SIGNAL UNLOCKED/);
  assert.match(page, /kind="range"/);
  assert.doesNotMatch(page, /range-landmark landmark-locker/);
  assert.match(engine, /requestAnimationFrame/);
  assert.match(engine, /ResizeObserver/);
  assert.match(physics, /velocityY.*gravity/);
});

test("renders four deeper personal rooms", async () => {
  const expectations = [
    ["/about", /No biography/i],
    ["/projects", /Nothing leaves/i],
    ["/notes", /reverse side/i],
    ["/away", /route is pinned/i],
  ];

  for (const [pathname, expected] of expectations) {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, expected);
    assert.match(html, /href="\/site\.css"/);
    assert.doesNotMatch(html, /[\u4e00-\u9fff]/);
  }
});

