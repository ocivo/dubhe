import React from 'react'
import { useNavigate } from 'react-router-dom'

class ExceptionHandlerContent extends React.Component<any> {
    componentDidCatch(error: any, info: any) {
        console.log("error", error)
        console.log(this.props.router)
        this.props.router.navigate('/error')
    }
    render() {
        return this.props.children
    }
}

export const ExceptionHandler = (props: React.PropsWithChildren) => {
    const navigate = useNavigate()
    return <ExceptionHandlerContent router={navigate}>{props.children}</ExceptionHandlerContent>
}
