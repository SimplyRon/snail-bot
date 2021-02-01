import { Client, Message } from "discord.js";

export abstract class Command {
    public name: string;
    public description: string;
    public usage: string;
    public requiredRoles: string[];
    public forbiddenRoles?: string[];
    public deleteAfter?: boolean;
    public deleteAfterTime?: number;
    public requiresArgs: boolean;
    public abstract execute(client: Client, message: Message, args: string[]): Promise<void>;
}
