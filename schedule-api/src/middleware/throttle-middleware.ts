import { Cache } from '../interfaces/cache';
import { rateLimitScript } from '../helpers/redis/rate-limit-script';
import { limitExceededError } from '../helpers/http-helper';

export class ThrottleMiddleware {

    private defaultLimit = 500;

    private expireSeconds = 60;

    private quantityKey = 'config_quantity_requests';

    constructor(private cache: Cache) {}

    public async handle() {
        if (!process.env.ENABLE_LIMIT_REQUEST) {
            return;
        }

        const isLimited = await this.isLimited();
        if (isLimited) {
            return limitExceededError();
        }
    }

    /**
     * Esse método chama um script no redis p/ realizar operações do rate limit:
     *  - Verificar se o limite no intervalo de tempo ainda não foi atigindo
     *  - Adicionar a req. atual quando houver limite
     *
     * O script retorna 1 caso o limite de requisições seja atingido ou 0 caso não.
     *
     * Em caso de dúvida consultar as docs/ref. abaixo:
     *
     * https://developer.redis.com/develop/dotnet/aspnetcore/rate-limiting/sliding-window/?s=Sliding%20Window
     * https://github.com/phpredis/phpredis#script
     */
    private async isLimited(): Promise<boolean> {
        const limit = Number(process.env.LIMIT_REQUEST_MINUTE) || this.defaultLimit;

        return this.cache.eval(
            rateLimitScript(),
            this.quantityKey,
            this.expireSeconds,
            limit,
        );
    }
}
