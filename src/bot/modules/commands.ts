import { Client, ClientUser, Message } from 'discord.js';
import { ContentUtils } from '../../utils/content';
import { TimeUtils } from '../../utils/time';

/**
 * Commands module - reads messages for supported commands and actions them
 */
export class Commands {

    /** Launch Time, as copied from the environment */
    private static readonly LAUNCH_TIME = parseInt(process.env.LAUNCH_TIME!, 10);

    /** Launch Time, as copied from the environment */
    private static readonly PRESALE_LAUNCH_TIME = parseInt(process.env.PRESALE_LAUNCH_TIME!, 10);

    /** Command prefix; carried over from the environment */
    private readonly commandPrefix = process.env.MODULE_COMMANDS_PREFIX!;

    /** Client User; for ensuring that the Bot doesn't reply to itself */
    private readonly clientUser: ClientUser;

    /** Supported commands, their 'lastSend' for per-command rate limiting, and their handler methods */
    private readonly commands: { [command: string]: [number, () => string] } = {
        'help': [0, this.commandHelp],
        'launch': [0, this.commandLaunch],
        'presale': [0, this.commandPresale],
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
        return ContentUtils.helpContent();
    }

    /**
     * Command handler for `launch`
     *
     * @returns response message content
     */
    private commandLaunch(): string {
        if (TimeUtils.hasLaunched(Commands.LAUNCH_TIME)) {
            return ContentUtils.launchedContent();
        }

        return ContentUtils.countdownContent(Commands.LAUNCH_TIME);
    }

    /**
     * Command handler for `presale`
     *
     * @returns response message content
     */
     private commandPresale(): string {
        if (TimeUtils.hasLaunched(Commands.PRESALE_LAUNCH_TIME)) {
            return ContentUtils.launchedContent(false, true);
        }

        return ContentUtils.presaleCountdownContent(Commands.PRESALE_LAUNCH_TIME);
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
