#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

echo "============================================"
echo "  House Price Predictor - Backend Server"
echo "============================================"
echo

PYCMD=""
for candidate in python3.12 python3.11 python3.13 python3.10 python3; do
    if command -v "$candidate" >/dev/null 2>&1; then
        PYCMD="$candidate"
        echo "Using $candidate"
        break
    fi
done

if [ -z "$PYCMD" ]; then
    echo "[ERROR] Python was not found. Please install Python 3.12 from https://www.python.org/downloads/"
    exit 1
fi

if [ ! -d ".venv" ]; then
    echo "Creating a virtual environment (first run only)..."
    "$PYCMD" -m venv .venv
fi

source .venv/bin/activate

echo
echo "Installing dependencies (first run only, can take a few minutes)..."
python -m pip install --upgrade pip --quiet
if ! pip install --prefer-binary -r requirements.txt; then
    echo
    echo "[ERROR] Could not install the required packages."
    echo "Please install Python 3.12, delete the .venv folder here, and run this script again."
    exit 1
fi

[ -f ".env" ] || cp .env.example .env

echo
echo "============================================"
echo " Backend is starting on http://localhost:8000"
echo " Keep this terminal window open while you use the app."
echo " Press CTRL+C to stop it."
echo "============================================"
echo
uvicorn app.main:app --host 0.0.0.0 --port 8000
