import { BoxProps } from '@chakra-ui/react'
import { Color } from '../types'
export namespace StyleUtil {
    export function getBoxOverflowProps(color: Color = "gray.50"): Partial<BoxProps> {
        return {
            overflowY: 'auto',
            css: {
                '&::-webkit-scrollbar': {
                    width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                    width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: color,
                    borderRadius: '24px',
                },
            },
        }
    }
}
