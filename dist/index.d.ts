export declare type sizes = {
    width: number;
    height: number;
};
export declare type coords = {
    x: number;
    y: number;
};
export declare type options = {
    patternWidth?: number;
    patternOffset?: coords;
    patternFileType?: string;
    backgroundColor?: string;
};
export default function makePattern(path: string, width: number, height: number, options?: options): string;
