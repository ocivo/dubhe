export namespace TreeUtil {
    export type ITreeNode<T> = T & {
        children?: T[] | null
    }

    export function flatten<T>(
        nodes: ITreeNode<T>[],
        fn: (item: ITreeNode<T>) => boolean = (item) => true,
        arr: ITreeNode<T>[] = []
    ): T[] {
        return nodes.reduce((prev: ITreeNode<T>[], item: ITreeNode<T>) => {
            let curArr: ITreeNode<T>[] = []
            if (fn(item)) {
                curArr.push(item)
            }
            if (Array.isArray(item.children)) {
                curArr = curArr.concat(flatten(item.children as ITreeNode<T>[], fn, arr) as ITreeNode<T>[])
            }
            return prev.concat(curArr)
        }, arr)
    }

    export function find<T>(nodes: ITreeNode<T>[], fn: (item: ITreeNode<T>) => boolean, nodePaths: T[]) {
        for (const node of nodes) {
            nodePaths.push(node)
            if (fn(node)) {
                return true
            }
            if (Array.isArray(node.children)) {
                const result = find(node.children as ITreeNode<T>[], fn, nodePaths)
                if (result) return true
            }
            nodePaths.pop()
        }
        return false
    }

    export enum ITraverseOrderType {
        NODE_FIRST,
        CHILDREN_FIRST,
    }

    export type ITraverseReturnedFn<T, E> = (node: T, options: ITraverseOptions<T, E>) => E

    export interface ITraverseOptions<T, E> {
        parent?: T | E | null
        depth?: number
        idx?: number
        filter?: (node: E) => boolean
        order?: ITraverseOrderType
        preCall?: (node: T, options: ITraverseOptions<T, E>) => void | null
        postCall?: (node: E, options: ITraverseOptions<T, E>) => void | null
        newChildrenKey?: string
        removeEmptyChildren?: boolean // 空nodes作为空选项
        sortChildren?: (left: E, right: E) => number
    }

    export function traverse<T, E>(
        nodes: ITreeNode<T>[],
        fn: ITraverseReturnedFn<T, E>,
        _options?: ITraverseOptions<T, E>
    ): E[] {
        const options: ITraverseOptions<T, E> = {
            parent: null,
            depth: 0,
            idx: 0,
            filter: (node: E) => node !== null && node !== undefined,
            order: ITraverseOrderType.CHILDREN_FIRST,
            removeEmptyChildren: false,
            ..._options,
        }
        const newNodes = nodes.map((node, curIdx) => {
            if (options.preCall) {
                options.preCall(node, { ...options, idx: curIdx })
            }
            let children: E[] | null = null
            if (options.order === ITraverseOrderType.CHILDREN_FIRST && Array.isArray(node.children)) {
                children = traverse(node.children as ITreeNode<T>[], fn, {
                    ...options,
                    parent: node,
                    depth: options.depth! + 1,
                    idx: curIdx,
                })
            }
            let newNode = fn(node, options) as ITreeNode<E>
            if (options.order === ITraverseOrderType.NODE_FIRST && Array.isArray(newNode.children)) {
                children = traverse(node.children as ITreeNode<T>[], fn, {
                    ...options,
                    parent: newNode,
                    depth: options.depth! + 1,
                    idx: curIdx,
                })
            }
            if (children != null) {
                if (options.sortChildren) {
                    children = children.sort(options.sortChildren)
                }
                newNode = {
                    ...newNode,
                    [options?.newChildrenKey ?? 'children']: children,
                }
            }
            if (options.postCall) {
                options.postCall(newNode, { ...options, idx: curIdx })
            }
            if (newNode.children && options.removeEmptyChildren && newNode.children?.length === 0) {
                delete newNode.children
            }
            return newNode
        })
        if (options.filter) {
            return newNodes.filter(options.filter)
        }
        return newNodes
    }
}
