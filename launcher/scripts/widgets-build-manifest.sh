#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

if [[ "${1:-}" == "nossr" ]]; then
    export SSR_ENABLED=0
fi

echo "🚀 Building deployment orchestrator"

cd "$ROOT"

bash launcher/scripts/build-shared-react.sh --runtime-only

export REDIS_URL="${REDIS_URL:-redis://localhost:6379}"

echo "Starting SSR worker"

(
    cd "$ROOT/services/orchestrator"
    node --import tsx ssr-worker.ts </dev/null
) &

SSR_WORKER_PID=$!

cleanup() {
    echo "Stopping SSR worker"

    kill "$SSR_WORKER_PID" 2>/dev/null || true
    wait "$SSR_WORKER_PID" 2>/dev/null || true
}

trap cleanup EXIT

echo "SSR worker PID: $SSR_WORKER_PID"

sleep 1

if ! kill -0 "$SSR_WORKER_PID" 2>/dev/null; then
    echo "❌ SSR worker failed to start"
    wait "$SSR_WORKER_PID"
    exit 1
fi

echo "SSR worker running"
echo "Starting orchestrator"

(
    cd "$ROOT/services/orchestrator"
    npm run build
)

echo "Orchestrator completed"
