import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { useLocation } from 'react-use'
import { Route, RouteType } from '../../types'
import { TreeUtil } from '../../utils'

export interface BreadcrumbNavProps {
    title?: string
    routes: Route[]
    home?: string
}

export const useBreadcrumbNav = (props: BreadcrumbNavProps) => {
    const { routes, home = '/home' } = props
    const location = useLocation()
    const nodePaths = useMemo(() => {
        const paths: Route[] = []
        TreeUtil.find(
            routes,
            (node) => {
                return node.path == location.pathname
            },
            paths
        )
        return paths
    }, [location.pathname])
    return {
        Nav: (
            <Breadcrumb>
                <BreadcrumbItem>
                    <BreadcrumbLink href={home}>首页</BreadcrumbLink>
                </BreadcrumbItem>
                {nodePaths.map((e, i) => {
                    const href = e.path !== location.pathname && (e.type === RouteType.MENU) ? e.path : undefined
                    return (
                        <BreadcrumbItem key={i}>
                            <BreadcrumbLink href={href}>{e.title}</BreadcrumbLink>
                        </BreadcrumbItem>
                    )
                })}
            </Breadcrumb>
        ),
        title: nodePaths.length > 0 ? nodePaths[nodePaths.length - 1].title : '',
    }
}

export const BreadcrumbNav = (props: BreadcrumbNavProps) => {
    const { Nav } = useBreadcrumbNav(props)
    return Nav
}
