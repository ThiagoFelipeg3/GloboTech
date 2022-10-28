import { Router } from 'express'
import { adaptExpress } from '../adapters/express/express-adapter'
import { makeScheduleController } from '../factories/schedule-factory'

export default (router: Router): void => {
    router.get('/schedule', adaptExpress(makeScheduleController()))
}
