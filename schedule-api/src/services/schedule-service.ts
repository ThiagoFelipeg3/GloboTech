import { RequesterFactory } from '../factories/requester-factory';
import { Schedule } from '../interfaces/schedule';

export class ScheduleService implements Schedule {
    constructor (private requester: RequesterFactory) {}

    async games(date: string): Promise<any> {
        const requester = this.requester.createRequester('game', date);
        const response = await requester?.makeRequest();

        return response;
    }
}