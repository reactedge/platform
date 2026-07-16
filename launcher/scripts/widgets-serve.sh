#!/usr/bin/env bash

set -e

ROOT="$(git rev-parse --show-toplevel)"

cd "$ROOT"

# launcher/scripts/widgets-deploy.sh

source .env

(
    cd services/ssr

    npm install
    npm run start
)