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

tag_candidates=("refs/tags/$version")
if [[ "$version" != v* ]]; then
    tag_candidates+=("refs/tags/v$version")
fi

remote_tags="$(git ls-remote --tags --refs "$repo_url" "${tag_candidates[@]}")"
tag=""
for candidate in "${tag_candidates[@]}"; do
    if awk -F '\t' -v candidate="$candidate" '$2 == candidate { found = 1 } END { exit !found }' <<< "$remote_tags"; then
        tag="${candidate#refs/tags/}"
        break
    fi
done

if [[ -z "$tag" ]]; then
    echo "Tag $version (or v$version) was not found in $repo_url" >&2
    exit 1
fi

echo "Fetching $repo_url at tag $tag..."
git clone --depth 1 --branch="$tag" "$repo_url" "$staging_dir/widget"

rm -rf -- "$destination"
mv -- "$staging_dir/widget" "$destination"
echo "Installed widget $widget at $tag"
