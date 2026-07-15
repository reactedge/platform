import { execSync } from "node:child_process";

const ROOT = execSync(
    "git rev-parse --show-toplevel",
    { encoding: "utf8" }
).trim();

export function getReactEdgeRoot(): string {
    return ROOT;
}

