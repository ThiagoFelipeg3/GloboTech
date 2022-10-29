import { IRequester } from '../interfaces/requester';
import { Schedule } from '../interfaces/schedule';

class ScheduleService implements Schedule {
    constructor (private requester: IRequester) {}

    games(date: string): Promise<any> {
        return Promise.resolve();
    }
}