import hashJS from 'hash.js'
export namespace CodecUtil {
    export function encodeBase64(str: string) {
        return btoa(encodeURIComponent(str))
    }

    export function decodeBase64(str: string) {
        return decodeURIComponent(atob(str))
    }

    export function hashStringToInt(str: string, range: number) {
        // By chatGPT
        const hash = hashJS.sha256().update(str).digest('hex')
        const maxInt = parseInt('ffffffff', 16) // 16进制表示的最大整数
        const num = parseInt(hash.slice(0, 8), 16) // 取哈希结果的前8位作为整数
        const factor = range / maxInt // 计算乘数因子
        return Math.floor(num * factor) // 将结果映射到指定范围内
    }
}
