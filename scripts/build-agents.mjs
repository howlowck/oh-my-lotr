import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import Handlebars from "handlebars";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(root, "agent-src");
const outputRoot = path.join(root, ".github", "agents");
const checkOnly = process.argv.includes("--check");

const config = JSON.parse(
  await fs.readFile(path.join(sourceRoot, "agents.config.json"), "utf8"),
);

const corePartial = await fs.readFile(
  path.join(sourceRoot, "partials", "shared", "core.md.hbs"),
  "utf8",
);

function resolveDimensions(agentName, selections) {
  const resolved = [];

  for (const [dimensionName, selectedValue] of Object.entries(selections)) {
    const value = config.dimensions[dimensionName]?.[selectedValue];
    if (!value) {
      throw new Error(
        `${agentName}: unknown ${dimensionName} value "${selectedValue}"`,
      );
    }
    resolved.push({ dimensionName, selectedValue, ...value });
  }

  return resolved;
}

function resolveModel(agentName, dimensions) {
  for (const dimensionName of config.modelPrecedence) {
    const model = dimensions.find(
      (dimension) => dimension.dimensionName === dimensionName,
    )?.model;
    if (model) {
      return model;
    }
  }

  throw new Error(`${agentName}: dimensions do not resolve to a model`);
}

async function readProfilePartial(dimensions) {
  const chunks = [];

  for (const dimension of dimensions) {
    if (!dimension.instructions) {
      continue;
    }
    chunks.push(
      await fs.readFile(
        path.join(
          sourceRoot,
          "partials",
          `${dimension.instructions}.md.hbs`,
        ),
        "utf8",
      ),
    );
  }

  return chunks.join("\n");
}

function normalize(content) {
  return `${content.replace(/\r\n/g, "\n").trimEnd()}\n`;
}

await fs.mkdir(outputRoot, { recursive: true });

const mismatches = [];
const configuredAgents = new Set(Object.keys(config.agents));
const sourceAgents = (await fs.readdir(path.join(sourceRoot, "agents")))
  .filter((file) => file.endsWith(".agent.md.hbs"))
  .map((file) => file.replace(/\.agent\.md\.hbs$/, ""));
const unexpectedSources = sourceAgents.filter(
  (agentName) => !configuredAgents.has(agentName),
);
const missingSources = [...configuredAgents].filter(
  (agentName) => !sourceAgents.includes(agentName),
);

if (unexpectedSources.length > 0 || missingSources.length > 0) {
  throw new Error(
    [
      unexpectedSources.length > 0
        ? `Unconfigured templates: ${unexpectedSources.join(", ")}`
        : "",
      missingSources.length > 0
        ? `Missing templates: ${missingSources.join(", ")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n"),
  );
}

const extraOutputs = (await fs.readdir(outputRoot))
  .filter((file) => file.endsWith(".agent.md"))
  .filter(
    (file) => !configuredAgents.has(file.replace(/\.agent\.md$/, "")),
  );

if (checkOnly) {
  mismatches.push(
    ...extraOutputs.map((file) => path.join(".github", "agents", file)),
  );
} else {
  await Promise.all(
    extraOutputs.map((file) => fs.rm(path.join(outputRoot, file))),
  );
}

for (const [agentName, selections] of Object.entries(config.agents)) {
  const dimensions = resolveDimensions(agentName, selections);
  const model = resolveModel(agentName, dimensions);
  const sourcePath = path.join(
    sourceRoot,
    "agents",
    `${agentName}.agent.md.hbs`,
  );
  const outputPath = path.join(outputRoot, `${agentName}.agent.md`);
  const source = await fs.readFile(sourcePath, "utf8");

  Handlebars.registerPartial("shared/core", corePartial);
  Handlebars.registerPartial(
    "shared/profile",
    await readProfilePartial(dimensions),
  );

  const render = Handlebars.compile(source, {
    noEscape: true,
    strict: true,
  });
  const generated = normalize(
    render({
      ...selections,
      modelYaml: `model:\n  - ${model.display}\n  - ${model.id}`,
    }),
  );

  if (checkOnly) {
    let current = "";
    try {
      current = normalize(await fs.readFile(outputPath, "utf8"));
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
    if (current !== generated) {
      mismatches.push(path.relative(root, outputPath));
    }
  } else {
    await fs.writeFile(outputPath, generated);
  }
}

if (mismatches.length > 0) {
  console.error(
    `Generated agents are stale:\n${mismatches.map((file) => `- ${file}`).join("\n")}`,
  );
  process.exitCode = 1;
} else {
  console.log(
    checkOnly
      ? `Checked ${Object.keys(config.agents).length} generated agents.`
      : `Built ${Object.keys(config.agents).length} agents.`,
  );
}
