import { UploadOutlined } from '@ant-design/icons'
import { Button, message, Upload, UploadFile, UploadProps } from 'antd'
import { AxiosRequestConfig } from 'axios'
import { rest } from 'lodash'
import React, { useState } from 'react'

export interface AntdUploadProps extends UploadProps {
    api(formData: any, config: AxiosRequestConfig): Promise<any>
}

export const useAntdUpload = (props: AntdUploadProps) => {
    const { api, name = 'file', data = {}, children, onChange, beforeUpload, ...restProps } = props
    // const [fileList, setFileList] = useState<UploadFile[]>([])
    const [uploading, setUploading] = useState(false)

    const customRequest: UploadProps<any>['customRequest'] = (options) => {
        const { onSuccess, onError, file, onProgress } = options

        setUploading(true)
        const formData = new FormData()
        const config = {
            headers: { 'content-type': 'multipart/form-data' },
            onUploadProgress: (event: any) => {
                onProgress?.({ percent: (event.loaded / event.total) * 100 })
            },
        }
        formData.append(name, file)
        for (const [key, val] of Object.entries(data)) {
            formData.append(key, val)
        }

        api(formData, config)
            .then((res) => {
                onSuccess?.(res)
                setUploading(false)
            })
            .catch((err) => {
                onError?.(err)
                setUploading(false)
            })
    }
    return {
        // fileList,
        // setFileList,
        uploading,
        upload: (
            <Upload
                name={name}
                data={data}
                customRequest={customRequest}
                onChange={(info) => {
                    if (info.file.status === 'done') {
                        message.success(`${info.file.name} 上传成功`)
                    } else if (info.file.status === 'error') {
                        message.error(`${info.file.name} 上传失败`)
                    }
                    onChange?.(info)
                }}
                // TODO setFileList
                beforeUpload={(file, internalFileList) => {
                    const result = beforeUpload?.(file, internalFileList)
                    // if (result) {
                    //     setFileList([...fileList, file])
                    // }
                    return result
                }}
                // onRemove={(file) => {
                //     const index = fileList.indexOf(file)
                //     const newFileList = fileList.slice()
                //     newFileList.splice(index, 1)
                //     setFileList(newFileList)
                // }}
                // fileList={fileList}
                {...restProps}>
                {children ? children : <Button icon={<UploadOutlined />}>上传文件</Button>}
            </Upload>
        ),
    }
}

export const AntdUpload = (props: AntdUploadProps) => {
    const { upload } = useAntdUpload(props)
    return upload
}
