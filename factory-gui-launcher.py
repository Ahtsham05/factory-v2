#!/usr/bin/env python3
"""
Factory Management App - Simple GUI Launcher
A user-friendly Python launcher for the MERN stack application
"""

import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext
import subprocess
import threading
import os
import time
import signal
import sys

class FactoryAppLauncher:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Factory Management App Launcher")
        self.root.geometry("500x400")
        self.root.resizable(True, True)
        
        # Application state
        self.process = None
        self.is_running = False
        
        # Setup Node.js environment
        self.setup_node_environment()
        
        # Create GUI
        self.create_widgets()
        
        # Handle window close
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
    
    def setup_node_environment(self):
        """Setup Node.js environment with nvm"""
        try:
            # Source environment setup script
            setup_script = os.path.join(os.getcwd(), "setup-env.sh")
            if os.path.exists(setup_script):
                result = subprocess.run(
                    ["bash", "-c", f"source {setup_script} && echo $PATH && which node && which npm"],
                    capture_output=True, text=True, cwd=os.getcwd()
                )
                if result.returncode == 0:
                    lines = result.stdout.strip().split('\n')
                    if len(lines) >= 3:
                        os.environ['PATH'] = lines[0]
                        self.node_path = lines[1]
                        self.npm_path = lines[2]
                        return
            
            # Fallback: Try to find nvm and Node.js manually
            home_dir = os.path.expanduser("~")
            nvm_dir = os.path.join(home_dir, ".nvm")
            
            # Check if nvm exists
            if os.path.exists(nvm_dir):
                # Find the latest Node.js version
                versions_dir = os.path.join(nvm_dir, "versions", "node")
                if os.path.exists(versions_dir):
                    versions = [d for d in os.listdir(versions_dir) if os.path.isdir(os.path.join(versions_dir, d))]
                    if versions:
                        # Use the latest version
                        latest_version = sorted(versions)[-1]
                        node_bin_dir = os.path.join(versions_dir, latest_version, "bin")
                        
                        # Update PATH
                        current_path = os.environ.get('PATH', '')
                        if node_bin_dir not in current_path:
                            os.environ['PATH'] = f"{node_bin_dir}:{current_path}"
                        
                        self.node_path = os.path.join(node_bin_dir, "node")
                        self.npm_path = os.path.join(node_bin_dir, "npm")
                        return
            
            # Final fallback: use system Node.js
            self.node_path = "node"
            self.npm_path = "npm"
            
        except Exception as e:
            print(f"Error setting up Node.js environment: {e}")
            self.node_path = "node"
            self.npm_path = "npm"
    
    def create_widgets(self):
        """Create the GUI widgets"""
        # Main frame
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Configure grid weights
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(1, weight=1)
        main_frame.rowconfigure(3, weight=1)
        
        # Title
        title_label = ttk.Label(main_frame, text="Factory Management App", 
                               font=("Arial", 16, "bold"))
        title_label.grid(row=0, column=0, columnspan=2, pady=(0, 20))
        
        # Status
        ttk.Label(main_frame, text="Status:").grid(row=1, column=0, sticky=tk.W)
        self.status_label = ttk.Label(main_frame, text="Stopped", foreground="red")
        self.status_label.grid(row=1, column=1, sticky=tk.W)
        
        # Buttons frame
        buttons_frame = ttk.Frame(main_frame)
        buttons_frame.grid(row=2, column=0, columnspan=2, pady=(10, 10), sticky=(tk.W, tk.E))
        buttons_frame.columnconfigure(0, weight=1)
        buttons_frame.columnconfigure(1, weight=1)
        buttons_frame.columnconfigure(2, weight=1)
        
        self.start_button = ttk.Button(buttons_frame, text="Start App", command=self.start_app)
        self.start_button.grid(row=0, column=0, padx=(0, 5), sticky=(tk.W, tk.E))
        
        self.stop_button = ttk.Button(buttons_frame, text="Stop App", command=self.stop_app, state="disabled")
        self.stop_button.grid(row=0, column=1, padx=5, sticky=(tk.W, tk.E))
        
        self.open_button = ttk.Button(buttons_frame, text="Open in Browser", command=self.open_browser, state="disabled")
        self.open_button.grid(row=0, column=2, padx=(5, 0), sticky=(tk.W, tk.E))
        
        # Log area
        ttk.Label(main_frame, text="Application Output:").grid(row=3, column=0, columnspan=2, sticky=tk.W, pady=(10, 5))
        
        self.log_text = scrolledtext.ScrolledText(main_frame, height=15, width=60)
        self.log_text.grid(row=4, column=0, columnspan=2, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(0, 10))
        
        # Clear log button
        ttk.Button(main_frame, text="Clear Log", command=self.clear_log).grid(row=5, column=0, columnspan=2)
    
    def log_message(self, message):
        """Add a message to the log"""
        self.log_text.insert(tk.END, f"{time.strftime('%H:%M:%S')} - {message}\n")
        self.log_text.see(tk.END)
        self.root.update_idletasks()
    
    def clear_log(self):
        """Clear the log"""
        self.log_text.delete(1.0, tk.END)
    
    def start_app(self):
        """Start the MERN application"""
        if self.is_running:
            messagebox.showwarning("Warning", "Application is already running!")
            return
        
        # Change to project directory
        project_dir = os.getcwd()
        
        # Check if package.json exists
        if not os.path.exists(os.path.join(project_dir, "package.json")):
            messagebox.showerror("Error", "package.json not found in current directory!")
            return
        
        self.log_message("Starting Factory Management App...")
        self.log_message(f"Project directory: {project_dir}")
        
        # Update UI
        self.start_button.config(state="disabled")
        self.stop_button.config(state="normal")
        self.status_label.config(text="Starting...", foreground="orange")
        
        # Start the application in a separate thread
        def run_app():
            try:
                # Run npm start with the correct environment
                self.process = subprocess.Popen(
                    [self.npm_path, "start"],
                    cwd=project_dir,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    universal_newlines=True,
                    bufsize=1
                )
                
                self.is_running = True
                self.root.after(0, lambda: self.status_label.config(text="Running", foreground="green"))
                self.root.after(5000, lambda: self.open_button.config(state="normal"))  # Enable browser button after 5 seconds
                
                # Read output
                for line in iter(self.process.stdout.readline, ''):
                    if line:
                        self.root.after(0, lambda msg=line.strip(): self.log_message(msg))
                    if not self.is_running:
                        break
                
                # Process finished
                self.process.wait()
                
            except Exception as e:
                self.root.after(0, lambda: self.log_message(f"Error: {str(e)}"))
            finally:
                if self.is_running:
                    self.root.after(0, self.app_stopped)
        
        # Start in thread
        threading.Thread(target=run_app, daemon=True).start()
    
    def stop_app(self):
        """Stop the MERN application"""
        if not self.is_running:
            return
        
        self.log_message("Stopping application...")
        self.is_running = False
        
        if self.process:
            try:
                # Try graceful shutdown first
                self.process.terminate()
                
                # Wait a bit for graceful shutdown
                try:
                    self.process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    # Force kill if it doesn't stop gracefully
                    self.process.kill()
                    self.process.wait()
                
            except Exception as e:
                self.log_message(f"Error stopping process: {e}")
        
        self.app_stopped()
    
    def app_stopped(self):
        """Update UI when app stops"""
        self.is_running = False
        self.process = None
        self.start_button.config(state="normal")
        self.stop_button.config(state="disabled")
        self.open_button.config(state="disabled")
        self.status_label.config(text="Stopped", foreground="red")
        self.log_message("Application stopped.")
    
    def open_browser(self):
        """Open the app in browser"""
        try:
            import webbrowser
            webbrowser.open("http://localhost:3000")
            self.log_message("Opened application in browser (http://localhost:3000)")
        except Exception as e:
            self.log_message(f"Error opening browser: {e}")
    
    def on_closing(self):
        """Handle window close event"""
        if self.is_running:
            if messagebox.askokcancel("Quit", "Application is still running. Stop it and quit?"):
                self.stop_app()
                self.root.after(1000, self.root.destroy)
        else:
            self.root.destroy()
    
    def run(self):
        """Start the GUI"""
        self.log_message("Factory Management App Launcher started")
        self.log_message(f"Node.js path: {self.node_path}")
        self.log_message(f"npm path: {self.npm_path}")
        self.log_message("Ready to launch application...")
        self.root.mainloop()

if __name__ == "__main__":
    # Check if CLI mode is requested
    if len(sys.argv) > 1 and sys.argv[1] == "--cli":
        print("Factory Management App Launcher - CLI Test Mode")
        launcher = FactoryAppLauncher()
        print("✅ Application started successfully!")
        print(f"Node.js path: {launcher.node_path}")
        print(f"npm path: {launcher.npm_path}")
    else:
        # Normal GUI mode
        launcher = FactoryAppLauncher()
        launcher.run()
