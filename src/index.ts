import { Client, Intents } from 'discord.js';
import { Bot } from './bot/bot';

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
