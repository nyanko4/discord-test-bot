const { REST, Routes, SlashCommandBuilder, Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express()

app.get('/', (req, res) => {
    res.send('Bot is running');
})

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    console.log(message)
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
  new SlashCommandBuilder()
    .setName('create-emoji')
    .setDescription('絵文字を作成')
    .addAttachmentOption((option) => 
      option
        .setName('emoji-image')
        .setDescription('作成する絵文字の画像')
        .setRequired(true))
    .addStringOption((option) =>
      option
        .setName('emoji-name')
        .setDescription('作成する絵文字の名前')
        .setRequired(true))
  new SlashCommandBuilder()
    .setName('create-stamp')
    .setDescription('スタンプを作成')
    .addAttachmentOption((option) => 
      option
        .setName('stamp-image')
        .setDescription('作成するスタンプの画像')
        .setRequired(true))
    .addStringOption((option) =>
      option
        .setName('stamp-name')
        .setDescription('作成するスタンプの名前')
        .setRequired(true))
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_APITOKEN);

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

  console.log(interaction);

  if (interaction.commandName == 'hello') {
    await interaction.reply('こんにちは！');
  }

  if (interaction.commandName == 'dice') {
    await diceRoll(interaction);
  }

  if (interaction.commandName == 'create-stamp') {
    await createStamp(interaction);
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
    await interaction.deferReply();
    console.log(interaction);
    console.log(interaction.user.id);
    const rolls = Array.from({ length: 3 }, () =>
        Math.floor(Math.random() * 6) + 1
    );

    result = judgeChinchiro(rolls[0], rolls[1], rolls[2]);
    
    await interaction.editReply(
  `出目: ${rolls.join(", ")}\n結果: ${result.role}${result.value ? `（${result.value}）` : ""}`
);
}

async function createEmoji(interaction) {
  const emojiUrl = interaction.options.getAttachment('emoji-image').attachment;
  const emojiName = interaction.options.getString('emoji-name');

  if (!/[\w]+/g.test(emojiName)) {
    await interaction.reply('絵文字の名前は英数字と_のみ使用可能です');
    return;
  };

  await interaction.guild.emojis.create({
    attachment: emojiUrl,
    name: emojiName
  });

  await interaction.reply('作成しました');
}

async function createStamp(interaction) {
  const stampUrl = interaction.options.getAttachment('stamp-image').attachment;
  const stampName = interaction.options.getString('stamp-name');

  if (!/[\w]+/g.test(stampName)) {
    await interaction.reply('スタンプの名前は英数字と_のみ使用可能です');
    return;
  };

  await interaction.guild.stickers.create({
    file: emojiUrl,
    name: emojiName,
    tags: 'bot'
  });

  await interaction.reply('作成しました');
}

client.login(process.env.DISCORD_APITOKEN);

app.listen(3000, () => {
    console.log(`${process.pid} started`);
})
