#!/usr/bin/env bash
cd "$(dirname "$0")"

echo "============================================"
echo "  House Price Predictor - Starting Everything"
echo "============================================"
echo
echo "This will open the backend and the website."
echo "A browser tab should open automatically in a few seconds."
echo

open_terminal_and_run() {
    local dir="$1"
    local script="$2"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        osascript -e "tell application \"Terminal\" to do script \"cd '$(pwd)/$dir' && ./$script\""
    else
        if command -v gnome-terminal >/dev/null 2>&1; then
            gnome-terminal -- bash -c "cd '$(pwd)/$dir' && ./$script; exec bash"
        elif command -v x-terminal-emulator >/dev/null 2>&1; then
            x-terminal-emulator -e bash -c "cd '$(pwd)/$dir' && ./$script; exec bash"
        else
            (cd "$dir" && ./"$script") &
        fi
    fi
}

open_terminal_and_run backend RUN_BACKEND.sh
sleep 12
open_terminal_and_run frontend RUN_FRONTEND.sh
sleep 10

if command -v open >/dev/null 2>&1; then
    open "http://localhost:5173"
elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "http://localhost:5173"
fi

echo "All done! If the browser tab didn't open, go to: http://localhost:5173"
