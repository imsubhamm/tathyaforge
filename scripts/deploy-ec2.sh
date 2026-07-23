#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"

cd "${APP_DIR}"

echo "Deploying TathyaForge from origin/${DEPLOY_BRANCH}..."
git fetch origin "${DEPLOY_BRANCH}"
git checkout "${DEPLOY_BRANCH}"
git pull --ff-only origin "${DEPLOY_BRANCH}"

npm ci
npm run build
npm prune --omit=dev

pm2 startOrReload ecosystem.config.cjs --env production
pm2 save

curl --fail --silent --show-error --retry 8 --retry-delay 2 \
  http://127.0.0.1:3000/ >/dev/null

echo "TathyaForge deployment completed successfully."
