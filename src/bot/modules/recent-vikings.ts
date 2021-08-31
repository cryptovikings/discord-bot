import { Channel, Client, TextChannel } from 'discord.js';
import { BigNumber } from '@ethersproject/bignumber';
import { Contract, providers } from 'ethers';

import nornirABI from '../../nornir.abi.json';
import path from 'path/posix';

/**
 * Recent Vikings module - listens to Contract `VikingComplete` and posts Viking details in a specific channel
 */
export class RecentVikings {

    private readonly contractAddress = process.env.ETH_CONTRACT_ADDRESS!;

    private readonly provider = new providers.JsonRpcProvider(process.env.ETH_PROVIDER_URL);

    private readonly contract = new Contract(this.contractAddress, nornirABI, this.provider);

    private readonly pollingInterval = parseInt(process.env.ETH_LISTEN_INTERVAL!, 10);

    /** Recent Vikings Channel ID to post messages to */
    private recentVikingsChannelId = process.env.DISCORD_RECENT_VIKINGS_CHANNEL_ID!;

    private channel: TextChannel | undefined;

    private readonly apiVikingOut = path.join(__dirname, '../../../../', process.env.API_VIKING_OUTPUT!);

    /**
     * Constructor
     *
     * @param client the Discord.js Client
     */
    public constructor(client: Client) {
        console.log(this.apiVikingOut);
        console.log(__dirname);

        client.channels.fetch(this.recentVikingsChannelId).then(
            (channel) => {
                if (channel && this.isTextChannel(channel)) {
                    this.channel = channel;

                    this.provider.pollingInterval = this.pollingInterval;

                    this.contract.on('VikingComplete', this.onVikingComplete.bind(this));
                }
                else {
                    console.error('Channel is not a TextChannel');
                }
            },
            (err) => {
                console.error('Error duringRecent Vikings initialization', err);
            }
        );
    }

    private onVikingComplete(id: BigNumber): void {
        void this.channel?.send({
            content: this.message(id.toNumber()),
            files: [
                `${this.apiVikingOut}/viking_${id.toNumber()}.png`
            ]
        });
    }

    private message = (id: number): string => `
    **New CryptoViking!**

Viking #${id} has just been minted! Check him out: https://cryptovikings.io/vikings/${id}
`;

    private isTextChannel(channel: Channel | TextChannel): channel is TextChannel {
        return !!(channel as TextChannel).send;
    }
}
