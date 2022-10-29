import { Controller } from '../interfaces/controller';
import { HttpRequest, HttpResponse } from '../interfaces/http';
import { Schedule } from '../interfaces/schedule';

class ScheduleController implements Controller {
    constructor(private scheduleService: Schedule) {}

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const { date } = httpRequest?.params;
        const response = await this.scheduleService.games(date);

        return {
            statusCode: 200,
            body: response
        }
    }

}

export default ScheduleController;
