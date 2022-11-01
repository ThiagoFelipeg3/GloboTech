import { ServerError } from '../exceptions/server-error'
import { HttpResponse } from '../interfaces/http'

export const ok = (data: any): HttpResponse => ({
    statusCode: 200,
    body: data
})

export const badRequest = (error: Error): HttpResponse => ({
    statusCode: 400,
    body: error
})

export const notFound = (error: Error): HttpResponse => ({
    statusCode: 404,
    body: error
})

export const serverError = (error: Error): HttpResponse => ({
    statusCode: 500,
    body: new ServerError(error?.stack || '')
})
