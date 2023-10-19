import { Box, theme } from '@chakra-ui/react'
import { ECharts, EChartsOption } from 'echarts'
import * as echarts from 'echarts'
import produce from 'immer'
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

export interface EChartRef {
    instance?: ECharts
}

export interface EChartEasyOption {
    padding?: string | number
    legend?: boolean
    colors?: string[]
}

export interface EChartProps {
    option: EChartsOption
    easyOption?: EChartEasyOption
}

const DEFAULT_EASY_OPTION: EChartEasyOption = {
    padding: '10%',
    legend: false,
    colors: ["#36A2EB", "#FF6384", "#4BC0C0", "#FF9F40", "#9966FF", "#FFCD56", "#C9CBCF"], // Ref: chart.js
}

const DEFAULT_OPTION: Pick<EChartsOption, 'backgroundColor'> = {
    backgroundColor: theme.colors.gray['50'],
}

const mergeOption = (option: EChartsOption, easyOption?: EChartEasyOption) => {
    const eOption = { ...DEFAULT_EASY_OPTION, ...easyOption }
    return produce(option, (draft) => {
        if (!draft.grid) {
            const padding = eOption.padding
            draft.grid = {
                left: padding,
                right: padding,
                top: padding,
                bottom: padding,
            }
        }
        if (!draft.color) {
            draft.color = eOption.colors
        }
        if (!draft.backgroundColor) {
            draft.backgroundColor = DEFAULT_OPTION.backgroundColor as string
        }
        if (!draft.legend) {
            if (eOption.legend) {
                draft.legend = {
                    data: (draft.series as any[]).map((s) => s.name),
                }
            }
        }
    })
}

{
    /* <ECharts
    option={{
        xAxis: {
            data: ['X1', 'X2', 'X3'],
        },
        yAxis: {},
        series: [
            {
                name: 'Ctg1',
                type: 'bar',
                data,
            },
            {
                name: 'Ctg2',
                type: 'line',
                data: data.map(d => d* 2),
            },
        ],
    }}></ECharts> */
}
export const EChart = React.forwardRef<EChartRef, EChartProps>((props, ref) => {
    const { option, easyOption } = props
    const chartRef = useRef<HTMLDivElement | null>(null)
    const [instance, setInstance] = useState<ECharts>()

    // Functions
    const resizeChart = useCallback(
        echarts.throttle(() => instance?.resize(), 200),
        [instance]
    )

    // Init
    useEffect(() => {
        const chartDom = chartRef.current
        if (!chartDom) return
        const instance = echarts.init(chartDom)
        setInstance(instance)
        return () => {
            instance.dispose()
        }
    }, [])

    // Events
    useEffect(() => {
        if (instance) {
            window.addEventListener('resize', resizeChart)
            return () => {
                window.removeEventListener('resize', resizeChart)
            }
        }
    }, [instance])

    // SetOption
    useEffect(() => {
        if (instance) {
            const mergedOption = mergeOption(option, easyOption)
            console.log('Echarts Option:', mergedOption)
            instance.setOption(mergedOption)
        }
    }, [instance, option, easyOption])

    // Provide instance
    useImperativeHandle(
        ref,
        () => ({
            instance,
        }),
        [instance]
    )

    return <Box w="full" h="full" ref={chartRef}></Box>
})
