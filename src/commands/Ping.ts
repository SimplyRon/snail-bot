import { Client, Message, MessageEmbed } from 'discord.js';
import { Command } from '../interfaces/Command';

export class PingCommand extends Command {

    public name = "ping";

    public description = "get the API/Client response time";

    public usage = "ping";

    public requiredRoles = ["@everyone"];

    public forbiddenRoles= ['Guest Snail'];

    public requiresArgs = false;

    public async execute(client: Client, msg: Message): Promise<void> {
        const color = "#fefefe";
        const ping = Math.round(client.ws.ping);
        const original = new MessageEmbed()
            .setTitle("Ping Statistics")
            .addField("API Ping", ping + "ms")
            .setColor(color);
        const dBefore = new Date();
        const start = dBefore.getTime();
        const sentMessage = await msg.channel.send(original)
        const dAfter = new Date();
        const end = dAfter.getTime();
        const res = end - start;
        const updated = new MessageEmbed()
            .setTitle("Ping Statistics")
            .addField("API Ping", ping + "ms")
            .addField("Client Ping", res + "ms")
            .setColor(color);
        await sentMessage.edit(updated);
    }
}