import { FormInstance } from 'antd/lib/form/Form'
import produce from 'immer'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useMountedState } from 'react-use'
import { FieldName, FieldValue, FormData, FormField } from '../../../../types/common'
import { AntdFormProps } from '../AntdForm'

export interface UseHandleFormDependenciesProps extends Pick<AntdFormProps, 'fields' | 'values'> {
    updateFormData: (values: FormData) => void
}

export const useHandleFormDependencies = (props: UseHandleFormDependenciesProps) => {
    const { values, fields, updateFormData } = props
    const [changedFields, setChangedFields] = useState<Array<Partial<FormField>>>([])
    const [changedValues, setChangedValues] = useState<FormData>({})
    const processedFields: FormField[] = useMemo(() => {
        return produce(fields, (draft) => {
            draft.forEach((f, i) => {
                const changedField = changedFields.find((cf) => cf.name === f.name)
                if (changedField) {
                    draft[i] = { ...f, ...changedField }
                }
            })
        })
    }, [fields, changedFields])
    useEffect(() => {
        updateFormData({ ...changedValues })
    }, [changedValues])

    const handleFieldsDependencies = useCallback(
        (values: Record<FieldName, FieldValue>) => {
            const changedFields: Array<Partial<FormField>> = []
            const changedValues: FormData = {}
            fields
                .filter((e) => e.affectedBy)
                .forEach((field) => {
                    const result = field.affectedBy!(values)
                    if (result.field) {
                        changedFields.push({ ...result.field, name: field.name })
                    }
                    if ('value' in result) {
                        changedValues[field.name] = result.value
                    }
                })
            if (changedFields.length !== 0) {
                setChangedFields(changedFields)
            }
            if (Object.keys(changedValues).length !== 0) {
                setChangedValues(changedValues)
            }
        },
        [fields]
    )
    // TODO FIX: open form and change to select, init not effected when update
    // useEffect(() => {
    //     handleFieldsDependencies(values)
    // }, [fields])

    return {
        processedFields,
        handleFieldsDependencies,
    }
}
