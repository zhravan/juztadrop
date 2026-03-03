#!/usr/bin/env bash
# Version bump check: when api/, view/, or dashboard/ have changes,
# root package.json version must be greater than the base ref version.
# Usage: scripts/version-bump-check.sh <base_ref> [head_ref]
#   base_ref: e.g. origin/main
#   head_ref: optional, default HEAD
# Exit 0 if valid, 1 if version bump required but missing.

set -e

BASE_REF="${1:?Usage: version-bump-check.sh <base_ref> [head_ref]}"
HEAD_REF="${2:-HEAD}"

APP_DIRS=("api" "view" "dashboard")
ROOT_PACKAGE="package.json"

# Get root package.json version at base ref (allow missing ref in shallow clone)
get_version() {
  local ref=$1
  if git show "${ref}:${ROOT_PACKAGE}" 2>/dev/null | jq -r '.version // empty'; then
    return 0
  fi
  echo "0.0.0"
}

# Check if path is under an app dir (and not only root package.json)
is_app_change() {
  local path=$1
  [[ "$path" == api/* ]] || [[ "$path" == view/* ]] || [[ "$path" == dashboard/* ]]
}

BASE_VERSION=$(get_version "$BASE_REF")
CURRENT_VERSION=$(get_version "$HEAD_REF")

# List changed files between base and head (merge base for PRs)
MERGE_BASE=$(git merge-base "$BASE_REF" "$HEAD_REF" 2>/dev/null || true)
if [[ -z "$MERGE_BASE" ]]; then
  MERGE_BASE="$BASE_REF"
fi
CHANGED_FILES=$(git diff --name-only "$MERGE_BASE" "$HEAD_REF" 2>/dev/null || true)

APP_DIRS_CHANGED=false
while IFS= read -r file; do
  [[ -z "$file" ]] && continue
  if is_app_change "$file"; then
    APP_DIRS_CHANGED=true
    break
  fi
done <<< "$CHANGED_FILES"

if [[ "$APP_DIRS_CHANGED" != "true" ]]; then
  echo "No changes in api/, view/, or dashboard/ — version bump not required."
  exit 0
fi

# Compare semver: current must be greater than base
compare_versions() {
  local a=$1 b=$2
  local winner
  winner=$(echo -e "${a}\n${b}" | sort -V | tail -n1)
  [[ "$winner" == "$b" && "$a" != "$b" ]]
}

if compare_versions "$BASE_VERSION" "$CURRENT_VERSION"; then
  echo "Version bump OK: ${BASE_VERSION} -> ${CURRENT_VERSION}"
  exit 0
fi

echo "::error::Root package.json version must be bumped when api/, view/, or dashboard/ change."
echo "  Base (${BASE_REF}) version: ${BASE_VERSION}"
echo "  Current version: ${CURRENT_VERSION}"
echo "  Bump the 'version' field in the root package.json and commit."
exit 1
