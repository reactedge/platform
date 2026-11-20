#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 2 ]]; then
    echo "Usage: mise run widget-install <widget-name> <version>" >&2
    exit 2
fi

widget="$1"
version="$2"

if [[ ! "$widget" =~ ^[a-zA-Z0-9][a-zA-Z0-9._-]*$ || "$widget" == "." || "$widget" == ".." ]]; then
    echo "Invalid widget name: $widget" >&2
    exit 2
fi

if ! git check-ref-format "refs/tags/$version"; then
    echo "Invalid version/tag: $version" >&2
    exit 2
fi

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
root="$(git -C "$script_dir/../.." rev-parse --show-toplevel)"
widgets_dir="$root/widgets"
destination="$widgets_dir/$widget"
repo_url="git@github.com:reactedge/widget-$widget.git"
staging_dir="$(mktemp -d "$widgets_dir/.${widget}.install.XXXXXX")"

cleanup() {
    rm -rf -- "$staging_dir"
}
trap cleanup EXIT

echo "Fetching $repo_url at $version..."
git clone --depth 1 --branch="$version" "$repo_url" "$staging_dir/widget"

rm -rf -- "$destination"
mv -- "$staging_dir/widget" "$destination"
echo "Installed widget $widget at $version"
