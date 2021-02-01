import { RedisOptions } from "bullmq";
import { Bot } from "./Bot";
import { WorkerType } from "./interfaces/Worker";
import { importCommands, importEvents, importWorkers } from "./utils/importModules";
import { RedisInterface } from "./utils/RedisInterface";

const startBot = async (redisOptions: RedisOptions) => {
    try {
        const commands = await importCommands().then(arr => arr.map(c => new c()));
        const events = await importEvents().then(arr => arr.map(e => new e()));

        await importWorkers().then(arr => arr.forEach(e => new e().startListener(redisOptions)));

        const bot = new Bot(commands, events);
        
        const token: string = process.env['Token'];
        bot.login(token);
    }
    catch(error) {
        console.debug("Error starting the bot");
        console.error(error);
    }
}

const startWorker = async (type: string, redisOptions: RedisOptions) => {
    const workerType = type as keyof typeof WorkerType;
    const workers = await importWorkers();
    
    const workerSchema = workers.find(w => {
        try {
            return (new w()).type === workerType;
        }
        catch {
            return false;
        }
    });

    if (workerSchema) {
        (new workerSchema()).start(redisOptions);
    }
}

// async main function will be needed later for when we add TypeORM
const main = async () => {
    const redisOptions: RedisOptions = {
        host: process.env['REDIS_HOST'],
        port: +process.env['REDIS_PORT']
    };

    RedisInterface.init(redisOptions);

    if (process.env["WORKER"]) {
        await startWorker(process.env["WORKER"], redisOptions);
    } else {
        await startBot(redisOptions);
    }
}

main();