import { Controller } from '../interfaces/controller';
import { HttpRequest, HttpResponse } from '../interfaces/http';

class ScheduleController implements Controller {
    handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        return Promise.resolve( {
            statusCode: 200,
            body: {}
        })
    }

}

export default ScheduleController;
