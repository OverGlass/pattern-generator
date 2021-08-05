declare type coords = {
    x: number;
    y: number;
};
export declare function makePattern(path: string, width: number, height: number, offset?: coords): Promise<string>;
export {};
