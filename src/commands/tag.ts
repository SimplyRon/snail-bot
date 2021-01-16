import { Command } from "../command";
import { ruleMessageId, ruleChannelId } from "../config/config.json";

const command: Command = {
    name: 'tag',
    description: 'Grab a server rule from the rules channel',
    usage: 'tag [rule number]',
    requiredRoles: ['Moderator', 'Administrator'],
    requiresArgs: true,
    execute(msg, args, client) {
        let ruleNum = args[0];
        const channel = client.channels.cache.get(ruleChannelId);
        if (channel.isText()){
            channel.messages.fetch(ruleMessageId)
            .then(message => {
                let singleRule = message.content.split("\n")[ruleNum];
                msg.channel.send(singleRule ? singleRule : "Invalid rule");
            });
        }
    },
};

export { command };