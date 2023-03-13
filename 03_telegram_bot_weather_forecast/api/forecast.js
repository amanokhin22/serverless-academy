const axios = require("axios");

const WEATHER_APP_ID = process.env.WEATHER_API_TOKEN;
async function getForecast(interval) {
    const res = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?id=${706483}&appid=${WEATHER_APP_ID}`);
    const list = res.data.list;
    const forecast = [];
    if (interval === 3) {
        list.forEach(item => {
            forecast.push(item);
        })
    }
    list.forEach((item, index) => {
        if (index % 2 === 0) {
            forecast.push(item);
        }
    })
    return forecast.slice(0, 10);
}

module.exports = getForecast;
