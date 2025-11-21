import { useEffect, useRef, useLayoutEffect, useState } from 'react'
import { domain, ssl } from './config'
import ky from 'ky'
import ooo from 'ooo-client'

const protocol = ssl ? 'https://' : 'http://'
export const prefixUrl = protocol + domain

export const api = ky.extend({ prefixUrl })

export const fetch = async (url, authorize) => {
    try {
        const token = window.localStorage.getItem('token')
        return await api.get(url, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).json()
    } catch (e) {
        console.warn(e)
        if (e && e.response && (e.response.status === 401 || e.response.status === 403)) {
            try {
                await authorize(e)
                const refreshToken = window.localStorage.getItem('token')
                return await api.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + refreshToken
                    }
                }).json()
            } catch (e) {
                throw e
            }
        } else {
            throw e
        }
    }
}

export const put = async (url, authorize, data) => {
    try {
        const token = window.localStorage.getItem('token')
        return await api.put(url, {
            headers: {
                'Authorization': 'Bearer ' + token
            },
            json: data
        }).json()
    } catch (e) {
        console.warn(e)
        if (e && e.response && (e.response.status === 401 || e.response.status === 403)) {
            try {
                await authorize(e)
                const refreshToken = window.localStorage.getItem('token')
                return await api.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + refreshToken
                    },
                    json: data
                }).json()
            } catch (e) {
                throw e
            }
        } else {
            throw e
        }
    }
}

export const unpublish = async (url, authorize) => {
    try {
        const token = window.localStorage.getItem('token')
        return await api.delete(url, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
    } catch (e) {
        console.warn(e)
        if (e && e.response && e.response.status === 401) {
            try {
                await authorize(e)
                const refreshToken = window.localStorage.getItem('token')
                return await api.delete(url, {
                    headers: {
                        'Authorization': 'Bearer ' + refreshToken
                    }
                })
            } catch (e) {
                throw e
            }
        } else {
            throw e
        }
    }
}

export const publish = async (url, data, authorize) => {
    try {
        const token = window.localStorage.getItem('token')
        await api.post(url, {
            headers: {
                'Authorization': 'Bearer ' + token
            },
            json: data
        }).json()
    } catch (e) {
        console.warn(e)
        if (e && e.response && e.response.status === 401) {
            try {
                await authorize(e)
                const refreshToken = window.localStorage.getItem('token')
                await api.post(url, {
                    headers: {
                        'Authorization': 'Bearer ' + refreshToken
                    },
                    json: data
                }).json()
            } catch (e) {
                throw e
            }
        } else {
            throw e
        }
    }
}

export const usePublish = (url, authorize) => (data) => publish(url, data, authorize)

export const useSubscribe = (url) => {
    const [data, setData] = useState(null)
    const socket = useRef(null)

    useEffect(() => {
        const token = window.localStorage.getItem('token')

        if (!socket.current) {
            socket.current = ooo(
                domain + (url ? '/' + url : ''),
                ssl,
                token ? ['bearer', token] : []
            )
            // socket.current.onopen = () => {
            //     console.log('open', url)
            // }
            socket.current.onerror = (e) => {
                console.warn("error:", url, e)
                if (socket.current && socket.current.readyState !== WebSocket.CLOSED && socket.current.readyState !== WebSocket.CLOSING) {
                    // socket.current.close()
                    // socket.current = null
                    setData(null)
                }
            }
            socket.current.onmessage = (_data) => {
                setData(_data)
            }
            // socket.current.onfreeze = () => {
            //     console.log('freeze')
            // }
            // socket.current.onresume = () => {
            //     console.log('resume')
            // }
        }

        if (socket.current && socket.current.wsUrl) {
            const socketUrl = socket.current.wsUrl.split(domain + '/')[1]
            if (socketUrl !== url && socketUrl !== undefined && socketUrl !== null) {
                console.log("websocket close, due to url change", socketUrl)
                socket.current.close()
                socket.current = null
                setData(null)
            }
        }
    }, [url])

    useLayoutEffect(() => () => {
        if (socket.current) {
            socket.current.close()
            socket.current = null
        }
    }, [])
    return [data, socket.current]
}

export const authorize = async (dispatch, context) => {
    const token = window.localStorage.getItem('token')
    const account = window.localStorage.getItem('account')
    const role = window.localStorage.getItem('role')
    const mock = new Blob(["unauthorized"])
    const fail = {
        response: new Response(mock, {
            status: 401
        })
    }

    if (!token || !account || !role) {
        dispatch({ type: "status", data: 'unauthorized' })
        throw fail
    }

    // try to get the profile
    try {
        if (context) {
            throw context
        }
        const profileRefresh = await api.get('profile',
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).json()
        window.localStorage.setItem('account', profileRefresh.account)
        window.localStorage.setItem('role', profileRefresh.role)
    } catch (e) {
        if (e && e.response && (e.response.status === 403 || e.response.status === 401)) {
            try {
                // try to refresh the token
                const refreshResponse = await api.put('authorize',
                    {
                        json: {
                            account,
                            token
                        }
                    }).json()
                // retry to get the profile with the new token
                const profileRefresh = await api.get('profile',
                    {
                        headers: {
                            'Authorization': 'Bearer ' + refreshResponse.token
                        }
                    }).json()
                window.localStorage.setItem('account', profileRefresh.account)
                window.localStorage.setItem('token', refreshResponse.token)
                window.localStorage.setItem('role', profileRefresh.role)
            } catch (e) {
                if (e && e.response && e.response.status !== 304) {
                    // refresh token failed, clear everything
                    window.localStorage.setItem('account', '')
                    window.localStorage.setItem('token', '')
                    window.localStorage.setItem('role', '')
                    dispatch({ type: "status", data: "unauthorized" })
                }
                throw e
            }
        }
    }

    if (window.localStorage.getItem('account') === '') {
        dispatch({ type: "status", data: "unauthorized" })
        throw fail
    }
    dispatch({ type: "status", data: "authorized" })
}

export const useAuthorize = (dispatch) => (context) => authorize(dispatch, context)