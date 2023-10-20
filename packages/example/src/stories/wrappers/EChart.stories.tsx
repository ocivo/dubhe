import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react'

import { DEFAULT_EASY_OPTION, EChart, EChartProps } from 'dubhe'
import _ from 'lodash'

const meta: Meta<typeof EChart> = {
    component: EChart,
    decorators: [
        (Story) => (
            <Box w="100%" h="400px">
                {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
                <Story />
            </Box>
        ),
    ],
}

export default meta

type Story = StoryObj<typeof EChart>

const data = _.range(1, 8)

export const Default: Story = {
    args: {
        option: {
            xAxis: {
                data: data.map((e) => `X${e}`),
            },
            yAxis: {},
            series: [
                {
                    name: 'Ctg1',
                    type: 'bar',
                    data: data,
                },
                {
                    name: 'Ctg2',
                    type: 'bar',
                    data: data.map((d) => d * 2),
                },
                {
                    name: 'Ctg3',
                    type: 'line',
                    data: data.map((d) => d * Math.random()),
                },
            ],
        },
    },
}

type ColorArray = ['color1', 'color2', 'color3', 'color4', 'color5', 'color6', 'color7']

type EasyOptionArgs = React.ComponentProps<typeof EChart> &
    EChartProps['easyOption'] & { [K in ColorArray[number]]: string }

export const EasyOption: StoryObj<EasyOptionArgs> = {
    args: {
        option: Default.args?.option,
        padding: '10px',
        legend: false,
        ...Object.fromEntries(DEFAULT_EASY_OPTION.colors!.map((e, i) => [`color${i + 1}`, e])),
    },
    render: (args) => {
        const { option, padding, legend, ...restArgs } = args
        return <EChart option={option} easyOption={{ padding, legend, colors: Object.values(restArgs) as string[]}}></EChart>
    },
}
