const getData = require('./files');
async function main() {
    console.time('run');

    const data = await getData();
    const entries = getEntries(data);

    console.time('uniqueValues');
    uniqueValues(data.flat());
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
