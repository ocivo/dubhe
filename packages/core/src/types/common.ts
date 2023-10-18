import { FormInstance } from 'antd'
import { ColumnType } from 'antd/es/table'
import { Rule } from 'antd/es/form'

export type IntentType = 'SUCCESS' | 'FAILED' | 'PRIMARY' | 'DEFAULT' | 'AWAITING'

export type FieldName = any

export type FieldValue = any

export type FormData = Record<FieldName, FieldValue>

export interface Entity {
    id: React.Key
    [propsName: string]: any
}

export type SortOrder = 'ascend' | 'descend'

export interface Sorter {
    sortOrder: SortOrder
    name: string
}

// Select/Radio/Checkbox option
export interface Option {
    label: React.ReactNode
    value: any
    intent?: IntentType
}

export enum RouteType {
    DIR = 0,
    MENU = 1,
    BUTTON = 2,
}

export type AlignType = 'left' | 'right' | 'center'

export interface Route<T extends Route<T> = any> {
    title: string
    key: string
    type: RouteType
    path: string
    children?: Array<T>
}

export interface Menu extends Route<Menu> {
    id: number
    component?: string | null
    permission?: string
    icon?: string
    hidden?: boolean
}

export interface Page {
    current: number
    pageSize: number
    total: number
}

export type AttrType =
    | 'text'
    | 'number'
    | 'textarea'
    | 'switch'
    | 'radio'
    | 'select'
    | 'checkbox'
    | 'date'
    | 'datetime'
    | 'slider'
    | 'custom'

export type FieldRule = Rule

export interface CommonAttr {
    name: string
    label: string
    type?: AttrType
    options?: Option[]
}

export interface FormField extends CommonAttr {
    required?: boolean
    hidden?: boolean
    rules?: FieldRule[]
    disabled?: boolean
    fieldProps?: Record<string, any> | ((item: FormField, form: FormInstance) => Record<string, any>)
    customRender?: (field: FormField, form: FormInstance) => React.FC<any>
    labelRender?: (label: string) => React.ReactNode
    defaultValue?: any
    affectedBy?: (changedValues: FormData | null) => { field?: Partial<FormField>; value?: FieldValue }
}

export type TableCellRender = (value: any, record: any, index: number) => React.ReactNode

export interface TableColumn extends CommonAttr {
    queryable?: boolean
    render?: TableCellRender
    hiddenColumn?: boolean
    isRenderTag?: boolean // render option use Tag element
    sortable?: boolean
    // antd column props
    defaultSortOrder?: SortOrder
    fixed?: 'left' | 'right'
    width?: number | string
    align?: AlignType
    columnProps?: ColumnType<any>
}

export interface Attr extends FormField, TableColumn {
    position?: number // 表单域(待开发)/表格列 排序位置
}

export type DateScale = 'YEAR' | 'MONTH'
