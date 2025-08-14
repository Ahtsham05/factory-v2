const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

router.get('/download', async (req, res) => {
  try {
    // Create a backup directory if it doesn't exist
    const backupDir = path.join(__dirname, '../../backup');
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

    // Backup file path
    const backupFile = path.join(backupDir, 'logix-backup.gz');

    // Run mongodump to create a gzip archive
    exec(`mongodump --uri="${process.env.MONGODB_URI || 'mongodb://localhost:27017/factory'}" --archive=${backupFile} --gzip`, (error) => {
      if (error) {
        return res.status(500).send('Backup failed: ' + error.message);
      }
      // Send the backup file as a download
      res.download(backupFile, 'mongodb-backup.gz', (err) => {
        if (err) res.status(500).send('Download failed');
        // Optionally, delete the backup file after sending
        // fs.unlinkSync(backupFile);
      });
    });
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

module.exports = router;