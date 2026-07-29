const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
const series = require('./series');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Serveur pour Render
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot Telegram actif');
}).listen(PORT);

// Votes
const votes = {};
const utilisateurs = new Set();

const seriesParPage = 10;

function afficherPage(chatId, page) {
  const debut = page * seriesParPage;
  const fin = debut + seriesParPage;

  const liste = series.slice(debut, fin);

  const boutons = liste.map((serie) => [
    {
      text: serie,
      callback_data: `vote_${serie}`
    }
  ]);

  const navigation = [];

  if (page > 0) {
    navigation.push({
      text: "⬅️ Précédent",
      callback_data: `page_${page - 1}`
    });
  }

  if (fin < series.length) {
    navigation.push({
      text: "Suivant ➡️",
      callback_data: `page_${page + 1}`
    });
  }

  if (navigation.length > 0) {
    boutons.push(navigation);
  }

  bot.sendMessage(
    chatId,
    `🎬 Choisis ta série préférée (page ${page + 1}) :`,
    {
      reply_markup: {
        inline_keyboard: boutons
      }
    }
  );
}

bot.onText(/\/start/, (msg) => {
  afficherPage(msg.chat.id, 0);
});


bot.on('callback_query', (query) => {
  const data = query.data;
  const chatId = query.message.chat.id;

  if (data.startsWith("page_")) {
    const page = Number(data.replace("page_", ""));
    afficherPage(chatId, page);
    return;
  }

  if (data.startsWith("vote_")) {
    const serie = data.replace("vote_", "");
    const userId = query.from.id;

    if (utilisateurs.has(userId)) {
      bot.answerCallbackQuery(query.id, {
        text: "❌ Tu as déjà voté !"
      });
      return;
    }

    utilisateurs.add(userId);

    votes[serie] = (votes[serie] || 0) + 1;

    bot.answerCallbackQuery(query.id, {
      text: "✅ Vote enregistré !"
    });

    bot.sendMessage(
      chatId,
      `Merci pour ton vote pour : ${serie} 🎬`
    );
  }
});

console.log("Bot démarré !");
