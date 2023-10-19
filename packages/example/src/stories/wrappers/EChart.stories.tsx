import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react'

import { EChart } from 'dubhe'

const meta: Meta<typeof EChart> = {
    component: EChart,
    decorators: [
        (Story) => (
            <Box w="800px" h="400px">
                {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
                <Story />
            </Box>
        ),
    ],
}

export default meta

type Story = StoryObj<typeof EChart>

export const Primary: Story = {
    args: {
        option: {
            xAxis: {
                data: ['X1', 'X2', 'X3'],
            },
            yAxis: {},
            series: [
                {
                    name: 'Ctg1',
                    type: 'bar',
                    data: [1, 2, 3],
                },
                {
                    name: 'Ctg2',
                    type: 'line',
                    data: [1, 2, 3].map((d) => d * 2),
                },
            ],
        },
    },
}
