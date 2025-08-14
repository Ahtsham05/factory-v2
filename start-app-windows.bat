@echo off
REM Factory Management App Launcher for Windows
REM This batch file sets up the environment and starts the app

setlocal enabledelayedexpansion
chcp 65001 >nul

set APP_DIR=%~dp0
cd /d "%APP_DIR%"

echo Factory Management App - Windows Launcher
echo ==========================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    echo Or install nvm-windows from https://github.com/coreybutler/nvm-windows
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo Starting Factory Management App...
echo.

REM Start the Python GUI launcher
python cross-platform-launcher.py

pause
