//Misc Requirements
const auth = require("./data/auth.json");
const { prefix, trustedMembers } = require("./data/config.json");
const events = require("./src/events.js");
const fs = require("fs");
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
let serverRoles = [];
let ourGuild = [];
let ourRoles = {};

//Discord Setup
const discord = require("discord.js");
const client = new discord.Client();
client.commands = new discord.Collection();

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
    // console.log(ourGuild);

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

    // console.log(ourRolesUnsorted)
}

    function reverseObject(object) {
        var newObject = {};
        var keys = [];

        for (var key in object) {
            keys.push(key);
        }

        for (var i = keys.length - 1; i >= 0; i--) {
          var value = object[keys[i]];
          newObject[keys[i]]= value;
        }       

        return newObject;
      }

//Command Executor
function runCommand(commandName, message, args, client) {
    //Get Command
    command = client.commands.get(commandName);
    //Check for admin

    const allowed = checkForPermissions(command.class,command.forbidden, message);
    
    if (!allowed) {
        return message.channel.send("**You are not permitted to use this command**");
    }
    //Check for Args
    if (command.requiresArgs && !args.length) {
        return message.channel.send("**This command requires argument**\n`" + command.usage + "`");
    }
    //Execute command
    command.execute(message, args, client);
};

function checkForPermissions(requiredRole, forbidden, message) {
    if(message.member.roles.cache.find(r => requiredRole.includes(r.name)) && !message.member.roles.cache.find(r => forbidden.includes(r.name)))  {
        return true;
    }
}

//Member Joined
client.on('guildMemberAdd', function(member) { events.memberjoin(member, client) });

//Member Left
client.on("guildMemberRemove", function(member) { events.memberleave(member, client) });

//Message Deleted
client.on('messageDelete', function(message) { events.messagedeleted(message, client) });

//Message Edited
client.on('messageUpdate', function(omessage, nmessage) { try { events.messageupdated(omessage, nmessage, client) } catch {} });

//Bulk Delete
client.on('messageDeleteBulk', function(messageCollection) { events.messagebulkdelete(messageCollection, client) });

//Message Received
client.on('message', async(message) => {
    if (message.content.startsWith(prefix) && !message.author.bot) {
        args = message.content.slice(prefix.length).trim().split(/ +/g);
        command = args.shift().toLowerCase()
        runCommand(command, message, args, client);
    }
});

//Log in to discord
client.login(auth.BotToken);