import { Client, TextChannel } from 'discord.js';
import { ChannelUtils } from '../../utils/channel';

/**
 * Countdown module - regularly posts a launch countdown to a specified channel
 */
export class Countdown {

    /** Countdown Channel ID to post messages to */
    private countdownChannelId = process.env.MODULE_COUNTDOWN_CHANNEL_ID!;

    /** Instantiated TextChannel */
    private channel: TextChannel | undefined;

    public constructor(client: Client) {
        client.channels.fetch(this.countdownChannelId).then(
            (channel) => {
                if (channel && ChannelUtils.isTextChannel(channel)) {
                    this.channel = channel;

                    // setInterval(this.onInterval.bind(this), 1000);
                }
                else {
                    console.error('Channel is not a TextChannel');
                }
            },
            (err) => {
                console.error('Error during Countdown initialization', err);
            }
        );
    }

    private onInterval(): void {
        void this.channel?.send('test');
    }
}
