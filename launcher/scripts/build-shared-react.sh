#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

RELEASE_DIR="${REACTEDGE_RELEASE_SOURCE:-workspace/release/source}"
mkdir -p "$RELEASE_DIR"
RELEASE_DIR="$(cd -- "$RELEASE_DIR" && pwd)"

./node_modules/.bin/vite build --config packages/widget-build/shared-react/vite.config.ts --outDir "$RELEASE_DIR"

if [[ "${1:-}" == "--runtime-only" ]]; then
    exit 0
fi

failed=()
for directory in widgets/*; do
    widget="${directory##*/}"
    if [[ -f "$directory/vite_project/vite.config.ts" ]]; then
        directory="$directory/vite_project"
    fi
    [[ -f "$directory/vite.config.ts" ]] || continue

    if ! npm --prefix "$directory" run build -- --outDir "$RELEASE_DIR/$widget"; then
        failed+=("$widget")
    fi
done

if (( ${#failed[@]} )); then
    printf 'Widget builds failed: %s\n' "${failed[*]}" >&2
    exit 1
fi
