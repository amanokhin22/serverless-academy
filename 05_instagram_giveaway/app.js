const fs = require('fs').promises;
const main = async () => {
    console.time('run');

    const data = await getData();
    const entries = getEntries(data);

    console.time('uniqueValues');
    uniqueValues(data.flat(1));
    console.timeEnd("uniqueValues");

    console.time('existInAllFiles');
    existInAllFiles(entries);
    console.timeEnd("existInAllFiles");

    console.time("existInAtLeastTen");
    existInAtLeastTen(entries);
    console.timeEnd("existInAtLeastTen");

    console.timeEnd("run");
}

main();

async function getData()  {
    const files = await fs.readdir(`${__dirname}/files`);
    const readers = [];
    files.forEach(fileName => {
        readers.push(fs.readFile(`${__dirname}/files/${fileName}`, 'utf-8'))
    })
    const rawData = await Promise.all(readers);
    const result = [];
    rawData.forEach(rawDataArray => {
        result.push(rawDataArray.split('\n'))
    })
    return result;
}

const getEntries = (data) => {
    const entriesObject = {};
    data.forEach(array => {
        const dataset = new Set(array);
        dataset.forEach(key => {
            if (!entriesObject[key]) {
                entriesObject[key] = 0;
            }
            entriesObject[key]++;
        })
    })
    return Object.values(entriesObject);
}

const uniqueValues = (data) => {
    console.log('uniqueValues', new Set(data).size);
}

const existInAllFiles = (entries) => {
    const result = entries.filter(value => value === 20).length
    console.log('existInAllFiles', result);
}

const existInAtLeastTen = (entries) => {
    const result = entries.filter(value => value >= 10).length
    console.log('existInAtLeastTen', result);
}
