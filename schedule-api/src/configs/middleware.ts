import { Express, json, Request, Response, NextFunction } from 'express'
import { adaptAuth } from '../adapters/express/auth-adapter'
import { adaptThrottle } from '../adapters/express/throttle-adapter'
import { RedisService } from '../database/redis/redis-service'
import { AuthMiddleware } from '../middleware/auth-middleware'
import { ThrottleMiddleware } from '../middleware/throttle-middleware'

export default (app: Express): void => {
    app.use(json())
    app.use(headers)
    app.use(adaptAuth(new AuthMiddleware()))
    app.use(
        adaptThrottle(
            new ThrottleMiddleware(
                RedisService.getInstance()
            )
        )
    )
}

const headers = (_req: Request, res: Response, next: NextFunction) => {
    res.set('access-control-allow-origin', '*')
    res.set('access-control-allow-methods', '*')
    res.set('access-control-allow-headers', '*')
    res.set('Content-Type', 'application/json')

    next()
}
