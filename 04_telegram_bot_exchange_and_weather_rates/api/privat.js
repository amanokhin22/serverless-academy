const axios = require("axios");
const PRIVATBANK_API = 'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5';
async function getPrivatExchange(currency) {
    try {
        const res = await axios.get(PRIVATBANK_API);
        const curRate = res.data.find((rate) => rate.ccy === currency);
        return getPrivatSuccessMessage(curRate);
    } catch (err) {
        console.log(err);
        return 'Api Error';
    }
}
function getPrivatSuccessMessage({ccy, base_ccy, buy, sale}) {
    return `The current exchange rate for today from PRIVATBANK
${ccy}/${base_ccy}
PURCHASE: ${(+buy).toFixed(2)}
SALE: ${(+sale).toFixed(2)}
  `;
}

module.exports = getPrivatExchange;