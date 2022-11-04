import * as redis from 'redis';
import configRedis from '../../configs/redis';
import { Cache } from '../../interfaces/cache';

import { promisify } from 'util';
import * as zlib from 'zlib';

export class RedisService implements Cache {
    private static instance: RedisService;

    protected client;

    protected prefixKey = 'schedule-api-';

    constructor() {
        this.client = RedisService.connect(configRedis.api);
    }

    public static getInstance(): RedisService {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService();
        }

        return RedisService.instance;
    }

    public static connect(configs: any) {
        return redis
            .createClient(configs as redis.ClientOpts)
            .on('connect', () => console.log(new Date(), 'Redis connected!'))
            .on('end', () => console.log(new Date(), 'Redis disconnected!'))
            .on('reconnecting', () =>
                console.log(new Date(), 'Redis reconnecting...'),
            )
            .on('ready', () => console.log(new Date(), 'Redis ready!'))
            .on('error', e => console.log(e.message));
    }

    public async get(key: string): Promise<any> {
        try {
            const getAsync = promisify(this.client.get).bind(this.client);
            const value = await getAsync(this.formatKey(key));

            if (value) {
                return this.uncompress(value);
            }
        } catch (error) {
            /** continue regardless of error */
        }
    }

    public set(key: string, value: any, expireInSeconds: number) {
        try {
            const formattedKey = this.formatKey(key);
            const compressedData = this.compress(value);

            this.client.set(formattedKey, compressedData);
            this.client.expire(formattedKey, expireInSeconds);
        } catch (error) {
            /** continue regardless of error */
        }
    }

    public increment(key: string): any {
        try {
            this.client.incr(this.formatKey(key));
            this.client.expire(this.formatKey(key), 3600);
        } catch (error) {
            /** continue regardless of error */
        }
    }

    private uncompress(data: any): any {
        try {
            const buffer = Buffer.from(data, 'base64');
            const uncompressed = zlib.unzipSync(buffer);

            return JSON.parse(uncompressed.toString());
        } catch (error) {
            return JSON.parse(data);
        }
    }

    private compress(data: any): string {
        if (typeof data === 'object') {
            const dataString = JSON.stringify(data);
            const buffer = Buffer.from(dataString, 'utf8');
            return zlib.deflateSync(buffer).toString('base64');
        }

        return zlib.deflateSync(data).toString('base64');
    }

    private formatKey(key: string) {
        if (key.match(this.prefixKey)) {
            return key;
        }

        return `${this.prefixKey}${key}`;
    }

}
