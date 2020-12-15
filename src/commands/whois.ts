import { MessageEmbed, User } from "discord.js";
import moment = require("moment");
import { Command } from "../Command";

const command: Command = {
    name: 'whois',
    description: 'Get information about a user',
    usage: 'whois [@user]',
    requiredRoles: [ 'Public' ],
    requiresArgs: false,
    execute(msg, args) {
        const color = "#fefefe"
        if (msg.channel.type === "dm") {
            return msg.channel.send("This is a guild-only command");
        }
        let user: User;
        if (!args[0]) {
            user = msg.author;
        } else {
            user = msg.mentions.users.first();
        }
        const member = msg.guild.member(user);
        var roles = member.roles.cache.map(r => r).slice(0, -1).join("");
        if (!roles) {
            roles = "No roles";
        }
        const embed = new MessageEmbed()
            .setColor(color)
            .setThumbnail(user.avatarURL())
            .addField(`${user.tag}`, `${user}`, true)
            .addField("👑 Nickname:", `${member.nickname !== null ? `${member.nickname}` : 'None'}`, true)
            .addField("❓ Status:", `${user.presence.status}`, true)
            .addField("📅 Joined The Server On:", `${moment.utc(member.joinedAt).format("dddd, MMMM Do YYYY")}`, true)
            .addField("💥 Account Created On:", `${moment.utc(user.createdAt).format("dddd, MMMM Do YYYY")}`, true)
            .addField("📋 Roles:", roles, false)
            .addField("🆔 ID:", `${user.id}`, false)
        msg.channel.send(embed)
    },
};

export { command };