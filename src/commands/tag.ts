import { ruleMessageId, ruleChannelId } from "../config/config.json";
module.exports = {
    name: 'tag',
    description: 'Grab a server rule from the rules channel',
    usage: 'tag [rule number]',
    class: ['Moderator', 'Administrator'],
    forbidden: [],
    requiresArgs: true,
    execute(msg, args, client) {
        var ruleNum = args[0];
        const channel = client.channels.cache.get(ruleChannelId)
        channel.messages.fetch(ruleMessageId).then(message => {
            let singleRule = message.content.split("\n")[ruleNum];
            msg.channel.send(singleRule ? singleRule : "Invalid rule");
        });
    },
};