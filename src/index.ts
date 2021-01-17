import { Bot } from "./Bot";

// importing commands
// import { PingCommand } from "./commands/Ping";
// import { SayCommand } from "./commands/Say";
// import { ServerInfoCommand } from "./commands/ServerInfo";
// import { TagCommand } from "./commands/Tag";
// import { WhoisCommand } from "./commands/Whois";
import { BotToken } from "./config/auth.json";

// importing events
// import { MemberJoinEvent } from "./events/MemberJoin";
// import { MemberLeaveEvent } from "./events/MemberLeave";
// import { MessageBulkDeleteEvent } from "./events/MessageBulkDelete";
// import { MessageDeletedEvent } from "./events/MessageDeleted";
// import { MessageUpdatedEvent } from "./events/MessageUpdated";
import { Command } from "./interfaces/Command";
import { Event } from "./interfaces/Event";
import { importModules } from "./utils/importModules";

// async main function will be needed later for when we add TypeORM
const main = async () => {
    try {

        // assemble the commands
        const commands = await <Promise<Command[]>>importModules('commands');

        // assemble the events
        const events = await <Promise<Event[]>>importModules('events');

        // initialize the bot
        const bot = new Bot(commands, events);

        // start the bot
        bot.login(BotToken);
    }
    catch(error) {
        console.debug("Error starting the bot");
        console.error(error);
    }
}

main();