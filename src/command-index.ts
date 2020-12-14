
const commands: any[] = [
    require(`./commands/ping`),
    require(`./commands/say`),
    require(`./commands/serverinfo`),
    require(`./commands/tag`),
    require(`./commands/whois`)
];

export { commands };