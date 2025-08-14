#!/usr/bin/env python3
"""
Factory Management App Launcher
Cross-platform GUI launcher for the MERN application
"""

import os
import sys
import subprocess
import threading
import time
import webbrowser
import json
from pathlib import Path

try:
    import tkinter as tk
    from tkinter import ttk, messagebox, scrolledtext
    GUI_AVAILABLE = True
except ImportError:
    GUI_AVAILABLE = False

class AppLauncher:
    def __init__(self):
        self.app_dir = Path(__file__).parent
        self.processes = []
        self.root = None
        self.log_text = None
        
    def check_requirements(self):
        """Check if Node.js and npm are installed"""
        # First, try to load nvm environment
        self.setup_node_environment()
        
        try:
            subprocess.run(['node', '--version'], capture_output=True, check=True)
            subprocess.run(['npm', '--version'], capture_output=True, check=True)
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            return False
    
    def setup_node_environment(self):
        """Setup Node.js environment (nvm support)"""
        import os
        
        # Add nvm paths to environment
        nvm_dir = os.path.expanduser("~/.nvm")
        if os.path.exists(nvm_dir):
            # Find the current node version
            node_version_dir = os.path.join(nvm_dir, "versions", "node")
            if os.path.exists(node_version_dir):
                versions = os.listdir(node_version_dir)
                if versions:
                    # Use the latest version (or you could parse from .nvmrc)
                    latest_version = sorted(versions)[-1]
                    node_bin_path = os.path.join(node_version_dir, latest_version, "bin")
                    
                    # Add to PATH
                    current_path = os.environ.get('PATH', '')
                    if node_bin_path not in current_path:
                        os.environ['PATH'] = f"{node_bin_path}:{current_path}"
                        self.log(f"Added nvm node path to PATH: {node_bin_path}")
        
        # Also try to source bash profile
        try:
            bashrc_path = os.path.expanduser("~/.bashrc")
            if os.path.exists(bashrc_path):
                # This is a simplified approach - in a real implementation
                # you'd need to parse the bashrc file for PATH modifications
                pass
        except Exception as e:
            self.log(f"Could not source bashrc: {e}")
    
    def install_dependencies(self):
        """Install all dependencies"""
        self.log("Installing dependencies...")
        
        try:
            # Install root dependencies
            if not (self.app_dir / 'node_modules').exists():
                self.log("Installing root dependencies...")
                subprocess.run(['npm', 'install'], cwd=self.app_dir, check=True)
            
            # Install client dependencies
            if not (self.app_dir / 'client' / 'node_modules').exists():
                self.log("Installing client dependencies...")
                subprocess.run(['npm', 'install'], cwd=self.app_dir / 'client', check=True)
            
            # Install server dependencies
            if not (self.app_dir / 'server' / 'node_modules').exists():
                self.log("Installing server dependencies...")
                subprocess.run(['npm', 'install'], cwd=self.app_dir / 'server', check=True)
            
            self.log("Dependencies installed successfully!")
            return True
        except subprocess.CalledProcessError as e:
            self.log(f"Error installing dependencies: {e}")
            return False
    
    def start_application(self):
        """Start the MERN application"""
        try:
            self.log("Starting Factory Management Application...")
            self.log("Frontend will be available at: http://localhost:5173")
            self.log("Backend will be available at: http://localhost:3000")
            
            # Start the application using npm run dev
            process = subprocess.Popen(
                ['npm', 'run', 'dev'],
                cwd=self.app_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                universal_newlines=True,
                bufsize=1
            )
            
            self.processes.append(process)
            
            # Start a thread to read output
            if self.log_text:
                thread = threading.Thread(target=self.read_output, args=(process,))
                thread.daemon = True
                thread.start()
            
            # Wait a bit and then open browser
            threading.Timer(5.0, self.open_browser).start()
            
            return process
            
        except Exception as e:
            self.log(f"Error starting application: {e}")
            return None
    
    def read_output(self, process):
        """Read and display process output"""
        for line in iter(process.stdout.readline, ''):
            if line:
                self.log(line.strip())
    
    def open_browser(self):
        """Open the application in default browser"""
        try:
            webbrowser.open('http://localhost:5173')
            self.log("Opened application in browser")
        except Exception as e:
            self.log(f"Could not open browser automatically: {e}")
    
    def log(self, message):
        """Log message to console and GUI if available"""
        print(message)
        if self.log_text:
            self.log_text.insert(tk.END, f"{message}\n")
            self.log_text.see(tk.END)
            if self.root:
                self.root.update()
    
    def stop_application(self):
        """Stop all running processes"""
        self.log("Stopping application...")
        for process in self.processes:
            try:
                process.terminate()
                process.wait(timeout=5)
            except:
                try:
                    process.kill()
                except:
                    pass
        self.processes.clear()
        self.log("Application stopped")
    
    def create_gui(self):
        """Create the GUI launcher"""
        if not GUI_AVAILABLE:
            self.log("GUI not available, running in command line mode")
            return self.run_cli()
        
        self.root = tk.Tk()
        self.root.title("Factory Management App Launcher")
        self.root.geometry("800x600")
        
        # Main frame
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Title
        title_label = ttk.Label(main_frame, text="Factory Management Application", 
                               font=("Arial", 16, "bold"))
        title_label.grid(row=0, column=0, columnspan=2, pady=(0, 20))
        
        # Status
        self.status_var = tk.StringVar(value="Ready to start")
        status_label = ttk.Label(main_frame, textvariable=self.status_var)
        status_label.grid(row=1, column=0, columnspan=2, pady=(0, 10))
        
        # Buttons frame
        buttons_frame = ttk.Frame(main_frame)
        buttons_frame.grid(row=2, column=0, columnspan=2, pady=(0, 20))
        
        self.start_button = ttk.Button(buttons_frame, text="Start Application", 
                                      command=self.on_start_click)
        self.start_button.pack(side=tk.LEFT, padx=(0, 10))
        
        self.stop_button = ttk.Button(buttons_frame, text="Stop Application", 
                                     command=self.on_stop_click, state=tk.DISABLED)
        self.stop_button.pack(side=tk.LEFT, padx=(0, 10))
        
        self.browser_button = ttk.Button(buttons_frame, text="Open in Browser", 
                                        command=self.open_browser)
        self.browser_button.pack(side=tk.LEFT)
        
        # Log area
        log_label = ttk.Label(main_frame, text="Application Log:")
        log_label.grid(row=3, column=0, sticky=tk.W, pady=(0, 5))
        
        self.log_text = scrolledtext.ScrolledText(main_frame, height=20, width=80)
        self.log_text.grid(row=4, column=0, columnspan=2, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Configure grid weights
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(0, weight=1)
        main_frame.rowconfigure(4, weight=1)
        
        # Handle window close
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
        
        self.log("Factory Management App Launcher Ready")
        self.log("Click 'Start Application' to begin")
        
        return self.root
    
    def on_start_click(self):
        """Handle start button click"""
        self.start_button.config(state=tk.DISABLED)
        self.status_var.set("Starting application...")
        
        def start_thread():
            if not self.check_requirements():
                self.log("Error: Node.js or npm not found!")
                self.log("Please install Node.js from https://nodejs.org/")
                self.status_var.set("Error: Missing requirements")
                self.start_button.config(state=tk.NORMAL)
                return
            
            if self.install_dependencies():
                process = self.start_application()
                if process:
                    self.status_var.set("Application running")
                    self.stop_button.config(state=tk.NORMAL)
                else:
                    self.status_var.set("Failed to start")
                    self.start_button.config(state=tk.NORMAL)
            else:
                self.status_var.set("Failed to install dependencies")
                self.start_button.config(state=tk.NORMAL)
        
        threading.Thread(target=start_thread, daemon=True).start()
    
    def on_stop_click(self):
        """Handle stop button click"""
        self.stop_application()
        self.start_button.config(state=tk.NORMAL)
        self.stop_button.config(state=tk.DISABLED)
        self.status_var.set("Application stopped")
    
    def on_closing(self):
        """Handle window closing"""
        if self.processes:
            if messagebox.askokcancel("Quit", "Application is running. Stop and quit?"):
                self.stop_application()
                self.root.destroy()
        else:
            self.root.destroy()
    
    def run_cli(self):
        """Run in command line mode"""
        print("Factory Management App Launcher (CLI Mode)")
        print("=" * 50)
        
        if not self.check_requirements():
            print("Error: Node.js or npm not found!")
            print("Please install Node.js from https://nodejs.org/")
            return False
        
        if not self.install_dependencies():
            print("Failed to install dependencies")
            return False
        
        print("Starting application...")
        try:
            process = self.start_application()
            if process:
                print("Application started successfully!")
                print("Press Ctrl+C to stop")
                process.wait()
            else:
                print("Failed to start application")
                return False
        except KeyboardInterrupt:
            print("\nStopping application...")
            self.stop_application()
        
        return True

def main():
    launcher = AppLauncher()
    
    if len(sys.argv) > 1 and sys.argv[1] == '--cli':
        return launcher.run_cli()
    
    if GUI_AVAILABLE:
        root = launcher.create_gui()
        root.mainloop()
    else:
        return launcher.run_cli()

if __name__ == "__main__":
    main()
