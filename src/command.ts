import { Client, Message } from "discord.js";

export interface DiscordClient extends Client {
    commands?: Map<string, Command>;
}

export interface Command {
    name: string,
    description: string,
    usage: string,
    requiredRoles: string[],
    forbiddenRoles?: string[],
    deleteAfter?: boolean,
    deleteAfterTime?: number,
    requiresArgs: boolean,
    execute: (message: Message, args: string[], client: DiscordClient) => void
}
