import { Job, Queue, RedisOptions, Worker as BullMqWorker } from "bullmq";
import IORedis = require("ioredis");

export const enum WorkerType {
    workerCheck = 'workerCheck',
    // 
}

export abstract class Worker<Input, Output> {
    private static queues: Map<WorkerType, Queue> = new Map<WorkerType, Queue>();

    public static async queueUp<Input, Output>(type: WorkerType, jobData: Input): Promise<Output> {
        const queue = <Queue<Input, Output, string>> this.queues.get(type);
        const job = <Job<Input, Output, string>> await queue.add(queue.name, jobData);
        return job.returnvalue;
    }

    public get type(): WorkerType {
        return this._type;
    }

    private queue: Queue;
    private worker: BullMqWorker;

    constructor(private _type: WorkerType) { }

    public startListener(redisOptions: RedisOptions): void {
        const connection = new IORedis(redisOptions);
        if (!Worker.queues.has(this._type)) {
            Worker.queues.set(this._type, new Queue(this._type, { connection,
            defaultJobOptions: {
                removeOnFail: 10,
                removeOnComplete: true
            } 
            }));
        }
    }

    public start(redisOptions: RedisOptions): void {

        const connection = new IORedis(redisOptions);

        if (!Worker.queues.has(this._type)) {
            Worker.queues.set(this._type, new Queue(this._type, { connection,
            defaultJobOptions: {
                removeOnFail: 10,
                removeOnComplete: true
            } 
            }));
        }
        this.queue = Worker.queues.get(this._type);
        this.worker = new BullMqWorker(this._type, async job => await this.processJob(job), { connection });
        console.debug(`Worker for ${this._type} started`);
    }

    protected abstract processJob(job: Job<Input, Output, string>): Promise<Output>;
}