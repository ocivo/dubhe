import useRequest from '@ahooksjs/use-request'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useTableContext } from './table-store'
import { ITableTemplateProps } from './TableTemplate'
import { TypeUtil } from '../../utils'
import { CommonAPI } from '../../wrappers/request/axios/api'
import { QueryRequestParams } from '../../types'

export interface ITableFetchProps {
    api: TypeUtil.MakeRequired<Partial<CommonAPI>, 'query'>
    fetchData(): Promise<void>
    fetchDataLater(): void
}

export const TableFetchContext = createContext<ITableFetchProps>({} as any)

export const useTableFetchContext = () => useContext(TableFetchContext)

export const TableFetchProvider = (props: React.PropsWithChildren<Pick<ITableTemplateProps, 'api'>>) => {
    const { api } = props
    const [fetchCount, setFetchCount] = useState(0)
    const [setData, setTotal, pageSize, pageNum, total, setPage, searchParams, sort] = useTableContext((state) => [
        state.setData,
        state.setTotal,
        state.pageSize,
        state.pageNum,
        state.total,
        state.setPage,
        state.searchParams,
        state.sort,
    ])
    const { run, loading } = useRequest(api.query, {
        manual: true,
        onSuccess: (data, params) => {
            setData(data.content)
            setTotal(data.total)
        },
    })
    const fetchData = useCallback(async () => {
        const params: QueryRequestParams = { pageNum, pageSize, ...searchParams }
        if (sort) params.sort = sort
        await run(params)
    }, [pageNum, pageSize, searchParams, sort])

    const fetchDataLater = () => {
        setFetchCount(fetchCount + 1)
    }
    useEffect(() => {
        fetchData()
    }, [fetchCount])
    return (
        <TableFetchContext.Provider value={{ fetchDataLater, fetchData, api }}>
            {props.children}
        </TableFetchContext.Provider>
    )
}
