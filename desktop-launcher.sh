#!/bin/bash

# Factory Management App Desktop Launcher
# This script is specifically designed to be called from the desktop file

APP_DIR="/home/ahtsham/factory v.2"
LOG_FILE="$APP_DIR/launcher.log"

# Function to log messages
log_message() {
    echo "$(date): $1" >> "$LOG_FILE"
}

# Function to show error dialog
show_error() {
    if command -v zenity >/dev/null 2>&1; then
        zenity --error --text="$1" --title="Factory Management App Error"
    elif command -v kdialog >/dev/null 2>&1; then
        kdialog --error "$1" --title "Factory Management App Error"
    elif command -v notify-send >/dev/null 2>&1; then
        notify-send "Factory Management App Error" "$1" -u critical
    else
        echo "ERROR: $1" | xargs -0 -I {} sh -c 'echo "{}" > /tmp/factory_app_error.txt && xterm -e "cat /tmp/factory_app_error.txt; read"'
    fi
}

# Function to show info dialog
show_info() {
    if command -v zenity >/dev/null 2>&1; then
        zenity --info --text="$1" --title="Factory Management App"
    elif command -v kdialog >/dev/null 2>&1; then
        kdialog --msgbox "$1" --title "Factory Management App"
    elif command -v notify-send >/dev/null 2>&1; then
        notify-send "Factory Management App" "$1"
    fi
}

# Source the user's shell environment to get proper PATH
if [ -f "$HOME/.bashrc" ]; then
    source "$HOME/.bashrc"
fi

if [ -f "$HOME/.profile" ]; then
    source "$HOME/.profile"
fi

# Load nvm if it exists
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    source "$NVM_DIR/nvm.sh"
    log_message "Loaded nvm"
fi

if [ -s "$NVM_DIR/bash_completion" ]; then
    source "$NVM_DIR/bash_completion"
fi

# Source our environment setup script
if [ -f "$APP_DIR/setup-env.sh" ]; then
    source "$APP_DIR/setup-env.sh"
    log_message "Loaded factory app environment"
fi

# Change to app directory
cd "$APP_DIR" || {
    show_error "Cannot access application directory: $APP_DIR"
    exit 1
}

log_message "Desktop launcher started"
log_message "PATH: $PATH"
log_message "NODE_PATH: $(which node 2>/dev/null || echo 'not found')"
log_message "NPM_PATH: $(which npm 2>/dev/null || echo 'not found')"

# Check if Python3 is available
if ! command -v python3 >/dev/null 2>&1; then
    error_msg="Python3 is not installed or not in PATH.\nPlease install Python3 to use the GUI launcher.\n\nAlternatively, you can:\n1. Open terminal in: $APP_DIR\n2. Run: ./start-app.sh"
    log_message "Python3 not found"
    show_error "$error_msg"
    exit 1
fi

# Check if tkinter is available (required for GUI)
if ! python3 -c "import tkinter" 2>/dev/null; then
    error_msg="Python tkinter is not installed.\nPlease install python3-tk package.\n\nOn Ubuntu/Debian: sudo apt install python3-tk\nOn Red Hat/CentOS: sudo yum install tkinter\n\nAlternatively, you can:\n1. Open terminal in: $APP_DIR\n2. Run: ./start-app.sh"
    log_message "Python tkinter not found"
    show_error "$error_msg"
    exit 1
fi

# Try to run the Python GUI launcher
log_message "Attempting to start Python GUI launcher"
if python3 launcher.py 2>> "$LOG_FILE"; then
    log_message "Python GUI launcher completed successfully"
else
    error_code=$?
    log_message "Python GUI launcher failed with exit code: $error_code"
    
    # Offer alternative
    if command -v zenity >/dev/null 2>&1; then
        if zenity --question --text="GUI launcher failed.\nWould you like to start the app using the terminal launcher instead?" --title="Factory Management App"; then
            log_message "User chose terminal launcher"
            if command -v gnome-terminal >/dev/null 2>&1; then
                gnome-terminal --working-directory="$APP_DIR" -- bash -c "./start-app.sh; read -p 'Press Enter to close...'"
            elif command -v konsole >/dev/null 2>&1; then
                konsole --workdir "$APP_DIR" -e bash -c "./start-app.sh; read -p 'Press Enter to close...'"
            elif command -v xterm >/dev/null 2>&1; then
                xterm -e "cd '$APP_DIR' && ./start-app.sh && read -p 'Press Enter to close...'"
            else
                show_error "No suitable terminal emulator found"
            fi
        fi
    else
        error_msg="GUI launcher failed. Please check the log file at:\n$LOG_FILE\n\nTo start manually:\n1. Open terminal in: $APP_DIR\n2. Run: ./start-app.sh"
        show_error "$error_msg"
    fi
fi

log_message "Desktop launcher finished"
