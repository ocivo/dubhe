import { Box, Flex, HStack } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react'
import { useArgs } from '@storybook/preview-api'

import { AntdForm, MapperUtil, RuleUtil } from 'dubhe'
import { Button, Divider, Input } from 'antd'
import _ from 'lodash'
import { useRef } from 'react'
import { useForm } from 'antd/es/form/Form'

const meta: Meta<typeof AntdForm> = {
    component: AntdForm,
    decorators: [
        (Story) => (
            <Flex w="full" h="full" justify={'center'}>
                <Story />
            </Flex>
        ),
    ],
    argTypes: { onChange: { action: 'changed' } },
}

export default meta

type Story = StoryObj<typeof AntdForm>

export const Uncontrolled: Story = {
    args: {
        fields: [
            {
                name: 'name',
                label: '姓名',
            },
            {
                name: 'age',
                label: '年龄',
                type: 'number',
                fieldProps: {
                    min: 6,
                    max: 100,
                },
            },
            {
                name: 'city',
                label: '城市',
                type: 'select',
                options: MapperUtil.stringArrayToOptions(['北京', '上海', '广州']),
            },
            {
                name: 'enable',
                label: '可用',
                type: 'switch',
            },
            {
                name: 'slider',
                label: '滑块',
                type: 'slider',
            },
            {
                name: 'requiredText',
                label: '必需字段',
                required: true,
            },
            {
                name: 'radio',
                label: '选项',
                type: 'radio',
                options: MapperUtil.stringArrayToOptions(Array.from({ length: 5 }).map((e, i) => '选项-' + (i + 1))),
            },
        ],
    },
    argTypes: {
        labelCol: {
            control: { type: 'number', min: 1, max: 24 },
            mapping: Object.fromEntries(_.range(1, 24).map((e) => [e, { span: e }])),
        },
        labelAlign: {
            control: { type: 'radio' },
            options: ['left', 'right'],
        },
    },
}

export const Controlled: Story = {
    args: {
        ...Uncontrolled.args,
        values: {
            name: '张三',
            age: 18,
            city: '广州',
            enable: false,
            slider: 50,
            requiredText: '',
            radio: '选项-2',
        },
        control: false,
    },
    argTypes: {
        control: {
            description: '数据是否外部可控(即外部存储数据)',
        },
    },
    parameters: {
        controls: { expanded: true },
    },
    render: (args) => {
        const [_, updateArgs] = useArgs()
        return (
            <AntdForm
                {...args}
                onChange={(values) => {
                    updateArgs({ values })
                }}></AntdForm>
        )
    },
}

export const Custom: Story = {
    args: {
        fields: [
            {
                label: '自定义字段',
                type: 'custom',
                name: 'custom-field',
                customRender: (field, form) => (props: any) => {
                    return (
                        <HStack>
                            <b>
                                {field.type}: {props.value}
                            </b>
                            <Input value={props.value} onChange={(e) => props.onChange(e.target.value)}></Input>
                        </HStack>
                    )
                },
            },
        ],
    },
}

export const Validator: Story = {
    args: {
        fields: [
            {
                label: '手机号',
                name: 'phone',
                required: true,
                rules: [RuleUtil.phone()],
            },
        ],
    },
    render: (args) => {
        const [form] = useForm()

        return (
            <AntdForm form={form} {...args}>
                <Button
                    onClick={() => {
                        form.validateFields()
                    }}>
                    Validate
                </Button>
            </AntdForm>
        )
    },
}

export const Dependent: Story = {
    args: {
        fields: [
            {
                label: '字段A',
                name: 'A',
                required: false,
                affectedBy: (values) => {
                    if (!values) return {}
                    if (values['B'] > 5 && values['B'] <= 10) {
                        return {
                            field: { required: true },
                        }
                    }
                    if (values['B'] > 10) {
                        return {
                            field: { required: true },
                            value: 'B is bigger than 10',
                        }
                    }
                    return {
                        field: { required: false },
                    }
                },
            },
            {
                label: '字段B',
                name: 'B',
                type: 'number',
                fieldProps: {
                    min: 1,
                    max: 20,
                },
            },
        ],
    },
}
