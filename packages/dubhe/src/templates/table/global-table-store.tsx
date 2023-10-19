import React, { useContext, useRef } from 'react'
import { createStore, useStore } from 'zustand'
import { TableProps as AntTableProps } from 'antd'
import { StateUtil } from '../../utils'

export interface GlobalTableProps extends Pick<AntTableProps<any>, 'size' | 'bordered'> {
    pageSize: number
}

export interface GlobalTableState extends GlobalTableProps {
    setSize(size: GlobalTableProps['size']): void
    setBordered(bordered: GlobalTableProps['bordered']): void
    setPageSize(pageSize: number): void
}

const zState = StateUtil.createMutableZustandState((initProps?: Partial<GlobalTableProps>) => {
    const DEFAULT_PROPS: GlobalTableProps = {
        size: 'middle',
        bordered: true,
        pageSize: 10,
    }
    return createStore<GlobalTableState>()((set, get) => ({
        ...DEFAULT_PROPS,
        ...(initProps ?? {}),
        setSize: (size) => {
            set({ size })
        },
        setBordered: (bordered) => {
            set({ bordered })
        },
        setPageSize: (pageSize) => {
            set({ pageSize })
        },
    }))
})

export const GlobalTableContext = zState.Context

export const GlobalTableProvider = zState.Provider

export const useGlobalTableContext = zState.useContext
