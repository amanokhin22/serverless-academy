const TelegramWeatherApi = require("node-telegram-bot-api");
const axios = require("axios");
const NodeCache = require("node-cache");
const myCache = new NodeCache({stdTTL: 300});

const TOKEN = process.env.TELEGRAM_TOKEN;
const WEATHER_APP_ID = process.env.WEATHER_API_TOKEN;
const CITY_NAME = 'Kharkiv';
const PRIVATBANK_API = process.env.PRIVATBANK_API;
const MONOBANK_API = process.env.MONOBANK_API;
// it`s could be monobank or privatbank
const CURRENCY_RATE_PROVIDER = "privatbank";

const RATES_CODES = {
    USD: 840,
    EUR: 978
}

const bot = new TelegramWeatherApi(TOKEN, {polling: true});

bot.setMyCommands([
    {command: "/start", description: "Initial greeting"},
    {command: "/information", description: "Press button and choose over what you need"},
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

    if (text === "/information" || text === "Back") {
        bot.sendMessage(chatId, 'Click the buttons below and find out the weather in Kharkiv or currency exchange',
            {
                reply_markup: {
                    resize_keyboard: true,
                    one_time_keyboard: false,
                    keyboard: [
                        [
                            {text: `Weather in ${CITY_NAME}`}
                        ],
                        [
                            {text: 'Currency exchange'}
                        ]
                    ],
                }
            })
    }
})
const getWeather = () => {
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

    bot.on('message', (msg) => {
        if (msg.text === `Weather in ${CITY_NAME}`) {
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
                data += `
        ${report.dt_txt}:
        Temp: ${farToCelsius(report.main.temp)}°C, Feels like: ${farToCelsius(report.main.feels_like)}°C, Weather: ${report.weather[0].main} \n`
            })
            bot.sendMessage(msg.chat.id, data);
        }
    });
    bot.on('message', async (msg) => {
        let data = `Weather in ${CITY_NAME}` + '\n';
        const wind = await getForecast()
        if (msg.text === 'WIND') {
            wind.find(report => {
                data += `
Wind speed: ${report.wind.speed} m/s`
            })
            bot.sendMessage(msg.chat.id, data);
        }
    })

    function farToCelsius(farValue) {
        return (farValue - 273.15).toFixed(2);
    }
}

const getCurrencyExchange = () => {
    const getExchange = async (currency) => {

        if (CURRENCY_RATE_PROVIDER === "privatbank") {
            const res = await axios.get(PRIVATBANK_API);
            const curRate = res.data.find((rate) => rate.ccy === currency);
            return `'The current exchange rate for today from PRIVATBANK'
${curRate.ccy}/${curRate.base_ccy}
PURCHASE: ${(+curRate.buy).toFixed(2)};
SALE: ${(+curRate.sale).toFixed(2)};
  `;
        } else if (CURRENCY_RATE_PROVIDER === "monobank") {
            let monoCache = myCache.get("monoCacheKey");
            if (monoCache == null) {
                const res = await axios.get(MONOBANK_API);
                monoCache = res.data;
                myCache.set("monoCacheKey", monoCache, 300)
            }
            const curRate = monoCache.find((rate) => rate.currencyCodeA === RATES_CODES[currency]);
            return `'The current exchange rate for today from MONOBANK'
DOLLAR USA: 840
EURO: 978
HRYVNIA: 980
${curRate.currencyCodeA}/${curRate.currencyCodeB}
PURCHASE: ${(+curRate.rateBuy).toFixed(2)};
SALE: ${(+curRate.rateSell).toFixed(2)};
  `;
        } else {
            return "something went wrong"
        }
    };
    bot.on('message', (msg) => {
        if (msg.text === `Currency exchange`) {
            bot.sendMessage(msg.chat.id, 'Choose currency', {
                reply_markup: {
                    resize_keyboard: true,
                    one_time_keyboard: false,
                    keyboard: [
                        [
                            {text: 'USD'},
                            {text: 'EUR'}
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
        if (msg.text === 'USD' || msg.text === 'EUR') {
            const rates = await getExchange(msg.text);
            bot.sendMessage(msg.chat.id, rates);
        }
    });
}

getWeather();
getCurrencyExchange();
