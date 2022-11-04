import { Method } from '../enums/methods';
import { Requests } from '../enums/requests';
import { RequesterFactory } from '../factories/requester-factory';
import { Options } from '../interfaces/requester';
import { Schedule } from '../interfaces/schedule';
import { Requester } from '../requesters/requester';
import { ScheduleService } from './schedule-service';
import { Cache } from '../interfaces/cache';

const formattedResponse = require('../../data/mocks/response.json');
const response = require('../../data/mocks/response_jogo_ge.json');

const makeCache = (): Cache => {
    class CacheMock implements Cache {
        public get(key: string): Promise<any> {
            return Promise.resolve()
        }
        public set(key: string, value: any, expireInSeconds: number): any {}

        public increment(key: string) {}
    }

    return new CacheMock();
};

const makeRequesterMock = (): Requester => {
    class RequesterMock extends Requester {
        public async makeRequest() {
            return response;
        }

        protected getUrl(): string {
            return `any_url`;
        }

        public getOptions(): Options {
            const options = {
                method: this.getMethod(),
                headers: this.generateHeaders(),
            };

            return options;
        }

        protected getMethod(): Method {
            return 'GET';
        }
    }

    return new RequesterMock();
}

const makeRequesterFactory = (): RequesterFactory => {
    class RequesterFactoryStub extends RequesterFactory {
        public createRequester(request: Requests, parameter: string ): Requester|null {
            switch (request) {
                case 'game':
                    return makeRequesterMock();
                default:
                    return null;
            }
        }
    }

    return new RequesterFactoryStub()
}

interface SutTypes {
    sut: Schedule
    requesterFactoryStub: RequesterFactory
}

const makeSut = (): SutTypes => {
    const requesterFactoryStub = makeRequesterFactory();
    const sut = new ScheduleService(requesterFactoryStub, makeCache());

    return {
        sut,
        requesterFactoryStub
    }
}

describe('Schedule Service', () => {
    test('Should return with the current format', async () => {
       const { sut } = makeSut();
       const response = await sut.games('any_data');

       expect(response).toEqual(formattedResponse);
    });
});