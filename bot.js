const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

// Petit serveur pour Render
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot Telegram actif');
}).listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "🎬 Bienvenue sur le vote des séries !\n\nLe bot fonctionne ✅"
  );
});

bot.on('polling_error', (error) => {
  console.log(error);
});

console.log("Bot démarré !");
