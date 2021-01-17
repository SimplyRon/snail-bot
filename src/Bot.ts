import { Client, Message } from "discord.js";
import { Command } from "./interfaces/Command";
import { Event } from "./interfaces/Event";
import { prefix } from "./config/config.json";


export class Bot {

    private prefix: string;
    private client: Client;
    private commands: Map<string, Command>;
    private events: Event[];

    constructor(commands: Command[], events: Event[]) {
        this.client = new Client();
        this.prefix = prefix;
        this.commands = this.prepCommands(commands);
        this.events = this.prepEvents(events);
        this.ready();
        this.bindCommands();
        this.bindEvents();
    }

    private prepCommands(commands: Command[]) {
        const preppedCommands = new Map<string, Command>();
        for (const command of commands) {

            if (!command) {
                console.error(`Could not load command : ${command.name}`);
                console.debug("Make sure the command is specified properly (interface: Command)");
                continue;
            }
            // 
            const invalidRoles = command.requiredRoles.filter(x => command.forbiddenRoles.includes(x));
            if (invalidRoles.length > 0) {
                console.error(`Bad permission configuration for command: ${command.name}`);
                console.debug(`Invalid roles: ${invalidRoles}`);
                continue;
            }
        
            if (preppedCommands.has(command.name)) {
                console.error(`A command with name: ${command.name} already exists!`);
                console.debug(`Wanted to load: ${command.name}`);
                continue;
            }
        
            preppedCommands.set(command.name, command);
            console.debug(`Loaded command: ${command.name}`);
        }
        return preppedCommands;
    }

    private prepEvents(events: Event[]) {
        const preppedEvents = new Array<Event>();
        for (const event of events) {

            if (!event) {
                console.error(`Could not load event : ${event.name}`);
                console.debug("Make sure the event is specified properly (interface: Event)");
                continue;
            }
        
            if (preppedEvents.some(x => x.name === event.name)) {
                console.error(`An event with name: ${event.name} already exists!`);
                console.debug(`Wanted to load: ${event.name}`);
                continue;
            }
            
            // pass the client to the event
            event.setClient(this.client);
            
            // add the event to the events array since it's a valid event
            preppedEvents.push(event);
            console.debug(`Loaded event: ${event.name}`);
        }
        return preppedEvents;
    }
    
    private checkForPermissions(message: Message, cmd: Command) {
        const inRequiredRoles = !cmd.requiredRoles || message.member.roles.cache.find(r => cmd.requiredRoles.includes(r.name));
        const inForbiddenRoles = cmd.forbiddenRoles && message.member.roles.cache.find(r => cmd.forbiddenRoles.includes(r.name));
        return inRequiredRoles && !inForbiddenRoles;
    }

    private runCommand(commandName: string, message: Message, args: string[], client: Client) {

        const command = this.commands.get(commandName);
        
        if (!command) {
            return message.channel.send("**There is no command called " + commandName + "**");
        }
    
        const allowed = this.checkForPermissions(message, command);
        
        if (!allowed) {
            return message.channel.send("**You are not permitted to use this command**");
        }
        
        if (command.requiresArgs && !args.length) {
            return message.channel.send("**Wrong usage of the command:**\n`" + command.usage + "`");
        }
        
        console.info(`Command triggered: ${command.name}`);
    
        command.execute(message, args, client);
    }

    private bindCommands() {
        this.client.on('message', (message) => {
            try {
                if (message.author.bot) return;
                if (message.content.startsWith(this.prefix)) {
                    const args = message.content.slice(this.prefix.length).trim().split(/ +/g);
                    const command = args.shift().toLowerCase()
                    this.runCommand(command, message, args, this.client);
                }
            }
            catch(error)
            {
                console.debug(`Error while receiving message/executing command`);
                console.error(error);
            }
        });
    }

    private bindEvents() {
        for(const event of this.events) {
            try {
                // binding callback to event (its class) to access `this` inside the callback method
                this.client.on(event.name, event.callback.bind(event));
            }
            catch(error) {
                console.debug(`Error in event: [${event.name}]`);
                console.error(error);
            }
        }
    }

    private async fetchOurRoles() {
        // Since this is a proprietary bot, we only have one guild, so we can get away with this
    
        const ourGuildId = this.client.guilds.cache.map(guild => guild.id)[0];
        
        const ourGuild = this.client.guilds.cache.get(ourGuildId);
    
        const ourRoles = new Set<string>();

        try {
            const roles = await ourGuild.roles.fetch()
            roles.cache.forEach(element => {
                ourRoles.add(element.name);
            });
            console.debug(`Populated our roles list with ${ourRoles.size} roles`);
    
            // Get all the roles that are defined in the commands but are not defined on the server - a possible permission leak!
            const missingRoles = new Set<string>();
            this.commands.forEach(command => {
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
        }
        catch(err) {
            console.error(err);
        }
    
    }

    private ready() {
        this.client.on('ready', async () => {
            console.info(`Succesfully logged in as ${this.client.user.tag}`);
            this.client.user.setActivity("AS-Bot V1.0");
        
            await this.fetchOurRoles();
        });
    }

    login(token: string) {
        this.client.login(token);
    }
}