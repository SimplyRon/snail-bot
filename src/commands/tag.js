const { ruleMessageID, ruleChannelID } = require("../../data/config.json");
module.exports = {
    name: 'tag',
    description: 'Grab a server rule from the rules channel',
    usage: 'tag [rule number]',
    class: 'Public',
    requiresArgs: true,
    execute(msg, args, client) {
        var ruleNum = args[0];
        channel = client.channels.cache.get(ruleChannelID)
        channel.messages.fetch(ruleMessageID).then(message => {
            let singleRule = message.content.split("\n")[ruleNum];
            msg.channel.send(singleRule ? singleRule : "Invalid rule");
        });
    },
};