import { Client, ClientUser, Message } from 'discord.js';
import { getLogger } from 'log4js';

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

    /** Log4js logger */
    private static readonly LOGGER = getLogger();

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
            Commands.LOGGER.fatal('Commands [constructor]: Client User null');
            throw Error('Client User Null');
        }

        this.clientUser = client.user;

        Commands.LOGGER.info('Commands [constructor]: Listening...');
        client.on('messageCreate', this.onMessageCreate.bind(this));
    }

    /**
     * Event handler for 'messageCreate' - check that we should respond, and reply
     *
     * @param message the Message
     */
    private onMessageCreate(message: Message): void {
        try {
            const { content } = message;

            if (message.author !== this.clientUser && content.startsWith(this.commandPrefix)) {
                const command = content.substr(1);

                if (Object.keys(this.commands).includes(command)) {
                    const [lastSend, handler] = this.commands[command];

                    if (handler && message.createdTimestamp - lastSend > this.rateLimit) {
                        Commands.LOGGER.info(`Commands [onMessageCreate]: Command received: ${command} - replying...`);

                        this.commands[command][0] = message.createdTimestamp;

                        void message.reply(handler()).catch((err) => {
                            Commands.LOGGER.error('Commands [onMessageCreate]: Reply failed', err);
                        });
                    }
                }
            }
        }
        catch (e) {
            Commands.LOGGER.error('Commands [onMessageCreate]: general error', e);
        }
    }

    /**
     * Command handler for `help`
     *
     * @returns response message content
     */
    private commandHelp(): string {
        Commands.LOGGER.info('Commands [commandHelp]: Getting content...');
        return ContentUtils.helpContent();
    }

    /**
     * Command handler for `launch`
     *
     * @returns response message content
     */
    private commandLaunch(): string {
        Commands.LOGGER.info('Commands [commandLaunch]: Getting content...');

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
        Commands.LOGGER.info('Commands [commandPresale]: Getting content...');

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
        Commands.LOGGER.info('Commands [commandWeth]: Getting content...');

        return ContentUtils.wethExplainerContent();
    }
}
