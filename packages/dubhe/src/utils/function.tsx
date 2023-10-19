export namespace FunctionUtil {
    export function asyncWithCallback<T extends (...p: any[]) => Promise<void>>(fn: T, callback?: Function): T {
        const retFn = async (...params: Parameters<T>) => {
            const result = await fn(...params)
            await callback?.()
            return result
        } 
        return retFn as any as T
    }
}
