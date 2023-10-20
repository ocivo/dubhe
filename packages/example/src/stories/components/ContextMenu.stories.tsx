import { Box, Button, Flex } from '@chakra-ui/react'
import { Meta, StoryObj } from '@storybook/react'
import { CONTEXT_MENU_DIVIDER, ContextMenu, useOnContextMenu } from 'dubhe'

const meta: Meta<typeof ContextMenu> = {
    component: ContextMenu,
    decorators: [
        (Story) => (
            <Flex w="full" h="800px" bg="gray.200" justify={'center'}>
                <Story />
            </Flex>
        ),
    ],
}

export default meta

type Story = StoryObj<typeof ContextMenu>

export const Default: Story = {
    args: {
        items: [
            {
                label: 'item-1',
                onSelect: (item) => alert('hello ' + item.label),
            },
            CONTEXT_MENU_DIVIDER,
            {
                label: 'item-2',
                onSelect: (item) => alert('hello ' + item.label),
            },
        ],
    },
    argTypes: {
        width: {
            control: { type: 'number', max: 240 }
        },
    },
    render: (args) => {
        const onContextMenu = useOnContextMenu()
        return (
            <Box
                w="full"
                h="full"
                pos="relative"
                onContextMenu={(event) => {
                    onContextMenu({ dataX: 'this is data X' })(event)
                }}>
                <ContextMenu {...args}></ContextMenu>
            </Box>
        )
    },
}
