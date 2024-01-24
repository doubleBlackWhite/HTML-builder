const fs = require('fs').promises;
const path = require('path');

async function copyDir(srcDir, destDir) {
  try {
    await fs.mkdir(destDir, { recursive: true });

    const files = await fs.readdir(destDir);

    for (const file of files) {
      const srcFilePath = path.join(srcDir, file);
      const destFilePath = path.join(destDir, file);

      try {
        await fs.access(srcFilePath);
      } catch (error) {
        await fs.unlink(destFilePath);
      }
    }

    const srcFiles = await fs.readdir(srcDir);

    for (const file of srcFiles) {
      const srcFilePath = path.join(srcDir, file);
      const destFilePath = path.join(destDir, file);

      const stats = await fs.stat(srcFilePath);

      if (stats.isDirectory()) {
        await copyDir(srcFilePath, destFilePath);
      } else {
        await fs.copyFile(srcFilePath, destFilePath);
      }
    }

    console.log('Directory successfully copied!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

copyDir('04-copy-directory/files', '04-copy-directory/files-copy');
