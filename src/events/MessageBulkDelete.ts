import { Client, Message, DMChannel, PartialMessage, Collection, MessageAttachment } from "discord.js";
import * as moment from "moment";
import * as config from "../config/config.json";
import { Event } from "../interfaces/Event";

export class MessageBulkDeleteEvent implements Event {

    private client: Client;

    public name = "messageDeleteBulk";

    public setClient(client: Client) {
        this.client = client;
    }

    public callback(messageCollection: Collection<string, Message | PartialMessage>) {
        try {
            const channel = messageCollection.first().channel;
            if (!channel.isText()) return;
            if (channel instanceof DMChannel) return;

            let humanLog = `**Deleted Messages from #${channel.name} (${messageCollection.first().channel.id})**`;
            for (const message of messageCollection.array().reverse()) {
                humanLog += `\r\n\r\n[${moment(message.createdAt).format()}] ${message.author.tag}`;
                humanLog += ' : ' + message.content;
                if (message.attachments.size) {
                    const attachments = message.attachments.map(attachment => attachment.name + ":\n" + attachment.url + "\n")
                    humanLog += "\n*Attachments:*\n";
                    humanLog += attachments;
                }
            }

            let attachment = new MessageAttachment(Buffer.from(humanLog, 'utf-8'), 'DeletedMessages.txt');

            const modChannel = this.client.channels.cache.get(config.modLogChannel);
            if (!modChannel.isText()) return;
            modChannel.send("**Bulk Message Delete:**\n", attachment);
        }
        catch(err) {
            console.debug(`Error while executing event [${this.name}]`);
            console.error(err);
        }
    }
}