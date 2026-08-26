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
  assert.match(html, /This is where Alina Wu keeps algorithms, physical prototypes, research notes, and questions about how systems become understandable and useful to people/);
  assert.doesNotMatch(html, /missing person/i);
  assert.doesNotMatch(html, /[\u4e00-\u9fff]/);
});

test("source contains six room objects, real work, and a progressive reveal", async () => {
  const { readFile } = await import("node:fs/promises");
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const contentFiles = ["site","intro","room","computer","references","books","drawer","notebook","board","field-case","fax-contact"];
  const content = (await Promise.all(contentFiles.map((name) => readFile(new URL(`../content/${name}.json`, import.meta.url), "utf8")))).join("\n");
  for (const zone of ["computer", "drawer", "notebook", "books", "board", "fieldcase"]) {
    assert.match(page, new RegExp(`active===\\"${zone}\\"|active!==\\"${zone}\\"|\\"${zone}\\"`));
  }
  assert.match(page, /from "@\/content"/);
  assert.match(content, /ALINA\.OS/);
  assert.match(content, /PROJECTS \/ 3 ITEMS/);
  assert.match(content, /README\.txt/);
  assert.match(content, /LAB_LOG\.md/);
  assert.match(content, /Joining Thermo Fisher Scientific/);
  assert.doesNotMatch(content, /ABOUT\.txt/);
  assert.doesNotMatch(content, /[‘’]/);
  assert.match(page, /lab-log-line/);
  assert.match(content, /USER PROFILE \/ ALINA\.WU/);
  assert.match(page, /os-profile-trigger/);
  assert.match(page, /onToggleMaximize=\{toggleMaximizedWindow\}/);
  assert.match(page, /maximizedWindow===\"references\"/);
  assert.match(page, /window-maximize/);
  assert.match(page, /window-close/);
  assert.match(page, /taskbar-apps/);
  assert.match(page, /taskbarWindows\.map\(\(windowId\)=>/);
  assert.match(page, /taskbarWindowIds\.filter\(showComputerWindow\)/);
  assert.match(page, /label:"REFERENCES"/);
  assert.match(page, /label:"ALLOCATION"/);
  assert.match(page, /computerContent\.sidebar\.references\}<\/button><button onClick=\{\(\) => openComputerFile\(\"lablog\"\)\}/);
  assert.doesNotMatch(page, /computerContent\.sidebar\.readme/);
  assert.match(content, /Quality of Life in Shanghai/);
  assert.match(content, /Automatic and Satisfactory Course Assignment/);
  assert.match(content, /Monitoring Device for Muscle Usage.*Behavior/);
  assert.match(content, /Social Futures Lab/i);
  assert.match(content, /Thermo Fisher Scientific/i);
  assert.match(content, /User has not checked in/i);
  assert.match(content, /Alina Wu has been offline for four days.*This workstation continues to sync/i);
  assert.doesNotMatch(content, /Her computer/);
  assert.doesNotMatch(content, /Why is this appearing on a portfolio computer/);
  assert.doesNotMatch(content, /I am not missing/);
  assert.match(content, /The first wellbeing prototype is ready for feedback/);
  assert.match(content, /FEEDBACK IN PROGRESS/);
  assert.match(content, /awu78@uw\.edu/);
  assert.doesNotMatch(content, /hello@example\.com/);
  assert.match(content, /INCOMING FAX/);
  assert.match(content, /CLICK THE HIGHLIGHTED PRINTER/);
  assert.match(page, /onDoubleClick/);
  assert.doesNotMatch(page, /DOUBLE CLICK TO OPEN/);
  assert.doesNotMatch(page, />DOUBLE CLICK</);
  for (const zone of ["drawer", "books", "notebook", "board", "fieldcase", "printer", "contact"]) {
    assert.match(page, new RegExp(`ZoneCloseup3D zone=\\"${zone}\\"`));
  }
  assert.match(content, /TURN PAGE/);
  assert.match(page, /book-turning-sheet/);
  assert.match(content, /FIELD CASE \/ LIFE OUTSIDE THE LAB/);
  assert.match(content, /WORLD MAP \/ TRAVEL PINS/);
  assert.match(page, /field-map-reading/);
  assert.match(page, /drawFieldCaseMapViewport/);
  assert.doesNotMatch(content, /editable layout markers|Replace prompts and layout pins/);
  assert.match(content, /REFERENCES\.web/);
  assert.match(content, /PERSONAL SHELF \/ BOOKS \+ FILMS/);
  assert.match(content, /Whole Brain Living/);
  assert.match(content, /Keigo Higashino Series/);
  assert.match(content, /Journey Under the Midnight Sun/);
  assert.match(content, /Farewell My Concubine/);
  assert.match(page, /series:higashino/);
  assert.doesNotMatch(page, /selectedMovie|dvd-case-detail|dvd-zoom/);
  assert.match(content, /A New Solution to the Random Assignment Problem/);
  assert.match(content, /How Should We Normalize Electromyograms/);
  assert.match(page, /artifact-facts/);
  assert.match(page, /notebook-process/);
  assert.match(page, /field-metrics/);
  assert.match(content, /CONTACT CARD BESIDE PRINTER/);
  assert.match(page, /fax-reading/);
});

test("editable copy is organized into valid category files", async () => {
  const { readFile } = await import("node:fs/promises");
  for (const name of ["site","intro","room","computer","references","books","drawer","notebook","board","field-case","fax-contact"]) {
    const source = await readFile(new URL(`../content/${name}.json`, import.meta.url), "utf8");
    assert.doesNotThrow(() => JSON.parse(source), `${name}.json must remain valid JSON`);
  }
  const guide = await readFile(new URL("../content/CONTENT_GUIDE.md", import.meta.url), "utf8");
  assert.match(guide, /Website Copy Editing Guide/);
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
  assert.match(game, /faxPrinted/);
  assert.match(game, /onPrinterInspect/);
  assert.match(game, /room\.faxAlert\.sceneLabel/);
  assert.doesNotMatch(game, /rover/i);
  assert.match(game, /drawer: \[-3\.53, \.84, -5\.38\]/);
  assert.match(closeups, /WebGLRenderer/);
  assert.match(closeups, /buildBooks/);
  assert.match(closeups, /movie:\$\{movie\.id\}/);
  assert.match(closeups, /hoverOnly=true/);
  assert.match(closeups, /CylinderGeometry\(\.27,\.27,\.018,48\)/);
  assert.match(closeups, /MeshPhysicalMaterial/);
  assert.match(closeups, /RoundedBoxGeometry\(\.72,\.86,\.052/);
  assert.match(closeups, /series:higashino/);
  assert.doesNotMatch(closeups, /const bookShelf=/);
  assert.doesNotMatch(closeups, /const divider=/);
  assert.match(closeups, /makeBook\(book,index,-\.94\+index\*\.63,\.43,true,false\)/);
  assert.match(closeups, /mediaBasket=true/);
  assert.match(closeups, /filmBasket\.add\(group\)/);
  assert.match(closeups, /const x=2\.05,y=\.54,z=-\.36\+index\*\.065/);
  assert.doesNotMatch(closeups, /const x=\.34\+index\*\.3/);
  assert.match(closeups, /roundedBox\(8\.25,2\.95,\.22/);
  assert.match(closeups, /books:\{position:\[0,2\.05,9\.4\],target:\[0,1\.62,0\]/);
  assert.match(closeups, /buildDrawer/);
  assert.match(closeups, /monitorScreen/);
  assert.match(closeups, /roundedBox\(3\.45,2\.15,\.28/);
  assert.match(closeups, /buildNotebook/);
  assert.match(closeups, /buildBoard/);
  assert.match(closeups, /buildFieldCase/);
  assert.match(closeups, /buildPrinter/);
  assert.match(closeups, /buildContact/);
  assert.match(closeups, /buildPrinterDesk/);
  assert.match(closeups, /contactCardGroup/);
  assert.match(closeups, /contactCardRaised/);
  assert.match(closeups, /RoundedBoxGeometry/);
  assert.match(closeups, /drawerProgress/);
  assert.match(closeups, /drawerWorkspace/);
  assert.match(closeups, /printProgress/);
  assert.match(closeups, /TubeGeometry/);
  assert.match(closeups, /if\(showFax\)/);
  assert.match(closeups, /onFaxPrinted/);
  assert.match(closeups, /fieldCaseContent\.itemLabels\.target/);
  for (const selector of ["lab-game", "computer-view", "os-screen", "model-scene", "model-detail", "physical-book", "book-turning-sheet", "series-catalog", "contact-reading", "contact-card-detail", "fax-reading", "fax-paper"]) {
    assert.match(css, new RegExp(`\\.${selector}`));
  }
  assert.match(css, /@media \(max-width: 620px\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /contactCardPickup/);
  assert.match(css, /contactCardReturn/);
  assert.match(css, /\.os-window\.is-maximized/);
  assert.match(css, /\.window-controls/);
  assert.match(css, /\.taskbar-app\.active/);
});

test("field case map uses real country geometry instead of hand-drawn continents", async () => {
  const { readFile } = await import("node:fs/promises");
  const mapSource = await readFile(new URL("../app/_components/fieldCaseMap.ts", import.meta.url), "utf8");
  const photoLibrary = await readFile(new URL("../app/_components/travelPhotoLibrary.ts", import.meta.url), "utf8");
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../public/site.css", import.meta.url), "utf8");
  const photoGuide = await readFile(new URL("../app/_assets/travel-map-photos/README.md", import.meta.url), "utf8");
  const nycGuide = await readFile(new URL("../app/_assets/travel-map-photos/new-york-city/ADD-PHOTOS-HERE.md", import.meta.url), "utf8");
  const countries = JSON.parse(await readFile(new URL("../app/_components/worldCountries110m.json", import.meta.url), "utf8"));
  assert.ok(countries.length >= 170, "the map should retain Natural Earth country coverage");
  assert.ok(countries.every((country) => country.g?.type === "Polygon" || country.g?.type === "MultiPolygon"));
  assert.match(mapSource, /fill\("evenodd"\)/);
  assert.match(mapSource, /\[-width,0,width\]/);
  assert.match(mapSource, /FIELD_CASE_TRAVEL_PINS/);
  assert.match(mapSource, /FIELD_CASE_MAP_VIEWS/);
  assert.match(mapSource, /worldGroup/);
  assert.match(mapSource, /camera\.zoom<2\.25/);
  for (const place of ["Seattle", "San Francisco", "Los Angeles", "San Diego", "New York City", "Philadelphia", "Boston", "Orlando", "Busan", "Bangkok", "Chongqing", "Xi'an", "Shanghai", "Osaka", "Tokyo", "Beijing", "Macau", "Qingdao", "Dalian", "Beihai", "Lijiang"]) {
    assert.match(mapSource, new RegExp(place.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.doesNotMatch(mapSource, /name:"(?:Nanjing|Suzhou|Yixing)"/);
  assert.equal([...mapSource.matchAll(/\{name:"/g)].length, 21);
  assert.equal([...mapSource.matchAll(/country:"/g)].length, 21);
  assert.equal([...mapSource.matchAll(/photoFolder:"/g)].length, 21);
  assert.equal([...mapSource.matchAll(/region:"asia"/g)].length, 13);
  const worldGroups = [...mapSource.matchAll(/worldGroup:"([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(worldGroups).size, 19);
  assert.match(mapSource, /name:"Seattle"[^\n]+worldGroup:"seattle"/);
  assert.match(mapSource, /name:"Los Angeles"[^\n]+worldGroup:"southern-california"/);
  assert.match(mapSource, /name:"San Diego"[^\n]+worldGroup:"southern-california"/);
  assert.match(mapSource, /name:"Busan"[^\n]+country:"South Korea"[^\n]+worldGroup:"busan"/);
  assert.match(mapSource, /name:"Osaka"[^\n]+country:"Japan"[^\n]+worldGroup:"osaka"/);
  assert.doesNotMatch(mapSource, /japan-korea|usa-west/);
  const mapReading = page.match(/function FieldMapReading[\s\S]*?\n}\n\nfunction FieldCaseScene/)?.[0] ?? "";
  assert.match(mapReading, /onWheel/);
  assert.match(mapReading, /setPointerCapture/);
  assert.match(mapReading, /field-map-views/);
  assert.match(mapReading, /travelPhotosForPin/);
  assert.match(mapReading, /field-map-memory/);
  assert.match(mapReading, /Previous photo/);
  assert.match(mapReading, /Next photo/);
  assert.match(mapReading, /randomLostTravelMessage/);
  assert.match(photoLibrary, /import\.meta\.glob/);
  assert.match(photoLibrary, /photoFolder/);
  assert.match(photoLibrary, /localeCompare/);
  assert.doesNotMatch(page, /manifest\.json/);
  assert.match(css, /\.field-map-memory/);
  assert.match(photoGuide, /不需要修改代码/);
  assert.match(nycGuide, /new-york-city/);
  assert.doesNotMatch(mapReading, /item\.copy|field-map-places|object-tags/);
  assert.doesNotMatch(mapSource, /landMasses/);
});
