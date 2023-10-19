import { FormInstance, Input, InputNumber, Radio, Select, Switch, Slider } from 'antd'
import { get, isFunction } from 'lodash'
import React, {useMemo} from 'react'
import {SwitchProps} from "antd/es/switch";
import { FieldType, FormField } from '../../../types';

const SwitchWrapper = (props: SwitchProps & {checked: any}) => {
    const {checked} = props
    const value: boolean = useMemo(() => !!checked, [checked]);
    return <Switch {...props} checked={value}></Switch>
}

function createFieldFn<P extends {}>(
    fc: React.FC<P>,
    props?: Partial<P> | ((item: FormField, form: FormInstance) => Partial<P>)
) {
    return (item: FormField, form: FormInstance): React.FunctionComponentElement<any> => {
        const defaultProps = isFunction(props) ? props(item, form) : props
        return React.createElement(fc, {
            ...defaultProps,
            disabled: item.disabled,
            ...(isFunction(item.fieldProps) ? item.fieldProps(item, form) : item.fieldProps),
        } as P)
    }
}

type ReturnedField = ReturnType<typeof createFieldFn>

export const DEFAULT_FIELD_COMPONENT: ReturnedField = createFieldFn(Input)

// 表单域配置与antd组件映射
export const getFieldComponentFromMap = (key: FieldType | undefined, form: FormInstance): ReturnedField => {
    const FIELD_COMPONENT_MAP: Partial<Record<FieldType, ReturnedField>> = {
        text: DEFAULT_FIELD_COMPONENT,
        number: createFieldFn(InputNumber, { style: { width: '100%' } }),
        textarea: createFieldFn(Input.TextArea, { rows: 5 }),
        select: createFieldFn(Select, (item) => ({ options: item.options || [] })),
        switch: createFieldFn(SwitchWrapper),
        radio: createFieldFn(Radio.Group, (item) => ({ options: item.options || [] })),
        slider: createFieldFn(Slider as any),
        custom: (item) => {
            if (!isFunction(item.customRender)) {
                throw new Error('自定义渲染需要定义渲染方法')
            }
            return React.createElement(item.customRender(item, form), {
                ...(isFunction(item.fieldProps) ? item.fieldProps(item, form) : item.fieldProps),
            })
        },
    }
    return get(FIELD_COMPONENT_MAP, key || 'text', DEFAULT_FIELD_COMPONENT)
}

export const fieldHasOptions = (key: FieldType) => ['select', 'radio'].includes(key)
