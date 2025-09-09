#!/usr/bin/env bash
set -euo pipefail
ORIGIN="https://blog.dotmavriq.life"
DEST="public/icons"
mkdir -p "$DEST"

# Candidate paths to try per icon (first that returns HTTP 200 is saved)
declare -A ICONS=(
  [github]="/icons/github.svg /github.svg /img/github.svg"
  [linkedin]="/icons/linkedin.svg /linkedin.svg /img/linkedin.svg"
  [youtube]="/icons/youtube.svg /youtube.svg /img/youtube.svg"
  [matrix]="/icons/matrix.svg /matrix.svg /img/matrix.svg"
  [fediverse]="/icons/fediverse.svg /fediverse.svg /img/fediverse.svg"
)

fetch_one() {
  local name="$1"; shift
  for path in "$@"; do
    url="$ORIGIN$path"
    echo -n "Trying $url ... "
    if curl -fsL --max-time 10 "$url" -o "$DEST/$name.svg" 2>/dev/null; then
      echo "OK"; return 0; fi
    echo "miss"
  done
  echo "No remote icon for $name (will rely on inline fallback)"
  rm -f "$DEST/$name.svg" 2>/dev/null || true
}

for key in "${!ICONS[@]}"; do
  # shellcheck disable=SC2086
  fetch_one "$key" ${ICONS[$key]}
done

echo "Done. Present icons:"; ls -1 "$DEST" || true