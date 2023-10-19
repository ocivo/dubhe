export namespace IOUtil {

    export function downloadPng(dataURL: string, filename: string): void { 
        const a = document.createElement('a')

        a.setAttribute('download', filename)
        a.setAttribute('href', dataURL)
        a.click()
    }

    export function base64ToBlob(base64: string): Blob {
        // Code taken from https://github.com/ebidel/filer.js

        const parts = base64.split(';base64,')
        const contentType = parts[0].split(':')[1]
        const raw = window.atob(parts[1])
        const rawLength = raw.length
        const uInt8Array = new Uint8Array(rawLength)

        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i)
        }

        return new Blob([uInt8Array], {type: contentType} )
    }

    export function download(
        data: string | Blob,
        filename: string = '未命名',
        contentType: string = 'text/plain'
    ): void {
        const objectData = data instanceof Blob ? data : new Blob([data], { type: contentType })
        const objectURL = URL.createObjectURL(objectData)
        const link = document.createElement('a')
        link.href = objectURL
        link.download = filename
        link.click()
        setTimeout(() => {
            // Firefox, necessary to delay revoking the ObjectURL
            URL.revokeObjectURL(objectURL)
        }, 100)
    }
}
