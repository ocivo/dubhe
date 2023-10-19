import React from "react"

export namespace ValidatorUtil {
    export function isClassComponent(component: any) {
        return typeof component === 'function' && !!component.prototype.isReactComponent
    }

    export function isFunctionComponent(component: any) {
        return typeof component === 'function' && String(component).includes('return React.createElement')
    }

    export function isReactComponent(component: any) {
        return isClassComponent(component) || isFunctionComponent(component)
    }

    export function isElement(element: any) {
        return React.isValidElement(element)
    }

    export function isDOMTypeElement(element: any) {
        return isElement(element) && typeof element.type === 'string'
    }

    export function isCompositeTypeElement(element: any) {
        return isElement(element) && typeof element.type === 'function'
    }
}
