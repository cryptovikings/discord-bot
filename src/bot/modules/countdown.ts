import { Client, TextChannel } from 'discord.js';
import { ChannelUtils } from '../../utils/channel';
import { TimeUtils } from '../../utils/time';

/**
 * Countdown module - regularly posts a launch countdown to a specified channel
 */
export class Countdown {

    /** Countdown Channel ID to post messages to */
    private readonly countdownChannelId = process.env.MODULE_COUNTDOWN_CHANNEL_ID!;

    /** Instantiated TextChannel */
    private channel: TextChannel | undefined;

    /**
     * Constructor - retrieve the channel and kick off the Countdown posting
     */
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

    /**
     * If launch has not passed yet, kick off an automated Countdown posting routine with an emulated self-accelerating interval
     *
     * Posts increase in frequency as launch approaches, and then launch is announced once
     *
     * // TODO adjust first post time based on last post time to handle reboots
     * // TODO attempt to synchronize?
     */
    private start(): void {
        /** Internal timeout callback for recalculating the interval and resetting the timeout if appropriate */
        const onTimeout = (): void => {
            const timeout = this.getTimeout();

            if (timeout) {
                // make a post, and set the next timeout
                this.messageCountdown();

                setTimeout(onTimeout, timeout);
            }
            else {
                // if timeout is null here, then launch passed - announce it once and do not set a new timeout
                this.messageLaunched();
            }
        }

        // if timeout is null here, then the module was booted after launch - don't do anything
        const timeout = this.getTimeout();
        if (timeout) {
            this.messageCountdown();
            setTimeout(onTimeout, timeout);
        }
    }

    /**
     * Calculate the appropriate timeout for the next automated post based on our proximity to launch
     *
     * Returns null if launch has passed; helps determine behavior both for boot and for ongoing countdown
     *
     * @returns the timeout
     */
    private getTimeout(): number | null {
        const countdown = TimeUtils.countdown();

        if (countdown.hasPassed) {
            return null;
        }

        if (countdown.weeks > 0 || countdown.days > 0) {
            // more than a day -> post daily
            return 1000 * 60 * 60 * 24;
        }

        if (countdown.hours > 1) {
            // more than an hour -> post hourly
            return 1000 * 60 * 60;
        }

        if (countdown.minutes > 30) {
            // more than 30 minutes -> post every 10 minutes
            return 1000 * 60 * 10;
        }

        // less than 30 minutes -> post every minute
        return 1000 * 60;
    }

    private messageCountdown(): void {
        void this.channel?.send(`
        **Minting draws nearer!**

Only ${TimeUtils.getCountdownString()} to go!`);
    }

    private messageLaunched(): void {
        void this.channel?.send(`
        **CryptoVikings minting is live! **

Head to < https://cryptovikings.io> to mint!`);
    }

    /**
     * Message constructor for a given
     *
     * @param id the ID of the Viking
     *
     * @returns the message
     */
    private message(id: number): string {
        return `
        **New CryptoViking!**

Viking #${id} has just been minted! Check him out: https://cryptovikings.io/vikings/${id}`;
    }
}
