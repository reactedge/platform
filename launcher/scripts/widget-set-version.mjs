import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [widgetDir, version, ...extraArgs] = process.argv.slice(2);

if (!widgetDir || !version || extraArgs.length > 0) {
  throw new Error("Usage: node widget-set-version.mjs <widget-directory> <version>");
}

const manifestPath = join(widgetDir, "package.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
manifest.version = version;
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

for (const lockName of ["package-lock.json", "npm-shrinkwrap.json"]) {
  const lockPath = join(widgetDir, lockName);
  if (!existsSync(lockPath)) continue;

  const lock = JSON.parse(readFileSync(lockPath, "utf8"));
  lock.version = version;
  if (lock.packages?.[""]) lock.packages[""].version = version;
  writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`);
}

console.log(`Set ${manifest.name ?? widgetDir} package version to ${version}`);
