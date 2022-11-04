import { unauthorized } from '../helpers/http-helper';
import { HttpRequest, HttpResponse } from '../interfaces/http';

export class AuthMiddleware {

    private useAuth: boolean;
    private keys: Array<any> = [];

    constructor() {
        this.useAuth = ['1', 'true'].includes(process.env.AUTH_ENABLED || 'false');

        if (process.env.KEYS != undefined) {
            this.keys = process.env.KEYS.split(",");
        }
    }

    handle(request: HttpRequest): HttpResponse|object {
        if (!this.useAuth) {
            return {};
        }

        const token = !!request.headers['x-secret'] ? request.headers['x-secret'] : null;

        if (token == null || !this.keys.includes(token)) {
            return unauthorized();
        }

        return {};
    }
}