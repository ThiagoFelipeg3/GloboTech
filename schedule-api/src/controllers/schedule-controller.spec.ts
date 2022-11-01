import { serverError, ok } from '../helpers/http-helper';
import { HttpRequest, HttpResponse } from '../interfaces/http';
import { Schedule } from '../interfaces/schedule';
import ScheduleController from './schedule-controller';

const makeFakeRequest = (): HttpRequest => ({
    params: { date: '2021-01-01'}
});

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

        await sut.handle(makeFakeRequest());
        expect(stubSpy).toHaveBeenCalledWith('2021-01-01');
    });

    test('Should return 200 if successful', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest());

        expect(httpResponse).toEqual(ok({}))
    })
});