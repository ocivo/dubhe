import { AxiosInstance } from 'axios';
import { QueryRequestParams, QueryResult } from '../../../types';

type Entity = any

export const API_create =
    (instance: AxiosInstance, path: string) =>
    (entity: Entity): Promise<Entity> =>
        instance.post(`${path}`, entity)

export const API_update =
    (instance: AxiosInstance, path: string) =>
    (entity: Entity): Promise<Entity> =>
        instance.put(`${path}`, entity)

export const API_query =
    (instance: AxiosInstance, path: string) =>
    (params: QueryRequestParams): Promise<QueryResult> =>
        instance.get(`${path}`, { params })

export const API_findById =
    (instance: AxiosInstance, path: string) =>
    (id: React.Key): Promise<any> =>
        instance.get(`${path}/${id}`)

export const API_delete =
    (instance: AxiosInstance, path: string) =>
    (id: React.Key): Promise<any> =>
        instance.delete(`${path}/${id}`)

export const API_batchDelete =
    (instance: AxiosInstance, path: string) =>
    (ids: React.Key[]): Promise<any> =>
        instance.delete(`${path}/batch`, { data: ids })

export const createCommonAPIs = (instance: AxiosInstance, path: string) => ({
    query: API_query(instance, path),
    add: API_create(instance, path),
    remove: API_delete(instance, path),
    removeBatch: API_batchDelete(instance, path),
    update: API_update(instance, path),
    findById: API_findById(instance,path),
})

export type CommonAPI = ReturnType<typeof createCommonAPIs>
