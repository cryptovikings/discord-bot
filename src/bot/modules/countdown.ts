import { Client, TextChannel } from 'discord.js';
import { ChannelUtils } from '../../utils/channel';

/**
 * Countdown module - regularly posts a launch countdown to a specified channel
 */
export class Countdown {

    private countdownStart = parseInt(process.env.MODULE_COUNTDOWN_START!, 10);

    /** Countdown Channel ID to post messages to */
    private countdownChannelId = process.env.MODULE_COUNTDOWN_CHANNEL_ID!;

    /** Instantiated TextChannel */
    private channel: TextChannel | undefined;

    public constructor(client: Client) {
        client.channels.fetch(this.countdownChannelId).then(
            (channel) => {
                if (channel && ChannelUtils.isTextChannel(channel)) {
                    this.channel = channel;

                    this.start();
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

    private start(): void {
        let time = 1000;

        const interval = (): void => {
            this.onInterval(`timeout: ${time}`);
            time += 1000;
            setTimeout(interval, time);
        }

        setTimeout(interval, time);
    }

    private onInterval(message: string): void {
        void this.channel?.send(`test - ${message}`);
    }
}
