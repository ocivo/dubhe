import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
dayjs.extend(relativeTime)
dayjs.extend(duration)