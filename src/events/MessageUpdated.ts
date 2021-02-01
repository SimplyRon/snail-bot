import { Client, Message, MessageEmbed, PartialMessage } from "discord.js";
import * as config from "../config/config.json";
import { Event } from "../interfaces/Event";
import { sanitizeString } from "../utils/sanitizeString";

export class MessageUpdatedEvent extends Event {

    public name = "messageUpdate";

    public async callback(client: Client, omessage: Message | PartialMessage, nmessage: Message | PartialMessage): Promise<void> {
        const embed = new MessageEmbed()
            .setColor("#ffff00")
            .setTitle("Message Edited")
            .addField("Original Content:", sanitizeString(omessage.content))
            .addField("New Content:", sanitizeString(nmessage.content))
            .addField("Author:", omessage.member.user.tag)
            .setThumbnail(omessage.member.user.avatarURL() ?? "");

        const channel = client.channels.cache.get(config.modLogChannel);
        if (!channel.isText()) return;
        await channel.send(embed);
    }
}