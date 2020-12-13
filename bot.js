//Misc Requirements
import { BotToken } from "./data/auth.json";
import { prefix } from "./data/config.json";
import { memberjoin, memberleave, messagedeleted, messageupdated, messagebulkdelete } from "./src/events.js";
import { readdirSync } from "fs";
const commandFiles = readdirSync('./src/commands').filter(file => file.endsWith('.js'));
let ourGuild = undefined;
let ourRoles = {};

//Discord Setup
import { Client, Collection, MessageEmbed } from "discord.js";
const client = new Client();
client.commands = new Collection();

//Load Commands
for (const file of commandFiles) {
    const command = require(`./src/commands/${file}`);
    client.commands.set(command.name, command);
    console.log("Loaded command: " + command.name);
}

//Logged in
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
    command = client.commands.get(commandName);
    
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
client.on('guildMemberAdd', function(member) { memberjoin(member, client) });

//Member Left
client.on("guildMemberRemove", function(member) { memberleave(member, client) });

//Message Deleted
client.on('messageDelete', function(message) { messagedeleted(message, client) });

//Message Edited
client.on('messageUpdate', function(omessage, nmessage) { try { messageupdated(omessage, nmessage, client) } catch {} });

//Bulk Delete
client.on('messageDeleteBulk', function(messageCollection) { messagebulkdelete(messageCollection, client) });

//Message Received
client.on('message', async(message) => {
    if (message.content.startsWith(prefix) && !message.author.bot) {
        args = message.content.slice(prefix.length).trim().split(/ +/g);
        command = args.shift().toLowerCase()
        runCommand(command, message, args, client);
    }
});

//Log in to discord
client.login(BotToken);