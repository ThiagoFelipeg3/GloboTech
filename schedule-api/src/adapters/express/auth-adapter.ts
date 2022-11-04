import { NextFunction, Request, Response } from 'express'
import {
    HttpRequest,
} from '../../interfaces/http'
import { AuthMiddleware } from '../../middleware/auth-middleware'

export const adaptAuth = (auth: AuthMiddleware) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const httpRequest: HttpRequest = {
            headers: req.headers
        }
        const httpResponse = await auth.handle(httpRequest)

        if ('statusCode' in httpResponse) {
            const { statusCode, body } = httpResponse
            const response = statusCode >= 400 ? { error: body.message } : body

            return res.status(statusCode).json(response)
        }

        next();
    }
}
