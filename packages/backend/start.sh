#!/bin/bash
set -e

echo "Checking for Bun..."

# Install Bun if not present
if ! command -v bun &> /dev/null; then
    echo "Bun not found, installing..."
    curl -fsSL https://bun.sh/install | bash
fi

# Ensure Bun is in PATH
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

echo "Bun location: $(which bun)"
echo "Bun version: $(bun --version)"

# Navigate to backend directory
cd "$(dirname "$0")"

# Run the server
echo "Starting IQ Didactic LMS API..."
exec bun run src/index.ts
