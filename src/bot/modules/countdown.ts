import { Client, ClientUser } from 'discord.js';

/**
 * Countdown module - regularly posts a launch countdown to a specified channel
 */
export class Countdown {

    /** Client User; for ensuring that the Bot doesn't reply to itself */
    private readonly clientUser: ClientUser;

    public constructor(client: Client) {
        if (!client.user) {
            throw Error('Client User Null');
        }

        this.clientUser = client.user;
    }
}
