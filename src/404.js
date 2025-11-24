import React from 'react'
import Box from '@mui/material/Box'
import SnackbarContent from '@mui/material/SnackbarContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import WarningIcon from '@mui/icons-material/Warning'
import CancelIcon from '@mui/icons-material/Cancel'
import { Link } from 'react-router-dom'

const notFound = () => (
    <Box
        sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            padding: 2,
            marginTop: 8,
        }}
    >
        <Box sx={{ maxWidth: 600, width: '100%' }}>
            <SnackbarContent
                sx={{
                    backgroundColor: '#f1932c',
                }}
                action={
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        component={Link}
                        to="/"
                    >
                        <CancelIcon />
                    </IconButton>
                }
                message={
                    <Typography component="p" sx={{ color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WarningIcon sx={{ color: '#f0cf81' }} />
                        Could not find this path {window.location.pathname}.
                    </Typography>
                }
            />
        </Box>
    </Box>
)

export default notFound