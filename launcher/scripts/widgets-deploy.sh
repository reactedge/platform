#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "🚀 Building deployment orchestrator"

(
    cd "$ROOT/deployment-orchestrator"
    npm run build
)

source .env

REACTEDGE_WORKSPACE="$(dirname "$TARGET_ROOT")/reactedge"

mkdir -p "$REACTEDGE_WORKSPACE"

rsync -av --delete \
    ./workspace/ \
    "$REACTEDGE_WORKSPACE/"

echo "files copied to $REACTEDGE_WORKSPACE"
echo "✅ Deployment orchestrator built successfully"