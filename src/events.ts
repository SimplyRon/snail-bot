import * as config from "./config/config.json";
import * as moment from "moment";
import { DiscordClient } from "./command";
import { Collection, DMChannel, GuildMember, Message, MessageAttachment, MessageEmbed, PartialGuildMember, PartialMessage } from "discord.js";

export function memberJoin(member: GuildMember | PartialGuildMember, client: DiscordClient) {
    const embed = new MessageEmbed()
        .setColor("#00ff00")
        .setTitle("New Member Joined")
        .setDescription("**" + member.user.tag + "** Joined the server")
        .setThumbnail(member.user.avatarURL());
    
    const channel = client.channels.cache.get(config.publicLogChannel);
    if (!channel.isText()) return;
    channel.send(embed);
}

export function memberLeave(member: GuildMember | PartialGuildMember, client: DiscordClient) {
    const embed = new MessageEmbed()
        .setColor("#ff0000")
        .setTitle("Member Left")
        .setDescription("**" + member.user.tag + "** Left the server")
        .setThumbnail(member.user.avatarURL());
    
    const channel = client.channels.cache.get(config.publicLogChannel);
    if (!channel.isText()) return;
    channel.send(embed);
}

export function messageDeleted(message: Message | PartialMessage, client: DiscordClient) {
    const attachments = message.attachments.map(attachment => attachment.name + ":\n" + attachment.url + "\n");

    let embed: MessageEmbed;
    if (attachments.length) {
        embed = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Message Deleted")
            .addField("Content:", message.content ? message.content : "No Message")
            .addField("Attachments:", attachments)
            .addField("Author:", message.author.tag)
            .setThumbnail(message.member.user.avatarURL());
    } else {
        embed = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Message Deleted")
            .addField("Content:", message.content)
            .addField("Author:", message.author.tag)
            .setThumbnail(message.member.user.avatarURL());
    }

    const channel = client.channels.cache.get(config.modLogChannel);
    if (!channel.isText()) return;
    channel.send(embed);
}

export function messageUpdated(omessage: Message | PartialMessage, nmessage: Message | PartialMessage, client: DiscordClient) {
    const embed = new MessageEmbed()
        .setColor("#ffff00")
        .setTitle("Message Edited")
        .addField("Original Content:", omessage.content)
        .addField("New Content:", nmessage.content)
        .addField("Author:", omessage.member.user.tag)
        .setThumbnail(omessage.member.user.avatarURL());
    
    const channel = client.channels.cache.get(config.modLogChannel);
    if (!channel.isText()) return;
    channel.send(embed);
}

export function messageBulkDelete(messageCollection: Collection<string, Message | PartialMessage>, client: DiscordClient) {
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

    const modChannel = client.channels.cache.get(config.modLogChannel);
    if (!modChannel.isText()) return;
    modChannel.send("**Bulk Message Delete:**\n", attachment);
}