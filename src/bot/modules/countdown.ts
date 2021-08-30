import { Client, ClientUser, Message } from 'discord.js';

/**
 * Countdown module - reads messages for countdown-related commands and replies with information about the CryptoVikings launch
 */
export class Countdown {

    /** Client User; for ensuring that the Bot doesn't reply to itself */
    private clientUser: ClientUser;

    /** Command prefix; carried over from the environment */
    private commandPrefix = process.env.DISCORD_COMMAND_PREFIX!;

    /** Dev Mode - for restricting input to a specific test channel */
    private dev = process.env.DEV === 'true';

    /** Test Channel ID for if we're in dev mode */
    private testChannelId = process.env.DISCORD_TEST_CHANNEL_ID!;

    /** List of commands which will trigger a reply */
    private commands = [
        `${this.commandPrefix}countdown`,
        `${this.commandPrefix}launch`,
        `${this.commandPrefix}when`
    ];

    /** Rate limit in ms, from the environment */
    private rateLimit = parseInt(process.env.COUNTDOWN_RATE_LIMIT!, 10);

    /** Last send timestamp in ms for rate limiting */
    private lastSend = 0;

    /** Launch Block for reply content */
    private launchBlock = process.env.COUNTDOWN_LAUNCH_BLOCK!;

    /** Content of the reply */
    // eslint-ignore-next-line
    private message = `
    CryptoVikings is launching at block **18721000**!

Find a countdown to launch here: https://polygonscan.com/block/countdown/${this.launchBlock}
    `;

    /**
     * Constructor - register the 'messageCreate' event handler
     *
     * @param client the Discord.js Client
     */
    public constructor(client: Client) {
        if (!client.user) {
            throw Error('Client User Null');
        }

        this.clientUser = client.user;

        client.on('messageCreate', this.onMessageCreate.bind(this));
    }

    /**
     * Event handler for 'messageCreate' - check that we should respond, and reply
     *
     * @param message the Message
     */
    private async onMessageCreate(message: Message): Promise<void> {
        if (this.shouldRespond(message)) {
            await message.reply(this.message);
            this.lastSend = message.createdTimestamp;
        }
    }

    /**
     * Centralised checks for whether or not we should reply to a message
     *
     * @param message the Message
     *
     * @returns whether or not we should reply
     */
    private shouldRespond(message: Message): boolean {
        if (message.author === this.clientUser) {
            return false;
        }

        if (message.createdTimestamp - this.lastSend <= this.rateLimit) {
            return false;
        }

        if (this.dev && message.channel.id !== this.testChannelId) {
            return false;
        }

        if (!message.content.startsWith(this.commandPrefix)) {
            return false;
        }

        if (!this.commands.includes(message.content)) {
            return false;
        }

        return true;
    }
}
