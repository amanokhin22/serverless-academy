const https = require("https");
const getDataObject = url => new Promise((resolve, reject) => {
    https.get(url, (res) => {
        let data = '';
        res.on("data", (chunk) => {
            data += chunk
        });
        res.on("end", () => {
            const result = JSON.parse(data)
            resolve(result)
        });
    }).on("error", (error) => {
        reject(error.message)
    });
})

module.exports = getDataObject;