import { Form, FormInstance } from 'antd'
import _ from 'lodash'
import React, { useCallback, useMemo } from 'react'
import { getFieldComponentFromMap } from './field-components'
import { FieldRule, FormField } from '../../../types'
import { ReactUtil } from '../../../utils'

export interface AntdFormFieldsProps {
    form: FormInstance
    fields: FormField[]
    fieldsLayout?: (items: Array<{ element: JSX.Element; field: FormField }>) => JSX.Element[] | JSX.Element
}

export const AntdFormFields = (props: AntdFormFieldsProps) => {
    const { form, fields, fieldsLayout } = props
    const getRules = useCallback((item: FormField) => {
        const rules: FieldRule[] = []
        if (item.required) {
            rules.push({
                required: true,
                message: `${item.label}不能为空`,
            })
        }
        return rules.concat(item.rules || [])
    }, [])

    const renderItems = useMemo(() => {
        const filFields = fields.filter((item) => !item.hidden)
        const items = filFields.map((field) => {
            return (
                <Form.Item
                    name={field.name}
                    key={field.name}
                    label={field.labelRender ? field.labelRender(field.label) : field.label}
                    rules={getRules(field)}
                    valuePropName={field.type === 'switch' ? 'checked' : 'value'}>
                    {getFieldComponentFromMap(field.type, form)(field, form)}
                </Form.Item>
            )
        })
        const renderItems = fieldsLayout
            ? fieldsLayout(_.zip(items, filFields).map(([element, field]) => ({ element: element!, field: field! })))
            : items

        return Array.isArray(renderItems) ? ReactUtil.renderElementsWithKey(renderItems) : renderItems
    }, [fields])
    return <>{renderItems}</>
}
