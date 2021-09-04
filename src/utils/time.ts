/** Interface describing an object containing launch countdown data */
interface Countdown {
    hasPassed: boolean;
    weeks: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

/**
 * Utilities associated with Time and Countdowns
 */
export class TimeUtils {

    /** Launch Time, as copied from the environment */
    private static readonly LAUNCH_TIME = parseInt(process.env.LAUNCH_TIME!, 10);

    /**
     * Construct a Countdown containing the broken down time until launch from the given time
     *
     * @param from the time to calculate from in milliseconds
     *
     * @returns the Countdown data
     */
    public static timeToLaunch(from: number): Countdown {
        const { floor, trunc } = Math;
        const ms = TimeUtils.LAUNCH_TIME - from;

        return {
            hasPassed: ms <= 0,
            seconds: trunc((ms / 1000) % 60),
            minutes: trunc((ms / 1000 / 60) % 60),
            hours: trunc((ms / 1000 / 60 / 60) % 24),
            days: trunc((ms / 1000 / 60 / 60 / 24) % 7),
            weeks: trunc(floor((ms / 1000 / 60 / 60 / 24 / 7)))
        };
    }

    /**
     * Construct a Countdown string giving the formatted time between `from` (ms) and Countdown.LAUNCH_TIME
     *
     * Countdown string is of the form "{w} weeks, {d} days, {h} hours, {m} minutes, {s} seconds}"
     *
     * @param from the time in ms to countdown from
     *
     * @returns a formatted countdown string
     */
    public static getLaunchString(from: number): string {
        const countdown = TimeUtils.timeToLaunch(from);

        if (countdown.hasPassed) {
            return `
            **CryptoVikings minting is live!**

Head to <https://cryptovikings.io> to mint!`;
        }

        let comma = false;
        let plural = false;
        let timeStr = '';

        const { weeks, days, hours, minutes, seconds } = countdown;

        if (weeks > 0) {
            plural = weeks > 1;
            timeStr += `**${weeks}** week${plural ? 's' : ''}`;
        }

        if (days > 0) {
            comma = weeks > 0;
            plural = days > 1;

            timeStr += `${comma ? ',' : ''} **${days}** day${plural ? 's' : ''}`;
        }

        if (hours > 0) {
            comma = weeks > 0 || days > 0;
            plural = hours > 1;

            timeStr += `${comma ? ',' : ''} **${hours}** hour${plural ? 's' : ''}`;
        }

        if (minutes > 0) {
            comma = weeks > 0 || days > 0 || hours > 0;
            plural = minutes > 1;

            timeStr += `${comma ? ',' : ''} **${minutes}** minute${plural ? 's' : ''}`;
        }

        if (seconds > 0) {
            comma = weeks > 0 || days > 0 || hours > 0 || minutes > 0;
            plural = seconds > 1;

            timeStr += `${comma ? ',' : ''} **${seconds}** second${plural ? 's' : ''}`;
        }

        return `
        ** CryptoVikings minting is coming soon!**

\`\`\`markdown
- UTC - September 25th @ 00:00
- EST - September 24th @ 20:00
- PDT - September 24th @ 17:00
- BST - September 25th @ 01:00
\`\`\`
Only ${timeStr} to go!
        `;
    }
}
