#!/usr/bin/env bash
# Outputs which app dirs (api, view, dashboard) have changes between base and head.
# Usage: scripts/changed-app-dirs.sh <base_ref> [head_ref]
# Output: space-separated list e.g. "api view" (only dirs with changes)

set -e

BASE_REF="${1:?Usage: changed-app-dirs.sh <base_ref> [head_ref]}"
HEAD_REF="${2:-HEAD}"

MERGE_BASE=$(git merge-base "$BASE_REF" "$HEAD_REF" 2>/dev/null || true)
[[ -z "$MERGE_BASE" ]] && MERGE_BASE="$BASE_REF"

CHANGED=$(git diff --name-only "$MERGE_BASE" "$HEAD_REF" 2>/dev/null || true)
CHANGED_API=false
CHANGED_VIEW=false
CHANGED_DASHBOARD=false

while IFS= read -r file; do
  [[ -z "$file" ]] && continue
  [[ "$file" == api/* ]] && CHANGED_API=true
  [[ "$file" == view/* ]] && CHANGED_VIEW=true
  [[ "$file" == dashboard/* ]] && CHANGED_DASHBOARD=true
done <<< "$CHANGED"

out=""
[[ "$CHANGED_API" == "true" ]] && out="api"
[[ "$CHANGED_VIEW" == "true" ]] && out="${out:+$out }view"
[[ "$CHANGED_DASHBOARD" == "true" ]] && out="${out:+$out }dashboard"
echo "$out"
