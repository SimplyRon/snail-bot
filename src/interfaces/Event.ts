import { Client } from "discord.js";

export interface Event {
    setClient: (client: Client) => void;
    name: string;
    callback: (...args: any[]) => void;
}