#!/usr/bin/env bash

set -euo pipefail

WIDGET="${1:-}"

if [[ -z "$WIDGET" ]]; then
    echo "Usage:"
    echo "  mise run widget-ssr -- <widget>"
    exit 1
fi

NODE_TLS_REJECT_UNAUTHORIZED=0 \
npx tsx \
    --tsconfig "widgets/$WIDGET/tsconfig.app.json" \
    packages/widget-build/ssr-generation/render-page.ts \
    "$WIDGET" \
    "./widgets/$WIDGET/public/cdn/default.json"