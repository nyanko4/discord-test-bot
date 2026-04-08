const { Client, GatewayIntentBits } = require('discord.js');

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

client.login('https://discord.com/api/webhooks/1491403285314404353/2WzRqYzIXLUF2zT4Sq823h8dkyWcTM7OMZTA2P3xx8uKREFc9sjbxAlRVArRXw_a1oAY');
