import { NextFunction, Request, Response } from 'express'
import { ThrottleMiddleware } from '../../middleware/throttle-middleware'

export const adaptThrottle = (throttle: ThrottleMiddleware) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const httpResponse = await throttle.handle();

        if (!httpResponse) {
            next();
            return;
        }

        if ('statusCode' in httpResponse) {
            const { statusCode, body } = httpResponse
            const response = statusCode >= 400 ? { error: body.message } : body

            return res.status(statusCode).json(response)
        }

        next();
    }
}
