import {
    Box,
    Button,
    ButtonGroup,
    extendTheme,
    Flex,
    HStack,
    Stack,
    ThemeProvider,
    useDisclosure,
    VStack,
} from '@chakra-ui/react'
import { message, Modal, Pagination, Table, TableProps } from 'antd'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { ITableProps, ITableState, ITableStore, TableProvider, useTableContext } from './table-store'
import { useRemoveAction } from './hooks/useRemoveAction'
import { TableSearch } from './components/TableSearch'
import { CreationForm, MutationFormProps, MutationFormRef, UpdateForm } from './components/MutationForm'
import { TablePagination } from './components/TablePagination'
import { useGlobalTableContext } from './global-table-store'
import { Field, Sorter, TableCellRender } from '../../types'
import { ReactUtil, TableUtil, TypeUtil } from '../../utils'
import { CommonAPI } from '../../wrappers/request/axios/api'
import { TableFetchProvider, useTableFetchContext } from './table-fetch'

type InjectSlot = (defaults: JSX.Element[]) => JSX.Element[]

export interface TableActionHooks {
    // contextValue: Record (add, update, remove) | Id[] (removeBatch)
    post?: (contextData: any, store: ITableState) => Promise<boolean>
    pre?: (contextData: any, store: ITableState) => Promise<boolean>
}

export type DefaultActionType = 'remove' | 'add' | 'update'

export interface TableTemplateProps {
    fields: Field[]
    api: TypeUtil.MakeRequired<Partial<CommonAPI>, 'query'>
    actions?: ((defaults: JSX.Element[]) => (...params: Parameters<TableCellRender>) => JSX.Element[]) | null
    actionHooks?: Partial<Record<DefaultActionType, TableActionHooks>>
    slots?: {
        search?: InjectSlot
        header?: InjectSlot
        footer?: InjectSlot
    }
    tableProps?: TableProps<any>
    formProps?: MutationFormProps['formProps']
}

function withDefault(defaults: JSX.Element[], fn?: (t: JSX.Element[]) => JSX.Element[]): JSX.Element[] {
    return fn ? fn(ReactUtil.renderElementsWithKey(defaults)) : defaults
}

function withHooksAction(action: TypeUtil.AsyncFunction, store: ITableState, hooks?: TableActionHooks) {
    return async (args: any) => {
        if (hooks?.pre) {
            const result = await hooks.pre(args, store)
            if (!result) return
        }
        await action(args)
        if (hooks?.post) {
            const result = await hooks.post(args, store)
        }
    }
}

// TODO 提取所有slots包括updateForm作为组件的一部分
export const TableTemplateBody = (props: TableTemplateProps) => {
    const { fields, slots = {}, actions, actionHooks, tableProps, formProps, api } = props
    const { size, bordered } = useGlobalTableContext((s) => s)
    const { fetchData, fetchDataLater } = useTableFetchContext()
    const tableStore = useTableContext((state) => state)
    const { data, activeRow, setActiveRow, selectedRowKeys, setSelectedRowKeys, setSort, resetPage } = tableStore
    // remove action
    const removeAction = useRemoveAction({ ...api, onOk: fetchData })
    // update form control
    const updateFormRef = useRef<MutationFormRef>(null)
    // inject slots
    const tableSlots: Record<keyof Exclude<TableTemplateProps['slots'], undefined>, JSX.Element[]> = {
        search: withDefault(
            [
                <TableSearch
                    fields={fields}
                    onQuery={() => {
                        resetPage()
                        fetchDataLater()
                    }}
                    onReset={() => {
                        resetPage()
                        fetchDataLater()
                    }}></TableSearch>,
            ],
            slots.search
        ),
        header: withDefault(
            [
                <CreationForm
                    fields={fields}
                    onSubmit={withHooksAction(
                        async (values) => {
                            await api.add?.(values)
                            fetchData()
                        },
                        tableStore,
                        actionHooks?.add
                    )}
                    formProps={formProps}></CreationForm>,
                <Button
                    size="sm"
                    onClick={() => {
                        withHooksAction(
                            async (keys) => removeAction(keys),
                            tableStore,
                            actionHooks?.remove
                        )(selectedRowKeys)
                    }}
                    colorScheme="red"
                    leftIcon={<IoClose></IoClose>}>
                    删除
                </Button>,
            ],
            slots.header
        ),
        footer: withDefault(
            [
                <Flex justifyContent={'center'}>
                    <TablePagination onChange={fetchDataLater} size="small"></TablePagination>
                </Flex>,
            ],
            slots.footer
        ),
    }
    // create actions
    const withActions: TableCellRender | undefined = useMemo(() => {
        // if actions === undefined, default
        if (actions === null) return undefined
        return (value, record, index) => {
            const defaultActions = [
                <Button
                    colorScheme={'blue'}
                    variant={"link"}
                    onClick={() => {
                        setActiveRow(record)
                        updateFormRef.current?.onOpen()
                    }}>
                    编辑
                </Button>,
                <Button
                    colorScheme={'red'}
                    variant={"link"}
                    onClick={() => {
                        withHooksAction(
                            async (record) => {
                                removeAction(record.id)
                            },
                            tableStore,
                            actionHooks?.remove
                        )(record)
                    }}>
                    删除
                </Button>,
            ]
            return (
                <ButtonGroup>
                    {ReactUtil.renderElementsWithKey(
                        actions ? actions(defaultActions)(value, record, index) : defaultActions
                    )}
                </ButtonGroup>
            )
        }
    }, [actions, tableStore])
    // columns
    const columns = useMemo(
        () =>
            TableUtil.fieldsToTableColumns({
                fields,
                withActions,
            }),
        [fields, withActions]
    )
    // default sort
    useEffect(() => {
        const sorts: Sorter[] = fields
            .filter((e) => e.defaultSortOrder)
            .map((e) => ({
                sortOrder: e.defaultSortOrder!,
                name: e.name,
            }))
        setSort(sorts)
        fetchDataLater()
    }, [])
    return (
        // TODO 解耦 template 和 业务逻辑
        <Stack w="full">
            <Box>{ReactUtil.renderElementsWithKey(tableSlots.search)}</Box>
            <Box>
                <HStack>{ReactUtil.renderElementsWithKey(tableSlots.header)}</HStack>
            </Box>
            <Box borderWidth={1}>
                <Table
                    rowKey="id"
                    dataSource={data}
                    columns={columns}
                    pagination={false}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: (selectedRowKeys, selectedRows) => {
                            setSelectedRowKeys(selectedRowKeys)
                        },
                    }}
                    scroll={{
                        x: 'max-content',
                    }}
                    size={size}
                    // bordered={bordered}
                    {...tableProps}
                    onChange={(pagination, filters, sorter, extra) => {
                        const sorts: Sorter[] = (Array.isArray(sorter) ? sorter : [sorter])
                            .filter((e) => e.order)
                            .map((e) => ({
                                sortOrder: e.order!,
                                name: e.field + '',
                            }))
                        setSort(sorts)
                        fetchDataLater()
                        tableProps?.onChange?.(pagination, filters, sorter, extra)
                    }}></Table>
                <UpdateForm
                    ref={updateFormRef}
                    fields={fields}
                    onSubmit={withHooksAction(
                        async (values) => {
                            await api.update?.({ ...activeRow, ...values })
                            fetchData()
                        },
                        tableStore,
                        actionHooks?.update
                    )}
                    values={activeRow}
                    formProps={formProps}></UpdateForm>,
            </Box>
            <Box>{ReactUtil.renderElementsWithKey(tableSlots.footer)}</Box>
        </Stack>
    )
}

/** 如果需要在调用节点使用内部状态，使用:
    1.TableProvider + TableTemplateInternal
    2.TableProvider + TableFetchProvider + TableTemplateBody
 */
export const TableTemplateInternal = (props: TableTemplateProps) => {
    return (
        <TableFetchProvider api={props.api}>
            <TableTemplateBody {...props}></TableTemplateBody>
        </TableFetchProvider>
    )
}

export const TableTemplate = (props: TableTemplateProps & { defaultState?: Partial<ITableProps> }) => {
    const { defaultState, ...rest } = props
    return (
        <TableProvider {...defaultState}>
            <TableTemplateInternal {...rest}></TableTemplateInternal>
        </TableProvider>
    )
}
