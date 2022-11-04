export interface Cache {
    get(key: string): Promise<any>;
    set(
        key: string,
        value: any,
        expireInSeconds: number,
    ): any;
    increment(key: string): any;
}
