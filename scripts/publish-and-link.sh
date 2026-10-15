#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/publish-and-link.sh /absolute/path/to/tajeerai_workspace [owner/repo] [submodule-path]
# Must be run from the unpacked QA project, OUTSIDE the parent working tree.
QA_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
PARENT="${1:-}"
REMOTE="${2:-husseinzaher/tajeerai_qa}"
PATH_IN_PARENT="${3:-qa}"
if [[ -z "$PARENT" || ! -d "$PARENT/.git" && ! -f "$PARENT/.git" ]]; then
  echo "Provide the local Tajeer AI workspace root with a .git directory." >&2
  exit 2
fi
PARENT="$(cd "$PARENT" && pwd -P)"
[[ "$QA_DIR" != "$PARENT"/* ]] || { echo 'Extract QA outside of the parent repository.' >&2; exit 2; }
[[ "$PATH_IN_PARENT" =~ ^[a-zA-Z][a-zA-Z0-9_-]*$ ]] || { echo 'Submodule path must be a single directory name.' >&2; exit 2; }
for cmd in gh git; do command -v "$cmd" >/dev/null || { echo "Missing $cmd. Install it first." >&2; exit 2; }; done
[[ ! -e "$PARENT/$PATH_IN_PARENT" ]] || { echo "Target directory already exists: $PARENT/$PATH_IN_PARENT" >&2; exit 2; }
gh auth status >/dev/null
if gh repo view "$REMOTE" >/dev/null 2>&1; then
  echo "Refusing to overwrite existing GitHub repo $REMOTE. Publish into an empty/new repository manually." >&2
  exit 2
fi

if [[ ! -e "$QA_DIR/.git" ]]; then git -C "$QA_DIR" init -b main; fi
if ! git -C "$QA_DIR" config user.name >/dev/null || ! git -C "$QA_DIR" config user.email >/dev/null; then
  echo 'Configure git user.name and user.email before publishing.' >&2
  exit 2
fi
if [[ -z "$(git -C "$QA_DIR" log -1 --format=%H 2>/dev/null || true)" ]]; then
  git -C "$QA_DIR" add .
  git -C "$QA_DIR" commit -m 'test: bootstrap independent Tajeer AI Playwright suite'
fi
# gh creates a PRIVATE repository and pushes the local main branch.
gh repo create "$REMOTE" --private --source "$QA_DIR" --remote origin --push
# No parent branch is pushed or committed without the developer reviewing the diff.
git -C "$PARENT" submodule add -b main "git@github.com:${REMOTE}.git" "$PATH_IN_PARENT"
git -C "$PARENT" add .gitmodules "$PATH_IN_PARENT"
echo
printf 'Created https://github.com/%s and staged the submodule in %s\n' "$REMOTE" "$PARENT"
echo "Review: git -C \"$PARENT\" diff --cached -- .gitmodules \"$PATH_IN_PARENT\""
echo "Commit: git -C \"$PARENT\" commit -m 'test: add QA Playwright submodule'"
echo "Push:   git -C \"$PARENT\" push"
