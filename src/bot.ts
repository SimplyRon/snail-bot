import { BotToken } from "./config/auth.json";
import { prefix } from "./config/config.json";
import { memberJoin, memberLeave, messageUpdated, messageDeleted, messageBulkDelete } from "./events";
import { readdirSync } from "fs";
import { Client, Collection, MessageEmbed } from "discord.js";

interface DiscordClient extends Client {
    commands?: Collection<string, any>;
}

const commandFiles = readdirSync('./src/commands').filter(file => file.endsWith('.js'));
let ourGuild = undefined;
let ourRoles = {};

//Discord Setup

const client: DiscordClient = new Client();
client.commands = new Collection<string, any>();

//Load Commands
for (const file of commandFiles) {
    const command = require(`./src/commands/${file}`);
    client.commands.set(command.name, command);
    console.log("Loaded command: " + command.name);
}

client.on('ready', () => {
    console.log(`Succesfully logged in as ${client.user.tag}`);
    client.user.setActivity("AS-Bot V1.0");

    fetchOurRoles()
});

function fetchOurRoles() {
    // Since this is a proprietary bot, we only have one guild, so we can get away with this

    const ourGuildId = client.guilds.cache.map(guild => guild.id)[0];
    
    ourGuild = client.guilds.cache.get(ourGuildId);

    let ourRolesUnsorted = [];
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
function runCommand(commandName, message, args, client) {
    //Get Command
    const command = client.commands.get(commandName);
    
    //Check for permission
    const allowed = checkForPermissions(command.class,command.forbidden, message, command);
    
    if (!allowed && allowed != null) {
        return message.channel.send("**You are not permitted to use this command**");
    }
    //Check for Args
    if (command.requiresArgs && !args.length && allowed != null) {
        return message.channel.send("**This command requires argument**\n`" + command.usage + "`");
    }
    //Execute command
    command.execute(message, args, client);
};

function checkForPermissions(requiredRole, forbidden, message, cmd) {
    
    if (requiredRole && forbidden) {
        if(message.member.roles.cache.find(r => requiredRole.includes(r.name)) && !message.member.roles.cache.find(r => forbidden.includes(r.name)))  {
            return true;
        } else {
            return false;
        }
    } else {
        const icon = message.guild.iconURL();
        const serverEmbed = new MessageEmbed()
            .setColor("#FF0000")
            .setThumbnail(icon)
            .setTitle(`Snail Bot Exception`)
            .setDescription(`Bad configuration for command ${capitalizeString(cmd.name)}`)
        message.channel.send(serverEmbed);
        return null
    }

}

function capitalizeString(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//Member Joined
client.on('guildMemberAdd', function(member) { memberJoin(member, client) });

//Member Left
client.on("guildMemberRemove", function(member) { memberLeave(member, client) });

//Message Deleted
client.on('messageDelete', function(message) { messageDeleted(message, client) });

//Message Edited
client.on('messageUpdate', function(omessage, nmessage) { try { messageUpdated(omessage, nmessage, client) } catch {} });

//Bulk Delete
client.on('messageDeleteBulk', function(messageCollection) { messageBulkDelete(messageCollection, client) });

//Message Received
client.on('message', async(message) => {
    if (message.content.startsWith(prefix) && !message.author.bot) {
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase()
        runCommand(command, message, args, client);
    }
});

//Log in to discord
client.login(BotToken);