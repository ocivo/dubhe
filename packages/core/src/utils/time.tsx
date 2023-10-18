import dayjs from 'dayjs'

export namespace TimeUtil {
    export function formatDuration(startTime: string, endTime: string) {
        const duration = dayjs.duration(dayjs(endTime).diff(dayjs(startTime)))
        const years = duration.years() ? `${duration.years()} 年 ` : ''
        const months = duration.months() ? `${duration.months()} 月 ` : ''
        const days = duration.days() ? `${duration.days()} 天 ` : ''
        const hours = duration.hours() ? `${duration.hours()} 小时 ` : ''
        const minutes = duration.minutes() ? `${duration.minutes()} 分 ` : ''
        const seconds = duration.seconds() ? `${duration.seconds()} 秒` : ''
        return [years, months, days, hours, minutes, seconds].join("")
    }
}
