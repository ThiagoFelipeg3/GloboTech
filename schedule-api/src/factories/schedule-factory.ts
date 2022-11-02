import { RedisService } from '../adapters/express/database/redis/redis-service';
import ScheduleController from '../controllers/schedule-controller';
import { Controller } from '../interfaces/controller';
import { ScheduleService } from '../services/schedule-service';
import { RequesterFactory } from './requester-factory';

export const makeScheduleController = (): Controller => {
    return new ScheduleController(
        new ScheduleService(
            new RequesterFactory(),
            RedisService.getInstance()
        )
    );
}
