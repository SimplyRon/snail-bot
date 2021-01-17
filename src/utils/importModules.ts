import * as fs from "fs/promises";
import * as path from "path";
import { Command } from "../interfaces/Command";
import { Event } from "../interfaces/Event";

interface InterfaceType<T> {
    new(): T;
}

function isCommand(module: any): module is InterfaceType<Command> {
    const commandModule = (new module()) as Command;
    return commandModule.name !== undefined && commandModule.execute !== undefined;
}

function isEvent(module: any): module is InterfaceType<Event> {
    const eventModule = (new module()) as Event;
    return eventModule.name !== undefined && eventModule.callback !== undefined;
}

enum ModuleType {
    Commands = 'commands',
    Events = 'events'
}

interface ModuleDeclaration {
    module: (Command | Event);
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

export const importCommands = async (): Promise<Command[]> => importModules(ModuleType.Commands).then(value => {
    value.forEach(module => {
        if (!isCommand(module.module)) {
            console.debug(`Tried to load invalid module as command [${module.fileName}]`);
        }
    });
    return value
        .map(module => module.module)
        .filter(isCommand)
        .map(module => new (<InterfaceType<Command>><unknown>module)());
});

export const importEvents = async (): Promise<Event[]> => importModules(ModuleType.Events).then(value => {
    value.forEach(module => {
        if (!isEvent(module.module)) {
            console.debug(`Tried to load invalid module as event [${module.fileName}]`);
        }
    });
    return value
        .map(module => module.module)
        .filter(isEvent)
        .map(module => new (<InterfaceType<Event>><unknown>module)());
});