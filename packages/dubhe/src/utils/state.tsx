import React, { useContext, useRef } from 'react'
import { StoreApi, createStore, useStore } from 'zustand'

export namespace StateUtil {
    export const createZustandState = <T,>(store: StoreApi<T>) => {
        return createMutableZustandState(() => store)
    }

    export function createMutableZustandState<Props extends State, State>(
        createMutableStore: (initProps?: Partial<Props>) => StoreApi<State>
    ) {
        /**
         * interface CustomProps {
         *     A: number
         * }
         *
         * interface CustomState extends CustomProps {
         *     setA: (a: number) => void
         * }
         *
         * const zState = StateUtil.createMutableZustandState((initProps?: Partial<CustomProps>) => {
         *     return createStore<CustomState>()((set, get) => ({
         *         A: 0,
         *         ...(initProps ?? {}),
         *         setA: (a: number) => {
         *             set({ A: a })
         *         },
         *     }))
         * })
         *
         * export const CustomContext = zState.Context
         *
         * export const CustomProvider = zState.Provider
         *
         * export const useCustomContext = zState.useContext
         */
        const Context = React.createContext<StoreApi<State>>(null as any)

        const Provider = (props: React.PropsWithChildren<Partial<Props>>) => {
            const store = useRef<StoreApi<State>>(createMutableStore(props)).current
            return <Context.Provider value={store}>{props.children}</Context.Provider>
        }

        const useStoreContext = <K,>(selector: (state: State) => K, equalityFn?: (left: K, right: K) => boolean): K => {
            const store = useContext(Context)
            if (!store) throw new Error(`Missing context in the tree`)
            return useStore(store, selector, equalityFn)
        }

        return { Context, Provider, useContext: useStoreContext }
    }
}
