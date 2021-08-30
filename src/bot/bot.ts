import { Client } from 'discord.js';
import { Countdown } from './modules/countdown';
import { RecentVikings } from './modules/recent-vikings';

/**
 * Bot implementation - effectively a constructor proxy for Module initialization
 */
export class Bot {

    /**
     * Constructor - initialize all Modules
     *
     * @param client the Discord.js client
     */
    public constructor(client: Client) {
        new Countdown(client);
        new RecentVikings(client);
    }
}
