import React, { useState } from 'react'
import moment from 'moment'
import { Navigate, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
// import Breadcrumbs from '@mui/material/Breadcrumbs'
import CircularProgress from '@mui/material/CircularProgress'
import MuiAppBar from '@mui/material/AppBar'
import MuiDrawer from '@mui/material/Drawer'
// import Hidden from '@mui/material/Hidden'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import useMediaQuery from '@mui/material/useMediaQuery'
import MenuIcon from '@mui/icons-material/Menu'
import IconButton from '@mui/material/IconButton'
import { useTheme, styled } from '@mui/material/styles'

import View from '../View'
import { useSubscribe } from '../api'
import Menu from './Menu'
import Router from './Router'

const drawerWidth = 240

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

const DateDisplay = ({ time }) => moment.unix(time / 1000000000).format('dddd, MMMM Do Y LTS')

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: !open ? theme.zIndex.drawer + 1 : 'inherit',
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}))

const Dashboard = ({ status, authorize, dispatch }) => {
    const theme = useTheme()
    const location = useLocation()
    const mobile = useMediaQuery(theme.breakpoints.down('sm'))

    const [time, timeSocket] = useSubscribe(null)
    const active = timeSocket && timeSocket.readyState === WebSocket.OPEN

    const [menuOpen, setMenuOpen] = useState(false)

    // const pathname = location.pathname.split('/')
    // const isDashboard = pathname.length === 2
    // const isPoint = pathname.length === 4 && pathname[2] === 'point'
    // const isVideos = pathname.length === 3 && pathname[2] === 'videos'
    // const isSettings = pathname.length === 3 && pathname[2] === 'settings'

    if (status === 'unauthorized') {
        return <Navigate to='/login' />
    }

    return <>
        <AppBar open={menuOpen}>
            <Toolbar >
                {!menuOpen && (
                    <IconButton
                        sx={{
                            color: 'white',
                        }}
                        onTouchStart={() => {
                            setMenuOpen(true)
                        }}
                        onClick={() => {
                            setMenuOpen(true)
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box></Box>
                    <Box sx={{
                        fontSize: '0.9em',
                        maxWidth: '14em',
                        textAlign: 'end'
                    }}>
                        {active && time ? <DateDisplay time={time} /> : <CircularProgress size={24} />}
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>

        <Drawer variant={'permanent'} open={menuOpen} style={{ position: 'absolute' }}>
            <Menu location={location} setOpen={setMenuOpen} open={menuOpen} />
        </Drawer>
        <Container
            maxWidth={'xl'}
            style={{ overflow: 'hidden', paddingLeft: 56, marginTop: mobile ? 56 : 64 }}
            disableGutters={true}
        >
            <Box component='main' sx={View(menuOpen, theme)} style={{
                background: theme.palette.mode === 'light' ? '#fafafa' : '#2a2a2a',
                height: '100%'
            }}>
                <Router dispatch={dispatch} authorize={authorize} />
            </Box>
        </Container>
    </>
}

export default Dashboard
