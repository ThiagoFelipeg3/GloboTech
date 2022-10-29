import { Method } from '../enums/methods';

export interface IRequester {
    makeRequest(): any;
}

export interface Options {
    method: Method;
    body?: any;
    headers: any;
}
