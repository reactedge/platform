#!/bin/bash
set -e

WIDGET_NAME=$1
BASE_DIR="www"

if [ -z "$WIDGET_NAME" ]; then
  echo "Usage: build-widget.sh <widget-name>"
  exit 1
fi

VERSION=$(node -p "require('./vite_project/package.json').version")

FILE=$(ls www/widget-${WIDGET_NAME}@*.iife.js 2>/dev/null)
COUNT=$(echo "$FILE" | wc -l)

if [ "$COUNT" -ne 1 ]; then
  echo "ERROR: expected 1 build file, found $COUNT"
  ls www/
  exit 1
fi

# IMPORTANT: keep base64 (NOT url-safe) for SRI
HASH=$(openssl dgst -sha256 -binary "$FILE" | openssl base64 -A)
HASH=$(echo "$HASH" | tr '+/' '-_' | tr -d '=')

NEW_FILE="${BASE_DIR}/widget-${WIDGET_NAME}@${HASH}.iife.js"

if [ "$FILE" != "$NEW_FILE" ]; then
  mv "$FILE" "$NEW_FILE"
else
  echo "File already correctly named, skipping mv"
fi

MANIFEST="${BASE_DIR}/widget-${WIDGET_NAME}.manifest.json"

cat <<EOF > "$MANIFEST"
{
  "widget": "${WIDGET_NAME}",
  "version": "${VERSION}",
  "hash": "${HASH}",
  "filename": "widget-${WIDGET_NAME}@${HASH}.iife.js",
  "built_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo "version=$VERSION" >> $GITHUB_OUTPUT
echo "hash=$HASH" >> $GITHUB_OUTPUT
echo "file=$NEW_FILE" >> $GITHUB_OUTPUT