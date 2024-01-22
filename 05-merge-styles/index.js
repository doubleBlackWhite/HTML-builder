const fs = require('fs').promises;
const path = require('path');

async function mergeStyles() {
  const stylesFolderPath = '05-merge-styles/styles';
  const outputFolderPath = '05-merge-styles/project-dist';
  const outputFile = 'bundle.css';

  try {
    const files = await fs.readdir(stylesFolderPath);
    const cssFiles = files.filter((file) => path.extname(file).toLowerCase() === '.css');
    const stylesArray = [];
    for (const cssFile of cssFiles) {
      const filePath = path.join(stylesFolderPath, cssFile);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      stylesArray.push(fileContent);
    }
    const bundleContent = stylesArray.join('\n');

    await fs.mkdir(outputFolderPath, { recursive: true });

    await fs.writeFile(path.join(outputFolderPath, outputFile), bundleContent, 'utf-8');

    console.log('Styles successfully merged into bundle.css!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}
mergeStyles();
