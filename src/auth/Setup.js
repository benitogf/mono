import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import InfoIcon from '@mui/icons-material/Info'
import WarningIcon from '@mui/icons-material/Warning'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import SnackbarContent from '@mui/material/SnackbarContent'
import TextField from '@mui/material/TextField'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'

import { api } from '../api'
import { validate } from '../forms'

const setupStyles = makeStyles((theme) => ({
    container: {
        flex: 1,
        width: 'inherit',
        margin: 0,
        padding: 0,
        background: 'transparent'
    },
    card: {
        maxWidth: '400px',
        margin: '84px auto'
    },
    warning: {
        backgroundColor: '#f1932c',
        maxWidth: 'unset',
        marginBottom: 10
    },
    fail: {
        backgroundColor: 'brown',
        maxWidth: 'unset',
        marginBottom: 10
    },
    warningText: {
        color: 'white',
        fontSize: '0.96em',
        lineHeight: 2,
        fontWeight: 100
    },
    warningIcon: {
        verticalAlign: "bottom",
        color: "#f0cf81"
    },
    formButton: {
        marginTop: "20px"
    },
    formButtonWrapper: {
        position: 'relative',
    },
    formProgress: {
        position: 'absolute',
        top: '67%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    }
}))

const Setup = ({ status, authorize }) => {
    const styles = setupStyles()
    const [password, setPassword] = useState('')
    const [fail, setFail] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [fetched, setFetched] = useState(null)

    const fields = {
        password: {
            error: () => password.length < 3 || password.length > 88,
            message: 'password must have between 3 and 88 characters'
        },
    }

    const signup = async () => {
        setSubmitted(true)
        if (!validation.error) {
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
                setFail(`Something went wrong (${e && e.response ? await e.response.text() : 'unable to connect to the server'})`)
                setLoading(false)
            }
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

    const validation = validate(fields)

    if (fetched === null) {
        return <LinearProgress style={{
            flex: 1,
            marginTop: '89px',
        }} />
    }

    if (status === 'authorized') {
        return <Navigate to="/dashboard" />
    }

    if (fetched === false) {
        return <Navigate to="/dashboard" />
    }

    return <Grid className={styles.container} container spacing={4}>
        <Grid item sm={6} sx={{ display: { xs: 'none', sm: 'block' } }}>
        </Grid>
        <Grid item xs={12} sm={6}>
            <Card className={styles.card}>
                <AppBar position="static" color="default" elevation={0}>
                    <Toolbar variant="dense">
                        <Typography component="h4">
                            Setup
                        </Typography>
                    </Toolbar>
                </AppBar>
                <CardContent>
                    {fail && !loading && (
                        <SnackbarContent className={styles.fail}
                            message={(
                                <Typography component="p" className={styles.warningText}>
                                    <WarningIcon className={styles.warningIcon} /> {fail}
                                </Typography>
                            )}
                        />
                    )}
                    {validation.error && submitted && (
                        <SnackbarContent className={styles.warning}
                            message={(Object.keys(validation.errors).map((error, key) => validation.errors[error] !== '' ? (
                                <Typography key={key} component="p" className={styles.warningText}>
                                    <WarningIcon className={styles.warningIcon} /> {validation.errors[error]}
                                </Typography>) : null)
                            )}
                        />
                    )}
                    <SnackbarContent
                        style={{
                            backgroundColor: 'rgb(96 96 96)',
                            maxWidth: 'unset',
                        }}
                        action={[]}
                        message={(
                            <Typography component="p" style={{ color: '#c3c3c3' }}>
                                <InfoIcon style={{ verticalAlign: "bottom", color: "rgb(197 206 207)" }} />
                                In order to access the system you must create a password
                            </Typography>
                        )}
                    />
                    <form onSubmit={(e) => { e.preventDefault() }}
                        noValidate
                        autoComplete="off">
                        <TextField
                            required
                            InputLabelProps={{ shrink: true }}
                            margin="dense"
                            id="password"
                            label="password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            disabled={loading}
                            error={fields.password.error() && submitted}
                        />
                        <div className={styles.formButtonWrapper}>
                            <Button className={styles.formButton}
                                variant="contained"
                                fullWidth
                                type="submit"
                                color="primary"
                                disabled={loading}
                                onClick={signup}>
                                Create password
                            </Button>
                            {loading && <CircularProgress size={24} className={styles.formProgress} />}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </Grid>
    </Grid>
}

export default Setup