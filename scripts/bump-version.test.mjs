import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { bumpVersion, incrementVersion } from "./bump-version.mjs";

async function createRepository(version = "1.2.0") {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "oh-my-lotr-version-"));
  await fs.mkdir(path.join(root, ".github", "plugin"), { recursive: true });
  await Promise.all([
    fs.writeFile(
      path.join(root, "package.json"),
      JSON.stringify({ name: "oh-my-lotr", version }),
    ),
    fs.writeFile(
      path.join(root, "plugin.json"),
      JSON.stringify({ name: "oh-my-lotr", version }),
    ),
    fs.writeFile(
      path.join(root, ".github", "plugin", "marketplace.json"),
      JSON.stringify({
        metadata: { version },
        plugins: [{ name: "oh-my-lotr", version }],
      }),
    ),
  ]);
  return root;
}

async function readVersions(root) {
  const [packageManifest, pluginManifest, marketplaceManifest] =
    await Promise.all([
      fs.readFile(path.join(root, "package.json"), "utf8").then(JSON.parse),
      fs.readFile(path.join(root, "plugin.json"), "utf8").then(JSON.parse),
      fs
        .readFile(path.join(root, ".github", "plugin", "marketplace.json"), "utf8")
        .then(JSON.parse),
    ]);

  return [
    packageManifest.version,
    pluginManifest.version,
    marketplaceManifest.metadata.version,
    marketplaceManifest.plugins[0].version,
  ];
}

for (const [releaseType, expected] of [
  ["major", "2.0.0"],
  ["minor", "1.3.0"],
  ["patch", "1.2.1"],
]) {
  test(`bumps the ${releaseType} version across every manifest`, async (t) => {
    const root = await createRepository();
    t.after(() => fs.rm(root, { recursive: true, force: true }));

    const result = await bumpVersion(root, releaseType);

    assert.equal(result.nextVersion, expected);
    assert.deepEqual(await readVersions(root), Array(4).fill(expected));
  });
}

test("dry runs without changing manifests", async (t) => {
  const root = await createRepository();
  t.after(() => fs.rm(root, { recursive: true, force: true }));

  const result = await bumpVersion(root, "minor", { dryRun: true });

  assert.equal(result.nextVersion, "1.3.0");
  assert.deepEqual(await readVersions(root), Array(4).fill("1.2.0"));
});

test("rejects inconsistent manifests before writing", async (t) => {
  const root = await createRepository();
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const pluginPath = path.join(root, "plugin.json");
  await fs.writeFile(
    pluginPath,
    JSON.stringify({ name: "oh-my-lotr", version: "1.1.0" }),
  );

  await assert.rejects(
    bumpVersion(root, "patch"),
    /Version manifests are out of sync/,
  );
  assert.deepEqual(await readVersions(root), [
    "1.2.0",
    "1.1.0",
    "1.2.0",
    "1.2.0",
  ]);
});

test("rejects unsupported release types and versions", () => {
  assert.throws(() => incrementVersion("1.2.0", "latest"), /Unknown release/);
  assert.throws(() => incrementVersion("v1.2.0", "patch"), /expected X.Y.Z/);
});
