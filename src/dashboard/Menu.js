import React, { memo, useState } from 'react'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { NavLink } from 'react-router-dom'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { routes } from './Router'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Skeleton from '@mui/material/Skeleton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Box, useTheme } from '@mui/material'

export default memo(({ open, setOpen, currentSection, active }) => {
    const theme = useTheme()

    // Style function for active NavLink
    const getNavLinkStyle = ({ isActive }) => ({
        backgroundColor: isActive ? theme.palette.action.selected : 'transparent',
    })

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

    return (<ClickAwayListener
        onClickAway={() => {
            if (openDone) {
                setOpen(false)
            }
        }}
    >
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between', 
            height: '100%'
        }}>
            <Box>
                <List sx={{ padding: 0 }}>
                    <ListItem sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        minHeight: 56,
                        [theme.breakpoints.up('sm')]: {
                            minHeight: 64,
                        }
                    }}>
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

                    {routes.map((route) => {
                        const Icon = route.icon
                        return (
                            <React.Fragment key={route.key}>
                                <Box
                                    sx={{
                                        opacity: active ? 1 : 0.7,
                                        transition: 'opacity 0.3s ease-in-out',
                                    }}
                                >
                                    {active ? (
                                        <ListItemButton
                                            component={NavLink}
                                            onClick={() => setOpen(false)}
                                            to={`/dashboard${route.path}`}
                                            style={getNavLinkStyle}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <ListItemIcon><Icon /></ListItemIcon>
                                            <ListItemText 
                                                primary={route.section}
                                                slotProps={{
                                                    primary: {
                                                        sx: { textTransform: 'uppercase' }
                                                    }
                                                }}
                                            />
                                        </ListItemButton>
                                    ) : (
                                        <ListItem>
                                            <ListItemIcon>
                                                <Skeleton variant="circular" width={24} height={24} />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary={<Skeleton variant="text" width="60%" />}
                                            />
                                        </ListItem>
                                    )}
                                </Box>
                                <Divider />
                            </React.Fragment>
                        )
                    })}
                </List>
            </Box>
        </Box>
    </ClickAwayListener>
    )
})
