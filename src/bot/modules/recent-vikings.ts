import { Client, TextChannel } from 'discord.js';
import { BigNumber } from '@ethersproject/bignumber';
import { Contract, providers } from 'ethers';

import nornirABI from '../../nornir.abi.json';
import path from 'path/posix';
import { ChannelUtils } from '../../utils/channel';
import { ContentUtils } from '../../utils/content';
import { getLogger } from 'log4js';

/**
 * Recent Vikings module - listens to Contract `VikingComplete` and posts Viking details in a specific channel
 */
export class RecentVikings {

    /** Log4js logger */
    private static readonly LOGGER = getLogger();

    /** Contract address */
    private readonly contractAddress = process.env.ETH_CONTRACT_ADDRESS!;

    /** RPC Provider URL */
    private readonly provider = new providers.JsonRpcProvider(process.env.ETH_PROVIDER_URL);

    /** Contract */
    private readonly contract = new Contract(this.contractAddress, nornirABI, this.provider);

    /** Polling Interval for Contract Event listening */
    private readonly pollingInterval = parseInt(process.env.ETH_LISTEN_INTERVAL!, 10);

    /** Recent Vikings Channel ID to post messages to */
    private recentVikingsChannelId = process.env.MODULE_RECENT_VIKINGS_CHANNEL_ID!;

    /** Instantiated TextChannel */
    private channel: TextChannel | undefined;

    /** API Viking Output directory to serve as input for messages */
    private readonly vikingImageDirectory = path.join(__dirname, '../../../../', process.env.MODULE_RECENT_VIKINGS_IMAGE_INPUT!);

    /**
     * Constructor - retrieve the channel and set up the Contract event listener
     *
     * @param client the Discord.js Client
     */
    public constructor(client: Client) {
        RecentVikings.LOGGER.info('Recent Vikings [constructor]: Initializing...');

        client.channels.fetch(this.recentVikingsChannelId).then(
            (channel) => {
                if (channel && ChannelUtils.isTextChannel(channel)) {
                    this.channel = channel;

                    this.provider.pollingInterval = this.pollingInterval;

                    RecentVikings.LOGGER.info('Recent Vikings [constructor]: Listening...');
                    this.contract.on('VikingComplete', this.onVikingComplete.bind(this));
                }
                else {
                    RecentVikings.LOGGER.error('Recent Vikings [constructor]: Channel is not a TextChannel');
                }
            },
            (err) => {
                RecentVikings.LOGGER.error('Recent Vikings [constructor]: Error during channel fetch:', err);
            }
        );
    }

    /**
     * Contract VikingComplete event handler - send a message to the feed channel
     *
     * @param id the received Viking ID
     */
    private onVikingComplete(id: BigNumber): void {
        const n = id.toNumber();

        RecentVikings.LOGGER.info(`Recent Vikings [onVikingComplete]: Sending Viking with ID ${n}`);

        void this.channel?.send({
            content: ContentUtils.recentVikingContent(n),
            files: [
                `${this.vikingImageDirectory}/viking_${n}.png`
            ]
        }).catch((err) => {
            RecentVikings.LOGGER.error(`Recent Vikings [onVikingComplete]: Error sending Viking with ID ${n}`, err);
        });
    }
}
