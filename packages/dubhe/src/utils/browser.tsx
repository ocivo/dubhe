export namespace BrowserUtil {
    export function getViewportSize() {
        return [
            window.innerWidth || document.documentElement.clientWidth,
            window.innerHeight || document.documentElement.clientHeight,
        ]
    }
}
