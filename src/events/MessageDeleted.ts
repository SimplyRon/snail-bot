import { Client, Message, MessageEmbed, PartialMessage } from "discord.js";
import * as config from "../config/config.json";
import { Event } from "../interfaces/Event";
import { sanitizeString } from "../utils/sanitizeString";

export class MessageDeletedEvent extends Event {

    public name = "messageDelete";

    public async callback(client: Client, message: Message | PartialMessage): Promise<void> {
        const attachments = message.attachments.map(attachment => attachment.name + ":\n" + attachment.url + "\n");

        let embed: MessageEmbed;
        if (attachments.length) {
            embed = new MessageEmbed()
                .setColor("#ff0000")
                .setTitle("Message Deleted")
                .addField("Content:", sanitizeString(message.content))
                .addField("Attachments:", attachments)
                .addField("Author:", message.author.tag)
                .setThumbnail(message.member.user.avatarURL() ?? "");
        }
        else {
            embed = new MessageEmbed()
                .setColor("#ff0000")
                .setTitle("Message Deleted")
                .addField("Content:", sanitizeString(message.content))
                .addField("Author:", message.author.tag)
                .setThumbnail(message.member.user.avatarURL() ?? "");
        }

        const channel = client.channels.cache.get(config.modLogChannel);
        if (!channel.isText()) return;
        await channel.send(embed);
    }
}