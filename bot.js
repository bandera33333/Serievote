const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 
    "🎬 Bienvenue sur le vote des séries !\n\nChoisis ta série préférée."
  );
});

bot.on('polling_error', (error) => {
  console.log(error);
});

console.log("Bot démarré !");
