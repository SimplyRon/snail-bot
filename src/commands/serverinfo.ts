import * as Discord from 'discord.js';
module.exports = {
    name: 'serverinfo',
    description: 'Get information about the server',
    usage: 'serverinfo',
    class: 'Public',
    requiresArgs: false,
    execute(msg, args, client) {
        const color = "#fefefe"
        var id = msg.guild.id;
        var name = msg.guild.name;
        var createdAt = msg.guild.createdAt;
        var region = msg.guild.region;
        var owner = msg.guild.owner;
        var ownerTag = msg.guild.owner.user.tag;
        var filtration = msg.guild.explicitContentFilter;
        var icon = msg.guild.iconURL();
        var total = msg.guild.members.cache.size
        var bots = msg.guild.members.cache.filter(member => member.user.bot).size;
        var users = msg.guild.members.cache.filter(member => !member.user.bot).size;
        var verifLevel = msg.guild.verificationLevel;
        const serverEmbed = new Discord.MessageEmbed()
            .setColor(color)
            .setThumbnail(icon)
            .setTitle(name + " Information")
            .setDescription("**👑 Owner ID: **" + owner + "**\n🏷 Owner Tag: **" + ownerTag + "\n🆔 ID: **" + id + "**\n📅 Created at: **" + createdAt + "**\n🌍 Region: **" + region + "**\n⛔ Content Filtration Type: **" + filtration + "**\n🔐 User Verification Level: **" + verifLevel + "**\n🚻 Member Count: **" + total + "**\n🤖 Bot Count: **" + bots + "**\n🕹 User Count: **" + users + "**")
        msg.channel.send(serverEmbed);
    },
};