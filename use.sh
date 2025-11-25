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
  
  # Adjust reload script and .gitignore to use the current folder name as binary name
  APP_NAME="$(basename "$(pwd)")"
  if [ -f reload ]; then
    echo "[mono] Updating reload script to run ./$APP_NAME instead of ./mono..."
    sed -i "s|./mono|./$APP_NAME|g" reload || true
  fi
  if [ -f .gitignore ]; then
    echo "[mono] Updating .gitignore to use $APP_NAME and $APP_NAME.exe instead of mono and mono.exe..."
    sed -i "s|^mono$|$APP_NAME|" .gitignore || true
    sed -i "s|^mono.exe$|$APP_NAME.exe|" .gitignore || true
  fi

  # Turn this directory into its own app module that depends on mono,
  # so core packages like embeder and spa are referenced from the repo
  # instead of being embedded in the scaffold.
  if [ -f go.mod ]; then
    echo "[mono] Rewriting Go module path for local app..."
    sed -i '1s|module github.com/benitogf/mono|module monoapp|' go.mod || true
  fi

  echo "[mono] Removing core library packages from scaffold (will be used via module dependency)..."
  rm -rf auth embeder spa webview

  echo "[mono] Cleaning up non-runtime repo files..."
  for f in README.md LICENSE use.sh go.mod go.sum; do
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
