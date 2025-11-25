#!/usr/bin/env bash
set -euo pipefail

# Mono quickstart helper
# Usage (from an empty directory):
#   curl -s https://raw.githubusercontent.com/benitogf/mono/master/use.sh -o use.sh
#   bash use.sh

REPO_ARCHIVE_URL="https://github.com/benitogf/mono/archive/refs/heads/master.zip"
ARCHIVE_NAME="mono-master.zip"
TEMP_DIR="mono-master"

echo "[mono] Downloading repository archive from master branch..."
wget -q -O "$ARCHIVE_NAME" "$REPO_ARCHIVE_URL"

echo "[mono] Extracting archive..."
unzip -q "$ARCHIVE_NAME"
rm "$ARCHIVE_NAME"

if [ -d "$TEMP_DIR" ]; then
  echo "[mono] Moving project files into current directory..."
  shopt -s dotglob
  mv "$TEMP_DIR"/* .
  shopt -u dotglob
  rmdir "$TEMP_DIR"
  echo "[mono] Cleaning up non-runtime repo files..."
  for f in README.md LICENSE use.sh; do
    if [ -e "$f" ]; then
      rm -f "$f"
    fi
  done
else
  echo "[mono] Error: expected directory '$TEMP_DIR' not found after unzip." >&2
  exit 1
fi

if command -v npm >/dev/null 2>&1; then
  echo "[mono] Installing frontend dependencies (npm install)..."
  npm install

  echo "[mono] Building frontend (npm run build)..."
  npm run build
else
  echo "[mono] Warning: npm not found. Skipping npm install and build." >&2
fi

echo
echo "[mono] Setup complete. Next steps:"
echo "  # Run as web application (API + embedded SPA on spaPort)"
echo "  go run main.go -ui=false"
echo
echo "  # Run as desktop application (opens webview window pointing to SPA)"
echo "  go run main.go -ui=true"
echo
echo "  # Build single binary"
echo "  go build && ./mono"
