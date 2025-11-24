import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import { useTheme } from '@mui/material/styles'

const SettingsDrawer = ({ dispatch, isAuthenticated = false, onClose }) => {
    const [open, setOpen] = useState(false)
    const themeMode = window.localStorage.getItem('lights')
    const [selectedMode, setSelectedMode] = useState(themeMode || 'system')
    const theme = useTheme()

    function handleThemeChange(mode) {
        setSelectedMode(mode)
        window.localStorage.setItem('lights', mode)
        dispatch({ type: 'lights', data: mode === 'on' })
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
                    Do you want to log out?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color='primary'>
                        No
                    </Button>
                    <Button 
                        variant='contained' 
                        component={Link} 
                        {...{ to: '/logout' }}
                        onClick={() => {
                            setOpen(false)
                            if (onClose) onClose()
                        }}
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant='p' sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                        Settings
                    </Typography>
                    {onClose && (
                        <IconButton
                            onClick={onClose}
                            size='small'
                            sx={{ marginRight: -1 }}
                        >
                            <CloseIcon fontSize='small' />
                        </IconButton>
                    )}
                </Box>
                <Divider />
                <List sx={{ flex: 1 }}>
                    <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', gap: 1.5 }}>
                        <Typography variant='body2' sx={{ fontWeight: 500, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                            Mode
                        </Typography>
                        <ButtonGroup fullWidth variant='outlined' size='small' sx={{ 
                            '& .MuiButton-outlined': {
                                borderColor: theme.palette.divider,
                                color: theme.palette.text.primary,
                                '&:hover': {
                                    borderColor: theme.palette.text.primary,
                                    backgroundColor: theme.palette.action.hover
                                }
                            }
                        }}>
                            <Button
                                variant={selectedMode === 'on' ? 'contained' : 'outlined'}
                                onClick={() => handleThemeChange('on')}
                                startIcon={<LightModeIcon sx={{ fontSize: '1rem', verticalAlign: 'middle' }} />}
                                sx={{ 
                                    textTransform: 'none',
                                    fontSize: '0.8125rem',
                                    padding: '6px 8px',
                                    minWidth: 0,
                                    lineHeight: 1.5,
                                    '& .MuiButton-startIcon': {
                                        marginRight: '4px',
                                        marginLeft: '-2px',
                                        marginTop: '-1px',
                                        marginBottom: 0
                                    }
                                }}
                            >
                                Light
                            </Button>
                            <Button
                                variant={selectedMode === 'system' ? 'contained' : 'outlined'}
                                onClick={() => handleThemeChange('system')}
                                startIcon={<SettingsBrightnessIcon sx={{ fontSize: '1rem', verticalAlign: 'middle' }} />}
                                sx={{ 
                                    textTransform: 'none',
                                    fontSize: '0.8125rem',
                                    padding: '6px 8px',
                                    minWidth: 0,
                                    lineHeight: 1.5,
                                    '& .MuiButton-startIcon': {
                                        marginRight: '4px',
                                        marginLeft: '-2px',
                                        marginTop: '-1px',
                                        marginBottom: 0
                                    }
                                }}
                            >
                                System
                            </Button>
                            <Button
                                variant={selectedMode === 'off' ? 'contained' : 'outlined'}
                                onClick={() => handleThemeChange('off')}
                                startIcon={<DarkModeIcon sx={{ fontSize: '1rem', verticalAlign: 'middle' }} />}
                                sx={{ 
                                    textTransform: 'none',
                                    fontSize: '0.8125rem',
                                    padding: '6px 8px',
                                    minWidth: 0,
                                    lineHeight: 1.5,
                                    '& .MuiButton-startIcon': {
                                        marginRight: '4px',
                                        marginLeft: '-2px',
                                        marginTop: '-1px',
                                        marginBottom: 0
                                    }
                                }}
                            >
                                Dark
                            </Button>
                        </ButtonGroup>
                    </ListItem>
                    <Divider />
                </List>
                {isAuthenticated && (
                    <Box sx={{ padding: 2 }}>
                        <Button 
                            variant='contained' 
                            color='error' 
                            fullWidth
                            onClick={() => setOpen(true)}
                        >
                            Logout
                        </Button>
                    </Box>
                )}
            </Box>
        </>
    )
}

export default SettingsDrawer
