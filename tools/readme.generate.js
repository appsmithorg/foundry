const fs = require('fs');
const path = require('path');
const jsDocLite = require('../dist/jsDocLite.umd.js'); // Adjust the path as necessary

const librariesPath = './libraries';
const jsDeliverPrefix = 'https://cdn.jsdelivr.net/gh/appsmithorg/forge@main/dist/';

fs.readdirSync(librariesPath).forEach(lib => {
  const libPath = path.join(librariesPath, lib, 'index.js');
  if (fs.existsSync(libPath)) {
    const code = fs.readFileSync(libPath, 'utf-8');
    const parsedDocs = jsDocLite.parse(code);
    const readmeContent = generateReadmeContent(parsedDocs, lib);
    const readmePath = path.join(librariesPath, lib, 'README.md');
    fs.writeFileSync(readmePath, readmeContent);
    console.log("Writing " + readmePath);
  }
});

// @todo Replace with an actual template (using mustache?)
function generateReadmeContent(parsedDocs, lib) {
  let content = `# ${lib}\n\n`;

  // Description
  if (parsedDocs.description) {
    content += `${parsedDocs.description}\n\n`;
  }

  // Check for an image file and include it if it exists
  const imagePath = path.join(librariesPath, lib, 'image.png'); // Assuming the image is a PNG
  if (fs.existsSync(imagePath)) {
    content += `![${lib} image](image.png)\n\n`;
  }

  // Modules (if any)
  if (parsedDocs.modules && Object.keys(parsedDocs.modules).length > 0) {
    for (const [moduleName, module] of Object.entries(parsedDocs.modules)) {
      content += `${module.description}\n\n`;
    }
  }

  // Installation (assuming this is a JS library)
  content += `## Usage\n\n`;
  content += `You can use the JSDelivr CDN to import this custom library into Appsmith.\n`
  content += '```sh\n';
  content += `${jsDeliverPrefix}${lib}.umd.js\n`; // Replace with actual package name
  content += '```\n\n';

  // Methods
  if (parsedDocs.functions && Object.keys(parsedDocs.functions).length > 0) {
    content += `## Methods\n\n`;
    let methodContent = '';
    let headingTag = '';

    for (const [funcName, func] of Object.entries(parsedDocs.functions)) {
      let params = '';
      if (func.params && func.params.length > 0) {
        func.params.forEach(param => {
          params = params + param.name + ',';
        });
        params = params.slice(0, -1);
      }
      // Method list & links
      headingTag = lib + funcName + params.replace(/,/g, "");
      content += `- [${funcName}](#${headingTag.toLowerCase()}) \n`;
      // Method heading and section
      methodContent += '-----\n';
      methodContent += `### ${lib}.${funcName}(${params})\n\n`;
      methodContent += `${func.description}\n\n`;

      // Parameters
      if (func.params && func.params.length > 0) {
        methodContent += `- *parameters*\n`;
        func.params.forEach(param => {
          methodContent += `  - \`${param.name}\`: ${param.description} \n`;
        });
        methodContent += '\n';
      }

      // Returns
      if (func.returns && func.returns.length > 0) {
        methodContent += `- *returns*\n\n`;
        methodContent += `  - \`${func.returns[0].type}\`: ${func.returns[0].description}\n\n`;
      }

      // Examples
      if (func.examples && func.examples.length > 0) {
        methodContent += `- *examples*\n`;
        func.examples.forEach(example => {
          methodContent += '```js\n';
          methodContent += `${example}\n`;
          methodContent += '```\n';
        });
        methodContent += '\n';
      }

      // Async
      if (func.async) {
        methodContent += `- *async*\n\n`;
      }

      methodContent += `\n\n`;
    }

    content += methodContent;
  }

  // Constants
  if (parsedDocs.constants && Object.keys(parsedDocs.constants).length > 0) {
    content += `-----\n ## Constants\n\n`;

    for (const [constName, constant] of Object.entries(parsedDocs.constants)) {
      content += `### ${constName}\n\n`;
      content += `${constant.description}\n\n`;
    }
  }

  // Contributing
  content += `## Contributing\n\n`;
  content += 'Contributions are always welcome!\n\n';

  // License
  content += `## License\n\n`;
  content += `[MIT](https://choosealicense.com/licenses/mit/)\n`;

  return content;
}
