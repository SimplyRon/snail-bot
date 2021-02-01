import { MessageEmbed, User, Message, Client } from "discord.js";
import moment = require("moment");
import { Command } from "../interfaces/Command";

export class WhoisCommand extends Command {

    public name = 'whois';

    public description = 'Get information about a user';

    public usage = 'whois [@user]';

    public requiredRoles = [ 'Public' ];

    public forbiddenRoles = [];

    public requiresArgs = false;

    public async execute(client: Client, msg: Message, args: string[]): Promise<void> {
        const color = "#fefefe"
        if (msg.channel.type === "dm") {
            await msg.channel.send("This is a guild-only command");
        }
        let user: User;
        if (!args[0]) {
            user = msg.author;
        }
        else {
            user = msg.mentions.users.first();
        }
        const member = msg.guild.member(user);
        let roles = member.roles.cache.map(r => r).slice(0, -1).join("");
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
        await msg.channel.send(embed)
    }
}