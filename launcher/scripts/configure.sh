#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CONFIG="$ROOT/.env.local"

echo "ReactEdge Configuration"
echo

read -rp "Cloudflare Turnstile Site Key (optional): " CLOUDFLARE_KEY
read -rp "Google Maps API Key (optional): " GOOGLE_MAPS_API_KEY
read -rp "Google Place ID (optional): " GOOGLE_PLACE_ID

echo

for dir in "$ROOT"/widgets/*; do
    if [[ -d "$dir" && -d "$dir/public" ]]; then
        echo "📦 Generating runtime for $(basename "$dir")"

        cat > "$dir/public/reactedge-runtime.json" <<EOF
{
  "integrations": {
    "cloudflare": {
      "siteKey": "$CLOUDFLARE_KEY"
    },
    "googleMaps": {
      "apiKey": "$GOOGLE_MAPS_API_KEY",
      "placeId": "$GOOGLE_PLACE_ID"
    }
  }
}
EOF
    fi
done

echo
echo "✅ Runtime configuration generated."
echo "✅ Configuration written to $CONFIG"