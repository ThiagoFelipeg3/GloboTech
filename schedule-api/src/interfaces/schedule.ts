export interface Schedule {
    games: (date: string) => Promise<any>
}
