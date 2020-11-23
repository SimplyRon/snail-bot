//Misc Requirements
const auth = require("./data/auth.json");
const { prefix, trustedMembers } = require("./data/config.json");
const events = require("./src/events.js");
const fs = require("fs");
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

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
});

//Command Executor
function runCommand(commandName, message, args, client) {
    //Get Command
    command = client.commands.get(commandName);
    //Check for admin
    if (command.class == "Admin" && !trustedMembers.includes(message.author.id)) {
        return message.channel.send("**You are not permitted to use this command**");
    }
    //Check for Args
    if (command.requiresArgs && !args.length) {
        return message.channel.send("**This command requires argument**\n`" + command.usage + "`");
    }
    //Execute command
    command.execute(message, args, client);
};

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