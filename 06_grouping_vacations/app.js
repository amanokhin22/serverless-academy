const https = require('https');
const fs = require('fs');
const groupVacationsByUsers = require('./mapper');

const URL = "https://jsonbase.com/sls-team/vacations";
function main() {
    https.get(URL, (res) => {
        let data = '';
        res.on("data", (chunk) => {
            data += chunk;
        });
        res.on("end", () => {
            const vacations = JSON.parse(data);
            const users = groupVacationsByUsers(vacations);
            fs.writeFileSync("user-vacation.json", JSON.stringify(Object.values(users)));
        });
        console.log(`Look in to this file and find information: \n${__dirname}/user-vacation.json`)
    }).on("error", (error) => {
        console.error(error.message);
    });
}

main();
