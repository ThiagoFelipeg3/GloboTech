export class ApiLimitExceededError extends Error {
    constructor() {
        super('API Limit Exceeded!');

        this.name = 'ApiLimitExceededError'
    }
}
