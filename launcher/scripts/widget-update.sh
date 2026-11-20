#!/usr/bin/env bash
set -euo pipefail

die() {
    echo "$*" >&2
    exit 1
}

is_valid_widget_name() {
    [[ "$1" =~ ^[a-zA-Z0-9][a-zA-Z0-9._-]*$ && "$1" != "." && "$1" != ".." ]]
}

is_valid_version() {
    [[ "$1" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$ ]] \
        && git check-ref-format "refs/tags/v$1"
}

ref_exists() {
    awk -F '\t' -v wanted="$2" '$2 == wanted { found = 1 } END { exit !found }' <<< "$1"
}

if [[ $# -ne 2 ]]; then
    die "Usage: mise run widget-update -- <widget-name> <version>"
fi

widget="$1"
version="$2"
is_valid_widget_name "$widget" || die "Invalid widget name: $widget"
is_valid_version "$version" || die "Invalid version: $version"

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
root="$(git -C "$script_dir/../.." rev-parse --show-toplevel)"
widget_dir="$root/widgets/$widget"
[[ -d "$widget_dir" ]] || die "Widget directory not found: $widget_dir"

repo_url="git@github.com:reactedge/widget-$widget.git"
tag="v$version"
remote_refs="$(git ls-remote --heads --tags --refs "$repo_url")"
if ref_exists "$remote_refs" "refs/tags/$tag"; then
    echo "Tag $tag already exists in $repo_url; skipping update"
    exit 0
fi

temp_dir="$(mktemp -d "${TMPDIR:-/tmp}/reactedge-widget-update.XXXXXX")"
cleanup() {
    rm -rf -- "$temp_dir"
}
trap cleanup EXIT

repo_dir="$temp_dir/widget-$widget"
if ref_exists "$remote_refs" "refs/heads/main"; then
    git clone --branch main --single-branch "$repo_url" "$repo_dir"
else
    mkdir -p "$repo_dir"
    git -C "$repo_dir" init
    git -C "$repo_dir" checkout -b main
    git -C "$repo_dir" remote add origin "$repo_url"
fi

node "$script_dir/widget-set-version.mjs" "$widget_dir" "$version"

rsync -a --delete \
    --exclude='.git/' \
    --exclude='node_modules/' \
    --exclude='dist/' \
    "$widget_dir/" "$repo_dir/"

git -C "$repo_dir" add -A
if ! git -C "$repo_dir" diff --cached --quiet; then
    git -C "$repo_dir" commit -m "chore($widget): update for $tag"
fi

git -C "$repo_dir" tag -a "$tag" -m "Release $tag"
git -C "$repo_dir" push --atomic origin main "refs/tags/$tag"
echo "Pushed widget $widget and created tag $tag"
