import { unauthorized } from '../helpers/http-helper';
import { AuthMiddleware } from './auth-middleware';

describe('AuthMiddleware Service', () => {
    test('Should return 401 if invalid credential are provided', async () => {
        const sut = new AuthMiddleware();

        const httpResponse = await sut.handle({
            headers: {}
        })

        expect(httpResponse).toEqual(unauthorized())
    })
});