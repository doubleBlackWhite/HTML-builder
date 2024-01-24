const fs = require('fs').promises;
const path = require('path');

async function displayFileInfo() {
  const folderPath = '03-files-in-folder/secret-folder';

  try {
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const fileName = path.basename(file.name, path.extname(file.name));
        const fileStats = await fs.stat(path.join(folderPath, file.name));
        console.log(`${fileName}-${fileStats.size} bytes`);
      } else {
        console.error(`Error: ${file.name} is a directory, not a file.`);
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

displayFileInfo();
