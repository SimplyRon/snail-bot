import { ClientOpts, Multi, RedisClient } from 'redis';
import * as redis from 'redis';
import * as tsubaki from 'tsubaki';
import { Channel, Client, Emoji, Guild, GuildMember, Message, PartialMessage, User } from 'discord.js';

tsubaki.promisifyAll(redis.RedisClient.prototype);
tsubaki.promisifyAll(redis.Multi.prototype);

interface PromisifiedMulti extends Multi {
    execAsync(): Promise<unknown[]>;
    sremAsync: PromisifiedOverloadedKeyCommand<string, number>;
}

export interface PromisifiedOverloadedKeyCommand<T, U> {
    (key: string, ...args: Array<T | T[]>): Promise<U>;
    (...args: Array<string | T>): Promise<U>;
}

export interface PromisifiedRedisClient extends RedisClient {
    multi(): PromisifiedMulti;
    saddAsync : PromisifiedOverloadedKeyCommand<string, number>;
    sremAsync: PromisifiedOverloadedKeyCommand<string, number>;
    sismemberAsync(key: string, member: string): Promise<number>;
    publishAsync(channel: string, value:string): Promise<number>
    flushallAsync(): Promise<string>;
}

export class RedisInterface {

    public client: PromisifiedRedisClient;

    constructor(options: ClientOpts) {
        this.client = <PromisifiedRedisClient>redis.createClient(options);
    }

    public async init(client: Client): Promise<unknown[]> {
        const q = this.client.multi();

        client.users.cache.forEach(u => q.sadd('users', u.id));
        client.guilds.cache.forEach(g => q.sadd('guilds', g.id));
        client.emojis.cache.forEach(e => q.sadd('emojis', e.id));
        client.channels.cache.forEach(c => q.sadd('channels', c.id));

        await this.client.flushallAsync();
        return await q.execAsync();
    }

    public async addMember(member: GuildMember): Promise<[added: boolean, published: number]> {
        const is = await this.client.sismemberAsync('users', member.id);
        if (is)
            return Promise.resolve([true, -1]);
        return await this.addUser(member.user);
    }

    public addChannel(channel: Channel) : Promise<[added: boolean, published: number]> {
        return this._addData('channels', channel.id);
    }

    public removeChannel(channel: Channel): Promise<[removed: boolean, published: number]> {
        return this._removeData('channels', channel.id);
    }

    public addUser(user: User) : Promise<[added: boolean, published: number]> {
        return this._addData('users', user.id);
    }

    public removeUser(user: User): Promise<[removed: boolean, published: number]> {
        return this._removeData('users', user.id);
    }

    public addGuild(guild: Guild): Promise<[added: boolean, published: number]> {
        return this._addData('guilds', guild.id);
    }

    public removeGuild(guild: Guild): Promise<[removed: boolean, published: number]> {
        return this._removeData('guilds', guild.id);
    }

    public addEmoji(emoji: Emoji): Promise<[added: boolean, published: number]> {
        return this._addData('emojis', emoji.id);
    }

    public removeEmoji(emoji: Emoji): Promise<[removed: boolean, published: number]> {
        return this._removeData('emojis', emoji.id);
    }

    public async addMessage(message: Message): Promise<[added: boolean, published: number]> {
        const res = await this._addData('messages', `${message.channel.id}:${message.id}`);
        const cache = message.client.options.messageCacheLifetime;
        if (cache)
            setTimeout(() => this.removeMessage(message), cache);
        return res;
    }

    public removeMessage(message: Message | PartialMessage): Promise<[removed: boolean, published: number]> {
        return this._removeData('messages', `${message.channel.id}:${message.id}`);
    }

    private _addData(type: string, id: string): Promise<[added: boolean, published: number]> {
        return Promise.all([
            this.client.saddAsync(type, id).then(c => c > 0),
            this.client.publishAsync(`${type}Add`, id),
        ]);
    }

    private _removeData(type: string, id: string): Promise<[removed: boolean, published: number]> {
        return Promise.all([
            this.client.sremAsync(type, id).then(c => c > 0),
            this.client.publishAsync(`${type}Remove`, id),
        ]);
    }

    public static clean(obj: { [key: string]: unknown }): { [key: string]: string } {
        const out = {};
        Object.keys(obj).forEach(key => {
            if (!(obj[key] instanceof Object) && obj[key] !== null && typeof obj[key] !== 'undefined') out[key] = `${obj[key]}`;
        });
        return out;
    }
}