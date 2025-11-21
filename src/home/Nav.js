import React from 'react'
import { Link } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/material'

const Nav = () => {
    const filePath = window.location.protocol === 'file:' ? window.location.pathname.replace('index.html', '') : ''
    return (
        <AppBar component='nav' sx={{ boxShadow: 'none' }}>
            <Toolbar>
                <Link to={'/'} style={{ textDecoration: 'none' }}>
                    <Typography
                        variant='h6'
                        component='div'
                        sx={{
                            flexGrow: 1,
                            fontStyle: 'italic',
                            fontWeight: '100',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        <Box
                            component='img'
                            alt='logo'
                            src={filePath + '/logo.png'}
                            sx={{
                                height: 20,
                                verticalAlign: 'middle',
                                marginRight: '34px',
                                marginLeft: '1px',
                            }}
                        />
                    </Typography>
                </Link>
            </Toolbar>
        </AppBar>
    )
}

export default Nav
