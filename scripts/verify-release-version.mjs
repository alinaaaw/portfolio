import { readFile } from "node:fs/promises";

const releaseTag = process.env.RELEASE_TAG;

if (!releaseTag) {
  throw new Error("RELEASE_TAG is required.");
}

const packageJson = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
);
const expectedTag = `v${packageJson.version}`;

if (releaseTag !== expectedTag) {
  throw new Error(
    `Release tag ${releaseTag} does not match package version ${packageJson.version}; expected ${expectedTag}.`,
  );
}

console.log(`Verified ${releaseTag} against package version ${packageJson.version}.`);
