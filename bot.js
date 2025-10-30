const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

// Create a new client instance
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// When the bot is ready
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Define slash commands
const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Test the bot and get a Pong response'),
  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays a list of available commands and support info'),
].map(command => command.toJSON());

// Register the commands with your guild
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Refreshing slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands },
    );
    console.log('Successfully registered slash commands.');
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
})();

// Respond to interactions
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, user } = interaction;

  if (commandName === 'ping') {
    await interaction.reply({ content: 'Pong! 🏓', ephemeral: true });
  }

  if (commandName === 'help') {
    const helpMessage = `
Hello, ${user}! 👋
Here are the commands you can use with **Exilium Bot**:

**/ping** - Test the bot and get a "Pong!" response.
**/help** - Display this help message with available commands.

Need more help or want to join the community? Check out our support server: [Click here to join](https://discord.gg/HR9S6cJTFE)
    `;
    await interaction.reply({ content: helpMessage, ephemeral: true });
  }
});

// Login using Replit Secrets
client.login(process.env.TOKEN).catch(console.error);
