const discord = require("discord.js");
module.exports = {
    name: 'ping',
    description: 'get the API/Client response time',
    usage: 'ping',
    class: 'Public',
    requiresArgs: false,
    execute(msg, args, client) {
        const color = "#fefefe"
        ping = Math.round(client.ws.ping);
        original = new discord.MessageEmbed()
            .setTitle("Ping Statistics")
            .addField("API Ping", ping + "ms")
            .setColor(color)
        var d = new Date
        start = d.getTime();
        msg.channel.send(original).then((sentMessage) => {
            var d = new Date
            end = d.getTime();
            res = end - start;
            updated = new discord.MessageEmbed()
                .setTitle("Ping Statistics")
                .addField("API Ping", ping + "ms")
                .addField("Client Ping", res + "ms")
                .setColor(color)
            sentMessage.edit(updated);
        });
    },
};