import { isNil, isObject } from 'lodash'
import React from 'react'

export namespace ReactUtil {
    export function renderElementsWithKey(elements: JSX.Element[]): JSX.Element[] {
        if (elements.every((v) => !isNil(v.key))) return elements
        // console.log(elements)
        return elements.map((e, i) => React.cloneElement(e, { key: isNil(e.key) ? `$_auto_inject_key_${i}` : e.key }))
    }

}
