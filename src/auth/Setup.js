import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import InfoIcon from '@mui/icons-material/Info'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'
import SnackbarContent from '@mui/material/SnackbarContent'
import TextField from '@mui/material/TextField'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

import { api } from '../api'

const Setup = ({ isAuthenticated, authorize }) => {
    const theme = useTheme()
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [failType, setFailType] = useState('')
    const [fetched, setFetched] = useState(null)

    const signup = async () => {
        // Validate password
        if (password === '') {
            setError(true)
            setFailType('emptyPwd')
            return
        }

        if (password.length < 3 || password.length > 88) {
            setError(true)
            setFailType('invalidPwd')
            return
        }

        setError(false)
        setLoading(true)

        try {
            const response = await api.post('register', {
                json: {
                    account: 'root',
                    password,
                    name: 'root',
                }
            }).json()
            window.localStorage.setItem('account', 'root')
            window.localStorage.setItem('token', response.token)
            window.localStorage.setItem('role', 'root')
            await authorize()
        } catch (e) {
            if (!e.response) {
                setFailType('networkError')
            } else {
                setFailType('serverError')
            }
            setError(true)
            setLoading(false)
        }
    }

    const checkRoot = async () => {
        if (fetched === null) {
            try {
                await api.get('available?account=root')
                setFetched(true)
            } catch (e) {
                setFetched(false)
            }
        }
    }

    checkRoot()

    const getHelperText = (failType) => {
        let error = ''
        switch (failType) {
            case 'emptyPwd':
                error = 'Password is required.'
                break
            case 'invalidPwd':
                error = 'Password must have between 3 and 88 characters.'
                break
            case 'serverError':
                error = 'Something went wrong. Please try again.'
                break
            case 'networkError':
                error = 'Cannot connect to server.'
                break
            default:
                error = ''
        }
        return error
    }

    if (fetched === null) {
        return (
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
        )
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" />
    }

    if (fetched === false) {
        return <Navigate to="/dashboard" />
    }

    return (
        <Box
            component='main'
            sx={{
                width: '100%',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: theme.palette.background.default,
            }}
        >
            <Toolbar />

            <Card
                sx={{
                    marginTop: '5rem',
                    minWidth: '22.5rem',
                }}
            >
                <AppBar 
                    position='static' 
                    elevation={0}
                    sx={{
                        backgroundColor: theme.palette.action.hover,
                    }}
                >
                    <Toolbar variant='dense'>
                        <Typography component='h4' sx={{ color: theme.palette.text.primary }}>Setup</Typography>
                    </Toolbar>
                </AppBar>
                <CardContent>
                    <SnackbarContent
                        sx={{
                            maxWidth: 'unset',
                            marginBottom: '10px',
                            backgroundColor: theme.palette.info.main,
                        }}
                        message={
                            <Box display='flex' alignItems='center' gap='.5rem'>
                                <InfoIcon />
                                <Typography sx={{ fontSize: '0.96em', lineHeight: 2, fontWeight: 100 }}>
                                    In order to access the system you must create a password
                                </Typography>
                            </Box>
                        }
                    />
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                        }}
                        noValidate
                        autoComplete='off'
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                            }}
                        >
                            <TextField
                                required
                                InputLabelProps={{ shrink: true }}
                                size='small'
                                id='password'
                                label='Password'
                                type='password'
                                fullWidth
                                margin='dense'
                                variant='outlined'
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                disabled={loading}
                                error={error && (failType === 'emptyPwd' || failType === 'invalidPwd' || failType === 'serverError' || failType === 'networkError')}
                                helperText={
                                    error &&
                                    (failType === 'emptyPwd' || failType === 'invalidPwd' || failType === 'serverError' || failType === 'networkError') &&
                                    getHelperText(failType)
                                }
                            />
                            <Button
                                type='submit'
                                variant='contained'
                                color='primary'
                                disabled={loading || password === ''}
                                onClick={signup}
                            >
                                {loading ? 'Loading...' : 'Create password'}
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    )
}

export default Setup