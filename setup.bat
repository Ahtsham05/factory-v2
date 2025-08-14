@echo off
echo 🏭 Factory Management App Setup
echo ================================
echo.

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js installed
)

REM Check npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm not found
    echo Please install npm with Node.js
    pause
    exit /b 1
) else (
    echo ✅ npm installed
)

REM Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Python not found - GUI launcher won't work
    echo Install Python for the GUI launcher feature
) else (
    echo ✅ Python installed
)

echo.
echo Installing dependencies...

REM Install root dependencies
if not exist "node_modules" (
    echo 📦 Installing root dependencies...
    call npm install
    echo ✅ Root dependencies installed
) else (
    echo ✅ Root dependencies already installed
)

REM Install client dependencies
if not exist "client\node_modules" (
    echo 📦 Installing client dependencies...
    cd client
    call npm install
    cd ..
    echo ✅ Client dependencies installed
) else (
    echo ✅ Client dependencies already installed
)

REM Install server dependencies
if not exist "server\node_modules" (
    echo 📦 Installing server dependencies...
    cd server
    call npm install
    cd ..
    echo ✅ Server dependencies installed
) else (
    echo ✅ Server dependencies already installed
)

echo.
echo Testing build process...
cd client
call npm run build >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Client build successful
) else (
    echo ⚠️  Client build had issues - check manually
)
cd ..

echo.
echo 🎉 Setup Complete!
echo.
echo Launch Options:
echo 1. GUI Launcher:    python launcher.py
echo 2. Batch File:      start-app.bat
echo 3. Manual:          npm run dev
echo.
echo Application URLs (when running):
echo • Frontend: http://localhost:5173
echo • Backend:  http://localhost:3000
echo.
echo Note: Voice-to-text will work in supported browsers
echo Grant microphone permissions when prompted
echo.
pause
