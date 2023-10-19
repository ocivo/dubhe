import { Field, Option } from '../types'
import { TypeUtil } from './type'

export namespace MapperUtil {

    export function stringArrayToOptions(arr: TypeUtil.ConstOrMutable<string[]>, useIndexAsValue: boolean = false): Option[] {
        return arr.map((s, i) => ({
            label: s,
            value: useIndexAsValue ? i : s,
        }))
    }

    // enum {A, B} => [0, 1]
    export function mapEnumValues<T extends Record<string, any>>(enums: T): Array<TypeUtil.ValueOf<T>> {
        return Object.keys(enums).map(c => enums[c])
    }

    // ["a", "b", "c"] => {a: "a", b: "b", c: "c"}
    export function constArrayToEnum<T>(array: TypeUtil.ConstOrMutable<T[]>): Record<string, T> {
        return Object.fromEntries(array.map(key => ([key, key])))
    }

    // s: ["a", "b", "c"]; t: ["d", "e", "f"]; fn(s, t)("b") == "e"
    export function twoArrayMappingFn<T, E>(sourceArray: TypeUtil.ConstOrMutable<T[]>, targetArray: Array<E>, defaultValue?: E) {
        return function (value: T) {
            const index = sourceArray.indexOf(value)
            if (index >=0 && index < targetArray.length) {
                return targetArray[index]
            }
            return defaultValue
        }
    }
}
