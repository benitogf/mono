import {useEffect} from 'react'
import { Navigate } from 'react-router-dom'

const Logout = ({dispatch}) => {
    useEffect(() => {
        window.localStorage.setItem('account', '')
        window.localStorage.setItem('token', '')
        dispatch({ type: "status", data: 'unauthorized' })
    }, [dispatch])
    return <Navigate to="/" />
}

export default Logout