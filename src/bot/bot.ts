import { Client } from 'discord.js';
import { Countdown } from './modules/countdown';
import { RecentVikings } from './modules/recent-vikings';

/**
 * Bot implementation - effectively a constructor proxy for Module initialization
 */
export class Bot {

    /**
     * Whether or not to initialize the Countdown module
     */
    private countdown = process.env.MODULE_COUNTDOWN === 'true';

    /**
     * Whether or not to initialize the Recent Vikings module
     */
    private recentVikigns = process.env.MODULE_RECENT_VIKINGS === 'true';

    /**
     * Constructor - initialize all enabled Modules
     *
     * @param client the Discord.js client
     */
    public constructor(client: Client) {
        if (this.countdown) {
            new Countdown(client);
        }

        if (this.recentVikigns) {
            new RecentVikings(client);
        }
    }
}
