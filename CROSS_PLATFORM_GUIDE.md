# Factory Management App - Cross Platform Setup Guide

## Overview
The Factory Management App now supports both **Ubuntu/Linux** and **Windows** platforms with multiple launcher options.

## 🖥️ Windows Setup

### Prerequisites
1. **Python 3.7+** - Download from [python.org](https://python.org)
   - ✅ Make sure to check "Add Python to PATH" during installation
   - ✅ tkinter is included by default

2. **Node.js** - Choose one option:
   - **Option A**: Download from [nodejs.org](https://nodejs.org) (Recommended)
   - **Option B**: Use nvm-windows from [github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)

### Windows Launchers

#### 🎯 GUI Launcher (Recommended)
**File**: `start-app-windows.bat`
- Double-click to start
- User-friendly interface
- Automatic dependency installation
- Start/Stop controls

#### ⚡ Simple Launcher
**File**: `start-app-simple-windows.bat`
- Double-click to start
- Runs directly in command prompt
- Shows all output
- Automatic dependency installation

#### 🔧 PowerShell Launcher
**File**: `start-app-windows.ps1`
- Right-click → "Run with PowerShell"
- Advanced features and error handling
- Multiple modes available

#### 🐍 Cross-Platform Python Launcher
**File**: `cross-platform-launcher.py`
- Run: `python cross-platform-launcher.py`
- Works on both Windows and Linux
- Full-featured GUI interface

### Windows Quick Start
1. **Check Environment**: Double-click `setup-windows-env.bat`
2. **Start App**: Double-click `start-app-windows.bat`
3. **Browser Opens**: App loads at `http://localhost:3000`

---

## 🐧 Ubuntu/Linux Setup

### Prerequisites
```bash
# Install Node.js and npm
sudo apt update
sudo apt install nodejs npm python3 python3-tk

# OR use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
```

### Linux Launchers

#### 🎯 Desktop Files (Right-click launchers)
- `Factory-App.desktop` - Advanced launcher with error handling
- `Factory-App-Simple.desktop` - Simple shell launcher  
- `Factory-App-Terminal.desktop` - Terminal-based launcher
- `Factory-App-Enhanced-GUI.desktop` - Enhanced Python GUI

#### ⚡ Shell Scripts
```bash
# Simple start
./start-app.sh

# Environment setup
source ./setup-env.sh

# Desktop launcher
./desktop-launcher.sh
```

#### 🐍 Python Launchers
```bash
# Original launcher
python3 launcher.py

# Cross-platform launcher
python3 cross-platform-launcher.py

# Enhanced GUI launcher
python3 factory-gui-launcher.py
```

### Linux Quick Start
1. **Check Environment**: `bash setup-env.sh`
2. **Start App**: Right-click `Factory-App.desktop` → "Run as Program"
3. **Browser Opens**: App loads at `http://localhost:3000`

---

## 🎤 Voice Recognition Features

The app includes voice-to-text functionality that works in web browsers:

- **Languages**: English (en-PK) and Urdu (ur-PK)
- **Technology**: Browser-based Speech Recognition API
- **Compatibility**: Works in Chrome, Firefox, Safari, Edge
- **Location**: `client/src/hooks/use-voice-input.tsx`

### Using Voice Features
1. Start the application
2. Open browser at `http://localhost:3000`
3. Grant microphone permissions when prompted
4. Use voice input fields throughout the application

---

## 📁 Project Structure
```
factory-management-app/
├── client/                     # React frontend (Vite)
├── server/                     # Express.js backend  
├── package.json               # Root package.json with scripts
│
├── 🐧 Linux Launchers
├── start-app.sh              # Shell launcher
├── setup-env.sh              # Environment setup
├── desktop-launcher.sh       # Desktop launcher
├── launcher.py               # Original Python GUI
├── factory-gui-launcher.py   # Enhanced Python GUI
├── *.desktop                 # Desktop shortcuts
│
├── 🖥️ Windows Launchers
├── start-app-windows.bat     # Batch GUI launcher
├── start-app-simple-windows.bat # Simple batch launcher
├── start-app-windows.ps1     # PowerShell launcher
├── setup-windows-env.bat     # Windows environment check
│
└── 🌐 Cross-Platform
    ├── cross-platform-launcher.py # Universal Python launcher
    └── CROSS_PLATFORM_GUIDE.md   # This guide
```

---

## 🚀 Available Scripts

### Root Package.json Scripts
```bash
npm run dev          # Start both client and server
npm run client       # Start only client (React)
npm run server       # Start only server (Express)
npm run build        # Build for production
npm run start        # Start production server
```

### Platform-Specific Commands

#### Windows
```cmd
# Check environment
setup-windows-env.bat

# Start with GUI
start-app-windows.bat

# Start simple
start-app-simple-windows.bat

# PowerShell options
powershell -ExecutionPolicy Bypass -File start-app-windows.ps1
powershell -ExecutionPolicy Bypass -File start-app-windows.ps1 -Simple
powershell -ExecutionPolicy Bypass -File start-app-windows.ps1 -Check
```

#### Linux
```bash
# Check environment
bash setup-env.sh

# Start with shell
./start-app.sh

# Start with Python GUI
python3 launcher.py
python3 cross-platform-launcher.py
```

---

## 🔧 Troubleshooting

### Windows Issues

#### "Python is not recognized"
```cmd
# Add Python to PATH manually
set PATH=%PATH%;C:\Python39;C:\Python39\Scripts
```

#### "Node.js is not recognized"
```cmd
# Add Node.js to PATH manually
set PATH=%PATH%;C:\Program Files\nodejs
```

#### PowerShell Execution Policy
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Linux Issues

#### Node.js not found
```bash
# Install via apt
sudo apt install nodejs npm

# Or use nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
```

#### Python tkinter missing
```bash
sudo apt install python3-tk
```

#### Desktop files not executable
```bash
chmod +x *.desktop
chmod +x *.sh
chmod +x *.py
```

### Common Issues

#### Port already in use
```bash
# Kill processes on ports 3000 and 5000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux
sudo lsof -ti:3000 | xargs kill -9
sudo lsof -ti:5000 | xargs kill -9
```

#### Dependencies not installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🌟 Features

### Cross-Platform Compatibility
- ✅ Windows 10/11
- ✅ Ubuntu 18.04+
- ✅ Other Linux distributions
- ✅ macOS (with minor adjustments)

### Voice Recognition
- ✅ Real-time speech-to-text
- ✅ Multi-language support (English/Urdu)
- ✅ Browser-based (no additional packages needed)
- ✅ Works offline after initial load

### User Interface
- ✅ Modern React frontend with Vite
- ✅ Responsive design
- ✅ Dark/Light theme support
- ✅ Multi-language interface

### Launcher Options
- ✅ GUI launchers for easy use
- ✅ Command-line options for developers
- ✅ Desktop shortcuts for quick access
- ✅ Automatic dependency management

---

## 📞 Support

If you encounter any issues:

1. **Check Prerequisites**: Run environment check scripts
2. **Review Logs**: Check `launcher.log` file
3. **Verify Installation**: Ensure Node.js and Python are properly installed
4. **Test Manually**: Try running `npm run dev` directly
5. **Check Permissions**: Ensure scripts are executable

### Environment Check Commands
```bash
# Windows
setup-windows-env.bat

# Linux
bash setup-env.sh

# Cross-platform
python cross-platform-launcher.py --cli
```

---

## 🔄 Updates

To update the application:

1. **Pull latest changes** (if using Git)
2. **Reinstall dependencies**: Delete `node_modules` folders and run launchers
3. **Test functionality**: Run environment checks
4. **Restart application**: Use your preferred launcher

The launchers will automatically handle dependency updates when you start the application.
