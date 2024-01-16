import React, { memo, useState } from 'react'
import { ClickAwayListener } from '@mui/base/ClickAwayListener'
import { NavLink, useLocation } from 'react-router-dom'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import SettingsIcon from '@mui/icons-material/Settings'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    menu: {
        padding: 0,
    },
    title: {
        fontStyle: 'italic',
        fontWeight: '100',
        fontVariant: 'small-caps',
        flex: 1,
        padding: '0.37em 0',
    },
    logo: {
        height: 20,
        verticalAlign: 'middle',
        marginRight: 34,
        marginLeft: 1
    },
}))

export default memo(({ open, setOpen }) => {
    const location = useLocation()
    const styles = useStyles()
    const lights = window.localStorage.getItem('lights') === 'on'
    const pathname = location.pathname.split('/')
    const isVideos = pathname.length > 2 && pathname[2] === 'videos'
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
                <List className={styles.menu}>
                    <ListItem>
                        <Typography className={styles.title} variant='h5' component='h3'>
                            <img alt='logo' className={styles.logo} src={filePath + '/logo.png'}></img>
                        </Typography>
                    </ListItem>


                    <Divider />

                    <ListItemButton
                        component={NavLink}
                        onClick={() => setOpen(false)}
                        {...{
                            disableTouchRipple: true,
                            activestyle,
                            to: '/dashboard/videos',
                            selected: isVideos,
                        }}
                    >
                        <ListItemIcon>{<PlayCircleIcon />}</ListItemIcon>
                        <ListItemText primary={'Videos'} />
                    </ListItemButton>


                    <Divider />

                    <ListItemButton
                        component={NavLink}
                        onClick={() => setOpen(false)}
                        {...{
                            disableTouchRipple: true,
                            to: '/dashboard/settings',
                            activestyle,
                            selected: isSettings,
                        }}
                    >
                        <ListItemIcon>{<SettingsIcon />}</ListItemIcon>
                        <ListItemText primary={'Settings'} />
                    </ListItemButton>

                    <Divider />
                </List>
            </Box>
        </Box>
    </ClickAwayListener>
    )
})
