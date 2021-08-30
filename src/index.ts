import { Client, Intents } from 'discord.js';

if (!process.env.DISCORD_BOT_TOKEN) {
    console.error('No Discord Bot Token Found in Environment');
    process.exit(1);
}

if (!process.env.DISCORD_RECENT_VIKINGS_CHANNEL_ID) {
    console.error('No Recent Vikings Channel ID Found in Environment');
    process.exit(1);
}

if (!process.env.DISCORD_TEST_CHANNEL_ID) {
    console.error('No Test Channel ID Found in Environment');
    process.exit(1);
}

// bot client
const client = new Client({
    intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS]
});

client.on('messageCreate', async (message) => {
    if (process.env.DEV === 'true' && message.channel.id !== process.env.DISCORD_TEST_CHANNEL_ID) {
        return;
    }

    if (client.user === message.author) {
        return;
    }

    if (message.content === '!goodbot') {
        await message.reply(':blush: :blush:');
    }
});

client.login(process.env.DISCORD_BOT_TOKEN!).then(
    () => {
        console.log('INITIALIZED');
    },
    (err) => {
        console.error('ERROR:', err);
    }
);
