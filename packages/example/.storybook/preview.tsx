import { GlobalProvider } from '../../dubhe/src/templates/global/GlobalProvider'
import React from "react"
import type { Preview } from '@storybook/react'

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    decorators: [
        (Story) => (
            <GlobalProvider>
                <Story />
            </GlobalProvider>
        ),
    ],
}

export default preview
