module.exports = {
    name: 'say',
    description: 'Say a message',
    usage: 'ping',
    class: ['Trusted', "Moderator"],
    forbidden: [],
    deleteAfter: true,
    deleteAfterTime: 5000,
    requiresArgs: true,
    execute(msg, args) {
        let strToSend = ""
        args.forEach(element => {
            strToSend += ` ${element}`;
        });
        msg.channel.send(strToSend);
    },
};