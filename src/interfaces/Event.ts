import { Client } from "discord.js";

export abstract class Event {
    public name: string;
    public abstract callback (client: Client, ...args: unknown[]): Promise<void>;
}