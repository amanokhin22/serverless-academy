const TelegramWeatherApi = require("node-telegram-bot-api");
const axios = require("axios");

const TOKEN = process.env.TELEGRAM_TOKEN;
const APP_ID = process.env.WEATHER_API_TOKEN;
const CITY_NAME = 'Kharkiv';

const bot = new TelegramWeatherApi(TOKEN, {polling: true});
async function getForecast(interval) {
    const res = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?id=${706483}&appid=${APP_ID}`);
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

bot.setMyCommands([
    {command: "/start", description: "Initial greeting"},
    {command: "/weather", description: "Press button and choose the weather forecast"},
])
bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === "/start") {
        await bot.sendSticker(chatId, `https://tenor.com/ru/view/how-are-you-gif-25758621`)
        await bot.sendMessage(chatId, `Greetings, my dear friend`);
    }
})

bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === "/weather" || text === "Back") {
        bot.sendMessage(chatId, 'Click the weather button below and find out the weather in Kharkiv',
            {
                reply_markup: {
                    resize_keyboard: true,
                    one_time_keyboard: false,
                    keyboard: [
                        [
                            {text: 'Weather'}
                        ]
                    ],
                }
            })
    }
})

bot.on('message', (msg) => {
    if (msg.text === `Weather`) {
        bot.sendMessage(msg.chat.id, 'Choose forecast time', {
            reply_markup: {
                resize_keyboard: true,
                one_time_keyboard: false,
                keyboard: [
                    [
                        {text: '3 hours'},
                        {text: '6 hours'}
                    ],
                    [
                        {text: "Back"}
                    ]
                ],
            },
        });
    }
});

bot.on('message', async (msg) => {
    let interval;
    if (msg.text === '3 hours') {
        interval = 3;
    }
    if (msg.text === '6 hours') {
        interval = 6;
    }
    if (interval) {
        const forecast = await getForecast(interval);
        let data = `Weather in ${CITY_NAME}` + '\n';

        forecast.forEach(report => {
            new Date(data += `
        ${report.dt_txt}: 
        Temp: ${farToCelsius(report.main.temp)}°C, Feels like: ${farToCelsius(report.main.feels_like)}°C, Weather: ${report.weather[0].main} \n`)
        })
        bot.sendMessage(msg.chat.id, data);
    }
});

function farToCelsius(farValue) {
    return (farValue - 273.15).toFixed(2);
}
