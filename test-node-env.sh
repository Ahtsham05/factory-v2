#!/bin/bash

# Test script to verify Node.js environment
echo "Testing Node.js Environment..."
echo "==============================="

# Load nvm environment
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    echo "Loading nvm..."
    source "$NVM_DIR/nvm.sh"
fi

# Source user profiles
if [ -f "$HOME/.bashrc" ]; then
    source "$HOME/.bashrc"
fi

if [ -f "$HOME/.profile" ]; then
    source "$HOME/.profile"
fi

echo "PATH: $PATH"
echo ""

# Test Node.js
echo "Testing Node.js:"
which node
node --version 2>/dev/null || echo "Node.js not found"
echo ""

# Test npm
echo "Testing npm:"
which npm
npm --version 2>/dev/null || echo "npm not found"
echo ""

# Test if we can run npm commands
echo "Testing npm functionality:"
cd "/home/ahtsham/factory v.2"
npm --version 2>/dev/null && echo "npm is working" || echo "npm is not working"

echo ""
echo "Test complete. Press Enter to close..."
read
