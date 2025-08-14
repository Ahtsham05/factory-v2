@echo off
REM Factory Management App - Windows Installer
REM This script will install all prerequisites and set up the application

setlocal enabledelayedexpansion
chcp 65001 >nul

echo ========================================================
echo Factory Management App - Windows Installation Script
echo ========================================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if errorlevel 1 (
    echo WARNING: Not running as administrator.
    echo Some features may require administrator privileges.
    echo.
)

REM Create installation directory
set INSTALL_DIR=%USERPROFILE%\FactoryManagementApp
echo Installing to: %INSTALL_DIR%
echo.

if not exist "%INSTALL_DIR%" (
    mkdir "%INSTALL_DIR%"
)

REM Function to check if a command exists
:check_command
where %1 >nul 2>&1
if errorlevel 1 (
    echo ❌ %1 not found
    exit /b 1
) else (
    echo ✅ %1 found
    exit /b 0
)

REM Check Python installation
echo Checking Python installation...
call :check_command python
if errorlevel 1 (
    echo.
    echo Python is required but not installed.
    echo.
    echo Please install Python from: https://python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation.
    echo.
    choice /c YN /m "Do you want to open the Python download page"
    if !errorlevel! equ 1 (
        start https://python.org/downloads/
    )
    echo.
    echo Please install Python and run this installer again.
    pause
    exit /b 1
)

REM Check Node.js installation
echo Checking Node.js installation...
call :check_command node
if errorlevel 1 (
    echo.
    echo Node.js is required but not installed.
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo.
    choice /c YN /m "Do you want to open the Node.js download page"
    if !errorlevel! equ 1 (
        start https://nodejs.org/
    )
    echo.
    echo Please install Node.js and run this installer again.
    pause
    exit /b 1
)

REM Check npm
echo Checking npm...
call :check_command npm
if errorlevel 1 (
    echo ❌ npm not found (should come with Node.js)
    echo Please reinstall Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo ✅ All prerequisites are installed!
echo.

REM Copy application files
echo Copying application files...
xcopy /E /I /Y . "%INSTALL_DIR%" >nul 2>&1

REM Create desktop shortcuts
echo Creating desktop shortcuts...

REM Create batch file launcher on desktop
set DESKTOP=%USERPROFILE%\Desktop
echo @echo off > "%DESKTOP%\Factory Management App.bat"
echo cd /d "%INSTALL_DIR%" >> "%DESKTOP%\Factory Management App.bat"
echo python cross-platform-launcher.py >> "%DESKTOP%\Factory Management App.bat"

REM Create Start Menu shortcut
set STARTMENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs
if not exist "%STARTMENU%\Factory Management App" mkdir "%STARTMENU%\Factory Management App"

echo @echo off > "%STARTMENU%\Factory Management App\Factory Management App.bat"
echo cd /d "%INSTALL_DIR%" >> "%STARTMENU%\Factory Management App\Factory Management App.bat"
echo python cross-platform-launcher.py >> "%STARTMENU%\Factory Management App\Factory Management App.bat"

echo @echo off > "%STARTMENU%\Factory Management App\Simple Launcher.bat"
echo cd /d "%INSTALL_DIR%" >> "%STARTMENU%\Factory Management App\Simple Launcher.bat"
echo start-app-simple-windows.bat >> "%STARTMENU%\Factory Management App\Simple Launcher.bat"

echo @echo off > "%STARTMENU%\Factory Management App\Uninstall.bat"
echo rmdir /s /q "%INSTALL_DIR%" >> "%STARTMENU%\Factory Management App\Uninstall.bat"
echo rmdir /s /q "%STARTMENU%\Factory Management App" >> "%STARTMENU%\Factory Management App\Uninstall.bat"
echo del "%DESKTOP%\Factory Management App.bat" >> "%STARTMENU%\Factory Management App\Uninstall.bat"

REM Install npm dependencies
echo.
echo Installing application dependencies...
echo This may take a few minutes...
cd /d "%INSTALL_DIR%"

echo Installing root dependencies...
npm install >nul 2>&1
if errorlevel 1 (
    echo ❌ Failed to install root dependencies
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)

if exist "client" (
    echo Installing client dependencies...
    cd client
    npm install >nul 2>&1
    if errorlevel 1 (
        echo ❌ Failed to install client dependencies
        echo Please check your internet connection and try again.
        pause
        exit /b 1
    )
    cd ..
)

if exist "server" (
    echo Installing server dependencies...
    cd server
    npm install >nul 2>&1
    if errorlevel 1 (
        echo ❌ Failed to install server dependencies
        echo Please check your internet connection and try again.
        pause
        exit /b 1
    )
    cd ..
)

echo.
echo ========================================================
echo ✅ Installation Complete!
echo ========================================================
echo.
echo Application installed to: %INSTALL_DIR%
echo.
echo How to start the application:
echo 1. Double-click "Factory Management App" on your Desktop
echo 2. Or go to Start Menu ^> Factory Management App
echo 3. Or open Command Prompt, navigate to %INSTALL_DIR%, and run:
echo    python cross-platform-launcher.py
echo.
echo The application will open in your web browser at:
echo http://localhost:5173
echo.
echo Voice recognition features will work in your browser.
echo Make sure to allow microphone access when prompted.
echo.

choice /c YN /m "Do you want to start the application now"
if !errorlevel! equ 1 (
    echo.
    echo Starting Factory Management App...
    python cross-platform-launcher.py
)

echo.
echo Installation complete! Press any key to exit.
pause >nul
