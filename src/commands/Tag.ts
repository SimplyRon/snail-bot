import { Message, Client } from "discord.js"
import { Command } from "../interfaces/Command";
import { ruleMessageId, ruleChannelId } from "../config/config.json";

export class TagCommand implements Command {

    public name = 'tag';

    public description = 'Grab a server rule from the rules channel';

    public usage = 'tag [rule number]';

    public requiredRoles = ['Moderator', 'Administrator'];

    public forbiddenRoles = [];

    public requiresArgs = true;

    public async execute(msg: Message, args: string[], client: Client) {
        let ruleNum = args[0];
        const channel = client.channels.cache.get(ruleChannelId);
        if (channel.isText()){
            const message = await channel.messages.fetch(ruleMessageId)
            let singleRule = message.content.split("\n")[ruleNum];
            msg.channel.send(singleRule ? singleRule : "Invalid rule");
        }
    }
}