#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CONFIG="$ROOT/.env"

if [[ -f "$CONFIG" ]]; then
    # Load existing configuration
    set -a
    source "$CONFIG"
    set +a
fi

echo "ReactEdge Configuration"
echo

prompt() {
    local label="$1"
    local var="$2"
    local default="$3"

    local current="${!var:-}"

    echo

    if [[ -n "$current" ]]; then
        read -rp "$label [$current]: " value
        printf -v "$var" "%s" "${value:-$current}"
    else
        read -rp "$label [$default]: " value
        printf -v "$var" "%s" "${value:-$default}"
    fi
}


#read -rp "Cloudflare Turnstile Site Key (optional): " CLOUDFLARE_KEY
#read -rp "Google Maps API Key (optional): " GOOGLE_MAPS_API_KEY
#read -rp "Google Place ID (optional): " GOOGLE_PLACE_ID
#read -rp "Magento GraphQL API [https://mageos-docker.magsite.co.uk/graphql]: " MAGENTO_GRAPHQL_API
#MAGENTO_GRAPHQL_API=${MAGENTO_GRAPHQL_API:-https://mageos-docker.magsite.co.uk/graphql}
#read -rp "Intent API Base URL [http://localhost:8000/v1]: " INTENT_API_BASE_URL
#INTENT_API_BASE_URL=${INTENT_API_BASE_URL:-http://localhost:8000/v1}
#read -rp "Store Code [default]: " STORE_CODE
#STORE_CODE=${STORE_CODE:-default}
#read -rp "Category [tops-men]: " CATEGORY
#CATEGORY=${CATEGORY:-tops-men}
prompt "Cloudflare Turnstile Site Key" CLOUDFLARE_TURNSTILE_SITE_KEY ""
prompt "Google Maps API Key" GOOGLE_MAPS_API_KEY ""
prompt "Google Place ID" GOOGLE_PLACE_ID ""

prompt \
    "Magento GraphQL API" \
    MAGENTO_GRAPHQL_API \
    "https://mageos-docker.magsite.co.uk/graphql"

prompt \
    "Intent API Base URL" \
    INTENT_API_BASE_URL \
    "http://localhost:8000/v1"

prompt \
    "Store Code" \
    STORE_CODE \
    "default"

prompt \
    "Category" \
    CATEGORY \
    "tops-men"

prompt \
    "SKU" \
    SKU \
    "WJ12"

echo

for dir in "$ROOT"/widgets/*; do
    if [[ -d "$dir" && -d "$dir/public" ]]; then
        echo "📦 Generating runtime for $(basename "$dir")"

        cat > "$dir/public/reactedge-runtime.json" <<EOF
{
  "integrations": {
    "cloudflare": {
      "siteKey": "$CLOUDFLARE_TURNSTILE_SITE_KEY"
    },
    "googleMaps": {
      "apiKey": "$GOOGLE_MAPS_API_KEY",
      "placeId": "$GOOGLE_PLACE_ID"
    },
    "magentoGraphql": {
      "api": "$MAGENTO_GRAPHQL_API"
    },
    "intentApi": {
      "baseUrl": "$INTENT_API_BASE_URL"
    }
  },
  "storeCode": "$STORE_CODE",
  "category": "$CATEGORY",
  "sku": "$SKU"
}
EOF
    fi
done

echo
echo "✅ Runtime configuration generated."
echo "✅ Configuration written to $CONFIG"
