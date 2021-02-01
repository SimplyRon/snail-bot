import { Message, DMChannel, PartialMessage, Collection, MessageAttachment, Client } from "discord.js";
import * as moment from "moment";
import * as config from "../config/config.json";
import { Event } from "../interfaces/Event";

export class MessageBulkDeleteEvent extends Event {

    public name = "messageDeleteBulk";

    public async callback(client: Client, messageCollection: Collection<string, Message | PartialMessage>): Promise<void> {
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

        const attachment = new MessageAttachment(Buffer.from(humanLog, 'utf-8'), 'DeletedMessages.txt');

        const modChannel = client.channels.cache.get(config.modLogChannel);
        if (!modChannel.isText()) return;
        await modChannel.send("**Bulk Message Delete:**\n", attachment);
    }
}