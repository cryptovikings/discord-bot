import { configure, getLogger } from 'log4js';
import path from 'path';

import { Client, Intents } from 'discord.js';
import { Bot } from './bot/bot';

// configure log4js and output a start marker
configure({
    appenders: {
        out: { type: 'stdout' },
        bot: {
            type: 'file',
            filename: path.join(__dirname, '../', process.env.LOG_OUT!, 'bot.log'),
            maxLogSize: 1000000,
            backups: 2,
            compress: true
        }
    },
    categories: {
        default: { appenders: ['out', 'bot'], level: 'debug' }
    }
});
const out = getLogger();
out.mark('-------- BOT START --------');

// Discord.js client
const client = new Client({
    intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS]
});

// log in
client.login(process.env.DISCORD_BOT_TOKEN).then(
    () => {
        out.info('Bot logged in');

        // initialize the bot
        new Bot(client);
    },
    (err) => {
        out.fatal('Error during bot login:', err)
        process.exit(1);
    }
);
