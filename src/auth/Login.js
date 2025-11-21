import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import WarningIcon from '@mui/icons-material/Warning'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import SnackbarContent from '@mui/material/SnackbarContent'
import { useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { LinearProgress } from '@mui/material'

import { api } from '../api'

const Login = ({ status, authorize }) => {
    const theme = useTheme()

    const [rootAvailable, setRootAvailable] = useState(null)
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [failType, setFailType] = useState('')

    const checkRoot = async () => {
        if (rootAvailable === null) {
            try {
                await api.get('available?account=root')
                setRootAvailable(true)
            } catch (e) {
                setRootAvailable(false)
            }
        }
    }

    checkRoot()

    const login = async () => {
        if (password !== '') {
            setLoading(true)
            setError(false)
            setFailType('')

            try {
                const response = await api
                    .post('authorize', {
                        json: {
                            account: 'root',
                            password,
                        },
                    })
                    .json()
                window.localStorage.setItem('account', 'root')
                window.localStorage.setItem('token', response.token)
                window.localStorage.setItem('role', response.role)
                await authorize()
            } catch (e) {
                const statusCode = await e.response.status
                switch (statusCode) {
                    case 403:
                        setFailType('wrongPwd')
                        break
                    default:
                        setFailType('')
                }
                console.warn('nope', e)
                setPassword('')
                setLoading(false)
                setError(true)
            }
        } else if (password === '') {
            setError(true)
            setFailType('emptyPwd')
        }
    }

    const getHelperText = (failType) => {
        let error
        switch (failType) {
            case 'emptyPwd':
                error = 'Please enter password.'
                break
            case 'wrongPwd':
                error = 'Wrong password.'
                break
            default:
                error = ''
        }
        return error
    }

    if (status === 'authorized') {
        return <Navigate to='/dashboard' />
    }

    if (rootAvailable) {
        return <Navigate to='/setup' />
    }

    if (rootAvailable === null) {
        return <LinearProgress />
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
                backgroundColor: theme.palette.mode === 'light' ? '#edf2f4' : '#4f4f4f',
            }}
        >
            <Toolbar />

            <Card
                sx={{
                    marginTop: '5rem',
                    minWidth: '22.5rem',
                }}
            >
                <AppBar position='static' color='default' elevation={0}>
                    <Toolbar variant='dense'>
                        <Typography component='h4'>Log in</Typography>
                    </Toolbar>
                </AppBar>

                <CardContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '.5rem',
                    }}
                >
                    {error && !loading && (
                        <SnackbarContent
                            sx={{
                                maxWidth: 'unset',
                                marginBottom: '10px',
                                backgroundColor: '#f1932c',
                            }}
                            message={
                                <Box display='flex' alignItems='center' gap='.5rem'>
                                    <WarningIcon sx={{ color: '#f0cf81' }} />
                                    <Typography
                                        sx={{
                                            fontSize: '0.96em',
                                            fontWeight: 100,
                                            lineHeight: 2,
                                            color: 'white',
                                        }}
                                    >
                                        {failType === '' ? 'Unable to authorize' : 'Login failed'}
                                    </Typography>
                                </Box>
                            }
                        />
                    )}

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
                                error={error && (failType === 'emptyPwd' || failType === 'wrongPwd')}
                                helperText={
                                    error &&
                                    (failType === 'emptyPwd' || failType === 'wrongPwd') &&
                                    getHelperText(failType)
                                }
                            />
                            <Button
                                type='submit'
                                variant='contained'
                                color='primary'
                                disabled={loading || password === ''}
                                onClick={login}
                            >
                                {loading ? 'Loading...' : 'Log in'}
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    )
}

export default Login
