import { Client, GuildMember, MessageEmbed, PartialGuildMember } from "discord.js";
import * as config from "../config/config.json";
import { Event } from "../interfaces/Event";

export class MemberLeaveEvent implements Event {

    private client: Client;

    public name = "guildMemberRemove";

    public setClient(client: Client) {
        this.client = client;
    }

    public callback(member: GuildMember | PartialGuildMember) {
        try {
            const embed = new MessageEmbed()
                .setColor("#ff0000")
                .setTitle("Member Left")
                .setDescription("**" + member.user.tag + "** Left the server")
                .setThumbnail(member.user.avatarURL() ?? "");
        
            const channel = this.client.channels.cache.get(config.publicLogChannel);
            if (!channel.isText()) return;
            channel.send(embed);
        }
        catch(err) {
            console.debug(`Error while executing event [${this.name}]`);
            console.error(err);
        }
    }
}