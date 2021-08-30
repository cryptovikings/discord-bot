import { Client, Intents } from 'discord.js';
import { Bot } from './bot/bot';

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

// Discord.js client
const client = new Client({
    intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS]
});

// log in
client.login(process.env.DISCORD_BOT_TOKEN).then(
    () => {
        console.log('Bot Logged In');

        // initialize the bot
        new Bot(client);
    },
    (err) => {
        console.error('Error during login:', err)
    }
);
