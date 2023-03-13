const TelegramWeatherApi = require("node-telegram-bot-api");
const getForecast = require('./api/forecast');
const farToCelsius = require('./utils/farToCelsius');
const TOKEN = process.env.TELEGRAM_TOKEN;

const CITY_NAME = 'Kharkiv';
const bot = new TelegramWeatherApi(TOKEN, {polling: true});

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
                        {text: 'WIND'},
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
bot.on('message', async (msg) => {
    let data = `Weather in ${CITY_NAME}` + '\n';
    const wind = await getForecast()
    if (msg.text === 'WIND')
    {
        wind.find(report => {
            data += `
Wind speed: ${report.wind.speed} m/s`
        })
        bot.sendMessage(msg.chat.id, data);
    }
})
