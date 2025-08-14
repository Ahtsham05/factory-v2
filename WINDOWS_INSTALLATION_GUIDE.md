# Factory Management App - Windows Deployment Package

## Overview
This package contains everything needed to install and run the Factory Management App on Windows systems.

## 📦 Package Contents

### Installation Files
- **`install-windows.bat`** - Simple batch installer (recommended for most users)
- **`install-windows.ps1`** - Advanced PowerShell installer with automatic dependency installation
- **`setup-windows-env.bat`** - Environment checker (run first to verify system)

### Application Files
- **`cross-platform-launcher.py`** - Main application launcher
- **`start-app-windows.bat`** - Windows batch launcher
- **`start-app-simple-windows.bat`** - Simple Windows launcher
- **`start-app-windows.ps1`** - PowerShell launcher
- **`client/`** - React frontend application
- **`server/`** - Express.js backend application
- **`package.json`** - Root application configuration

### Documentation
- **`CROSS_PLATFORM_GUIDE.md`** - Complete setup guide
- **`WINDOWS_INSTALLATION_GUIDE.md`** - This guide
- **`LAUNCHER_GUIDE.md`** - How to use different launchers

## 🚀 Quick Installation (Recommended)

### Method 1: Simple Installer
1. **Extract** this package to any folder
2. **Right-click** `install-windows.bat` → **"Run as administrator"**
3. **Follow** the prompts
4. **Start** the app from Desktop or Start Menu

### Method 2: PowerShell Installer (Advanced)
1. **Extract** this package to any folder
2. **Right-click** `install-windows.ps1` → **"Run with PowerShell"**
3. **Allow** execution policy changes if prompted
4. **Follow** the installation wizard

## 📋 Prerequisites

The installer will check and guide you to install these if missing:

### Required
- **Python 3.7+** - [Download from python.org](https://python.org/downloads/)
  - ✅ Must check "Add Python to PATH" during installation
  - ✅ tkinter is included by default
- **Node.js 16+** - [Download from nodejs.org](https://nodejs.org/)
  - ✅ Includes npm automatically
  - ✅ LTS version recommended

### Optional (for automatic installation)
- **Chocolatey** - The installer can install this for you
- **Administrator privileges** - For automatic dependency installation

## 🎯 Installation Options

### Option A: Automatic Installation (Easiest)
```cmd
# Run as administrator for best experience
install-windows.bat
```
**Features:**
- ✅ Checks all prerequisites
- ✅ Downloads missing dependencies (with permission)
- ✅ Creates desktop and Start Menu shortcuts
- ✅ Installs all npm dependencies
- ✅ Ready to use immediately

### Option B: Manual Installation
1. **Install Prerequisites**:
   - Download and install Python from [python.org](https://python.org/downloads/)
   - Download and install Node.js from [nodejs.org](https://nodejs.org/)

2. **Extract Application**:
   - Extract this package to `C:\FactoryManagementApp` (or preferred location)

3. **Install Dependencies**:
   ```cmd
   cd C:\FactoryManagementApp
   npm install
   cd client
   npm install
   cd ..\server
   npm install
   cd ..
   ```

4. **Create Shortcuts** (optional):
   - Create desktop shortcut to `cross-platform-launcher.py`
   - Add to Start Menu

### Option C: Portable Installation
1. **Install Prerequisites** on target system
2. **Copy entire folder** to any location
3. **Run directly**: `python cross-platform-launcher.py`

## 🖥️ Using the Application

### Starting the App
After installation, you can start the application using any of these methods:

1. **Desktop Shortcut**: Double-click "Factory Management App" on Desktop
2. **Start Menu**: Start Menu → Factory Management App
3. **Command Line**: 
   ```cmd
   cd C:\FactoryManagementApp
   python cross-platform-launcher.py
   ```
4. **Direct Launchers**:
   - `start-app-windows.bat` - GUI launcher
   - `start-app-simple-windows.bat` - Command line launcher

### Accessing the Application
- **URL**: http://localhost:3000
- **Browser**: Opens automatically in your default browser
- **Voice Recognition**: Grant microphone permissions when prompted

### Features Available
- ✅ **Full MERN Application** - Complete factory management system
- ✅ **Voice Recognition** - English and Urdu speech-to-text
- ✅ **Responsive Design** - Works on different screen sizes
- ✅ **Offline Capable** - Works without internet after initial setup

## 🔧 Troubleshooting

### Common Issues

#### "Python is not recognized"
**Solution**: 
1. Reinstall Python from [python.org](https://python.org/downloads/)
2. ✅ Check "Add Python to PATH" during installation
3. Restart command prompt/PowerShell

#### "Node.js is not recognized" 
**Solution**:
1. Reinstall Node.js from [nodejs.org](https://nodejs.org/)
2. Restart command prompt/PowerShell
3. Verify with: `node --version`

#### "Permission denied" or "Execution policy"
**Solution**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### "Port 3000 already in use"
**Solution**:
```cmd
# Find and kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

#### Voice recognition not working
**Solution**:
1. Use a supported browser (Chrome, Firefox, Edge)
2. Grant microphone permissions
3. Check browser console for errors

### Getting Help
1. **Check Environment**: Run `setup-windows-env.bat`
2. **View Logs**: Check `launcher.log` in installation directory
3. **Manual Start**: Try `npm run dev` in command prompt

## 📁 File Structure After Installation

```
C:\FactoryManagementApp\
├── client\                    # React frontend
├── server\                    # Express backend
├── node_modules\              # Dependencies (auto-created)
├── cross-platform-launcher.py # Main launcher
├── start-app-windows.bat     # Windows batch launcher
├── start-app-simple-windows.bat
├── start-app-windows.ps1     # PowerShell launcher
├── package.json              # App configuration
├── launcher.log              # Application logs
└── *.md                      # Documentation files
```

## 🔄 Updating the Application

### Manual Update
1. **Backup** your current installation (optional)
2. **Download** new version package
3. **Run installer** again (will overwrite files)
4. **Dependencies** will be updated automatically

### Preserving Data
- Application data is stored in browser localStorage
- No database files need to be preserved
- Configuration is in package.json files

## 🗑️ Uninstalling

### Automatic Uninstall
1. **Start Menu** → Factory Management App → Uninstall
2. **Or run**: `Uninstall.ps1` from Start Menu folder

### Manual Uninstall
1. **Delete** installation directory (e.g., `C:\FactoryManagementApp`)
2. **Remove** desktop shortcut
3. **Remove** Start Menu folder: `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Factory Management App`

## 🌐 Network Configuration

### Default Ports
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017 (if using local database)

### Firewall
The application runs locally and doesn't require firewall changes for basic use.

### Sharing Access
To allow other computers to access the application:
1. **Configure** application to bind to 0.0.0.0 instead of localhost
2. **Open** Windows Firewall ports 3000 and 5000
3. **Access** via http://[COMPUTER_IP]:3000

## 📱 Mobile Access

Users can access the application from mobile devices on the same network:
1. **Find** your computer's IP address: `ipconfig`
2. **Configure** app for network access (see Network Configuration)
3. **Open** http://[COMPUTER_IP]:3000 on mobile browser

## 🏢 Enterprise Deployment

### Domain Networks
- **Group Policy**: Can be deployed via Group Policy for automatic installation
- **SCCM**: Compatible with System Center Configuration Manager
- **Silent Install**: Use `install-windows.ps1 -Silent` for automated deployment

### Requirements
- **Windows 10/11** (Windows Server 2016+ for server deployment)
- **2GB RAM** minimum, 4GB recommended
- **1GB disk space** for application and dependencies
- **Internet connection** for initial dependency installation

## 🔒 Security Considerations

### Application Security
- ✅ **No admin rights** required to run application
- ✅ **Local network only** by default
- ✅ **No external connections** required after installation
- ✅ **Standard Windows permissions** apply

### Voice Recognition
- ✅ **Browser-based** - uses native browser APIs
- ✅ **No cloud services** - processing is local
- ✅ **User consent** required for microphone access

## 📞 Support Information

### System Requirements Met
- ✅ **Windows 10** version 1903 or later
- ✅ **Windows 11** all versions
- ✅ **Windows Server 2016+** for server deployment

### Browser Compatibility
- ✅ **Google Chrome** 80+
- ✅ **Microsoft Edge** 80+
- ✅ **Mozilla Firefox** 75+
- ⚠️ **Internet Explorer** not supported

### Hardware Requirements
- **CPU**: Any modern processor (2+ cores recommended)
- **RAM**: 2GB minimum, 4GB recommended
- **Storage**: 1GB available space
- **Microphone**: Required for voice recognition features

This installation package provides everything needed to deploy the Factory Management App on any Windows system with professional-grade reliability and user experience.
