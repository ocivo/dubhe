import { Box } from '@chakra-ui/react'
import { Form, FormProps } from 'antd'
import { FormInstance } from 'antd/lib/form/Form'
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { AntdFormFields, AntdFormFieldsProps } from './AntdFormFields'
import { useControlAntdForm } from './hooks/useControlAntdForm'
import { useHandleFormDependencies } from './hooks/useHandleFormDependencies'
import { DOMUtil } from '../../../utils'

export interface AntdFormProps extends Omit<FormProps, 'fields'>, Omit<AntdFormFieldsProps, 'form'> {
    values?: any // 表单数据
    onChange?: (values: any) => void // 数据变更回调
    control?: boolean // 数据外部可控
    children?: React.ReactNode
}

export interface AntdFormRef {
    form: FormInstance<any>
}

export const AntdForm = React.forwardRef<AntdFormRef, AntdFormProps>((props, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const { form: outerForm, fields, fieldsLayout, values = {}, onChange = () => {}, control, children, ...restProps } = props
    const [form] = Form.useForm(outerForm)

    useControlAntdForm(form, props)

    // fields dependencies change handle
    const { handleFieldsDependencies, processedFields } = useHandleFormDependencies({
        fields,
        values,
        updateFormData: (d) => {
            if (DOMUtil.isVisible(containerRef.current)) {
                form.setFieldsValue(d)
            }
        },
    })

    // outer control
    useImperativeHandle(
        ref,
        () => ({
            form,
        }),
        [fields]
    )

    return (
        <Box ref={containerRef}>
            <Form
                form={form}
                initialValues={values}
                onValuesChange={(changedValues, allValues) => {
                    handleFieldsDependencies(changedValues)
                    onChange({ ...allValues })
                }}
                {...restProps}>
                <AntdFormFields fields={processedFields} fieldsLayout={fieldsLayout} form={form}></AntdFormFields>
                {children}
            </Form>
        </Box>
    )
})
