import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const releaseTypes = new Set(["major", "minor", "patch"]);
const scriptPath = fileURLToPath(import.meta.url);
const repositoryRoot = path.resolve(path.dirname(scriptPath), "..");

function parseVersion(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) {
    throw new Error(`Unsupported version "${version}"; expected X.Y.Z`);
  }

  const parts = match.slice(1).map(Number);
  if (parts.some((part) => !Number.isSafeInteger(part))) {
    throw new Error(`Version "${version}" contains an unsafe integer`);
  }

  return parts;
}

export function incrementVersion(version, releaseType) {
  if (!releaseTypes.has(releaseType)) {
    throw new Error(
      `Unknown release type "${releaseType}"; use major, minor, or patch`,
    );
  }

  const [major, minor, patch] = parseVersion(version);
  if (releaseType === "major") {
    return `${major + 1}.0.0`;
  }
  if (releaseType === "minor") {
    return `${major}.${minor + 1}.0`;
  }
  return `${major}.${minor}.${patch + 1}`;
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

function serializeJson(value) {
  return `${JSON.stringify(value, null, "\t")}\n`;
}

export async function bumpVersion(
  root,
  releaseType,
  { dryRun = false } = {},
) {
  const paths = {
    package: path.join(root, "package.json"),
    plugin: path.join(root, "plugin.json"),
    marketplace: path.join(root, ".github", "plugin", "marketplace.json"),
  };
  const [packageManifest, pluginManifest, marketplaceManifest] =
    await Promise.all([
      readJson(paths.package),
      readJson(paths.plugin),
      readJson(paths.marketplace),
    ]);

  const marketplacePlugins = marketplaceManifest.plugins.filter(
    (plugin) => plugin.name === packageManifest.name,
  );
  if (marketplacePlugins.length !== 1) {
    throw new Error(
      `Expected one marketplace entry for "${packageManifest.name}", found ${marketplacePlugins.length}`,
    );
  }

  const currentVersion = packageManifest.version;
  const versions = new Map([
    ["package.json", currentVersion],
    ["plugin.json", pluginManifest.version],
    [".github/plugin/marketplace.json metadata", marketplaceManifest.metadata.version],
    [
      ".github/plugin/marketplace.json plugin",
      marketplacePlugins[0].version,
    ],
  ]);
  const mismatches = [...versions].filter(
    ([, version]) => version !== currentVersion,
  );
  if (mismatches.length > 0) {
    throw new Error(
      [
        `Version manifests are out of sync with package.json (${currentVersion}):`,
        ...mismatches.map(([file, version]) => `- ${file}: ${version}`),
      ].join("\n"),
    );
  }

  const nextVersion = incrementVersion(currentVersion, releaseType);
  packageManifest.version = nextVersion;
  pluginManifest.version = nextVersion;
  marketplaceManifest.metadata.version = nextVersion;
  marketplacePlugins[0].version = nextVersion;

  if (!dryRun) {
    await Promise.all([
      fs.writeFile(paths.package, serializeJson(packageManifest)),
      fs.writeFile(paths.plugin, serializeJson(pluginManifest)),
      fs.writeFile(paths.marketplace, serializeJson(marketplaceManifest)),
    ]);
  }

  return { currentVersion, nextVersion, dryRun };
}

async function run() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const positionalArgs = args.filter((arg) => arg !== "--dry-run");

  if (positionalArgs.length !== 1 || !releaseTypes.has(positionalArgs[0])) {
    throw new Error(
      "Usage: npm run bump -- <major|minor|patch> [--dry-run]",
    );
  }

  const result = await bumpVersion(repositoryRoot, positionalArgs[0], {
    dryRun,
  });
  console.log(
    `${result.currentVersion} -> ${result.nextVersion}${dryRun ? " (dry run)" : ""}`,
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  run().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
