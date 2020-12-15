import { Command } from "../command";

const command: Command = {
    name: 'say',
    description: 'Say a message',
    usage: 'tag [message]',
    requiredRoles: ['Trusted', 'Moderator'],
    deleteAfter: true,
    deleteAfterTime: 5000,
    requiresArgs: true,
    execute(msg, args) {
        let strToSend = ""
        args.forEach((element: any) => {
            strToSend += ` ${element}`;
        });
        msg.channel.send(strToSend);
    },
};

export { command };