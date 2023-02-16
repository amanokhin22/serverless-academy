const {Command} = require('commander');

const program = new Command();

const bot = require("./bot");

program
    .name("string-util")
    .description("CLI to send messages and photos")
    .version("0.8.0");

program.command("send-message")
    .description("Send message to telegram bot")
    .argument("<string>", "Your message")
    .action((str) => {
        bot.sendMessage(122919870, str);
    })

program.command("send-photo")
    .description("Send photo to telegram bot")
    .argument("<string>", "Your photo")
    .action((photo) => {
        bot.sendPhoto(122919870, photo);
    })

program.parse();
