"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
module.exports = {
    name: 'ping',
    description: 'get the API/Client response time',
    usage: 'ping',
    class: ['@everyone'],
    forbidden: ['Guest Snail'],
    requiresArgs: false,
    execute(msg, client) {
        const color = "#fefefe";
        const ping = Math.round(client.ws.ping);
        const original = new Discord.MessageEmbed()
            .setTitle("Ping Statistics")
            .addField("API Ping", ping + "ms")
            .setColor(color);
        var d = new Date;
        const start = d.getTime();
        msg.channel.send(original).then((sentMessage) => {
            var d = new Date;
            const end = d.getTime();
            const res = end - start;
            const updated = new Discord.MessageEmbed()
                .setTitle("Ping Statistics")
                .addField("API Ping", ping + "ms")
                .addField("Client Ping", res + "ms")
                .setColor(color);
            sentMessage.edit(updated);
        });
    },
};
//# sourceMappingURL=ping.js.map