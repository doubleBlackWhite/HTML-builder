const fs = require('fs').promises;
const path = require('path');

async function displayFileInfo() {
  const folderPath = '03-files-in-folder/secret-folder';

  try {
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const fileExtension = path.extname(file.name).slice(1);

        const fileStats = await fs.stat(path.join(folderPath, file.name));
        console.log(`${file.name}-${fileExtension}-${fileStats.size} bytes`);
      } else {
        console.error(`Error: ${file.name} is a directory, not a file.`);
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// Execute the function
displayFileInfo();
