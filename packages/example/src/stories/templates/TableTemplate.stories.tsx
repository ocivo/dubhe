import { Box, Flex } from '@chakra-ui/react'
import { faker } from '@faker-js/faker'
import { Meta, StoryObj } from '@storybook/react'
import { GlobalTableProvider, MapperUtil, TableTemplate } from 'dubhe'
import produce from 'immer'
import _ from 'lodash'
import { useState } from 'react'
import shortUUID from 'short-uuid'

const meta: Meta<typeof TableTemplate> = {
    component: TableTemplate,
    decorators: [
        (Story) => (
            <GlobalTableProvider>
                <Flex w="full">
                    <Story />
                </Flex>
            </GlobalTableProvider>
        ),
    ],
}

export default meta

type Story = StoryObj<typeof TableTemplate>

const DEFAULT_DATA = _.range(100).map((e) => {
    return {
        id: e + 1,
        name: faker.name.fullName(),
        age: faker.datatype.number({ min: 10, max: 80 }),
        city: faker.address.city(),
        sex: ['FEMALE', 'MALE'][faker.datatype.number(1)],
    }
})

export const Default: Story = {
    args: {
        fields: [
            {
                name: 'id',
                label: 'ID',
                sortable: true,
                hidden: true,
                defaultSortOrder: 'descend',
            },
            {
                name: 'name',
                label: 'NAME',
                queryable: true,
                required: true,
                width: 200,
                sortable: true,
            },
            {
                name: 'age',
                label: 'AGE',
                queryable: true,
                required: true,
                type: 'number',
                width: 40,
            },
            {
                name: 'sex',
                label: 'SEX',
                queryable: true,
                type: 'radio',
                options: MapperUtil.stringArrayToOptions(['FEMALE', 'MALE']),
                defaultValue: 'MALE',
                isRenderTag: true,
            },
            {
                name: 'city',
                label: 'CITY',
                type: 'select',
                queryable: true,
                fixed: 'right',
                render: (value, record) => <Box fontWeight={'bold'}>{value}</Box>,
                defaultValue: 'Beijing',
                options: MapperUtil.stringArrayToOptions(['New York', 'Tokyo', 'Beijing']),
            },
        ],
    },
    render: (args) => {
        const [data, setData] = useState<Array<any>>(DEFAULT_DATA)
        const [idCount, setIdCount] = useState(DEFAULT_DATA.length)
        const getId = () => {
            const newId = idCount + 1
            setIdCount(newId)
            return newId
        }
        const add = async (record: any) => {
            setData(
                produce(data, (draft) => {
                    data.push({
                        ...record,
                        id: getId(),
                    })
                }),
            )
        }
        const update = async (record: any) => {
            setData(
                produce(data, (draft) => {
                    const idx = data.findIndex((e) => e.id === record.id)
                    if (idx >= 0) {
                        draft[idx] = { ...record }
                    }
                }),
            )
        }
        const remove = async (id: React.Key) => {
            setData(data.filter((e) => e.id !== id))
        }

        const removeBatch = async (ids: React.Key[]) => {
            setData(data.filter((e) => !ids.includes(e.id)))
        }
        return (
            <TableTemplate
                fields={args.fields}
                api={{
                    query: async (params) => {
                        const { pageSize = 1, pageNum = 1, sort, ...searchParams } = params
                        const start = pageSize * (pageNum - 1)
                        const end = pageSize * pageNum
                        const handledData = data.filter((e) => {
                            for (const [key, value] of Object.entries(searchParams)) {
                                if (value === undefined) continue
                                console.log(e[key], value, searchParams)
                                if (e[key] == value) {
                                    return true
                                }
                                return false
                            }
                            return true
                        })
                        if (sort) {
                            const sorts = sort.split(',')
                            for (const s of sorts) {
                                const order = s[0]
                                const name = s.slice(1)
                                handledData.sort((a, b) => {
                                    if (a.name === b.name) return 0
                                    return (order === '+' ? a[name] < b[name] : a[name] > b[name]) ? -1 : 1
                                })
                            }
                        }
                        console.log(params, "....")

                        return { content: handledData.slice(start, end), total: handledData.length }
                    },
                    add,
                    update,
                    remove,
                    removeBatch,
                }}></TableTemplate>
        )
    },
}
