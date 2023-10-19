import { Box, Button, ButtonGroup } from '@chakra-ui/react'
import { FormInstance, message } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { isNil } from 'lodash'
import React, { ForwardedRef, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai'
import shortUUID from 'short-uuid'
import { AntdForm, AntdFormProps, ChakraModalParams, useAntdModal, useChakraModal } from '../../../wrappers'
import { TypeUtil } from '../../../utils'
import { Field } from '../../../types'

export interface MutationFormProps {
    fields: Field[]
    values?: any
    formProps?: Omit<AntdFormProps, 'fields'>
    onSubmit: (values: any) => Promise<void>
    submitTitle?: React.ReactNode
    header?: React.ReactNode
    triggerElement?: React.ReactElement
    onCloseModal?: () => void
}

export interface MutationFormRef extends ChakraModalParams {
    form: FormInstance<any>
}

export const MutationForm = React.forwardRef<MutationFormRef, MutationFormProps>((props, ref) => {
    const { fields, onSubmit, submitTitle, header, triggerElement, values, onCloseModal, formProps, ...restProps } =
        props
    const [form] = useForm()
    const { onClose, onOpen, isOpen, Element } = useAntdModal({
        title: header,
        children: (
            <AntdForm
                form={form}
                fields={fields}
                values={values}
                labelCol={{ span: 6 }}
                labelWrap={true}
                {...formProps}></AntdForm>
        ),
        footer: (
            <ButtonGroup>
                <Button
                    onClick={async () => {
                        const values = await form.validateFields()
                        await onSubmit(values)
                        onClose()
                    }}
                    colorScheme="brand">
                    {submitTitle}
                </Button>
                <Button onClick={() => onClose()}>关闭</Button>
            </ButtonGroup>
        ),
    })

    useImperativeHandle(
        ref,
        () => ({
            form,
            isOpen,
            onOpen,
            onClose,
        }),
        [fields],
    )
    return (
        <>
            {Element}
            {triggerElement && React.cloneElement(triggerElement, { onClick: onOpen })}
        </>
    )
})

export const CreationForm = React.forwardRef<MutationFormRef, MutationFormProps>((props, ref) => {
    const [key, setKey] = useState<string>(shortUUID.generate())
    const { fields } = props
    const values = Object.fromEntries(fields.filter((e) => !isNil(e.defaultValue)).map((e) => [e.name, e.defaultValue]))
    return (
        <MutationForm
            key={key}
            ref={ref}
            submitTitle="创建"
            header="新增"
            triggerElement={
                <Button size="sm" colorScheme="blue" leftIcon={<AiOutlinePlus></AiOutlinePlus>}>
                    新增
                </Button>
            }
            onCloseModal={() => setKey(shortUUID.generate())}
            values={values}
            {...props}></MutationForm>
    )
})

export const UpdateForm = React.forwardRef<MutationFormRef, TypeUtil.MakeRequired<MutationFormProps, 'values'>>(
    (props, ref) => {
        const [key, setKey] = useState<string>(shortUUID.generate())
        return (
            <MutationForm
                ref={ref}
                submitTitle="更新"
                key={key}
                header="修改"
                onCloseModal={() => setKey(shortUUID.generate())}
                {...props}></MutationForm>
        )
    },
)
