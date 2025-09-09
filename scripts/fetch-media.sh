#!/usr/bin/env bash
# Fetch media assets from existing production site into local public/ directory.
# Requires: wget (sudo apt install -y wget)
set -euo pipefail
ORIGIN="https://blog.dotmavriq.life"
OUT_DIR="public"
mkdir -p "$OUT_DIR"
ASSETS=(
  "/solidsnakegbc.gif"
  "/favicon.ico"
  "/favicon-16x16.png"
  "/favicon-32x32.png"
  "/apple-touch-icon.png"
  "/android-chrome-192x192.png"
  "/android-chrome-512x512.png"
  "/site.webmanifest"
  "/logo.png"
)
for a in "${ASSETS[@]}"; do
  echo "Fetching $a"
  wget -q -O "${OUT_DIR}${a}" "${ORIGIN}${a}" || echo "Failed: $a"

done
echo "Done."
