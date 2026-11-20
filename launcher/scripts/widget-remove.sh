#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
    echo "Usage: mise run widget-remove -- <widget-name>" >&2
    exit 2
fi

widget="$1"
if [[ ! "$widget" =~ ^[a-zA-Z0-9][a-zA-Z0-9._-]*$ || "$widget" == "." || "$widget" == ".." ]]; then
    echo "Invalid widget name: $widget" >&2
    exit 2
fi

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
root="$(git -C "$script_dir/../.." rev-parse --show-toplevel)"
widget_dir="$root/widgets/$widget"

if [[ ! -d "$widget_dir" ]]; then
    echo "Widget directory not found: $widget_dir" >&2
    exit 1
fi

rm -rf -- "$widget_dir"
echo "Removed widget $widget"
