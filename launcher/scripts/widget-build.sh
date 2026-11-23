#!/usr/bin/env bash

set -euo pipefail

WIDGET="${1:-}"

if [ -z "$WIDGET" ]; then
  echo "Usage:"
  echo "  mise run widget-build -- <widget>"
  exit 1
fi

npx tsx packages/widget-validation/src/cli.ts "$WIDGET"

bash launcher/scripts/build-shared-react.sh --runtime-only

cd "widgets/$WIDGET"

npm run build
