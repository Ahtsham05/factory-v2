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