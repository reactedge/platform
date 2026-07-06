#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

for dir in "$ROOT"/widgets/*; do
    if [[ -d "$dir" && -f "$dir/package.json" ]]; then
        echo
        echo "📦 Installing $(basename "$dir")"

        (
            cd "$dir"
            npm install
        )
    fi
done