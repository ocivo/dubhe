import { message } from 'antd'
import { isNil } from 'lodash'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

export interface CreateAxiosInstanceProps {
    baseURL: string
    getAuth: () => { tokenName: string; tokenValue: string }
}

export const createAxiosInstance = ({ baseURL, getAuth }: CreateAxiosInstanceProps) => {
    const instance = axios.create({
        baseURL,
        withCredentials: false, // CORS
    })

    instance.interceptors.request.use(
        (config) => {
            // auth token
            const tokenName = getAuth().tokenName
            const tokenValue = getAuth().tokenValue
            if (tokenName && tokenValue) {
                config.headers![tokenName] = tokenValue
            }
            return config
        },
        (err) => {
            return Promise.reject(err)
        }
    )

    instance.interceptors.response.use(
        function (response) {
            if (response.status === 200) {
                if (!isNil(response.data?.code) && response.data?.data !== undefined) {
                    // console.log('Response:', response.data)
                    if (response.data.code === 0) {
                        return Promise.resolve(response.data.data)
                    } else {
                        const error = response.data?.message || '[RESPONSE] Unknown error'
                        message.warning(error)
                        return Promise.reject(error)
                    }
                }
                return response.data
            } else {
                return Promise.reject('[REQUEST] API is not compatible')
            }
        },
        function (error) {
            message.error(error?.message || '')
            return Promise.reject(error)
        }
    )
    return instance
}

const mockInstance = createAxiosInstance({ getAuth: () => ({} as any), baseURL: '' })

export const mockRequest = new MockAdapter(mockInstance, { delayResponse: 500 })
