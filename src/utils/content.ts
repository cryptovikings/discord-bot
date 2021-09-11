import { TimeUtils } from './time';

/**
 * Centralised message contents for countdown + commands
 */
export class ContentUtils {

    /**
     * Countdown content for responding to ~launch and for posting to #countdown
     *
     * @returns the countdown content
     */
    public static countdownContent(): string {
        return `:crossed_swords:  :shield:  :dagger:  **Minting draws nearer!**  :dagger:  :shield:  :crossed_swords:

\`\`\`markdown
- UTC - September 25th @ 00:00
- EST - September 24th @ 20:00
- PDT - September 24th @ 17:00
- BST - September 25th @ 01:00
\`\`\`
Only ${TimeUtils.getCountdownString()} to go!`;
    }

    /**
     * Post-launch content for responding to ~launch and for posting once to #countdown
     *
     * @param everyone whether or not to tag '@everyone' in the message
     *
     * @returns the post-launch content
     */
    public static launchedContent(everyone = false): string {
        if (everyone) {
            return `@everyone

:crossed_swords:  :shield:  :dagger:  **MINTING IS LIVE!**  :dagger:  :shield:  :crossed_swords:

Head to <https://cryptovikings.io> to mint!`;
        }

        return `:crossed_swords:  :shield:  :dagger:  **MINTING IS LIVE!**  :dagger:  :shield:  :crossed_swords:

Head to <https://cryptovikings.io> to mint!`;
    }
}
