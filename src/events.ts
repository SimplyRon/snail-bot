import * as config from "./config/config.json";
import * as Discord from "discord.js";
import * as moment from "moment";

export function memberJoin(member, client) {
    const embed = new Discord.MessageEmbed()
        .setColor("#00ff00")
        .setTitle("New Member Joined")
        .setDescription("**" + member.user.tag + "** Joined the server")
        .setThumbnail(member.user.avatarURL())
    client.channels.cache.get(config.publicLogChannel).send(embed);
}

export function memberLeave(member, client) {
    const embed = new Discord.MessageEmbed()
        .setColor("#ff0000")
        .setTitle("Member Left")
        .setDescription("**" + member.user.tag + "** Left the server")
        .setThumbnail(member.user.avatarURL())
    client.channels.cache.get(config.publicLogChannel).send(embed);
}

export function messageDeleted(message, client) {
    const attachments = message.attachments.map(attachment => attachment.name + ":\n" + attachment.url + "\n")
    if (attachments.length) {
        const embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Message Deleted")
            .addField("Content:", message.content ? message.content : "No Message")
            .addField("Attachments:", attachments)
            .addField("Author:", message.author.tag)
            .setThumbnail(message.member.user.avatarURL())
        client.channels.cache.get(config.modLogChannel).send(embed);
    } else {
        const embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Message Deleted")
            .addField("Content:", message.content)
            .addField("Author:", message.author.tag)
            .setThumbnail(message.member.user.avatarURL())
        client.channels.cache.get(config.modLogChannel).send(embed);
    }
}

export function messageUpdated(omessage, nmessage, client) {
    const embed = new Discord.MessageEmbed()
        .setColor("#ffff00")
        .setTitle("Message Edited")
        .addField("Original Content:", omessage.content)
        .addField("New Content:", nmessage.content)
        .addField("Author:", omessage.member.user.tag)
        .setThumbnail(omessage.member.user.avatarURL())
    client.channels.cache.get(config.modLogChannel).send(embed);
}

export function messageBulkDelete(messageCollection, client) {
    let humanLog = `**Deleted Messages from #${messageCollection.first().channel.name} (${messageCollection.first().channel.id})**`;
    for (const message of messageCollection.array().reverse()) {
        humanLog += `\r\n\r\n[${moment(message.createdAt).format()}] ${message.author.tag}`;
        humanLog += ' : ' + message.content;
        if (message.attachments.size) {
            const attachments = message.attachments.map(attachment => attachment.name + ":\n" + attachment.url + "\n")
            humanLog += "\n*Attachments:*\n";
            humanLog += attachments;
        }
    }
    let attachment = new Discord.MessageAttachment(Buffer.from(humanLog, 'utf-8'), 'DeletedMessages.txt');
    client.channels.cache.get(config.modLogChannel).send("**Bulk Message Delete:**\n", attachment);
}