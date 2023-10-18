export type HttpResult<T> = Promise<{
    data: T
    message: string
    code: number
}>

export interface QueryResult<T = any> {
    total: number
    content: T[]
}

export interface QueryRequestParams {
    pageNum?: number
    pageSize?: number
    sort?: string
    [prop: string]: any // 查询字段
}