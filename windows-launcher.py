#!/usr/bin/env python3
"""
Windows-Specific Launcher for Factory Management App
Handles Windows encoding and console issues
"""

import os
import sys
import subprocess
import platform
import time
import webbrowser
from pathlib import Path

# Set UTF-8 encoding for Windows console
if platform.system() == 'Windows':
    import locale
    # Try to set UTF-8 console encoding
    try:
        if hasattr(sys.stdout, 'reconfigure'):
            sys.stdout.reconfigure(encoding='utf-8')
        if hasattr(sys.stderr, 'reconfigure'):
            sys.stderr.reconfigure(encoding='utf-8')
    except:
        pass

class WindowsLauncher:
    def __init__(self):
        self.app_dir = Path(__file__).parent
        self.process = None
        
    def log(self, message):
        """Log message with timestamp"""
        timestamp = time.strftime("%H:%M:%S")
        try:
            print(f"[{timestamp}] {message}")
        except UnicodeEncodeError:
            # Fallback for encoding issues
            print(f"[{timestamp}] [Message with encoding issues]")
    
    def check_requirements(self):
        """Check if Node.js and npm are installed"""
        try:
            # Check Node.js
            result = subprocess.run(['node', '--version'], 
                                  capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                self.log(f"✓ Node.js found: {result.stdout.strip()}")
            else:
                self.log("✗ Node.js not found")
                return False
            
            # Check npm
            result = subprocess.run(['npm', '--version'], 
                                  capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                self.log(f"✓ npm found: {result.stdout.strip()}")
                return True
            else:
                self.log("✗ npm not found")
                return False
                
        except Exception as e:
            self.log(f"Error checking requirements: {e}")
            return False
    
    def install_dependencies(self):
        """Install npm dependencies"""
        self.log("Installing dependencies...")
        
        try:
            # Install root dependencies
            if not (self.app_dir / 'node_modules').exists():
                self.log("Installing root dependencies...")
                result = subprocess.run(['npm', 'install'], 
                                      cwd=self.app_dir, 
                                      capture_output=True, text=True, timeout=300)
                if result.returncode != 0:
                    self.log(f"Error installing root dependencies")
                    return False
            
            # Install client dependencies
            client_dir = self.app_dir / 'client'
            if client_dir.exists() and not (client_dir / 'node_modules').exists():
                self.log("Installing client dependencies...")
                result = subprocess.run(['npm', 'install'], 
                                      cwd=client_dir, 
                                      capture_output=True, text=True, timeout=300)
                if result.returncode != 0:
                    self.log(f"Error installing client dependencies")
                    return False
            
            # Install server dependencies
            server_dir = self.app_dir / 'server'
            if server_dir.exists() and not (server_dir / 'node_modules').exists():
                self.log("Installing server dependencies...")
                result = subprocess.run(['npm', 'install'], 
                                      cwd=server_dir, 
                                      capture_output=True, text=True, timeout=300)
                if result.returncode != 0:
                    self.log(f"Error installing server dependencies")
                    return False
            
            self.log("✓ Dependencies installed successfully!")
            return True
            
        except Exception as e:
            self.log(f"Error installing dependencies: {e}")
            return False
    
    def start_application(self):
        """Start the application"""
        try:
            self.log("Starting Factory Management Application...")
            
            # Use Windows-specific command
            cmd = ['cmd', '/c', 'npm', 'run', 'dev']
            
            # Start the application with proper encoding
            self.process = subprocess.Popen(
                cmd,
                cwd=self.app_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                encoding='utf-8',
                errors='replace',
                bufsize=1
            )
            
            self.log("✓ Application started successfully!")
            self.log("Opening browser in 5 seconds...")
            
            # Open browser after delay
            time.sleep(5)
            try:
                webbrowser.open("http://localhost:5173")
                self.log("✓ Browser opened: http://localhost:5173")
            except:
                self.log("Could not open browser automatically")
                self.log("Please open: http://localhost:5173")
            
            return True
            
        except Exception as e:
            self.log(f"Error starting application: {e}")
            return False
    
    def monitor_output(self):
        """Monitor application output"""
        if not self.process:
            return
        
        try:
            self.log("Application is running...")
            self.log("Press Ctrl+C to stop")
            self.log("=" * 50)
            
            while True:
                output = self.process.stdout.readline()
                if output == '' and self.process.poll() is not None:
                    break
                if output:
                    try:
                        # Clean the output for display
                        clean_output = output.strip()
                        # Remove ANSI color codes
                        import re
                        clean_output = re.sub(r'\x1b\[[0-9;]*m', '', clean_output)
                        if clean_output:
                            print(clean_output)
                    except:
                        print("[Output with encoding issues]")
                        
        except KeyboardInterrupt:
            self.log("\nStopping application...")
            self.stop_application()
        except Exception as e:
            self.log(f"Error monitoring output: {e}")
    
    def stop_application(self):
        """Stop the application"""
        if self.process:
            try:
                # Terminate the process
                self.process.terminate()
                self.process.wait(timeout=5)
                self.log("✓ Application stopped")
            except:
                # Force kill if needed
                try:
                    subprocess.run(['taskkill', '/F', '/PID', str(self.process.pid)], 
                                 capture_output=True)
                    self.log("✓ Application force stopped")
                except:
                    pass
    
    def run(self):
        """Main run method"""
        self.log("Factory Management App - Windows Launcher")
        self.log("=" * 50)
        
        # Check requirements
        if not self.check_requirements():
            self.log("\n❌ Missing requirements!")
            self.log("Please install:")
            self.log("1. Node.js from https://nodejs.org")
            self.log("2. Make sure Node.js is added to PATH")
            input("\nPress Enter to exit...")
            return False
        
        # Install dependencies
        if not self.install_dependencies():
            self.log("\n❌ Failed to install dependencies!")
            input("\nPress Enter to exit...")
            return False
        
        # Start application
        if not self.start_application():
            self.log("\n❌ Failed to start application!")
            input("\nPress Enter to exit...")
            return False
        
        # Monitor output
        self.monitor_output()
        
        return True

if __name__ == "__main__":
    launcher = WindowsLauncher()
    try:
        launcher.run()
    except KeyboardInterrupt:
        print("\nExiting...")
    except Exception as e:
        print(f"Fatal error: {e}")
    finally:
        input("\nPress Enter to exit...")
