#!/usr/bin/env bash

set -euo pipefail

install_project() {
    local dir="$1"

    if [[ -f "$dir/package.json" ]]; then
        echo
        echo "📦 Installing $(basename "$dir")"

        (
            cd "$dir"
            npm install
        )
    fi
}

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Deployment Orchestrator platform
install_project "$ROOT/deployment-orchestrator"

# Root platform
install_project "$ROOT"

# Widgets
for dir in "$ROOT"/widgets/*; do
    [[ -d "$dir" ]] && install_project "$dir"
done

