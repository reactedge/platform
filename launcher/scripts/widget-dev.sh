#!/usr/bin/env bash

set -euo pipefail

WIDGET="${1:-}"

if [ -z "$WIDGET" ]; then
  echo "Usage:"
  echo "  mise run widget-dev -- <widget>"
  exit 1
fi

cd "widgets/$WIDGET"

npm run dev