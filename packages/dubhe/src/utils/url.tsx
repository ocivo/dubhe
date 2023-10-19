export namespace URLUtil {
    export function getSearchObject(search: string) {
        const searchParams = new URLSearchParams(search)
        const searchObject: any = {}
        for (const [key, value] of Object.entries(searchParams)) {
            searchObject[key] = value
        }
        return searchObject
    }
}