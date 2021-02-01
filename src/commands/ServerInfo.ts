import { Client, Message, MessageEmbed } from 'discord.js';
import { Command } from '../interfaces/Command';

export class ServerInfoCommand extends Command {

    public name = 'serverinfo';

    public description = 'Get information about the server';

    public usage = 'serverinfo';

    public requiredRoles = [ 'Public' ];

    public forbiddenRoles = [];

    public requiresArgs = false;

    public async execute(client: Client, msg: Message): Promise<void> {
        const color = "#fefefe";
        const id = msg.guild.id;
        const name = msg.guild.name;
        const createdAt = msg.guild.createdAt;
        const region = msg.guild.region;
        const owner = msg.guild.owner;
        const ownerTag = msg.guild.owner.user.tag;
        const filtration = msg.guild.explicitContentFilter;
        const icon = msg.guild.iconURL();
        const total = msg.guild.members.cache.size
        const bots = msg.guild.members.cache.filter(member => member.user.bot).size;
        const users = msg.guild.members.cache.filter(member => !member.user.bot).size;
        const verifLevel = msg.guild.verificationLevel;
        const serverEmbed = new MessageEmbed()
            .setColor(color)
            .setThumbnail(icon)
            .setTitle(name + " Information")
            .setDescription("**👑 Owner ID: **" + owner + "**\n🏷 Owner Tag: **" + ownerTag + "\n🆔 ID: **" + id + "**\n📅 Created at: **" + createdAt + "**\n🌍 Region: **" + region + "**\n⛔ Content Filtration Type: **" + filtration + "**\n🔐 User Verification Level: **" + verifLevel + "**\n🚻 Member Count: **" + total + "**\n🤖 Bot Count: **" + bots + "**\n🕹 User Count: **" + users + "**")
        await msg.channel.send(serverEmbed);
    }
}