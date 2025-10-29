// Exilium Bot — Moderation + Custom Commands
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const PREFIX = process.env.PREFIX || '!';

client.once('ready', () => {
  console.log(`Exilium Bot is online! Logged in as ${client.user.tag}`);

  // Set stable humorous Idle status
  const setBotStatus = () => {
    client.user.setPresence({
      activities: [
        { name: 'Watching humans try to follow the rules', type: 3 } // Watching
      ],
      status: 'idle' // Yellow idle icon
    });
  };

  setBotStatus();

  // Optional: reapply status every 5 minutes in case Replit hot reload resets it
  setInterval(setBotStatus, 5 * 60 * 1000);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // === !ping ===
  if (command === 'ping') {
    return message.channel.send('Pong!');
  }

  // === !help ===
  if (command === 'help') {
    const helpText = [
      '**Exilium Bot Commands**',
      '`!ping` - Check if the bot is alive.',
      '`!help` - Show this help message.',
      '`!kick @user [reason]` - Kick a user from the server.',
      '`!ban @user [reason]` - Ban a user from the server.',
      '`!clean <number>` - Clear a specified number of messages (1-100).',
      '`!say <message>` - Bot repeats your message. (WIP)',
      '`!greet` - Bot greets the user with a random message and pings them. (WIP)',
      '`!8ball <question>` - Gives a random answer. (WIP)'
    ].join('\n');
    return message.channel.send(helpText);
  }

  // === !kick ===
  if (command === 'kick') {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply("❌ You don't have permission to kick members.");
    }

    const target = message.mentions.members.first();
    if (!target) return message.reply('Please mention a user to kick.');
    if (!target.kickable) return message.reply("I can't kick this user.");

    const reason = args.slice(1).join(' ') || 'No reason provided';
    await target.kick(reason).catch(() => null);
    return message.channel.send(`👢 **${target.user.tag}** has been kicked. Reason: ${reason}`);
  }

  // === !ban ===
  if (command === 'ban') {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply("❌ You don't have permission to ban members.");
    }

    const target = message.mentions.members.first();
    if (!target) return message.reply('Please mention a user to ban.');
    if (!target.bannable) return message.reply("I can't ban this user.");

    const reason = args.slice(1).join(' ') || 'No reason provided';
    await target.ban({ reason }).catch(() => null);
    return message.channel.send(`🔨 **${target.user.tag}** has been banned. Reason: ${reason}`);
  }

  // === !clean ===
  if (command === 'clean') {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply("❌ You don't have permission to use this command.");
    }
    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply("❌ I need the Manage Messages permission to do that.");
    }

    const amount = parseInt(args[0]);
    if (!amount || isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply("Please specify a number between 1 and 100.");
    }

    await message.channel.bulkDelete(amount, true)
      .then(deleted => {
        message.channel.send(`🧹 Cleared ${deleted.size} message(s).`)
          .then(msg => setTimeout(() => msg.delete(), 3000));
      })
      .catch(err => {
        console.error(err);
        message.reply("❌ I couldn't delete messages, something went wrong.");
      });
  }

  // === Example Custom Commands (WIP) ===
  
  // !say
  if (command === 'say') {
    const text = args.join(' ');
    if (!text) return message.reply('Please provide a message to say!');
    message.channel.send(text);
  }

  // !greet with randomized messages and pinging the user
  if (command === 'greet') {
    const greetings = [
      `Hello`,
      `Hey there`,
      `Hi`,
      `Greetings`,
      `What's up`
    ];

    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    message.channel.send(`${randomGreeting} ${message.author}, hope you're having a great day! 👋`);
  }

  // !8ball
  if (command === '8ball') {
    const responses = ['Yes', 'No', 'Maybe', 'Definitely', 'Absolutely not'];
    const choice = responses[Math.floor(Math.random() * responses.length)];
    message.channel.send(`🎱 ${choice}`);
  }

});

client.login(process.env.DISCORD_TOKEN);
