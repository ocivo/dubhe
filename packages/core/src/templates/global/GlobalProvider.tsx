import React from 'react'

// UI
import { ConfigProvider, theme as antdTheme } from 'antd'
import { ThemeConfig as AntdThemeConfig } from 'antd/es/config-provider/context'
import zhCN from 'antd/lib/locale/zh_CN'

// Server state
import { QueryClient, QueryClientProvider } from 'react-query'
import {
    ChakraProvider,
    ColorModeProvider,
    ColorModeScript,
    extendTheme,
    ThemeConfig,
    ThemeProvider,
    theme as chakraTheme,
    mergeThemeOverride,
    useTheme,
    useColorMode,
} from '@chakra-ui/react'

const queryClient = new QueryClient()

const baseChakraTheme = extendTheme(chakraTheme, (theme) =>
    mergeThemeOverride(theme, {
        styles: {
            global: {},
        },
        colors: {
            brand: chakraTheme.colors['blue'],
        },
        semanticTokens: {
            colors: {
                'content-bg': { _light: '#FAFBFE', _dark: 'gray.900' },
                'secondary-text-color': { _light: 'gray.500', _dark: 'gray.400' },
            },
        },
        components: {
            Button: {
                baseStyle: {
                    borderRadius: '2px',
                },
                defaultProps: {
                    size: 'sm',
                },
            },
            Tag: {
                defaultProps: {
                    variant: 'outline',
                },
            },
        },
    }),
)

const baseAntdTheme: AntdThemeConfig = {
    token: {
        colorPrimary: chakraTheme.colors['blue'][500],
        borderRadius: 2,
        fontSize: 16,
        size: 20,
        colorBorder: chakraTheme.colors.gray['300'],
        colorBorderSecondary: chakraTheme.colors.gray['200'],
    },
}

const { darkAlgorithm, defaultAlgorithm, compactAlgorithm } = antdTheme

export const GlobalProvider = (props: React.PropsWithChildren) => {
    const { colorMode } = useColorMode()
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <ChakraProvider>
                    <ConfigProvider
                        theme={{
                            ...baseAntdTheme,
                            algorithm: [compactAlgorithm].concat([
                                colorMode === 'dark' ? darkAlgorithm : defaultAlgorithm,
                            ]),
                        }}
                        locale={zhCN}>
                        <ThemeProvider theme={baseChakraTheme}>
                            <ColorModeScript />
                            {props.children}
                        </ThemeProvider>
                    </ConfigProvider>
                </ChakraProvider>
            </QueryClientProvider>
        </>
    )
}
