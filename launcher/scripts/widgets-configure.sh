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
    "Store Code" \
    STORE_CODE \
    "default"

prompt \
    "Target site URL" \
    TARGET_SITEURL \
    "https://mageos-docker.magsite.co.uk"

prompt \
    "Target root" \
    TARGET_ROOT \
    "/var/www/docker_mageos/magento"

REACTEDGE_ROOT="$(dirname "$TARGET_ROOT")/reactedge"

echo "Checking ReactEdge workspace: $REACTEDGE_ROOT"

mkdir -p "$REACTEDGE_ROOT"

touch "$REACTEDGE_ROOT/.reactedge-write-test" || {
    echo
    echo "Error: ReactEdge must be writable."
    echo
    echo "Expected layout:"
    echo "  $(dirname "$TARGET_ROOT")/"
    echo "  ├── magento/"
    echo "  └── reactedge/"
    exit 1
}

rm -f "$REACTEDGE_ROOT/.reactedge-write-test"

prompt \
    "Allowed hosts" \
    ALLOWED_HOSTS \
    "localhost,127.0.0.1,mageos-docker.magsite.co.uk"

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
    }
  },
  "context": {
    "storeCode": "$STORE_CODE",
    "category": "$CATEGORY",
    "sku": "$SKU"
  }
}
EOF
    fi
done

echo
echo "✅ Runtime configuration generated."
echo "✅ Configuration written to $CONFIG"

cat > "$CONFIG" <<EOF
CLOUDFLARE_TURNSTILE_SITE_KEY=$CLOUDFLARE_TURNSTILE_SITE_KEY
GOOGLE_MAPS_API_KEY=$GOOGLE_MAPS_API_KEY
GOOGLE_PLACE_ID=$GOOGLE_PLACE_ID
MAGENTO_GRAPHQL_API=$MAGENTO_GRAPHQL_API
STORE_CODE=$STORE_CODE
TARGET_SITEURL=$TARGET_SITEURL
TARGET_ROOT=$TARGET_ROOT
ALLOWED_HOSTS=$ALLOWED_HOSTS
CATEGORY=$CATEGORY
SKU=$SKU
EOF

set -a
source "$CONFIG"
set +a

cat > "$ROOT/deployment-orchestrator/.env.dev" <<EOF
STORE_CODE=$STORE_CODE
TARGET_SITEURL=$TARGET_SITEURL
TARGET_ROOT=$TARGET_ROOT
ALLOWED_HOSTS=$ALLOWED_HOSTS
EOF

