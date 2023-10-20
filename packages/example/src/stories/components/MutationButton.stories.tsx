import { Flex } from '@chakra-ui/react'
import { Meta, StoryObj } from '@storybook/react'
import { MutationButton } from 'dubhe'

const meta: Meta<typeof MutationButton> = {
    component: MutationButton,
    decorators: [
        (Story) => (
            <Flex w="full" h="full" justify={'center'}>
                <Story />
            </Flex>
        ),
    ],
}

export default meta

export const Default = () => {
    return (
        <MutationButton
            request={async () =>
                new Promise((res) => {
                    setTimeout(() => res(100), 2000)
                })
            }
            onSuccess={() => {
                alert('hello')
            }}>
            Hello
        </MutationButton>
    )
}
