@echo off
REM Simple Factory Management App Launcher for Windows
REM Fixes encoding and console issues

title Factory Management App
chcp 65001 >nul

echo ========================================
echo    Factory Management App
echo        Windows Launcher
echo ========================================
echo.

cd /d "%~dp0"

REM Quick check for Python
python --version >nul 2>&1
if errorlevel 1 (
    echo Python not found! Please install Python first.
    echo Download from: https://python.org
    pause
    exit
)

REM Quick check for Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js not found! Please install Node.js first.
    echo Download from: https://nodejs.org
    pause
    exit
)

echo Starting application...
echo Browser will open automatically
echo.

REM Use the Windows-specific launcher
python windows-launcher.py

echo.
echo Application finished.
pause
