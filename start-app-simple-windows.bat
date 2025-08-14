@echo off
REM Simple Windows launcher without GUI
REM Directly starts the MERN application

setlocal enabledelayedexpansion
chcp 65001 >nul

set APP_DIR=%~dp0
cd /d "%APP_DIR%"

echo Factory Management App - Simple Windows Launcher
echo =================================================

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

REM Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm not found!
    pause
    exit /b 1
)

echo Installing dependencies if needed...
if not exist "node_modules" (
    echo Installing root dependencies...
    npm install
)

if not exist "client\node_modules" (
    echo Installing client dependencies...
    cd client
    npm install
    cd ..
)

if not exist "server\node_modules" (
    echo Installing server dependencies...
    cd server
    npm install
    cd ..
)

echo.
echo Starting application...
echo The application will open in your browser at http://localhost:5173
echo Press Ctrl+C to stop the application
echo.

npm run dev

pause
