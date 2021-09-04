import { Channel, TextChannel } from 'discord.js';

/**
 * Utilities associated with Discord Channels
 */
export class ChannelUtils {

    /**
     * Type Guard for differentiating TextChannels from Channels
     *
     * @param channel the channel to check
     *
     * @returns whether or not the channel is a TextChannel
     */
    public static isTextChannel(channel: Channel | TextChannel): channel is TextChannel {
        return !!(channel as TextChannel).send;
    }
}
