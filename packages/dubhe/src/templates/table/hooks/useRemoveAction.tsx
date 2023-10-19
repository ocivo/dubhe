import { message, Modal } from 'antd'
import React, { useCallback } from 'react'

export interface RemoveActionProps {
    remove?: (id: React.Key) => Promise<any>
    removeBatch?: (id: React.Key[]) => Promise<any>
    onOk?: () => void
    onError?: () => void
}
export const useRemoveAction = (props: RemoveActionProps) => {
    const { remove, removeBatch, onOk, onError } = props

    const removeAction = useCallback((id: React.Key | React.Key[]) => {
        const isBatch = Array.isArray(id)
        if (isBatch && id.length == 0) {
            message.warning('请至少选择一项')
            return
        }
        Modal.confirm({
            title: '确认删除吗',
            onOk: async () => {
                try {
                    await (isBatch ? removeBatch?.(id) : remove?.(id))
                    onOk?.()
                } catch (e) {
                    onError?.()
                }
            },
        })
    }, [])

    return removeAction
}
