import { Client, GuildMember, MessageEmbed, PartialGuildMember } from "discord.js";
import * as config from "../config/config.json";
import { Event } from "../interfaces/Event";

export class MemberJoinEvent extends Event {

    public name = "guildMemberAdd";

    public async callback(client: Client, member: GuildMember | PartialGuildMember): Promise<void> {
        const embed = new MessageEmbed()
            .setColor("#00ff00")
            .setTitle("New Member Joined")
            .setDescription("**" + member.user.tag + "** Joined the server")
            .setThumbnail(member.user.avatarURL() ?? "");
    
        const channel = client.channels.cache.get(config.publicLogChannel);
        if (!channel.isText()) return;
        await channel.send(embed);
    }
}