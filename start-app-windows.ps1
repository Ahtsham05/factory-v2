# Factory Management App Launcher - PowerShell Version
# Cross-platform launcher for Windows PowerShell

param(
    [switch]$CLI,
    [switch]$Simple,
    [switch]$Check
)

$APP_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $APP_DIR

Write-Host "Factory Management App - PowerShell Launcher" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

function Test-Command {
    param($Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

function Check-Environment {
    Write-Host "`nChecking environment..." -ForegroundColor Yellow
    
    # Check Python
    if (Test-Command "python") {
        $pythonVersion = python --version 2>&1
        Write-Host "✅ $pythonVersion" -ForegroundColor Green
        
        # Check tkinter
        try {
            python -c "import tkinter" 2>$null
            Write-Host "✅ tkinter available" -ForegroundColor Green
        } catch {
            Write-Host "❌ tkinter not available" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Python not found" -ForegroundColor Red
        Write-Host "Please install Python from https://python.org" -ForegroundColor Yellow
    }
    
    # Check Node.js
    if (Test-Command "node") {
        $nodeVersion = node --version 2>&1
        Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ Node.js not found" -ForegroundColor Red
        Write-Host "Please install Node.js from https://nodejs.org" -ForegroundColor Yellow
        
        # Check for nvm-windows
        $nvmPath = "$env:USERPROFILE\AppData\Roaming\nvm"
        if (Test-Path $nvmPath) {
            Write-Host "Found nvm-windows installation" -ForegroundColor Yellow
            Write-Host "Run: nvm install latest && nvm use latest" -ForegroundColor Yellow
        }
    }
    
    # Check npm
    if (Test-Command "npm") {
        $npmVersion = npm --version 2>&1
        Write-Host "✅ npm $npmVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ npm not found" -ForegroundColor Red
    }
    
    Write-Host ""
}

function Install-Dependencies {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    
    try {
        # Root dependencies
        if (-not (Test-Path "node_modules")) {
            Write-Host "Installing root dependencies..."
            npm install
            if ($LASTEXITCODE -ne 0) {
                throw "Failed to install root dependencies"
            }
        }
        
        # Client dependencies
        if ((Test-Path "client") -and -not (Test-Path "client/node_modules")) {
            Write-Host "Installing client dependencies..."
            Set-Location "client"
            npm install
            if ($LASTEXITCODE -ne 0) {
                throw "Failed to install client dependencies"
            }
            Set-Location $APP_DIR
        }
        
        # Server dependencies
        if ((Test-Path "server") -and -not (Test-Path "server/node_modules")) {
            Write-Host "Installing server dependencies..."
            Set-Location "server"
            npm install
            if ($LASTEXITCODE -ne 0) {
                throw "Failed to install server dependencies"
            }
            Set-Location $APP_DIR
        }
        
        Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ Error installing dependencies: $_" -ForegroundColor Red
        return $false
    }
}

function Start-Application {
    Write-Host "Starting Factory Management Application..." -ForegroundColor Green
    
    # Install dependencies first
    if (-not (Install-Dependencies)) {
        return $false
    }
    
    try {
        Write-Host "Application starting... Browser will open at http://localhost:3000" -ForegroundColor Green
        Write-Host "Press Ctrl+C to stop the application" -ForegroundColor Yellow
        Write-Host ""
        
        npm run dev
        return $true
    } catch {
        Write-Host "❌ Error starting application: $_" -ForegroundColor Red
        return $false
    }
}

# Handle command line arguments
if ($Check) {
    Check-Environment
    Read-Host "Press Enter to continue..."
    exit
}

if ($Simple) {
    Check-Environment
    if (-not (Test-Command "node") -or -not (Test-Command "npm")) {
        Write-Host "❌ Node.js or npm not found! Please install Node.js first." -ForegroundColor Red
        Read-Host "Press Enter to exit..."
        exit 1
    }
    Start-Application
    Read-Host "Press Enter to exit..."
    exit
}

if ($CLI) {
    Check-Environment
    if (-not (Test-Command "node") -or -not (Test-Command "npm")) {
        Write-Host "❌ Node.js or npm not found! Please install Node.js first." -ForegroundColor Red
        exit 1
    }
    Start-Application
    exit
}

# Default: Try to use Python GUI launcher
Check-Environment

if (Test-Command "python") {
    try {
        python -c "import tkinter" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Starting GUI launcher..." -ForegroundColor Green
            python cross-platform-launcher.py
        } else {
            Write-Host "tkinter not available, using simple launcher..." -ForegroundColor Yellow
            Start-Application
        }
    } catch {
        Write-Host "Error with Python GUI, using simple launcher..." -ForegroundColor Yellow
        Start-Application
    }
} else {
    Write-Host "Python not found, using simple launcher..." -ForegroundColor Yellow
    Start-Application
}

Read-Host "Press Enter to exit..."
