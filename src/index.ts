import { Bot } from "./Bot";
import { BotToken } from "./config/auth.json";
import { importCommands, importEvents } from "./utils/importModules";

// async main function will be needed later for when we add TypeORM
const main = async () => {
    try {
        const commands = await importCommands();
        const events = await importEvents();

        const bot = new Bot(commands, events);

        bot.login(BotToken);
    }
    catch(error) {
        console.debug("Error starting the bot");
        console.error(error);
    }
}

main();