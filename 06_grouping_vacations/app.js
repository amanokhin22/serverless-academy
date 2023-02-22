const https = require('https');
const fs = require('fs');

const URL = "https://jsonbase.com/sls-team/vacations";
function main() {
    https.get(URL, (res) => {
        let data = '';

        res.on("data", (chunk) => {
            data += chunk;
        });
        res.on("end", () => {

            const vacations = JSON.parse(data);
            const users = {};

            vacations.forEach(vacation => {
                const userId = vacation.user._id;
                const userName = vacation.user.name;
                const startDate = vacation.startDate;
                const endDate = vacation.endDate;
                if (!users[userId]) {
                    users[userId] = {
                        userId: userId,
                        userName: userName,
                        vacations: []
                    }
                }
                users[userId].vacations.push({startDate, endDate})
            })
            fs.writeFileSync("user-vacation.json", JSON.stringify(Object.values(users)));
        });
        console.log(`Look in to this file and find information: \n${__dirname}/user-vacation.json`)
    }).on("error", (error) => {
        console.error(error.message);
    });
}

main();
