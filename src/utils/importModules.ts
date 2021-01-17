import * as fs from "fs/promises";
import * as path from "path";
import { Command } from "../interfaces/Command";
import { Event } from "../interfaces/Event";

function isCommand(module: any): module is Command {
    module = module as Command;
    return module.name !== undefined && module.execute !== undefined;
}

function isEvent(module: any): module is Event {
    module = module as Event;
    return module.name !== undefined && module.callback !== undefined;
}

export const importModules = async (folder: "commands" | "events") => {
    const fileNames = await fs.readdir(path.join(__dirname, '..', folder));
    const modules: any[] = [];
    for(const fileName of fileNames) {
        const split = fileName.split('.');
        const extension = split[split.length-1];
        if(!extension) continue;
        if(extension !== "js" && extension !== "ts") continue;
        const importString = path.join('..', folder, fileName);
        const module = require(`${importString}`);
        if(folder === 'commands' && !isCommand(module)) {
            console.debug(`Tried to load invalid module as command [${fileName}]`);
            continue;
        }
        if(folder === 'events' && !isEvent(module)) {
            console.debug(`Tried to load invalid module as event [${fileName}]`);
            continue;
        }
    }
    return modules;
}