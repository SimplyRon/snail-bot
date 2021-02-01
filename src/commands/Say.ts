import { Client, Message } from "discord.js";
import { Command } from "../interfaces/Command";

export class SayCommand extends Command {

    public name = 'say';

    public description = 'Say a message';

    public usage = 'tag [message]';

    public requiredRoles = ['Trusted', 'Moderator'];

    public forbiddenRoles = [];

    public deleteAfter = true;

    public deleteAfterTime = 5000;

    public requiresArgs = true;

    public async execute(client: Client, msg: Message, args: string[]): Promise<void> {
        let strToSend = ""
        args.forEach((element: unknown) => {
            strToSend += ` ${element}`;
        });
        await msg.channel.send(strToSend);
    }
}