import { Message } from "discord.js";
import { Command } from "../interfaces/Command";

export class SayCommand implements Command {

    public name = 'say';

    public description = 'Say a message';

    public usage = 'tag [message]';

    public requiredRoles = ['Trusted', 'Moderator'];

    public forbiddenRoles = [];

    public deleteAfter = true;

    public deleteAfterTime = 5000;

    public requiresArgs = true;

    public async execute(msg: Message, args: string[]) {
        let strToSend = ""
        args.forEach((element: any) => {
            strToSend += ` ${element}`;
        });
        msg.channel.send(strToSend);
    }
}