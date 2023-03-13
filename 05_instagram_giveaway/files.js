const fs = require('fs').promises;
async function getData() {
    const files = await fs.readdir(`${__dirname}/files`);
    const readers = [];
    files.forEach(fileName => {
        readers.push(fs.readFile(`${__dirname}/files/${fileName}`, 'utf-8'))
    })
    const filesContent = await Promise.all(readers);
    const result = [];
    filesContent.forEach(content => {
        result.push(content.split('\n'))
    })
    return result;
}

module.exports = getData;