# Desktop Launcher Files

This directory contains multiple desktop launcher files for easy access to the Factory Management Application. Choose the one that works best for your system:

## Available Launchers

### 1. Factory-App.desktop (Recommended)
- **Best for**: Most users
- **Features**: GUI launcher with error handling
- **Requirements**: Python3 with tkinter (installed)
- **How it works**: Opens a graphical interface to start/stop the app

### 2. Factory-App-Terminal.desktop
- **Best for**: Users who prefer terminal interface
- **Features**: Opens in terminal window
- **Requirements**: gnome-terminal (or compatible)
- **How it works**: Runs the shell script in a terminal window

### 3. Factory-App-Simple.desktop
- **Best for**: Fallback option
- **Features**: Direct shell script execution
- **Requirements**: Basic terminal support
- **How it works**: Runs the start-app.sh script directly

## How to Use

### Method 1: Right-click and "Run as Program"
1. Right-click on any .desktop file
2. Select "Allow Launching" or "Make Executable" if prompted
3. Right-click again and select "Run as Program" or similar

### Method 2: Copy to Desktop
1. Copy the desired .desktop file to your Desktop folder
2. Right-click and select "Allow Launching"
3. Double-click to run

### Method 3: Install to Applications Menu
```bash
# Copy to applications directory
sudo cp Factory-App.desktop /usr/share/applications/
sudo chmod 644 /usr/share/applications/Factory-App.desktop

# Update desktop database
sudo update-desktop-database
```

## Troubleshooting

### Desktop file doesn't work
1. Make sure the file is executable: `chmod +x Factory-App.desktop`
2. Try the Simple version: `Factory-App-Simple.desktop`
3. Check the log file: `launcher.log` (created after first run)

### GUI launcher fails
1. Ensure Python3 and tkinter are installed: `sudo apt install python3-tk`
2. Try the Terminal version: `Factory-App-Terminal.desktop`
3. Run manually: `python3 launcher.py`

### Permission issues
1. Make sure all scripts are executable:
   ```bash
   chmod +x start-app.sh
   chmod +x desktop-launcher.sh
   chmod +x launcher.py
   ```

### Terminal doesn't open
1. Install required terminal: `sudo apt install gnome-terminal`
2. Or modify the Exec line to use your preferred terminal

## Manual Launch
If desktop files don't work, you can always launch manually:
```bash
cd "/home/ahtsham/factory v.2"
./start-app.sh
```

## Application URLs
When running, the application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
