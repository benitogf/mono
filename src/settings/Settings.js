import React from 'react'
import { Box, Typography, Skeleton } from '@mui/material'

const Settings = ({ active }) => {
    if (!active) {
        return (
            <Box sx={{
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                opacity: 0.7,
                transition: 'opacity 0.3s ease-in-out'
            }}>
                <Skeleton variant="rectangular" height={200} />
                <Skeleton variant="rectangular" height={100} />
                <Skeleton variant="rectangular" height={100} />
            </Box>
        )
    }

    return (
        <Box sx={{
            padding: 3,
            opacity: 1,
            transition: 'opacity 0.3s ease-in-out'
        }}>
            <Typography variant='h4' gutterBottom>Settings</Typography>
            <Typography variant='body1' paragraph>
                Configure your application settings here.
            </Typography>
            {[...Array(15)].map((_, i) => (
                <Typography key={i} variant='body2' paragraph>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute 
                    irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
                    deserunt mollit anim id est laborum.
                </Typography>
            ))}
        </Box>
    )
}

export default Settings
