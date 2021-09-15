import { Client } from 'discord.js';
import { getLogger } from 'log4js';

import { Commands } from './modules/commands';
import { Countdown } from './modules/countdown';
import { RecentVikings } from './modules/recent-vikings';

/**
 * Bot implementation - effectively a constructor proxy for Module initialization
 */
export class Bot {

    /**
     * Whether or not to initialize the Commands module
     */
    private commands = process.env.MODULE_COMMANDS === 'true';

    /**
     * Whether or not to initialize the Countdown Module
     */
    private countdown = process.env.MODULE_COUNTDOWN === 'true';

    /**
     * Whether or not to initialize the Recent Vikings module
     */
    private recentVikings = process.env.MODULE_RECENT_VIKINGS === 'true';

    /**
     * Constructor - initialize all enabled Modules
     *
     * @param client the Discord.js client
     */
    public constructor(client: Client) {
        const logger = getLogger();

        if (this.commands) {
            logger.info('Activating Commands Module');
            new Commands(client);
        }

        if (this.countdown) {
            logger.info('Activating Countdown Module');
            new Countdown(client);
        }

        if (this.recentVikings) {
            logger.info('Activating Recent Vikings Module');
            new RecentVikings(client);
        }
    }
}
