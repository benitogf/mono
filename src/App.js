import React, { useReducer } from 'react'
import { HashRouter, BrowserRouter, Routes, Route } from 'react-router-dom'
import { blue } from '@mui/material/colors'
import LinearProgress from '@mui/material/LinearProgress'
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

import R404 from './404'
import { useAuthorize } from './api'
import Login from './auth/Login'
import Logout from './auth/Logout'
import Setup from './auth/Setup'
import AutoLogout from './AutoLogout'
import { autoLogoutTime } from './config'
import Dashboard from './dashboard/Dashboard'
import Nav from './home/Nav'

const reducer = (state, action) => {
    switch (action.type) {
        case 'lights':
            return {
                ...state,
                lights: action.data,
            }
        case 'status':
            return {
                ...state,
                status: action.data,
            }
        default:
            throw new Error()
    }
}

const App = () => {
    const account = window.localStorage.getItem('account')
    const role = window.localStorage.getItem('role')
    const [state, dispatch] = useReducer(reducer, {
        lights: window.localStorage.getItem('lights') === 'on',
        status: null,
    })
    const authorize = useAuthorize(dispatch)
    const { lights, status } = state

    const timer = AutoLogout(autoLogoutTime, status === 'authorized')
    window.onstorage = async () => {
        const newLights = window.localStorage.getItem('lights') === 'on'
        const newAccount = window.localStorage.getItem('account')
        const newRole = window.localStorage.getItem('role')
        if (newLights !== lights) {
            dispatch({
                type: 'lights',
                data: newLights,
            })
        }
        if (newAccount !== account || newRole !== role) {
            try {
                await authorize()
            } catch (e) {
                console.warn(e)
            }
        }
    }

    const theme = createTheme({
        palette: {
            mode: !lights ? 'dark' : 'light',
            primary: {
                main: blue[500],
            },
            secondary: {
                main: blue[900],
            },
        },
        breakpoints: {
            values: {
                xs: 0,
                s: 375,
                sm: 675,
                md: 960,
                lg: 1560,
                xl: 1920,
            },
        },
        typography: { useNextVariants: true },
    })

    if (!status) {
        ; (async () => {
            try {
                await authorize()
            } catch (e) {
                console.warn(e)
            }
        })()
    }

    if (timer === 'out' && status === 'authorized') {
        window.localStorage.setItem('account', '')
        window.localStorage.setItem('token', '')
        window.location.reload()
        return null
    }

    if (!status && account !== '') {
        return (
            <ThemeProvider theme={theme}>
                <LinearProgress />
            </ThemeProvider>
        )
    }

    const isFileProto = window.location.protocol === 'file:'

    const routes = () => {
        return <>{status !== 'authorized' && <Nav />}
            <Routes>
                <Route exact path='/' element={<Login status={status} authorize={authorize} />} />
                <Route exact path='/logout' element={<Logout dispatch={dispatch} />} />
                <Route exact path='/login' element={<Login status={status} authorize={authorize} />} />
                <Route exact path='/setup' element={<Setup status={status} authorize={authorize} />} />
                <Route
                    path='/dashboard/*'
                    element={<Dashboard status={status} authorize={authorize} dispatch={dispatch} />}
                />
                <Route component={R404} />
            </Routes>
        </>
    }

    return (
        <ThemeProvider theme={theme}>
            <StyledEngineProvider injectFirst>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    {isFileProto && <HashRouter>
                        {routes()}
                    </HashRouter>}
                    { }
                    {!isFileProto && <BrowserRouter>
                        {routes()}
                    </BrowserRouter>}
                </LocalizationProvider>
            </StyledEngineProvider>
        </ThemeProvider>
    )
}

export default App
