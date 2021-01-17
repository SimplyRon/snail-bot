import { Client, Message, MessageEmbed, PartialMessage } from "discord.js";
import * as config from "../config/config.json";
import { Event } from "../interfaces/Event";
import { sanitizeString } from "../utils/sanitizeString";

export class MessageUpdatedEvent implements Event {

    private client: Client;

    public name = "messageUpdate";

    public setClient(client: Client) {
        this.client = client;
    }

    public callback(omessage: Message | PartialMessage, nmessage: Message | PartialMessage) {
        try {
            const embed = new MessageEmbed()
                .setColor("#ffff00")
                .setTitle("Message Edited")
                .addField("Original Content:", sanitizeString(omessage.content))
                .addField("New Content:", sanitizeString(nmessage.content))
                .addField("Author:", omessage.member.user.tag)
                .setThumbnail(omessage.member.user.avatarURL() ?? "");

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