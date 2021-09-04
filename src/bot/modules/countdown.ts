import { Client, TextChannel } from 'discord.js';
import { ChannelUtils } from '../../utils/channel';
import { TimeUtils } from '../../utils/time';

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
        const onTimeout = (): void => {
            this.onInterval('interval');

            const timeout = this.getTimeout();

            if (timeout) {
                this.onInterval(`timeout - ${timeout}`)

                setTimeout(onTimeout, timeout);
            }
        }

        const timeout = this.getTimeout();

        if (timeout) {
            this.onInterval(`first timeout - ${timeout}`);
            setTimeout(onTimeout, timeout);
        }
    }

    private getTimeout(): number | undefined {
        const countdown = TimeUtils.timeToLaunch(Date.now());
        let timeout;

        this.onInterval(JSON.stringify(countdown));

        if (countdown.hasPassed) {
            // exit case for either not starting the interval or for cancelling it when launch has passed
            return;
        }

        if (countdown.weeks > 0 || countdown.days > 0) {
            // more than a day -> post daily
            timeout = 1000 * 60 * 60 * 24;
        }
        else if (countdown.hours > 1) {
            // more than an hour -> post hourly
            timeout = 1000 * 60 * 60;
        }
        else if (countdown.minutes > 15) {
            // more than 15 minutes -> post every 15 minutes
            timeout = 1000 * 60 * 15;
        }
        else {
            // post every minute
            timeout = 1000 * 60;
        }

        return timeout;
    }

    private onInterval(message: string): void {
        void this.channel?.send(`test - ${message}`);
    }
}
