#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "🚀 Building deployment orchestrator"

(
    cd "$ROOT/deployment/orchestrator"
    npm run build
)

echo
echo "✅ Deployment orchestrator built successfully"