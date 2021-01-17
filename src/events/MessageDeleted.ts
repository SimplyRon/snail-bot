import { Client, Message, MessageEmbed, PartialMessage } from "discord.js";
import * as config from "../config/config.json";
import { Event } from "../interfaces/Event";
import { sanitizeString } from "../utils/sanitizeString";

export class MessageDeletedEvent implements Event {

    private client: Client;

    public name = "messageDelete";

    public setClient(client: Client) {
        this.client = client;
    }

    public callback(message: Message | PartialMessage) {
        try {
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
            } else {
                embed = new MessageEmbed()
                    .setColor("#ff0000")
                    .setTitle("Message Deleted")
                    .addField("Content:", sanitizeString(message.content))
                    .addField("Author:", message.author.tag)
                    .setThumbnail(message.member.user.avatarURL() ?? "");
            }

            const channel = this.client.channels.cache.get(config.modLogChannel);
            if (!channel.isText()) return;
            channel.send(embed);
        }
        catch(err) {
            console.debug(`Error while executing event [${this.name}]`);
            console.error(err);
        }
    }
}