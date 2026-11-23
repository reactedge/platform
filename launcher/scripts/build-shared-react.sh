#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

./node_modules/.bin/vite build --config packages/widget-build/shared-react/vite.config.ts

for widget in usp categoryfaq; do
    REACTEDGE_SHARED_REACT=1 npm --prefix "widgets/$widget" run build -- \
        --outDir "../../workspace/release/pilot/shared-react/$widget"
done
