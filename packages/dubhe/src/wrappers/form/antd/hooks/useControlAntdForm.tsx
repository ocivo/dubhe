import { FormInstance } from "antd"
import { useEffect } from "react"
import { AntdFormProps } from "../AntdForm"

// 数据储存在表单容器之外, 非必要不使用
export const useControlAntdForm = (form: FormInstance, props: AntdFormProps) => {
    useEffect(() => {
        if (props.control) {
            const oldFieldValues = form.getFieldsValue()
            const newFieldValues = Object.keys(oldFieldValues).reduce((curr: any, key) => {
                curr[key] = undefined
                return curr
            }, {})
            form.setFieldsValue({ ...newFieldValues, ...props.values })
        }
    }, [props.values])
}