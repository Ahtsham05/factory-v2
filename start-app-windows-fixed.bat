@echo off
REM Factory Management App - Windows Launcher (Fixed)
REM This launcher handles Windows-specific issues

setlocal enabledelayedexpansion
chcp 65001 >nul
title Factory Management App

set APP_DIR=%~dp0
cd /d "%APP_DIR%"

echo ========================================
echo Factory Management App - Windows
echo ========================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found!
    echo Please install Python from https://python.org
    echo Make sure to check "Add Python to PATH"
    echo.
    pause
    exit /b 1
)

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found!
    echo Please install Node.js from https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo Starting Factory Management App...
echo The application will open in your browser
echo.
echo To stop the application: Close this window or press Ctrl+C
echo ========================================
echo.

REM Start with proper encoding handling
python cross-platform-launcher.py --cli

echo.
echo Application stopped.
pause
