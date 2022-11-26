import { limitExceededError, unauthorized } from '../helpers/http-helper';
import { Cache } from '../interfaces/cache';
import { ThrottleMiddleware } from '../middleware/throttle-middleware';

import dotenv from 'dotenv';
dotenv.config();

const mockCache = () => {
    class MockCache implements Cache {
        public async get(key: string): Promise<any> {}
        public set(key: string, value: any, expireInSeconds: number) {}
        public increment(key: string): any {}
        public async eval(
            script: string,
            key: string,
            window: number,
            limit: number,
            numberKeys = 1
        ): Promise<boolean> {
            return Promise.resolve(false);
        }
    }

    return new MockCache();
};

const makeSut = () => {
    const cache = mockCache();
    const sut = new ThrottleMiddleware(cache);

    return {
        sut,
        cache
    };
}

describe('ThrottleMiddleware Middleware', () => {
    test('Should return 429 if it exceeds the number of requests', async () => {
        const { sut, cache } = makeSut()
        jest.spyOn(cache,  'eval').mockReturnValueOnce(Promise.resolve(true));
        const httpResponse = await sut.handle()

        expect(httpResponse).toEqual(limitExceededError())
    })

    test('Should return void when limit is not exceeded', async () => {
        const { sut } = makeSut();
        const httpResponse = await sut.handle()

        expect(httpResponse).toEqual(undefined);
        expect(httpResponse).toBeUndefined
    })
});