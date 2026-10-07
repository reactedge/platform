#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

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

echo
echo "========================================"
echo "ReactEdge Configuration"
echo "========================================"
echo
echo "Press ENTER to accept the default value."
echo

echo "Environment"
echo "-----------"

prompt \
    "Store Code" \
    STORE_CODE_INPUT \
    "default"

STORE_CODE_INPUT="${STORE_CODE_INPUT:-default}"

CONFIG="$ROOT/.env.${STORE_CODE_INPUT}"

echo "Preparing ReactEdge workspace..."

# Initialise root environment configuration.
if [[ ! -f "$CONFIG" ]]; then
    if [[ ! -f "$ROOT/.env.sample" ]]; then
        echo "❌ Missing .env.sample"
        exit 1
    fi

    cp "$ROOT/.env.sample" "$CONFIG"
    echo "✓ Created .env from .env.sample"
fi

echo

if [[ -f "$CONFIG" ]]; then
    # Load existing configuration
    set -a
    source "$CONFIG"
    STORE_CODE=$STORE_CODE_INPUT
    set +a
fi

echo
echo "Platform"
echo "--------"
echo "Configure the website where ReactEdge will run."

prompt \
    "Site URL" \
    SITEURL \
    "https://mageos-docker.magsite.co.uk"

echo "========================================"
echo "ReactEdge Configuration"
echo "========================================"
echo
echo "Press ENTER to accept the default value."
echo

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

# Initialise store workspace.
STORE_WORKSPACE="$ROOT/workspace/$STORE_CODE"

if [[ ! -f "$STORE_WORKSPACE/registry.json" ]]; then
    if [[ ! -d "$ROOT/workspace.sample" ]]; then
        echo "❌ Missing workspace.sample"
        exit 1
    fi

    mkdir -p "$STORE_WORKSPACE"
    cp -R "$ROOT/workspace.sample/default/." "$STORE_WORKSPACE/"

    echo "✓ Created workspace for store '$STORE_CODE' from workspace.sample"
fi

prompt \
    "Platform root directory" \
    TARGET_ROOT \
    "/var/www/docker_mageos/magento"

prompt \
    "Is the environment a PHP environment (eg: Magento) - (0 or 1)" \
    PHP_ENV \
    "1"

echo
echo "External Services"
echo "-----------------"
echo "Only configure the services required by the widgets you intend to use."

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

echo
echo "Optional Capabilities"
echo "---------------------"
echo "Enable additional ReactEdge capabilities for this installation.
      Intent Discovery requires the ReactEdge Intent Engine.
      The installer will configure and run it automatically."

prompt \
    "Enable Observability (0 or 1)" \
    OBSERVABILITY_ENABLED \
    "0"

if [[ "$OBSERVABILITY_ENABLED" == "1" ]]; then
    prompt \
        "OpenTelemetry collector host" \
        OTEL_HOST \
        "https://otel.reactedge.net/v1/traces"
else
    OTEL_HOST=""
fi

prompt \
    "Enable Intent Discovery (0 or 1)" \
    INTENT_DISCOVERY_ENABLED \
    "0"

prompt \
    "Enable Seller Listing (0 or 1)" \
    SELLER_LISTING_ENABLED \
    "0"

if [[ "$SELLER_LISTING_ENABLED" == "1" ]]; then
    prompt \
        "Default Seller ID" \
        DEFAULT_SELLER_ID \
        "default-seller"
else
    DEFAULT_SELLER_ID=""
fi

  prompt \
      "Enable Cloudflare Turnstile (0 or 1)" \
      CLOUDFLARE_TURNSTILE_ENABLED \
      "0"

  if [ "$CLOUDFLARE_TURNSTILE_ENABLED" = "1" ]; then
    prompt "Cloudflare Turnstile Key" CLOUDFLARE_TURNSTILE_SITE_KEY ""
  fi

echo "Google Reviews"
echo "--------------"
echo "Display Google customer reviews."

prompt \
    "Enable Google Reviews (0 or 1)" \
    GOOGLE_REVIEWS_ENABLED \
    "0"

if [ "$GOOGLE_REVIEWS_ENABLED" = "1" ]; then
  prompt "Google Maps API Key" GOOGLE_MAPS_API_KEY ""
  prompt "Google Place ID" GOOGLE_PLACE_ID ""
fi

echo
echo "Demo Data"
echo "---------"
echo "Used by example widgets during local development."

prompt \
    "Demo product SKU" \
    SKU \
    "WJ12"

prompt \
    "Demo category" \
    CATEGORY \
    "tops-men"

echo
echo "Server-Side Rendering (SSR)"
echo "---------------------------"
echo "Generate pre-rendered HTML alongside the npm packages."
echo "Enable this for hosts that cannot render React on the server (e.g. PHP)."

prompt \
    "Generate SSR artefacts (0 or 1)" \
    SSR_ENABLED \
    "1"

if [[ "$SSR_ENABLED" == "1" ]]; then
    SSR_PORT="4000"
    SSR_BASE_URL="https://widgets-ssr.co.uk"
fi

echo
echo "Environment"
echo "-----------"

prompt \
    "Environment (development or production)" \
    REACTEDGE_ENV \
    "development"

if [[ "$REACTEDGE_ENV" != "development" && "$REACTEDGE_ENV" != "production" ]]; then
    echo "❌ Environment must be 'development' or 'production'."
    exit 1
fi

if [[ "$REACTEDGE_ENV" == "development" ]]; then
        ALLOW_SELF_SIGNED_SSL=true
    else
        ALLOW_SELF_SIGNED_SSL=false
    fi

if [ "$INTENT_DISCOVERY_ENABLED" == "1" ]; then
    INTENT_API_CONFIG=',
    "intentApi": {
      "baseUrl": "http://localhost:3001"
    }'
else
    INTENT_API_CONFIG=""
fi

if [ "$GOOGLE_REVIEWS_ENABLED" == "1" ]; then
    GOOGLE_API_CONFIG=',
    "googleMaps": {
      "apiKey": "'"$GOOGLE_MAPS_API_KEY"'",
      "placeId": "'"$GOOGLE_PLACE_ID"'"
    }'
else
    GOOGLE_API_CONFIG=""
fi

if [ "$CLOUDFLARE_TURNSTILE_ENABLED" == "1" ]; then
    CLOUDFLARE_TURNSTILE_CONFIG=',
    "cloudflare": {
      "siteKey": "'"$CLOUDFLARE_TURNSTILE_SITE_KEY"'"
    }'
else
    CLOUDFLARE_TURNSTILE_CONFIG=""
fi

for dir in "$ROOT"/widgets/*; do
    if [[ -d "$dir" && -d "$dir/public" ]]; then
        WIDGET_NAME="$(basename "$dir")"
        echo "📦 Generating runtime for $WIDGET_NAME"

        SELLER_CONTEXT_CONFIG=""
        if [[ "$SELLER_LISTING_ENABLED" == "1" && "$WIDGET_NAME" == "createlisting" ]]; then
            SELLER_CONTEXT_CONFIG=',\n    "sellerId": "'"$DEFAULT_SELLER_ID"'"'
        fi

        cat > "$dir/public/reactedge-runtime.json" <<EOF
{
  "integrations": {
    "magentoGraphql": {
      "api": "$SITEURL/graphql"
    }$INTENT_API_CONFIG$GOOGLE_API_CONFIG$CLOUDFLARE_TURNSTILE_CONFIG
  },
  "context": {
    "storeCode": "$STORE_CODE",
    "sku": "$SKU",
    "category": "$CATEGORY"$SELLER_CONTEXT_CONFIG
  }
}
EOF
    fi
done

TEMPLATE_ROOT="$ROOT/packages/widget-template"

for TEMPLATE_TYPE in standard runtime runtime-shadow; do
    TEMPLATE_DIR="$TEMPLATE_ROOT/$TEMPLATE_TYPE"

    if [[ -d "$TEMPLATE_DIR/public" ]]; then
        echo "📦 Generating runtime config for $TEMPLATE_TYPE widget template"

        cat > "$TEMPLATE_DIR/public/reactedge-runtime.json" <<EOF
{
  "integrations": {
    "magentoGraphql": {
      "api": "$SITEURL/graphql"
    }$INTENT_API_CONFIG$GOOGLE_API_CONFIG$CLOUDFLARE_TURNSTILE_CONFIG
  },
  "context": {
    "storeCode": "$STORE_CODE",
    "sku": "$SKU",
    "category": "$CATEGORY"
  }
}
EOF
    fi
done

echo
echo "✅ Runtime configuration generated."
echo "✅ Configuration written to $CONFIG"

cat > "$CONFIG" <<EOF
STORE_CODE=$STORE_CODE
SITEURL=$SITEURL
PHP_ENV=$PHP_ENV
TARGET_ROOT=$TARGET_ROOT
SSR_ENABLED=$SSR_ENABLED
SSR_PORT="${SSR_PORT:-}"
SSR_BASE_URL="${SSR_BASE_URL:-}"
SKU=$SKU
CATEGORY=$CATEGORY
INTENT_DISCOVERY_ENABLED=$INTENT_DISCOVERY_ENABLED
SELLER_LISTING_ENABLED=$SELLER_LISTING_ENABLED
DEFAULT_SELLER_ID="${DEFAULT_SELLER_ID:-}"
CLOUDFLARE_TURNSTILE_ENABLED=$CLOUDFLARE_TURNSTILE_ENABLED
CLOUDFLARE_TURNSTILE_SITE_KEY=$CLOUDFLARE_TURNSTILE_SITE_KEY
GOOGLE_REVIEWS_ENABLED=$GOOGLE_REVIEWS_ENABLED
GOOGLE_MAPS_API_KEY="${GOOGLE_MAPS_API_KEY:-}"
GOOGLE_PLACE_ID="${GOOGLE_PLACE_ID:-}"
REACTEDGE_ENV=$REACTEDGE_ENV
OTEL_HOST="${OTEL_HOST:-}"
EOF

set -a
source "$CONFIG"
set +a

cat > "$ROOT/services/ssr/.env" <<EOF
SSR_PORT=$SSR_PORT
ALLOW_SELF_SIGNED_SSL=$ALLOW_SELF_SIGNED_SSL
OTEL_HOST=$OTEL_HOST
EOF

cat > "$ROOT/services/orchestrator/.env.${STORE_CODE}" <<EOF
STORE_CODE=$STORE_CODE
SITEURL=$SITEURL
TARGET_ROOT=$TARGET_ROOT
SSR_ENABLED=$SSR_ENABLED
PHP_ENV=$PHP_ENV
ALLOWED_HOSTS=""
EOF

cat > "$ROOT/mcp/.env.${STORE_CODE}" <<EOF
STORE_CODE=$STORE_CODE
SITEURL=$SITEURL
ALLOWED_HOSTS=""
EOF

cat > "$ROOT/browser-mcp/.env.${STORE_CODE}" <<EOF
SITEURL=$SITEURL
EOF
