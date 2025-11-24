import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme, styled } from '@mui/material/styles'

import Menu from './Menu'
import Router, { getCurrentSection } from './Router'
import Footer from './Footer'

const drawerWidth = 240

const View = (theme) => ({
    color: 'text.primary',
    p: 0,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    })
})

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
})

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
})

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    }),
}))

const Dashboard = ({ isAuthenticated, active, time, menuOpen, setMenuOpen }) => {
    const theme = useTheme()
    const location = useLocation()
    const mobile = useMediaQuery(theme.breakpoints.down('sm'))

    const currentSection = getCurrentSection(location.pathname)

    if (!isAuthenticated) {
        return <Navigate to='/login' />
    }

    return <>
        <Drawer variant={'permanent'} open={menuOpen}>
            <Menu location={location} setOpen={setMenuOpen} open={menuOpen} currentSection={currentSection} active={active} />
        </Drawer>

        <Box
            sx={{
                paddingLeft: '56px',
                marginTop: mobile ? '56px' : '64px',
                height: mobile ? 'calc(100vh - 56px - 48px)' : 'calc(100vh - 64px - 48px)',
                overflow: 'auto'
            }}
        >
            <Box
                component='main'
                sx={{
                    ...View(theme),
                    maxWidth: '1920px',
                    margin: '0 auto',
                    background: theme.palette.background.default,
                    minHeight: '100%'
                }}
            >
                <Router active={active} />
            </Box>
        </Box>
        <Footer time={time} active={active} />
    </>
}

export default Dashboard
