const TelegramBot = require('node-telegram-bot-api');

const token = "5850155902:AAHNk_la02FdhXbz6rUkl68TQ0AWUNfWEao";

const bot = new TelegramBot(token, {polling: false});

bot.on('message', async (msg) => {
    console.log(msg.chat.id);
})

module.exports = bot;
