#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v stellar &>/dev/null; then
  echo "Stellar CLI is required. Install it from https://developers.stellar.org/docs/tools/stellar-cli"
  exit 1
fi

echo "Deploying license registry"
stellar contract deploy \
  --network testnet \
  --source-account default \
  --wasm contracts/license_registry/target/wasm32-unknown-unknown/release/license_registry.wasm

echo "Deploying royalty router"
stellar contract deploy \
  --network testnet \
  --source-account default \
  --wasm contracts/royalty_router/target/wasm32-unknown-unknown/release/royalty_router.wasm
