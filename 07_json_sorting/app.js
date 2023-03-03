const https = require('https');
const getUrl = id => `https://jsonbase.com/sls-team/json-${id}`;

const ids = [793, 955, 231, 931, 93, 342, 770, 491, 281, 718, 310, 806, 469, 258, 516, 79, 706, 521, 350, 64];

const endpoints = ids.map(id => getUrl(id));
const httpGet = url => new Promise((resolve, reject) => {
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
const getIsDone = (data) => {
    if (data.isDone !== undefined) {
        return data.isDone;
    }
    if (Array.isArray(data)) {
        for (const item of data) {
            if (typeof item === 'object') {
                const res = getIsDone(item);
                if (res !== undefined) {
                    return res
                }
            }
        }
        return;
    }
    for (const key in data) {
        if (typeof data[key] === 'object') {
            const res = getIsDone(data[key]);
            if (res !== undefined) {
                return res
            }
        }
    }
};
const handleEndpoint = async (endpoint, retries = 0) => {
    try {
        const data = await httpGet(endpoint)
        const isDone = getIsDone(data)

        return {isDone, endpoint};
    } catch (err) {
        if (retries > 0) {
            return handleEndpoint(endpoint, retries - 1)
        }
        return {
            err: `[Fail] ${endpoint}: The endpoint is unavailable`,
        }
    }
};

let isDoneCounter = 0;
let isNotDoneCounter = 0;
(async () => {
    for await (const {isDone, endpoint, err} of endpoints.map(endpoint => handleEndpoint(endpoint, 3))) {
        if (err) {
            console.log(err);
            continue;
        }
        if (isDone) {
            isDoneCounter++;
        } else {
            isNotDoneCounter++;
        }
        console.log(`[Success] ${endpoint}: isDone - ${isDone ? 'True' : 'False'}`);
    }

    console.log(`Found True values: ${isDoneCounter}`);
    console.log(`Found False values: ${isNotDoneCounter}`);
})();
