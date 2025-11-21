import React, { memo, useState } from 'react'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { NavLink, useLocation } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import SettingsIcon from '@mui/icons-material/Settings'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/material'

export default memo(({ open, setOpen, currentSection }) => {
    const location = useLocation()
    const lights = window.localStorage.getItem('lights') === 'on'
    const pathname = location.pathname.split('/')
    const isHome = pathname.length > 2 && pathname[2] === 'home'
    const isSettings = pathname.length > 2 && pathname[2] === 'settings'

    const activeLink = lights ? '#efefef' : 'rgb(88, 88, 88)'
    // https://reacttraining.com/react-router/web/api/NavLink
    // this trigers a re-render on each time tick
    // disabling for now
    const activestyle = {
        background: activeLink,
    }

    // const NavLinkRef = forwardRef((props, ref) => <NavLink {...props} ref={ref} />)

    // handle propagation
    // from the click event on the hamburger triggering the click on the chevron
    // not good but idk wtf
    const [openDoneStarted, setOpenDoneStarted] = useState(false)
    const [openDone, setOpenDone] = useState(false)

    if (open && !openDone && !openDoneStarted) {
        setOpenDoneStarted(true)
        setTimeout(() => {
            if (open) {
                setOpenDone(true)
            }
        }, 400)
    }

    if (!open && openDone) {
        setOpenDoneStarted(false)
        setOpenDone(false)
    }

    const filePath = window.location.protocol === 'file:' ? window.location.pathname.replace('index.html', '') : ''
    return (<ClickAwayListener
        onClickAway={() => {
            if (openDone) {
                setOpen(false)
            }
        }}
    >
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <Box>
                <List sx={{ padding: 0 }}>
                    <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 64 }}>
                        <Typography 
                            sx={{ 
                                fontWeight: 700, 
                                fontSize: '1.1rem', 
                                marginLeft: 2, 
                                textTransform: 'uppercase',
                                opacity: open ? 1 : 0,
                                transition: 'opacity 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {currentSection}
                        </Typography>
                        <IconButton 
                            onClick={() => setOpen(false)}
                            sx={{
                                opacity: open ? 1 : 0,
                                transition: 'opacity 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
                                pointerEvents: open ? 'auto' : 'none',
                            }}
                        >
                            <ChevronLeftIcon />
                        </IconButton>
                    </ListItem>
                    <Divider />

                    <ListItemButton
                        component={NavLink}
                        onClick={() => setOpen(false)}
                        sx={{ cursor: 'pointer' }}
                        {...{
                            disableTouchRipple: true,
                            activestyle,
                            to: '/dashboard/home',
                            selected: isHome,
                        }}
                    >
                        <ListItemIcon>{<HomeIcon />}</ListItemIcon>
                        <ListItemText 
                            primary={'Home'} 
                            primaryTypographyProps={{ sx: { textTransform: 'uppercase' } }}
                        />
                    </ListItemButton>


                    <Divider />

                    <ListItemButton
                        component={NavLink}
                        onClick={() => setOpen(false)}
                        sx={{ cursor: 'pointer' }}
                        {...{
                            disableTouchRipple: true,
                            to: '/dashboard/settings',
                            activestyle,
                            selected: isSettings,
                        }}
                    >
                        <ListItemIcon>{<SettingsIcon />}</ListItemIcon>
                        <ListItemText 
                            primary={'Settings'} 
                            primaryTypographyProps={{ sx: { textTransform: 'uppercase' } }}
                        />
                    </ListItemButton>

                    <Divider />
                </List>
            </Box>
        </Box>
    </ClickAwayListener>
    )
})
