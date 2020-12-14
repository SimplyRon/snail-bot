"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = require("../config/config.json");
module.exports = {
    name: 'tag',
    description: 'Grab a server rule from the rules channel',
    usage: 'tag [rule number]',
    class: ['Moderator', 'Administrator'],
    forbidden: [],
    requiresArgs: true,
    execute(msg, args, client) {
        var ruleNum = args[0];
        const channel = client.channels.cache.get(config_json_1.ruleChannelId);
        channel.messages.fetch(config_json_1.ruleMessageId).then(message => {
            let singleRule = message.content.split("\n")[ruleNum];
            msg.channel.send(singleRule ? singleRule : "Invalid rule");
        });
    },
};
//# sourceMappingURL=tag.js.map