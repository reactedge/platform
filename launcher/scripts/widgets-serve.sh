#!/usr/bin/env bash

set -e

ROOT="$(git rev-parse --show-toplevel)"

cd "$ROOT"

npx serve workspace/release/source --listen 3000