import { Client, GuildMember, MessageEmbed, PartialGuildMember } from "discord.js";
import * as config from "../config/config.json";
import { Event } from "../interfaces/Event";

export class MemberLeaveEvent extends Event {

    public name = "guildMemberRemove";

    public async callback(client: Client, member: GuildMember | PartialGuildMember): Promise<void> {
        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Member Left")
            .setDescription("**" + member.user.tag + "** Left the server")
            .setThumbnail(member.user.avatarURL() ?? "");
    
        const channel = client.channels.cache.get(config.publicLogChannel);
        if (!channel.isText()) return;
        await channel.send(embed);
    }
}