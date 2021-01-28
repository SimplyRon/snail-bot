import { ClientOpts } from "redis";
import { Bot } from "./Bot";
import { importCommands, importEvents } from "./utils/importModules";

// async main function will be needed later for when we add TypeORM
const main = async () => {
    try {
        const commands = await importCommands();
        const events = await importEvents();
        
        const redisOptions: ClientOpts = {
            host: 'redis',
            port: 6379
        };

        const bot = new Bot(commands, events, redisOptions);
        
        const token: string = process.env['Token'];
        bot.login(token);
    }
    catch(error) {
        console.debug("Error starting the bot");
        console.error(error);
    }
}

main();