import { HttpRequest } from '../interfaces/http';
import { Schedule } from '../interfaces/schedule';
import ScheduleController from './schedule-controller';

const makeScheduleServiceStub = (): Schedule => {
    class ScheduleServiceStub implements Schedule {
        games(date: string): Promise<any> {
            return Promise.resolve({});
        }
    }

    return new ScheduleServiceStub()
}

interface SutTypes {
    sut: ScheduleController
    scheduleServiceStub: Schedule
}

const makeSut = (): SutTypes => {
    const scheduleServiceStub = makeScheduleServiceStub()
    const sut = new ScheduleController(scheduleServiceStub);

    return {
        sut,
        scheduleServiceStub
    }
}

describe('Schedule Controller', () => {
    test('Should call Schedule with correnct values', async () => {
        const { sut, scheduleServiceStub } = makeSut();
        const stubSpy = jest.spyOn(scheduleServiceStub, 'games');
        const request: HttpRequest = {
            params: { date: '2021-01-01'}
        }

        await sut.handle(request);
        expect(stubSpy).toHaveBeenCalledWith('2021-01-01');
    });
});