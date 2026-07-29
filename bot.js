const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Serveur pour Render
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot Telegram actif');
}).listen(PORT);

// Liste test (on ajoutera les 800 après)
const series = [
  "Breaking Bad",
  "Game Of Thrones",
  "Stranger Things",
  "The Walking Dead",
  "La Casa De Papel",
  "Friends"
];

// Mémoire des votes
const votes = {};
const utilisateurs = new Set();

bot.onText(/\/start/, (msg) => {
  const options = {
    reply_markup: {
      inline_keyboard: series.map((serie) => [
        {
          text: serie,
          callback_data: serie
        }
      ])
    }
  };

  bot.sendMessage(
    msg.chat.id,
    "🎬 Choisis ta série préférée :",
    options
  );
});

bot.on('callback_query', (query) => {
  const userId = query.from.id;

  if (utilisateurs.has(userId)) {
    bot.answerCallbackQuery(query.id, {
      text: "❌ Tu as déjà voté !"
    });
    return;
  }

  const serie = query.data;

  utilisateurs.add(userId);

  votes[serie] = (votes[serie] || 0) + 1;

  bot.answerCallbackQuery(query.id, {
    text: "✅ Vote enregistré !"
  });

  bot.sendMessage(
    query.message.chat.id,
    `Merci pour ton vote pour : ${serie} 🎬`
  );
});

console.log("Bot démarré !");
