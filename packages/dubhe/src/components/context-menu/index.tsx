import { Box, Divider, Flex, Stack } from '@chakra-ui/react'
import React, { useCallback, useContext, useMemo, useRef } from 'react'
import ReactDOM from 'react-dom'
import { create, createStore, StoreApi, useStore } from 'zustand'
import { BrowserUtil } from '../../utils'
import { isNil, isString } from 'lodash'
import './index.css'

const MENU_ITEM_HEIGHT = 28
const MENU_MAX_WIDTH = 240

export const CONTEXT_MENU_DIVIDER = Symbol('context-divider')

export interface ContextMenuItemProps {
    label: React.ReactNode
    onSelect?: (item: ContextMenuItemProps, record: any) => void
}

export interface ContextMenuProps {
    items: Array<ContextMenuItemProps | typeof CONTEXT_MENU_DIVIDER>
    width?: number | string
}

export interface ContextMenuStore {
    record: any
    visible: boolean
    x: number
    y: number
    open(record: any, x: number, y: number): void
    close(): void
}

export const useContextMenuStore = create<ContextMenuStore>((set, get) => ({
    record: null,
    visible: false,
    x: 0,
    y: 0,
    open: (record, x, y) => set({ record, visible: true, x, y }),
    close: () => set({ visible: false }),
}))

export const useOnContextMenu = () => {
    const { record, visible, open, close } = useContextMenuStore()
    return useCallback(
        (record: any) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            event.preventDefault()
            if (!visible) {
                document.addEventListener('click', function onClickOutside() {
                    close()

                    document.removeEventListener('click', onClickOutside)
                })
            }
            open(record, event.clientX, event.clientY)
        },
        [record, visible]
    )
}

export const ContextMenuItem = (item: ContextMenuItemProps) => {
    const record = useContextMenuStore((s) => s.record)
    return (
        <Flex
            height={MENU_ITEM_HEIGHT + 'px'}
            fontSize="14px"
            _hover={{ bg: 'gray.100' }}
            px="4"
            alignItems={'center'}
            onClick={() => {
                item.onSelect?.(item, record)
            }}>
            {item.label}
        </Flex>
    )
}

export const ContextMenu = (props: ContextMenuProps) => {
    const { width, items } = props
    const { visible, x, y } = useContextMenuStore()
    // 边缘检测
    const [actualX, actualY] = useMemo(() => {
        const PADDING = 20
        let internalActualX = x
        let internalActualY = y
        const menuWidth = isNil(width) ? MENU_MAX_WIDTH : isString(width) ? parseInt(width) : width
        const menuHeight = items.reduce((total, item) => {
            if (item === CONTEXT_MENU_DIVIDER) {
                total += 1
            } else {
                total += MENU_ITEM_HEIGHT
            }
            return total
        }, 0)
        const [vw, vh] = BrowserUtil.getViewportSize()
        const menuRight = x + menuWidth
        const menuBottom = y + menuHeight
        if (menuRight >= vw - PADDING) {
            internalActualX -= menuWidth
        }
        if (menuBottom >= vh - PADDING) {
            internalActualY -= menuHeight
        }
        return [internalActualX, internalActualY]
    }, [x, y, items, width])
    if (!visible) return null
    // const [actualX, actualY] = [0, 0]
    return ReactDOM.createPortal(
        <Flex
            flexDir={'column'}
            className="my-contextmenu"
            zIndex={9999}
            bg="white"
            pos="absolute"
            left={`${actualX}px`}
            top={`${actualY}px`}
            boxShadow="md"
            borderColor={'gray.100'}
            borderWidth="1px"
            overflow={'hidden'}
            w={isNil(width) ? MENU_MAX_WIDTH : width}
            maxW={MENU_MAX_WIDTH}
            py="1"
            cursor={'pointer'}
            borderRadius={'4px'}>
            {items.map((item, i) => {
                if (item === CONTEXT_MENU_DIVIDER) return <Box key={i} bg="gray.200" w="full" h="1px"></Box>
                return <ContextMenuItem {...item!} key={i}></ContextMenuItem>
            })}
        </Flex>,
        document.body!
    )
}
