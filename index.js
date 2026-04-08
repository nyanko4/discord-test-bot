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
    .setDescription('挨拶する'),
  new SlashCommandBuilder()
    .setName('dice')
    .setDescription('チンチロ'),
].map(cmd => cmd.toJSON());

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.APP_ID),
      { body: commands }
    );
    console.log("Slash commands registered");
  } catch (err) {
    console.error(err);
  }
})();

rest.put(
  Routes.applicationCommands(process.env.APP_ID),
  { body: commands }
);

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName == 'hello') {
        await interaction.reply('こんにちは！');
    }

    if (interaction.commandName == 'dice') {
        await diceRoll(interaction);
    }
})

function judgeChinchiro(a, b, c) {
    const arr = [a, b, c].sort((x, y) => x - y);

    if (a === b && b === c) {
        return { role: "ゾロ目", value: a };
    }

    if (arr[0] === 1 && arr[1] === 2 && arr[2] === 3) {
        return { role: "ヒフミ" };
    }

    if (arr[0] === 4 && arr[1] === 5 && arr[2] === 6) {
        return { role: "シゴロ" };
    }

    if (a === b) return { role: "目", value: c };
    if (a === c) return { role: "目", value: b };
    if (b === c) return { role: "目", value: a };

    return { role: "役なし" };
}

async function diceRoll(interaction) {
    const rolls = Array.from({ length: 3 }, () =>
        Math.floor(Math.random() * 6) + 1
    );

    result = judgeChinchiro(rolls[0], rolls[1], rolls[2]);
    
    await interaction.reply(
  `出目: ${rolls.join(", ")}\n結果: ${result.role}${result.value ? `（${result.value}）` : ""}`
);
}

client.login(process.env.DISCORD_APITOKEN);

app.listen(3000, () => {
    console.log(`${process.pid} started`);
})
