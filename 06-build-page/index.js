const fs = require('fs').promises;
const path = require('path');

async function buildPage() {
  const projectDistPath = '06-build-page/project-dist';
  const templateFilePath = '06-build-page/template.html';
  const componentsFolderPath = '06-build-page/components';
  const stylesFolderPath = '06-build-page/styles';
  const assetsFolderPath = '06-build-page/assets';
  try {

    await fs.mkdir(projectDistPath, { recursive: true });

    const templateContent = await fs.readFile(templateFilePath, 'utf-8');

    const tagNames = templateContent.match(/{{\s*([^}\s]+)\s*}}/g);

    if (!tagNames) {
      throw new Error('No template tags found in the template.html file.');
    }

    let modifiedTemplate = templateContent;
    for (const tagName of tagNames) {
      const componentName = tagName.match(/{{\s*([^}\s]+)\s*}}/)[1];
      const componentFilePath = path.join(componentsFolderPath, `${componentName}.html`);

      const componentContent = await fs.readFile(componentFilePath, 'utf-8');

      modifiedTemplate = modifiedTemplate.replace(tagName, componentContent);
    }

    await fs.writeFile(path.join(projectDistPath, 'index.html'), modifiedTemplate, 'utf-8');

    await mergeStyles(stylesFolderPath, projectDistPath);

    await copyDir(assetsFolderPath, path.join(projectDistPath, 'assets'));

    console.log('Page successfully built!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

async function mergeStyles(stylesFolderPath, outputFolderPath) {
  const files = await fs.readdir(stylesFolderPath);

  const cssFiles = files.filter(file => path.extname(file) === '.css');

  const cssContents = await Promise.all(
    cssFiles.map(file => fs.readFile(path.join(stylesFolderPath, file), 'utf-8'))
  );

  const bundleContent = cssContents.join('\n');

  await fs.writeFile(path.join(outputFolderPath, 'style.css'), bundleContent, 'utf-8');
}

async function copyDir(srcDir, destDir) {
  const files = await fs.readdir(srcDir);

  await fs.mkdir(destDir, { recursive: true });

  await Promise.all(
    files.map(async file => {
      const srcPath = path.join(srcDir, file);
      const destPath = path.join(destDir, file);
      const fileStats = await fs.stat(srcPath);

      if (fileStats.isFile()) {
        await fs.copyFile(srcPath, destPath);
      } else if (fileStats.isDirectory()) {
        await copyDir(srcPath, destPath);
      }
    })
  );
}
buildPage();
