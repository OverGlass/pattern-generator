declare type coords = {
    x: number;
    y: number;
};
declare type options = {
    patternWidth?: number;
    patternOffset?: coords;
    backgroundColor?: string;
};
export default function makePattern(path: string, width: number, height: number, options?: options): string;
export {};
