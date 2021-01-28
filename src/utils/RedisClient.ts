import { Client } from 'discord.js';
import { EventEmitter } from 'events';
import { ClientOpts } from 'redis';
import { PromisifiedRedisClient, RedisInterface } from './RedisInterface';

export class RedisClient extends EventEmitter {
    public ready: boolean;
    public interface: RedisInterface;
    public discordClient: Client;

    private options: ClientOpts;
    private client: PromisifiedRedisClient;

  constructor(client: Client, options: ClientOpts) {
    super();

    this.discordClient = client;
    this.options = options;

    this.ready = false;
    this.on('ready', () => { this.ready = true; });

    this.interface = new RedisInterface(this.options);
    this.client = this.interface.client;
    this.initialize();
  }

  private initialize(): void {
    const c = this.discordClient;

    if (c.readyTimestamp) this._ready();
    else c.once('ready', this._ready.bind(this));

    c.on('message', m => this.interface.addMessage(m));
    c.on('messageDelete', m => this.interface.removeMessage(m));
    c.on('messageDeleteBulk', (messages) => {
      const q = this.client.multi();
      messages.forEach(m => q.sremAsync('messages', m.id));
      return q.execAsync();
    });

    c.on('emojiCreate', e => this.interface.addEmoji(e));
    c.on('emojiDelete', e => this.interface.removeEmoji(e));

    c.on('channelCreate', ch => this.interface.addChannel(ch));
    c.on('channelDelete', ch => this.interface.removeChannel(ch));

    c.on('guildCreate', g => this.interface.addGuild(g));
    c.on('guildDelete', g => this.interface.removeGuild(g));

    c.on('guildMemberAdd', m => this.interface.addMember(m));
  }

  private _ready(): void {
    this.interface.init(this.discordClient).then(() => this.emit('ready', this));
  }
}