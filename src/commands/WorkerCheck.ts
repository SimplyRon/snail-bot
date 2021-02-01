import { Client, Message } from 'discord.js';
import { Command } from '../interfaces/Command';
import { Worker, WorkerType } from '../interfaces/Worker';

export class WorkerCheckCommand extends Command {

    public name = "worker";

    public description = "get the worker response";

    public usage = "worker";

    public requiredRoles = ["@everyone"];

    public forbiddenRoles= ['Guest Snail'];

    public requiresArgs = false;

    public async execute(client: Client, msg: Message): Promise<void> {
        await Worker.queueUp(WorkerType.workerCheck, 'checking!');
    }
}