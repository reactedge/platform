#!/usr/bin/env bash
# Compare USP slide clipping before and after the min-height fix.
#
# Usage (from the platform root):
#   widgets/usp/tests/height-before-after.sh
#
# Environment:
#   PW_CONFIG   Playwright config (default: tests/playwright.dev.config.ts).
#
# The "after" run uses min-height. The "before" run temporarily fixes the
# height to 45px. Both runs write results to a new test-results/usp-height.*
# directory.

set -euo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../../.." && pwd)"
CSS="widgets/usp/src/styles/usp.item.css"
SPEC="widgets/usp/tests/usp.height.spec.ts"
PW_CONFIG="${PW_CONFIG:-tests/playwright.dev.config.ts}"

cd "$ROOT"

if ! rg -q '^    min-height: 45px;$' "$CSS"; then
    echo "Expected a 45px minimum slide height in $CSS" >&2
    exit 1
fi

mkdir -p "$ROOT/test-results"
OUT="$(mktemp -d "$ROOT/test-results/usp-height.XXXXXX")"
BACKUP="$(mktemp)"
cp "$CSS" "$BACKUP"

setsid npm --prefix widgets/usp run dev -- --port 5173 --strictPort > "$OUT/vite.log" 2>&1 &
DEV_PID=$!

cleanup() {
    cp "$BACKUP" "$CSS"
    rm -f "$BACKUP"
    kill -- -"$DEV_PID" 2>/dev/null || kill "$DEV_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

for _ in $(seq 1 60); do
    curl -s -o /dev/null http://localhost:5173/ && break
    sleep 0.5
done

run() {
    local label="$1"
    echo "== Running '$label'"
    USP_HEIGHT_LABEL="$label" USP_HEIGHT_OUT="$OUT" \
        ./node_modules/.bin/playwright test --config="$PW_CONFIG" "$SPEC" \
        --reporter=line > "$OUT/$label.log" 2>&1 \
        && echo "   all scenarios pass" \
        || echo "   some scenarios fail (see $OUT/$label.log)"
}

run after

sed 's/^    min-height: 45px;$/    height: 45px;/' "$BACKUP" > "$CSS"
sleep 1
run before

cp "$BACKUP" "$CSS"

node --input-type=module - "$OUT" <<'EOF'
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const out = process.argv[2];
const results = readdirSync(out)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(readFileSync(join(out, file), "utf8")));

const key = (r) => `${r.contract} @ ${r.scenario}`;
const rows = new Map();
for (const r of results) {
    const row = rows.get(key(r)) ?? {};
    row[r.label] = r;
    rows.set(key(r), row);
}

const cell = (r) => r
    ? `panel ${r.panelHeight}px, clipped ${r.slides.map((s) => s.clippedPx).join("/")}px`
    : "n/a";

console.log("\nScenario".padEnd(38) + "Before".padEnd(36) + "After");
const html = [];
for (const [name, row] of [...rows].sort()) {
    console.log(name.padEnd(37) + cell(row.before).padEnd(36) + cell(row.after));
    const img = (r) => r ? `<img src="${r.label}-${r.contract}-${r.scenario}.png" alt="${r.label} ${name}">` : "n/a";
    html.push(`<tr><th>${name}</th><td>${cell(row.before)}<br>${img(row.before)}</td><td>${cell(row.after)}<br>${img(row.after)}</td></tr>`);
}

writeFileSync(join(out, "report.html"), `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<title>USP slide height: before / after</title>
<style>body{font-family:sans-serif}td,th{border:1px solid #ccc;padding:6px;vertical-align:top;text-align:left}img{max-width:640px;display:block;margin-top:4px}</style>
</head><body><h1>USP slide height: before / after</h1>
<table><thead><tr><th>Scenario</th><th>Before</th><th>After</th></tr></thead><tbody>${html.join("")}</tbody></table></body></html>`);
console.log(`\nReport: ${join(out, "report.html")}`);
EOF
