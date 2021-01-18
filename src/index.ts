import { Bot } from "./Bot";
import { importCommands, importEvents } from "./utils/importModules";

// async main function will be needed later for when we add TypeORM
const main = async () => {
    try {
        const commands = await importCommands();
        const events = await importEvents();

        const bot = new Bot(commands, events);
        
        const token: string = process.env['Token'] ?? (await require("./config/auth.json")).BotToken;
        bot.login(token);
    }
    catch(error) {
        console.debug("Error starting the bot");
        console.error(error);
    }
}

main();