"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageBulkDelete = exports.messageUpdated = exports.messageDeleted = exports.memberLeave = exports.memberJoin = void 0;
const config = require("./config/config.json");
const Discord = require("discord.js");
const moment = require("moment");
function memberJoin(member, client) {
    const embed = new Discord.MessageEmbed()
        .setColor("#00ff00")
        .setTitle("New Member Joined")
        .setDescription("**" + member.user.tag + "** Joined the server")
        .setThumbnail(member.user.avatarURL());
    client.channels.cache.get(config.publicLogChannel).send(embed);
}
exports.memberJoin = memberJoin;
function memberLeave(member, client) {
    const embed = new Discord.MessageEmbed()
        .setColor("#ff0000")
        .setTitle("Member Left")
        .setDescription("**" + member.user.tag + "** Left the server")
        .setThumbnail(member.user.avatarURL());
    client.channels.cache.get(config.publicLogChannel).send(embed);
}
exports.memberLeave = memberLeave;
function messageDeleted(message, client) {
    const attachments = message.attachments.map(attachment => attachment.name + ":\n" + attachment.url + "\n");
    if (attachments.length) {
        const embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Message Deleted")
            .addField("Content:", message.content ? message.content : "No Message")
            .addField("Attachments:", attachments)
            .addField("Author:", message.author.tag)
            .setThumbnail(message.member.user.avatarURL());
        client.channels.cache.get(config.modLogChannel).send(embed);
    }
    else {
        const embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Message Deleted")
            .addField("Content:", message.content)
            .addField("Author:", message.author.tag)
            .setThumbnail(message.member.user.avatarURL());
        client.channels.cache.get(config.modLogChannel).send(embed);
    }
}
exports.messageDeleted = messageDeleted;
function messageUpdated(omessage, nmessage, client) {
    const embed = new Discord.MessageEmbed()
        .setColor("#ffff00")
        .setTitle("Message Edited")
        .addField("Original Content:", omessage.content)
        .addField("New Content:", nmessage.content)
        .addField("Author:", omessage.member.user.tag)
        .setThumbnail(omessage.member.user.avatarURL());
    client.channels.cache.get(config.modLogChannel).send(embed);
}
exports.messageUpdated = messageUpdated;
function messageBulkDelete(messageCollection, client) {
    let humanLog = `**Deleted Messages from #${messageCollection.first().channel.name} (${messageCollection.first().channel.id})**`;
    for (const message of messageCollection.array().reverse()) {
        humanLog += `\r\n\r\n[${moment(message.createdAt).format()}] ${message.author.tag}`;
        humanLog += ' : ' + message.content;
        if (message.attachments.size) {
            const attachments = message.attachments.map(attachment => attachment.name + ":\n" + attachment.url + "\n");
            humanLog += "\n*Attachments:*\n";
            humanLog += attachments;
        }
    }
    let attachment = new Discord.MessageAttachment(Buffer.from(humanLog, 'utf-8'), 'DeletedMessages.txt');
    client.channels.cache.get(config.modLogChannel).send("**Bulk Message Delete:**\n", attachment);
}
exports.messageBulkDelete = messageBulkDelete;
//# sourceMappingURL=events.js.map