# Factory Management App - PowerShell Installer
# Advanced installer with better error handling and GUI options

param(
    [switch]$Silent,
    [string]$InstallPath = "$env:USERPROFILE\FactoryManagementApp"
)

# Set execution policy for current session
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Factory Management App - Windows PowerShell Installer" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# Function to test if running as administrator
function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Function to check if a command exists
function Test-Command {
    param($Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

# Function to install Chocolatey
function Install-Chocolatey {
    Write-Host "Installing Chocolatey package manager..." -ForegroundColor Yellow
    try {
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        return $true
    } catch {
        Write-Host "Failed to install Chocolatey: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to install using Chocolatey
function Install-WithChocolatey {
    param($Package, $Name)
    
    Write-Host "Installing $Name using Chocolatey..." -ForegroundColor Yellow
    try {
        choco install $Package -y
        return $true
    } catch {
        Write-Host "Failed to install $Name with Chocolatey" -ForegroundColor Red
        return $false
    }
}

# Check if running as administrator
if (-not (Test-Administrator)) {
    Write-Host "⚠️  Not running as administrator." -ForegroundColor Yellow
    Write-Host "Some installation features may require administrator privileges." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Installing to: $InstallPath" -ForegroundColor Green
Write-Host ""

# Create installation directory
if (-not (Test-Path $InstallPath)) {
    New-Item -ItemType Directory -Path $InstallPath -Force | Out-Null
}

# Check Python installation
Write-Host "Checking Python installation..." -ForegroundColor Cyan
if (Test-Command "python") {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ $pythonVersion" -ForegroundColor Green
    
    # Check tkinter
    try {
        python -c "import tkinter" 2>$null
        Write-Host "✅ tkinter available" -ForegroundColor Green
        $pythonOK = $true
    } catch {
        Write-Host "❌ tkinter not available" -ForegroundColor Red
        $pythonOK = $false
    }
} else {
    Write-Host "❌ Python not found" -ForegroundColor Red
    $pythonOK = $false
    
    if (-not $Silent) {
        $choice = Read-Host "Python is required. Install automatically? (y/n)"
        if ($choice -eq 'y' -or $choice -eq 'Y') {
            if (Test-Administrator) {
                # Try to install with Chocolatey
                if (-not (Test-Command "choco")) {
                    Install-Chocolatey
                }
                if (Test-Command "choco") {
                    Install-WithChocolatey "python" "Python"
                    $pythonOK = Test-Command "python"
                }
            } else {
                Write-Host "Administrator privileges required for automatic installation." -ForegroundColor Yellow
                Write-Host "Opening Python download page..." -ForegroundColor Yellow
                Start-Process "https://python.org/downloads/"
            }
        }
    }
}

# Check Node.js installation
Write-Host "Checking Node.js installation..." -ForegroundColor Cyan
if (Test-Command "node") {
    $nodeVersion = node --version 2>&1
    Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green
    $nodeOK = $true
} else {
    Write-Host "❌ Node.js not found" -ForegroundColor Red
    $nodeOK = $false
    
    if (-not $Silent) {
        $choice = Read-Host "Node.js is required. Install automatically? (y/n)"
        if ($choice -eq 'y' -or $choice -eq 'Y') {
            if (Test-Administrator) {
                # Try to install with Chocolatey
                if (-not (Test-Command "choco")) {
                    Install-Chocolatey
                }
                if (Test-Command "choco") {
                    Install-WithChocolatey "nodejs" "Node.js"
                    $nodeOK = Test-Command "node"
                }
            } else {
                Write-Host "Administrator privileges required for automatic installation." -ForegroundColor Yellow
                Write-Host "Opening Node.js download page..." -ForegroundColor Yellow
                Start-Process "https://nodejs.org/"
            }
        }
    }
}

# Check npm
Write-Host "Checking npm..." -ForegroundColor Cyan
if (Test-Command "npm") {
    $npmVersion = npm --version 2>&1
    Write-Host "✅ npm $npmVersion" -ForegroundColor Green
    $npmOK = $true
} else {
    Write-Host "❌ npm not found (should come with Node.js)" -ForegroundColor Red
    $npmOK = $false
}

# Check if all prerequisites are met
if (-not ($pythonOK -and $nodeOK -and $npmOK)) {
    Write-Host ""
    Write-Host "❌ Prerequisites not met. Please install missing components and run installer again." -ForegroundColor Red
    
    if (-not $pythonOK) {
        Write-Host "• Install Python from: https://python.org/downloads/" -ForegroundColor Yellow
    }
    if (-not $nodeOK) {
        Write-Host "• Install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    }
    
    if (-not $Silent) {
        Read-Host "Press Enter to exit..."
    }
    exit 1
}

Write-Host ""
Write-Host "✅ All prerequisites are installed!" -ForegroundColor Green
Write-Host ""

# Copy application files
Write-Host "Copying application files..." -ForegroundColor Cyan
try {
    Copy-Item -Recurse -Force -Path ".\*" -Destination $InstallPath -Exclude ".git","node_modules","*.log"
    Write-Host "✅ Application files copied" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to copy application files: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Create desktop shortcut
Write-Host "Creating desktop shortcuts..." -ForegroundColor Cyan
$Desktop = [Environment]::GetFolderPath("Desktop")
$WshShell = New-Object -comObject WScript.Shell

# Main application shortcut
$Shortcut = $WshShell.CreateShortcut("$Desktop\Factory Management App.lnk")
$Shortcut.TargetPath = "python"
$Shortcut.Arguments = "cross-platform-launcher.py"
$Shortcut.WorkingDirectory = $InstallPath
$Shortcut.Description = "Factory Management Application"
$Shortcut.Save()

# Create Start Menu shortcuts
$StartMenu = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Factory Management App"
if (-not (Test-Path $StartMenu)) {
    New-Item -ItemType Directory -Path $StartMenu -Force | Out-Null
}

# Main app shortcut in Start Menu
$Shortcut = $WshShell.CreateShortcut("$StartMenu\Factory Management App.lnk")
$Shortcut.TargetPath = "python"
$Shortcut.Arguments = "cross-platform-launcher.py"
$Shortcut.WorkingDirectory = $InstallPath
$Shortcut.Description = "Factory Management Application"
$Shortcut.Save()

# Simple launcher shortcut
$Shortcut = $WshShell.CreateShortcut("$StartMenu\Simple Launcher.lnk")
$Shortcut.TargetPath = "$InstallPath\start-app-simple-windows.bat"
$Shortcut.WorkingDirectory = $InstallPath
$Shortcut.Description = "Factory Management App - Simple Launcher"
$Shortcut.Save()

# Create uninstaller
$UninstallScript = @"
# Factory Management App Uninstaller
Write-Host "Uninstalling Factory Management App..." -ForegroundColor Yellow

# Remove application directory
if (Test-Path "$InstallPath") {
    Remove-Item -Recurse -Force "$InstallPath"
    Write-Host "✅ Application files removed" -ForegroundColor Green
}

# Remove desktop shortcut
if (Test-Path "$Desktop\Factory Management App.lnk") {
    Remove-Item "$Desktop\Factory Management App.lnk"
    Write-Host "✅ Desktop shortcut removed" -ForegroundColor Green
}

# Remove Start Menu shortcuts
if (Test-Path "$StartMenu") {
    Remove-Item -Recurse -Force "$StartMenu"
    Write-Host "✅ Start Menu shortcuts removed" -ForegroundColor Green
}

Write-Host "✅ Uninstallation complete!" -ForegroundColor Green
Read-Host "Press Enter to exit..."
"@

$UninstallScript | Out-File -Encoding UTF8 "$StartMenu\Uninstall.ps1"

Write-Host "✅ Shortcuts created" -ForegroundColor Green

# Install npm dependencies
Write-Host ""
Write-Host "Installing application dependencies..." -ForegroundColor Cyan
Write-Host "This may take a few minutes..." -ForegroundColor Yellow

Set-Location $InstallPath

try {
    # Install root dependencies
    Write-Host "Installing root dependencies..." -ForegroundColor Yellow
    npm install --silent
    
    # Install client dependencies
    if (Test-Path "client") {
        Write-Host "Installing client dependencies..." -ForegroundColor Yellow
        Set-Location "client"
        npm install --silent
        Set-Location $InstallPath
    }
    
    # Install server dependencies
    if (Test-Path "server") {
        Write-Host "Installing server dependencies..." -ForegroundColor Yellow
        Set-Location "server"
        npm install --silent
        Set-Location $InstallPath
    }
    
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Failed to install dependencies: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please check your internet connection and try running the installer again." -ForegroundColor Yellow
    if (-not $Silent) {
        Read-Host "Press Enter to exit..."
    }
    exit 1
}

# Installation complete
Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "✅ Installation Complete!" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Application installed to: $InstallPath" -ForegroundColor Green
Write-Host ""
Write-Host "How to start the application:" -ForegroundColor Cyan
Write-Host "1. Double-click 'Factory Management App' on your Desktop" -ForegroundColor White
Write-Host "2. Or go to Start Menu > Factory Management App" -ForegroundColor White
Write-Host "3. Or run: python cross-platform-launcher.py" -ForegroundColor White
Write-Host ""
Write-Host "The application will open in your web browser at:" -ForegroundColor Cyan
Write-Host "http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Voice recognition features will work in your browser." -ForegroundColor Cyan
Write-Host "Make sure to allow microphone access when prompted." -ForegroundColor Yellow
Write-Host ""

if (-not $Silent) {
    $choice = Read-Host "Do you want to start the application now? (y/n)"
    if ($choice -eq 'y' -or $choice -eq 'Y') {
        Write-Host ""
        Write-Host "Starting Factory Management App..." -ForegroundColor Green
        python cross-platform-launcher.py
    }
}

Write-Host ""
Write-Host "Installation complete!" -ForegroundColor Green
if (-not $Silent) {
    Read-Host "Press Enter to exit..."
}
