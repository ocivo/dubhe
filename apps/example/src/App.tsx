import { TimeUtil, MutationButton, GlobalProvider } from 'dubhe'
import { useState } from 'react'
import { Box } from '@chakra-ui/react'

function App() {
    const [value, setValue] = useState('Didi')

    return (
        <GlobalProvider>
            <Box p={8}>
                <MutationButton
                    request={async () => {
                        return new Promise((res, rej) => {
                            setTimeout(() => {
                                res('Hello')
                            }, 3000)
                        })
                    }}
                    onSuccess={(value) => {
                        setValue(value)
                    }}>
                    {value}
                </MutationButton>
                <Box h={8}></Box>
                <h3>{TimeUtil.formatDuration('2022-10-10', '2022-12-12')}</h3>
            </Box>
        </GlobalProvider>
    )
}

export default App
