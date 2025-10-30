const { Client, GatewayIntentBits } = require('discord.js');

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Runs when the bot is ready
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Responds to messages
client.on('messageCreate', message => {
  if (message.author.bot) return; // ignore bot messages

  if (message.content === '!ping') {
    message.reply('Pong!');
  }

  if (message.content === '!hello') {
    message.reply(`Hello, ${message.author.username}!`);
  }
});

// Login using the token stored in Replit Secrets
client.login(process.env.TOKEN);
