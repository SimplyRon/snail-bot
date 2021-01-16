import { MessageEmbed } from 'discord.js';
import { Command } from '../command';

const command: Command = {
    name: 'ping',
    description: 'get the API/Client response time',
    usage: 'ping',
    requiredRoles: ['@everyone'],
    forbiddenRoles: ['Guest Snail'],
    requiresArgs: false,
    execute(msg, _, client) {
        const color = "#fefefe";
        const ping = Math.round(client.ws.ping);
        const original = new MessageEmbed()
            .setTitle("Ping Statistics")
            .addField("API Ping", ping + "ms")
            .setColor(color);
        let d = new Date();
        const start = d.getTime();
        msg.channel.send(original).then((sentMessage) => {
            let d = new Date();
            const end = d.getTime();
            const res = end - start;
            const updated = new MessageEmbed()
                .setTitle("Ping Statistics")
                .addField("API Ping", ping + "ms")
                .addField("Client Ping", res + "ms")
                .setColor(color);
            sentMessage.edit(updated);
        });
    },
};

export { command};