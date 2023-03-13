const axios = require("axios");
const NodeCache = require("node-cache");
const myCache = new NodeCache({stdTTL: 300});
const RATES_CODES = {
    USD: 840,
    EUR: 978
}
const MONOBANK_API = 'https://api.monobank.ua/bank/currency';
async function getMonoExchange(currency) {
    try {
        let monoCache = myCache.get("monoCacheKey");
        if (monoCache == null) {
            const res = await axios.get(MONOBANK_API);
            monoCache = res.data;
            myCache.set("monoCacheKey", monoCache, 300)
        }
        const curRate = monoCache.find((rate) => rate.currencyCodeA === RATES_CODES[currency]);
        return getMonoSuccessMessage(curRate);
    } catch (err) {
        console.log(err);
        return 'Api Error';
    }
}
function getMonoSuccessMessage({currencyCodeA, currencyCodeB, rateBuy, rateSell})
{
    return `The current exchange rate for today from MONOBANK
DOLLAR USA: 840
EURO: 978
HRYVNIA: 980
${currencyCodeA}/${currencyCodeB}
PURCHASE: ${(+rateBuy).toFixed(2)}
SALE: ${(+rateSell).toFixed(2)}
  `
}

module.exports = getMonoExchange;