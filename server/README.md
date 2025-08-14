1. Download MongoDB Database Tools
	Go to: https://www.mongodb.com/try/download/database-tools
	Download the version for your OS (Windows).
	Extract the ZIP file to a folder, for example:
	C:\mongodb-tools\bin
2. Add to System PATH
	Open Start Menu → search for Environment Variables → Edit the system environment variables.
	Click Environment Variables.
	Under System variables, select Path and click Edit.
	Click New and add the path to your tools, e.g.:
	C:\mongodb-tools\bin
	Click OK to save.
3. Restart Your Terminal/PC
	Close all command prompts and restart them (or restart your PC).
4. Test
	Open a new command prompt and run:
		mongodump --version
	You should see the version info.
	If you do, your backup download feature will now work!



Restore database Using mongorestore
Open a terminal (Command Prompt or PowerShell), and run:

mongorestore --uri="mongodb://localhost:27017/factory" --gzip --archive="C:\Users\PAK\Downloads\logix-backup.gz"













Correct—electron-builder does not automatically install node_modules for your backend (server) when you install your packaged Electron app.
This is a common issue for Electron apps that spawn a Node.js backend.

Why?
By default, only your source files are copied (not node_modules).
The user’s machine does not run npm install in the server folder after install.
How to Fix
Option 1: Bundle Backend with All Dependencies (Recommended for Desktop Apps)
Use pkg or nexe to create a single executable for your backend.

Steps:

Install pkg:
	npm install -g pkg

In your server folder, run:
	pkg src/index.js --targets node18-win-x64 --output server.exe

In your Electron build config, include server.exe instead of the whole server folder.

In production, spawn server.exe instead of node index.js.

Option 2: Copy node_modules with Your Build (Not recommended for large apps)
Add this to your package.json build config:
	{
		"from": "server/node_modules",
		"to": "server/node_modules",
		"filter": ["**/*"]
	}

This will make your installer much larger, but your backend will work.


How to use it in Electron?
Build server.exe using a tool like pkg.
In your Electron main.js, spawn server.exe (not node index.js) in production:

	// In production
	const serverPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'server', 'server.exe');
	serverProcess = spawn(serverPath, {
	stdio: 'inherit',
	shell: true,
	env: {
		...process.env,
		NODE_ENV: 'production',
	},
	});
