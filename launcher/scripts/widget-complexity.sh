#!/usr/bin/env bash
set -euo pipefail

# Run from the platform root, independently of the caller's working directory.
root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
widget="${1:-}"

if [[ ! "$widget" =~ ^[a-z][a-z0-9_-]*$ ]]; then
    echo "Usage: mise run complexity -- <widget>" >&2
    echo "Widget must be a single name such as cmsblock or productgallery." >&2
    exit 2
fi

widget_dir="$root/widgets/$widget"
if [[ ! -d "$widget_dir" ]]; then
    echo "Unknown widget '$widget': $widget_dir does not exist." >&2
    exit 2
fi

targets=()
for directory in src api; do
    if [[ -d "$widget_dir/$directory" ]]; then
        targets+=("$directory")
    fi
done

if [[ ${#targets[@]} -eq 0 ]]; then
    echo "Widget '$widget' has neither src nor api to analyze." >&2
    exit 2
fi

if ! command -v lizard >/dev/null 2>&1; then
    echo "Lizard not found. Run this check through mise to install the pinned tool." >&2
    exit 2
fi

cd "$widget_dir"
exec lizard "${targets[@]}" -C 10 -a 5
