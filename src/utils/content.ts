/* eslint-disable max-len */
import { TimeUtils } from './time';

/**
 * Centralised message contents for countdown + commands
 */
export class ContentUtils {

    /**
     * Presale countdown content for responding to ~presale
     *
     * @returns the presale countdown content
     */
     public static presaleCountdownContent(launchTime: number): string {
        return `:crossed_swords:  :shield:  :dagger:  **Presale is coming!**  :dagger:  :shield:  :crossed_swords:

\`\`\`markdown
- UTC - Wednesday 22nd @ 00:00
- EST - Tuesday   21st @ 20:00
- PDT - Tuesday   21st @ 17:00
- BST - Wednesday 22nd @ 01:00
\`\`\`
Only ${TimeUtils.getCountdownString(launchTime)} to go!`;
    }

    /**
     * Countdown content for responding to ~launch and for posting to #countdown
     *
     * @returns the countdown content
     */
    public static countdownContent(launchTime: number): string {
        return `:crossed_swords:  :shield:  :dagger:  **Minting draws nearer!**  :dagger:  :shield:  :crossed_swords:

\`\`\`markdown
- UTC - September 25th @ 00:00
- EST - September 24th @ 20:00
- PDT - September 24th @ 17:00
- BST - September 25th @ 01:00
\`\`\`
Only ${TimeUtils.getCountdownString(launchTime)} to go!`;
    }

    /**
     * Post-launch content for responding to ~launch and for posting once to #countdown
     *
     * @param everyone whether or not to tag '@everyone' in the message
     *
     * @returns the post-launch content
     */
    public static launchedContent(everyone = false, presale = false): string {
        const launchType = presale ? 'PRESALE' : 'MINTING';

        if (everyone) {
            return `@everyone

:crossed_swords:  :shield:  :dagger:  **MINTING IS LIVE!**  :dagger:  :shield:  :crossed_swords:

Head to <https://cryptovikings.io> to mint!`;
        }

        return `:crossed_swords:  :shield:  :dagger:  **${launchType} IS LIVE!**  :dagger:  :shield:  :crossed_swords:

Head to <https://cryptovikings.io> to mint!`;
    }

    /**
     * Content for explaining to people how to get WETH to purchase CryptoVikings
     *
     * @returns the WETH content
     */
    public static wethExplainerContent(): string {
        return `**__How to get WETH__**

**Bridging**

If you use the main Polygon Bridge, the ETH you'll have once the bridge has completed is actually the WETH you need to purchase CryptoVikings. Nothing else needs to be done, you're ready!

**Swapping**

Here's some easy access links to get the WETH needed. Always check, double-check and triple-check links prior to interacting with contracts though. You can select WETH from any of these DEX's below, these links just select WETH for you.

Sushi: <https://app.sushi.com/swap?outputCurrency=0x7ceb23fd6bc0add59e62ac25578270cff1b9f619>

QuickSwap: <https://quickswap.exchange/#/swap?outputCurrency=0x7ceb23fd6bc0add59e62ac25578270cff1b9f619>

ParaSwap: <https://paraswap.io/#/MATIC-ETH?network=polygon>

1inch: <https://app.1inch.io/#/137/swap/MATIC/ETH>

**WETH Contract**

Address: \`0x7ceb23fd6bc0add59e62ac25578270cff1b9f619\`

PolygonScan: <https://polygonscan.com/token/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619>`;
    }
}
