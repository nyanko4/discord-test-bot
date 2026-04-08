const { REST, Routes, SlashCommandBuilder, Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express()

app.get('/', (req, res) => {
    res.send('Bot is running');
})

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    if (message.content === '!test') {
        message.reply('Bot is working!');
    }
});

const commands = [
  new SlashCommandBuilder()
    .setName('hello')
    .setDescription('挨拶する')
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_APITOKEN);

rest.put(
  Routes.applicationCommands(process.env.APP_ID),
  { body: commands }
);

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName == 'hello') {
        await interaction.reply('こんにちは！');
    }
})

client.login(process.env.DISCORD_APITOKEN);

app.listen(3000, () => {
    console.log(`${process.pid} started`);
})
