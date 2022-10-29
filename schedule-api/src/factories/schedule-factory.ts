import ScheduleController from '../controllers/schedule-controller';
import { Controller } from '../interfaces/controller';

export const makeScheduleController = (): Controller => {
    return new ScheduleController();
}
