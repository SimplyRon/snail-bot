import { MessageEmbed } from 'discord.js';
import { Command } from '../command';

const command: Command = {
    name: 'serverinfo',
    description: 'Get information about the server',
    usage: 'serverinfo',
    requiredRoles: [ 'Public' ],
    requiresArgs: false,
    execute(msg) {
        const color = "#fefefe"
        let id = msg.guild.id;
        let name = msg.guild.name;
        let createdAt = msg.guild.createdAt;
        let region = msg.guild.region;
        let owner = msg.guild.owner;
        let ownerTag = msg.guild.owner.user.tag;
        let filtration = msg.guild.explicitContentFilter;
        let icon = msg.guild.iconURL();
        let total = msg.guild.members.cache.size
        let bots = msg.guild.members.cache.filter(member => member.user.bot).size;
        let users = msg.guild.members.cache.filter(member => !member.user.bot).size;
        let verifLevel = msg.guild.verificationLevel;
        const serverEmbed = new MessageEmbed()
            .setColor(color)
            .setThumbnail(icon)
            .setTitle(name + " Information")
            .setDescription("**👑 Owner ID: **" + owner + "**\n🏷 Owner Tag: **" + ownerTag + "\n🆔 ID: **" + id + "**\n📅 Created at: **" + createdAt + "**\n🌍 Region: **" + region + "**\n⛔ Content Filtration Type: **" + filtration + "**\n🔐 User Verification Level: **" + verifLevel + "**\n🚻 Member Count: **" + total + "**\n🤖 Bot Count: **" + bots + "**\n🕹 User Count: **" + users + "**")
        msg.channel.send(serverEmbed);
    },
};

export { command };