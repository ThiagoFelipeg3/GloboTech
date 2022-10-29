import fetch from 'node-fetch'
import { Method } from '../enums/methods';
import { IRequester, Options } from '../interfaces/requester';

export abstract class Requester implements IRequester {
    protected sufixUrl = 'esportes/futebol/modalidades/futebol_de_campo/categorias/profissional';

    public async makeRequest() {
        const options = await this.getOptions();
        const response = await fetch(this.getUrl(), options);

        return response.json();
    }

    protected generateHeaders() {
        return {
            'Content-type': 'application/json',
        };
    }

    protected generateBody() {
        return {};
    }

    protected abstract getUrl(): string;

    protected abstract getOptions(): Options;

    protected abstract getMethod(): Method;
}
