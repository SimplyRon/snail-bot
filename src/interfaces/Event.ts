import { Client } from "discord.js";

export abstract class Event {
    name: string;
    abstract callback (client: Client, ...args: any[]): Promise<void>;
}