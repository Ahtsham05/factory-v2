# Factory Management App - Single Click Launchers

## Overview
Your Factory Management MERN application now has multiple single-click launcher options. All launchers have been updated to work with your nvm Node.js installation.

## Available Launchers

### 1. Factory-App.desktop (Recommended)
**File**: `Factory-App.desktop`
**Type**: Advanced shell launcher with error handling
**Features**: 
- Silent background launch
- Error dialogs if issues occur
- Automatic environment setup
- Works with nvm

**Usage**: Right-click → "Run as Program" or double-click

### 2. Factory-App-Simple.desktop
**File**: `Factory-App-Simple.desktop`
**Type**: Simple shell script launcher
**Features**:
- Shows terminal during startup
- Direct shell script execution
- Basic error visibility

**Usage**: Right-click → "Run as Program" or double-click

### 3. Factory-App-Terminal.desktop
**File**: `Factory-App-Terminal.desktop`
**Type**: Terminal-based launcher
**Features**:
- Opens in gnome-terminal
- Shows all application output
- Press Enter to close when done

**Usage**: Right-click → "Run as Program" or double-click

### 4. Factory-App-Enhanced-GUI.desktop
**File**: `Factory-App-Enhanced-GUI.desktop`
**Type**: Python GUI launcher with full controls
**Features**:
- User-friendly GUI interface
- Start/Stop buttons
- Real-time application logs
- Open browser button
- Status monitoring

**Usage**: Right-click → "Run as Program" or double-click

## Manual Launch Options

### Shell Script
```bash
cd "/home/ahtsham/factory v.2"
./start-app.sh
```

### Enhanced Python GUI
```bash
cd "/home/ahtsham/factory v.2"
python3 factory-gui-launcher.py
```

### Original Python GUI
```bash
cd "/home/ahtsham/factory v.2"
python3 launcher.py
```

## Environment Setup

All launchers use the `setup-env.sh` script which:
- Loads nvm (Node Version Manager)
- Sets up Node.js v22.17.0 environment
- Configures proper PATH variables
- Sources user shell configurations

## Voice Recognition

Your application uses browser-based Speech Recognition API which:
- Works perfectly in web browsers
- Supports both English (en-PK) and Urdu (ur-PK)
- Located in: `client/src/hooks/use-voice-input.tsx`
- Uses native `window.SpeechRecognition` API

## Troubleshooting

### If launchers don't work:
1. Check Node.js installation:
   ```bash
   cd "/home/ahtsham/factory v.2"
   source setup-env.sh
   node --version
   npm --version
   ```

2. Test environment manually:
   ```bash
   cd "/home/ahtsham/factory v.2"
   bash setup-env.sh
   ```

3. Check application dependencies:
   ```bash
   cd "/home/ahtsham/factory v.2"
   npm install
   ```

### If voice recognition doesn't work:
- Ensure you're using a modern browser (Chrome, Firefox, Safari)
- Grant microphone permissions when prompted
- Check browser console for any errors

## Project Structure

```
/home/ahtsham/factory v.2/
├── client/                 # React frontend (Vite)
├── server/                 # Express.js backend
├── package.json           # Root package.json with scripts
├── start-app.sh          # Shell launcher script
├── setup-env.sh          # Environment setup script
├── launcher.py           # Original Python GUI launcher
├── factory-gui-launcher.py # Enhanced Python GUI launcher
├── desktop-launcher.sh   # Advanced shell launcher
└── *.desktop            # Desktop shortcut files
```

## Success Indicators

When the application starts successfully, you should see:
- Client starting on http://localhost:3000
- Server starting on http://localhost:5000
- MongoDB connection established
- "Application is running" messages

The browser should automatically open to http://localhost:3000 where you can use the voice recognition features.

## Notes

- All launchers properly handle nvm environment setup
- Voice recognition uses browser APIs (no additional packages needed)
- Multiple launcher options provide flexibility for different use cases
- Environment setup is centralized in `setup-env.sh`
- All scripts have proper error handling and logging
