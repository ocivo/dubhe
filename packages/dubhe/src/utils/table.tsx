import { Tag } from '@chakra-ui/react'
import { ColumnType } from 'antd/es/table'
import { Intent, IntentColors, INTENTS } from '../config/constants'
import { Field, TableCellRender } from '../types/common'
import { Color } from '../types/ui'
import { MapperUtil } from './mapper'
import _ from 'lodash'

export namespace TableUtil {
    export namespace ColumnTransform {
        export type Fn = (fields: Field[]) => Field[]

        export const mapFn =
            (fn: (field: Field) => Field): Fn =>
            (fields) =>
                fields.map((e, i) => fn(e))

        export const renderOptions = (field: Field, colors: Color[] = IntentColors): Field => {
            let render: ((value: string) => JSX.Element) | undefined = undefined
            if (Array.isArray(field.options)) {
                render = (value: string) => {
                    const option = field.options!.find((o) => o.value === value)
                    const label = option !== undefined ? option.label : '未定义'
                    return field.isRenderTag ? (
                        <Tag
                            borderRadius={"2px"} // Global theme is not work
                            colorScheme={MapperUtil.twoArrayMappingFn(
                                INTENTS,
                                colors,
                                'blue'
                            )(option?.intent ?? Intent.DEFAULT)}>
                            {label}
                        </Tag>
                    ) : (
                        <>{label}</>
                    )
                }
            }
            return {
                render,
                ...field,
            }
        }

        export const renderSwitch = (field: Field): Field => {
            if (field.type === 'switch' && !field.render) {
                return { ...field, render: (value) => <>{value ? '是' : '否'}</> }
            }
            return field
        }

        export const DEFAULTS: Fn[] = [mapFn(renderOptions), mapFn(renderSwitch)]
    }

    export interface FieldsToTableColumnsProps {
        fields: Field[]
        transforms?: ColumnTransform.Fn[]
        withActions?: TableCellRender
    }

    export const fieldsToTableColumns = (props: FieldsToTableColumnsProps): Array<ColumnType<any>> => {
        const { fields, transforms = ColumnTransform.DEFAULTS, withActions } = props
        let midFields = fields
        transforms.forEach((transform) => {
            midFields = transform(midFields)
        })
        midFields = midFields.sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
        if (withActions) {
            midFields.push({
                label: '操作',
                name: '__action',
                render: withActions,
                fixed: 'right',
                width: 20
            })
        }
        return midFields
            .filter((e: Field) => !e.hiddenColumn)
            .map((c, i) => ({
                title: <div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.label}</div>,
                dataIndex: c.name,
                sorter: c.sortable,
                render: c.render,
                fixed: c.fixed,
                width: c.width,
                defaultSortOrder: c.defaultSortOrder,
                align: c.align,
                ...c.columnProps,
            }))
    }

    export const extendsBaseFields = (
        fields: Field[],
        excludes?: ('id' | 'createTime' | 'updateTime')[],
        includes?: ('createBy' | 'updateBy')[]
    ): Field[] => {
        excludes = excludes || []
        includes = includes || []
        let baseFields: Field[] = []
        if (!excludes.includes('id')) {
            baseFields.push({
                name: 'id',
                label: '编号',
                hidden: true,
                hiddenColumn: true,
            })
        }
        baseFields = baseFields.concat(fields)
        if (!excludes.includes('createTime')) {
            baseFields.push({
                name: 'createTime',
                label: '创建时间',
                width: 180,
                hidden: true,
                sortable: true,
                defaultSortOrder: 'descend',
            })
        }
        if (!excludes.includes('updateTime')) {
            baseFields.push({
                name: 'updateTime',
                label: '更新时间',
                width: 180,
                hidden: true,
                sortable: true,
            })
        }
        if (includes.includes('createBy')) {
            baseFields.push({
                name: 'createBy',
                label: '创建人',
                width: 140,
                hidden: true,
                sortable: true,
            })
        }
        if (includes.includes('updateBy')) {
            baseFields.push({
                name: 'updateBy',
                label: '更新人',
                width: 140,
                hidden: true,
                sortable: true,
            })
        }
        return baseFields
    }
}
