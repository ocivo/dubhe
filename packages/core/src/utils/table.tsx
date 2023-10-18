import { Tag } from '@chakra-ui/react'
import { ColumnType } from 'antd/es/table'
import { Intent, IntentColors, INTENTS } from '../config/constants'
import { Attr, TableCellRender } from '../types/common'
import { Color } from '../types/ui'
import { MapperUtil } from './mapper'
import _ from 'lodash'

export namespace TableUtil {
    export namespace ColumnTransform {
        export type Fn = (attrs: Attr[]) => Attr[]

        export const mapFn =
            (fn: (attr: Attr) => Attr): Fn =>
            (attrs) =>
                attrs.map((e, i) => fn(e))

        export const renderOptions = (attr: Attr, colors: Color[] = IntentColors): Attr => {
            let render: ((value: string) => JSX.Element) | undefined = undefined
            if (Array.isArray(attr.options)) {
                render = (value: string) => {
                    const option = attr.options!.find((o) => o.value === value)
                    const label = option !== undefined ? option.label : '未定义'
                    return attr.isRenderTag ? (
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
                ...attr,
            }
        }

        export const renderSwitch = (attr: Attr): Attr => {
            if (attr.type === 'switch' && !attr.render) {
                return { ...attr, render: (value) => <>{value ? '是' : '否'}</> }
            }
            return attr
        }

        export const DEFAULTS: Fn[] = [mapFn(renderOptions), mapFn(renderSwitch)]
    }

    export interface AttrsToTableColumnsProps {
        attrs: Attr[]
        transforms?: ColumnTransform.Fn[]
        withActions?: TableCellRender
    }

    export const attrsToTableColumns = (props: AttrsToTableColumnsProps): Array<ColumnType<any>> => {
        const { attrs, transforms = ColumnTransform.DEFAULTS, withActions } = props
        let midAttrs = attrs
        transforms.forEach((transform) => {
            midAttrs = transform(midAttrs)
        })
        midAttrs = midAttrs.sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
        if (withActions) {
            midAttrs.push({
                label: '操作',
                name: '__action',
                render: withActions,
                fixed: 'right',
                width: 20
            })
        }
        return midAttrs
            .filter((e: Attr) => !e.hiddenColumn)
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

    export const extendsBaseAttrs = (
        attrs: Attr[],
        excludes?: ('id' | 'createTime' | 'updateTime')[],
        includes?: ('createBy' | 'updateBy')[]
    ): Attr[] => {
        excludes = excludes || []
        includes = includes || []
        let baseAttrs: Attr[] = []
        if (!excludes.includes('id')) {
            baseAttrs.push({
                name: 'id',
                label: '编号',
                hidden: true,
                hiddenColumn: true,
            })
        }
        baseAttrs = baseAttrs.concat(attrs)
        if (!excludes.includes('createTime')) {
            baseAttrs.push({
                name: 'createTime',
                label: '创建时间',
                width: 180,
                hidden: true,
                sortable: true,
                defaultSortOrder: 'descend',
            })
        }
        if (!excludes.includes('updateTime')) {
            baseAttrs.push({
                name: 'updateTime',
                label: '更新时间',
                width: 180,
                hidden: true,
                sortable: true,
            })
        }
        if (includes.includes('createBy')) {
            baseAttrs.push({
                name: 'createBy',
                label: '创建人',
                width: 140,
                hidden: true,
                sortable: true,
            })
        }
        if (includes.includes('updateBy')) {
            baseAttrs.push({
                name: 'updateBy',
                label: '更新人',
                width: 140,
                hidden: true,
                sortable: true,
            })
        }
        return baseAttrs
    }
}
