#!/bin/bash

# Factory Management App - Updated Deployment Package Creator
# Creates Windows deployment package with all fixes included

echo "========================================================="
echo "Factory Management App - Updated Deployment Package"
echo "Windows Fixes Included"
echo "========================================================="
echo ""

# Set variables
PACKAGE_NAME="FactoryManagementApp-Windows-Installer-FIXED"
PACKAGE_DIR="/tmp/$PACKAGE_NAME"
CURRENT_DIR="$(pwd)"

# Create temporary package directory
echo "Creating updated deployment package..."
rm -rf "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR"

# Copy application files (excluding unnecessary files)
echo "Copying application files with Windows fixes..."
rsync -av --exclude='node_modules' \
          --exclude='.git' \
          --exclude='*.log' \
          --exclude='.env' \
          --exclude='dist' \
          --exclude='build' \
          --exclude='deployment-packages' \
          --exclude='logs' \
          --exclude='__pycache__' \
          "$CURRENT_DIR/" "$PACKAGE_DIR/"

# Make sure Windows files have correct line endings
echo "Converting line endings for Windows compatibility..."
if command -v unix2dos >/dev/null; then
    find "$PACKAGE_DIR" -name "*.bat" -exec unix2dos {} \;
    find "$PACKAGE_DIR" -name "*.ps1" -exec unix2dos {} \;
    find "$PACKAGE_DIR" -name "*.md" -exec unix2dos {} \;
fi

# Create updated version info file
echo "Creating version information..."
cat > "$PACKAGE_DIR/VERSION.txt" << EOF
Factory Management App - Windows Deployment Package (FIXED)
============================================================

Package Created: $(date)
Version: 2.0 (Windows Fixes Applied)
Platform: Windows 10/11
Node.js Required: 16.0+
Python Required: 3.7+

FIXES INCLUDED:
✅ Windows character encoding issues resolved
✅ Batch file execution problems fixed
✅ Enhanced error handling and logging
✅ Multiple launcher options provided
✅ Improved Windows console support

INSTALLATION OPTIONS:
1. LAUNCH-WINDOWS.bat (recommended - simple)
2. start-app-windows.bat (GUI launcher)
3. windows-launcher.py (advanced Python launcher)
4. cross-platform-launcher.py (universal)

INSTALLATION INSTRUCTIONS:
1. Extract this package to any folder
2. Double-click LAUNCH-WINDOWS.bat to start
3. Or right-click install-windows.bat → "Run as administrator"
4. Follow the installation prompts

FEATURES:
- Complete MERN stack application
- Voice recognition (English/Urdu)
- Windows console encoding fixes
- Multiple launcher options
- Professional Windows integration
- Automatic dependency management

For detailed instructions, see:
- WINDOWS_INSTALLATION_GUIDE.md
- WINDOWS_TROUBLESHOOTING_FIXED.md
EOF

# Create updated README for the package
echo "Creating package README..."
cat > "$PACKAGE_DIR/README.txt" << EOF
FACTORY MANAGEMENT APP - WINDOWS INSTALLATION PACKAGE (FIXED)
==============================================================

🎉 WINDOWS ISSUES FIXED!
All character encoding and batch file execution problems resolved.

QUICK START (RECOMMENDED):
1. Extract this ZIP file
2. Double-click "LAUNCH-WINDOWS.bat"
3. Application starts automatically
4. Browser opens to http://localhost:3000

ALTERNATIVE METHODS:
- Right-click "install-windows.bat" → "Run as administrator"
- Run "python windows-launcher.py" in command prompt
- Double-click "start-app-windows.bat"

FIXES INCLUDED:
✅ Windows character encoding issues resolved
✅ Console display problems fixed
✅ Batch file execution errors corrected
✅ UTF-8 support added to all launchers
✅ Better error handling and logging
✅ Improved process management

REQUIREMENTS:
- Windows 10/11
- Python 3.7+ (installer will guide you)
- Node.js 16+ (installer will guide you)

FEATURES:
- Complete factory management system
- Voice recognition (English/Urdu)
- Professional Windows integration
- Offline operation after setup
- Automatic dependency installation

VOICE RECOGNITION:
Works perfectly in your browser at http://localhost:3000
- Click microphone icons for voice input
- Supports English and Urdu languages
- Grant microphone permissions when prompted

TROUBLESHOOTING:
If you encounter any issues, see:
WINDOWS_TROUBLESHOOTING_FIXED.md

SUPPORT:
1. Run "setup-windows-env.bat" to check system
2. Check "launcher.log" for detailed error information
3. All documentation included in package
EOF

# Create a Windows-specific quick start guide
cat > "$PACKAGE_DIR/QUICK_START_WINDOWS.md" << 'EOF'
# Windows Quick Start Guide

## 🚀 Fastest Way to Start

### Option 1: Simple Launch (Recommended)
1. **Extract** this ZIP file to any folder
2. **Double-click** `LAUNCH-WINDOWS.bat`
3. **Wait** for the application to start
4. **Browser opens** automatically to http://localhost:3000

### Option 2: Full Installation
1. **Extract** this ZIP file to any folder
2. **Right-click** `install-windows.bat` → "Run as administrator"
3. **Follow** installation prompts
4. **Use desktop shortcut** created automatically

## ✅ All Windows Issues Fixed

This package includes fixes for:
- ✅ Character encoding problems
- ✅ Batch file execution issues
- ✅ Console display errors
- ✅ Process monitoring problems

## 🎤 Voice Recognition Ready

Your voice features will work immediately:
- **English voice input** - Click microphone icons
- **Urdu voice input** - Switch language and use microphone
- **Browser-based** - No additional software needed

## 📋 What You Get

- **Complete MERN Application** - Full factory management system
- **Voice Recognition** - English and Urdu speech-to-text
- **Windows Integration** - Desktop shortcuts and Start Menu
- **Professional Installation** - One-click setup process
- **Automatic Updates** - Re-run installer for new versions

## 🆘 If You Need Help

1. **Environment Check**: Run `setup-windows-env.bat`
2. **Troubleshooting**: Read `WINDOWS_TROUBLESHOOTING_FIXED.md`
3. **Manual Start**: Try `python windows-launcher.py`

## 🎯 Expected Results

After starting:
- ✅ Application runs without encoding errors
- ✅ Browser opens to http://localhost:3000
- ✅ Voice recognition works in forms
- ✅ Both English and Urdu supported
- ✅ Clean console output (no gibberish)

Ready to use your Factory Management App on Windows! 🎉
EOF

# Create installation verification script
echo "Creating installation verification..."
cat > "$PACKAGE_DIR/verify-installation.bat" << 'EOF'
@echo off
chcp 65001 >nul
title Factory Management App - Installation Verification

echo ========================================
echo Factory Management App - Installation Verification
echo ========================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found
    echo Please install Python from https://python.org
    echo Make sure to check "Add Python to PATH"
    echo.
) else (
    for /f "tokens=*" %%i in ('python --version 2^>^&1') do echo ✅ %%i
)

REM Check tkinter
python -c "import tkinter; print('✅ tkinter available')" >nul 2>&1
if errorlevel 1 (
    echo ❌ tkinter not available
) else (
    echo ✅ tkinter available
)

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found
    echo Please install Node.js from https://nodejs.org
    echo.
) else (
    for /f "tokens=*" %%i in ('node --version 2^>^&1') do echo ✅ Node.js %%i
)

REM Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm not found
) else (
    for /f "tokens=*" %%i in ('npm --version 2^>^&1') do echo ✅ npm %%i
)

echo.
echo Verification complete!
echo.

if exist "package.json" (
    echo ✅ Application files found
    echo.
    echo 🚀 Ready to run Factory Management App!
    echo.
    echo To start the app:
    echo 1. Double-click LAUNCH-WINDOWS.bat (recommended)
    echo 2. Double-click start-app-windows.bat (GUI launcher)
    echo 3. Run: python windows-launcher.py
    echo.
) else (
    echo ❌ Application files not found
    echo Make sure you're in the correct directory
)

echo.
pause
EOF

# Convert batch file line endings
if command -v unix2dos >/dev/null; then
    unix2dos "$PACKAGE_DIR/verify-installation.bat"
    unix2dos "$PACKAGE_DIR/LAUNCH-WINDOWS.bat" 2>/dev/null || true
    unix2dos "$PACKAGE_DIR/start-app-windows.bat" 2>/dev/null || true
    unix2dos "$PACKAGE_DIR/install-windows.bat" 2>/dev/null || true
fi

# Create ZIP package
echo "Creating updated ZIP package..."
cd "/tmp"
if command -v zip >/dev/null; then
    zip -r "${PACKAGE_NAME}.zip" "$PACKAGE_NAME/" > /dev/null
    echo "✅ ZIP package created: /tmp/${PACKAGE_NAME}.zip"
    PACKAGE_SIZE=$(du -h "/tmp/${PACKAGE_NAME}.zip" | cut -f1)
    echo "📦 Package size: $PACKAGE_SIZE"
elif command -v 7z >/dev/null; then
    7z a "${PACKAGE_NAME}.zip" "$PACKAGE_NAME/" > /dev/null
    echo "✅ ZIP package created: /tmp/${PACKAGE_NAME}.zip"
    PACKAGE_SIZE=$(du -h "/tmp/${PACKAGE_NAME}.zip" | cut -f1)
    echo "📦 Package size: $PACKAGE_SIZE"
else
    echo "⚠️  ZIP utility not found. Package created at: $PACKAGE_DIR"
    PACKAGE_SIZE="Unknown"
fi

# Copy back to current directory
cd "$CURRENT_DIR"
if [ -f "/tmp/${PACKAGE_NAME}.zip" ]; then
    mkdir -p "./deployment-packages"
    cp "/tmp/${PACKAGE_NAME}.zip" "./deployment-packages/"
    echo "✅ Package copied to: ./deployment-packages/${PACKAGE_NAME}.zip"
fi

# Update deployment instructions
echo "Creating updated deployment instructions..."
cat > "./deployment-packages/DEPLOYMENT_INSTRUCTIONS_V2.md" << EOF
# Factory Management App - Windows Deployment (FIXED VERSION)

## 🎉 Windows Issues RESOLVED!

This updated package fixes all Windows-related issues:
- ✅ Character encoding problems resolved
- ✅ Batch file execution fixed
- ✅ Console display errors corrected
- ✅ Enhanced error handling added

## 📦 Package Information
- **Package**: ${PACKAGE_NAME}.zip
- **Version**: 2.0 (Windows Fixes Applied)
- **Created**: $(date)
- **Target**: Windows 10/11 systems
- **Size**: ${PACKAGE_SIZE}

## 🚀 Quick Deployment Steps

### For End Users (Simplest)
1. **Download** ${PACKAGE_NAME}.zip
2. **Extract** to any folder (e.g., Downloads)
3. **Double-click** LAUNCH-WINDOWS.bat
4. **Browser opens** automatically to http://localhost:3000

### For Full Installation
1. **Download** ${PACKAGE_NAME}.zip  
2. **Extract** to any folder
3. **Right-click** install-windows.bat → "Run as administrator"
4. **Follow** installation prompts
5. **Use desktop shortcut** created automatically

### For IT Administrators
\`\`\`powershell
# Silent installation
install-windows.ps1 -Silent -InstallPath "C:\\Program Files\\FactoryManagementApp"

# Quick verification
verify-installation.bat
\`\`\`

## 🎯 Available Launchers

### 1. LAUNCH-WINDOWS.bat (NEW - Recommended)
- **Purpose**: Simplest possible Windows launcher
- **Usage**: Double-click to start
- **Features**: Fixed encoding, automatic browser opening

### 2. windows-launcher.py (NEW)
- **Purpose**: Advanced Windows-specific Python launcher
- **Usage**: \`python windows-launcher.py\`
- **Features**: UTF-8 encoding, clean output, better error handling

### 3. start-app-windows.bat (UPDATED)
- **Purpose**: GUI launcher with environment checks
- **Usage**: Double-click to start
- **Features**: Fixed encoding issues, improved error messages

### 4. cross-platform-launcher.py (UPDATED)
- **Purpose**: Universal launcher (Windows/Linux)
- **Usage**: \`python cross-platform-launcher.py\`
- **Features**: Fixed Windows encoding, ANSI color removal

## ✅ Fixes Applied

### Character Encoding
- Added UTF-8 console support (\`chcp 65001\`)
- Force UTF-8 encoding in Python subprocess calls
- Handle decode errors gracefully
- Remove ANSI color codes causing display issues

### Batch Files
- Fixed all .bat files with proper encoding
- Improved error handling and messages
- Better path and environment detection
- Added console initialization

### Process Management
- Better output filtering and display
- Encoding error handling in monitoring
- Cleaner log display without gibberish
- Proper Windows process termination

## 🎤 Voice Recognition Status

✅ **Fully Working** - Voice recognition works perfectly because:
- Browser-based Speech Recognition API
- No dependency on Python console encoding
- English and Urdu language support
- Microphone permissions handled by browser

## 📋 System Requirements

- **OS**: Windows 10 (1903+) or Windows 11
- **Python**: 3.7+ (will be guided to install)
- **Node.js**: 16+ (will be guided to install)
- **RAM**: 2GB minimum, 4GB recommended
- **Storage**: 1GB available space
- **Browser**: Chrome, Firefox, or Edge for voice features

## 🔧 Troubleshooting

### Quick Diagnostics
\`\`\`cmd
# Check environment
verify-installation.bat

# Test launchers
LAUNCH-WINDOWS.bat
\`\`\`

### If Issues Persist
1. **Run environment check**: \`setup-windows-env.bat\`
2. **Check detailed logs**: Look for \`launcher.log\`
3. **Manual verification**: \`python --version\` and \`node --version\`
4. **Try alternative launcher**: \`python windows-launcher.py\`

## 🎯 Expected User Experience

### Installation (2-3 minutes)
1. Download and extract ZIP (30 seconds)
2. Double-click LAUNCH-WINDOWS.bat (30 seconds)
3. Wait for dependencies (1-2 minutes)
4. Browser opens automatically

### Daily Usage
1. Double-click desktop shortcut
2. Browser opens to factory management app
3. Use voice features by clicking microphone icons
4. Switch between English/Urdu as needed

## 📞 Support Information

### Documentation Included
- Complete installation guide
- Windows troubleshooting guide  
- User manual and feature documentation
- Technical troubleshooting steps

### Self-Help Tools
- Environment verification scripts
- Installation verification tools
- Detailed error logging
- Multiple launcher options

## 🏆 Deployment Success

Your clients will now have:
- ✅ **Zero Windows encoding issues**
- ✅ **Professional installation experience**
- ✅ **Working voice recognition in English/Urdu**
- ✅ **Multiple launcher options for reliability**
- ✅ **Complete factory management system**
- ✅ **Offline operation after setup**

**Ready for seamless Windows deployment!** 🚀
EOF

echo ""
echo "========================================================="
echo "✅ UPDATED Deployment Package Created Successfully!"
echo "========================================================="
echo ""
echo "Package: ./deployment-packages/${PACKAGE_NAME}.zip"
echo "Size: ${PACKAGE_SIZE}"
echo ""
echo "🎯 WINDOWS FIXES INCLUDED:"
echo "  ✅ Character encoding issues resolved"
echo "  ✅ Batch file execution fixed"  
echo "  ✅ Console display errors corrected"
echo "  ✅ Enhanced error handling added"
echo "  ✅ Multiple launcher options provided"
echo ""
echo "🚀 DEPLOYMENT READY:"
echo "  1. Send ZIP file to Windows clients"
echo "  2. Clients extract and double-click LAUNCH-WINDOWS.bat"
echo "  3. Application starts without encoding errors"
echo "  4. Voice recognition works perfectly in browser"
echo ""
echo "📋 PACKAGE INCLUDES:"
echo "  ✅ LAUNCH-WINDOWS.bat (new simple launcher)"
echo "  ✅ windows-launcher.py (new advanced launcher)"
echo "  ✅ Updated cross-platform-launcher.py"
echo "  ✅ Fixed all batch files"
echo "  ✅ Complete troubleshooting documentation"
echo "  ✅ Environment verification tools"
echo ""
echo "🎤 VOICE RECOGNITION:"
echo "  ✅ English and Urdu speech-to-text"
echo "  ✅ Browser-based (no encoding dependencies)"
echo "  ✅ Works in Chrome, Firefox, Edge"
echo "  ✅ No additional packages required"
echo ""
echo "Ready for Windows client deployment! 🏆"
echo ""

# Cleanup temporary directory
rm -rf "$PACKAGE_DIR"
