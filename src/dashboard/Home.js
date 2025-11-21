import React from 'react'
import { Box, Typography } from '@mui/material'
import { Navigate } from 'react-router-dom'

const Home = () => {
    return <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    }}>
        <Typography variant='h4'>Home</Typography>
    </Box>
}

export default Home