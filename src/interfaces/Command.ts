import { Client, Message } from "discord.js";

export abstract class Command {
    name: string;
    description: string;
    usage: string;
    requiredRoles: string[];
    forbiddenRoles?: string[];
    deleteAfter?: boolean;
    deleteAfterTime?: number;
    requiresArgs: boolean;
    abstract execute(client: Client, message: Message, args: string[]): Promise<void>;
}
