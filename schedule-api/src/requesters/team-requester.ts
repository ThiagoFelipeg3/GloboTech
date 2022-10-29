import { Method } from '../enums/methods';
import { Requester } from './requester';
import env from '../configs/env';
import { Options } from '../interfaces/requester';

export class TeamRequester extends Requester {
    private url = env.esportes_api;

    private method: Method = 'GET';

    constructor(private teamId: string) {
        super();
    }

    protected getUrl(): string {
        return `${this.url}/equipes/${this.teamId}`
    }

    public getOptions(): Options {
        const options = {
            method: this.getMethod(),
            headers: this.generateHeaders(),
        };

        return options;
    }

    protected getMethod(): Method {
        return this.method;
    }
}
