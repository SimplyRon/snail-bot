import * as fs from "fs/promises";
import * as path from "path";
import { Worker } from "../interfaces/Worker";
import { Command } from "../interfaces/Command";
import { Event as BotEvent } from "../interfaces/Event";

interface InterfaceType<T> {
    new(): T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isCommand(modulePart: any): modulePart is InterfaceType<Command> {
    return Object.create(modulePart.prototype) instanceof Command;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isEvent(modulePart: any): modulePart is InterfaceType<BotEvent> {
    return Object.create(modulePart.prototype) instanceof BotEvent;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isWorker(modulePart: any): modulePart is InterfaceType<Worker<unknown, unknown>> {
    return Object.create(modulePart.prototype) instanceof Worker;
}

enum ModuleType {
    Commands = 'commands',
    Events = 'events',
    Workers = 'workers'
}

interface ModuleDeclaration {
    module: InterfaceType<Command | BotEvent | Worker<unknown, unknown>>;
    fileName: string
}

const importModules = async (folder: ModuleType): Promise<ModuleDeclaration[]> => {
    const fileNames = await fs.readdir(path.join(__dirname, '..', folder));
    const modules: ModuleDeclaration[] = [];
    for (const fileName of fileNames) {
        const split = fileName.split('.');
        const extension = split[split.length-1];
        if (!extension) continue;
        if (extension !== "js" && extension !== "ts") continue;
        const importString = path.join('..', folder, fileName);
        const module = await require(importString);
        for (const key in module) {
            modules.push({ module: module[key], fileName });
        }
    }
    return modules;
}

export const importCommands = async (): Promise<InterfaceType<Command>[]> => importModules(ModuleType.Commands).then(value => {
    value.forEach(module => {
        if (!isCommand(module.module)) {
            console.debug(`Tried to load invalid module as command [${module.fileName}]`);
        }
    });
    return value
        .map(module => module.module)
        .filter(isCommand);
});

export const importEvents = async (): Promise<InterfaceType<BotEvent>[]> => importModules(ModuleType.Events).then(value => {
    value.forEach(module => {
        if (!isEvent(module.module)) {
            console.debug(`Tried to load invalid module as event [${module.fileName}]`);
        }
    });
    return value
        .map(module => module.module)
        .filter(isEvent);
});

export const importWorkers = async (): Promise<InterfaceType<Worker<unknown, unknown>>[]> => importModules(ModuleType.Workers).then(value => {
    value.forEach(module => {
        if (!isWorker(module.module)) {
            console.debug(`Tried to load invalid module as worker [${module.fileName}]`);
        }
    });
    return value
        .map(module => module.module)
        .filter(isWorker);
});