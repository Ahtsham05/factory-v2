#!/bin/bash

# Factory Management App - Deployment Package Creator
# This script creates a deployment package for Windows clients

echo "========================================================="
echo "Factory Management App - Deployment Package Creator"
echo "========================================================="
echo ""

# Set variables
PACKAGE_NAME="FactoryManagementApp-Windows-Installer"
PACKAGE_DIR="/tmp/$PACKAGE_NAME"
CURRENT_DIR="$(pwd)"

# Create temporary package directory
echo "Creating deployment package..."
rm -rf "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR"

# Copy application files (excluding unnecessary files)
echo "Copying application files..."
rsync -av --exclude='node_modules' \
          --exclude='.git' \
          --exclude='*.log' \
          --exclude='.env' \
          --exclude='dist' \
          --exclude='build' \
          "$CURRENT_DIR/" "$PACKAGE_DIR/"

# Make sure Windows files have correct line endings
echo "Converting line endings for Windows compatibility..."
if command -v dos2unix >/dev/null; then
    find "$PACKAGE_DIR" -name "*.bat" -exec unix2dos {} \;
    find "$PACKAGE_DIR" -name "*.ps1" -exec unix2dos {} \;
    find "$PACKAGE_DIR" -name "*.md" -exec unix2dos {} \;
fi

# Create a version info file
echo "Creating version information..."
cat > "$PACKAGE_DIR/VERSION.txt" << EOF
Factory Management App - Windows Deployment Package
====================================================

Package Created: $(date)
Platform: Windows 10/11
Node.js Required: 16.0+
Python Required: 3.7+

Installation Instructions:
1. Extract this package to any folder
2. Right-click install-windows.bat → "Run as administrator"
3. Follow the installation prompts
4. Start the app from Desktop or Start Menu

For detailed instructions, see WINDOWS_INSTALLATION_GUIDE.md

Package Contents:
- Application source code
- Windows installers (batch and PowerShell)
- Cross-platform launcher
- Complete documentation
- All necessary configuration files

Voice Recognition: Uses browser Speech Recognition API
No additional packages or cloud services required.
EOF

# Create a README for the package
echo "Creating package README..."
cat > "$PACKAGE_DIR/README.txt" << EOF
FACTORY MANAGEMENT APP - WINDOWS INSTALLATION PACKAGE
====================================================

QUICK START:
1. Right-click "install-windows.bat"
2. Select "Run as administrator"
3. Follow the prompts
4. Start app from Desktop shortcut

REQUIREMENTS:
- Windows 10/11
- Python 3.7+ (installer will guide you)
- Node.js 16+ (installer will guide you)

FEATURES:
- Complete MERN stack application
- Voice recognition (English/Urdu)
- Single-click installation
- Desktop and Start Menu shortcuts
- Automatic dependency management

For detailed instructions, open:
WINDOWS_INSTALLATION_GUIDE.md

SUPPORT:
If you encounter issues:
1. Run "setup-windows-env.bat" first
2. Check "launcher.log" for errors
3. Ensure Python and Node.js are installed

The application will run in your web browser at:
http://localhost:3000
EOF

# Create installation verification script
echo "Creating installation verification..."
cat > "$PACKAGE_DIR/verify-installation.bat" << 'EOF'
@echo off
echo ========================================
echo Factory Management App - Installation Verification
echo ========================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found
    echo Please install Python from https://python.org
    echo.
) else (
    for /f "tokens=*" %%i in ('python --version 2^>^&1') do echo ✅ %%i
)

REM Check tkinter
python -c "import tkinter" >nul 2>&1
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
    echo Ready to install Factory Management App!
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
fi

# Create ZIP package
echo "Creating ZIP package..."
cd "/tmp"
if command -v zip >/dev/null; then
    zip -r "${PACKAGE_NAME}.zip" "$PACKAGE_NAME/" > /dev/null
    echo "✅ ZIP package created: /tmp/${PACKAGE_NAME}.zip"
elif command -v 7z >/dev/null; then
    7z a "${PACKAGE_NAME}.zip" "$PACKAGE_NAME/" > /dev/null
    echo "✅ ZIP package created: /tmp/${PACKAGE_NAME}.zip"
else
    echo "⚠️  ZIP utility not found. Package created at: $PACKAGE_DIR"
fi

# Copy back to current directory
cd "$CURRENT_DIR"
if [ -f "/tmp/${PACKAGE_NAME}.zip" ]; then
    cp "/tmp/${PACKAGE_NAME}.zip" "./deployment-packages/"
    mkdir -p "./deployment-packages"
    cp "/tmp/${PACKAGE_NAME}.zip" "./deployment-packages/"
    echo "✅ Package copied to: ./deployment-packages/${PACKAGE_NAME}.zip"
fi

# Create deployment instructions
echo "Creating deployment instructions..."
cat > "./deployment-packages/DEPLOYMENT_INSTRUCTIONS.md" << EOF
# Factory Management App - Windows Deployment

## Package Information
- **Package**: ${PACKAGE_NAME}.zip
- **Created**: $(date)
- **Target**: Windows 10/11 systems
- **Size**: $(du -h "/tmp/${PACKAGE_NAME}.zip" 2>/dev/null | cut -f1 || echo "Unknown")

## Deployment Steps

### For End Users
1. **Download** ${PACKAGE_NAME}.zip
2. **Extract** to any folder (e.g., Downloads)
3. **Right-click** install-windows.bat → "Run as administrator"
4. **Follow** installation prompts
5. **Start** app from Desktop or Start Menu

### For IT Administrators
\`\`\`powershell
# Silent installation
install-windows.ps1 -Silent -InstallPath "C:\Program Files\FactoryManagementApp"

# Verify installation
verify-installation.bat
\`\`\`

### Network Deployment
1. **Extract** package to network share
2. **Use Group Policy** or SCCM to run installer
3. **Monitor** installation logs

## Package Contents
- Application source code and assets
- Windows installers (batch and PowerShell)
- Cross-platform Python launcher
- Complete documentation
- Environment verification tools

## System Requirements
- **OS**: Windows 10 (1903+) or Windows 11
- **Python**: 3.7+ (auto-installable)
- **Node.js**: 16+ (auto-installable)
- **RAM**: 2GB minimum, 4GB recommended
- **Storage**: 1GB available space
- **Network**: Internet for initial dependency installation

## Features Included
- ✅ Complete MERN stack application
- ✅ Voice recognition (browser-based)
- ✅ English and Urdu language support
- ✅ Responsive web interface
- ✅ Automatic dependency management
- ✅ Desktop and Start Menu integration
- ✅ Professional uninstaller

## Post-Installation
- **Access**: http://localhost:3000
- **Logs**: Check launcher.log for troubleshooting
- **Updates**: Re-run installer with new package
- **Uninstall**: Start Menu → Factory Management App → Uninstall

## Support
- **Documentation**: Included in package
- **Verification**: Run verify-installation.bat
- **Troubleshooting**: Check setup-windows-env.bat
EOF

echo ""
echo "========================================================="
echo "✅ Deployment Package Created Successfully!"
echo "========================================================="
echo ""
echo "Package Location: ./deployment-packages/${PACKAGE_NAME}.zip"
echo "Package Size: $(du -h "./deployment-packages/${PACKAGE_NAME}.zip" 2>/dev/null | cut -f1 || echo "Unknown")"
echo ""
echo "🎯 Next Steps for Windows Deployment:"
echo ""
echo "1. DISTRIBUTE PACKAGE:"
echo "   - Email the ZIP file to your clients"
echo "   - Upload to company file share"
echo "   - Distribute via USB drives"
echo ""
echo "2. CLIENT INSTALLATION:"
echo "   - Extract ZIP file"
echo "   - Right-click install-windows.bat → 'Run as administrator'"
echo "   - Follow installation prompts"
echo ""
echo "3. VERIFICATION:"
echo "   - Run verify-installation.bat"
echo "   - Check application starts properly"
echo "   - Test voice recognition features"
echo ""
echo "📋 Package Includes:"
echo "   ✅ Complete application source code"
echo "   ✅ Windows installers (batch + PowerShell)"
echo "   ✅ Cross-platform Python launcher"
echo "   ✅ Comprehensive documentation"
echo "   ✅ Environment verification tools"
echo "   ✅ Automatic dependency installation"
echo ""
echo "🎤 Voice Recognition:"
echo "   ✅ Browser-based (no additional packages)"
echo "   ✅ English and Urdu support"
echo "   ✅ Works offline after initial setup"
echo ""
echo "Ready to deploy to Windows clients! 🚀"
echo ""

# Cleanup temporary directory
rm -rf "$PACKAGE_DIR"
