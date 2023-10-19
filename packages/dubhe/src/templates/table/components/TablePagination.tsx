import { Pagination, PaginationProps } from 'antd'
import React from 'react'
import { useTableContext } from '../table-store'

export interface TablePaginationProps extends PaginationProps {}

export const TablePagination = (props: TablePaginationProps) => {
    const [pageSize, pageNum, total, setPage] = useTableContext((s) => [s.pageSize, s.pageNum, s.total, s.setPage])
    return (
        <Pagination
            current={pageNum}
            defaultPageSize={pageSize}
            {...props}
            onChange={(page, size) => {
                setPage({
                    current: page,
                    pageSize: size,
                    total,
                })
                props.onChange?.(page, size)
            }}
            total={total}
        />
    )
}
