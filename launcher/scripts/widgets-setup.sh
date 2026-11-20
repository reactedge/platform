#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
    echo "Usage: mise run widgets-setup -- <widget-name>..." >&2
    exit 2
fi

for widget in "$@"; do
    if [[ ! "$widget" =~ ^[a-zA-Z0-9][a-zA-Z0-9._-]*$ || "$widget" == "." || "$widget" == ".." ]]; then
        echo "Invalid widget name: $widget" >&2
        exit 2
    fi
done

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

for widget in "$@"; do
    repo_url="git@github.com:reactedge/widget-$widget.git"
    echo "Finding latest stable tag for $widget..."
    remote_tags="$(git ls-remote --tags --refs "$repo_url")"
    latest_tag="$(awk -F '\t' '$2 ~ /^refs\/tags\/v?[0-9]+\.[0-9]+\.[0-9]+$/ { sub("refs/tags/", "", $2); print $2 }' <<< "$remote_tags" | sort -V | tail -n 1)"

    if [[ -z "$latest_tag" ]]; then
        echo "No stable semantic version tag found in $repo_url" >&2
        exit 1
    fi

    "$script_dir/widget-install.sh" "$widget" "$latest_tag"
done
