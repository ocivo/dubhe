import React, { useContext, useRef } from 'react'
import { createStore, useStore } from 'zustand'
import { useGlobalTableContext } from './global-table-store'
import { Page, Sorter } from '../../types'

export interface ITableProps {
    data: any[]
    pageSize: number
    pageNum: number
    total: number // For page
    searchParams: {}
    sort: string
    selectedRowKeys: React.Key[]
    activeRow: any
}

export interface ITableState extends ITableProps {
    setData(data: any): void
    setTotal(total: number): void
    setPage(page: Page): void
    resetPage(): void
    setSearchParams(searchParams: any): void
    setActiveRow(activeRow: any): void
    setSelectedRowKeys(selectedRowKeys: React.Key[]): void
    setSort(sorts: Array<Sorter>): void
}

export const createTableStore = (initProps?: Partial<ITableProps>) => {
    const DEFAULT_PROPS: ITableProps = {
        data: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
        searchParams: {},
        sort: '',
        selectedRowKeys: [],
        activeRow: null,
    }
    return createStore<ITableState>()((set, get) => ({
        ...DEFAULT_PROPS,
        ...initProps,
        setData: (data) => set({ data }),
        setTotal: (total) => set({total}),
        setPage: (page) => set({ pageSize: page.pageSize, pageNum: page.current, total: page.total }),
        resetPage: () => set({ pageNum: 1 }),
        setSearchParams: (searchParams) => set({ searchParams }),
        setActiveRow: (activeRow) => set({ activeRow }),
        setSelectedRowKeys: (selectedRowKeys) => set({ selectedRowKeys }),
        setSort: (sorts) =>
            set({
                sort: sorts.map((e) => `${e.sortOrder === 'ascend' ? '+' : '-'}${e.name}`).join(','),
            }),
    }))
}

export type ITableStore = ReturnType<typeof createTableStore>

export const TableContext = React.createContext<ITableStore>(null as any)

export const TableProvider = (props: React.PropsWithChildren<Partial<ITableProps>>) => {
    const pageSize = useGlobalTableContext((s) => s.pageSize)
    const {children, ...tableProps} = props
    const store = useRef<ITableStore>(createTableStore({ pageSize, ...tableProps })).current
    return <TableContext.Provider value={store}>{props.children}</TableContext.Provider>
}

export function useTableContext<T>(
    selector: (state: ITableState) => T,
    equalityFn?: (left: T, right: T) => boolean
): T {
    const store = useContext(TableContext)
    if (!store) throw new Error('Missing TableContext.Provider in the tree')
    return useStore(store, selector, equalityFn)
}
