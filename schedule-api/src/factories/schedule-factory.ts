import { Controller } from '../interfaces/controller';
import { HttpRequest, HttpResponse } from '../interfaces/http';

export const makeScheduleController = (): Controller => {
    return new ScheduleController();
}

class ScheduleController implements Controller {
    handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        return Promise.resolve( {
            statusCode: 200,
            body: {}
        })
    }
}
