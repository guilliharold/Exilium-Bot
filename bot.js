// Exilium Bot — Basic Moderation Version
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
});

client.on('messageCreate', async (message) => {
  // Ignore other bots or messages without the prefix
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
      '`!kick @user [reason]` - Kick a user from the server.',
      '`!ban @user [reason]` - Ban a user from the server.'
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

    if (!target.kickable) {
      return message.reply("I can't kick this user (they may have higher permissions).");
    }

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

    if (!target.bannable) {
      return message.reply("I can't ban this user (they may have higher permissions).");
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';
    await target.ban({ reason }).catch(() => null);
    return message.channel.send(`🔨 **${target.user.tag}** has been banned. Reason: ${reason}`);
  }
});

client.login(process.env.DISCORD_TOKEN);
