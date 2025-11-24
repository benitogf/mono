import React, { useReducer, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { blue } from '@mui/material/colors'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Drawer from '@mui/material/Drawer'
import LinearProgress from '@mui/material/LinearProgress'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

import R404 from './404'
import { useAuthorize, useSubscribe } from './api'
import Login from './auth/Login'
import Logout from './auth/Logout'
import Setup from './auth/Setup'
import AutoLogout from './AutoLogout'
import { autoLogoutTime } from './config'
import Dashboard from './dashboard/Dashboard'
import Navbar from './nav/Navbar'
import SettingsDrawer from './nav/SettingsDrawer'

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
    const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    
    const [time, timeSocket] = useSubscribe(null)
    const socketActive = timeSocket && timeSocket.readyState === WebSocket.OPEN
    const [active, setActive] = useState(false)
    const [minLoadTimePassed, setMinLoadTimePassed] = useState(false)

    // Minimum loading time of 500ms to prevent jumpy transitions
    useEffect(() => {
        const timer = setTimeout(() => {
            setMinLoadTimePassed(true)
        }, 500)
        return () => clearTimeout(timer)
    }, [])

    // Only set active to true after both socket is connected AND minimum time has passed
    useEffect(() => {
        if (socketActive && minLoadTimePassed) {
            setActive(true)
        } else if (!socketActive) {
            setActive(false)
        }
    }, [socketActive, minLoadTimePassed])

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
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        // Scrollbar styles for Webkit browsers (Chrome, Safari, Edge)
                        '&::-webkit-scrollbar': {
                            width: '12px',
                            height: '12px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: !lights ? '#1e1e1e' : '#f1f1f1',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: !lights ? '#555' : '#888',
                            borderRadius: '6px',
                            '&:hover': {
                                background: !lights ? '#777' : '#555',
                            },
                        },
                        // Scrollbar styles for all scrollable elements
                        '& *::-webkit-scrollbar': {
                            width: '12px',
                            height: '12px',
                        },
                        '& *::-webkit-scrollbar-track': {
                            background: !lights ? '#1e1e1e' : '#f1f1f1',
                        },
                        '& *::-webkit-scrollbar-thumb': {
                            background: !lights ? '#555' : '#888',
                            borderRadius: '6px',
                            '&:hover': {
                                background: !lights ? '#777' : '#555',
                            },
                        },
                        // Firefox scrollbar
                        scrollbarWidth: 'thin',
                        scrollbarColor: !lights ? '#555 #1e1e1e' : '#888 #f1f1f1',
                    },
                },
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
                <Box sx={{ 
                    height: '100%', 
                    width: '100%',
                    backgroundColor: theme.palette.background.default 
                }}>
                    <LinearProgress 
                        sx={{ 
                            position: 'fixed', 
                            top: 0, 
                            left: 0, 
                            right: 0,
                            zIndex: (theme) => theme.zIndex.drawer + 3
                        }} 
                    />
                </Box>
            </ThemeProvider>
        )
    }

    const isAuthenticated = status === 'authorized'

    const routes = () => {
        return <Routes>
            <Route exact path='/' element={<Login isAuthenticated={isAuthenticated} authorize={authorize} />} />
            <Route exact path='/logout' element={<Logout dispatch={dispatch} />} />
            <Route exact path='/login' element={<Login isAuthenticated={isAuthenticated} authorize={authorize} />} />
            <Route exact path='/setup' element={<Setup isAuthenticated={isAuthenticated} authorize={authorize} />} />
            <Route
                path='/dashboard/*'
                element={<Dashboard isAuthenticated={isAuthenticated} active={active} time={time} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />}
            />
            <Route path='*' element={<R404 />} />
        </Routes>
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ 
                height: '100%', 
                width: '100%',
                backgroundColor: theme.palette.background.default 
            }}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                        <BrowserRouter>
                            {/* Unified Navbar - always rendered */}
                            <Navbar 
                                isAuthenticated={isAuthenticated}
                                active={active}
                                menuOpen={menuOpen}
                                onMenuOpen={() => setMenuOpen(true)}
                                onSettingsClick={() => setSettingsDrawerOpen(true)}
                            />
                            {routes()}
                            
                            {/* Global Settings Drawer */}
                            <Drawer
                                anchor='right'
                                open={settingsDrawerOpen}
                                onClose={() => setSettingsDrawerOpen(false)}
                                sx={{
                                    zIndex: (theme) => theme.zIndex.drawer + 2,
                                    '& .MuiDrawer-paper': {
                                        zIndex: (theme) => theme.zIndex.drawer + 2,
                                    }
                                }}
                            >
                                <SettingsDrawer dispatch={dispatch} isAuthenticated={isAuthenticated} onClose={() => setSettingsDrawerOpen(false)} />
                            </Drawer>
                        </BrowserRouter>
                </LocalizationProvider>
            </Box>
        </ThemeProvider>
    )
}

export default App
