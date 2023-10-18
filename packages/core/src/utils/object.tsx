import _ from 'lodash'

export namespace ObjectUtil {
    export function remove<T extends { [key: string]: any }>(
        obj: T,
        pred: ([key, value]: [keyof T, T[keyof T]]) => boolean
    ): T {
        return Object.fromEntries(Object.entries(obj).filter((params) => !pred(params))) as T
    }

    function traverse(obj: { [key: string]: any }, fn: (val: any, key: string) => void) {
        _.forIn(obj, function (val, key) {
            fn(val, key)
            if (_.isArray(val)) {
                val.forEach(function (el) {
                    // not exec in array elements
                    if (_.isPlainObject(el)) {
                        traverse(el, fn)
                    }
                })
            }
            if (_.isPlainObject(key)) {
                traverse(obj[key], fn)
            }
        })
    }
}
