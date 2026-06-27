#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "Building contracts"
cd contracts/license_registry && cargo build --target wasm32-unknown-unknown --release
cd ../royalty_router && cargo build --target wasm32-unknown-unknown --release

echo "Contracts built. Run ./scripts/deploy-testnet.sh to deploy them."
