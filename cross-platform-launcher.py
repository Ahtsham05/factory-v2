#!/usr/bin/env python3
"""
Factory Management App Launcher - Cross Platform
Works on both Ubuntu/Linux and Windows
"""

import os
import sys
import subprocess
import threading
import time
import webbrowser
import json
import platform
from pathlib import Path

try:
    import tkinter as tk
    from tkinter import ttk, messagebox, scrolledtext
    GUI_AVAILABLE = True
except ImportError:
    GUI_AVAILABLE = False

class CrossPlatformLauncher:
    def __init__(self):
        self.app_dir = Path(__file__).parent
        self.processes = []
        self.root = None
        self.log_text = None
        self.platform = platform.system().lower()
        self.is_windows = self.platform == 'windows'
        self.is_linux = self.platform == 'linux'
        
        # Platform-specific settings
        self.node_cmd = 'node.exe' if self.is_windows else 'node'
        self.npm_cmd = 'npm.cmd' if self.is_windows else 'npm'
        
    def log(self, message):
        """Log message to console and GUI if available"""
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        log_message = f"[{timestamp}] {message}"
        print(log_message)
        
        if self.log_text:
            self.log_text.insert(tk.END, log_message + "\n")
            self.log_text.see(tk.END)
            self.root.update()
    
    def setup_node_environment(self):
        """Setup Node.js environment for both Windows and Linux"""
        if self.is_windows:
            self.setup_windows_node()
        else:
            self.setup_linux_node()
    
    def setup_windows_node(self):
        """Setup Node.js environment on Windows"""
        # Common Windows Node.js installation paths
        possible_paths = [
            os.path.expandvars(r"%PROGRAMFILES%\nodejs"),
            os.path.expandvars(r"%PROGRAMFILES(X86)%\nodejs"),
            os.path.expanduser(r"~\AppData\Roaming\npm"),
            os.path.expanduser(r"~\scoop\apps\nodejs\current"),
            os.path.expanduser(r"~\.nvm"),
        ]
        
        # Check for nvm-windows
        nvm_windows_path = os.path.expanduser(r"~\AppData\Roaming\nvm")
        if os.path.exists(nvm_windows_path):
            self.log("Found nvm-windows installation")
            # Look for current Node.js version
            try:
                with open(os.path.join(nvm_windows_path, "settings.txt"), 'r') as f:
                    for line in f:
                        if line.startswith("current: "):
                            current_version = line.split(": ")[1].strip()
                            node_path = os.path.join(nvm_windows_path, current_version)
                            if os.path.exists(node_path):
                                self.add_to_path(node_path)
                                self.log(f"Added nvm-windows node path: {node_path}")
                                return
            except Exception as e:
                self.log(f"Could not read nvm-windows settings: {e}")
        
        # Check standard installation paths
        for path in possible_paths:
            if os.path.exists(path):
                node_exe = os.path.join(path, "node.exe")
                if os.path.exists(node_exe):
                    self.add_to_path(path)
                    self.log(f"Added Node.js path: {path}")
                    return
        
        self.log("Node.js path setup completed")
    
    def setup_linux_node(self):
        """Setup Node.js environment on Linux (Ubuntu)"""
        # Setup nvm environment
        nvm_dir = os.path.expanduser("~/.nvm")
        if os.path.exists(nvm_dir):
            self.log("Found nvm installation")
            node_version_dir = os.path.join(nvm_dir, "versions", "node")
            if os.path.exists(node_version_dir):
                versions = os.listdir(node_version_dir)
                if versions:
                    # Use the latest version
                    latest_version = sorted(versions, key=lambda x: [int(i) for i in x.lstrip('v').split('.')])[-1]
                    node_bin_path = os.path.join(node_version_dir, latest_version, "bin")
                    self.add_to_path(node_bin_path)
                    self.log(f"Added nvm node path: {node_bin_path}")
                    return
        
        # Check standard Linux paths
        standard_paths = ["/usr/local/bin", "/usr/bin", "/opt/nodejs/bin"]
        for path in standard_paths:
            node_path = os.path.join(path, "node")
            if os.path.exists(node_path):
                self.add_to_path(path)
                self.log(f"Found Node.js in: {path}")
                break
    
    def add_to_path(self, path):
        """Add path to environment PATH variable"""
        current_path = os.environ.get('PATH', '')
        path_separator = ';' if self.is_windows else ':'
        
        if path not in current_path:
            os.environ['PATH'] = f"{path}{path_separator}{current_path}"
    
    def check_requirements(self):
        """Check if Node.js and npm are installed"""
        self.setup_node_environment()
        
        try:
            # Check Node.js
            node_result = subprocess.run([self.node_cmd, '--version'], 
                                       capture_output=True, text=True, timeout=10)
            if node_result.returncode == 0:
                self.log(f"Node.js found: {node_result.stdout.strip()}")
            else:
                self.log("Node.js not found or not working")
                return False
            
            # Check npm
            npm_result = subprocess.run([self.npm_cmd, '--version'], 
                                      capture_output=True, text=True, timeout=10)
            if npm_result.returncode == 0:
                self.log(f"npm found: {npm_result.stdout.strip()}")
                return True
            else:
                self.log("npm not found or not working")
                return False
                
        except (subprocess.CalledProcessError, FileNotFoundError, subprocess.TimeoutExpired) as e:
            self.log(f"Error checking requirements: {e}")
            return False
    
    def install_dependencies(self):
        """Install all dependencies"""
        self.log("Installing dependencies...")
        
        try:
            # Install root dependencies
            if not (self.app_dir / 'node_modules').exists():
                self.log("Installing root dependencies...")
                result = subprocess.run([self.npm_cmd, 'install'], 
                                      cwd=self.app_dir, 
                                      capture_output=True, text=True, timeout=300)
                if result.returncode != 0:
                    self.log(f"Error installing root dependencies: {result.stderr}")
                    return False
            
            # Install client dependencies
            client_dir = self.app_dir / 'client'
            if client_dir.exists() and not (client_dir / 'node_modules').exists():
                self.log("Installing client dependencies...")
                result = subprocess.run([self.npm_cmd, 'install'], 
                                      cwd=client_dir, 
                                      capture_output=True, text=True, timeout=300)
                if result.returncode != 0:
                    self.log(f"Error installing client dependencies: {result.stderr}")
                    return False
            
            # Install server dependencies
            server_dir = self.app_dir / 'server'
            if server_dir.exists() and not (server_dir / 'node_modules').exists():
                self.log("Installing server dependencies...")
                result = subprocess.run([self.npm_cmd, 'install'], 
                                      cwd=server_dir, 
                                      capture_output=True, text=True, timeout=300)
                if result.returncode != 0:
                    self.log(f"Error installing server dependencies: {result.stderr}")
                    return False
            
            self.log("Dependencies installed successfully!")
            return True
            
        except subprocess.TimeoutExpired:
            self.log("Timeout while installing dependencies")
            return False
        except Exception as e:
            self.log(f"Error installing dependencies: {e}")
            return False
    
    def start_application(self):
        """Start the MERN application"""
        if not self.check_requirements():
            error_msg = "Node.js or npm not found!\n\n"
            if self.is_windows:
                error_msg += "Please install Node.js from https://nodejs.org\n"
                error_msg += "Or install nvm-windows from https://github.com/coreybutler/nvm-windows"
            else:
                error_msg += "Please install Node.js:\n"
                error_msg += "- Ubuntu: sudo apt install nodejs npm\n"
                error_msg += "- Or use nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
            
            if GUI_AVAILABLE and self.root:
                messagebox.showerror("Requirements Missing", error_msg)
            else:
                print(f"ERROR: {error_msg}")
            return False
        
        # Install dependencies if needed
        if not self.install_dependencies():
            error_msg = "Failed to install dependencies. Please check your internet connection."
            if GUI_AVAILABLE and self.root:
                messagebox.showerror("Installation Failed", error_msg)
            else:
                print(f"ERROR: {error_msg}")
            return False
        
        try:
            self.log("Starting Factory Management Application...")
            
            # Use the appropriate script based on platform
            if self.is_windows:
                # On Windows, use cmd to run npm scripts
                cmd = ['cmd', '/c', 'npm', 'run', 'dev']
            else:
                # On Linux, run npm directly
                cmd = [self.npm_cmd, 'run', 'dev']
            
            # Start the application
            process = subprocess.Popen(
                cmd,
                cwd=self.app_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,  # Redirect stderr to stdout
                text=True,
                bufsize=1,
                universal_newlines=True,
                encoding='utf-8',  # Force UTF-8 encoding
                errors='replace'   # Replace encoding errors
            )
            
            self.processes.append(process)
            self.log("Application starting...")
            
            # Start a thread to monitor the process
            monitor_thread = threading.Thread(target=self.monitor_process, args=(process,))
            monitor_thread.daemon = True
            monitor_thread.start()
            
            # Wait a bit then try to open browser
            threading.Timer(5.0, self.open_browser).start()
            
            return True
            
        except Exception as e:
            self.log(f"Error starting application: {e}")
            return False
    
    def monitor_process(self, process):
        """Monitor process output"""
        try:
            for line in iter(process.stdout.readline, ''):
                if line:
                    # Handle encoding issues on Windows
                    try:
                        clean_line = line.strip()
                        # Remove ANSI color codes for Windows compatibility
                        import re
                        clean_line = re.sub(r'\x1b\[[0-9;]*m', '', clean_line)
                        self.log(f"APP: {clean_line}")
                    except UnicodeDecodeError:
                        self.log(f"APP: [Binary output - encoding issue]")
                if process.poll() is not None:
                    break
        except Exception as e:
            self.log(f"Error monitoring process: {e}")
    
    def stop_application(self):
        """Stop all running processes"""
        self.log("Stopping application...")
        
        for process in self.processes:
            try:
                if self.is_windows:
                    # On Windows, use taskkill to stop the process tree
                    subprocess.run(['taskkill', '/F', '/T', '/PID', str(process.pid)], 
                                 capture_output=True)
                else:
                    # On Linux, terminate the process
                    process.terminate()
                    process.wait(timeout=5)
            except Exception as e:
                self.log(f"Error stopping process: {e}")
                try:
                    if self.is_windows:
                        subprocess.run(['taskkill', '/F', '/PID', str(process.pid)], 
                                     capture_output=True)
                    else:
                        process.kill()
                except:
                    pass
        
        self.processes.clear()
        self.log("Application stopped")
    
    def open_browser(self):
        """Open the application in the default browser"""
        try:
            url = "http://localhost:5173"
            webbrowser.open(url)
            self.log(f"Opened browser: {url}")
        except Exception as e:
            self.log(f"Could not open browser: {e}")
    
    def create_gui(self):
        """Create the GUI interface"""
        if not GUI_AVAILABLE:
            self.log("GUI not available. Running in CLI mode...")
            return self.run_cli()
        
        self.root = tk.Tk()
        self.root.title("Factory Management App Launcher")
        self.root.geometry("600x500")
        
        # Set icon based on platform
        try:
            if self.is_windows:
                # On Windows, you might want to add an .ico file
                pass
            else:
                # On Linux, try to set window properties
                self.root.wm_attributes('-type', 'normal')
        except:
            pass
        
        # Main frame
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Title
        title_label = ttk.Label(main_frame, text="Factory Management App", 
                               font=('Arial', 16, 'bold'))
        title_label.grid(row=0, column=0, columnspan=3, pady=(0, 20))
        
        # Platform info
        platform_info = f"Platform: {platform.system()} {platform.release()}"
        platform_label = ttk.Label(main_frame, text=platform_info)
        platform_label.grid(row=1, column=0, columnspan=3, pady=(0, 10))
        
        # Buttons frame
        buttons_frame = ttk.Frame(main_frame)
        buttons_frame.grid(row=2, column=0, columnspan=3, pady=(0, 20), sticky=(tk.W, tk.E))
        
        # Start button
        self.start_btn = ttk.Button(buttons_frame, text="Start Application", 
                                   command=self.on_start)
        self.start_btn.grid(row=0, column=0, padx=(0, 10))
        
        # Stop button
        self.stop_btn = ttk.Button(buttons_frame, text="Stop Application", 
                                  command=self.on_stop, state='disabled')
        self.stop_btn.grid(row=0, column=1, padx=(0, 10))
        
        # Open browser button
        self.browser_btn = ttk.Button(buttons_frame, text="Open Browser", 
                                     command=self.open_browser)
        self.browser_btn.grid(row=0, column=2)
        
        # Log area
        log_label = ttk.Label(main_frame, text="Application Log:")
        log_label.grid(row=3, column=0, sticky=tk.W, pady=(20, 5))
        
        # Log text area with scrollbar
        log_frame = ttk.Frame(main_frame)
        log_frame.grid(row=4, column=0, columnspan=3, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(0, 10))
        
        self.log_text = scrolledtext.ScrolledText(log_frame, height=15, width=70)
        self.log_text.pack(fill=tk.BOTH, expand=True)
        
        # Status bar
        self.status_var = tk.StringVar()
        self.status_var.set("Ready")
        status_bar = ttk.Label(main_frame, textvariable=self.status_var, 
                              relief=tk.SUNKEN, anchor=tk.W)
        status_bar.grid(row=5, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(10, 0))
        
        # Configure grid weights
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(0, weight=1)
        main_frame.rowconfigure(4, weight=1)
        
        # Handle window close
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
        
        self.log(f"Factory Management App Launcher started on {platform.system()}")
        
        return self.root
    
    def on_start(self):
        """Handle start button click"""
        self.start_btn.config(state='disabled')
        self.status_var.set("Starting application...")
        
        def start_thread():
            success = self.start_application()
            if success:
                self.stop_btn.config(state='normal')
                self.status_var.set("Application running")
            else:
                self.start_btn.config(state='normal')
                self.status_var.set("Failed to start")
        
        threading.Thread(target=start_thread, daemon=True).start()
    
    def on_stop(self):
        """Handle stop button click"""
        self.stop_btn.config(state='disabled')
        self.status_var.set("Stopping application...")
        
        def stop_thread():
            self.stop_application()
            self.start_btn.config(state='normal')
            self.status_var.set("Application stopped")
        
        threading.Thread(target=stop_thread, daemon=True).start()
    
    def on_closing(self):
        """Handle window closing"""
        if self.processes:
            if messagebox.askokcancel("Quit", "Application is running. Stop it and quit?"):
                self.stop_application()
                self.root.destroy()
        else:
            self.root.destroy()
    
    def run_cli(self):
        """Run in command line mode"""
        print("Factory Management App Launcher (CLI Mode)")
        print(f"Platform: {platform.system()} {platform.release()}")
        print("=" * 50)
        
        try:
            if not self.check_requirements():
                print("ERROR: Node.js or npm not found!")
                if self.is_windows:
                    print("Please install Node.js from https://nodejs.org")
                else:
                    print("Please install Node.js: sudo apt install nodejs npm")
                return False
            
            if not self.install_dependencies():
                print("ERROR: Failed to install dependencies")
                return False
            
            print("Starting application... (Press Ctrl+C to stop)")
            success = self.start_application()
            
            if success:
                # Keep the main thread alive
                try:
                    while self.processes:
                        time.sleep(1)
                        # Check if any process has ended
                        for process in self.processes[:]:
                            if process.poll() is not None:
                                self.processes.remove(process)
                except KeyboardInterrupt:
                    print("\nStopping application...")
                    self.stop_application()
            
            return success
            
        except Exception as e:
            print(f"Error: {e}")
            return False

def main():
    """Main entry point"""
    launcher = CrossPlatformLauncher()
    
    # Check command line arguments
    if len(sys.argv) > 1 and sys.argv[1] == '--cli':
        return launcher.run_cli()
    
    # Try GUI mode
    if GUI_AVAILABLE:
        root = launcher.create_gui()
        if root:
            root.mainloop()
            return True
    
    # Fallback to CLI mode
    print("GUI not available, running in CLI mode...")
    return launcher.run_cli()

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\nInterrupted by user")
        sys.exit(0)
    except Exception as e:
        print(f"Fatal error: {e}")
        sys.exit(1)
