export namespace TypeUtil {
    export type ValueOf<T> = T[keyof T]

    export type Mutable<Type> = {
        -readonly [Key in keyof Type]: Type[Key]
    }

    export type MakeRequired<T, K extends keyof T> = Required<Pick<T, K>> & T

    export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

    export type ConstOrMutable<Type> = Type | Readonly<Type>

    export type AddNewElementsType<T, NewType = any> = {
        [K in keyof T]: T[K] | NewType
    }

    export type AsyncFunction<T = any, K = any> = (...args: T[]) => Promise<K>;
}
