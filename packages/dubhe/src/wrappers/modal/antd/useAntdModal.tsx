import { Modal, ModalProps } from 'antd'
import React, { useState } from 'react'

export interface AntdModalProps extends ModalProps {}

export const useAntdModal = (props: AntdModalProps) => {
    // Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
    const [visible, setVisible] = useState<boolean>(false)
    const { children, ...restProps } = props
    return {
        Element: (
            <Modal
                open={visible}
                footer={null}
                onCancel={() => {
                    setVisible(false)
                }}
                closable={true}
                {...restProps}>
                {children}
            </Modal>
        ),
        onOpen: () => setVisible(true),
        onClose: () => setVisible(false),
        isOpen: visible,
    }
}
