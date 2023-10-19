import { Box, Button, Flex, HStack, SimpleGrid } from '@chakra-ui/react'
import React, { useState, useMemo, useCallback } from 'react'
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai'
import { useTableContext } from '../table-store'
import { Field, FormField, Option } from '../../../types'
import { AntdForm } from '../../../wrappers'

export interface TableSearchProps {
    fields: Field[]
    columns?: number
    onQuery: (searchParams: any) => void
    onReset: () => void
}

export const TableSearch = (props: TableSearchProps) => {
    const [searchParams, setSearchParams] = useTableContext((s) => [s.searchParams, s.setSearchParams])
    const { columns = 3, onQuery = () => {}, onReset = () => {}, fields: fields } = props
    const [expand, setExpand] = useState(false)
    const formFields = useMemo(() => {
        return fields
            .filter((e) => e.queryable)
            .map((e) => {
                let type: FormField['type'] = e.type ?? 'text'
                let options: Option[] | undefined = e.options ?? undefined
                if (['select', 'radio'].includes(type)) {
                    type = 'select'
                } else if (type === 'switch') {
                    type = 'select'
                    options = [
                        { label: '是', value: true },
                        { label: '否', value: false },
                    ]
                } else if (type === 'number') {
                    type = 'number'
                } else {
                    type = 'text'
                }
                return {
                    ...e,
                    rules: [],
                    required: false,
                    label: '',
                    type,
                    options,
                    fieldProps: {
                        placeholder: `请输入${e.label}查询`,
                    },
                } as FormField
            })
    }, [])
    const visibleFormFields = useMemo(() => {
        const fields = expand ? formFields : formFields.slice(0, columns)
        return fields.map((f) => ({ ...f, hidden: false }))
    }, [formFields, expand])
    return (
        <Flex justify="space-between">
            <Box width={3 / 4}>
                <AntdForm
                    fields={visibleFormFields}
                    values={searchParams}
                    onChange={setSearchParams}
                    control
                    fieldsLayout={(items) => (
                        <SimpleGrid columns={columns} gap={'8px'}>
                            {items.map(({ element }) => React.cloneElement(element, { style: { marginBottom: 0 } }))}
                        </SimpleGrid>
                    )}></AntdForm>
            </Box>
            <Box>
                <HStack>
                    <Button
                        colorScheme={'brand'}
                        size="sm"
                        onClick={() => {
                            onQuery(searchParams)
                        }}>
                        查询
                    </Button>
                    <Button
                        size="sm"
                        colorScheme={'brand'}
                        variant={'outline'}
                        onClick={() => {
                            setSearchParams({})
                            onReset()
                        }}>
                        重置
                    </Button>
                    {formFields.length > columns ? (
                        <Button
                            variant={'link'}
                            size="sm"
                            onClick={() => setExpand(!expand)}
                            rightIcon={expand ? <AiOutlineUp /> : <AiOutlineDown />}>
                            {expand ? '收起' : '展开'}
                        </Button>
                    ) : null}
                </HStack>
            </Box>
        </Flex>
    )
}
