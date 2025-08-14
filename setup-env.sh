#!/bin/bash

# Factory App Environment Setup
# This script sets up the proper environment for running the Factory Management App
# It can be sourced or executed

# Export nvm directory
export NVM_DIR="$HOME/.nvm"

# Load nvm if available
if [ -s "$NVM_DIR/nvm.sh" ]; then
    echo "Loading nvm..." >&2
    source "$NVM_DIR/nvm.sh"
    
    # Load bash completion for nvm
    if [ -s "$NVM_DIR/bash_completion" ]; then
        source "$NVM_DIR/bash_completion"
    fi
fi

# Source user's shell configuration
if [ -f "$HOME/.bashrc" ]; then
    source "$HOME/.bashrc"
fi

if [ -f "$HOME/.profile" ]; then
    source "$HOME/.profile"
fi

# Add common Node.js paths (in case nvm isn't available but Node.js is installed)
export PATH="$PATH:/usr/local/bin:/usr/bin:/bin"
export PATH="$HOME/.nvm/versions/node/v22.17.0/bin:$PATH"

# Function to verify environment
verify_environment() {
    echo "Verifying environment..." >&2
    
    if command -v node >/dev/null 2>&1; then
        echo "✅ Node.js found: $(node --version)" >&2
    else
        echo "❌ Node.js not found" >&2
        return 1
    fi
    
    if command -v npm >/dev/null 2>&1; then
        echo "✅ npm found: $(npm --version)" >&2
    else
        echo "❌ npm not found" >&2
        return 1
    fi
    
    return 0
}

# If script is executed (not sourced), verify environment
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    verify_environment
    exit $?
fi
