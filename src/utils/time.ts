export class Time {

    /** Launch Time, as copied from the environment */
    private static readonly LAUNCH_TIME = parseInt(process.env.LAUNCH_TIME!, 10);

    /**
     * Construct a Countdown string giving the formatted time between `from` (ms) and Countdown.LAUNCH_TIME
     *
     * Countdown string is of the form "{w} weeks, {d} days, {h} hours, {m} minutes, {s} seconds}"
     *
     * @param from the time in ms to countdown from
     *
     * @returns a formatted countdown string
     */
    public static getCountdownString(from: number): string {
        const { floor, trunc } = Math;
        const ms = Time.LAUNCH_TIME - from;

        if (ms <= 0) {
            return `
            **CryptoVikings minting is live!**

Head to <https://cryptovikings.io> to mint!`;
        }

        const s = trunc((ms / 1000) % 60);
        const m = trunc((ms / 1000 / 60) % 60);
        const h = trunc((ms / 1000 / 60 / 60) % 24);
        const d = trunc((ms / 1000 / 60 / 60 / 24) % 7);
        const w = trunc(floor((ms / 1000 / 60 / 60 / 24 / 7)));

        let comma = false;
        let plural = false;
        let timeStr = '';

        if (w > 0) {
            plural = w > 1;
            timeStr += `**${w}** week${plural ? 's' : ''}`;
        }

        if (d > 0) {
            comma = w > 0;
            plural = d > 1;

            timeStr += `${comma ? ',' : ''} **${d}** day${plural ? 's' : ''}`;
        }

        if (h > 0) {
            comma = w > 0 || d > 0;
            plural = h > 1;

            timeStr += `${comma ? ',' : ''} **${h}** hour${plural ? 's' : ''}`;
        }

        if (m > 0) {
            comma = w > 0 || d > 0 || h > 0;
            plural = m > 1;

            timeStr += `${comma ? ',' : ''} **${m}** minute${plural ? 's' : ''}`;
        }

        if (s > 0) {
            comma = w > 0 || d > 0 || h > 0 || m > 0;
            plural = s > 1;

            timeStr += `${comma ? ',' : ''} **${s}** second${plural ? 's' : ''}`;
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
