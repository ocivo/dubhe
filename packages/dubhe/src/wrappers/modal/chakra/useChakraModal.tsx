import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalContentProps,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    ModalProps,
    useDisclosure,
} from '@chakra-ui/react'
import { isFunction } from 'lodash'
import React, { useMemo, useRef } from 'react'

export interface ChakraModalParams {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}

export interface ChakraModalProps
    extends Omit<ModalProps, 'children' | 'isOpen' | 'onClose'>,
        Partial<ChakraModalParams> {
    content: React.ReactNode | ((modal: ChakraModalParams) => React.ReactNode)
    header?: React.ReactNode | ((modal: ChakraModalParams) => React.ReactNode)
    footer?: React.ReactNode | ((modal: ChakraModalParams) => React.ReactNode)
    children?: (modal: ChakraModalParams) => React.ReactNode
    showCloseButton?: boolean
    rerenderOnOpen?: boolean
    modalContentProps?: ModalContentProps
}

export const useChakraModal = (props: ChakraModalProps) => {
    const disclosure = useDisclosure()
    const modalParams: ChakraModalParams = {
        ...disclosure,
        ...props,
    }
    const {
        content,
        isOpen = modalParams.isOpen,
        onClose = modalParams.onClose,
        onOpen = modalParams.onOpen,
        header,
        footer,
        children,
        showCloseButton = true,
        rerenderOnOpen = true,
        modalContentProps = {},
        ...restProps
    } = props
    const modalProps: Omit<ModalProps, 'children'> = {
        ...restProps,
        ...modalParams,
    }

    return {
        Modal: (
            <>
                {children && children({ ...modalParams })}
                <Modal {...modalProps}>
                    <ModalOverlay />
                    <ModalContent {...modalContentProps}>
                        {header && (
                            <ModalHeader>{isFunction(header) ? header({ ...modalParams }) : header}</ModalHeader>
                        )}
                        {showCloseButton && <ModalCloseButton />}
                        <ModalBody>{isFunction(content) ? content({ ...modalParams }) : content}</ModalBody>
                        {footer && (
                            <ModalFooter>{isFunction(footer) ? footer({ ...modalParams }) : footer}</ModalFooter>
                        )}
                    </ModalContent>
                </Modal>
            </>
        ),
        ...disclosure,
    }
}

export const ChakraModal = (props: ChakraModalProps) => {
    const { Modal } = useChakraModal(props)
    return Modal
}
