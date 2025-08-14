#!/bin/bash

# Factory Management App Status Check Script
# Run this to diagnose any issues with the desktop launchers

echo "🏭 Factory Management App - Status Check"
echo "========================================"
echo

# Check current directory
echo "📁 Current Directory: $(pwd)"
if [ "$(pwd)" != "/home/ahtsham/factory v.2" ]; then
    echo "⚠️  Warning: You should run this from the app directory"
    echo "   Expected: /home/ahtsham/factory v.2"
fi
echo

# Check if required files exist
echo "📋 Checking Required Files:"
files=(
    "package.json"
    "start-app.sh"
    "launcher.py"
    "desktop-launcher.sh"
    "Factory-App.desktop"
    "client/package.json"
    "server/package.json"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (missing)"
    fi
done
echo

# Check if scripts are executable
echo "🔧 Checking Script Permissions:"
scripts=(
    "start-app.sh"
    "launcher.py"
    "desktop-launcher.sh"
    "Factory-App.desktop"
    "Factory-App-Terminal.desktop"
    "Factory-App-Simple.desktop"
)

for script in "${scripts[@]}"; do
    if [ -f "$script" ]; then
        if [ -x "$script" ]; then
            echo "✅ $script (executable)"
        else
            echo "⚠️  $script (not executable)"
            echo "   Fix with: chmod +x '$script'"
        fi
    else
        echo "❌ $script (missing)"
    fi
done
echo

# Check system requirements
echo "💻 Checking System Requirements:"

# Node.js
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node -v)
    echo "✅ Node.js: $NODE_VERSION"
else
    echo "❌ Node.js not found"
fi

# npm
if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm -v)
    echo "✅ npm: v$NPM_VERSION"
else
    echo "❌ npm not found"
fi

# Python3
if command -v python3 >/dev/null 2>&1; then
    PYTHON_VERSION=$(python3 --version)
    echo "✅ Python3: $PYTHON_VERSION"
    
    # Check tkinter
    if python3 -c "import tkinter" 2>/dev/null; then
        echo "✅ Python tkinter: Available"
    else
        echo "❌ Python tkinter: Not available"
        echo "   Fix with: sudo apt install python3-tk"
    fi
else
    echo "❌ Python3 not found"
fi

# MongoDB
if command -v mongod >/dev/null 2>&1; then
    echo "✅ MongoDB: Available"
elif command -v mongo >/dev/null 2>&1; then
    echo "✅ MongoDB client: Available"
else
    echo "⚠️  MongoDB: Not found (optional for development)"
fi
echo

# Check dependencies
echo "📦 Checking Dependencies:"

# Root dependencies
if [ -d "node_modules" ]; then
    echo "✅ Root dependencies installed"
else
    echo "❌ Root dependencies missing"
    echo "   Fix with: npm install"
fi

# Client dependencies
if [ -d "client/node_modules" ]; then
    echo "✅ Client dependencies installed"
else
    echo "❌ Client dependencies missing"
    echo "   Fix with: cd client && npm install"
fi

# Server dependencies
if [ -d "server/node_modules" ]; then
    echo "✅ Server dependencies installed"
else
    echo "❌ Server dependencies missing"
    echo "   Fix with: cd server && npm install"
fi
echo

# Check if application is currently running
echo "🚀 Application Status:"
if pgrep -f "npm run dev" >/dev/null; then
    echo "✅ Application is currently running"
    echo "   Frontend: http://localhost:5173"
    echo "   Backend: http://localhost:3000"
else
    echo "⏹️  Application is not running"
fi
echo

# Check log file
if [ -f "launcher.log" ]; then
    echo "📊 Recent Log Entries:"
    tail -5 launcher.log | sed 's/^/   /'
else
    echo "📊 No log file found (launcher hasn't been used yet)"
fi
echo

echo "🎯 Quick Start Options:"
echo "1. GUI Launcher:      python3 launcher.py"
echo "2. Shell Script:      ./start-app.sh"
echo "3. Desktop File:      Right-click Factory-App.desktop → Run as Program"
echo "4. Manual:            npm run dev"
echo
echo "💡 If desktop launcher doesn't work:"
echo "   - Try Factory-App-Simple.desktop"
echo "   - Check permissions: chmod +x *.desktop"
echo "   - Install tkinter: sudo apt install python3-tk"
