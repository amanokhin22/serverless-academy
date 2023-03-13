const getPrivatExchange = require('./privat');
const getMonoExchange = require('./mono');
// choose your bank. Put monobank or privatbank
const CURRENCY_RATE_PROVIDER = "monobank";
async function getExchange(currency) {
    if (CURRENCY_RATE_PROVIDER === "privatbank") {
        return getPrivatExchange(currency);
    }
    if (CURRENCY_RATE_PROVIDER === "monobank") {
        return getMonoExchange(currency);
    }

    return "something went wrong"
}

module.exports = getExchange;