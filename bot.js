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
  setInterval(setBotStatus, 5 * 60 * 1000); // Reapply status every 5 mins
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
    const { EmbedBuilder } = require('discord.js');

    const helpEmbed = new EmbedBuilder()
      .setColor(0x483d8b) // Dark Slate Blue
      .setTitle('⚙️ Welcome to Exilium Bot!')
      .setDescription(
        'Your reliable companion for server moderation and user management.\n\n' +
        'Exilium helps maintain order with precision — while keeping things friendly and fun!'
      )
      .addFields(
        { name: '📜 General Commands', value: '`!ping` – Check if I’m alive.\n`!help` – Display this help message.\n`!greet` – Get a random greeting from me!' },
        { name: '🛡️ Moderation Commands', value: '`!kick @user [reason]` – Kick a user.\n`!ban @user [reason]` – Ban a user.\n`!clear <number>` – Clear recent messages (1–100).' },
        { name: '💬 Support', value: '[Join the Exilium Bot Support Server](https://discord.gg/HR9S6cJTFE)' }
      )
      .setFooter({ text: '⚙️ Exilium Bot – Keeping order since 2025' })
      .setTimestamp();

    return message.channel.send({ embeds: [helpEmbed] });
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

  // === !clear ===
  if (command === 'clear') {
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

  // === !greet ===
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
});

client.login(process.env.DISCORD_TOKEN);
