import { Command } from "./command";

interface CommandModule extends NodeRequire {
    command?: Command;
}

const commandModules: CommandModule[] = [
    require(`./commands/ping`),
    require(`./commands/say`),
    require(`./commands/serverinfo`),
    require(`./commands/tag`),
    require(`./commands/whois`)
];

export { commandModules };