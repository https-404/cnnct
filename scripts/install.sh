#!/usr/bin/env bash
set -euo pipefail

# Ensure we're at repo root
if [[ ! -f "package.json" || ! -f "pnpm-workspace.yaml" ]]; then
  echo "Run this from the repository root (where package.json and pnpm-workspace.yaml live)." >&2
  exit 1
fi

echo "⛏️  Removing node_modules and lockfiles..."
# Remove all node_modules (root + any depth in packages/**)
find . -name "node_modules" -type d -prune -exec rm -rf {} +
# In case of typo’d folders like node_mods
find . -name "node_mods" -type d -prune -exec rm -rf {} +
# Remove any pnpm lockfiles (usually just at root)
find . -name "pnpm-lock.yaml" -type f -delete

# Optionally prune the PNPM store (keeps cache tidy; safe to skip if you want)
pnpm store prune || true

echo "📦  Fresh install at root..."
pnpm install

echo "📦  Installing specific workspaces..."
pnpm install --filter ./packages/shared-types
pnpm install --filter ./packages/api
pnpm install --filter ./packages/web

echo "✅  Fresh install complete."
