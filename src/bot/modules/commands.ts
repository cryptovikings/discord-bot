import { Client, ClientUser, Message } from 'discord.js';
import { ContentUtils } from '../../utils/content';
import { TimeUtils } from '../../utils/time';

/**
 * Commands module - reads messages for supported commands and actions them
 */
export class Commands {

    /** Command prefix; carried over from the environment */
    private readonly commandPrefix = process.env.MODULE_COMMANDS_PREFIX!;

    /** Client User; for ensuring that the Bot doesn't reply to itself */
    private readonly clientUser: ClientUser;

    /** Supported commands, their 'lastSend' for per-command rate limiting, and their handler methods */
    private readonly commands: { [command: string]: [number, () => string] } = {
        'help': [0, this.commandHelp],
        'launch': [0, this.commandLaunch],
        'weth': [0, this.commandWeth],
    };

    /** Rate limit in ms, from the environment */
    private readonly rateLimit = parseInt(process.env.MODULE_COMMANDS_RATE_LIMIT!, 10);

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
    private onMessageCreate(message: Message): void {
        const { content } = message;

        if (message.author !== this.clientUser && content.startsWith(this.commandPrefix)) {
            const command = content.substr(1);

            const [lastSend, handler] = this.commands[command];

            if (message.createdTimestamp - lastSend > this.rateLimit) {
                this.commands[command][0] = message.createdTimestamp;

                void message.reply(handler());
            }
        }
    }

    /**
     * Command handler for `help`
     *
     * @returns response message content
     */
    private commandHelp(): string {
        return `
        **CryptoVikings Bot Help**

\`~launch\` - find out when minting begins`;
    }

    /**
     * Command handler for `launch`
     *
     * @returns response message content
     */
    private commandLaunch(): string {
        if (TimeUtils.hasLaunched()) {
            return ContentUtils.launchedContent();
        }

        return ContentUtils.countdownContent();
    }

    /**
     * Command handler for `weth`
     *
     * @returns response message content
     */
    private commandWeth(): string {
        return ContentUtils.wethExplainerContent();
    }
}
