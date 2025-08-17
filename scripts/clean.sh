#!/usr/bin/env bash
set -euo pipefail

# from repo root
rm -rf node_modules pnpm-lock.yaml

# remove node_modules in every package (handles nested too)
rm -rf packages/*/node_modules packages/*/*/node_modules

# in case of typo’d folders
rm -rf packages/*/node_mods packages/*/*/node_mods
