import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'

const Settings = ({ dispatch }) => {
    const [open, setOpen] = useState(false)
    const [lights, setLights] = useState(window.localStorage.getItem('lights') === 'on')
    const account = window.localStorage.getItem('account')

    const theme = useTheme()

    function handleChange(checked) {
        window.localStorage.setItem('lights', checked ? 'on' : 'off')
        dispatch({ type: 'lights', data: checked })
        setLights(checked)
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle id='alert-dialog-title'>
                    Log out of <b>{account}</b> account?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color='primary'>
                        No
                    </Button>
                    <Button variant='contained' component={Link} {...{ to: '/logout' }}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            <Box
                sx={{
                    height: '100%',
                    background: theme.palette.mode === 'light' ? '#f1f1f1' : '#424242',
                    colorScheme: theme.palette.mode === 'light' ? 'light' : 'dark',
                    overflow: 'auto',
                    padding: '2rem',
                }}
            >
                <Paper sx={{ padding: '2rem' }} elevation={0}>
                    <Box width='100%' display='flex' flexDirection='column' gap='2rem'>
                        <Box
                            component='label'
                            width='100%'
                            display='flex'
                            alignItems='center'
                            justifyContent='space-between'
                            gap='2rem'
                        >
                            <Typography>Light mode</Typography>
                            <Switch
                                checked={lights}
                                onChange={(e) => handleChange(e.target.checked)}
                                inputProps={{ 'aria-label': 'theme-switch' }}
                            />
                        </Box>

                        <Box>
                            <Button variant='contained' color='error' onClick={() => setOpen(true)}>
                                Logout
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </>
    )
}

export default Settings
