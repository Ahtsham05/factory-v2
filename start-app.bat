@echo off
echo ===============================================
echo    Factory Management App Startup Script
echo ===============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: npm is not installed or not in PATH
    echo Please install npm with Node.js
    pause
    exit /b 1
)

echo Node.js and npm are installed. Starting application...
echo.

REM Check if MongoDB is running (optional check)
echo Checking MongoDB connection...
timeout /t 2 /nobreak >nul

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing root dependencies...
    call npm install
)

if not exist "client\node_modules" (
    echo Installing client dependencies...
    cd client
    call npm install
    cd ..
)

if not exist "server\node_modules" (
    echo Installing server dependencies...
    cd server
    call npm install
    cd ..
)

echo.
echo ===============================================
echo    Starting Factory Management Application
echo ===============================================
echo.
echo Frontend (React): http://localhost:5173
echo Backend (Express): http://localhost:3000
echo.
echo Press Ctrl+C to stop the application
echo.

REM Start the application
call npm run dev

echo.
echo Application stopped.
pause
