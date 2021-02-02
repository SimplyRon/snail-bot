import * as RedisModule from 'ioredis';
import { MultiOptions, Pipeline, Redis } from 'ioredis';
import { RedisOptions } from 'bullmq';
import { Snowflake } from 'discord.js';

export interface RedisResult {
    results: unknown[];
    errors: (Error | null)[];
}

export class RedisInterface {
    private static instance: RedisInterface;

    private client: Redis;

    private constructor(options: RedisOptions) {
        this.client = new RedisModule(options);
    }

    public static init(options: RedisOptions): void {
        RedisInterface.instance = new RedisInterface(options);
    }

    public static multi(commands?: string[][], options?: MultiOptions): Pipeline {
        return RedisInterface.instance.client.multi(commands, options);
    }

    public static async setData(type: string, id: Snowflake, payload: unknown): Promise<RedisResult> {
        const result = await RedisInterface.instance.client.multi()
            .hset(type, id, JSON.stringify(RedisInterface.clean(payload)))
            .publish(`${type}:Set`, id)
            .exec();
        return { results: result.map(i => i[1]), errors: result.map(i => i[0]) };
    }

    public static async getData<T>(type: string, id: Snowflake): Promise<T> {
        return RedisInterface.instance.client.hget(type, id).then(s => s ? JSON.parse(s) : null);
    }

    public static async removeData(type: string, id: Snowflake): Promise<RedisResult> {
        const result = await RedisInterface.instance.client.multi()
            .hdel(type, id)
            .publish(`${type}:Del`, id)
            .exec();
        return { results: result.map(i => i[1]), errors: result.map(i => i[0]) };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static clean(obj: any): { [key: string]: string } {
        const out = {};
        Object.keys(obj).forEach(key => {
            if (!(obj[key] instanceof Object) && obj[key] !== null && typeof obj[key] !== 'undefined') out[key] = `${obj[key]}`;
        });
        return out;
    }
}