import { Controller } from '../interfaces/controller';
import { HttpRequest, HttpResponse } from '../interfaces/http';
import { Schedule } from '../interfaces/schedule';
import { ok, serverError } from '../helpers/http-helper';

class ScheduleController implements Controller {
    constructor(private scheduleService: Schedule) {}

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const { date } = httpRequest?.params;
            const response = await this.scheduleService.games(date);

            return ok(response);
        } catch (error) {
            return serverError(error as Error);
        }
    }

}

export default ScheduleController;
