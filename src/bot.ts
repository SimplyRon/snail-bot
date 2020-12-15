import { BotToken } from "./config/auth.json";
import { prefix } from "./config/config.json";
import { memberJoin, memberLeave, messageUpdated, messageDeleted, messageBulkDelete } from "./events";
import { Client, Guild, Message, Role } from "discord.js";
import { commandModules } from "./command-index";
import { Command, DiscordClient } from "./command";

let ourGuild: Guild;
const ourRoles = {};

//Discord Setup

const client: DiscordClient = new Client();
client.commands = new Map<string, Command>();

//Load Commands
for (const module of commandModules) {

    if (!module.command) {
        console.log(`Could not load command from module: ${module.name}`);
        console.log("Make sure the command is specified properly (interface: Command)");
        continue;
    }

    const command = module.command;
    const invalidRoles = getInvalidRoles(command);
    if (invalidRoles.length > 0) {
        console.log(`Bad permission configuration for command: ${command.name}`);
        console.log(`Invalid roles: ${invalidRoles}`);
        continue;
    }

    if (client.commands.has(command.name)) {
        console.log(`A command with name: ${command.name} already exists!`);
        console.log(`Wanted to load: ${module.name}`);
        continue;
    }

    client.commands.set(command.name, command);
    console.log(`Loaded command: ${command.name}`);
}

client.on('ready', () => {
    console.log(`Succesfully logged in as ${client.user.tag}`);
    client.user.setActivity("AS-Bot V1.0");

    fetchOurRoles();
});

function fetchOurRoles() {
    // Since this is a proprietary bot, we only have one guild, so we can get away with this

    const ourGuildId = client.guilds.cache[0].id;
    
    ourGuild = client.guilds.cache.get(ourGuildId);

    const ourRolesUnsorted: Role[] = [];
    ourGuild.roles.fetch()
    .then(roles => {
        roles.cache.forEach(element => {
            ourRolesUnsorted.push(element);
        });
        console.log(`Populated our roles list with ${roles.cache.size} roles` )
    }).then(() => {
        ourRolesUnsorted.forEach(element => {
            ourRoles[element.position] = {
                id: element.id,
                name: element.name,
                position: element.rawPosition
            }
        })
    }).catch(console.error);

}

//Command Executor
function runCommand(commandName: string, message: Message, args: string[], client: DiscordClient) {

    const command = client.commands.get(commandName);
    
    const allowed = checkForPermissions(message, command);
    
    if (!allowed) {
        return message.channel.send("**You are not permitted to use this command**");
    }
    
    if (command.requiresArgs && !args.length) {
        return message.channel.send("**This command requires argument**\n`" + command.usage + "`");
    }
    
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
client.on('guildMemberAdd', async (member) => { try { memberJoin(member, client); } catch { console.log('Error while receiving guildMemberAdd'); } });

//Member Left
client.on("guildMemberRemove", async (member) => { try { memberLeave(member, client); } catch { console.log('Error while receiving guildMemberRemove'); } });

//Message Deleted
client.on('messageDelete', async (message) => { try { messageDeleted(message, client); } catch { console.log('Error while receiving messageDelete'); } });

//Message Edited
client.on('messageUpdate', async (omessage, nmessage) => { try { messageUpdated(omessage, nmessage, client); } catch { console.log('Error while receiving messageUpdate'); } });

//Bulk Delete
client.on('messageDeleteBulk', async (messageCollection) => { try { messageBulkDelete(messageCollection, client); } catch { console.log('Error while receiving messageDeleteBulk'); } });

//Message Received
client.on('message', async (message) => {
    try {
        if (message.content.startsWith(prefix) && !message.author.bot) {
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase()
            runCommand(command, message, args, client);
        }
    }
    catch
    {
        console.log('Error while receiving message');
    }
});

//Log in to discord
client.login(BotToken);