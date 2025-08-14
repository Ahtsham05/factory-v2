@echo off
REM Windows Environment Setup for Factory Management App
REM This script helps detect and setup Node.js environment

setlocal enabledelayedexpansion
chcp 65001 >nul

echo Factory Management App - Windows Environment Setup
echo ==================================================

REM Check Python
echo Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found
    echo Please install Python from https://python.org
    echo Make sure to check "Add Python to PATH" during installation
    echo.
) else (
    for /f "tokens=*" %%i in ('python --version 2^>^&1') do echo ✅ %%i
)

REM Check tkinter
echo Checking tkinter...
python -c "import tkinter; print('✅ tkinter available')" >nul 2>&1
if errorlevel 1 (
    echo ❌ tkinter not available
    echo tkinter should be included with Python installation
    echo.
) else (
    echo ✅ tkinter available
)

REM Check Node.js
echo Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found
    echo.
    echo Please install Node.js:
    echo 1. Download from https://nodejs.org
    echo 2. Or use nvm-windows: https://github.com/coreybutler/nvm-windows
    echo.
    
    REM Check for nvm-windows
    if exist "%USERPROFILE%\AppData\Roaming\nvm" (
        echo Found nvm-windows installation
        echo Please run: nvm install latest ^&^& nvm use latest
    )
    echo.
) else (
    for /f "tokens=*" %%i in ('node --version 2^>^&1') do echo ✅ Node.js %%i
)

REM Check npm
echo Checking npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm not found
    echo npm should be included with Node.js installation
    echo.
) else (
    for /f "tokens=*" %%i in ('npm --version 2^>^&1') do echo ✅ npm %%i
)

REM Check Git (optional but recommended)
echo Checking Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Git not found (optional)
    echo Download from https://git-scm.com/download/win
    echo.
) else (
    for /f "tokens=*" %%i in ('git --version 2^>^&1') do echo ✅ %%i
)

echo.
echo Environment check complete!
echo.

REM Check if we can run the app
if exist "package.json" (
    node --version >nul 2>&1
    if not errorlevel 1 (
        npm --version >nul 2>&1
        if not errorlevel 1 (
            echo ✅ Ready to run Factory Management App!
            echo.
            echo To start the app:
            echo 1. Double-click start-app-windows.bat ^(GUI launcher^)
            echo 2. Double-click start-app-simple-windows.bat ^(simple launcher^)
            echo 3. Or run: python cross-platform-launcher.py
            echo.
        )
    )
) else (
    echo ⚠️  package.json not found
    echo Make sure you're in the Factory Management App directory
    echo.
)

pause
