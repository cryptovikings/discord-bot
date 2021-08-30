import { Client } from 'discord.js';

/**
 * Recent Vikings module - listens to Contract `VikingComplete` and posts Viking details in a specific channel
 */
export class RecentVikings {

    /** Recent Vikings Channel ID to post messages to */
    private recentVikingsChannelId = process.env.DISCORD_RECENT_VIKINGS_CHANNEL_ID!;

    /**
     * Constructor
     *
     * @param client the Discord.js Client
     */
    public constructor(client: Client) { }
}
