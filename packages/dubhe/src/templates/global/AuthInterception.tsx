import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export interface IAuthInterceptionProps extends React.PropsWithChildren {
    authenticated?: boolean
    redirect?: string
}

export const AuthInterception = (props: IAuthInterceptionProps) => {
    const { authenticated, redirect = '/login' } = props
    const navigate = useNavigate()
    useEffect(() => {
        if (!authenticated) {
            navigate(redirect)
        }
    }, [authenticated])
    return <React.Fragment>{authenticated ? props.children : 'not authenticated'}</React.Fragment>
}
