#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

echo "============================================"
echo "  House Price Predictor - Website"
echo "============================================"
echo

if ! command -v node >/dev/null 2>&1; then
    echo "[ERROR] Node.js was not found. Please install the LTS version from https://nodejs.org"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies (first run only, can take a minute)..."
    npm install
fi

[ -f ".env" ] || cp .env.example .env

echo
echo "============================================"
echo " Website starting on http://localhost:5173"
echo " Keep this terminal window open while you use the app."
echo " Press CTRL+C to stop it."
echo "============================================"
echo
npm run dev
