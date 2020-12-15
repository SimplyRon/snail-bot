import { BotToken } from "./config/auth.json";
import { prefix } from "./config/config.json";
import { memberJoin, memberLeave, messageUpdated, messageDeleted, messageBulkDelete } from "./events";
import { Client, Guild, Message } from "discord.js";
import { commandModules } from "./command-index";
import { Command, DiscordClient } from "./command";
import { console } from "./console-wrap";

let ourGuild: Guild;
const ourRoles = new Set<String>();

//Discord Setup

const client: DiscordClient = new Client();
client.commands = new Map<string, Command>();

//Load Commands
for (const module of commandModules) {

    if (!module.command) {
        console.error(`Could not load command from module: ${module.name}`);
        console.debug("Make sure the command is specified properly (interface: Command)");
        continue;
    }

    const command = module.command;
    const invalidRoles = getInvalidRoles(command);
    if (invalidRoles.length > 0) {
        console.error(`Bad permission configuration for command: ${command.name}`);
        console.debug(`Invalid roles: ${invalidRoles}`);
        continue;
    }

    if (client.commands.has(command.name)) {
        console.error(`A command with name: ${command.name} already exists!`);
        console.debug(`Wanted to load: ${module.name}`);
        continue;
    }

    client.commands.set(command.name, command);
    console.debug(`Loaded command: ${command.name}`);
}

client.on('ready', () => {
    console.info(`Succesfully logged in as ${client.user.tag}`);
    client.user.setActivity("AS-Bot V1.0");

    fetchOurRoles();
});

function fetchOurRoles() {
    // Since this is a proprietary bot, we only have one guild, so we can get away with this

    const ourGuildId = client.guilds.cache.map(guild => guild.id)[0];
    
    ourGuild = client.guilds.cache.get(ourGuildId);

    ourGuild.roles.fetch()
    .then(roles => {
        roles.cache.forEach(element => {
            ourRoles.add(element.name);
        });
        console.debug(`Populated our roles list with ${ourRoles.size} roles`);

        // Get all the roles that are defined in the commands but are not defined on the server - a possible permission leak!
        const missingRoles = new Set<string>();
        client.commands.forEach(command => {
            if (command.forbiddenRoles) {
                command.forbiddenRoles.forEach(role => {
                    if (!ourRoles.has(role)) missingRoles.add(role);
                })
            }
            if (command.requiredRoles) {
                command.requiredRoles.forEach(role => {
                    if (!ourRoles.has(role)) missingRoles.add(role);
                })
            }
        });
        
        if (missingRoles.size > 0) {
            console.warn("Some roles defined in commands are missing! Consider adding them to enable/disable the commands properly. Roles missing:");
            console.warn(Array.from(missingRoles).join(', '));
        }
    }).catch(console.error);

}

//Command Executor
function runCommand(commandName: string, message: Message, args: string[], client: DiscordClient) {

    const command = client.commands.get(commandName);
    
    if (!command) {
        return message.channel.send("**There is no command called " + commandName + "**");
    }

    const allowed = checkForPermissions(message, command);
    
    if (!allowed) {
        return message.channel.send("**You are not permitted to use this command**");
    }
    
    if (command.requiresArgs && !args.length) {
        return message.channel.send("**Wrong usage of the command:**\n`" + command.usage + "`");
    }
    
    console.info(`Command triggered: ${command.name}`);

    command.execute(message, args, client);
};

function checkForPermissions(message: Message, cmd: Command) {
    const inRequiredRoles = !cmd.requiredRoles || message.member.roles.cache.find(r => cmd.requiredRoles.includes(r.name));
    const inForbiddenRoles = cmd.forbiddenRoles && message.member.roles.cache.find(r => cmd.forbiddenRoles.includes(r.name));
    return inRequiredRoles && !inForbiddenRoles;
}

function getInvalidRoles(command: Command): string[] {
    const invalidRoles: string[] = [];
    if (command.forbiddenRoles && command.requiredRoles){
        command.requiredRoles.forEach(rRole => {
            if (command.forbiddenRoles.find(fRole => rRole === fRole)) {
                invalidRoles.push(rRole);
            }
        });
    }
    return invalidRoles;
}

//Member Joined
client.on('guildMemberAdd', (member) => {
    try {
        memberJoin(member, client);
    }
    catch(error)
    {
        console.debug('Error while receiving guildMemberAdd');
        console.error(error);
    }
});

//Member Left
client.on("guildMemberRemove", (member) => {
    try {
        memberLeave(member, client);
    }
    catch(error)
    {
        console.debug('Error while receiving guildMemberRemove');
        console.error(error);
    }
});

//Message Deleted
client.on('messageDelete', (message) => {
    try {
        if (message.author.bot) return;
        messageDeleted(message, client);
    }
    catch(error)
    {
        console.debug('Error while receiving messageDelete');
        console.error(error);
    }
});

//Message Edited
client.on('messageUpdate', (omessage, nmessage) => {
    try {
        if (omessage.author.bot) return;
        messageUpdated(omessage, nmessage, client);
    }
    catch(error)
    {
        console.debug('Error while receiving messageUpdate');
        console.error(error);
    }
});

//Bulk Delete
client.on('messageDeleteBulk', (messageCollection) => {
    try {
        if (messageCollection.first().author.bot) return;
        messageBulkDelete(messageCollection, client);
    }
    catch(error)
    {
        console.debug('Error while receiving messageDeleteBulk');
        console.error(error);
    }
});

//Message Received
client.on('message', (message) => {
    try {
        if (message.author.bot) return;
        if (message.content.startsWith(prefix)) {
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase()
            runCommand(command, message, args, client);
        }
    }
    catch(error)
    {
        console.debug('Error while receiving message');
        console.error(error);
    }
});

//Log in to discord
client.login(BotToken);