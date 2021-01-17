import { Client, Message, MessageEmbed } from 'discord.js';
import { Command } from '../interfaces/Command';

export class PingCommand implements Command {

    public name = "ping";

    public description = "get the API/Client response time";

    public usage = "ping";

    public requiredRoles = ["@everyone"];

    public forbiddenRoles= ['Guest Snail'];

    public requiresArgs = false;

    public async execute(msg: Message, _, client: Client) {
        const color = "#fefefe";
        const ping = Math.round(client.ws.ping);
        const original = new MessageEmbed()
            .setTitle("Ping Statistics")
            .addField("API Ping", ping + "ms")
            .setColor(color);
        let dBefore = new Date();
        const start = dBefore.getTime();
        const sentMessage = await msg.channel.send(original)
        let dAfter = new Date();
        const end = dAfter.getTime();
        const res = end - start;
        const updated = new MessageEmbed()
            .setTitle("Ping Statistics")
            .addField("API Ping", ping + "ms")
            .addField("Client Ping", res + "ms")
            .setColor(color);
        sentMessage.edit(updated);
    }
}