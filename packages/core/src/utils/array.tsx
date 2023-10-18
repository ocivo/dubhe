export namespace ArrayUtil {
    export function shallowEqual<T>(a: Array<T>, b: Array<T>, equalityFn?: (a: T, b: T) => boolean): boolean {
        if (a.length !== b.length) return false
        equalityFn = equalityFn ?? ((a, b) => a === b)
        return a.every((item, index) => equalityFn!(item, b[index]))
    }

    export function shuffleArray(array: any[], n: number = -1): any[] {
        if (n >= array.length || n < 0) {
            n = array.length - 1
        }
        const newArray = [...array];
        for (let i = n; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    export function generateArrayStep(start: number, stop: number, step: number = 1): number[] {
        if (step == 0 || (start < stop && step < 0) || (start > stop && step > 0)) {
            return []
        }
        const sub = start < stop ? stop - start : start - stop
        if (sub < step) {
            return []
        }
        const array: number[] = [];
        for (let i = start; i <= stop; i += step) {
            array.push(i);
        }
        return array;
    }
}
