export namespace DOMUtil {
    export function isVisible(element: HTMLElement | null) {
        if (!element) return false
        // https://stackoverflow.com/a/21696585
        return element.offsetParent !== null
    }
}